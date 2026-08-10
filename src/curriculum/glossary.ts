/**
 * The glossary.
 *
 * TypeScript's vocabulary is the barrier that a working JavaScript developer
 * hits first: an error message that says "not assignable" or "excess property"
 * is unreadable until those words mean something. Each term carries the tier it
 * first matters at, so the glossary can be filtered to the reader's level, and
 * links to the lessons that teach it — checked by `tests/unit/glossary.spec.ts`,
 * so a renamed lesson breaks the build rather than the page.
 */

import type { LessonId, Tier } from "./types";

export interface GlossaryTerm {
  /** Lowercase kebab-case slug; used as the anchor on `/glossary`. */
  id: string;
  term: string;
  /** The tier at which a reader first needs this word. */
  tier: Tier;
  /** One or two sentences. Plain text — rendered into a text node. */
  definition: string;
  /** Spellings and synonyms a reader might search for instead. */
  aliases?: string[];
  /** Lessons that teach the term. Every id must resolve. */
  related: LessonId[];
}

export const GLOSSARY: readonly GlossaryTerm[] = [
  {
    id: "abort-signal",
    term: "AbortSignal",
    tier: "intermediate",
    definition:
      "A cancellation token passed into async work. When aborted, listeners run and fetch-like APIs reject — typed as a parameter, not a return value.",
    aliases: ["AbortController", "cancellation", "signal"],
    related: ["abortsignal-and-cancellation", "async-await-typing"],
  },
  {
    id: "ambient-declaration",
    term: "Ambient declaration",
    tier: "beginner",
    definition:
      "A declaration that describes something which exists at runtime without defining it, written with the `declare` keyword. How TypeScript learns about globals and untyped packages.",
    aliases: ["declare"],
    related: ["declaration-files-intro", "shimming-untyped-dependencies"],
  },
  {
    id: "any",
    term: "any",
    tier: "beginner",
    definition:
      "The type that disables checking for every value derived from it. Assignable to and from everything, which is why one `any` at a module boundary silently spreads.",
    related: ["any-and-implicit-any", "unknown-vs-any"],
  },
  {
    id: "assertion-function",
    term: "Assertion function",
    tier: "intermediate",
    definition:
      "A function declared with an `asserts` return type that narrows its argument by throwing when the check fails, rather than returning a boolean.",
    aliases: ["asserts"],
    related: ["assertion-functions"],
  },
  {
    id: "assignability",
    term: "Assignability",
    tier: "beginner",
    definition:
      "The relation the checker evaluates when it asks whether a value of type A may be used where type B is expected. The subject of the most common error message in TypeScript.",
    aliases: ["subtyping", "not assignable"],
    related: ["structural-typing", "assignability-rules"],
  },
  {
    id: "async-await",
    term: "async / await",
    tier: "beginner",
    definition:
      "Syntax that makes a function return a Promise and unwraps one at await. An async function's return type is always `Promise`<T>, even when you write a bare T.",
    aliases: ["async", "await"],
    related: ["async-await-typing", "promise-types"],
  },
  {
    id: "awaited",
    term: "Awaited<T>",
    tier: "intermediate",
    definition:
      "The utility type that unwraps a promise as far as await would, recursively, including thenables that are not promises.",
    related: [
      "awaited-and-unwrapping",
      "promise-types",
      "async-await-typing",
      "promise-combinators",
    ],
  },
  {
    id: "bivariance",
    term: "Bivariance",
    tier: "advanced",
    definition:
      "Accepting a parameter type that is either wider or narrower than declared. TypeScript keeps method parameters bivariant on purpose, which is a deliberate hole in soundness.",
    related: ["variance-and-strict-function-types", "deliberate-unsoundness"],
  },
  {
    id: "bottom-type",
    term: "Bottom type",
    tier: "advanced",
    definition:
      "`never` — the type with no values. Assignable to everything and inhabited by nothing, which is what makes it useful for exhaustiveness checks.",
    aliases: ["never"],
    related: ["void-and-never", "exhaustiveness-checking"],
  },
  {
    id: "branded-type",
    term: "Branded type",
    tier: "advanced",
    definition:
      "A structural type carrying an extra marker property so it cannot be confused with another type of the same shape. The usual way to get nominal behaviour for ids.",
    aliases: ["opaque type", "nominal type"],
    related: ["branded-and-nominal-types", "branded-validated-types"],
  },
  {
    id: "checkjs",
    term: "checkJs",
    tier: "beginner",
    definition:
      "The compiler option that type-checks `.js` files as well as `.ts` files, using inference and JSDoc. The cheapest way to get value from TypeScript before renaming anything.",
    aliases: ["allowJs", "@ts-check"],
    related: ["allowjs-and-checkjs", "typing-javascript-with-jsdoc"],
  },
  {
    id: "conditional-type",
    term: "Conditional type",
    tier: "intermediate",
    definition:
      "T extends U ? X : Y — a branch evaluated by the type checker rather than at runtime. The basis of most of the standard utility types.",
    related: ["conditional-types-intro", "distributive-conditional-types"],
  },
  {
    id: "const-assertion",
    term: "const assertion",
    tier: "intermediate",
    definition:
      "Writing `as const` to stop a literal from widening, producing the most specific `readonly` type the value can have.",
    aliases: ["as const"],
    related: ["const-assertions", "inference-and-widening"],
  },
  {
    id: "const-type-parameter",
    term: "const type parameter",
    tier: "advanced",
    definition:
      "A type parameter declared <const T>, which infers as though the caller had written `as const` at the argument. Lets a library preserve literal types without asking users to.",
    related: ["const-type-parameters"],
  },
  {
    id: "construct-signature",
    term: "Construct signature",
    tier: "intermediate",
    definition:
      "new (...args) => T in a type, describing something that can be called with new. What you need to type a class itself rather than its instances.",
    related: ["call-and-construct-signatures", "mixins-and-constructor-types"],
  },
  {
    id: "contextual-typing",
    term: "Contextual typing",
    tier: "beginner",
    definition:
      "Inferring an expression's type from the position it appears in, which is why the parameters of an inline callback need no annotation.",
    related: ["contextual-typing"],
  },
  {
    id: "contravariance",
    term: "Contravariance",
    tier: "advanced",
    definition:
      "A type relation that reverses direction. Function parameters are contravariant: a handler that accepts a wider type is safe where a narrower one was expected.",
    related: ["variance-and-strict-function-types", "strictfunctiontypes"],
  },
  {
    id: "control-flow-analysis",
    term: "Control-flow analysis",
    tier: "advanced",
    definition:
      "The pass that computes a narrowed type per reference by walking the code as a graph. Everything you know as narrowing is its output.",
    aliases: ["CFA"],
    related: ["control-flow-analysis", "narrowing-that-does-not-survive"],
  },
  {
    id: "covariance",
    term: "Covariance",
    tier: "advanced",
    definition:
      "A type relation that preserves direction. Return types are covariant, and so are arrays — the latter unsoundly, since arrays are mutable.",
    related: ["variance-and-strict-function-types", "deliberate-unsoundness"],
  },
  {
    id: "declaration-file",
    term: "Declaration file",
    tier: "beginner",
    definition:
      "A .d.ts file containing types and no implementation. How a package, a global, or a compiled library describes itself to the checker.",
    aliases: [".d.ts", "typings"],
    related: ["declaration-files-intro", "installing-types"],
  },
  {
    id: "declaration-emit",
    term: "Declaration emit",
    tier: "advanced",
    definition:
      "The compiler generating .d.ts files from source. The step that produces the types your consumers actually see, and where inferred types must be nameable.",
    related: ["declaration-emit", "publishing-types"],
  },
  {
    id: "declaration-merging",
    term: "Declaration merging",
    tier: "intermediate",
    definition:
      "Two declarations with the same name in the same scope combining into one. The mechanism behind global augmentation and behind surprises from dependencies.",
    related: ["declaration-merging", "module-augmentation"],
  },
  {
    id: "decorator",
    term: "Decorator",
    tier: "advanced",
    definition:
      "A function applied to a class or its members with @ syntax. Two incompatible designs exist: the ECMAScript standard one and TypeScript's legacy experimental one.",
    related: ["decorators"],
  },
  {
    id: "discriminated-union",
    term: "Discriminated union",
    tier: "intermediate",
    definition:
      "A union whose members share a property with a distinct literal type, so checking that property narrows to exactly one member.",
    aliases: ["tagged union", "sum type"],
    related: ["discriminated-unions", "exhaustiveness-checking"],
  },
  {
    id: "distributive-conditional-type",
    term: "Distributive conditional type",
    tier: "advanced",
    definition:
      "A conditional type whose checked type is a naked type parameter, causing it to be applied to each member of a union separately.",
    related: ["distributive-conditional-types"],
  },
  {
    id: "dual-package-hazard",
    term: "Dual-package hazard",
    tier: "advanced",
    definition:
      "Shipping CommonJS and ESM builds of the same package so a program can load both, producing two copies of every class and type.",
    related: ["dual-package-hazard", "package-json-exports-and-types"],
  },
  {
    id: "enum",
    term: "enum",
    tier: "beginner",
    definition:
      "A TypeScript construct that emits runtime JavaScript. Not erasable, with assignability rules that differ from unions of literals — which usually do the job better.",
    related: ["enums-vs-literal-unions", "erasable-syntax-and-type-stripping"],
  },
  {
    id: "erasure",
    term: "Erasure",
    tier: "beginner",
    definition:
      "The removal of all type syntax before the code runs. Types cost nothing at runtime and, equally, do nothing at runtime.",
    aliases: ["type erasure"],
    related: ["types-are-erased", "where-types-end"],
  },
  {
    id: "erasable-syntax",
    term: "Erasable syntax",
    tier: "intermediate",
    definition:
      "TypeScript syntax that can be removed without changing behaviour. The `erasableSyntaxOnly` option rejects the rest, which is what native type stripping requires.",
    aliases: ["erasableSyntaxOnly", "type stripping"],
    related: [
      "erasable-syntax-and-type-stripping",
      "running-typescript-in-node",
    ],
  },
  {
    id: "excess-property-check",
    term: "Excess property check",
    tier: "intermediate",
    definition:
      "The extra check applied to a fresh object literal, rejecting properties the target type does not `declare`. It does not apply once the literal is in a variable.",
    aliases: ["freshness"],
    related: ["excess-property-checks", "type-widening-and-freshness"],
  },
  {
    id: "exhaustiveness-check",
    term: "Exhaustiveness check",
    tier: "intermediate",
    definition:
      "Assigning a narrowed value to `never` in an unreachable branch, so adding a union member turns every unhandled site into a compile error.",
    aliases: ["assertNever"],
    related: ["exhaustiveness-checking", "discriminated-unions"],
  },
  {
    id: "exports-map",
    term: "exports map",
    tier: "intermediate",
    definition:
      "The `package.json` field that declares a package's public entry points per condition — import, require, types — and hides everything else.",
    aliases: ["conditional exports", "subpath exports"],
    related: ["package-json-exports-and-types", "module-resolution-explained"],
  },
  {
    id: "floating-promise",
    term: "Floating promise",
    tier: "advanced",
    definition:
      "A promise that is `never` awaited or given a rejection handler. Since Node 15 an unhandled rejection terminates the process by default.",
    related: ["floating-promises-and-void"],
  },
  {
    id: "generic",
    term: "Generic",
    tier: "intermediate",
    definition:
      "A type, function, or class parameterised by a type the caller supplies, so it can be reused without forgetting what it was given.",
    related: ["generics-intro", "generic-constraints"],
  },
  {
    id: "index-signature",
    term: "Index signature",
    tier: "intermediate",
    definition:
      "[key: string]: T, declaring that `any` key of that type maps to T. Convenient, and the reason a typo'd lookup type-checks.",
    related: ["index-signatures", "nouncheckedindexedaccess"],
  },
  {
    id: "indexed-access-type",
    term: "Indexed access type",
    tier: "intermediate",
    definition:
      "Reading a property's type out of another type with T[\"key\"], including T[number] for an array's element type.",
    aliases: ["lookup type"],
    related: ["indexed-access-types"],
  },
  {
    id: "infer",
    term: "infer",
    tier: "advanced",
    definition:
      "A keyword usable only inside a conditional type's extends clause, capturing part of the matched type into a new type variable.",
    related: ["infer-keyword", "template-literal-inference"],
  },
  {
    id: "inference",
    term: "Inference",
    tier: "beginner",
    definition:
      "The compiler working out a type you did not write. Covers variable initialisers, return types, and generic type arguments.",
    related: ["annotations-vs-inference", "inferring-type-arguments"],
  },
  {
    id: "interface",
    term: "Interface",
    tier: "beginner",
    definition:
      "A named object type. Extensible with extends, mergeable across declarations, and generally the better error messages of the two naming forms.",
    related: ["interfaces-intro", "interface-vs-type-alias"],
  },
  {
    id: "intersection-type",
    term: "Intersection type",
    tier: "intermediate",
    definition:
      "A & B — a type with everything from both. Conflicting properties are reduced to `never` rather than rejected outright.",
    related: ["intersection-types"],
  },
  {
    id: "isolated-modules",
    term: "isolatedModules",
    tier: "intermediate",
    definition:
      "The option that restricts you to code a single-file transpiler can handle correctly, since esbuild and swc compile one file at a time with no type information.",
    aliases: ["verbatimModuleSyntax"],
    related: [
      "isolatedmodules-and-verbatimmodulesyntax",
      "bundlers-and-transpile-only",
    ],
  },
  {
    id: "keyof",
    term: "keyof",
    tier: "intermediate",
    definition:
      "The operator producing the union of an object type's keys. The starting point for mapped types, indexed access, and every typed property helper.",
    related: ["keyof-operator", "mapped-types-intro"],
  },
  {
    id: "lib",
    term: "lib",
    tier: "beginner",
    definition:
      "The built-in declaration files describing the JavaScript standard library and host environment. The lib option decides which are in scope — including whether DOM globals exist.",
    related: ["tsconfig-essentials", "node-builtin-modules"],
  },
  {
    id: "literal-type",
    term: "Literal type",
    tier: "beginner",
    definition:
      'A type with exactly one value, such as "GET" or 42. Unions of them replace magic strings with something the checker and the editor understand.',
    related: ["literal-types", "enums-vs-literal-unions"],
  },
  {
    id: "mapped-type",
    term: "Mapped type",
    tier: "intermediate",
    definition:
      "{ [K in `keyof` T]: … }, transforming every property of a type. `Partial`, `Readonly`, and `Record` are all defined this way.",
    related: ["mapped-types-intro", "mapped-type-modifiers"],
  },
  {
    id: "mixin",
    term: "Mixin",
    tier: "advanced",
    definition:
      "A function taking a class and returning a subclass of it, typed with a construct signature. Composition where single inheritance runs out.",
    related: ["mixins-and-constructor-types"],
  },
  {
    id: "module-augmentation",
    term: "Module augmentation",
    tier: "advanced",
    definition:
      "Using `declare` module to add declarations to another package's types, or `declare` global to add to the runtime globals.",
    aliases: ["declare global"],
    related: ["module-augmentation", "global-augmentation-for-node"],
  },
  {
    id: "module-resolution",
    term: "Module resolution",
    tier: "intermediate",
    definition:
      "How the compiler turns an import specifier into a file. The mode — node16, nodenext, or bundler — changes what a given import even means.",
    related: ["module-resolution-explained", "commonjs-to-esm"],
  },
  {
    id: "namespace",
    term: "Namespace",
    tier: "intermediate",
    definition:
      "TypeScript's pre-ESM module construct. Still everywhere in older declaration files, and not something to write in new code.",
    related: ["namespaces-and-legacy-code"],
  },
  {
    id: "narrowing",
    term: "Narrowing",
    tier: "beginner",
    definition:
      "Reducing a value's type within a branch because a check proved something about it. `typeof`, `instanceof`, in, equality, and type predicates all narrow.",
    related: ["narrowing-with-typeof", "control-flow-analysis"],
  },
  {
    id: "never",
    term: "never",
    tier: "intermediate",
    definition:
      "The type of a value that never occurs: a function that always throws, an impossible branch, or an intersection with no inhabitants.",
    related: ["void-and-never", "never-returning-functions"],
  },
  {
    id: "noinfer",
    term: "NoInfer<T>",
    tier: "advanced",
    definition:
      "A marker that stops a position from contributing a candidate during type-argument inference, so one argument cannot widen what another narrowed.",
    related: ["noinfer-and-inference-control"],
  },
  {
    id: "non-null-assertion",
    term: "Non-null assertion",
    tier: "beginner",
    definition:
      "The postfix ! that removes `null` and `undefined` from a type without checking anything. A claim by the author, not a proof.",
    aliases: ["bang operator"],
    related: ["non-null-assertion", "type-assertions-are-claims"],
  },
  {
    id: "nounchecked-indexed-access",
    term: "noUncheckedIndexedAccess",
    tier: "intermediate",
    definition:
      "The option that adds `undefined` to the result of indexing an array or a record, which is what actually happens at runtime.",
    related: ["nouncheckedindexedaccess", "array-narrowing"],
  },
  {
    id: "optional-property",
    term: "Optional property",
    tier: "beginner",
    definition:
      "A property declared with ?, which may be omitted and whose type includes `undefined`. `exactOptionalPropertyTypes` separates those two meanings.",
    related: ["optional-and-readonly-properties", "exactoptionalpropertytypes"],
  },
  {
    id: "overload",
    term: "Overload",
    tier: "intermediate",
    definition:
      "Several call signatures over one implementation, used when the return type depends on which arguments were passed. Resolved in declaration order.",
    related: ["function-overloads", "overload-resolution-order"],
  },
  {
    id: "parameter-property",
    term: "Parameter property",
    tier: "intermediate",
    definition:
      "A constructor parameter marked with an accessibility modifier, which declares and assigns a field in one place. Emits runtime code, so it is not erasable.",
    related: ["parameter-properties"],
  },
  {
    id: "parse-dont-validate",
    term: "Parse, don't validate",
    tier: "intermediate",
    definition:
      "Returning the narrowed value from a check rather than a boolean, so the proof travels with the data instead of being forgotten one caller later.",
    related: ["parse-dont-validate", "schema-validation-libraries"],
  },
  {
    id: "project-reference",
    term: "Project reference",
    tier: "advanced",
    definition:
      "A `tsconfig` pointing at another buildable project, letting a monorepo compile in dependency order and share build state.",
    aliases: ["composite"],
    related: ["project-references", "incremental-builds"],
  },
  {
    id: "promise",
    term: "Promise<T>",
    tier: "beginner",
    definition:
      "A value that will settle to T (or reject). The type parameter is what await and .then receive — `Promise`<User> is not interchangeable with `Promise`<`any`>.",
    aliases: ["Promise", "thenable"],
    related: [
      "promise-types",
      "async-await-typing",
      "promise-combinators",
      "awaited-and-unwrapping",
    ],
  },
  {
    id: "promise-combinators",
    term: "Promise combinators",
    tier: "intermediate",
    definition:
      "Helpers such as `Promise.all`, allSettled, race, and `any` that combine multiple promises. Their TypeScript typings preserve tuple element types when you pass a fixed tuple of promises.",
    aliases: ["Promise.all", "allSettled"],
    related: [
      "promise-combinators",
      "variadic-tuple-types",
      "awaited-and-unwrapping",
    ],
  },
  {
    id: "prototype-pollution",
    term: "Prototype pollution",
    tier: "advanced",
    definition:
      "Writing to __proto__ or constructor.prototype through a deep merge or a parser, changing behaviour for every object in the process.",
    related: ["deserialization-attack-surface", "narrowing-untrusted-objects"],
  },
  {
    id: "readonly",
    term: "readonly",
    tier: "intermediate",
    definition:
      "A compile-time promise that a property or array will not be reassigned through this reference. Shallow, and erased before anything runs.",
    related: ["readonly-and-immutability", "mapped-type-modifiers"],
  },
  {
    id: "result-type",
    term: "Result type",
    tier: "intermediate",
    definition:
      "A discriminated union representing success or failure in the return type, so the checker can insist that failure is handled.",
    aliases: ["Either", "neverthrow"],
    related: ["result-types", "discriminated-results-in-practice"],
  },
  {
    id: "satisfies",
    term: "satisfies",
    tier: "intermediate",
    definition:
      "An operator that checks a value against a type without changing the value's inferred type — validation without widening.",
    related: ["satisfies-operator"],
  },
  {
    id: "schema",
    term: "Schema",
    tier: "intermediate",
    definition:
      "A runtime description of a data shape, from Zod, Valibot, or similar, from which the static type is inferred so the two cannot drift apart.",
    aliases: ["zod", "valibot", "standard schema"],
    related: ["schema-validation-libraries", "typing-process-env"],
  },
  {
    id: "soundness",
    term: "Soundness",
    tier: "advanced",
    definition:
      "Whether a type system's guarantees always hold at runtime. TypeScript's does not, in several documented places, and each hole is a deliberate usability trade.",
    related: ["deliberate-unsoundness", "assignability-rules"],
  },
  {
    id: "strict",
    term: "strict",
    tier: "beginner",
    definition:
      "The umbrella option enabling roughly eight individual checks, of which `strictNullChecks` and `noImplicitAny` carry most of the value.",
    related: ["strict-mode", "the-strictness-ladder"],
  },
  {
    id: "strict-null-checks",
    term: "strictNullChecks",
    tier: "intermediate",
    definition:
      "The option that stops `null` and `undefined` from being members of every type, making the most common Node runtime crash visible at build time.",
    related: ["strictnullchecks", "null-and-undefined"],
  },
  {
    id: "structural-typing",
    term: "Structural typing",
    tier: "beginner",
    definition:
      "Comparing types by their members rather than their names. Two unrelated types with matching shapes are interchangeable.",
    aliases: ["duck typing"],
    related: ["structural-typing", "structural-test-doubles"],
  },
  {
    id: "template-literal-type",
    term: "Template literal type",
    tier: "intermediate",
    definition:
      "A string type built from other string types with template syntax, used for event names, route paths, and generated keys.",
    related: ["template-literal-types-intro", "template-literal-inference"],
  },
  {
    id: "top-type",
    term: "Top type",
    tier: "beginner",
    definition:
      "A type everything is assignable to. TypeScript has two — `unknown`, which is safe, and `any`, which is not.",
    related: ["unknown-vs-any"],
  },
  {
    id: "ts-expect-error",
    term: "@ts-expect-error",
    tier: "intermediate",
    definition:
      "A comment that suppresses the error on the next line and reports an error of its own if that line ever stops failing. Preferable to @ts-ignore everywhere.",
    aliases: ["@ts-ignore"],
    related: ["suppressions", "ts-expect-error-as-an-assertion"],
  },
  {
    id: "tsconfig",
    term: "tsconfig.json",
    tier: "beginner",
    definition:
      "The file defining a compilation unit: which files, which options, which libs. Its presence is also what makes an editor and CI agree.",
    related: ["tsconfig-essentials", "tsc-cli"],
  },
  {
    id: "tsserver",
    term: "tsserver",
    tier: "beginner",
    definition:
      "The language server that runs the same compiler as the CLI, providing hover, completion, rename, and the errors you see while typing.",
    aliases: ["language server"],
    related: ["tsserver-and-your-editor", "editor-driven-development"],
  },
  {
    id: "tuple",
    term: "Tuple",
    tier: "beginner",
    definition:
      "An array type with a fixed length and a type per position, such as [string, number]. What `Promise.all` and destructuring both rely on.",
    related: ["arrays-and-tuples", "variadic-tuple-types"],
  },
  {
    id: "type-alias",
    term: "Type alias",
    tier: "beginner",
    definition:
      "A name for `any` type at all, declared with type. Unlike an interface it can name unions, tuples, functions, and primitives.",
    related: ["type-aliases-intro", "interface-vs-type-alias"],
  },
  {
    id: "type-argument",
    term: "Type argument",
    tier: "intermediate",
    definition:
      "The concrete type supplied for a type parameter, either written explicitly in angle brackets or inferred from the call's arguments.",
    related: ["inferring-type-arguments", "generic-inference-internals"],
  },
  {
    id: "type-assertion",
    term: "Type assertion",
    tier: "beginner",
    definition:
      "Writing as T to tell the compiler to treat a value as that type. It performs no check and generates no code — it is a claim, not a conversion.",
    aliases: ["cast", "as"],
    related: ["type-assertions-are-claims", "non-null-assertion"],
  },
  {
    id: "type-guard",
    term: "Type guard",
    tier: "intermediate",
    definition:
      "A function whose return type is a type predicate (value is T), so calling it narrows the argument in the caller's branch.",
    aliases: ["type predicate", "is"],
    related: ["user-defined-type-guards", "writing-a-validator-by-hand"],
  },
  {
    id: "type-parameter",
    term: "Type parameter",
    tier: "intermediate",
    definition:
      "The placeholder a generic declares, optionally constrained with extends and optionally given a default.",
    related: ["generics-intro", "default-type-parameters"],
  },
  {
    id: "type-space",
    term: "Type space and value space",
    tier: "intermediate",
    definition:
      "The two namespaces an identifier can live in. Some declarations create only a type, some only a value, and some both — which is why an identifier can exist and still be the wrong kind of thing.",
    related: ["type-space-vs-value-space", "typeof-type-queries"],
  },
  {
    id: "types-package",
    term: "@types package",
    tier: "beginner",
    definition:
      "Community-maintained declarations published from DefinitelyTyped for a package that ships none of its own.",
    aliases: ["DefinitelyTyped"],
    related: ["installing-types", "declaration-files-intro"],
  },
  {
    id: "union-type",
    term: "Union type",
    tier: "beginner",
    definition:
      "A | B — a value that is one of several types. Only the members common to all of them are available until the union is narrowed.",
    related: ["union-types", "discriminated-unions"],
  },
  {
    id: "unique-symbol",
    term: "unique symbol",
    tier: "advanced",
    definition:
      "The type of a specific symbol value, and the only construct that gives a value its own identity in a structural type system.",
    related: ["unique-symbol", "branded-and-nominal-types"],
  },
  {
    id: "unknown",
    term: "unknown",
    tier: "beginner",
    definition:
      "The safe top type: anything is assignable to it, and it is assignable to nothing until you narrow it. The correct type for data crossing a runtime boundary.",
    related: ["unknown-vs-any", "json-parse-returns-any"],
  },
  {
    id: "utility-type",
    term: "Utility type",
    tier: "intermediate",
    definition:
      "One of the standard generic types the compiler ships — `Partial`, `Pick`, `Omit`, `Record`, `ReturnType` and the rest — all built from mapped and conditional types.",
    related: ["utility-types-tour", "function-utility-types"],
  },
  {
    id: "variadic-tuple-type",
    term: "Variadic tuple type",
    tier: "advanced",
    definition:
      "A tuple type containing a spread of another tuple type, which is how typed compose, curry, and argument-forwarding wrappers are written.",
    related: ["variadic-tuple-types", "generic-async-wrappers"],
  },
  {
    id: "variance",
    term: "Variance",
    tier: "advanced",
    definition:
      "How the assignability of a container or function relates to the assignability of its parts. Covariant, contravariant, invariant, or — for methods — bivariant.",
    related: ["variance-and-strict-function-types", "strictfunctiontypes"],
  },
  {
    id: "void",
    term: "void",
    tier: "intermediate",
    definition:
      "The return type meaning the value must not be relied on. Distinct from `undefined`, and deliberately loose so `any` function can be used where one is expected.",
    related: ["void-and-never", "void-returning-callbacks"],
  },
  {
    id: "widening",
    term: "Widening",
    tier: "beginner",
    definition:
      'The compiler generalising a literal type to its base type — "GET" to string — when the value is mutable or the position does not preserve it.',
    related: ["inference-and-widening", "type-widening-and-freshness"],
  },
];

/** Terms in alphabetical order, which is how the glossary page renders them. */
export const glossaryTerms = (): readonly GlossaryTerm[] =>
  [...GLOSSARY].sort((a, b) =>
    a.term.localeCompare(b.term, "en", { sensitivity: "base" }),
  );
