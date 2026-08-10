# learner-notes Specification

## Purpose
Lets learners keep local study notes in a floating, draggable notes modal beside any route, with plain text editing, safe markdown preview, and syntax-highlighted TypeScript code fences under the site CSP — separate from the AI chat sidebar.
## Requirements
### Requirement: Versioned notes store in localStorage

The system MUST persist learner notes under the localStorage key `ts-school-notes` with a numeric schema `version`. On read, corrupt or wrong-version payloads MUST be discarded and treated as empty notes. Notes MUST be client-only and MUST NOT use vite-ssg `initialState`. Until size requires otherwise, localStorage is the persistence target (not IndexedDB).

#### Scenario: Valid notes round-trip

- **GIVEN** a notes payload matching the current schema version
- **WHEN** it is written and read back
- **THEN** the note body is restored

#### Scenario: Corrupt notes discarded

- **GIVEN** localStorage contains an invalid notes payload
- **WHEN** the notes store hydrates
- **THEN** notes are empty and the invalid payload is not applied
### Requirement: Notes sidebar is separate from AI chat

The shell MUST provide a notes floating modal distinct from the AI chat sidebar. Both MAY be open at the same time. Closing notes MUST NOT close AI chat and vice versa. Notes MUST NOT permanently reserve left or right dock insets for main content. When both are open, the notes modal MUST remain usable (visible and interactive) without replacing Ask AI.

#### Scenario: Both open

- **GIVEN** AI chat is open
- **WHEN** the learner opens notes
- **THEN** both remain available and neither replaces the other

#### Scenario: Notes do not dock-inset content

- **GIVEN** notes are open on a wide viewport
- **WHEN** the shell lays out primary content
- **THEN** main content is not permanently inset solely because notes are open

### Requirement: Navbar opens notes

The primary navbar actions MUST include a control that opens the notes modal. The control MUST be reachable on desktop and from the mobile navbar actions pattern used for Ask/Search.

#### Scenario: Open notes from navbar

- **GIVEN** the shell rendered on any content route
- **WHEN** the learner activates the notes navbar control
- **THEN** the notes modal opens
### Requirement: Plain text edit and markdown preview

Notes MUST allow editing as plain text and MUST offer a markdown preview mode. Preview MUST use a CSP-safe escaped markdown pipeline (no arbitrary script execution, no `javascript:` navigation). Fenced code blocks MUST be treated as markdown code fences; TypeScript (and plain) fences MUST receive syntax highlighting via a CSP-compatible highlighter already used by the site (vd3-cbun code surfaces or equivalent safe highlighter) — not a CDN script tag.

#### Scenario: Adversarial markdown inert in preview

- **GIVEN** note body containing `<script>` tags or `javascript:` links
- **WHEN** markdown preview renders
- **THEN** no script executes and `javascript:` links are not followed as navigation

#### Scenario: TypeScript fence highlights

- **GIVEN** a note with a fenced `ts` or `typescript` code block
- **WHEN** preview renders
- **THEN** the fence is visually distinguished as highlighted code without loading remote highlighter scripts
### Requirement: Notes floating modal window

When open, notes MUST render as a floating modal window over page content (not a docked sidebar). The window MUST expose a title bar (or equivalent chrome) with at least: fold/collapse control, close control, and a drag affordance. Edit and preview modes MUST remain available when the window is expanded (not folded). Closing the modal MUST hide it without deleting the note body.

#### Scenario: Open shows floating window

- **GIVEN** notes are closed
- **WHEN** the learner opens notes from the navbar
- **THEN** a floating notes window is visible over content with editor or preview chrome

#### Scenario: Close hides without wiping body

- **GIVEN** notes open with a non-empty body
- **WHEN** the learner closes the notes window
- **THEN** the window is hidden and `ts-school-notes` still contains the body after reload

### Requirement: Draggable notes window with persisted position

On viewports at or above the notes free-move breakpoint, the learner MUST be able to drag the notes window by its title-bar drag affordance to reposition it. Position MUST persist under a school-owned localStorage key (geometry payload). On restore and after viewport resize, position MUST be clamped so a usable portion of the title bar remains within the viewport.

#### Scenario: Drag persists across reload

- **GIVEN** a wide viewport with notes open
- **WHEN** the learner drags the window to a new position and reloads, then reopens notes
- **THEN** the window appears at the persisted position (within clamp rules)

#### Scenario: Off-screen position clamped

- **GIVEN** a stored position that would place the title bar fully outside the viewport
- **WHEN** notes open or the viewport resizes
- **THEN** the window is moved so the title bar remains interactable within the viewport

### Requirement: Resizable notes window with constraints

On viewports at or above the notes free-move breakpoint, the notes window MUST be resizable by the learner. Size MUST persist with position in the geometry localStorage payload. The system MUST enforce minimum width and height suitable for editing, and MUST clamp size so the window does not exceed the viewport in a way that traps controls off-screen.

#### Scenario: Resize persists across reload

- **GIVEN** a wide viewport with notes open
- **WHEN** the learner resizes the window and reloads, then reopens notes
- **THEN** width and height match the persisted size (within clamp and minimum rules)

#### Scenario: Below minimum rejected

- **GIVEN** notes open on a wide viewport
- **WHEN** the learner attempts to resize below the minimum dimensions
- **THEN** the window stays at least the minimum width and height

### Requirement: Foldable notes window

The notes window MUST support a folded (collapsed) state that shows title-bar chrome only (or equivalent compact chrome) and hides the editor/preview body. Fold state MUST persist under a school-owned localStorage key. Unfolding MUST restore the editor/preview without losing the note body. Fold MUST remain available on narrow viewports when the sheet fallback is active.

#### Scenario: Fold hides body

- **GIVEN** notes open and expanded
- **WHEN** the learner activates fold
- **THEN** the editor/preview body is hidden and title-bar chrome remains

#### Scenario: Fold persists across reload

- **GIVEN** notes folded
- **WHEN** the learner reloads and reopens notes
- **THEN** the window opens in the folded state

### Requirement: Notes modal accessibility

The notes window MUST be operable with keyboard: close and fold controls MUST be reachable, and when expanded the editor MUST be focusable. The window root MUST expose an appropriate accessible name (e.g. dialog or complementary landmark labeled “Notes”). Drag and resize MUST NOT be the only way to keep the window usable — clamp rules and fold/close MUST remain keyboard-reachable. Pointer drag/resize MAY be mouse/touch-primary; keyboard equivalents for fine repositioning are optional if documented as non-goals, but focus order MUST NOT trap the learner inside the modal when closed or folded incorrectly.

#### Scenario: Keyboard close

- **GIVEN** notes open and focus within the notes window
- **WHEN** the learner activates the close control via keyboard
- **THEN** the notes window closes

#### Scenario: Accessible name present

- **GIVEN** notes open
- **WHEN** assistive technology inspects the window root
- **THEN** an accessible name identifying Notes is present

### Requirement: Narrow viewport notes sheet fallback

Below the notes free-move breakpoint, the system MUST present notes as a near-full-viewport sheet (or equivalent) instead of requiring free drag repositioning. Resize gestures that conflict with scrolling MAY be disabled or simplified on narrow viewports; fold and close MUST still work. Opening notes from the navbar MUST still succeed on mobile viewport widths used by the site’s responsive e2e suite.

#### Scenario: Mobile open as sheet

- **GIVEN** a viewport below the free-move breakpoint
- **WHEN** the learner opens notes
- **THEN** notes appear as a near-full-viewport overlay sheet with fold and close available

#### Scenario: Mobile does not require dock insets

- **GIVEN** notes open below the free-move breakpoint
- **WHEN** the shell lays out primary content
- **THEN** notes do not permanently inset main content as a docked sidebar
