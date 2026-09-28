import { NextResponse } from "next/server";
import { GeminiTemporarilyUnavailableError, generateContentWithFallback } from "@/lib/gemini";

export const runtime = "nodejs";

const responseSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    slug: { type: "string" },
    city: { type: "string" },
    neighborhood: { type: "string" },
    address: { type: "string" },
    property_type: {
      type: "string",
      enum: ["Apartamento", "Cobertura", "Casa", "Terreno", "Comercial"],
    },
    developer: { type: "string" },
    delivery_label: { type: "string" },
    sort_order: { type: "integer" },
    description: { type: "string" },
    amenities: {
      type: "array",
      items: { type: "string" },
    },
    bedrooms: { type: "integer" },
    suites: { type: "integer" },
    bathrooms: { type: "integer" },
    garages: { type: "integer" },
    private_area: { type: "number" },
    total_area: { type: "number" },
    price_reais: { type: "number" },
    price_on_request: { type: "boolean" },
    generated_note: { type: "string" },
  },
  required: [
    "name",
    "slug",
    "city",
    "neighborhood",
    "address",
    "property_type",
    "developer",
    "delivery_label",
    "sort_order",
    "description",
    "amenities",
    "bedrooms",
    "suites",
    "bathrooms",
    "garages",
    "private_area",
    "total_area",
    "price_reais",
    "price_on_request",
    "generated_note",
  ],
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const prompt = String(formData.get("prompt") || "").trim();
    const demoMode = String(formData.get("demo_mode") || "true") === "true";
    const files = formData
      .getAll("images")
      .filter((item): item is File => item instanceof File && item.size > 0)
      .slice(0, 3);

    if (!prompt && files.length === 0) {
      return NextResponse.json(
        { error: "Envie uma descrição ou pelo menos uma foto do imóvel." },
        { status: 400 }
      );
    }

    const imageParts = await Promise.all(
      files.map(async (file) => ({
        inlineData: {
          mimeType: file.type || "image/jpeg",
          data: Buffer.from(await file.arrayBuffer()).toString("base64"),
        },
      }))
    );

    const instructions = `
Você é um assistente de cadastro imobiliário da Hope Business.

Sua tarefa é preencher um formulário de imóvel em português do Brasil com aparência profissional e realista.

Regras:
- Use as informações fornecidas pelo usuário como fonte principal.
- Use as imagens apenas para inferir características VISÍVEIS, como estilo arquitetônico, piscina, varanda, fachada, paisagismo e padrão aparente.
- Nunca diga que um detalhe visual prova quantidade de dormitórios, suítes, área, preço ou endereço.
- Modo de demonstração: ${demoMode ? "ATIVADO" : "DESATIVADO"}.
- Se o modo de demonstração estiver ATIVADO e um dado exato não tiver sido informado, você pode criar um valor fictício porém plausível e coerente para fins de demonstração.
- Se o modo de demonstração estiver DESATIVADO, para dados não verificados use string vazia para textos e 0 para números, em vez de inventar.
- Quando criar dados fictícios, deixe isso claro em generated_note.
- Para imóveis na região, prefira Itapema ou Porto Belo somente se isso fizer sentido com o que o usuário pediu. Não invente cidade se ele informar outra.
- O slug deve ser minúsculo, sem acentos e separado por hífens.
- A descrição deve ter de 70 a 140 palavras, linguagem de imobiliária premium, sem prometer valorização ou retorno financeiro.
- amenities deve conter diferenciais objetivos separados em itens.
- sort_order pode ser 1 se nada for informado.
- price_reais deve ser número puro, sem R$ e sem pontuação de milhar.
- price_on_request deve ser true quando fizer mais sentido não exibir preço.
- Não use nomes de incorporadoras reais se elas não forem fornecidas. Em modo demo, crie um nome fictício plausível.
- Não invente matrícula, documentação, distância exata, vista para o mar ou frente-mar sem evidência/informação.

Informações fornecidas:
${prompt || "Nenhuma descrição textual. Use apenas o que for visualmente observável e, em modo demo, complete com dados plausíveis."}
`;

    const response = await generateContentWithFallback({
      contents: [{ text: instructions }, ...imageParts],
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.35,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("O Gemini não retornou conteúdo.");
    }

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("AI property autofill:", error);

    if (error instanceof GeminiTemporarilyUnavailableError) {
      return NextResponse.json(
        {
          error:
            "O Gemini está temporariamente com alta demanda. Tentamos novamente e usamos modelos alternativos, mas o serviço continuou indisponível. Tente outra vez em alguns instantes.",
          retryable: true,
        },
        { status: 503 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Não foi possível gerar o cadastro.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
