# Schematox

Schematox is a lightweight typesafe schema defined parser/validator. All schemas are JSON compatible.

Instead of supporting all possible JS/TS data structures, the library is focusing on fixed set of schema types: string, number, boolean, literal, object, array, union. Each schema can have parameters: optional, nullable, description. Each primitive schema has "brand" parameter as mean of making its subject type [nominal](https://github.com/Microsoft/TypeScript/wiki/FAQ#can-i-make-a-type-alias-nominal). The rest parameters is schema specific range limiters.

Library supports static schema definition which means your schemas could be completely independent from schematox. One could use such schemas as source for generation other structures like DB models.

Features:

- Statically defined JSON compatible schema
- Check defined schema correctness using non generic type "Schema"
- Programmatically defined schema (struct)
- Schema subject verification methods:
  - parse: constructs new object based on the given schema and subject
  - validate: checks and returns reference to the original schema subject
  - guard: validates and narrows schema subject type in the current scope
- Ether-style error handling (no unexpected throws)
- First-class support for branded primitives (primitive nominal types alias)

Check out [github issues](https://github.com/incerta/schematox/issues) to know what we are planning to support soon.

Currently we on version 0. The public API is mostly defined however few thing left before the first major release:

- Record and tuple schema support
- Allow parser to replace value before it's validated (similar to [coercing](https://docs.superstructjs.org/guides/03-coercing-data) concept)
- Clearly defined supported versions of typescript/node
- Support "deno" runtime and publish package on "deno.land"
- Have a benchmark that compares library performance with other parsers

The library is small so exploring README.md is enough for understanding its API, checkout limitations/examples and you good to go:

- [Install](#install)
- [Limitations](#limitations)
- [Static schema example](#static-schema-example)
- [Programmatic schema example](#programmatic-schema-example)
- [Example for all supported schema types](#example-for-all-supported-schema-types)
  - [String](#string)
  - [Number](#number)
  - [Boolean](#boolean)
  - [Literal](#literal)
  - [Object](#object)
  - [Array](#array)
  - [Union](#union)
- [Schema parameters](#schema-parameters)
- [Error shape](#error-shape)

## Install

```sh
npm install schematox
```

## Limitations

Currently we support max 7 layers of depth for compound schema type: object, array, union.

Because of this we can check structural correctness of the statically defined schema using non generic type `Schema`. Important detail is that `union` schema type is also compound type so each nested definition counts as +1 layer of depth.

## Static schema example

Statically defined schema:

```typescript
import { parse, validate, guard } from 'schematox'
import type { Schema } from 'schematox'

export const userSchema = {
  type: 'object',
  of: {
    id: {
      type: 'string',
      brand: ['idFor', 'User'],
    },
    name: { type: 'string' },
  },
} as const satisfies Schema

const subject = {
  id: '1' as SubjectType<typeof userSchema.id>,
  name: 'John',
} as unknown

const parsed = parse(userSchema, subject)

if (parsed.left) {
  throw Error('Not expected')
}

console.log(parsed.right) // { id: '1', name: 'John' }

const validated = validate(userSchema, subject)

if (validated.left) {
  throw Error('Not expected')
}

console.log(validated.right) // { id: '1', name: 'John' }

if (guard(userSchema, subject)) {
  // { id: string & { __idFor: 'User' }; name: string }
  subject
}
```

## Programmatic schema example

Same schema but defined programmatically:

```typescript
import { object, string } from 'schematox'
import type { SubjectType } from 'schematox'

const struct = object({
  id: string().brand('idFor', 'User'),
  name: string(),
})

const subject = { id: '1', name: 'John' } as unknown

const parsed = struct.parse(subject)

if (parsed.left) {
  throw Error('Not expected')
}

console.log(parsed.right) // { id: '1', name: 'John' }

const validated = struct.validate(subject)

if (validated.left) {
  throw Error('Not expected')
}

console.log(validated.right) // { id: '1', name: 'John' }

if (struct.guard(subject)) {
  // { id: string & { __idFor: 'User' }; name: string }
  subject
}
```

All programmatically defined schemas are the same as static, one just needs to access it through `__schema` key. We can mix static/programmatic schemas either accessing it through `__schema` or wrap it by `{ __schema: T }` if consumer is programmatic schema.

## Example for all supported schema types

We distinguish two main categories of schema units:

- primitive: string, number, boolean, literal
- compound: object, array, union

Any schema share optional/nullable/description parameters. Any compound schema could have any other schema type as its member including itself. Any primitive schema can have "brand" parameter.

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
type FromSchema = SubjectType<typeof schema>
type FromStruct = SubjectType<typeof struct>
```

### Number

```typescript
const schema = {
  type: 'number',
  optional: true,
  nullable: true,
  brand: ['x', 'y'],
  min: 1,
  max: 2,
  description: 'x',
} as const satisfies Schema

const struct = number()
  .optional()
  .nullable()
  .brand('x', 'y')
  .min(1)
  .max(2)
  .description('x')

// (number & { __x: 'y' }) | undefined | null
type FromSchema = SubjectType<typeof schema>
type FromStruct = SubjectType<typeof struct>
//
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
type FromSchema = SubjectType<typeof schema>
type FromStruct = SubjectType<typeof struct>
```

### Literal

Could be string/number/boolean literal

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
type FromSchema = SubjectType<typeof schema>
type FromStruct = SubjectType<typeof struct>
```

### Object

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
type FromSchema = SubjectType<typeof schema>
type FromStruct = SubjectType<typeof struct>
```

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
type FromSchema = SubjectType<typeof schema>
type FromStruct = SubjectType<typeof struct>
```

### Union

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
type FromSchema = SubjectType<typeof schema>
type FromStruct = SubjectType<typeof struct>
```

## Schema parameters

- `optional?: boolean` – does `undefined` is valid value
- `nullable?: boolean` – does `null` is valid value
- `brand?: [string, string]` – make primitive type nominal "['idFor', 'User'] -> T & { \_\_idFor: 'User' }"
- `minLength/maxLength/min/max` – schema type dependent limiting characteristics
- `description?: string` – description of the particular schema property which can be used to provide more detailed information for the user/developer on validation/parse error

## Error shape

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

The `result.left` shape is:

```json
[
  {
    "code": "INVALID_TYPE",
    "schema": { "type": "string" },
    "subject": 0,
    "path": ["x", "y", 0, "z"]
  }
]
```

It's always an array with at least one entry. Each entry includes:

- `code`: Specifies either `INVALID_TYPE` (when schema subject or default value don't meet schema type specifications), or `INVALID_RANGE` (when `min/max` or `minLength/maxLength` schema requirements aren't met).
- `schema`: The specific section of `schema` where the invalid value is found.
- `subject`: The specific part of the validated subject where the invalid value exists.
- `path`: Traces the route from the root to the error subject, with strings as keys and numbers as array indexes.
