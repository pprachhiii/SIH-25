import type { RequestHandler } from "express";
import type { AskRequest, AskResponse, VerifyRequest, VerifyResponse } from "@shared/api";

const OPENAI_KEY = process.env.OPENAI_API_KEY;

function safeTextFromDataUrl(dataUrl?: string): string {
  if (!dataUrl) return "";
  try {
    const [, base64] = dataUrl.split(",");
    return Buffer.from(base64, "base64").toString("utf8");
  } catch {
    return "";
  }
}

function deterministicSummary(name: string, text: string): VerifyResponse {
  const chars = text.length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const lines = text.split(/\n/).length;
  const preview = text.slice(0, 240).replace(/\s+/g, " ");
  return {
    summary: `Analyzed “${name}”: ${words} words, ${lines} lines, ${chars} chars. Preview: ${preview}${text.length > 240 ? "…" : ""}`,
    details: [
      `Contains ${/\d{4}/.test(text) ? "a" : "no"} 4‑digit sequences`,
      `Unique words: ${new Set(text.toLowerCase().match(/[a-zA-Z]+/g) ?? []).size}`,
    ],
  };
}

export const handleVerify: RequestHandler = async (req, res) => {
  const body = req.body as VerifyRequest;
  const text = (body.text ?? "") || safeTextFromDataUrl(body.dataUrl);
  const name = body.fileName || "document";

  if (!text) {
    return res.status(400).json({ error: "No text content provided" });
  }

  if (OPENAI_KEY) {
    try {
      const prompt = `You are an AI for document verification. Summarize the document and propose 3 verification checks. Document name: ${name}. Content:\n\n${text.slice(0, 5000)}`;
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You generate concise, actionable verification results." },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 600,
        }),
      });
      const json = await r.json();
      const content: string = json.choices?.[0]?.message?.content ?? "No output";
      const response: VerifyResponse = {
        summary: content,
        details: [],
      };
      return res.json(response);
    } catch (e) {
      // fall back to deterministic if external call fails
    }
  }

  const deterministic = deterministicSummary(name, text);
  return res.json(deterministic);
};

export const handleAsk: RequestHandler = async (req, res) => {
  const body = req.body as AskRequest;
  const question = body.question?.trim();
  if (!question) return res.status(400).json({ error: "Missing question" });

  if (OPENAI_KEY) {
    try {
      const messages = [
        { role: "system", content: "You are a helpful assistant for document verification." },
        ...(body.context.lastSummary ? [{ role: "system", content: `Document summary: ${body.context.lastSummary}` }] : [] as any),
        ...body.context.messages,
        { role: "user", content: question },
      ];
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({ model: "gpt-4o-mini", messages, temperature: 0.2, max_tokens: 400 }),
      });
      const json = await r.json();
      const content: string = json.choices?.[0]?.message?.content ?? "";
      const resp: AskResponse = { answer: content };
      return res.json(resp);
    } catch (e) {
      // fallthrough
    }
  }

  // deterministic response
  const resp: AskResponse = {
    answer: `Answer (rule‑based): I cannot access an AI model here, but based on previous messages and summary, here's a helpful hint: ${question.slice(0, 200)}`,
  };
  return res.json(resp);
};
