import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  js.configs.recommended,
  // `flat/essential` = bug-prevention rules only. Formatting is owned by
  // Prettier, so we deliberately avoid `flat/recommended`'s stylistic rules
  // (max-attributes-per-line, singleline-html-element-content-newline, …).
  ...vue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: vueParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        // Primary package is typescript@7; the parser runs against Strada via
        // pnpm overrides. Suppress the hard error if resolution still sees 7.
        warnOnUnsupportedTypeScriptVersion: false,
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        queueMicrotask: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        performance: 'readonly',
        getComputedStyle: 'readonly',
        MutationObserver: 'readonly',
        ResizeObserver: 'readonly',
        IntersectionObserver: 'readonly',
        HTMLElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        Element: 'readonly',
        Node: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        KeyboardEvent: 'readonly',
        MouseEvent: 'readonly',
        URL: 'readonly',
        CSS: 'readonly',
        // Shared Web APIs used across the app (matchMedia, observers, fetch).
        Worker: 'readonly',
        MessageEvent: 'readonly',
        MessagePort: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        AbortController: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
        HTMLElementTagNameMap: 'readonly',
        SVGElementTagNameMap: 'readonly',
        ElementTagNameMap: 'readonly',
      },
    },
    rules: {
      // TypeScript (vue-tsc) handles undefined identifiers and DOM lib types;
      // base `no-undef` only produces false positives on types in a TS project.
      'no-undef': 'off',
      // SFC <script> strings must escape `</script>` as `<\/script>` to avoid
      // closing the block early — a necessary escape eslint can't see is needed.
      'no-useless-escape': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      // TypeScript (vue-tsc, noUnusedLocals/noUnusedParameters) already enforces
      // unused-variable checks across the typed codebase and understands type
      // signatures; base `no-unused-vars` only adds false positives here.
      'no-unused-vars': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // ── Security posture, mechanically enforced ──────────────────────
      // ts-school runs a real compiler over learner-authored source but never
      // EXECUTES it: there is no eval, no Function constructor, no dynamic
      // code path of any kind. These make that a lint failure, not a habit.
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      // Lesson code is plain text rendered into <textarea>/<pre>; nothing in
      // the lesson pipeline may open an HTML injection surface.
      'vue/no-v-html': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "AssignmentExpression[left.type='MemberExpression'][left.property.name='innerHTML']",
          message:
            'Avoid assigning to innerHTML directly; render text nodes or build nodes with the DOM API.',
        },
      ],
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    // Escaped Labs markdown only — assistant bubbles / notes preview, not the
    // lesson pipeline.
    files: [
      'src/overlays/TsAiChatSidebar.vue',
      'src/overlays/TsNotesSidebar.vue',
    ],
    rules: {
      'vue/no-v-html': 'off',
    },
  },
  {
    // Node CLI / build scripts print progress to stdout by design.
    files: ['scripts/**/*.mjs', 'scripts/**/*.cjs', 'scripts/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    // CLI compare harness is intentionally chatty on stdout.
    files: ['scripts/school-model-compare.mjs'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    // Adversarial XSS / DOM fixtures assert forbidden patterns on purpose.
    files: [
      'tests/unit/chat-markdown-xss.spec.ts',
      'tests/unit/notes-markdown.spec.ts',
      'tests/e2e/ai-chat-markdown.spec.ts',
    ],
    rules: {
      'no-script-url': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  },
  {
    files: ['**/*.mjs', '**/*.cjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
  {
    // `eslint .` walks only .js/.mjs/.cjs plus whatever extensions a config
    // block names, so without this the TypeScript sources are never linted at
    // all — and the security rules above (no eval, no Function constructor, no
    // javascript: URL, no innerHTML) would never run on the code that actually
    // compiles learner input. Rules and parser come from the general block.
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'coverage/**',
      // Build output of the type-check harness (scripts/harness/), and the
      // copy of the TypeScript standard library that scripts/sync-ts-libs.mjs
      // drops into public/. Both are generated, and the second is 2.8 MB of
      // .d.ts that no lint rule has an opinion about.
      '.harness-dist/**',
      'public/ts-lib/**',
      // Throwaway local screenshot/debug scripts (not application code).
      '__*.mjs',
    ],
  },
];
