# learner-notes Specification

## Purpose
Lets learners keep local study notes in a pinable sidebar beside any route, with plain text editing, safe markdown preview, and syntax-highlighted TypeScript code fences under the site CSP — separate from the AI chat sidebar.
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

The shell MUST provide a notes sidebar distinct from the AI chat sidebar. Both sidebars MAY be open at the same time. Closing notes MUST NOT close AI chat and vice versa.

#### Scenario: Both open

- **GIVEN** AI chat is open
- **WHEN** the learner opens notes
- **THEN** both sidebars remain available and neither replaces the other

### Requirement: Notes pin left or right

Notes MUST support a pin control. When pinned, notes MUST dock to either the left or the right edge (learner choice), but not both simultaneously (left XOR right). Pin side preference MUST persist in localStorage under a school-owned key. Unpinned notes MAY overlay without permanently reserving dock space.

#### Scenario: Pin right docks content

- **GIVEN** a viewport at or above the notes dock breakpoint
- **WHEN** notes are open and pinned to the right
- **THEN** primary content is inset so it is not covered by the notes pane

#### Scenario: Switch pin side

- **GIVEN** notes pinned to the right
- **WHEN** the learner chooses pin left
- **THEN** the dock moves to the left and the right inset is released

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

### Requirement: Navbar opens notes

The primary navbar actions MUST include a control that opens the notes sidebar. The control MUST be reachable on desktop and from the mobile navbar actions pattern used for Ask/Search.

#### Scenario: Open notes from navbar

- **GIVEN** the shell rendered on any content route
- **WHEN** the learner activates the notes navbar control
- **THEN** the notes sidebar opens

