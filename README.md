# schematox

Schematox is a lightweight typesafe schema defined parser/validator. All schemas are JSON compatible.

Instead of supporting all possible JS/TS data structures, the library is focusing on fixed set of schema types: string, number, boolean, literal, object, array, union. Each schema can have parameters: optional, nullable, description. Each primitive schema has "brand" parameter as mean of making its subject type [nominal](https://github.com/Microsoft/TypeScript/wiki/FAQ#can-i-make-a-type-alias-nominal). The rest parameters is schema specific range limiters.

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
  - [Array](#array)
  - [Union](#union)
- [Difference between parse and validate](#difference-between-parse-and-validate)
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
- Check defined schema correctness using non generic type "Schema"
- Programmatically defined schema (struct)
- Schema subject verification methods:
  - parse: constructs new object based on the given schema and subject
  - validate: checks and returns reference to the original schema subject
  - guard: validates and narrows schema subject type in the current scope
- Ether-style error handling (no unexpected throws)
- First-class support for branded primitives (primitive nominal types alias)
- Use schematox schema as dependency with narrowed type

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

- `optional?: boolean` –  unionize with `undefined`: `{ type: 'string', optinoal: true }` result in `string | undefined`

In the context of the object, optional values will be treated as optional properties:

```typescript
const struct = object({ x: string().optional() })

type ExpectedSubjectType = {
  x?: string | undefined
}
```

- `nullable?: boolean` – unionize with `null`: `{ type: 'string', nullable: true }` result in `string | null`
- `brand?: [string, string]` – make primitive type nominal "['idFor', 'User'] -> T & { \_\_idFor: 'User' }"
- `minLength/maxLength/min/max` – schema type dependent limiting characteristics
- `description?: string` – description of the particular schema property which can be used to provide more detailed information for the user/developer on validation/parse error

## Difference between parse and validate

Parsing creates a new object. Validation/guard checks if an existing object satisfies the defined schema.
When you parse something, extra keys are allowed; if you validate/guard, extra keys will cause an `EXTRA_KEY` error.

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

- `code`: we support the following errors:
  - `INVALID_TYPE`: schema subject or default value don't meet schema type specifications
  - `INVALID_RANGE`: `min/max` or `minLength/maxLength` schema requirements aren't met
  - `EXTRA_KEY`: `object` type validation subject has a key which is not specified in schema
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
  SubjectType,
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
  U extends Record<string, unknown> = SubjectType<T>,
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
