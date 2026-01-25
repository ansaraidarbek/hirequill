import { OpenAI } from "openai";
import { env } from "@/data/env/server";

let _openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
    if (!_openaiClient) {
        _openaiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    }
    return _openaiClient;
}
