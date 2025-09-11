# schematox

Schematox is a lightweight typesafe schema defined parser. All schemas are JSON compatible.

The library is focusing on fixed set of schema types: string, number, boolean, literal, object, record, array, union. Each schema can have parameters: optional, nullable, description. Each primitive schema has "brand" parameter as mean of making its subject type [nominal](https://github.com/Microsoft/TypeScript/wiki/FAQ#can-i-make-a-type-alias-nominal). The rest parameters is schema specific range limiters.

Library supports static schema definition which means your schemas could be completely independent from schematox. One could use such schemas as source for generation other structures like DB models.

The library is small so exploring README.md is enough for understanding its API, checkout limitations/examples and you good to go:

- [Install](#install)
- [Minimal requirements](#minimal-requirements)
- [Features](#features)
- [Limitations](#limitations)
- [Static schema example](#static-schema-example)
- [Programmatic schema example](#programmatic-schema-example)
- [Example for all supported schema types](#example-for-all-supported-schema-types)
  - [String](#string)
  - [Number](#number)
  - [Boolean](#boolean)
  - [Literal](#literal)
  - [Object](#object)
  - [Record](#record)
  - [Array](#array)
  - [Union](#union)
- [Schema parameters](#schema-parameters)
- [Error shape](#error-shape)
- [Use schematox schema as dependency with narrowed type](#use-schematox-schema-as-dependency-with-narrowed-type)

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
- Use schematox schema type as dependency with narrowed types

## Limitations

Currently we support max 12 layers of depth for compound schema type: `object`, `array`, `union`:

```typescript
const schema = object({
  1: object({
    2: object({
      3: object({
        4: object({
          5: object({
            6: object({
              7: object({
                8: object({
                  9: object({
                    10: object({
                      11: object({ 12: object({ x: string() }) }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
})
```

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
   // ^?  Either<InvalidSubject[], User>

parsed.error
    // ^?  Either<InvalidSubject[], User>

parsed.data
    // ^?  User | undefined

if (parsed.error) {
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
   // ^?  Either<InvalidSubject[], User>

parsed.error
    // ^?  Either<InvalidSubject[], User>

parsed.data
    // ^?  User | undefined

if (parsed.error) {
  parsed.error
      // ^? InvalidSubject[]
  throw Error('Parsing error')
}

parsed.data
    // ^? User
```

All programmatically defined schemas are the same as static, one just needs to access it through `__schema` key.

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
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
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
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
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
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
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
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

### Record

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
type FromSchema = Infer<typeof schema>
type FromStruct = Infer<typeof struct>
```

## Schema parameters

- `optional?: boolean` –  unionize with `undefined`: `{ type: 'string', optinoal: true }` result in `string | undefined`

In the context of the object, optional values will be treated as optional properties:

```typescript
const struct = object({ x: string().optional() })

type ExpectedInfer = {
  x?: string | undefined
}
```

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

It's always an array with at least one entry. Each entry includes:

- `code`: we support the following errors:
  - `INVALID_TYPE`: schema subject or default value don't meet schema type specifications
  - `INVALID_RANGE`: `min/max` or `minLength/maxLength` schema requirements aren't met
- `schema`: The specific section of `schema` where the invalid value is found.
- `subject`: The specific part of the validated subject where the invalid value exists.
- `path`: Traces the route from the root to the error subject, with strings as keys and numbers as array indexes.

## Use schematox schema as dependency with narrowed type

Most of the library is type inference generics. All of them are exposed for external usage.
This allows you to form type requirements for the schema itself or write schema extensions.

The following is an example of a real working project which uses `schematox` schemas as a
source for `MongoDB` native driver models generation and well-typed data repository initialization.

```typescript
...
import type {
  PrimitiveSchema,
  BaseObjectSchema,
  BaseUnionSchema,
  StringSchema,
  NumberSchema,
  LiteralSchema,
  BaseArraySchema,
  Infer,
} from 'schematox'

// Restricting model schema to one dimensional object
type BaseRepoModelSchema = BaseObjectSchema<
  | PrimitiveSchema
  | BaseUnionSchema<LiteralSchema<string> | StringSchema>
  | BaseArraySchema<
      | StringSchema
      | NumberSchema
      | BaseUnionSchema<StringSchema>
    >
>

// Allow model schema to be discriminated union
type UnionRepoModelSchema = BaseUnionSchema<BaseRepoModelSchema>
type RepoModelSchema = BaseRepoModelSchema | UnionRepoModelSchema

// We expect that such schema be programmatically defined
export type RepoTox = {
  __schema: RepoModelSchema
  parse: (x: unknown) => EitherError<unknown, unknown>
  validate: (x: unknown) => EitherError<unknown, unknown>
}

// How repo model
export type RepoModel<
  T extends RepoTox = RepoTox,
  U extends Record<string, unknown> = Infer<T>,
> = {
  tox: T
  relations: FieldRelation[]

  get: (filter?: MongoFilter<U>, session?: ClientSession) => Promise<U[]>

  // ... the rest is ommited for simplification
}

export type InitRepo<T extends Record<string, RepoTox>> = {
  [k in keyof T]: RepoModel<T[k]>
} & {
/**
 * Stub each repo model method with predefined `session` and `userId`
 **/
  _wrap: (session?: ClientSession, userId?: string) => InitRepo<T>
}

// Function which initialized repository
export function initRepo<T extends Record<string, RepoTox>>(
  mongoClient: MongoClient,
  dbName: string,
  models: T
): Promise<InitRepo<T>>
```

Sooner or later, this logic will be abstracted as a separate module, we put it there so you have a broad understanding of `schematox` potential.

Using the following approach, we could define models using only `schematox` schemas and have branded identifiers.

- Define a brand which signifies the model's primary key and other brands
- Define which schema logic can be shared between different models (or abstract as you go)
- Define the required model schematox `object`
- Add the defined schema in a special `models` object, the validity of which is checked by (`as const satisfies Record<ModelBrand, RepoTox>`)

```typescript
import * as t from 'schematox'

export const brand = {
  idFor: <T extends I.ModelBrand>(x: T) => [MODEL_BRAND_TYPE, x] as const,
  format: <T extends I.FormatBrand>(x: T) => [FORMAT_BRAND_TYPE, x] as const,
} as const

export const getResourceIdTox = <T extends I.ModelBrand>(x: T) =>
  string()
    .maxLength(254)
    .brand(...brand.idFor(x))

export const timestamp = t
  .number()
  .brand(...brand.format(FORMAT_BRAND.timestamp))

export const userId = getResourceIdTox(MODEL_BRAND_BY_KEY.user)

/**
 * Each model schema must share `modelShared` fields
 **/
export const modelShared = {
  createdAt: timestamp,
  createdBy: userId.description(IGNORE_RELATION),
}

export const user = t.object({
  ...modelShared,
  id: userId,
  email: t.string(),
})
```

Such schema into `models.ts` file:

```typescript
import { user } from './schema'

export type ModelToxByBrand = typeof models

export const models = {
  user,
} as const satisfies Record<ModelBrand, RepoTox>
```

Server will init those schemas like this:

```typescript
import { models } from './models'

async function init() {
  const db = await dbConnect()
  const repo = await initRepo(db, config.db.name, models)
    ...
}
```

And now developer can access/manage `user` model without specifying any model specific types. Example:

```typescript
const users = await repo.user.get()
```

The `users` in this case will contain all `user` records from the DB and the type will correspond to the schema we initially defined.
One could notice that we put the `IGNORE_RELATION` flag into `description`, which looks weird.

Because of this, we are going to support a special [`x` property on each schema](https://github.com/incerta/schematox/issues/28)
so developers could arbitrarily extend the schema without breaking the built-in semantics of the `description` key.
