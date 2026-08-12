import { beforeEach, describe, expect, it } from "vitest";

import type { AskChatMessage } from "@/ai/ask-policy-block";
import {
  AI_CHAT_HISTORY_KEY,
  AI_CHAT_HISTORY_MAX_BYTES,
  AI_CHAT_HISTORY_MAX_MESSAGES,
  AI_CHAT_HISTORY_SCHEMA_VERSION,
  clearAiChatHistory,
  messagesReadyToPersist,
  parseAiChatHistory,
  readAiChatHistory,
  readAiChatHistoryPayload,
  serializeAiChatHistory,
  trimAiChatHistory,
  writeAiChatHistory,
} from "@/lib/ai-chat-history";

describe("ai-chat-history", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("parses valid v1 payload", () => {
    const raw = {
      version: AI_CHAT_HISTORY_SCHEMA_VERSION,
      updatedAt: "2026-08-12T00:00:00.000Z",
      messages: [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi", kind: "policy" },
      ],
    };
    const parsed = parseAiChatHistory(raw);
    expect(parsed?.messages).toHaveLength(2);
    expect(parsed?.messages[1]?.kind).toBe("policy");
  });

  it("rejects corrupt or wrong-version payloads", () => {
    expect(parseAiChatHistory(null)).toBeUndefined();
    expect(parseAiChatHistory({ version: 99 })).toBeUndefined();
    expect(parseAiChatHistory({ version: 1, updatedAt: "x", messages: "nope" })).toBeUndefined();
    expect(
      parseAiChatHistory({
        version: 1,
        updatedAt: "x",
        messages: [{ role: "bot", content: "x" }],
      }),
    ).toBeUndefined();
  });

  it("filters empty assistant stubs before persist", () => {
    const messages: AskChatMessage[] = [
      { role: "user", content: "Q" },
      { role: "assistant", content: "" },
      { role: "assistant", content: "A" },
    ];
    expect(messagesReadyToPersist(messages)).toEqual([
      { role: "user", content: "Q" },
      { role: "assistant", content: "A" },
    ]);
  });

  it("trims oldest messages when over count cap", () => {
    const messages: AskChatMessage[] = Array.from(
      { length: AI_CHAT_HISTORY_MAX_MESSAGES + 5 },
      (_, i) => ({ role: "user", content: `msg-${i}` }),
    );
    const trimmed = trimAiChatHistory(messages);
    expect(trimmed).toHaveLength(AI_CHAT_HISTORY_MAX_MESSAGES);
    expect(trimmed[0]?.content).toBe("msg-5");
  });

  it("trims oldest messages when over byte cap", () => {
    const big = "x".repeat(AI_CHAT_HISTORY_MAX_BYTES);
    const messages: AskChatMessage[] = [
      { role: "user", content: "small" },
      { role: "assistant", content: big },
    ];
    const trimmed = trimAiChatHistory(messages);
    expect(trimmed.length).toBeLessThan(messages.length);
    expect(trimmed.every((m) => m.content !== big || trimmed.length === 1)).toBe(
      true,
    );
  });

  it("round-trips through localStorage", () => {
    writeAiChatHistory([
      { role: "user", content: "Where do I start?" },
      { role: "assistant", content: "Try [why-types](/lessons/foundations/why-types)." },
    ]);
    expect(readAiChatHistory()).toHaveLength(2);
    expect(readAiChatHistoryPayload()?.version).toBe(AI_CHAT_HISTORY_SCHEMA_VERSION);
    expect(window.localStorage.getItem(AI_CHAT_HISTORY_KEY)).toBeTruthy();
  });

  it("clear removes the storage key", () => {
    writeAiChatHistory([{ role: "user", content: "x" }]);
    clearAiChatHistory();
    expect(window.localStorage.getItem(AI_CHAT_HISTORY_KEY)).toBeNull();
    expect(readAiChatHistory()).toEqual([]);
  });

  it("write with empty messages removes key", () => {
    writeAiChatHistory([{ role: "user", content: "x" }]);
    writeAiChatHistory([]);
    expect(window.localStorage.getItem(AI_CHAT_HISTORY_KEY)).toBeNull();
  });

  it("serialize produces parseable JSON", () => {
    const json = serializeAiChatHistory([{ role: "user", content: "hi" }]);
    const parsed = parseAiChatHistory(JSON.parse(json));
    expect(parsed?.messages[0]?.content).toBe("hi");
  });
});
