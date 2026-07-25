# Changelog

## Unreleased

- FEAT: added an `unknown` primitive schema (`unknown()` / `{ type: 'unknown' }`) that accepts any subject without validation — an escape hatch for data whose shape isn't known or worth declaring upfront. Unlike every other primitive, it never produces `INVALID_TYPE`/`INVALID_RANGE`, and it has no `brand` param: `T & unknown` collapses to plain `T` in TypeScript, so branding it would silently narrow the inferred type away from `unknown` instead of tagging it. ([#81](https://github.com/incerta/schematox/pull/81))
- FEAT: added opt-in coercion via a third `parse()` argument / second `struct.parse()` argument — `parse(schema, subject, { coerce: true })`. Deliberately not a schema field: the same schema can then coerce when parsing a raw source (URL query, form data, env vars) and stay strict when parsing an already-typed JSON body, without needing two schemas. Only `bigint`/`boolean`/`number`/`string` are coercible, only from each other, via a fixed, unambiguous conversion table — a failed or inapplicable conversion (including one that would silently lose precision, e.g. a `bigint`/numeric string beyond `Number.isSafeInteger` range coerced to `number`) falls through to the ordinary `INVALID_TYPE` error rather than throwing or introducing a new error code. `min`/`max` are checked against the coerced value. `literal`/`unknown` and compound schemas are never coerced themselves, but the flag still reaches every coercible descendant. No effect on `Infer`/`InferSchema` — coercion only changes which raw inputs are accepted, never what a successful parse returns. ([#82](https://github.com/incerta/schematox/pull/82))
- FEAT: added `.preprocess(fn)`, a chain method for custom per-field pre-validation logic beyond the built-in coercion table (trimming, locale-specific formats, a `"$"`-prefixed currency string, splitting a delimited string into an array, etc.). Named to match [Zod's `z.preprocess()`](https://zod.dev/api) — runs before validation, not after (unlike `.transform()`, which runs on the already-validated value and can change its type; this doesn't). Unlike every other struct param, it never touches the schema — `fn`'s position in the _schema_ tree (object key, tuple/union member index, or an internal sentinel for array/record's one uniformly-applied child position) is tracked separately and only resolved once composed into a struct via `object()`/`array()`/`record()`/`tuple()`/`union()`, at which point it reaches the underlying parser directly; there's no schema-only equivalent, since a preprocessor's position is only meaningful relative to a specific struct's composition. Also unlike `.brand()`/`.min()`/etc., it can be called more than once on the same struct — since it isn't a schema field, there's nothing for it to "use up", and a later call just replaces the earlier one. Independent of `{ coerce: true }`: a declared `.preprocess()` always runs, the same as `.brand()`/`.min()` need no separate flag to take effect, while `{ coerce: true }` remains its own, separate opt-in for the built-in table — when both apply to the same position, the custom one runs first and the built-in one still runs afterward on its result if coercion was also requested for that call. ([#83](https://github.com/incerta/schematox/pull/83))

## [2.0.0](https://github.com/incerta/schematox/compare/v1.3.1...v2.0.0)

- FIX: `object()`/`record()` rejected valid plain objects that aren't `instanceof Object` in the strict identity sense (e.g. `process.env` under Node, `Object.create(null)`, cross-realm objects). The type check now uses `Object.prototype.toString.call(subject) === '[object Object]'`, which still rejects `Map`/`Set`/`Error`/typed arrays/other built-ins. ([#69](https://github.com/incerta/schematox/pull/69))
- BREAKING: removed the `subject` field from `InvalidSubject` (the shape of `ParseError['error']` entries). It echoed the raw parsed input value into validation errors, which could leak sensitive data (e.g. secrets from `process.env`) when errors are logged/serialized. `code`, `path`, and `schema` remain. ([#69](https://github.com/incerta/schematox/pull/69))
- BREAKING: `record()`'s `key` schema is now enforced at parse time. Previously `key` only affected the inferred TypeScript type (e.g. branded keys) and every runtime key was accepted regardless of constraints like `minLength`/`maxLength`/`brand`; a record with a key that fails its `key` schema is now rejected instead of silently passing. ([#70](https://github.com/incerta/schematox/pull/70))
- BREAKING: `record()`'s struct builder no longer takes `key` as a second positional argument. Use the `.key(schema)` chain method instead: `record(value, keySchema)` → `record(value).key(keySchema)`. This avoids a silent-swap risk that a positional key/value order (matching `Record<K, V>`/zod convention) would have introduced on upgrade — with two same-shaped positional args, existing call sites would have compiled fine after a swap while silently validating the wrong thing. The raw schema-object form (`{ type: 'record', of, key }`) is unaffected, since `key` was already a named field there. ([#70](https://github.com/incerta/schematox/pull/70))
- BREAKING: a `union()` subject that satisfies none of its member schemas now reports `code: 'INVALID_UNION'` instead of `'INVALID_TYPE'`. Still exactly one error entry (`schema` is the union schema itself, not any one branch) — the subject was never required to satisfy a specific branch, so attributing the failure to one wouldn't be accurate, and per-branch detail was considered and rejected as noisier without being more actionable. ([#71](https://github.com/incerta/schematox/pull/71))
- FIX: `array()`/`record()` silently dropped already-collected element/entry errors whenever a `minLength`/`maxLength` violation was also present, since the range check returned immediately instead of joining the aggregated error array (`record()` additionally checked `minLength` before checking for entry errors at all, same issue). Both range checks are now folded into the same aggregation as `object()`/`tuple()` already did correctly, so a `minLength`/`maxLength` violation is reported _alongside_ any child errors instead of replacing them. Once a `maxLength` violation is confirmed, validation still stops instead of scanning the rest of the input — an attacker-controlled array/record with a low `maxLength` can't force unbounded work (verified: 2M elements against `maxLength: 10` stayed at ~0.2ms for `array()`, matching pre-fix performance, instead of the ~900ms an earlier version of this fix briefly introduced by removing the early exit entirely). ([#72](https://github.com/incerta/schematox/pull/72))
- BREAKING: `tuple()` now rejects subjects with more elements than the schema declares, instead of silently truncating the extras. Unlike `object()`'s documented "extra keys ignored" (a deliberate forward-compatibility choice), a tuple's whole point is a fixed shape, and the extra elements were never validated at all. A trailing element whose own schema is `optional` can still be omitted — this only rejects _more_ elements than declared, not fewer. ([#73](https://github.com/incerta/schematox/pull/73))
- FIX: `parse()` could throw instead of returning a `ParseError`, contradicting the documented "never throws" guarantee, whenever the _schema itself_ was malformed — not a plain object, an unrecognized `type` (at any nesting depth, not just the root), a `bigint` `min`/`max` that wasn't a valid bigint string (crashed inside `BigInt(...)`), or a `tuple`/`union` `of` that wasn't an array. Since schemas can be plain data from an untyped external source (JSON, a database), TypeScript's `satisfies Schema` check never actually ran on them, so this was reachable in practice, not just a theoretical type-safety hole. All of these now return `code: 'INVALID_SCHEMA'` instead of throwing. ([#74](https://github.com/incerta/schematox/pull/74))
- FIX: `object()`/`record()` built their parsed result with plain `result[key] = value` assignment, which for the one key name `__proto__` invokes `Object.prototype`'s special accessor instead of creating an own property. For `record()`, keys come directly from the parsed subject, so an attacker-controlled JSON payload with a `__proto__` key could silently corrupt the parsed result's own prototype chain (verified: reading a key that was never set returned an inherited value from the swapped-in prototype) — not global pollution of `Object.prototype` itself, but a real, subject-driven corruption of that one parsed object. A `__proto__` key with a non-object value was instead silently dropped from the result rather than corrupting anything, which was its own (lesser) bug. `object()`'s struct builder had the identical pattern for a schema field literally named `__proto__`. Both now use `Object.defineProperty` to always create a genuine own property, so `__proto__` behaves like any other key name — stored and readable, prototype chain untouched. ([#75](https://github.com/incerta/schematox/pull/75))
- FIX: a `min`/`max`/`minLength`/`maxLength` that was present but the wrong type (e.g. `{ type: 'number', min: '5' }` — a string instead of a number) was silently ignored instead of being enforced or flagged, across `bigint`/`number`/`string`/`array`/`record`. Now reported as `code: 'INVALID_SCHEMA'`, consistent with the rest of the malformed-schema handling above. A constraint that's simply absent is still not an error — only present-but-wrong-type is. ([#76](https://github.com/incerta/schematox/pull/76))

## [1.3.1](https://github.com/incerta/schematox/compare/v1.3.0...v1.3.1)

- [Modernize schematox ESM TypeScript build and test setup #58](https://github.com/incerta/schematox/pull/67)

## [1.3.0](https://github.com/incerta/schematox/compare/v1.2.4...v1.3.0)

- [feat: add BigInt schema support #58](https://github.com/incerta/schematox/pull/62) by [@IvanDen](https://github.com/IvanDen)
- [FIX: formatter:check script executes formatter:fix on failing #62](https://github.com/incerta/schematox/pull/62)
- [Add publish-alpha.sh script and remove prepublishOnly redundancy #63](https://github.com/incerta/schematox/pull/63)
- [Add prepare-release.sh script for release PR creation #64](https://github.com/incerta/schematox/pull/64)
- [CHANGELOG.md dependent NPM package publishing and release automation #64](https://github.com/incerta/schematox/pull/64)

## [1.2.4](https://github.com/incerta/schematox/compare/v1.2.3...v1.2.4)

- [FIX: incorrect record struct with branded key type inference #60](https://github.com/incerta/schematox/pull/60)

## [1.2.3](https://github.com/incerta/schematox/compare/v1.2.2...v1.2.3)

- [PR #55: Fix npm publishing issues & add nvmrc](https://github.com/incerta/schematox/pull/55)
  - [ISSUE #54: Tests are included in published module despite .npmignore](https://github.com/incerta/schematox/issues/54)
  - [ISSUE #56: Lock Node version by adding .nvmrc file](https://github.com/incerta/schematox/issues/56)
  - [ISSUE #57: Update tsconfig to target ES2018](https://github.com/incerta/schematox/issues/57)

## [1.2.2](https://github.com/incerta/schematox/compare/v1.2.1...v1.2.2)

- [Transpile TypeScript to JavaScript for distribution #53](https://github.com/incerta/schematox/pull/53)

## [1.2.1](https://github.com/incerta/schematox/compare/v1.2.0...v1.2.1)

- [Add type "module" to package.json #51](https://github.com/incerta/schematox/pull/51)

## [1.2.0](https://github.com/incerta/schematox/compare/v1.1.0...v1.2.0)

- [Record schema range limiters support #48](https://github.com/incerta/schematox/pull/48)

## [1.1.0](https://github.com/incerta/schematox/compare/v1.0.1...v1.1.0)

- [Standard schema support #46](https://github.com/incerta/schematox/pull/46)

## [1.0.1](https://github.com/incerta/schematox/compare/v1.0.0...v1.0.1)

- [FIX: struct brand assignment second argument type restriction #44](https://github.com/incerta/schematox/pull/44)

## [1.0.0](https://github.com/incerta/schematox/compare/v0.4.0...v1.0.0)

The module went through major refactoring so it could be ready for production usage:

- [RecordSchema support #34](https://github.com/incerta/schematox/pull/34)
- [Drop validate/guard feature support #36](https://github.com/incerta/schematox/pull/36)
- [Pre major release testing architecture and file structure refactoring #38](https://github.com/incerta/schematox/pull/38)
- [Break down parse logic into smaller functions #39](https://github.com/incerta/schematox/pull/39)
- [Support unrestricted object schema depth #42](https://github.com/incerta/schematox/pull/42)
- [Support tuple schema #43](https://github.com/incerta/schematox/pull/43)

## [0.4.0](https://github.com/incerta/schematox/compare/v0.3.1...v0.4.0)

- [`aa0d95e`](https://github.com/incerta/schematox/commit/aa0d95e30b7784c0ce29317ae808e4ba7950abab) Extend compound structure nesting limit to 12 layers of depth

## [0.3.1](https://github.com/incerta/schematox/compare/v0.3.0...v0.3.1)

### Bugfix

- [`e3527df`](https://github.com/incerta/schematox/commit/e3527dfb46b73a4b6579e3d2aea58f3301aded9a) [#24](https://github.com/incerta/schematox/pull/25) Parser should preserve object optional key only if it is specified in source

### Chore

- [`7d98a81`](https://github.com/incerta/schematox/commit/7d98a81c2bc18280299365da32f8346d5b145560) Use "es2015" tsconfig target instead of outdated "es5"

### Features

- [`8bc2082`](https://github.com/incerta/schematox/commit/8bc208211457901f4f7246f00694f112d56f8d56) [#22](https://github.com/incerta/schematox/issues/22) Ensure optional properties in schemas reflect as optional in object context (@incerta)

## [0.3.0](https://github.com/incerta/schematox/compare/v0.2.0...v0.3.0)

### Features

- [`8bc2082`](https://github.com/incerta/schematox/commit/8bc208211457901f4f7246f00694f112d56f8d56) [#22](https://github.com/incerta/schematox/issues/22) Ensure optional properties in schemas reflect as optional in object context (@incerta)
