# Schematox

**A typesafe schema that's also just data.**

[![npm version](https://img.shields.io/npm/v/schematox.svg)](https://www.npmjs.com/package/schematox)
[![npm downloads](https://img.shields.io/npm/dm/schematox.svg)](https://www.npmjs.com/package/schematox)
[![bundle size](https://img.shields.io/bundlephobia/minzip/schematox)](https://bundlephobia.com/package/schematox)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/schematox)
[![license](https://img.shields.io/npm/l/schematox.svg)](./LICENSE)

A schematox schema is a plain JSON object. You can write it as a literal, load it from a database, or generate it, and it is still a typesafe parser with a real inferred type. If you prefer builders, a chainable `struct` API in the style of Zod produces the exact same JSON. Unlike TypeBox's `Static<T>`, `Infer<T>` reads the schema's own fields, so it works no matter where the schema came from ([why](./docs/schema-as-data.md)).

- [Install](#install)
- [Why schematox](#why-schematox)
- [Quick start](#quick-start)
- [Schema types](#schema-types)
- [Errors](#errors)
- [Coercion and preprocessors](#coercion-and-preprocessors)
- [Custom metadata](#custom-metadata)
- [Narrowing the schema type](#narrowing-the-schema-type)
- [Documentation](#documentation)

## Install

```sh
npm install schematox
```

Requires TypeScript ≥ 5.3.2 and an ES2020 runtime.

## Why schematox

- **Schemas are data.** A schema is a plain JSON object, so you can store it, transfer it, diff it, generate it, or use it as the source of truth for DB models and other structures.
- **Structural type inference.** `Infer<T>` is an ordinary conditional type over the schema's own `type`/`of`/`brand` fields. A schema written by hand or loaded from JSON infers the same type as one built with the builder API.
- **Either-style results.** `parse()` never throws. It returns `{ success, data, error }`.
- **Branded primitives built in.** You get nominal types like `string & { __idFor: 'User' }` with no extra setup ([details](./docs/branding.md)).
- **[Standard Schema](https://standardschema.dev) compliant.** Works with any tool that supports Zod, Valibot, and similar libraries through the shared interface.
- **Zero dependencies, ~1,200 lines.** The package ships `src` with source maps, so "go to definition" in your editor lands on the real TypeScript.
- **100% test coverage, enforced** on every release.

## Quick start

Define a schema as plain data, or with the builder. Both forms produce the same schema and infer the same type:

```typescript
import { object, string, parse } from 'schematox'
import type { Infer, Schema } from 'schematox'

// Static: a plain object
const userSchema = {
  type: 'object',
  of: {
    id: { type: 'string', brand: ['idFor', 'User'] },
    name: { type: 'string' },
  },
} as const satisfies Schema

// Struct: the same schema, built with function calls
const userStruct = object({
  id: string().brand('idFor', 'User'),
  name: string(),
})

type User = Infer<typeof userSchema> // same as Infer<typeof userStruct>
// ^? { id: string & { __idFor: 'User' }; name: string }
```

Parse with the free `parse()` function, or with the struct's own `.parse()`:

```typescript
const result = parse(userSchema, input) // or userStruct.parse(input)

if (!result.success) {
  result.error // InvalidSubject[]
} else {
  result.data // User
}
```

The `satisfies Schema` check is optional, since any structurally valid object is accepted. `struct.__schema` gives you the static object back, and `makeStruct(schema)` turns a static schema into a struct.

## Schema types

| type      | type-specific fields                     | struct example                         | infers                             |
| --------- | ---------------------------------------- | -------------------------------------- | ---------------------------------- |
| `string`  | `minLength`, `maxLength`                 | `string().maxLength(64)`               | `string`                           |
| `number`  | `min`, `max` (finite numbers only)       | `number().min(0)`                      | `number`                           |
| `bigint`  | `min`, `max` (as bigint strings)         | `bigint().min('0')`                    | `bigint`                           |
| `boolean` | none                                     | `boolean()`                            | `boolean`                          |
| `literal` | `of` (string, number, or boolean)        | `literal('admin')`                     | `'admin'`                          |
| `unknown` | none (accepts anything, no `brand`)      | `unknown()`                            | `unknown`                          |
| `array`   | `of`, `minLength`, `maxLength`           | `array(string())`                      | `string[]`                         |
| `object`  | `of` (extra keys are ignored)            | `object({ a: string() })`              | `{ a: string }`                    |
| `record`  | `of`, `key`, `minLength`, `maxLength`    | `record(number()).key(userId)`         | `Record<UserId, number>`           |
| `tuple`   | `of` (exact arity)                       | `tuple([string(), number()])`          | `[string, number]`                 |
| `union`   | `of` (first match wins)                  | `union([string(), number()])`          | `string \| number`                 |

Parameters shared by every schema:

| static                     | struct                    | effect                       |
| -------------------------- | ------------------------- | ---------------------------- |
| `optional: true`           | `.optional()`             | `T \| undefined`             |
| `nullable: true`           | `.nullable()`             | `T \| null`                  |
| `brand: ['idFor', 'User']` | `.brand('idFor', 'User')` | `T & { __idFor: 'User' }`    |
| `description: '...'`       | `.description('...')`     | documentation only           |
| `meta: { ... }`            | `.meta({ ... })`          | your own data, ignored by `parse` and `Infer` |

Each type has a static and struct example, along with its edge cases, in **[docs/schema-types.md](./docs/schema-types.md)**.

## Errors

`result.error` is a flat array of `InvalidSubject`. Each entry has a `code`, the `path` to the invalid value, and the `schema` fragment it failed:

```json
[{ "code": "INVALID_TYPE", "path": ["x", "y", 0, "z"], "schema": { "type": "string" } }]
```

The codes are `INVALID_TYPE`, `INVALID_RANGE`, `INVALID_UNION`, and `INVALID_SCHEMA` (the schema itself is malformed). The parsed input is never included in an error, so secrets can't leak into logs. [Error details →](./docs/errors.md)

## Coercion and preprocessors

Coercion is opt-in for each call, so the same schema can be strict for a JSON body and lenient for query strings or env vars:

```typescript
parse({ type: 'number' }, '42') //                    error: "42" is not a number
parse({ type: 'number' }, '42', { coerce: true }) //  { success: true, data: 42 }
```

Only `bigint`, `boolean`, `number`, and `string` are coerced, and only from one another using unambiguous conversions. For anything else, `.preprocess()` attaches a function that runs before validation:

```typescript
const trimmed = string().preprocess((s) => (typeof s === 'string' ? s.trim() : s))
```

[Conversion table, Standard Schema interplay, and preprocessor composition →](./docs/coercion-and-preprocess.md)

## Custom metadata

Use `meta` to attach your own data to any schema, such as DB column names. It is fully typed, and `parse` and `Infer` ignore it:

```typescript
const user = {
  type: 'object',
  of: {
    id: { type: 'string', meta: { dbColumn: 'user_id' } },
    name: { type: 'string', meta: { dbColumn: 'full_name' } },
  },
} as const satisfies Schema

user.of.id.meta.dbColumn // 'user_id'
```

[More on metadata →](./docs/metadata.md)

## Narrowing the schema type

Every schema shape (`ObjectSchema<T>`, `UnionSchema<T>`, `StringSchema`, …) is an exported generic. That lets you describe a restricted subset of `Schema` and have the compiler enforce it. For example, "flat objects only" for a repository layer:

```typescript
type FlatModelSchema = ObjectSchema<Record<string, PrimitiveSchema>>

const userModel = {
  type: 'object',
  of: { id: { type: 'string' }, age: { type: 'number' } },
} as const satisfies FlatModelSchema // a nested object here is a type error
```

[Unions of models, struct contracts, and more →](./docs/narrowing.md)

## Documentation

- [Schema types](./docs/schema-types.md): every type, with static and struct examples
- [Branding](./docs/branding.md): nominal types and why brands are `{ __category: subCategory }`
- [Errors](./docs/errors.md): error shape, codes, and when there are multiple entries
- [Coercion and preprocessors](./docs/coercion-and-preprocess.md)
- [Custom metadata](./docs/metadata.md)
- [Narrowing the schema type](./docs/narrowing.md)
- [Schema as data](./docs/schema-as-data.md): why `Infer` works on any schema, compared with TypeBox and ajv
- [Benchmarks](./benchmark/README.md): schematox is fastest at parsing primitives and on par with valibot for compound shapes. Compared with zod, valibot, superstruct, ajv, and yup.
- [Migrating](./MIGRATING.md) · [Changelog](./CHANGELOG.md) · [Contributing](./CONTRIBUTING.md)

## License

[MIT](./LICENSE)
