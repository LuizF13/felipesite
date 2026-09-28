import { NextResponse } from "next/server";
import { isSupabaseConfigured, siteConfig } from "@/lib/config";
import { getPublishedProperties } from "@/lib/properties";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      whatsapp?: string;
      email?: string;
      propertySlug?: string;
      propertyName?: string;
      transcript?: string;
      lastMessage?: string;
      country?: string;
      budgetRange?: string;
      goal?: string;
      regionInterest?: string;
      timeline?: string;
      language?: "pt" | "en";
    };

    const name = String(body.name || "").trim();
    const whatsapp = String(body.whatsapp || "").trim();
    const language = body.language === "en" ? "en" : "pt";

    if (!name || !whatsapp) {
      return NextResponse.json(
        {
          error:
            language === "en"
              ? "Enter your name and WhatsApp number."
              : "Informe seu nome e WhatsApp para continuar.",
        },
        { status: 400 }
      );
    }

    let propertyId: string | null = null;
    let propertyName = String(body.propertyName || "").trim();

    if (body.propertySlug) {
      const properties = await getPublishedProperties();
      const property = properties.find((item) => item.slug === body.propertySlug);
      propertyId = property?.id || null;
      propertyName = property?.name || propertyName;
    }

    const contextLines = [
      "Origem: Assistente virtual Hope Business",
      body.country ? `País: ${body.country}` : "",
      body.budgetRange ? `Faixa de investimento: ${body.budgetRange}` : "",
      body.goal ? `Objetivo: ${body.goal}` : "",
      body.regionInterest ? `Região de interesse: ${body.regionInterest}` : "",
      body.timeline ? `Prazo/momento: ${body.timeline}` : "",
      propertyName ? `Imóvel de interesse: ${propertyName}` : "",
      body.lastMessage ? `Última solicitação: ${body.lastMessage}` : "",
      body.transcript ? `Conversa:\n${body.transcript}` : "",
    ].filter(Boolean);

    if (isSupabaseConfigured) {
      const supabase = await createClient();

      const { error } = await supabase.from("leads").insert({
        property_id: propertyId,
        name,
        whatsapp,
        email: String(body.email || "").trim() || null,
        country: String(body.country || "").trim() || null,
        budget_range: String(body.budgetRange || "").trim() || null,
        goal:
          String(body.goal || "").trim() ||
          (propertyName ? `Interesse em ${propertyName}` : "Contato via chatbot"),
        message: contextLines.join("\n\n"),
        status: "new",
      });

      if (error) throw new Error(error.message);
    }

    const readyMessage =
      language === "en"
        ? [
            "Hello! I came from the Hope Business website and would like to continue with the team.",
            `Name: ${name}`,
            body.country ? `Country: ${body.country}` : "",
            body.budgetRange ? `Budget range: ${body.budgetRange}` : "",
            body.goal ? `Goal: ${body.goal}` : "",
            body.regionInterest ? `Preferred area: ${body.regionInterest}` : "",
            body.timeline ? `Timeline: ${body.timeline}` : "",
            propertyName ? `Property: ${propertyName}` : "",
            body.lastMessage ? `Latest question: ${body.lastMessage}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        : [
            "Olá! Vim pelo site da Hope Business e gostaria de continuar o atendimento com a equipe.",
            `Nome: ${name}`,
            body.country ? `País: ${body.country}` : "",
            body.budgetRange ? `Faixa de investimento: ${body.budgetRange}` : "",
            body.goal ? `Objetivo: ${body.goal}` : "",
            body.regionInterest ? `Região de interesse: ${body.regionInterest}` : "",
            body.timeline ? `Prazo/momento: ${body.timeline}` : "",
            propertyName ? `Imóvel: ${propertyName}` : "",
            body.lastMessage ? `Última dúvida: ${body.lastMessage}` : "",
          ]
            .filter(Boolean)
            .join("\n");

    return NextResponse.json({
      saved: isSupabaseConfigured,
      whatsappUrl: `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(readyMessage)}`,
      companyWhatsapp: siteConfig.whatsapp,
    });
  } catch (error) {
    console.error("Chat lead:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível registrar o contato.",
      },
      { status: 500 }
    );
  }
}
