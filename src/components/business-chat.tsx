"use client";

import { useEffect, useRef, useState } from "react";
import { AppIcon } from "@/components/app-icon";
import { siteConfig } from "@/lib/config";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatResponse = {
  reply: string;
  escalate: boolean;
  handoff_reason?: string;
};

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Olá! Sou o assistente virtual da Hope Business. Posso ajudar com nossos imóveis, atendimento, Itapema, Porto Belo e como funciona o processo para quem está na Europa.",
  },
];

export function BusinessChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, handoff]);

  function whatsappHref(lastQuestion?: string) {
    const recent = messages
      .slice(-4)
      .map(
        (message) =>
          `${message.role === "user" ? "Cliente" : "Assistente"}: ${message.content}`
      )
      .join("\n");

    const text = [
      "Olá! Vim pelo site da Hope Business e preciso continuar o atendimento com a equipe.",
      lastQuestion ? `Minha dúvida: ${lastQuestion}` : "",
      recent ? `\nContexto do chat:\n${recent}` : "",
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
    setHandoff(false);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = (await response.json()) as ChatResponse;

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.reply ||
            "A equipe da Hope Business pode continuar esse atendimento com você.",
        },
      ]);

      if (data.escalate) {
        setHandoff(true);
      }
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
              <span>H</span>
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
            Atendimento sobre a Hope Business e imóveis publicados no site.
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
                {message.content}
              </div>
            ))}

            {loading ? (
              <div className="chat-message chat-message-assistant chat-typing">
                <i />
                <i />
                <i />
              </div>
            ) : null}

            {handoff ? (
              <a
                className="chat-whatsapp"
                href={whatsappHref(
                  [...messages].reverse().find((message) => message.role === "user")
                    ?.content
                )}
                target="_blank"
                rel="noreferrer"
              >
                <AppIcon name="whatsapp" size={19} />
                Continuar no WhatsApp
              </a>
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
            Enter envia · Shift + Enter quebra linha
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
