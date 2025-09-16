/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface VerifyRequest {
  fileName: string;
  text?: string;
  dataUrl?: string; // fallback when text not available
}
export interface VerifyResponse {
  summary: string;
  details: string[];
}

export interface AskRequest {
  question: string;
  context: {
    lastSummary?: string;
    messages: { role: "user" | "assistant" | "system"; content: string }[];
  };
}
export interface AskResponse {
  answer: string;
}
