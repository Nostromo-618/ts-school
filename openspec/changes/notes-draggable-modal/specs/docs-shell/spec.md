## MODIFIED Requirements

### Requirement: Dual dock for AI and notes sidebars

The application shell MUST support layout insets when the AI chat sidebar is pinned. Notes MUST render as a floating overlay window and MUST NOT participate in permanent left/right dock insets for primary content. AI pin state MUST remain independent of whether notes are open. Site CSS MAY retain the existing AI dock pattern; `app.css` MUST remain layout/positioning only (no component-surface restyles). Legacy notes dock variables and `is-notes-pinned-*` shell classes MUST be removed or no-oped so they no longer inset content.

#### Scenario: AI pinned right and notes pinned left

- **GIVEN** a wide viewport with AI chat pinned and notes open as a floating window (legacy “notes pinned left” no longer applies)
- **WHEN** the shell renders
- **THEN** main content is inset for the AI dock only, and notes overlay without adding a permanent notes dock inset from either side

#### Scenario: Narrow viewport overlays

- **GIVEN** a viewport below the AI dock breakpoint
- **WHEN** notes or AI chat is open
- **THEN** panes MAY overlay without requiring permanent dual insets
