/**
 * Notes floating-window geometry — pure parse / clamp / default helpers.
 * Persistence keys live here so the store and hygiene layer share one source.
 */

export const NOTES_WINDOW_STORAGE_KEY = "ts-school-notes-window";
export const NOTES_FOLDED_KEY = "ts-school-notes-folded";
/** Legacy — read once for migrate, then deleted. */
export const NOTES_PINNED_KEY = "ts-school-notes-pinned";
export const NOTES_PIN_SIDE_KEY = "ts-school-notes-pin-side";

export const NOTES_WINDOW_SCHEMA_VERSION = 1 as const;

/** Minimum editable chrome size (CSS px). */
export const NOTES_MIN_WIDTH = 280;
export const NOTES_MIN_HEIGHT = 200;

/** Default expanded width ≈ former `22rem` sidebar. */
export const NOTES_DEFAULT_WIDTH = 352;

/** Matches shell free-move / AI dock breakpoint (`48rem`). */
export const NOTES_FREE_MOVE_BREAKPOINT_REM = 48;

export type NotesLegacyPinSide = "left" | "right";

export interface NotesWindowV1 {
  version: typeof NOTES_WINDOW_SCHEMA_VERSION;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** Parse and validate a geometry payload; reject wrong version / shape. */
export function parseNotesWindow(raw: unknown): NotesWindowV1 | undefined {
  if (!isPlainObject(raw)) return undefined;
  if (raw.version !== NOTES_WINDOW_SCHEMA_VERSION) return undefined;
  if (!isFiniteNumber(raw.x)) return undefined;
  if (!isFiniteNumber(raw.y)) return undefined;
  if (!isFiniteNumber(raw.width)) return undefined;
  if (!isFiniteNumber(raw.height)) return undefined;
  return {
    version: NOTES_WINDOW_SCHEMA_VERSION,
    x: raw.x,
    y: raw.y,
    width: raw.width,
    height: raw.height,
  };
}

export function defaultNotesHeight(viewport: ViewportSize): number {
  const fromVh = Math.round(viewport.height * 0.7);
  const cap = 32 * 16; // 32rem
  return Math.max(NOTES_MIN_HEIGHT, Math.min(fromVh, cap));
}

/**
 * Seed default geometry. Optional legacy pin side biases `x`
 * (left margin vs right-aligned).
 */
export function defaultNotesWindow(
  viewport: ViewportSize,
  legacySide?: NotesLegacyPinSide,
): NotesWindowV1 {
  const margin = 16;
  const width = Math.min(
    NOTES_DEFAULT_WIDTH,
    Math.max(NOTES_MIN_WIDTH, viewport.width - margin * 2),
  );
  const height = Math.min(
    defaultNotesHeight(viewport),
    Math.max(NOTES_MIN_HEIGHT, viewport.height - margin * 2),
  );
  const y = Math.max(margin, viewport.height - height - margin);
  const x =
    legacySide === "left"
      ? margin
      : Math.max(margin, viewport.width - width - margin);

  return clampNotesWindow(
    {
      version: NOTES_WINDOW_SCHEMA_VERSION,
      x,
      y,
      width,
      height,
    },
    viewport,
  );
}

/**
 * Clamp size to min / viewport and keep a usable title-bar strip on-screen.
 * Title-bar hit target ≈ 40px tall along the top edge of the window.
 */
export function clampNotesWindow(
  win: NotesWindowV1,
  viewport: ViewportSize,
): NotesWindowV1 {
  const vw = Math.max(1, viewport.width);
  const vh = Math.max(1, viewport.height);

  let width = Math.max(NOTES_MIN_WIDTH, win.width);
  let height = Math.max(NOTES_MIN_HEIGHT, win.height);
  width = Math.min(width, vw);
  height = Math.min(height, vh);

  const titleH = Math.min(40, height);
  // Keep at least `titleH` of the top edge inside the viewport.
  let x = win.x;
  let y = win.y;

  const minX = -(width - Math.min(80, width));
  const maxX = vw - Math.min(80, width);
  x = Math.min(Math.max(x, minX), maxX);

  const minY = 0;
  const maxY = Math.max(0, vh - titleH);
  y = Math.min(Math.max(y, minY), maxY);

  return {
    version: NOTES_WINDOW_SCHEMA_VERSION,
    x,
    y,
    width,
    height,
  };
}

export function readLegacyPinSide(
  getItem: (key: string) => string | null,
): NotesLegacyPinSide | undefined {
  try {
    const raw = getItem(NOTES_PIN_SIDE_KEY);
    if (raw === "left") return "left";
    if (raw === "right") return "right";
    // Presence of pinned key alone still implies a former right default.
    if (getItem(NOTES_PINNED_KEY) !== null) return "right";
    return undefined;
  } catch {
    return undefined;
  }
}

export function parseFoldedFlag(raw: string | null): boolean {
  return raw === "1" || raw === "true";
}

export function serializeFoldedFlag(folded: boolean): string {
  return folded ? "1" : "0";
}

/** CSS px equivalent of the free-move breakpoint (assumes 16px root). */
export function notesFreeMoveBreakpointPx(
  rootFontSizePx = 16,
): number {
  return NOTES_FREE_MOVE_BREAKPOINT_REM * rootFontSizePx;
}

export function isNotesFreeMoveViewport(
  viewportWidth: number,
  rootFontSizePx = 16,
): boolean {
  return viewportWidth >= notesFreeMoveBreakpointPx(rootFontSizePx);
}
