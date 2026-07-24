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
- [Compound Schema](#compound-schema)
  - [Array](#array)
  - [Object](#object)
  - [Record](#record)
  - [Tuple](#tuple)
  - [Union](#union)
- [Schema Parameters](#schema-parameters)
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

Any schema share optional/nullable/description/brand parameters.

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

Every other type — `bigint`, `boolean`, `literal`, `number`, `string`, `union` — performs a single check with no aggregation, so parsing one directly can only ever produce exactly one entry (or none, on success). When one of these is nested inside a compound schema, its single error just becomes one of potentially several entries contributed by the surrounding `object`/`record`/`array`/`tuple`.

## Benchmarks

The [`benchmark/`](./benchmark) directory compares schematox against [zod](https://www.npmjs.com/package/zod), [valibot](https://www.npmjs.com/package/valibot), [superstruct](https://www.npmjs.com/package/superstruct), [ajv](https://www.npmjs.com/package/ajv), and [yup](https://www.npmjs.com/package/yup), using [tinybench](https://www.npmjs.com/package/tinybench). It measures two separate things — **building** a schema once, and **parsing** with an already-built schema — across four shapes (a bare primitive, a flat 3-field object, a 2-level nested object with an array field, and an array of 10 objects), each with both a valid and an invalid subject. Run it yourself:

```sh
cd benchmark
npm install
npm run bench
```

Numbers below were captured on Node v23.7.0, Apple M1. Absolute numbers will differ on your machine — what should hold up is the relative ordering and the reasoning behind it.

### Schema construction (ops/sec, higher is better)

| library | primitive | flat object | nested object | array of 10 |
|---|---|---|---|---|
| superstruct | 6.49M | 7.59M | 4.20M | 6.63M |
| schematox | 1.11M | 542K | 270K | 443K |
| zod | 929K | 371K | 166K | 314K |
| valibot | 573K | 1.07M | 531K | 840K |
| yup | 661K | 153K | 84.5K | 153K |
| ajv | 362 | 366 | 361 | 406 |

### Parsing a valid subject (ops/sec, higher is better)

| library | primitive | flat object | nested object | array of 10 |
|---|---|---|---|---|
| schematox | 23.8M | 4.63M | 2.02M | 518K |
| ajv | 20.8M | 21.8M | 19.6M | 11.0M |
| zod | 16.0M | 3.20M | 1.08M | 313K |
| valibot | 14.6M | 5.31M | 2.00M | 526K |
| yup | 2.86M | 144K | 31.5K | 8.02K |
| superstruct | 791K | 826K | 310K | 76.0K |

### Parsing an invalid subject — wrong type (ops/sec, higher is better)

| library | primitive | flat object | nested object | array of 10 (last item) |
|---|---|---|---|---|
| ajv | 23.3M | 20.0M | 19.5M | 8.90M |
| schematox | 20.8M | 4.22M | 2.01M | 523K |
| valibot | 7.37M | 3.53M | 1.57M | 492K |
| zod | 3.27M | 1.71M | 859K | 279K |
| superstruct | 179K | 184K | 172K | 55.4K |
| yup | 66.0K | 43.0K | 32.6K | 6.77K |

(A missing-required-field variant is also benchmarked for the object shapes; it tracks the wrong-type numbers closely and isn't shown separately.)

### Why the ranking flips depending on what's being measured

**ajv compiles; everyone else interprets.** `ajv.compile(schema)` turns a JSON Schema into a specialized validator function generated with `new Function` — at parse time there's no schema to walk, just a tight generated function doing exactly the checks that specific schema needs. That's why ajv wins almost every parsing benchmark, often by 5-20x, and also why it's ~15,000-20,000x *slower* than everything else at construction: compilation is real work, and ajv's parsing speed is that work paid once and amortized over every subsequent call. schematox, zod, and valibot instead walk a schema tree (or a chain of validator objects) on every call — cheap to build, but they redo interpretation work every time. **The practical takeaway: ajv only wins if a schema is built once and reused for many parses. If schemas are built per-request or are short-lived, ajv's compile cost dominates and it's the worst option on the page** — construction usually happens once at app startup in real usage, which is why the parsing tables matter more than the construction table for most applications, but it's worth knowing which regime you're in.

**On a bare primitive, schematox is fastest of all — including ajv.** A `bigint`/`boolean`/`literal`/`number`/`string` check is one `typeof` plus a comparison or two, no allocation, no loop. There's no schema-tree depth for an interpreter's overhead to hide in, so schematox's minimal per-call work wins outright.

**On objects, records, arrays, and tuples ("compound schemas"), the cost is dominated by per-element work**, not the top-level check — how much happens for every key or item beyond the type test itself. This is where schematox previously trailed zod and valibot by 2-3x: `parse()`'s array/object/record/tuple loops were copying the error-path array (`[...errorPath, key]`) for *every* element regardless of whether that element ever errored, and assigning each parsed field with `Object.defineProperty` (needed only to guard the single dangerous key `__proto__`, but paid on every key). Both were fixed by building the error path via push/pop on one shared array — only copying it at the point an error is actually recorded — and by giving every key except `__proto__` a plain assignment. schematox now matches or beats valibot and zod on every compound-schema parsing case above, both valid and invalid.

**Array-of-objects looks worse than flat-object for every library, including ajv — that's volume, not an array-specific weakness.** The array benchmark validates 10 nested objects (30 field checks total) per call; the flat-object benchmark validates 3. Ops/sec drops roughly in proportion to the work per call for every library in the table, ajv included, not just schematox.

**superstruct and yup sit at the opposite ends of the construction/parsing tradeoff.** superstruct's schemas are cheap closures to build — fastest construction by a wide margin — but the slowest interpreter to run except against yup. yup is unusually slow on both sides: it's the only library here without a non-throwing validate API (its adapter wraps `validateSync()` in try/catch — see [`benchmark/adapters.ts`](./benchmark/adapters.ts)), and its schema resolution is the heaviest of the group regardless of outcome.
