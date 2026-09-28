"use client";

import { useRef, useState } from "react";
import { postFormData } from "@/lib/xhr-client";

type GeneratedProperty = {
  name: string;
  slug: string;
  city: string;
  neighborhood: string;
  address: string;
  property_type: string;
  developer: string;
  delivery_label: string;
  sort_order: number;
  description: string;
  amenities: string[];
  bedrooms: number;
  suites: number;
  bathrooms: number;
  garages: number;
  private_area: number;
  total_area: number;
  price_reais: number;
  price_on_request: boolean;
  generated_note: string;
};

async function compressImage(file: File) {
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const maxSide = 1600;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return file;

    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82)
    );

    if (!blob) return file;

    return new File(
      [blob],
      file.name.replace(/\.[^.]+$/, "") + "-ai.jpg",
      { type: "image/jpeg" }
    );
  } catch {
    return file;
  }
}

function assignField(
  form: HTMLFormElement,
  name: string,
  value: string | number | boolean
) {
  const field = form.elements.namedItem(name);

  if (field instanceof HTMLInputElement && field.type === "checkbox") {
    field.checked = Boolean(value);
    field.dispatchEvent(new Event("change", { bubbles: true }));
    return;
  }

  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement ||
    field instanceof HTMLSelectElement
  ) {
    field.value = String(value ?? "");
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

export function AiPropertyAssistant() {
  const rootRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState("");
  const [demoMode, setDemoMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  async function generate() {
    const form = rootRef.current?.closest("form");
    if (!(form instanceof HTMLFormElement)) return;

    const files = Array.from(imagesRef.current?.files || []);

    if (!prompt.trim() && files.length === 0) {
      setError("Escreva uma descrição curta ou selecione pelo menos uma foto.");
      return;
    }

    setLoading(true);
    setError("");
    setNote("");

    try {
      const payload = new FormData();
      payload.set("prompt", prompt);
      payload.set("demo_mode", String(demoMode));

      const aiFiles = await Promise.all(files.slice(0, 3).map(compressImage));
      aiFiles.forEach((file) => payload.append("images", file, file.name));

      const data = await postFormData<GeneratedProperty>(
        "/api/ai/property",
        payload
      );

      assignField(form, "name", data.name);
      assignField(form, "slug", data.slug);
      assignField(form, "city", data.city);
      assignField(form, "neighborhood", data.neighborhood);
      assignField(form, "address", data.address);
      assignField(form, "property_type", data.property_type);
      assignField(form, "developer", data.developer);
      assignField(form, "delivery_label", data.delivery_label);
      assignField(form, "sort_order", data.sort_order);
      assignField(form, "description", data.description);
      assignField(form, "amenities", data.amenities.join(", "));
      assignField(form, "bedrooms", data.bedrooms);
      assignField(form, "suites", data.suites);
      assignField(form, "bathrooms", data.bathrooms);
      assignField(form, "garages", data.garages);
      assignField(form, "private_area", data.private_area);
      assignField(form, "total_area", data.total_area);
      assignField(form, "price_reais", data.price_reais);
      assignField(form, "price_on_request", data.price_on_request);

      setNote(
        data.generated_note ||
          "Campos preenchidos pela IA. Revise as informações antes de publicar."
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Falha ao comunicar com a IA.";

      if (message.toLowerCase().includes("failed to fetch")) {
        setError(
          "O navegador bloqueou a requisição. Se você usa a extensão PreMiD, desative-a para localhost ou teste em uma janela anônima. Depois tente novamente."
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-property-panel" ref={rootRef}>
      <div className="ai-property-heading">
        <div className="ai-mark">AI</div>
        <div>
          <span className="panel-kicker">Gemini</span>
          <h2>Preencher imóvel com IA</h2>
          <p>
            Envie fotos e escreva só o essencial. A IA organiza o cadastro para
            você revisar.
          </p>
        </div>
      </div>

      <div className="ai-property-grid">
        <label className="ai-prompt-field">
          <span>O que você sabe sobre o imóvel?</span>
          <textarea
            rows={4}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ex.: Casa moderna em Itapema, pronta para morar, alto padrão. Pode completar dados fictícios e realistas para demonstração."
          />
        </label>

        <label className="ai-file-field">
          <span>Fotos do imóvel</span>
          <input
            ref={imagesRef}
            name="images"
            type="file"
            accept="image/*"
            multiple
          />
          <small>
            As mesmas fotos selecionadas aqui serão enviadas ao salvar o imóvel.
            A IA analisa até 3 delas.
          </small>
        </label>
      </div>

      <div className="ai-property-actions">
        <label className="ai-demo-toggle">
          <input
            type="checkbox"
            checked={demoMode}
            onChange={(event) => setDemoMode(event.target.checked)}
          />
          <span>
            Completar dados não informados com sugestões fictícias e plausíveis
          </span>
        </label>

        <button
          className="button button-ai"
          type="button"
          onClick={generate}
          disabled={loading}
        >
          {loading ? "Analisando..." : "✦ Preencher com Gemini"}
        </button>
      </div>

      {note ? <div className="ai-result-note">{note}</div> : null}
      {error ? <div className="ai-result-error">{error}</div> : null}
    </div>
  );
}
