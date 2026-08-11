## ADDED Requirements

### Requirement: AiChat resolves from the npm registry

The lesson AI assistant dependency `@vanduo-oss/vdl-ai-chat` MUST be declared
as a semver range against the public npm registry (at least `^0.1.0`) and MUST
NOT be installed via a `file:` path to a sibling clone. Import module
specifiers remain `@vanduo-oss/vdl-ai-chat` and its published subpaths.

#### Scenario: lockfile resolves registry package
- **GIVEN** a clean clone with no sibling VDL repositories
- **WHEN** dependencies are installed with the pinned pnpm toolchain
- **THEN** `@vanduo-oss/vdl-ai-chat` resolves from the configured npm registry
  (not a `file:` directory link)
