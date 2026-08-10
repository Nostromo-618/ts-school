/**
 * AI assistant risk disclaimer — shown when opening Ask / AI chat until accepted.
 *
 * Bump `AI_RISK_VERSION` when this text changes meaningfully so returning
 * visitors must re-accept. Stored acceptance shape:
 * `{ version: string, acceptedAt: string }` under `AI_RISK_STORAGE_KEY`.
 */

/** Bump when AI risk clauses change in a way that needs re-consent. */
export const AI_RISK_VERSION = "1";

/** localStorage key for versioned AI risk acceptance JSON. */
export const AI_RISK_STORAGE_KEY = "ts-school-ai-risk-accepted";

export const AI_RISK_TITLE = "Before you use the AI assistant";

export const AI_RISK_INTRO =
  "The Ask sidebar runs an optional local language model in your browser. Please read these AI-specific risks. If you decline, the assistant stays closed — lessons and the rest of the site remain available.";

export interface AiRiskSection {
  heading: string;
  body: string;
  linkHref?: string;
  linkLabel?: string;
}

export const AI_RISK_SECTIONS: AiRiskSection[] = [
  {
    heading: "Local model — resource use",
    body: "Loading Gemma weights can use substantial RAM and GPU (WebGPU) and may briefly freeze the tab. Prefer the smaller E2B model on machines under ~16 GB RAM. You choose when to load; nothing downloads until you opt in (local `.models/` cache or Hugging Face).",
  },
  {
    heading: "Hallucinations and incomplete advice",
    body: "The assistant can invent lessons, APIs, diagnostics, or “fixes” that are wrong. Treat every answer as unverified draft text. Prefer tool-backed citations and the authored curriculum over free-form claims.",
  },
  {
    heading: "Not professional or security advice",
    body: "Output is not legal, career, security, or production guidance. Do not paste secrets into the chat. Do not apply suggested changes to production systems without your own review.",
  },
  {
    heading: "Editor edits need your Accept",
    body: "When the assistant proposes TypeScript edits, the site never silently overwrites the lesson editor. You must Accept or Reject each pending edit.",
  },
  {
    heading: "AI transparency (EU AI Act Art. 50)",
    body: "This assistant is an AI system. You are interacting with machine-generated text. That disclosure supports the transparency spirit of Article 50 of Regulation (EU) 2024/1689. Humans remain responsible for verifying anything they rely on.",
    linkHref: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
    linkLabel: "Official EUR-Lex text of Regulation (EU) 2024/1689",
  },
  {
    heading: "Privacy — mostly in-browser",
    body: "Chat messages stay in this tab’s memory (not uploaded to a TypeScript School server). Progress and preferences use localStorage. Opt-in model or embedding fetches may contact Hugging Face / CDN hosts allowed by the site CSP.",
  },
];
