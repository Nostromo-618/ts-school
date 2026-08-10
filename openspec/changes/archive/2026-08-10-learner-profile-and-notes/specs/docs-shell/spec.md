## ADDED Requirements

### Requirement: Navbar profile control

The primary navbar actions MUST include a profile control that navigates to `/profile`. The control MUST remain outside the collapsible menu’s `aria-hidden` region (same pattern as Search / Ask / theme controls) so it stays available to assistive technology when the mobile drawer is closed.

#### Scenario: Profile icon navigates

- **GIVEN** the shell on any content route after ToC acceptance
- **WHEN** the learner activates the profile navbar control
- **THEN** the app navigates to `/profile`

### Requirement: Dual dock for AI and notes sidebars

The application shell MUST support layout insets when the AI chat sidebar is pinned and when the notes sidebar is pinned (left or right). AI pin and notes pin MUST be independent. Site CSS MAY extend the existing AI dock pattern; `app.css` MUST remain layout/positioning only (no component-surface restyles).

#### Scenario: AI pinned right and notes pinned left

- **GIVEN** a wide viewport with AI chat pinned and notes pinned to the left
- **WHEN** the shell renders
- **THEN** main content is inset from both sides so neither pane permanently covers reading content

#### Scenario: Narrow viewport overlays

- **GIVEN** a viewport below the dock breakpoint
- **WHEN** notes or AI chat is open
- **THEN** panes MAY overlay without requiring dual permanent insets
