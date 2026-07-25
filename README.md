# Schematox

**A typesafe schema that's also just data.**

[![npm version](https://img.shields.io/npm/v/schematox.svg)](https://www.npmjs.com/package/schematox)
[![npm downloads](https://img.shields.io/npm/dm/schematox.svg)](https://www.npmjs.com/package/schematox)
[![bundle size](https://img.shields.io/bundlephobia/minzip/schematox)](https://bundlephobia.com/package/schematox)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/schematox)
[![license](https://img.shields.io/npm/l/schematox.svg)](./LICENSE)

Most TypeScript validators (Zod, Yup, Joi) make you build a schema out of function calls, which means the schema only exists as code you import. Schematox schemas are plain JSON objects that structurally satisfy a `Schema` type — so the same schema can be serialized, stored in a database, sent over the wire, diffed between versions, or generated from another source of truth, in addition to being usable directly as a typesafe parser. You still get a familiar chainable `struct` builder (à la Zod) if you'd rather write schemas as code — both approaches produce the exact same JSON underneath.

- [Install](#install)
- [Minimal Requirements](#minimal-requirements)
- [Why Schematox?](#why-schematox)
- [Quick Start](#quick-start)
  - [Static Schema](#static-schema)
  - [Struct](#struct)
  - [Construct](#construct)
- [Primitive Schema](#primitive-schema)
  - [BigInt](#bigint)
  - [Boolean](#boolean)
  - [Literal](#literal)
  - [Number](#number)
  - [String](#string)
  - [Unknown](#unknown)
- [Compound Schema](#compound-schema)
  - [Array](#array)
  - [Object](#object)
  - [Record](#record)
  - [Tuple](#tuple)
  - [Union](#union)
- [Schema Parameters](#schema-parameters)
- [Coercion](#coercion)
  - [Custom preprocessors](#custom-preprocessors)
- [Error Shape](#error-shape)
- [Benchmarks](#benchmarks)

## Install

```sh
npm install schematox
```

## Minimal Requirements

- ECMAScript version: `2020`
- TypeScript version: `5.3.2`

## Why Schematox?

- **Schemas are data, not just code.** A schema is a plain JSON object that structurally satisfies the `Schema` type — no function calls required. Store it, transfer it, generate it, diff it, or use it as the source of truth for other structures like DB models.
- **Zero dependencies.** Nothing to audit, nothing to update out from under you.
- **Small enough to read.** The whole library is ~1,200 lines of TypeScript — you can read it end to end instead of trusting a black box.
- **Either-style error handling.** `parse()` never throws. You always get `{ success, data, error }` back and decide what happens next.
- **Branded primitives, first-class.** Nominal typing (`string & { __idFor: 'User' }`) is built in, not bolted on.
- **[Standard Schema](https://standardschema.dev) compliant.** Works with any tool built against the shared validation interface used by Zod, Valibot, and others.
- **100% test coverage, enforced.** Statements, branches, functions, and lines — every release is gated on it.

## Quick Start

One can use three ways of schema definition using `schematox` library:

- **Static**: a JSON-compatible object that structurally conforms to the `Schema` type
- **Struct**: is commonly accepted way of schema definition, as seen in [zod](https://github.com/colinhacks/zod) or [superstruct](https://github.com/ianstormtaylor/superstruct)
- **Construct**: use `makeStruct` function to get `struct` from `static` schema

All **programmatically defined** (`struct`, `construct`) schemas are eventually based on `static`, which could be accessed by `__schema` key. All schemas must be immutable constants and should not be mutated by the user. Each application of `struct` parameters related to schema update will create shallow copy of the original schema.

### Static schema

A JSON-compatible object that structurally conforms to the `Schema` type.
The `satisfies Schema` check is optional, structurally valid schema will be accepted by the parser.

```typescript
import { parse } from 'schematox'
import type { Schema, Infer } from 'schematox'

export const schema = {
  type: 'object',
  of: {
    id: {
      type: 'string',
      brand: ['idFor', 'User'],
    },
    name: { type: 'string' },
  },
} as const satisfies Schema

type User = Infer<typeof schema>
  // ^?  { id: string & { __idFor: 'User' }, name: string }

const subject = { id: '1'  name: 'John' }
const parsed = parse(userSchema, subject)
   // ^? ParseResult<User>

parsed.error
    // ^? InvalidSubject[] | undefined

parsed.data
    // ^?  User | undefined

if (parsed.success === false) {
  parsed.error
      // ^? InvalidSubject[]
  throw Error('Parsing error')
}

parsed.data
    // ^? User
```

### Struct

Is commonly accepted way of schema definition, as seen in [zod](https://github.com/colinhacks/zod) or [superstruct](https://github.com/ianstormtaylor/superstruct) library:

```typescript
import { object, string } from 'schematox'
import type { Infer } from 'schematox'

const struct = object({
  id: string().brand('idFor', 'User'),
  name: string(),
})

type User = Infer<typeof struct>
  // ^?  { id: string & { __idFor: 'User' }, name: string }

const subject = { id: '1', name: 'John' }
const parsed = struct.parse(subject)
   // ^?  ParseResult<User>

parsed.error
    // ^?  InvalidSubject[] | undefined

parsed.data
    // ^?  User | undefined

if (parsed.success === false) {
  parsed.error
      // ^? InvalidSubject[]
  throw Error('Parsing error')
}

parsed.data
    // ^? User
```

### Construct

```typescript
import { makeStruct } from 'schematox'
import type { Schema } from 'schematox'

const schema = { type: 'string' } as const satisfies Schema
const string = makeStruct(schema)
```

## Primitive Schema

Any schema share optional/nullable/description/brand parameters (`unknown` is the one exception — see [Unknown](#unknown)).

### BigInt

```typescript
const schema = {
  type: 'bigint',
  optional: true,
  nullable: true,
  brand: ['x', 'y'],
  min: '1',
  max: '4',
  description: 'x',
} as const satisfies Schema

const struct = bigint()
  .optional()
  .nullable()
  .brand('x', 'y')
  .min('1')
  .max('4')
  .description('x')

// (bigint & { __x: 'y' }) | undefined | null
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

### Boolean

```typescript
const schema = {
  type: 'boolean',
  optional: true,
  nullable: true,
  brand: ['x', 'y'],
  description: 'x',
} as const satisfies Schema

const struct = boolean() //
  .optional()
  .nullable()
  .brand('x', 'y')
  .description('x')

// (boolean & { __x: 'y' }) | undefined | null
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

### String

```typescript
const schema = {
  type: 'string',
  optional: true,
  nullable: true,
  brand: ['x', 'y'],
  minLength: 1,
  maxLength: 2,
  description: 'x',
} as const satisfies Schema

const struct = string()
  .optional()
  .nullable()
  .brand('x', 'y')
  .minLength(1)
  .maxLength(2)
  .description('x')

// (string & { __x: 'y' }) | undefined | null
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

### Literal

Could be string/number/boolean literal.

```typescript
const schema = {
  type: 'literal',
  of: 'x',
  optional: true,
  nullable: true,
  brand: ['x', 'y'],
  description: 'x',
} as const satisfies Schema

const struct = literal('x') //
  .optional()
  .nullable()
  .brand('x', 'y')
  .description('x')

// ('x' & { __x: 'y' }) | undefined | null
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

### Number

We accept only finite numbers as valid number schema subjects.

```typescript
const schema = {
  type: 'number',
  optional: true,
  nullable: true,
  brand: ['x', 'y'],
  min: 1,
  max: 4,
  description: 'x',
} as const satisfies Schema

const struct = number()
  .optional()
  .nullable()
  .brand('x', 'y')
  .min(1)
  .max(4)
  .description('x')

// (number & { __x: 'y' }) | undefined | null
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

### Unknown

Accepts any subject — parsing never fails. Useful as an escape hatch for data whose shape isn't known or worth declaring upfront.

Unlike every other primitive, `unknown` has no `brand` param: `T & unknown` collapses to plain `T` in TypeScript, so branding it would silently narrow the inferred type away from `unknown` instead of tagging it.

```typescript
const schema = {
  type: 'unknown',
  optional: true,
  nullable: true,
  description: 'x',
} as const satisfies Schema

const struct = unknown() //
  .optional()
  .nullable()
  .description('x')

// unknown
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

## Compound Schema

Any compound schema could have any other schema type as its member including itself.

### Array

```typescript
const schema = {
  type: 'array',
  of: { type: 'string' },
  optional: true,
  minLength: 1,
  maxLength: 1000,
  description: 'x',
} as const satisfies Schema

const struct = array(string())
  .optional()
  .nullable()
  .minLength(1)
  .maxLength(1000)
  .description('x')

// string[] | undefined | null
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

### Object

Extra properties in the parsed subject that are not specified in the `object` schema will not cause an error and will be skipped.
This is a deliberate decision that allows client schemas to remain functional whenever the API is extended.

Any plain object is accepted as a subject, including ones without `Object.prototype` in their chain (`Object.create(null)`) or ones backed by a native binding (e.g. `process.env`). `Map`, `Set`, `Error`, typed arrays, and other non-plain-object built-ins are rejected.

```typescript
const schema = {
  type: 'object',
  of: {
    x: { type: 'string' },
    y: { type: 'number' },
  },
  optional: true,
  nullable: true,
  description: 'x',
} as const satisfies Schema

const struct = object({
  x: string(),
  y: number(),
})
  .optional()
  .nullable()
  .description('x')

// { x: string; y: number } | undefined | null
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

### Record

Undefined record entries are skipped in parsed results and ignored by range limiter counter. If a key exists, it means a value is also present.

Like `object`, any plain object is accepted as a subject (including `Object.create(null)` and native-bound objects like `process.env`); `Map`, `Set`, `Error`, typed arrays, and similar built-ins are rejected.

If a `key` schema is given, every key is parsed against it, same as values are parsed against `of` — an entry with an invalid key produces an error and is excluded from the parsed result and from `minLength`/`maxLength` counting.

Any string key, including `__proto__`, is stored safely as ordinary data — the parsed result never has its actual prototype altered by a subject's own keys.

```typescript
const schema = {
  type: 'record',
  key: { type: 'string', brand: ['idFor', 'user'] },
  of: { type: 'number' },
  minLength: 1,
  maxLength: 1,
  optional: true,
  nullable: true,
  description: 'x',
} as const satisfies Schema

const userId = string().brand('idFor', 'user')
const struct = record(number())
  .key(userId)
  .minLength(1)
  .maxLength(1)
  .optional()
  .nullable()
  .description('x')

// Record<string & { __idFor: 'user' }, number> | null | undefined
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

### Tuple

Unlike `object`, extra elements beyond the declared arity are rejected, not ignored — a tuple's shape is meant to be exact. A trailing element whose own schema is `optional` can still be omitted.

```typescript
const schema = {
  type: 'tuple',
  of: [{ type: 'string' }, { type: 'number' }],
  optional: true,
  nullable: true,
  description: 'x',
} as const satisfies Schema

const struct = tuple([string(), number()])
  .optional()
  .nullable()
  .description('x')

// [string, number] | undefined | null
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

### Union

Be careful with object unions that do not have a unique discriminant. The parser will check the subject in the order that is specified in the union array and accept the first match.

```typescript
const schema = {
  type: 'union',
  of: [{ type: 'string' }, { type: 'number' }],
  optional: true,
  nullable: true,
  description: 'x',
} as const satisfies Schema

const struct = union([string(), number()])
  .optional()
  .nullable()
  .description('x')

// string | number | undefined | null
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

## Schema Parameters

- `optional?: boolean` – unionize with `undefined`: `{ type: 'string', optinoal: true }` result in `string | undefined`
- `nullable?: boolean` – unionize with `null`: `{ type: 'string', nullable: true }` result in `string | null`
- `brand?: [string, unknown]` – make primitive type nominal "['idFor', 'User'] -> T & { \_\_idFor: 'User' }"
- `minLength/maxLength/min/max` – schema type dependent limiting characteristics
- `description?: string` – description of the particular schema property which can be used to provide more detailed information for the user/developer on validation/parse error

### Why brands are `{ __category: subCategory }` instead of a `unique symbol`

Some validation libraries (e.g. zod) brand values with a single fixed `unique symbol` key. schematox instead derives a plain, per-category string key from the brand tuple: `['idFor', 'User']` becomes `{ __idFor: 'User' }`.

- **Readable diagnostics**: hovering a branded type or reading a type error shows `string & { __idFor: 'User' }` instead of an opaque `{ [Symbol(brand)]: 'User' }`.
- **No `unique symbol` declaration-emit friction**: `unique symbol` types have known rough edges when preserved across published `.d.ts` files and package boundaries; a string-keyed intersection avoids that class of issue entirely.
- **Phantom either way**: like zod's symbol brand, this key is never actually written to the value at runtime — `.brand()` only records `[category, subCategory]` on the schema, purely for type inference. Neither approach changes what a branded value looks like at runtime.
- **Per-category keys leave room to compose brands**: because the key is derived from `category` rather than fixed, two different categories produce two different phantom keys, which is what would let multiple brands be intersected onto the same value without one overwriting the other (schemas currently only carry a single `brand` field, so this isn't exposed yet).
- **The `__` prefix is the workaround, not a caveat**: `category` is a free-form string, and primitive types already carry real structural members (`string`'s `length`, `toString`, etc.). Branding with a bare `category` key (no prefix) would risk colliding with one of those — e.g. `{ length: 'x' }` intersected with real `string.length: number` collapses the whole type to `never`. Prefixing with `__` sidesteps this: `.brand('length', 'x')` produces `{ __length: 'x' }`, which doesn't collide with anything, so `length` (and any other real member name) is a perfectly safe category to use.

The one name still worth avoiding is a `category` that itself starts with `proto__`, since `__${category}` would then literally read `__proto__`. Harmless in practice — brands are never assigned at runtime, so there's no live object carrying that key — but avoidable all the same.

## Coercion

Coercion is a parse-time option, not a schema property. It's opt-in per call, on both the free `parse()` function and a struct's `.parse()`:

```typescript
import { parse, number } from 'schematox'

const schema = { type: 'number' } as const satisfies Schema

parse(schema, '42')                    // error — "42" is not a number
parse(schema, '42', { coerce: true })  // { success: true, data: 42 }

number().parse('42', { coerce: true }) // { success: true, data: 42 }
```

The same `schema`/`struct` parses raw strings from a URL query, a form submission, or an env var one way, and an already-typed JSON body another — without needing two schemas or a `.coerce()`-flavored variant of every primitive to keep around. This is also why coercion isn't a schema field: a schema that always coerced would silently accept `"42"` even where a caller specifically wanted to reject it (e.g. an internal API that only trusts a JSON body). Whether coercion applies is a property of a specific `parse()` call, so it can differ per call site even when the schema itself is shared.

Because coercion only changes which raw inputs are *accepted*, never what a successful parse *returns*, it has no effect on `Infer`/`InferSchema` — a coerced `number` schema still infers as `number`, the same as without coercion.

Only `bigint`, `boolean`, `number`, and `string` are coercible, and only from one of the other three — the conversion is always unambiguous, never a parse of arbitrary text:

| target    | accepted input                       | conversion |
| --------- | ------------------------------------- | ---------- |
| `number`  | non-empty numeric `string`            | `Number(x)`, rejected if `NaN` or outside `Number.isSafeInteger` range (for an integer value — `Number` can't represent every integer a `string`/`bigint` can, so a result outside that range is rejected rather than silently rounded) |
|           | `boolean`                             | `true → 1`, `false → 0` |
|           | `bigint`                              | `Number(x)`, rejected outside `Number.isSafeInteger` range, same reasoning |
| `bigint`  | integer `string`/`number`             | `BigInt(x)`, rejected if it throws (e.g. `"4.2"`, `4.2`) |
|           | `boolean`                             | `true → 1n`, `false → 0n` |
| `string`  | `number`/`boolean`                    | `String(x)` |
|           | `bigint`                              | `x.toString()` |
| `boolean` | `string`                              | only the exact strings `"true"`/`"false"` — not `"TRUE"`, `"1"`, `"yes"` |
|           | `number`/`bigint`                     | only `1`/`0` or `1n`/`0n` |

A conversion that doesn't apply (wrong source type) or fails (e.g. `"abc"` for `number`, `"4.2"` for `bigint`) is left as-is and falls through to the same `INVALID_TYPE` error parsing would produce without coercion — coercion never throws and never introduces a new error code. `min`/`max`/`minLength`/`maxLength` are checked against the coerced value, so `parse({ type: 'number', min: 10 }, '5', { coerce: true })` fails with `INVALID_RANGE`, not `INVALID_TYPE`.

`literal` and `unknown` are never coerced — a `literal`'s target type depends on the runtime type of `of` rather than `schema.type` alone, and `unknown` already accepts anything. Compound schemas (`array`/`object`/`record`/`tuple`/`union`) aren't coerced themselves (there's no single scalar to convert a subject into an array from), but `{ coerce: true }` still reaches every coercible descendant: `parse(array(number()), ['1', '2'], { coerce: true })` succeeds with `[1, 2]`.

`optional`/`nullable` are checked before coercion runs, so `undefined`/`null` pass straight through rather than being coerced into e.g. `0`/`false`.

The [Standard Schema](https://standardschema.dev) `~standard.validate` entry point doesn't take options — that signature is fixed by the spec — so coercion isn't reachable through it; use `parse()`/`struct.parse()` directly when you need it.

### Custom preprocessors

The built-in table only covers `bigint`/`boolean`/`number`/`string`. `.preprocess()` attaches a custom pre-validation function to any struct — like every other struct param, it's a chain method, not a schema field: `T & unknown` schemas stay JSON-serializable data, and the preprocessor itself is tracked separately, never written into `__schema`. Named to match [Zod's `z.preprocess()`](https://zod.dev/api), which does the same thing: run before validation, not after (unlike `.transform()`, which runs on the already-validated value and can change its type — this doesn't).

```typescript
import { object, string } from 'schematox'

const trimmed = string().preprocess((s) =>
  typeof s === 'string' ? s.trim() : s
)

const struct = object({ name: trimmed })

struct.parse({ name: '  Ann  ' })
// { success: true, data: { name: 'Ann' } }
```

A preprocessor is a plain `(subject: unknown) => unknown` function, following the same contract as the built-in table: given a subject it doesn't recognize, return it unchanged rather than throwing, and let the ordinary validation report `INVALID_TYPE`. Like every other struct param, `.preprocess()` only applies once per struct — it disappears from the type the moment it's called, same as `.brand()`/`.min()`/etc., so a second call is a compile error, not a silent overwrite.

**`.preprocess()` and `{ coerce: true }` are two independent switches.** `{ coerce: true }` gates the built-in bigint/boolean/number/string table — a blanket, call-site opt-in, since it isn't tied to any one field. A struct's own `.preprocess()` is the opposite: an explicit, per-field declaration, active on every `.parse()` call the moment it's attached, exactly like `.brand()` or `.min()` — no separate flag needed to "turn it on", and `{ coerce: true }` has no bearing on whether it runs. When both apply to the same position, the custom one runs first and the built-in one still runs afterward on its result *if* `{ coerce: true }` was also passed — e.g. a custom preprocessor can strip a `"$"` prefix unconditionally, and the built-in string→number conversion turns what's left into a number only when coercion was explicitly requested for that call:

```typescript
const price = number().preprocess((s) =>
  typeof s === 'string' && s.startsWith('$') ? s.slice(1) : s
)

price.parse('$42')
// error — the preprocessor strips "$", leaving the string "42", but
// nothing converts it to a number without { coerce: true }

price.parse('$42', { coerce: true })
// { success: true, data: 42 }
```

`.preprocess()` composes through `array()`/`object()`/`record()`/`tuple()`/`union()` — attach it at any depth before composing, and it's tracked by position so it only fires where it was declared:

```typescript
import { array, number } from 'schematox'

const dollars = number().preprocess((s) =>
  typeof s === 'string' && s.startsWith('$') ? s.slice(1) : s
)

array(dollars).parse(['$10', '$20'], { coerce: true })
// { success: true, data: [10, 20] }
```

A preprocessor attached to a compound struct itself (its own subject, before that struct's own validation runs) and one attached to its child (e.g. every array element) are different positions and don't collide — `array(dollars).preprocess((s) => typeof s === 'string' ? s.split(',') : s)` splits a whole comma-separated string into an array first, and the item-level `dollars` preprocessor still runs on each resulting element afterward. It doesn't mutate the struct it's called on — the original still parses without the attached preprocessor.

`.preprocess()` is only available through a struct — there's no equivalent for a static schema used on its own, since a preprocessor's position is only meaningful relative to a specific struct's composition. `record()`'s `key` schema doesn't support a custom preprocessor either — record keys are always plain strings already, and only the built-in string table applies to them.

## Error Shape

Nested schema example. Subject `0` is invalid, should be a `string`:

```typescript
import { object, array, string } from 'schematox'

const struct = object({
  x: object({
    y: array(
      object({
        z: string(),
      })
    ),
  }),
})

const result = struct.parse({ x: { y: [{ z: 0 }] } })
```

The `result.error` shape is:

```json
[
  {
    "code": "INVALID_TYPE",
    "path": ["x", "y", 0, "z"]
    "schema": { "type": "string" },
  }
]
```

It's always an array of `InvalidSubject` entries, each has the following properties:

- `code`:
  - `INVALID_TYPE`: schema subject or default value don't meet schema type specifications
  - `INVALID_RANGE`: `min/max` or `minLength/maxLength` schema requirements aren't met
  - `INVALID_UNION`: subject didn't satisfy any of `union`'s member schemas. `schema` is the union schema itself, not any one member — the subject isn't required to conform to a specific branch, so blaming one wouldn't be accurate.
  - `INVALID_SCHEMA`: the schema itself is malformed — not a plain object, an unrecognized `type`, a `tuple`/`union` `of` that isn't an array, or any `min`/`max`/`minLength`/`maxLength` that's present but the wrong type (e.g. a `number` schema's `min` isn't a `number`, a `bigint` schema's `min`/`max` isn't a valid bigint string). Since schemas can be plain data from an untyped external source (JSON, a database), TypeScript's `satisfies Schema` never actually ran on them; `parse()` still never throws, it reports this instead. A constraint that's simply absent is not an error — only present-but-wrong-type is.
- `schema`: the specific section of `schema` where the invalid value is found.
- `path`: traces the route from the root to the error subject, with strings as keys and numbers as array indexes.

Note: the parsed input itself is intentionally **not** included in the error — only the schema fragment and path. This prevents sensitive data (e.g. secrets from `process.env`) from ending up in logs when errors are serialized (`JSON.stringify(result.error)`).

### When can `result.error` have more than one entry?

Only `object`, `record`, `array`, and `tuple` can produce more than one `InvalidSubject`. Each independently validates multiple children (object keys, record entries, array/tuple elements) and collects every failure into a single flat array — including a `minLength`/`maxLength` violation, which is reported *alongside* any child errors rather than replacing them. For example, an array that's both too short and has an invalid element reports both problems, not just one.

Every other type — `bigint`, `boolean`, `literal`, `number`, `string`, `union` — performs a single check with no aggregation, so parsing one directly can only ever produce exactly one entry (or none, on success). When one of these is nested inside a compound schema, its single error just becomes one of potentially several entries contributed by the surrounding `object`/`record`/`array`/`tuple`. `unknown` never performs a check at all — it accepts any subject, so it can never contribute an entry.

## Benchmarks

The [`benchmark/`](./benchmark) directory compares schematox's construction and parsing speed against [zod](https://www.npmjs.com/package/zod), [valibot](https://www.npmjs.com/package/valibot), [superstruct](https://www.npmjs.com/package/superstruct), [ajv](https://www.npmjs.com/package/ajv), and [yup](https://www.npmjs.com/package/yup).

- **Parsing, schematox is fastest on primitives** (strings, numbers, booleans, bigints, literals) — ajv included — and neck-and-neck with valibot on objects/arrays/records/tuples, ahead of zod, superstruct, and yup.
- **ajv only wins with a schema built once and reused for many parses.** Its compiled validators are the fastest at parsing compound shapes, but compilation itself is ~15,000-20,000x slower than every other library's construction — a bad trade if schemas are built per-request.
- **Construction speed is mid-pack for schematox** — superstruct builds schemas fastest, ajv by far the slowest.

See [`benchmark/README.md`](./benchmark/README.md) for full methodology, result tables, and the reasoning behind the ranking.
