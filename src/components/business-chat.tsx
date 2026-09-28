"use client";

import { useEffect, useRef, useState } from "react";
import { AppIcon } from "@/components/app-icon";
import { BrandLogo } from "@/components/brand-logo";
import { postJson } from "@/lib/xhr-client";
import { siteConfig } from "@/lib/config";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Qualification = {
  language: "pt" | "en";
  country: string;
  countryConfidence: "confirmed" | "probable" | "unknown";
  goal: string;
  budgetRange: string;
  regionInterest: string;
  timeline: string;
};

type ChatResponse = {
  reply: string;
  escalate: boolean;
  handoff_reason?: string;
  contact_intent?: boolean;
  offer_contact?: boolean;
  related_property_slug?: string;
  related_property_name?: string;
  qualification?: {
    language?: "pt" | "en";
    country?: string;
    country_confidence?: "confirmed" | "probable" | "unknown";
    goal?: string;
    budget_range?: string;
    region_interest?: string;
    timeline?: string;
  };
};

type StoredChat = {
  messages: ChatMessage[];
  profile: Qualification;
  offerContact: boolean;
  showContactForm: boolean;
  relatedPropertySlug: string;
  relatedPropertyName: string;
  expiresAt: number;
};

const STORAGE_KEY = "hope-business-chat-v3";
const SESSION_TTL = 12 * 60 * 60 * 1000;

function emptyProfile(language: "pt" | "en" = "pt"): Qualification {
  return {
    language,
    country: "",
    countryConfidence: "unknown",
    goal: "",
    budgetRange: "",
    regionInterest: "",
    timeline: "",
  };
}

function greeting(language: "pt" | "en"): ChatMessage[] {
  return [
    {
      role: "assistant",
      content:
        language === "en"
          ? "Hi! I'm Hope Business's virtual assistant. I can help you find properties in Brazil and understand what makes sense for your profile. What are you looking for?"
          : "Olá! Sou o assistente virtual da Hope Business. Posso ajudar você a encontrar imóveis no Brasil e entender o que faz sentido para o seu perfil. O que você está procurando?",
    },
  ];
}

function RichMessage({ text }: { text: string }) {
  const pattern =
    /\[([^\]]+)\]\((\/[^)]+|https?:\/\/[^)]+)\)|(https?:\/\/[^\s]+)|(\/imoveis\/[a-zA-Z0-9-_]+)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    const label = match[1] || match[3] || match[4];
    const href = match[2] || match[3] || match[4];
    const external = href.startsWith("http");

    nodes.push(
      <a
        className="chat-inline-link"
        href={href}
        key={`${href}-${match.index}`}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {label}
      </a>
    );

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));

  return <>{nodes}</>;
}

function browserContext() {
  const locale = navigator.language || "pt-BR";
  const regionMatch = locale.match(/-([A-Z]{2})$/i);

  return {
    locale,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    countryCodeHint: regionMatch?.[1]?.toUpperCase() || "",
  };
}

export function BusinessChat() {
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(greeting("pt"));
  const [profile, setProfile] = useState<Qualification>(emptyProfile());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [offerContact, setOfferContact] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [relatedPropertySlug, setRelatedPropertySlug] = useState("");
  const [relatedPropertyName, setRelatedPropertyName] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadWhatsapp, setLeadWhatsapp] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSaving, setLeadSaving] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const isEnglish = profile.language === "en";

  useEffect(() => {
    const detectedLanguage: "pt" | "en" =
      navigator.language?.toLowerCase().startsWith("en") ? "en" : "pt";

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const stored = JSON.parse(raw) as StoredChat;

        if (stored.expiresAt > Date.now() && stored.messages?.length) {
          setMessages(stored.messages);
          setProfile(stored.profile || emptyProfile(detectedLanguage));
          setOfferContact(Boolean(stored.offerContact));
          setShowContactForm(Boolean(stored.showContactForm));
          setRelatedPropertySlug(stored.relatedPropertySlug || "");
          setRelatedPropertyName(stored.relatedPropertyName || "");
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
          setProfile(emptyProfile(detectedLanguage));
          setMessages(greeting(detectedLanguage));
        }
      } else {
        setProfile(emptyProfile(detectedLanguage));
        setMessages(greeting(detectedLanguage));
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      setProfile(emptyProfile(detectedLanguage));
      setMessages(greeting(detectedLanguage));
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const stored: StoredChat = {
      messages,
      profile,
      offerContact,
      showContactForm,
      relatedPropertySlug,
      relatedPropertyName,
      expiresAt: Date.now() + SESSION_TTL,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }, [
    hydrated,
    messages,
    profile,
    offerContact,
    showContactForm,
    relatedPropertySlug,
    relatedPropertyName,
  ]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, offerContact, showContactForm, leadSaved]);

  function transcript() {
    return messages
      .map(
        (message) =>
          `${message.role === "user" ? "Cliente" : "Assistente"}: ${message.content}`
      )
      .join("\n");
  }

  async function sendMessage() {
    const value = input.trim();
    if (!value || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: value },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setLeadSaved(false);
    setWhatsappUrl("");

    try {
      const data = await postJson<ChatResponse>("/api/ai/chat", {
        messages: nextMessages,
        profile,
        browser: browserContext(),
      });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.reply ||
            (profile.language === "en"
              ? "How else can I help?"
              : "Como mais posso ajudar?"),
        },
      ]);

      if (data.qualification) {
        setProfile((current) => ({
          language: data.qualification?.language || current.language,
          country: data.qualification?.country ?? current.country,
          countryConfidence:
            data.qualification?.country_confidence || current.countryConfidence,
          goal: data.qualification?.goal ?? current.goal,
          budgetRange:
            data.qualification?.budget_range ?? current.budgetRange,
          regionInterest:
            data.qualification?.region_interest ?? current.regionInterest,
          timeline: data.qualification?.timeline ?? current.timeline,
        }));
      }

      if (data.related_property_slug) {
        setRelatedPropertySlug(data.related_property_slug);
      }

      if (data.related_property_name) {
        setRelatedPropertyName(data.related_property_name);
      }

      setOfferContact(Boolean(data.offer_contact || data.escalate));
      setShowContactForm(false);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: isEnglish
            ? "I couldn't finish that here. If you want, I can prepare a message for the Hope Business team."
            : "Não consegui concluir isso por aqui. Se quiser, posso preparar o contato com a equipe da Hope Business.",
        },
      ]);
      setOfferContact(true);
    } finally {
      setLoading(false);
    }
  }

  function continueConversation() {
    setOfferContact(false);
    setShowContactForm(false);
    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        content: isEnglish
          ? "Of course. We can keep talking here. What would you like to know next?"
          : "Claro. Podemos continuar por aqui. O que você gostaria de saber agora?",
      },
    ]);
  }

  function startContact() {
    setOfferContact(false);
    setShowContactForm(true);
  }

  async function saveLead() {
    if (!leadName.trim() || !leadWhatsapp.trim() || leadSaving) return;

    setLeadSaving(true);

    try {
      const lastMessage =
        [...messages].reverse().find((message) => message.role === "user")?.content || "";

      const data = await postJson<{
        whatsappUrl: string;
        companyWhatsapp: string;
      }>("/api/leads/chat", {
        name: leadName,
        whatsapp: leadWhatsapp,
        email: leadEmail,
        propertySlug: relatedPropertySlug,
        propertyName: relatedPropertyName,
        transcript: transcript(),
        lastMessage,
        country: profile.country,
        budgetRange: profile.budgetRange,
        goal: profile.goal,
        regionInterest: profile.regionInterest,
        timeline: profile.timeline,
        language: profile.language,
      });

      setWhatsappUrl(data.whatsappUrl);
      setLeadSaved(true);
      setShowContactForm(false);
    } finally {
      setLeadSaving(false);
    }
  }

  function resetConversation() {
    const language: "pt" | "en" =
      navigator.language?.toLowerCase().startsWith("en") ? "en" : "pt";

    setMessages(greeting(language));
    setProfile(emptyProfile(language));
    setOfferContact(false);
    setShowContactForm(false);
    setRelatedPropertySlug("");
    setRelatedPropertyName("");
    setLeadSaved(false);
    setWhatsappUrl("");
    setLeadName("");
    setLeadWhatsapp("");
    setLeadEmail("");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div className="business-chat">
      {open ? (
        <section className="chat-window" aria-label="Assistente Hope Business">
          <header className="chat-header">
            <div className="chat-avatar">
              <BrandLogo compact />
              <i />
            </div>
            <div>
              <strong>Hope Business</strong>
              <span>
                {isEnglish ? "Virtual consultant · Gemini" : "Consultor virtual · Gemini"}
              </span>
            </div>
            <button
              className="chat-icon-button"
              type="button"
              onClick={() => setOpen(false)}
              aria-label={isEnglish ? "Close chat" : "Fechar chat"}
            >
              <AppIcon name="close" size={19} />
            </button>
          </header>

          <div className="chat-scope">
            <span>
              {profile.country
                ? isEnglish
                  ? `Profile: ${profile.country}${profile.budgetRange ? ` · ${profile.budgetRange}` : ""}`
                  : `Perfil: ${profile.country}${profile.budgetRange ? ` · ${profile.budgetRange}` : ""}`
                : isEnglish
                  ? "Hope Business property assistance"
                  : "Atendimento imobiliário Hope Business"}
            </span>
            <button type="button" onClick={resetConversation}>
              {isEnglish ? "New chat" : "Nova conversa"}
            </button>
          </div>

          <div className="chat-messages" ref={listRef}>
            {messages.map((message, index) => (
              <div
                className={
                  message.role === "user"
                    ? "chat-message chat-message-user"
                    : "chat-message chat-message-assistant"
                }
                key={`${message.role}-${index}`}
              >
                <RichMessage text={message.content} />
              </div>
            ))}

            {loading ? (
              <div className="chat-message chat-message-assistant chat-typing">
                <i />
                <i />
                <i />
              </div>
            ) : null}

            {offerContact && !showContactForm && !leadSaved ? (
              <div className="chat-contact-choice">
                <strong>
                  {isEnglish
                    ? "Would you like to talk to our team?"
                    : "Quer falar com a nossa equipe?"}
                </strong>
                <p>
                  {isEnglish
                    ? "I already have enough context to prepare the conversation."
                    : "Já tenho contexto suficiente para deixar a conversa preparada."}
                </p>
                <div>
                  <button
                    type="button"
                    className="button button-dark"
                    onClick={startContact}
                  >
                    {isEnglish ? "Talk to the team →" : "Falar com a equipe →"}
                  </button>
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={continueConversation}
                  >
                    {isEnglish ? "Keep chatting" : "Continuar conversando"}
                  </button>
                </div>
              </div>
            ) : null}

            {showContactForm && !leadSaved ? (
              <div className="chat-contact-card">
                <strong>
                  {isEnglish ? "Contact details" : "Dados para contato"}
                </strong>
                <p>
                  {isEnglish
                    ? "Your profile and conversation summary will be sent with the WhatsApp message."
                    : "Seu perfil e o resumo da conversa vão junto na mensagem do WhatsApp."}
                </p>
                <input
                  value={leadName}
                  onChange={(event) => setLeadName(event.target.value)}
                  placeholder={isEnglish ? "Your name" : "Seu nome"}
                />
                <input
                  value={leadWhatsapp}
                  onChange={(event) => setLeadWhatsapp(event.target.value)}
                  placeholder={isEnglish ? "WhatsApp with country code" : "WhatsApp com DDI"}
                />
                <input
                  value={leadEmail}
                  onChange={(event) => setLeadEmail(event.target.value)}
                  placeholder={isEnglish ? "Email (optional)" : "E-mail (opcional)"}
                  type="email"
                />
                <button
                  type="button"
                  className="button button-dark"
                  onClick={() => void saveLead()}
                  disabled={leadSaving || !leadName.trim() || !leadWhatsapp.trim()}
                >
                  {leadSaving
                    ? isEnglish
                      ? "Preparing..."
                      : "Preparando..."
                    : isEnglish
                      ? "Prepare WhatsApp →"
                      : "Preparar WhatsApp →"}
                </button>
              </div>
            ) : null}

            {leadSaved ? (
              <>
                <div className="chat-contact-success">
                  <strong>
                    {isEnglish ? "Everything is ready." : "Tudo pronto."}
                  </strong>
                  <span>
                    {isEnglish
                      ? "Your request was saved and the WhatsApp message is ready."
                      : "Seu pedido foi salvo e a mensagem do WhatsApp já está pronta."}
                  </span>
                </div>

                <div className="chat-company-number">
                  WhatsApp Hope Business: +{siteConfig.whatsapp}
                </div>

                <a
                  className="chat-whatsapp"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <AppIcon name="whatsapp" size={19} />
                  {isEnglish
                    ? "Open WhatsApp with prepared message"
                    : "Abrir WhatsApp com mensagem pronta"}
                </a>
              </>
            ) : null}
          </div>

          <div className="chat-composer">
            <textarea
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isEnglish ? "Type your message..." : "Digite sua dúvida..."}
              aria-label={isEnglish ? "Message" : "Mensagem"}
            />
            <button
              className="chat-send"
              type="button"
              onClick={() => void sendMessage()}
              disabled={!input.trim() || loading}
              aria-label={isEnglish ? "Send message" : "Enviar mensagem"}
            >
              <AppIcon name="send" size={18} />
            </button>
          </div>

          <div className="chat-enter-hint">
            {isEnglish
              ? "Saved for 12h · Enter sends · Shift + Enter creates a new line"
              : "Conversa salva por 12h · Enter envia · Shift + Enter quebra linha"}
          </div>
        </section>
      ) : null}

      <button
        className="chat-launcher"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={
          open
            ? isEnglish
              ? "Close assistant"
              : "Fechar assistente"
            : isEnglish
              ? "Open Hope assistant"
              : "Abrir assistente Hope Business"
        }
      >
        <AppIcon name={open ? "close" : "chat"} size={23} />
        {!open ? <span>{isEnglish ? "Talk to Hope" : "Fale com a Hope"}</span> : null}
      </button>
    </div>
  );
}
