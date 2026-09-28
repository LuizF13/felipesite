import { GoogleGenAI } from "@google/genai";
import { geminiModel, isGeminiConfigured } from "@/lib/config";

let client: GoogleGenAI | null = null;

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

export { geminiModel };
