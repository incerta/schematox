# SchematoX

SchmatoX is a lightweight library for creating JSON compatible schemas. The subject of the schema can be parsed or validated by the library in a type-safe manner. Instead of focusing on supporting all possible JS/TS data structures, we provide a set of constraints that help reduce the complexity of communication between different JS tools and runtimes.

## Pros

- The statically defined JSON compatible schema
- Check defined schema correctness using non generic type `Schema`
- Programmatically defined schemas supported as mean of creation statically defined schema
- Clear separation of concerns for `validator` and `parser`:
  - Parse: constructs new object based on the given schema and subject
  - Validate: checks and returns reference to the original schema subject with narrowed type
- Schematox uses an Ether-style error handling (no unexpected throws) with an exception of `assert` function
- We offer first-class support for branded base schema primitive types
- We have zero dependencies and our runtime code logic is small and easy to grasp, consisting of just a couple of functions
- Our schemas are just JSON compatible objects, which can be completely independent from our library

Essentially, to define a schema, one doesn't need to import any functions from our library, only the `as const satisfies Schema` statement. This approach does come with a few limitations. The first is `stringUnion` and `numberUnion` schema default values are not constrained by the defined union choices, only the primitive type. We might fix this issue later, but for now, we prioritize this over the case when `default` extends union choice by its definition.

A second limitation is the depth of the compound schema data structure. Currently, we support 7 layers of depth. It's easy to increase this number, but because of the exponential nature of stored type variants in memory, we want to determine how much RAM each next layer will use before increasing it drastically. It will be certainly done before version 1 release.

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

## Static schema example

Statically defined schema:

```typescript
import { parse, validate, guard, assert } from 'schematox'
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

if (parsed.error) {
  throw Error('Not expected')
}

console.log(parsed.data) // { id: '1', name: 'John' }

const validated = validate(userSchema, subject)

if (validated.error) {
  throw Error('Not expected')
}

console.log(validated.data) // { id: '1', name: 'John' }

if (guard(userSchema, subject)) {
  subject // type is narrowed: { id: string & { __idFor: 'User' }; name: string }
}

const anotherSubject = { ...subject } as unknown

// Throws error if subject is not valid
assert(userSchema, anotherSubject)

anotherSubject // type is narrowed: { id: string & { __idFor: 'User' }; name: string }
```

## Programmatic schema example

Same schema but defined programmatically:

```typescript
import { object, string, assert } from 'schematox'
import type { SubjectType } from 'schematox'

const userStruct = object({
  id: string().brand('idFor', 'User'),
  name: string(),
})

const subject = {
  id: '1' as SubjectType<typeof userSchema.id>,
  name: 'John',
} as unknown

const parsed = userStruct.parse(subject)

if (parsed.error) {
  throw Error('Not expected')
}

console.log(parsed.data) // { id: '1', name: 'John' }

const validated = userStruct.validate(subject)

if (validated.error) {
  throw Error('Not expected')
}

console.log(validated.data) // { id: '1', name: 'John' }

const guard = userStruct.guard(subject)

if (guard) {
  subject // { id: string & { __idFor: 'User' }; name: string }
}

if (userStruct.guard(subject)) {
  subject // type is narrowed: { id: string & { __idFor: 'User' }; name: string }
}

const anotherSubject = { ...subject } as unknown

// Throws error if subject is not valid
assert(userStruct.__schema, anotherSubject)

anotherSubject // type is narrowed: { id: string & { __idFor: 'User' }; name: string }
```

Unfortunately we can't currently integrate `assert` as struct method due to [typescript limitations](https://github.com/microsoft/TypeScript/issues/36931#issuecomment-1949131317). But all programmatically defined schemas are the same as static, one just needs to access it through `__schema`. We can mix static/programmatic schemas either accessing it through `__schema` or wrap it by `{ __schema: T }` if consumer is programmatic schema.

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

const staticString = {
  type: 'string',
  optional: true,
  brand: ['x', 'y'],
  minLength: 1,
  maxLength: 1,
  description: 'x',
} as const satisfies Schema

const programmaticString = string()
  .optional()
  .minLength(1)
  .maxLength(1)
  .brand('x', 'y')
  .description('y')

// number

const staticNumber = {
  type: 'number',
  optional: true,
  brand: ['x', 'y'],
  min: 1,
  max: 1,
  description: 'x',
} as const satisfies Schema

const programmaticNumber = number()
  .optional()
  .min(1)
  .max(1)
  .brand('x', 'y')
  .description('y')

// boolean

const staticBoolean = {
  type: 'boolean',
  optional: true,
  default: false,
  brand: ['x', 'y'],
  description: 'x',
} as const satisfies Schema

const programmaticBoolean = boolean()
  .optional()
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

## Verification error shape

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

- `code`: Specifies either `INVALID_TYPE` (when schema subject or default value don't meet schema type specifications), or `INVALID_RANGE` (when `min/max` or `minLength/maxLength` schema requirements aren't met).
- `schema`: The specific section of `schema` where the invalid value is found.
- `subject`: The specific part of the validated subject where the invalid value exists.
- `path`: Traces the route from the root to the error subject, with strings as keys and numbers as array indexes.

## Parse and validate differences

The `parser` returns `data` as new object without references to the parsed subject. Parser manages the `null` value as `undefined` and subsequently replaces it with `undefined`.

The `validator` returns the evaluated subject itself and not applying any mutation/transformation to it. The validator should be used in exceptional cases when we known subject type but not sure that it actually correct.
