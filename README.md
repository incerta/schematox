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
const struct = record(number(), userId)
  .minLength(1)
  .maxLength(1)
  .optional()
  .nullable()
  .description('x')

// Record<string & { __brand: ['idFor', 'user'] }, number>  | null | undefined
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

### Tuple

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
- `schema`: the specific section of `schema` where the invalid value is found.
- `path`: traces the route from the root to the error subject, with strings as keys and numbers as array indexes.

Note: the parsed input itself is intentionally **not** included in the error — only the schema fragment and path. This prevents sensitive data (e.g. secrets from `process.env`) from ending up in logs when errors are serialized (`JSON.stringify(result.error)`).
