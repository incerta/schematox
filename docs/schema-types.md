# Schema types

Every type is shown twice: as a static schema (plain data) and as the equivalent struct (builder). Both infer the same type and parse the same way — `struct.__schema` is exactly the static object.

Every schema accepts the shared params `optional`, `nullable`, `description`, and `meta`. Every primitive except `unknown` also accepts `brand` — see [Branding](./branding.md).

| param         | static                      | struct                       | effect on `Infer`                           |
| ------------- | --------------------------- | ---------------------------- | ------------------------------------------- |
| `optional`    | `optional: true`            | `.optional()`                | `T \| undefined`                            |
| `nullable`    | `nullable: true`            | `.nullable()`                | `T \| null`                                 |
| `brand`       | `brand: ['idFor', 'User']`  | `.brand('idFor', 'User')`    | `T & { __idFor: 'User' }`                   |
| `description` | `description: 'User age'`   | `.description('User age')`   | none                                        |
| `meta`        | `meta: { dbColumn: 'age' }` | `.meta({ dbColumn: 'age' })` | none — see [Custom metadata](./metadata.md) |

Each struct param can be applied once; applying it returns a new struct and leaves the original unchanged.

- [Primitives](#primitives): [bigint](#bigint), [boolean](#boolean), [literal](#literal), [number](#number), [string](#string), [unknown](#unknown)
- [Compounds](#compounds): [array](#array), [object](#object), [record](#record), [tuple](#tuple), [union](#union)

## Primitives

### bigint

`min`/`max` are bigint strings, since JSON has no bigint literal.

```typescript
const schema = {
  type: 'bigint',
  min: '0',
  max: '18446744073709551615',
  brand: ['unit', 'wei'],
} as const satisfies Schema

const struct = bigint()
  .min('0')
  .max('18446744073709551615')
  .brand('unit', 'wei')

// bigint & { __unit: 'wei' }
type T = Infer<typeof struct>
```

### boolean

```typescript
const schema = {
  type: 'boolean',
  optional: true,
  description: 'Subscribed to the newsletter',
} as const satisfies Schema

const struct = boolean() //
  .optional()
  .description('Subscribed to the newsletter')

// boolean | undefined
type T = Infer<typeof struct>
```

### literal

A string, number, or boolean literal.

```typescript
const schema = {
  type: 'literal',
  of: 'admin',
  nullable: true,
} as const satisfies Schema

const struct = literal('admin').nullable()

// 'admin' | null
type T = Infer<typeof struct>
```

### number

Only finite numbers are accepted — `NaN` and `±Infinity` are rejected.

```typescript
const schema = {
  type: 'number',
  min: 0,
  max: 150,
  meta: { dbColumn: 'age' },
} as const satisfies Schema

const struct = number() //
  .min(0)
  .max(150)
  .meta({ dbColumn: 'age' })

// number
type T = Infer<typeof struct>
```

### string

```typescript
const schema = {
  type: 'string',
  minLength: 1,
  maxLength: 64,
  brand: ['idFor', 'User'],
} as const satisfies Schema

const struct = string() //
  .minLength(1)
  .maxLength(64)
  .brand('idFor', 'User')

// string & { __idFor: 'User' }
type T = Infer<typeof struct>
```

### unknown

Accepts any subject — parsing never fails. Useful as an escape hatch for data whose shape isn't known or worth declaring upfront. It has no `brand` param: `T & unknown` collapses to plain `T`, so branding it would silently narrow the type away from `unknown`.

```typescript
const schema = {
  type: 'unknown',
  description: 'Raw webhook payload',
} as const satisfies Schema

const struct = unknown().description('Raw webhook payload')

// unknown
type T = Infer<typeof struct>
```

## Compounds

Any compound schema can contain any other schema, including another compound.

### array

```typescript
const schema = {
  type: 'array',
  of: { type: 'string' },
  minLength: 1,
  maxLength: 10,
} as const satisfies Schema

const struct = array(string()) //
  .minLength(1)
  .maxLength(10)

// string[]
type T = Infer<typeof struct>
```

### object

Extra properties in the subject that aren't declared in the schema don't cause an error and are dropped from the result. This is deliberate: client schemas keep working when an API adds fields.

Any plain object is accepted, including `Object.create(null)` and native-bound objects like `process.env`. `Map`, `Set`, `Error`, typed arrays, and other non-plain built-ins are rejected.

```typescript
const schema = {
  type: 'object',
  of: {
    name: { type: 'string' },
    age: { type: 'number', optional: true },
  },
} as const satisfies Schema

const struct = object({
  name: string(),
  age: number().optional(),
})

// { name: string; age?: number | undefined }
type T = Infer<typeof struct>
```

### record

Entries whose value is `undefined` are skipped in the result and not counted by `minLength`/`maxLength`. If a key exists in the result, its value is present.

If a `key` schema is given, every key is parsed against it — an entry with an invalid key produces an error and is excluded from the result and from length counting. Any string key, including `__proto__`, is stored as ordinary data; the result's prototype is never altered by the subject's keys.

Like `object`, any plain object is accepted and non-plain built-ins are rejected.

```typescript
const schema = {
  type: 'record',
  key: { type: 'string', brand: ['idFor', 'User'] },
  of: { type: 'number' },
  maxLength: 1000,
} as const satisfies Schema

const userId = string().brand('idFor', 'User')
const struct = record(number()) //
  .key(userId)
  .maxLength(1000)

// Record<string & { __idFor: 'User' }, number>
type T = Infer<typeof struct>
```

### tuple

Unlike `object`, extra elements beyond the declared arity are rejected — a tuple's shape is exact. A trailing element whose own schema is `optional` can still be omitted.

```typescript
const schema = {
  type: 'tuple',
  of: [{ type: 'number' }, { type: 'number' }],
} as const satisfies Schema

const struct = tuple([number(), number()])

// [number, number]
type T = Infer<typeof struct>
```

### union

Members are tried in order and the first match wins. Be careful with object unions that have no unique discriminant: a subject matching several members is parsed by the first one.

```typescript
const schema = {
  type: 'union',
  of: [
    { type: 'literal', of: 'active' },
    { type: 'literal', of: 'banned' },
  ],
} as const satisfies Schema

const struct = union([literal('active'), literal('banned')])

// 'active' | 'banned'
type T = Infer<typeof struct>
```
