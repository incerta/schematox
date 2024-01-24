# SchematoX

SchmatoX is a lightweight library for creating JSON compatible schemas. The subject of the schema can be parsed or validated by the library in a type-safe manner. Instead of focusing on supporting all possible JS/TS data structures, we provide a set of constraints that help reduce the complexity of communication between different JS tools and runtimes.

### Pros

- The statically defined JSON compatible schema is a killer feature:
  - It has great potential for automation in the context of DB model creation, CRUD backends, documentation, outer interface requirements etc.
  - One can store schema changes as static JSON and potentially use it for creating coherent DB Model migration logic.
  - One can check if the defined schema is compatible with our constraints using the `as const satisfies Schema` TypeScript statement.
- Programmatically defined schemas are also supported, but as a means of creating statically defined schemas.
- A separate `x` closure wrapper exists for both schema definition and is used for validating/parsing the schema subject on demand. It is also compatible with other programmatically defined schemas.
- There is a clear separation of concerns for validating and parsing logic.
  - The Schematox parser is used for dealing with an outer interface where the data type is not guaranteed.
  - The Schematox validator is used for dealing with an internal interface where the data type is known and satisfies the schema requirements.
- Schematox uses an Ether-style error handling system. It never throws an error on an unsuccessful schema subject check. Instead, our parser/validator always returns an `EitherError` object with one of two keys: `error` or `data`. We believe that the parser/validator should not throw errors because dealing with an invalid schema subject is part of its internal logic. Therefore, invalid data cases should not be considered as exceptions or errors.
- We offer first-class support for branded base schema types. Currently, `schematoX` might be the only library that promotes this technique, which in our opinion, is highly underestimated.
- Our library is lightweight. We plan to have a max unpacked size of 150 kB. Currently our stats are:
  - npm notice package size: 13.0 kB
  - npm notice unpacked size: 93.4 kB
- We have zero dependencies, a plain implementation code style, and 100% test coverage. The runtime code logic is small and easy to grasp, consisting of just a couple of functions. Most of the library code is tests, currently over 450, which includes extensive generic type testing. We aim high and aspire to be completely bug-free.

Essentially, to define a schema, one doesn't even need to import any functions from our library, only the `Schema` type. This approach does come with a few limitations. The first is `stringUnion` and `numberUnion` schema default values are not constrained by the defined union choices, only the primitive type. We might fix this issue later, but for now, we prioritize this over the case when `default` extends union choice by its definition.

A second limitation is the depth of the compound schema data structure. Currently, we support 7 layers of depth. It's easy to increase this number, but because of the exponential nature of stored type variants in memory, we want to determine how much RAM each next layer will use before increasing it.

It's crucial to separate parsing/validation logic from the schema itself. Libraries like `superstract` or `zod` mix these two elements. While that's handy for starters, it reduces our ability to create independent parsers/validators. The same goes for building infrastructure based on top of these great alternatives. As mentioned, our schemas are just JSON compatible objects, which can be completely independent from our library.

### Cons

- Currently we support only 7 layers of compound structure depth but most likely it will be higher soon
- We do not support records, discriminated unions, object unions, array unions, intersections, functions, NaN, Infinity and other not JSON compatible structures
- Null value is acceptable by the parser but will be treated as undefined and transformed to undefined
- We only plan to support custom parser/normalizer integration logic.

## Installation

```sh
npm install schematox
```

## Statically defined schema example

```typescript
import type { Schema } from 'schematox'

export const userSchema = {
  type: 'object',
  of: {
    id: {
      type: 'string',
      brand: ['idFor', 'User'],
    },
    email: {
      type: 'string',
      optional: true,
      brand: ['format', 'email'],
    },
    updatedAt: {
      type: 'number',
      brand: ['format', 'msUnixTimestamp'],
    },
    canRead: {
      type: 'array',
      of: {
        type: 'string',
        brand: ['idFor', 'User'],
      },
      minLength: 1,
    },
    canWrite: {
      type: 'array',
      of: {
        type: 'string',
        brand: ['idFor', 'User'],
      },
      minLength: 1,
    },
    bio: 'string?',
  },
} as const satisfies Schema
```

### Programmatically defined schema example

```typescript
import { object, string, number, boolean, array } from 'schematox'

const userIdX = string().brand('idFor', 'User')
const emailX = string().brand('format', 'email')
const msUnixTimestampX = number().brand('format', 'msUnixTimestamp')

export const userSchema = object({
  id: userIdX,
  email: emailX,
  updatedAt: updatedAtX,
  canRead: array(userId),
  canWrite: array(userId),
  bio: string().optional(true),
})
```

### Parse/validate

```typescript
import { parse, validate, x } from 'schematox'
import { userSchema, userId, emailX, msUnixTimestampX } './schema'

import type { XParse } from 'schematox'

type UserId = XParse<typeof userId>
type Email = XParse<typeof emailX>
type MsUnixTimestamp = XParse<typeof msUnixTimestamp>

const adminUserId = '1' as UserId

const schemaSubject = {
  id: adminUserId,
  email: 'john@dow.com' as Email,
  updatedAt: Date.now() as MsUnixTimestamp,
  canRead: [userId],
  canWrite: [userId],
  bio: undefined,
}

const parsed = parse(userSchema, schemaSubject)

// We need a type guard before accessing the prased.data
if (parsed.error) {
  throw Error('Not expected')
}

console.log(parsed.data)

const validated = validate(userSchema, schemaSubject)

// We need a type guard before accessing the validated.data
if (parsed.error) {
  throw Error('Not expected')
}

console.log(validated.data)

/* Another way of doing the same */

const userSchemaX = x(userSchema)

const parsedByX = userSchemaX.parse(schemaSubject)
const validatedByX = userSchemaX.validate(schemaSubject)
```

### Result type inference

```typescript
type ResultType = {
  id: string & { __idFor: 'User' }
  email: string & { __format: 'email' }
  updatedAt: number & { __format: 'msUnixTimestamp' }
  canRead: Array<string & { __idFor: 'User' }>
  canWrite: Array<string & { __idFor: 'User' }>
}
```

## Supported data types

```typescript
import {
  array,
  object,
  string,
  number,
  boolean,
  buffer,
  stringUnion,
  numberUnion,
} from 'schematox'

import type { Schema } from 'schematox'

/* Base types */

// string

const staticShortStringRequired = 'string' satisfies Schema
const staticShortStringOptional = 'string?' satisfies Schema

const staticDetailedString = {
  type: 'string',
  optional: true,
  default: 'x',
  brand: ['x', 'y'],
  minLength: 1,
  maxLength: 1,
  description: 'x',
} as const satisfies Schema

const programmaticString = string()
  .optional()
  .default('x')
  .minLength(1)
  .maxLength(1)
  .brand('x', 'y')
  .description('y')

// number

const staticShortNumberRequired = 'number' satisfies Schema
const staticShortNumberOptional = 'number?' satisfies Schema

const staticDetailedNumber = {
  type: 'number',
  optional: true,
  default: 1,
  brand: ['x', 'y'],
  min: 1,
  max: 1,
  description: 'x',
} as const satisfies Schema

const programmaticNumber = number()
  .optional()
  .default(1)
  .min(1)
  .max(1)
  .brand('x', 'y')
  .description('y')

// boolean

const staticShortBooleanRequired = 'boolean' satisfies Schema
const staticShortBooleanOptional = 'boolean?' satisfies Schema

const staticDetailedBoolean = {
  type: 'boolean',
  optional: true,
  default: false,
  brand: ['x', 'y'],
  description: 'x',
} as const satisfies Schema

const programmaticBoolean = boolean()
  .optional()
  .default(false)
  .brand('x', 'y')
  .description('y')

// buffer
// The default value is not supported because Buffer is not compatible with JSON

const staticShortBufferRequired = 'buffer' satisfies Schema
const staticShortBufferOptional = 'buffer?' satisfies Schema

const staticDetailedBuffer = {
  type: 'buffer',
  optional: true,
  brand: ['x', 'y'],
  minLength: 1,
  maxLength: 1,
  description: 'x',
} as const satisfies Schema

const programmaticBuffer = buffer()
  .optional()
  .minLength(1)
  .maxLength(1)
  .brand('x', 'y')
  .description('y')

// stringUnion

const staticStringUnion = {
  type: 'stringUnion',
  of: ['x', 'y', 'z'],
  optional: true,
  brand: ['x', 'y'],
  description: 'x',
} as const satisfies Schema

const programmaticStringUnion = stringUnion('x', 'y', 'z')
  .optional()
  .brand('x', 'y')
  .description('y')

// stringUnion

const staticNumberUnion = {
  type: 'numberUnion',
  of: [0, 1, 2],
  optional: true,
  brand: ['x', 'y'],
  description: 'x',
} as const satisfies Schema

const programmaticNumberUnion = numberUnion(0, 1, 2)
  .optional()
  .brand('x', 'y')
  .description('y')

/* Compound schema */

// object

const staticObject = {
  type: 'object',
  of: {
    x: 'string',
    y: 'number?',
  },
} as const satisfies Schema

const programmaticObject = object({
  x: string(),
  y: number().optional(),
})

// array

const staticArray = {
  type: 'array',
  of: 'string',
} as const satisfies Schema

const programmaticArray = array(string())
```

## Validation/parse error shape

```typescript
import { x, object, array, string } from 'schematox'

const schemaX = x(
  object({
    x: object({
      y: array(
        object({
          z: string(),
        })
      ),
    }),
  })
)

const result = schemaX.parse({ x: { y: [{ z: 0 }] } })

console.log(result.error)
```

The console.log will output:

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

## Parser details

The parser provides a new object/primitive without references to the evaluated subject, except in the case of `Buffer` for better performance. This functionality is responsible for clearing the `array` schema result value from `undefined` optional schema values.

Moreover, the parser manages the `null` value as `undefined` and subsequently replaces it with `undefined`. It also swaps `optional` values with the `default` value, provided that the default values are explicitly stated in the schema.

Particularly for this last function, the parser uses a separate type inference flow. This flow is accessible for the library user via the type generic `XParsed<T extends Schema>`. By leveraging this mechanism, the user can simplify the process and enhance efficiency.

## Validator details

The validator operates by returning a reference to the original object, rather than applying any form of mutations to it. This is a significant feature because it disregards the schema’s default values. This particular trait of the validator ensures the object's integrity and independence from the schema’s default stipulations.

Furthermore, the validator incorporates a type inference flow distinct from the parser's. This separate flow is aimed at providing the library user with the flexibility and enhanced control needed for effective execution. Available for utilization through the type generic `XValidated<T extends Schema>`
