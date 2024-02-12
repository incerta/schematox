# SchematoX

SchmatoX is a lightweight library for creating JSON compatible schemas. The subject of the schema can be parsed or validated by the library in a type-safe manner. Instead of focusing on supporting all possible JS/TS data structures, we provide a set of constraints that help reduce the complexity of communication between different JS tools and runtimes.

## Pros

- The statically defined JSON compatible schema
- Check defined schema correctness using non generic type `Schema`
- Programmatically defined schemas supported as mean of creation statically defined schema
- Clear separation of concerns for validating and parsing logic:
  - Parser is used for dealing with an outer uknnown interface
  - Validator is used for dealing with an internal known interface
- Schematox uses an Ether-style error handling
- We offer first-class support for branded base schema primitive types
- We have zero dependencies. The runtime code logic is small and easy to grasp, consisting of just a couple of functions. Most of the library code is tests and types.

Essentially, to define a schema, one doesn't need to import any functions from our library, only the `as const satisfies Schema` statement. This approach does come with a few limitations. The first is `stringUnion` and `numberUnion` schema default values are not constrained by the defined union choices, only the primitive type. We might fix this issue later, but for now, we prioritize this over the case when `default` extends union choice by its definition.

A second limitation is the depth of the compound schema data structure. Currently, we support 7 layers of depth. It's easy to increase this number, but because of the exponential nature of stored type variants in memory, we want to determine how much RAM each next layer will use before increasing it.

It's crucial to separate parsing/validation logic from the schema itself. Libraries like `superstract` or `zod` mix these two elements. While that's handy for starters, it reduces our ability to create independent parsers/validators. The same goes for building infrastructure based on top of these great alternatives. As mentioned, our schemas are just JSON compatible objects, which can be completely independent from our library.

## Cons

- The library is not ready for production yet, the version is 0 and public API might be changed
- Currently we support only 7 layers of compound structure depth but most likely it will be higher soon
- We do not support records, discriminated unions, object unions, array unions, intersections, functions, NaN, Infinity and other not JSON compatible structures
- Null value is acceptable by the parser but will be treated as undefined and transformed to undefined
- Null value is not acceptable by the validator

Check out [github issues](https://github.com/incerta/schematox/issues) of the project to know what we are planning to support soon.

## Installation

```sh
npm install schematox
```

## Example

Statically defined schema:

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

Same schema but defined programmatically:

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

Parse/validate:

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

Result type of `parsedByX.data` or `validatedByX.data`

```typescript
type Data = {
  id: string & { __idFor: 'User' }
  email: string & { __format: 'email' }
  updatedAt: number & { __format: 'msUnixTimestamp' }
  canRead: Array<string & { __idFor: 'User' }>
  canWrite: Array<string & { __idFor: 'User' }>
}
```

## All supported data types

```typescript
import {
  array,
  object,
  string,
  number,
  boolean,
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

## Validate/parse InvalidSubject error shape

Nested schema example. Subject `0` is invalid, should be a `string`:

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
```

The `result.error` will be:

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

If the `error` is present it's always an array which has at least one entry. Each entry has the following properties:

- `code` – could be `INVALID_TYPE` if schema subject or schema default value is not satisfies schema type requirement. Another code `INVALID_RANGE` which is about `min/max` and `minLength/maxLength` schema requirements
- `schema` – the particular chunk of the `schema` where invalid subject value is found
- `subject` – the particular chunk of the validated subject where invalid value is found
- `path` – the path to error subject chunk from the root of the evaluated subject. Strings is keys and numbers are the array indexes

## Parse/validate differences

The parser returns `data` as new object/primitive without references to the parsed subject. Parser manages the `null` value as `undefined` and subsequently replaces it with `undefined`. It also swaps `optional` values with the `default` value from schema. One can infer schema parsed subject type by using `XParsed<typeof schema>` generic.

The validator on the other hand returns the evaluated subject itself and not applying any mutation/transformation to it. The validator should be used in exceptional cases when we known subject type but not sure that it actually correct. One can infer schema validated subject type by using `XValidated<typeof schema>` generic.

So the difference between `XParsed` and `XValidated` is just about handling `default` schema value. `XParsed` narrows optional schema subject type with default value in the way that it will not be optional, because optional `undefined` and `null` values will be replaced by the `default`. `XValidated` just ignores `default` schema value.

Examples:

```typescript
const optionalStrX = x('string?')

/* Parser doesn't check subject type */

expect(optionalStrX.parse(0).error).toStrictEqual([
  {
    code: 'INVALID_TYPE',
    schema: 'string?',
    subject: 0,
    path: [],
  },
])

/* Validator does */

// @ts-expect-error 'number' is not 'string'
expect(optionalStrX.validate(0).error).toStrictEqual([
  {
    code: 'INVALID_TYPE',
    schema: 'string?',
    subject: 0,
    path: [],
  },
])

/* Parser treats `null` as `undefined` */

expect(optionalStrX.parse(null).data).toBe(undefined)
expect(optionalStrX.parse(null).error).toBe(undefined)

/* Validator is not */

// @ts-expect-error 'null' is not 'string | undefined'
expect(optionalStrX.validate(null).error).toStrictEqual([
  {
    code: 'INVALID_TYPE',
    schema: 'string?',
    subject: null,
    path: [],
  },
])

const defaultedStrX = x({ type: 'string', optional: true, default: 'y' })

/* Parser uses `default` value on `null` or `undefined` subject  */

expect(defaultedStrX.parse(null).data).toBe('y')
expect(defaultedStrX.parse(undefined).data).toBe('y')

/* Validator ignores default value */

expect(defaultedStrX.validate(undefined).data).toBe(undefined)

/* Parser returning new object */

expect(arrX.parse(subject).data === subject).toBe(false)

/* Validator keeps the subject reference */

expect(arrX.validate(subject).data === subject).toBe(true)
```
