/**
 * Ask chat transcript persistence — localStorage only, schema-validated on read.
 *
 * Corrupt or wrong-version payloads are discarded. SSR never touches storage.
 */

import type { AskChatMessage } from "@/ai/ask-policy-block";

export const AI_CHAT_HISTORY_KEY = "ts-school-ai-chat-history";
export const AI_CHAT_HISTORY_SCHEMA_VERSION = 1 as const;

/** Soft cap — trim oldest turns before write. */
export const AI_CHAT_HISTORY_MAX_MESSAGES = 100;

/** Soft byte cap for serialized payload (UTF-16 approx via string length). */
export const AI_CHAT_HISTORY_MAX_BYTES = 200_000;

export interface AiChatHistoryV1 {
  version: typeof AI_CHAT_HISTORY_SCHEMA_VERSION;
  messages: AskChatMessage[];
  updatedAt: string;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidMessage(value: unknown): value is AskChatMessage {
  if (!isPlainObject(value)) return false;
  if (value.role !== "user" && value.role !== "assistant") return false;
  if (typeof value.content !== "string") return false;
  if (value.kind !== undefined && value.kind !== "policy") {
    return false;
  }
  return true;
}

export function parseAiChatHistory(raw: unknown): AiChatHistoryV1 | undefined {
  if (!isPlainObject(raw)) return undefined;
  if (raw.version !== AI_CHAT_HISTORY_SCHEMA_VERSION) return undefined;
  if (!Array.isArray(raw.messages)) return undefined;
  if (typeof raw.updatedAt !== "string") return undefined;
  const messages: AskChatMessage[] = [];
  for (const item of raw.messages) {
    if (!isValidMessage(item)) return undefined;
    messages.push({
      role: item.role,
      content: item.content,
      ...(item.kind === "policy" ? { kind: "policy" as const } : {}),
    });
  }
  return {
    version: AI_CHAT_HISTORY_SCHEMA_VERSION,
    messages,
    updatedAt: raw.updatedAt,
  };
}

/** Drop in-flight empty assistant stubs before persisting. */
export function messagesReadyToPersist(
  messages: AskChatMessage[],
): AskChatMessage[] {
  return messages.filter(
    (msg) => !(msg.role === "assistant" && msg.content.trim() === ""),
  );
}

export function trimAiChatHistory(
  messages: AskChatMessage[],
): AskChatMessage[] {
  let trimmed = messagesReadyToPersist(messages);
  if (trimmed.length > AI_CHAT_HISTORY_MAX_MESSAGES) {
    trimmed = trimmed.slice(trimmed.length - AI_CHAT_HISTORY_MAX_MESSAGES);
  }
  const updatedAt = new Date().toISOString();
  while (trimmed.length > 0) {
    const byteLength = JSON.stringify({
      version: AI_CHAT_HISTORY_SCHEMA_VERSION,
      messages: trimmed,
      updatedAt,
    }).length;
    if (byteLength <= AI_CHAT_HISTORY_MAX_BYTES) break;
    trimmed = trimmed.slice(1);
  }
  return trimmed;
}

export function serializeAiChatHistory(
  messages: AskChatMessage[],
  updatedAt: Date = new Date(),
): string {
  const payload: AiChatHistoryV1 = {
    version: AI_CHAT_HISTORY_SCHEMA_VERSION,
    messages: trimAiChatHistory(messages),
    updatedAt: updatedAt.toISOString(),
  };
  return JSON.stringify(payload);
}

function safeGetItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* quota / private mode */
  }
}

function safeRemoveItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function readAiChatHistory(): AskChatMessage[] {
  const raw = safeGetItem(AI_CHAT_HISTORY_KEY);
  if (raw === null) return [];
  try {
    const parsed = parseAiChatHistory(JSON.parse(raw) as unknown);
    return parsed?.messages ?? [];
  } catch {
    return [];
  }
}

export function writeAiChatHistory(messages: AskChatMessage[]): void {
  const ready = messagesReadyToPersist(messages);
  if (ready.length === 0) {
    safeRemoveItem(AI_CHAT_HISTORY_KEY);
    return;
  }
  safeSetItem(AI_CHAT_HISTORY_KEY, serializeAiChatHistory(ready));
}

export function clearAiChatHistory(): void {
  safeRemoveItem(AI_CHAT_HISTORY_KEY);
}

export function readAiChatHistoryPayload(): AiChatHistoryV1 | null {
  const raw = safeGetItem(AI_CHAT_HISTORY_KEY);
  if (raw === null) return null;
  try {
    return parseAiChatHistory(JSON.parse(raw) as unknown) ?? null;
  } catch {
    return null;
  }
}
