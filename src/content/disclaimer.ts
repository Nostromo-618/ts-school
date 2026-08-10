/**
 * Terms of use / disclaimer copy shown by the mandatory consent gate.
 *
 * Bump `TOC_VERSION` when this text changes meaningfully so returning
 * visitors must re-accept. Stored acceptance shape:
 * `{ version: string, acceptedAt: string }` under `TOC_STORAGE_KEY`.
 */

/** Bump when disclaimer clauses change in a way that needs re-consent. */
export const TOC_VERSION = "2";

/** localStorage key for versioned acceptance JSON. */
export const TOC_STORAGE_KEY = "ts-school-toc-accepted";

export const DISCLAIMER_TITLE = "Before you continue";

export const DISCLAIMER_INTRO =
  "Please read and accept these terms to use TypeScript School (lessons, curriculum, glossary, and related pages). If you decline, the site stays locked until you accept — you can return later to re-read these terms.";

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
    body: "TypeScript School is a personal hobby / educational project. It is not a commercial product, not professional training or certification, and not legal, career, or security advice. It is not affiliated with, endorsed by, or sponsored by Microsoft, the TypeScript team, Node.js, Deno, Bun, or any related trademark holders unless a page explicitly says otherwise.",
  },
  {
    heading: "As-is — no warranties",
    body: "The site, lessons, code samples, diagnostics, and related materials are provided free of charge, “as is,” without warranties of any kind — express or implied — including merchantability, fitness for a particular purpose, accuracy, completeness, or uninterrupted availability. Compiler diagnostics and examples can be incomplete, outdated, or wrong for your environment.",
  },
  {
    heading: "Limitation of liability",
    body: "To the fullest extent permitted by law, the author and contributors assume no responsibility and are not liable for any loss, damage, security incident, outage, data loss, career outcome, exam result, production incident, or other consequence arising from your use of this site or from following (or not following) its lessons. You alone decide what to run in your projects and how to verify it.",
  },
  {
    heading: "AI-assisted content (EU AI Act Art. 50 transparency)",
    body: "Substantial parts of this site’s content may be AI-generated or AI-assisted. That is disclosed here to meet the transparency spirit of Article 50 of the EU Artificial Intelligence Act (Regulation (EU) 2024/1689). AI output can be wrong or incomplete. Humans remain responsible for verifying anything they rely on.",
    linkHref: AI_ACT_EUR_LEX_URL,
    linkLabel: "Official EUR-Lex text of Regulation (EU) 2024/1689",
  },
  {
    heading: "Privacy & local storage",
    body: "Progress, theme preference, and terms acceptance stay in this browser’s localStorage. They are not uploaded to a server, and there is no account or cloud sync. Clearing site data, switching browsers or devices, or using private/incognito mode can erase everything.",
  },
  {
    heading: "License vs disclaimer",
    body: "The project’s source and site content are offered under the MIT License (see the repository’s LICENSE and THIRD-PARTY-NOTICES.md, also served at /LICENSE and /THIRD-PARTY-NOTICES.md). MIT covers copyright permission to use the code and content. This disclaimer covers liability, warranties, affiliation, and how you use the material. Accepting these terms does not replace or conflict with MIT; declining means you simply do not use the site. Opening the Ask assistant requires an additional AI risk acceptance.",
  },
  {
    heading: "Your responsibility",
    body: "By accepting, you confirm you are old enough to use the site where you live, that you understand the limits above, and that you will not treat lessons or diagnostics as professional advice or guaranteed outcomes. If you do not agree, decline — you can re-read these terms later, but the site remains unavailable until you accept.",
  },
];

export const FAREWELL_TITLE = "You chose not to accept";

export const FAREWELL_BODY =
  "That’s okay. Without accepting the terms, TypeScript School cannot unlock lessons, the curriculum, or related features. Come back to re-read the disclaimer whenever you are ready.";
