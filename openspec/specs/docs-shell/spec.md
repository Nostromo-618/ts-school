# docs-shell Specification

## Purpose
The persistent frame around every page: a branded navbar, a tier-aware sidebar
over the derived navigation tree, a footer, a global search palette over the
derived index, and theme switching and customisation — all built from the
published `@vanduo-oss/vd3` components and classes, and all safe under the
site's Content-Security-Policy.
## Requirements
### Requirement: a persistent application shell

Every route MUST render inside a shell providing a navbar, a footer, the global
search overlay, and the theme controls. The shell SHALL be part of the
prerendered HTML, not assembled on hydration.

#### Scenario: a reader lands on a deep link

- **GIVEN** a prerendered lesson page requested directly
- **WHEN** the HTML is served before any JavaScript runs
- **THEN** the navbar, the sidebar, the page content, and the footer are all
  present in the markup

#### Scenario: the shell survives navigation

- **GIVEN** the shell rendered on one route
- **WHEN** the reader follows a link to another route
- **THEN** the navbar, sidebar, and footer are not remounted, and the sidebar's
  filter text is preserved

### Requirement: shell built from the published component library

The shell MUST render the components and CSS classes that `@vanduo-oss/vd3`
actually ships, and MUST NOT reimplement a component the package exports or use
a class name the package's stylesheet does not define. Site-local components
SHALL NOT be named after package components.

#### Scenario: a class name is verified before use

- **GIVEN** a class applied by any shell component
- **WHEN** the package's stylesheet is searched for it
- **THEN** it is found, or the class belongs to the small layout-only set
  defined in `src/styles/app.css`

#### Scenario: no site component shadows a package component

- **GIVEN** a file under `src/layout/`, `src/overlays/`, or `src/components/`
- **WHEN** its name is compared against the package's exports
- **THEN** it does not collide, so a reader can tell first-party from package
  code by the name alone

#### Scenario: the site stylesheet stays layout-only

- **GIVEN** `src/styles/app.css`
- **WHEN** its rules are inspected
- **THEN** they define page flow, spacing, and positioning, and no rule styles a
  button, badge, card, breadcrumb, or other component surface

### Requirement: navigation derived from the curriculum

The sidebar MUST render the `NavTree` derived from the curriculum registry, with
one group per track under the selected tier, and MUST NOT contain a hand-written
page list. The navbar SHALL link to the standalone pages the tree declares.

#### Scenario: a new lesson appears in the sidebar

- **GIVEN** a lesson added to the registry
- **WHEN** the site is rebuilt
- **THEN** it appears in the sidebar under its track, within its tier's tab,
  with no edit to any shell component

#### Scenario: the sidebar follows the reader's level

- **GIVEN** a reader opening a lesson at the intermediate tier
- **WHEN** the page renders
- **THEN** the sidebar's intermediate tab is selected, so the lessons in view
  are the ones at that reader's level

#### Scenario: a reader overrides the tier

- **GIVEN** a reader who selects a different tier tab
- **WHEN** they stay on the current page
- **THEN** the chosen tab remains selected until they navigate to a lesson at
  another tier

### Requirement: sidebar filter

The sidebar MUST offer a text filter that narrows the visible entries by title
and by the entry's search terms, and SHALL hide a track group that has no
remaining entries.

#### Scenario: filtering by a word that is not in any title

- **GIVEN** the filter text matching a lesson's summary or keywords but not its
  title
- **WHEN** the sidebar re-renders
- **THEN** that lesson remains visible

#### Scenario: filtering to nothing

- **GIVEN** filter text matching no entry
- **WHEN** the sidebar re-renders
- **THEN** no empty track heading is shown

### Requirement: global search over the derived index

A keyboard-reachable search palette MUST open on `cmd`/`ctrl`+K and on `/`
outside a text field, search the index derived from the navigation tree, group
results by their tier and track, support arrow-key and Enter selection and
Escape to close, and navigate client-side on selection.

#### Scenario: a reader searches for a topic

- **GIVEN** the palette open
- **WHEN** the reader types at least two characters matching a lesson's title,
  keywords, summary, or route
- **THEN** matching lessons are listed, grouped by tier and track, titles first

#### Scenario: the slash shortcut respects text fields

- **GIVEN** focus inside an input or textarea
- **WHEN** the reader types `/`
- **THEN** the character is inserted and the palette does not open

#### Scenario: selecting a result navigates

- **GIVEN** a highlighted result
- **WHEN** the reader presses Enter or clicks it
- **THEN** the router navigates to that lesson and the palette closes and clears

### Requirement: search highlighting renders as text

Matched query text MUST be emphasised without constructing HTML. The search
overlay SHALL NOT use `v-html`, assign to `innerHTML`, or build markup as a
string.

#### Scenario: a result title containing markup characters

- **GIVEN** a lesson title containing `<`, `>`, or `&`
- **WHEN** it is rendered as a search result with part of it highlighted
- **THEN** the characters appear literally, because every segment is a text node
  and only the emphasis element is markup

#### Scenario: the linter enforces it

- **GIVEN** the repository's ESLint configuration
- **WHEN** the shell is linted
- **THEN** no `v-html` directive and no `innerHTML` assignment is reported,
  because none exists

### Requirement: theme switching and customisation

The shell MUST offer both a light/dark/system switcher and a theme customiser
covering primary colour, neutral colour, radius, and font. Both SHALL write
through a single source of preference truth, and a change in one SHALL be
immediately visible in the other. The preference SHALL persist across reloads.

#### Scenario: both controls stay in step

- **GIVEN** the customiser open and the switcher visible
- **WHEN** the reader changes the primary colour and then the theme mode
- **THEN** neither change reverts the other, because there is one writer of the
  preference

#### Scenario: the preference survives a reload

- **GIVEN** a reader who has chosen dark mode and a radius
- **WHEN** they reload the page
- **THEN** the same theme is applied, hydrated on mount rather than serialised
  into the page

#### Scenario: prerendering is unaffected

- **GIVEN** the static build
- **WHEN** the prerendered HTML is inspected
- **THEN** it contains no serialised theme state and no inline script, because
  the theme is read from client storage after mount

### Requirement: icons and fonts served same-origin

Icon and text fonts MUST be served from the site's own origin, emitted by the
build from the package's stylesheet, with no CDN request and no duplicated copy
in `public/`. Only the icon weights the site renders SHALL be loaded.

#### Scenario: an icon renders under the policy

- **GIVEN** the built site loaded in a browser under `font-src 'self'`
- **WHEN** a page containing icons renders
- **THEN** the glyphs appear and the console reports no
  Content-Security-Policy violation

#### Scenario: no redundant asset copy

- **GIVEN** the repository's `public/` directory
- **WHEN** it is listed
- **THEN** it contains no font or icon files, because the package's stylesheet
  already carries them and the bundler emits them

#### Scenario: an icon name is verified before use

- **GIVEN** an icon name referenced by a track, a tier, or a shell component
- **WHEN** the package's stylesheet is searched for the corresponding `ph-*`
  rule
- **THEN** it is found, so no icon renders as an empty box

### Requirement: TypeScript School branding

The shell MUST present the site's own identity: brand mark and wordmark in the
navbar and footer, a matching favicon, and per-route titles and descriptions.
No donor branding SHALL remain.

#### Scenario: the page identifies itself

- **GIVEN** any prerendered page
- **WHEN** its `<head>` is inspected
- **THEN** the title ends with the site's name and the description describes
  this site

#### Scenario: no donor branding survives

- **GIVEN** the shell's source
- **WHEN** it is searched for the donor's product names, logos, and links
- **THEN** none is found

### Requirement: accessible shell navigation

The shell MUST remain usable by keyboard and assistive technology: a skip link
ahead of the navigation, labelled landmarks, an accessible name on every
icon-only control, and a dialog role with focus management on the search
palette.

#### Scenario: a keyboard user skips the navigation

- **GIVEN** a freshly loaded page
- **WHEN** the reader presses Tab once and activates the first control
- **THEN** focus moves to the page's main content, past the navbar and sidebar

#### Scenario: the palette traps and restores focus

- **GIVEN** the search palette opened from the navbar button
- **WHEN** it is closed with Escape
- **THEN** focus returns to the control that opened it

#### Scenario: icon-only controls are named

- **GIVEN** the search trigger, the theme switcher, the customiser trigger, and
  the mobile navigation toggle
- **WHEN** each is inspected
- **THEN** each exposes an accessible name that is not the icon glyph

### Requirement: Glass navbar uses stronger site-level frost

The docs shell primary navbar MUST override vd3 glass tokens so the bar is frosted (not fully transparent) at the top of the page and more opaque when scrolled, without modifying the vd3 package.

#### Scenario: CSS override ownership
- **WHEN** styles are inspected for `.vd-navbar.vd-navbar-glass`
- **THEN** stronger frost is applied from site `app.css` token overrides

