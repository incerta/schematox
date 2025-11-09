# schematox

Schematox is a lightweight typesafe schema defined parser. All schemas are JSON compatible.

The library is focusing on fixed set of schema types: boolean, literal, number, string, array, object, record, tuple, union. Each schema can have parameters: optional, nullable, description. Each primitive schema has "brand" parameter as mean of making its subject type [nominal](https://github.com/Microsoft/TypeScript/wiki/FAQ#can-i-make-a-type-alias-nominal). The rest parameters is schema specific range limiters.

Library supports static schema definition which means your schemas could be completely independent from schematox. One could use such schemas as source for generation other structures like DB models.

The library is small so exploring README.md is enough for understanding its API, checkout [examples](#example-for-all-supported-schema-types) and you good to go:

- [Install](#install)
- [Minimal requirements](#minimal-requirements)
- [Features](#features)
- [Static schema example](#static-schema-example)
- [Programmatic schema example](#programmatic-schema-example)
- [Example for all supported schema types](#example-for-all-supported-schema-types)
  - [Boolean](#boolean)
  - [Literal](#literal)
  - [Number](#number)
  - [String](#string)
  - [Array](#array)
  - [Object](#object)
  - [Record](#record)
  - [Tuple](#tuple)
  - [Union](#union)
- [Schema parameters](#schema-parameters)
- [Error shape](#error-shape)

## Install

```sh
npm install schematox
```

## Minimal requirements

- ECMAScript version: `2018`
- TypeScript version: `5.3.2`

## Features

- Statically defined JSON compatible schema
- Programmatically defined schema (struct)
- Check defined schema correctness using non generic type "Schema"
- Ether-style error handling (no unexpected throws)
- First-class support for branded primitives (primitive nominal types alias)
- Construct type requirement for schema itself using exposed type generics


## Static schema example

Statically defined schema:

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

## Programmatic schema example

Same schema but defined programmatically:

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

All programmatically defined schemas are the same as static, one just needs to access it through `__schema` key.
A statically defined schema can be transformed to a struct using the `makeStruct` utility function and can have custom props.

## Transform static schema into struct

```typescript
import { makeStruct } from 'schematox'
import type { Schema } from 'schematox'

const schema = { type: 'string' } as const satisfies Schema
const string = makeStruct(schema)
```

## Example for all supported schema types

We distinguish two main categories of schema units:

- primitive: boolean, literal, number, boolean
- compound: array, object, record, union

Any schema share optional/nullable/description parameters. Any compound schema could have any other schema type as its member including itself. Any primitive schema can have "brand" parameter.

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
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
//
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
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

### Object

Extra properties in the parsed subject that are not specified in the `object` schema will not cause an error and will be skipped.
This is a deliberate decision that allows client schemas to remain functional whenever the API is extended.

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

Undefined record entries are skipped in parsed results. If a key exists, it means a value is also present.

```typescript
const schema = {
  type: 'record',
  // key property is optional
  key: { type: 'string', brand: ['idFor', 'user'] },
  of: { type: 'number' },
  optional: true,
  nullable: true,
  description: 'x',
} as const satisfies Schema

const userId = string().brand('idFor', 'user')

// second argument is optional
const struct = object(number(), userId).optional().nullable().description('x')

// Record<string & { __brand: ['idFor', 'user'] }, number | undefined>  | null | undefined
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

## Schema parameters

- `optional?: boolean` –  unionize with `undefined`: `{ type: 'string', optinoal: true }` result in `string | undefined`
- `nullable?: boolean` – unionize with `null`: `{ type: 'string', nullable: true }` result in `string | null`
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

The `result.error` shape is:

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

It's always an array of `InvalidSubject` entries, each of which has the following properties:

- `code`: we support the following errors:
  - `INVALID_TYPE`: schema subject or default value don't meet schema type specifications
  - `INVALID_RANGE`: `min/max` or `minLength/maxLength` schema requirements aren't met
- `schema`: The specific section of `schema` where the invalid value is found.
- `subject`: The specific part of the validated subject where the invalid value exists.
- `path`: Traces the route from the root to the error subject, with strings as keys and numbers as array indexes.
