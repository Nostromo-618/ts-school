/// <reference types="vite/client" />

// Injected by Vite `define` from package.json (see vite.config.ts).
declare const __APP_VERSION__: string;

/** Chromium Device Memory API — often capped at 8; absent in Firefox/Safari typings. */
interface Navigator {
  readonly deviceMemory?: number;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<
    Record<string, never>,
    Record<string, never>,
    unknown
  >;
  export default component;
}

// Side-effect CSS bundles imported in main.ts. The vd3 line ships real types
// for its JS/Vue subpaths, so only the style entry points need an ambient
// declaration. Only the cbun bundles we actually use are declared — adding one
// here should mean a component from that bundle is genuinely on a page.
declare module "@vanduo-oss/vd3/css";
declare module "@vanduo-oss/vd3-cbun/charts/css";
declare module "@vanduo-oss/vd3-cbun/code-editor/css";
declare module "@vanduo-oss/vd3-cbun/flowchart/css";

declare module "@vanduo-oss/vdl-engines/neptune-search.js" {
  export class NeptuneSearch {
    constructor(options?: Record<string, unknown>);
    initFuzzy(): Promise<unknown>;
    initSemantic(): Promise<unknown>;
    fuzzySearch(query: string): Promise<unknown[]>;
    search(
      query: string,
      options?: { mode?: "fuzzy" | "semantic" | "hybrid" },
    ): Promise<{
      merged: Array<{
        doc: {
          id: string;
          title: string;
          route: string;
          icon?: string;
          category?: string;
          tab?: string;
          keywords?: string[];
          bodyText?: string;
        };
        score: number;
        source: "fuzzy" | "semantic";
      }>;
    }>;
    onSemanticProgress(
      callback: (data: { stage?: string; message?: string }) => void,
    ): () => void;
  }
  export const VDL_NEPTUNE_SEARCH_VERSION: string;
}

declare module "@vanduo-oss/vdl-engines/ai-chat.js" {
  export type AiChatLoadSource = "cache" | "local" | "network" | "unknown";
  export type AiChatLoadProgress = {
    stage?: string;
    message?: string;
    text?: string;
    loaded?: number;
    source?: AiChatLoadSource;
  };
  export type DescribedLoadProgress = {
    stage: string;
    progressPct: number;
    progressText: string;
    statusText: string;
    statusTone: "muted" | "warn" | "ok" | "danger";
    freezeHint: string;
    source: AiChatLoadSource;
  };
  export function inferLoadSource(progressText: unknown): AiChatLoadSource;
  export function describeLoadProgress(
    data: AiChatLoadProgress | Record<string, unknown> | null | undefined,
    options?: { likelyCached?: boolean; freezeHint?: string },
  ): DescribedLoadProgress;
  export const LOAD_FREEZE_HINT: string;
  export class AiChat {
    constructor(options?: Record<string, unknown>);
    registerTools(defs: unknown[]): void;
    setSystemPromptOptions(options: Record<string, unknown>): void;
    setModelId(
      modelId: string,
      options?: { resetMessages?: boolean; force?: boolean },
    ): Promise<void>;
    load(): Promise<void>;
    generate(
      text: string,
      onUpdate?: (partial: string) => void,
      onFinish?: (usage: unknown) => void,
    ): Promise<string>;
    generateWithTools(
      text: string,
      options: {
        execute: (
          name: string,
          args: Record<string, unknown>,
        ) => unknown | Promise<unknown>;
        maxRounds?: number;
        onUpdate?: (partial: string) => void;
        onFinish?: (usage: unknown) => void;
        onTool?: (info: unknown) => void;
      },
    ): Promise<string>;
    onProgress(callback: (data: AiChatLoadProgress) => void): () => void;
    isLoaded(): boolean;
    isLoading(): boolean;
    dispose(): Promise<void>;
    reset(): void;
  }
  export const MODEL_OPTIONS: Array<
    Record<string, unknown> & { id: string; label: string }
  >;
  export const TOOLS_UNSUPPORTED_ERROR: string;
  export const VDL_AI_CHAT_VERSION: string;
}

declare module "@vanduo-oss/vdl-engines/labs-md-to-html.js" {
  export function labsMarkdownToHtml(markdown: string): string;
}

declare module "@vanduo-oss/vdl-engines/guardrails/tools.js" {
  export function validateToolCall(options: {
    name: unknown;
    args?: unknown;
    allowlist: Iterable<string> | Array<{ name: string }>;
    maxArgsBytes?: number;
  }): { allowed: boolean; code?: string; message?: string };
  export function parseXmlToolCalls(text: string): {
    calls: Array<{ name: string; args: Record<string, unknown> }>;
    remainder: string;
  };
  export function formatXmlToolResult(name: string, result: unknown): string;
}

declare module "@vanduo-oss/vdl-engines/guardrails/llm.js" {
  export function validateLlmInput(input: unknown): {
    allowed: boolean;
    message?: string;
    code?: string;
    matchedPatternIds?: string[];
  };
  export function validateLlmOutput(input: unknown): {
    allowed: boolean;
    message?: string;
    code?: string;
    matchedPatternIds?: string[];
  };
  export function normalizeJailbreakScanText(text: string): string;
  export function buildChatSystemPrompt(
    options?: Record<string, unknown>,
  ): string;
}

declare module "@vanduo-oss/vdl-engines/guardrails/core.js" {
  export function toGuardrailError(result: unknown): Error;
}

declare module "@vanduo-oss/vdl-engines/guardrails/search.js" {
  export function validateSearchIndexPayload(payload: unknown): {
    allowed: boolean;
  };
}
