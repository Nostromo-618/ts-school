## ADDED Requirements

### Requirement: Glass navbar uses stronger site-level frost

The docs shell primary navbar MUST override vd3 glass tokens so the bar is frosted (not fully transparent) at the top of the page and more opaque when scrolled, without modifying the vd3 package.

#### Scenario: CSS override ownership
- **WHEN** styles are inspected for `.vd-navbar.vd-navbar-glass`
- **THEN** stronger frost is applied from site `app.css` token overrides
