# Custom metadata

Every schema — static, struct, or construct — accepts an optional `meta` field for your own data: say, mapping each field to a database column, right on the schema that already validates it.

```typescript
import { parse } from 'schematox'
import type { Infer, Schema } from 'schematox'

const userSchema = {
  type: 'object',
  of: {
    id: {
      type: 'string',
      brand: ['idFor', 'User'],
      meta: { dbColumn: 'user_id' },
    },
    name: { type: 'string', meta: { dbColumn: 'full_name' } },
  },
} as const satisfies Schema

userSchema.of.id.meta.dbColumn // 'user_id' — fully typed
userSchema.of.name.meta.dbColumn // 'full_name'

type User = Infer<typeof userSchema>
// ^? { id: string & { __idFor: 'User' }, name: string } — `meta` never leaks in here

function columnNames(schema: typeof userSchema) {
  return Object.values(schema.of).map((field) => field.meta.dbColumn)
}

columnNames(userSchema) // ['user_id', 'full_name']
parse(userSchema, { id: '1', name: 'John' }) // meta has no effect on validation
```

The struct API has the same thing as a chainable setter: `string().meta({ dbColumn: 'user_id' })`, which lands in exactly the same place on `__schema`.

Because `meta` is a real member of `Schema` — not bolted on — it works with the idiomatic `as const satisfies Schema` style directly, no workaround needed. `parse` never reads it and `Infer` never produces it, so it's purely for your own tooling: codegen, reflection, documentation, or anything else that wants to walk the schema and find data schematox itself doesn't care about.

If you need something less structured than a `Record<string, unknown>` — genuinely arbitrary top-level keys, of any shape, on a schema you already have lying around — that's still possible too, just not through a direct `satisfies Schema` check: `makeStruct<T extends Schema>(schema: T): Struct<T>` and `parse<T extends Schema>` both infer `T` from the exact literal you pass, extra keys included, since TypeScript's excess-property check only fires when a fresh literal is checked _against_ a named type — a generic parameter being inferred isn't that. So `makeStruct({ type: 'string', dbColumn: 'user_id' } as const).__schema.dbColumn` type-checks and survives, while the same object written as `{ ... } as const satisfies Schema` would be rejected for the unknown key. `meta` exists precisely so you don't have to reach for this in the common case.
