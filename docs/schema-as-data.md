# Schema as data: why `Infer` works on any schema

Zod, Yup, and Joi schemas are built from function calls, so a schema only ever exists as code you import. A schematox schema is a plain JSON object — write it as a literal, load it from a database, generate it from another source of truth — and it's still a full typesafe parser with real inferred types, not just validated data.

```typescript
import type { Infer, Schema } from 'schematox'

const schema = {
  type: 'object',
  of: {
    id: { type: 'string', brand: ['idFor', 'User'] },
    name: { type: 'string' },
  },
} as const satisfies Schema

type User = Infer<typeof schema>
// ^? { id: string & { __idFor: 'User' }, name: string }
```

## Why this works

`Infer<T>` is an ordinary TypeScript conditional type over the `Schema` union — it pattern-matches on the schema's own `type`/`of`/`brand`/`optional`/`nullable` keys and builds the output type from them. Nothing about that computation cares whether the object came from a builder, a hand-written literal, `JSON.parse`, or a codegen step. The `schema` constant above was typed with nothing but a plain object literal and `as const satisfies Schema` — no call to `object()`/`string()` was involved, and `Infer` still recovers the fully branded `User` type.

## Why other schema-as-data libraries cannot

- **TypeBox** schemas are real JSON Schema at runtime, and `Static<T>` also looks like structural inference — but it's reading a `static` field that exists only in the _type_ TypeBox's `Type.String()`/`Type.Object()` builders fabricate for their return value. It is never actually present on the object at runtime, and you cannot write it yourself in a literal, because doing so would require already knowing the TypeScript type you're trying to derive. Take a JSON Schema object from anywhere outside TypeBox's own builders — a database row, a config file, an OpenAPI document — and `Static<T>` has nothing to read; you get validation but no type.
- **Plain JSON Schema / ajv** have no compile-time type at all. The schema is data, full stop — there is no equivalent of `Infer`/`Static` to call.

So the static schema form isn't just "you can also write JSON instead of calling a builder" — it's that the type contract for a piece of data can itself be expressed _as that same data_, and TypeScript will recover it, regardless of where the data came from. Struct and `makeStruct` are conveniences built on top of the same `Schema` shape, not a separate, richer format the static form is missing out on.

The same property is what makes [narrowing the schema type](./narrowing.md) possible: TypeBox's `TSchema` subtypes carry phantom `static`/`params` fields, so hand-composing a restricted schema type breaks the machinery that produces `Static<T>`.
