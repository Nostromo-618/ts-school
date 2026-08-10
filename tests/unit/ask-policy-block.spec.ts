import { describe, expect, it } from "vitest";
import {
  ASK_POLICY_BLOCK_MESSAGE,
  isGuardrailError,
  isLabsPolicyBlockReply,
  policyAssistantMessage,
} from "@/ai/ask-policy-block";

describe("ask-policy-block", () => {
  it("builds a policy assistant message with firm school copy", () => {
    const msg = policyAssistantMessage();
    expect(msg.role).toBe("assistant");
    expect(msg.kind).toBe("policy");
    expect(msg.content).toBe(ASK_POLICY_BLOCK_MESSAGE);
    expect(msg.content).toMatch(/not welcome/i);
    expect(msg.content).toMatch(/TypeScript School tutor/i);
  });

  it("detects GuardrailError by name and message heuristics", () => {
    const named = new Error("blocked");
    named.name = "GuardrailError";
    expect(isGuardrailError(named)).toBe(true);

    expect(
      isGuardrailError(
        new Error("Request blocked by deterministic guardrails."),
      ),
    ).toBe(true);
    expect(isGuardrailError(new Error("network failed"))).toBe(false);
    expect(isGuardrailError("string")).toBe(false);
  });

  it("matches Labs fixed block reply strings exactly", () => {
    const known = ["Labs block A", "Labs block B"] as const;
    expect(isLabsPolicyBlockReply("Labs block A", known)).toBe(true);
    expect(isLabsPolicyBlockReply("  Labs block B  ", known)).toBe(true);
    expect(isLabsPolicyBlockReply("normal tutor reply", known)).toBe(false);
  });
});
