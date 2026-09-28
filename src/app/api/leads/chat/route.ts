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
    };

    const name = String(body.name || "").trim();
    const whatsapp = String(body.whatsapp || "").trim();

    if (!name || !whatsapp) {
      return NextResponse.json(
        { error: "Informe seu nome e WhatsApp para continuar." },
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

    const context = [
      "Origem: Assistente virtual Hope Business",
      propertyName ? `Imóvel de interesse: ${propertyName}` : "",
      body.lastMessage ? `Última solicitação: ${body.lastMessage}` : "",
      body.transcript ? `Conversa:\n${body.transcript}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    if (isSupabaseConfigured) {
      const supabase = await createClient();
      const { error } = await supabase.from("leads").insert({
        property_id: propertyId,
        name,
        whatsapp,
        email: String(body.email || "").trim() || null,
        country: null,
        budget_range: null,
        goal: propertyName ? `Interesse em ${propertyName}` : "Contato via chatbot",
        message: context,
        status: "new",
      });

      if (error) throw new Error(error.message);
    }

    const readyMessage = [
      "Olá! Vim pelo site da Hope Business e gostaria de continuar o atendimento.",
      `Nome: ${name}`,
      propertyName ? `Imóvel: ${propertyName}` : "",
      body.lastMessage ? `Assunto: ${body.lastMessage}` : "",
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
