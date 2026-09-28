import { GoogleGenAI } from "@google/genai";
import {
  geminiFallbackModels,
  geminiModel,
  isGeminiConfigured,
} from "@/lib/config";

let client: GoogleGenAI | null = null;

type GenerateContentRequest = Parameters<
  GoogleGenAI["models"]["generateContent"]
>[0];

const transientStatuses = new Set([408, 429, 500, 502, 503, 504]);

export class GeminiTemporarilyUnavailableError extends Error {
  statusCode = 503;

  constructor(message = "A IA está temporariamente ocupada. Tente novamente em alguns instantes.") {
    super(message);
    this.name = "GeminiTemporarilyUnavailableError";
  }
}

export function getGeminiClient() {
  if (!isGeminiConfigured) {
    throw new Error("GEMINI_API_KEY não configurada.");
  }

  if (!client) {
    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
  }

  return client;
}

function errorStatus(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
  ) {
    return (error as { status: number }).status;
  }

  return null;
}

function isTransientGeminiError(error: unknown) {
  const status = errorStatus(error);
  if (status && transientStatuses.has(status)) return true;

  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  return (
    message.includes("high demand") ||
    message.includes("unavailable") ||
    message.includes("resource_exhausted") ||
    message.includes("rate limit") ||
    message.includes("timeout")
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateContentWithFallback(
  request: Omit<GenerateContentRequest, "model"> & { model?: string }
) {
  const ai = getGeminiClient();
  const models = [
    request.model || geminiModel,
    ...geminiFallbackModels,
  ].filter((model, index, list) => list.indexOf(model) === index);

  let lastError: unknown;

  for (let modelIndex = 0; modelIndex < models.length; modelIndex += 1) {
    const model = models[modelIndex];
    const maxAttempts = modelIndex === 0 ? 2 : 1;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        const response = await ai.models.generateContent({
          ...request,
          model,
        });

        if (model !== models[0]) {
          console.warn(`Gemini fallback succeeded with model: ${model}`);
        }

        return response;
      } catch (error) {
        lastError = error;

        if (!isTransientGeminiError(error)) {
          throw error;
        }

        const hasAnotherAttempt = attempt + 1 < maxAttempts;
        const hasFallbackModel = modelIndex + 1 < models.length;

        if (!hasAnotherAttempt && !hasFallbackModel) {
          break;
        }

        const baseDelay = hasAnotherAttempt ? 650 * 2 ** attempt : 450;
        const jitter = Math.floor(Math.random() * 250);
        await sleep(baseDelay + jitter);
      }
    }
  }

  console.error("Gemini unavailable after retry/fallback:", lastError);

  throw new GeminiTemporarilyUnavailableError();
}

export { geminiModel };
