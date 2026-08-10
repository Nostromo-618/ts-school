## 1. Licenses and notices

- [ ] 1.1 Add root MIT `LICENSE`
- [ ] 1.2 Add `THIRD-PARTY-NOTICES.md` (vd3/Open Color/Phosphor, LiteRT, Gemma, embedding model)
- [ ] 1.3 Link LICENSE + notices from README, About, and Terms

## 2. AI risk modal

- [ ] 2.1 Add `src/content/ai-disclaimer.ts` + `src/lib/ai-disclaimer.ts` + composable
- [ ] 2.2 Add `AiRiskGate.vue` (dialog, focus trap, Escape = decline)
- [ ] 2.3 Wire open Ask → gate → sidebar in App / aiChat store / TsAiChatSidebar
- [ ] 2.4 Unit tests for storage/composable; e2e accept/decline/version re-consent

## 3. Navbar frost

- [ ] 3.1 Override vd3 glass tokens in `app.css` for stronger frost (including top-of-page)
- [ ] 3.2 Update visual baselines if needed

## 4. Content wave 0–1 (truth)

- [ ] 4.1 Audit/fix about, home, history, footer, curriculum copy for build-time Strada honesty
- [ ] 4.2 Fix meta-lesson dual-install / no live-worker claims; mention `typescript-strada` vs `@typescript/typescript6`
- [ ] 4.3 Fix runtime-boundary track order (`unknown-vs-any` before `where-types-end`)
- [ ] 4.4 Fix misfit pedagogy called out in content-quality-overhaul
- [ ] 4.5 Add unit stale-phrase grep gate; regenerate diagnostics

## 5. Content wave 2 (12 intermediate interactivity)

Add quiz and/or exercise + solution to:

- [ ] 5.1 `const-assertions`
- [ ] 5.2 `exhaustiveness-checking`
- [ ] 5.3 `readonly-and-immutability`
- [ ] 5.4 `type-widening-and-freshness`
- [ ] 5.5 `in-operator-narrowing`
- [ ] 5.6 `instanceof-narrowing`
- [ ] 5.7 `void-and-never`
- [ ] 5.8 `indexed-access-types`
- [ ] 5.9 `utility-types-tour`
- [ ] 5.10 `mapped-types-intro`
- [ ] 5.11 `type-only-vs-value-imports`
- [ ] 5.12 `nouncheckedindexedaccess`
- [ ] 5.13 Regenerate diagnostics; run compiler-truth

## 6. Content wave 3 (enrichment)

- [ ] 6.1 Add at least one flowchart enrichment via vd3-cbun
- [ ] 6.2 Improve async glossary / assignability discoverability
- [ ] 6.3 Add security notes outside runtime-boundary where relevant
- [ ] 6.4 Highlight-vs-diagnostic line audit for touched lessons

## 7. Critical-path tests and gate

- [ ] 7.1 Expand a11y routes + overlay states; mobile responsive e2e
- [ ] 7.2 AI markdown XSS unit + e2e; AI edit Accept/Reject e2e
- [ ] 7.3 Static diagnostics edit-invariance e2e; exercise fail path; TOC version re-gate
- [ ] 7.4 Add `pnpm gate:release`; wire Chromium Desktop Playwright into CI
- [ ] 7.5 Ensure bundle-isolation dist scan runs after build in gate

## 8. Docs and archive

- [ ] 8.1 README release checklist, security/AI modal, deferred intermediate gaps
- [ ] 8.2 Archive completed sibling changes when ready (`lesson-ai-assistant`, `neptune-curriculum-search`, force-ts7, content-quality-overhaul proposal fold-in)
- [ ] 8.3 Run `pnpm gate:release` and fix failures
