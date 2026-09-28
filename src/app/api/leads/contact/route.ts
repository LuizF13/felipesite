import { NextResponse } from "next/server";
import { isSupabaseConfigured, siteConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      propertyId?: string;
      propertyName?: string;
      name?: string;
      whatsapp?: string;
      email?: string;
      country?: string;
      budgetRange?: string;
      goal?: string;
      message?: string;
    };

    const name = String(body.name || "").trim();
    const whatsapp = String(body.whatsapp || "").trim();

    if (!name || !whatsapp) {
      return NextResponse.json(
        { error: "Informe seu nome e WhatsApp." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      const supabase = await createClient();
      const { error } = await supabase.from("leads").insert({
        property_id: body.propertyId || null,
        name,
        whatsapp,
        email: String(body.email || "").trim() || null,
        country: String(body.country || "").trim() || null,
        budget_range: String(body.budgetRange || "").trim() || null,
        goal: String(body.goal || "").trim() || null,
        message: [
          body.propertyName ? `Imóvel: ${body.propertyName}` : "",
          String(body.message || "").trim(),
          "Origem: formulário do site",
        ]
          .filter(Boolean)
          .join("\n\n"),
        status: "new",
      });

      if (error) throw new Error(error.message);
    }

    const readyMessage = [
      "Olá! Vim pelo site da Hope Business e gostaria de atendimento.",
      `Nome: ${name}`,
      body.propertyName ? `Imóvel: ${body.propertyName}` : "",
      body.country ? `País: ${body.country}` : "",
      body.budgetRange ? `Faixa de investimento: ${body.budgetRange}` : "",
      body.goal ? `Objetivo: ${body.goal}` : "",
      body.message ? `Mensagem: ${body.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return NextResponse.json({
      saved: isSupabaseConfigured,
      whatsappUrl: `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(readyMessage)}`,
    });
  } catch (error) {
    console.error("Contact lead:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Não foi possível enviar.",
      },
      { status: 500 }
    );
  }
}
