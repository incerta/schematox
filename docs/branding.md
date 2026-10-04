# Branding

Every primitive except `unknown` accepts a `brand` — a `[category, subCategory]` tuple that makes the inferred type nominal:

```typescript
import { string } from 'schematox'
import type { Infer, Schema } from 'schematox'

const userId = {
  type: 'string',
  brand: ['idFor', 'User'],
} as const satisfies Schema
const sameUserId = string().brand('idFor', 'User')

type UserId = Infer<typeof userId>
// ^? string & { __idFor: 'User' }
```

A plain `string` is no longer assignable to `UserId`, so an order ID can't be passed where a user ID is expected. The brand exists only in the type — the parsed value is the same plain string at runtime.

`unknown` has no `brand` param: `T & unknown` collapses to plain `T` in TypeScript, so branding it would silently narrow the inferred type away from `unknown` instead of tagging it.

## Why brands are `{ __category: subCategory }` instead of a `unique symbol`

Some validation libraries (e.g. zod) brand values with a single fixed `unique symbol` key. schematox instead derives a plain, per-category string key from the brand tuple: `['idFor', 'User']` becomes `{ __idFor: 'User' }`.

- **Readable diagnostics**: hovering a branded type or reading a type error shows `string & { __idFor: 'User' }` instead of an opaque `{ [Symbol(brand)]: 'User' }`.
- **No `unique symbol` declaration-emit friction**: `unique symbol` types have known rough edges when preserved across published `.d.ts` files and package boundaries; a string-keyed intersection avoids that class of issue entirely.
- **Phantom either way**: like zod's symbol brand, this key is never actually written to the value at runtime — `.brand()` only records `[category, subCategory]` on the schema, purely for type inference. Neither approach changes what a branded value looks like at runtime.
- **Per-category keys leave room to compose brands**: because the key is derived from `category` rather than fixed, two different categories produce two different phantom keys, which is what would let multiple brands be intersected onto the same value without one overwriting the other (schemas currently only carry a single `brand` field, so this isn't exposed yet).
- **The `__` prefix is the workaround, not a caveat**: `category` is a free-form string, and primitive types already carry real structural members (`string`'s `length`, `toString`, etc.). Branding with a bare `category` key (no prefix) would risk colliding with one of those — e.g. `{ length: 'x' }` intersected with real `string.length: number` collapses the whole type to `never`. Prefixing with `__` sidesteps this: `.brand('length', 'x')` produces `{ __length: 'x' }`, which doesn't collide with anything, so `length` (and any other real member name) is a perfectly safe category to use.

The one name still worth avoiding is a `category` that itself starts with `proto__`, since `__${category}` would then literally read `__proto__`. Harmless in practice — brands are never assigned at runtime, so there's no live object carrying that key — but avoidable all the same.
