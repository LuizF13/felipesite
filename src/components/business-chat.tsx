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

type ChatResponse = {
  reply: string;
  escalate: boolean;
  handoff_reason?: string;
  contact_intent?: boolean;
  related_property_slug?: string;
  related_property_name?: string;
};

type StoredChat = {
  messages: ChatMessage[];
  handoff: boolean;
  contactIntent: boolean;
  relatedPropertySlug: string;
  relatedPropertyName: string;
  expiresAt: number;
};

const STORAGE_KEY = "hope-business-chat-v2";
const SESSION_TTL = 12 * 60 * 60 * 1000;

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Olá! Sou o assistente virtual da Hope Business. Posso ajudar com nossos imóveis, atendimento, Itapema, Porto Belo e como funciona o processo para quem está fora do Brasil.",
  },
];

function RichMessage({ text }: { text: string }) {
  const pattern = /\[([^\]]+)\]\((\/[^)]+|https?:\/\/[^)]+)\)|(https?:\/\/[^\s]+)|(\/imoveis\/[a-zA-Z0-9-_]+)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

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

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return <>{nodes}</>;
}

export function BusinessChat() {
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [contactIntent, setContactIntent] = useState(false);
  const [relatedPropertySlug, setRelatedPropertySlug] = useState("");
  const [relatedPropertyName, setRelatedPropertyName] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadWhatsapp, setLeadWhatsapp] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSaving, setLeadSaving] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as StoredChat;
        if (stored.expiresAt > Date.now() && stored.messages?.length) {
          setMessages(stored.messages);
          setHandoff(Boolean(stored.handoff));
          setContactIntent(Boolean(stored.contactIntent));
          setRelatedPropertySlug(stored.relatedPropertySlug || "");
          setRelatedPropertyName(stored.relatedPropertyName || "");
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const stored: StoredChat = {
      messages,
      handoff,
      contactIntent,
      relatedPropertySlug,
      relatedPropertyName,
      expiresAt: Date.now() + SESSION_TTL,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }, [
    hydrated,
    messages,
    handoff,
    contactIntent,
    relatedPropertySlug,
    relatedPropertyName,
  ]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, handoff, contactIntent, leadSaved]);

  function transcript() {
    return messages
      .map(
        (message) =>
          `${message.role === "user" ? "Cliente" : "Assistente"}: ${message.content}`
      )
      .join("\n");
  }

  function fallbackWhatsappHref(lastQuestion?: string) {
    const text = [
      "Olá! Vim pelo site da Hope Business e quero continuar o atendimento.",
      relatedPropertyName ? `Imóvel: ${relatedPropertyName}` : "",
      lastQuestion ? `Minha dúvida: ${lastQuestion}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`;
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

    try {
      const data = await postJson<ChatResponse>("/api/ai/chat", {
        messages: nextMessages,
      });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.reply ||
            "A equipe da Hope Business pode continuar esse atendimento com você.",
        },
      ]);

      setHandoff(Boolean(data.escalate || data.contact_intent));
      setContactIntent(Boolean(data.contact_intent));
      setRelatedPropertySlug(data.related_property_slug || "");
      setRelatedPropertyName(data.related_property_name || "");
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Não consegui responder por aqui. A equipe da Hope Business pode continuar com você pelo WhatsApp.",
        },
      ]);
      setHandoff(true);
    } finally {
      setLoading(false);
    }
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
      });

      setWhatsappUrl(data.whatsappUrl);
      setLeadSaved(true);
      setHandoff(true);
    } finally {
      setLeadSaving(false);
    }
  }

  function resetConversation() {
    setMessages(initialMessages);
    setHandoff(false);
    setContactIntent(false);
    setRelatedPropertySlug("");
    setRelatedPropertyName("");
    setLeadSaved(false);
    setWhatsappUrl("");
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

  const lastQuestion =
    [...messages].reverse().find((message) => message.role === "user")?.content || "";

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
              <span>Assistente virtual · Gemini</span>
            </div>
            <button
              className="chat-icon-button"
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar chat"
            >
              <AppIcon name="close" size={19} />
            </button>
          </header>

          <div className="chat-scope">
            <span>Atendimento sobre a Hope Business e imóveis publicados.</span>
            <button type="button" onClick={resetConversation}>
              Nova conversa
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

            {contactIntent && !leadSaved ? (
              <div className="chat-contact-card">
                <strong>Quer que a equipe entre em contato?</strong>
                <p>
                  Deixe seus dados. O pedido fica registrado no painel da Hope
                  Business e você também recebe o WhatsApp com a mensagem pronta.
                </p>
                <input
                  value={leadName}
                  onChange={(event) => setLeadName(event.target.value)}
                  placeholder="Seu nome"
                />
                <input
                  value={leadWhatsapp}
                  onChange={(event) => setLeadWhatsapp(event.target.value)}
                  placeholder="Seu WhatsApp com DDI"
                />
                <input
                  value={leadEmail}
                  onChange={(event) => setLeadEmail(event.target.value)}
                  placeholder="E-mail (opcional)"
                  type="email"
                />
                <button
                  type="button"
                  className="button button-dark"
                  onClick={() => void saveLead()}
                  disabled={leadSaving || !leadName.trim() || !leadWhatsapp.trim()}
                >
                  {leadSaving ? "Registrando..." : "Quero ser atendido →"}
                </button>
              </div>
            ) : null}

            {leadSaved ? (
              <div className="chat-contact-success">
                <strong>Contato registrado.</strong>
                <span>
                  A equipe já poderá ver sua solicitação no painel.
                </span>
              </div>
            ) : null}

            {handoff ? (
              <>
                <div className="chat-company-number">
                  WhatsApp Hope Business: +{siteConfig.whatsapp}
                </div>
                <a
                  className="chat-whatsapp"
                  href={whatsappUrl || fallbackWhatsappHref(lastQuestion)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <AppIcon name="whatsapp" size={19} />
                  Abrir WhatsApp com mensagem pronta
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
              placeholder="Digite sua dúvida..."
              aria-label="Mensagem"
            />
            <button
              className="chat-send"
              type="button"
              onClick={() => void sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Enviar mensagem"
            >
              <AppIcon name="send" size={18} />
            </button>
          </div>

          <div className="chat-enter-hint">
            A conversa fica salva por 12h · Enter envia · Shift + Enter quebra linha
          </div>
        </section>
      ) : null}

      <button
        className="chat-launcher"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Fechar assistente" : "Abrir assistente Hope Business"}
      >
        <AppIcon name={open ? "close" : "chat"} size={23} />
        {!open ? <span>Fale com a Hope</span> : null}
      </button>
    </div>
  );
}
