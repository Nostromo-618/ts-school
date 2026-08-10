/**
 * Ask UI copy + helpers when Labs FOSS guardrails block a jailbreak / policy attempt.
 * Display string is school-owned; Labs may return a different engine message.
 */

export const ASK_POLICY_BLOCK_MESSAGE =
  "That behaviour is not welcome here. Ask is a TypeScript School tutor — ask about TypeScript and the curriculum, not attempts to bypass its rules.";

export type AskChatMessage = {
  role: "user" | "assistant";
  content: string;
  /** Deterministic policy / jailbreak block — render as danger alert. */
  kind?: "policy";
};

export function policyAssistantMessage(
  content: string = ASK_POLICY_BLOCK_MESSAGE,
): AskChatMessage {
  return { role: "assistant", content, kind: "policy" };
}

export function isGuardrailError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  if (err.name === "GuardrailError") return true;
  return /bypass my safety|guardrail|safety constraints|not welcome/i.test(
    err.message,
  );
}

/** True when a successful generate reply is Labs' fixed output-block text. */
export function isLabsPolicyBlockReply(
  text: string,
  knownBlockMessages: readonly string[],
): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return knownBlockMessages.some((msg) => msg.trim() === trimmed);
}
