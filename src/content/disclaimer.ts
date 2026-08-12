/**
 * Terms of use / disclaimer copy shown by the mandatory consent gate.
 *
 * Bump `TOC_VERSION` when this text changes meaningfully so returning
 * visitors must re-accept. Stored acceptance shape:
 * `{ version: string, acceptedAt: string }` under `TOC_STORAGE_KEY`.
 *
 * AI assistant risks (local model, hallucinations, edit Accept, Art. 50,
 * privacy) live here — there is no separate Ask / AI risk modal.
 */

/** Bump when disclaimer clauses change in a way that needs re-consent. */
export const TOC_VERSION = "5";

/** localStorage key for versioned acceptance JSON. */
export const TOC_STORAGE_KEY = "ts-school-toc-accepted";

export const DISCLAIMER_TITLE = "Before you continue";

export const DISCLAIMER_INTRO =
  "Please read and accept these terms to use TypeScript School (lessons, curriculum, glossary, Ask assistant, and related pages). If you decline, the site stays locked until you accept — you can return later to re-read these terms.";

/** EUR-Lex link for Art. 50 / AI Act transparency (plain-language citation). */
export const AI_ACT_EUR_LEX_URL =
  "https://eur-lex.europa.eu/eli/reg/2024/1689/oj";

export interface DisclaimerSection {
  heading: string;
  body: string;
  /** Optional external citation link shown after the body. */
  linkHref?: string;
  linkLabel?: string;
}

export const DISCLAIMER_SECTIONS: DisclaimerSection[] = [
  {
    heading: "Hobby project — not a product",
    body: "TypeScript School is a personal hobby / educational project. It is not a commercial product, not professional training or certification, and not legal, career, security, or production advice. It is not affiliated with, endorsed by, or sponsored by Microsoft, the TypeScript team, Node.js, Deno, Bun, or any related trademark holders unless a page explicitly says otherwise. Lesson text and the optional Ask assistant are both covered by these limits.",
  },
  {
    heading: "As-is — no warranties",
    body: "The site, lessons, code samples, diagnostics, Ask answers, and related materials are provided free of charge, “as is,” without warranties of any kind — express or implied — including merchantability, fitness for a particular purpose, accuracy, completeness, or uninterrupted availability. Compiler diagnostics and examples can be incomplete, outdated, or wrong for your environment.",
  },
  {
    heading: "Limitation of liability",
    body: "To the fullest extent permitted by law, the author and contributors assume no responsibility and are not liable for any loss, damage, security incident, outage, data loss, career outcome, exam result, production incident, or other consequence arising from your use of this site or from following (or not following) its lessons or assistant output. You alone decide what to run in your projects and how to verify it.",
  },
  {
    heading: "AI-assisted content & Ask assistant (EU AI Act Art. 50)",
    body: "Substantial parts of this site’s content may be AI-generated or AI-assisted. The optional Ask sidebar is itself an AI system that produces machine-generated text. That is disclosed here to meet the transparency spirit of Article 50 of the EU Artificial Intelligence Act (Regulation (EU) 2024/1689). AI output — whether authored pages or live chat — can be wrong, incomplete, or invented. Prefer tool-backed citations and the authored curriculum over free-form claims. Humans remain responsible for verifying anything they rely on. Do not paste secrets into chat or apply suggested changes to production systems without your own review.",
    linkHref: AI_ACT_EUR_LEX_URL,
    linkLabel: "Official EUR-Lex text of Regulation (EU) 2024/1689",
  },
  {
    heading: "Ask assistant — local model resources",
    body: "Loading Gemma weights can use substantial RAM and GPU (WebGPU) and may briefly freeze the tab. Prefer the smaller E2B model on machines under ~16 GB RAM. You choose when to load; nothing downloads until you opt in (dev `.models/` mirror, browser Cache Storage after the first download, or Hugging Face). After a refresh you still click Load — GPU context is rebuilt — but cached weights should not re-download from the network.",
  },
  {
    heading: "Editor edits need your Accept",
    body: "When the Ask assistant proposes TypeScript edits, the site never silently overwrites the lesson editor. You must Accept or Reject each pending edit.",
  },
  {
    heading: "Privacy & local storage",
    body: "Progress, theme preference, notes, Ask chat history, and terms acceptance stay in this browser’s localStorage. Chat transcripts are not uploaded to a TypeScript School server. There is no account or cloud sync. You can clear chat history from the Ask sidebar or Profile, or remove everything with Clear all. Opt-in model or embedding fetches may contact Hugging Face / CDN hosts allowed by the site CSP. Clearing site data, switching browsers or devices, or using private/incognito mode can erase everything.",
  },
  {
    heading: "License vs disclaimer",
    body: "The project’s source and site content are offered under the MIT License (see the repository’s LICENSE and THIRD-PARTY-NOTICES.md, also served at /LICENSE and /THIRD-PARTY-NOTICES.md). MIT covers copyright permission to use the code and content. This disclaimer covers liability, warranties, affiliation, AI/assistant risks, and how you use the material. Accepting these terms does not replace or conflict with MIT; declining means you simply do not use the site.",
  },
  {
    heading: "Your responsibility",
    body: "By accepting, you confirm you are old enough to use the site where you live, that you understand the limits above (including Ask assistant risks), and that you will not treat lessons, diagnostics, or assistant output as professional advice or guaranteed outcomes. If you do not agree, decline — you can re-read these terms later, but the site remains unavailable until you accept.",
  },
];

export const FAREWELL_TITLE = "You chose not to accept";

export const FAREWELL_BODY =
  "That’s okay. Without accepting the terms, TypeScript School cannot unlock lessons, the curriculum, or related features. Come back to re-read the disclaimer whenever you are ready.";
