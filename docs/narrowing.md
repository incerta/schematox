# Narrowing the schema type

Every schema shape (`ObjectSchema<T>`, `ArraySchema<T>`, `UnionSchema<T>`, `LiteralSchema<T>`, ...) is an exported generic type, not an opaque type produced only by a builder call. That means you can compose your own restricted subset of `Schema` using nothing but ordinary TypeScript generics, and get a real compile-time contract for "only schemas shaped like _this_ are allowed here" — not just a convention enforced by review.

For example, a DB-repository layer might want to allow only flat objects — no nested `object`/`record`/`tuple`, no `bigint` — while still allowing simple unions and arrays of primitives:

```typescript
import type {
  Infer,
  PrimitiveSchema,
  ObjectSchema,
  UnionSchema,
  StringSchema,
  NumberSchema,
  LiteralSchema,
  ArraySchema,
} from 'schematox'

export type BaseRepoModelSchema = ObjectSchema<
  Record<
    string,
    | Exclude<PrimitiveSchema, { type: 'bigint' }>
    | UnionSchema<Array<LiteralSchema<string> | StringSchema>>
    | ArraySchema<
        | StringSchema
        | NumberSchema
        | UnionSchema<
            Array<StringSchema | LiteralSchema<string> | LiteralSchema<number>>
          >
      >
  >
>
```

Any schema declared `as const satisfies BaseRepoModelSchema` is simultaneously a valid `Schema` — so `parse`/`Infer` work exactly as usual — and statically guaranteed to respect the narrower shape:

```typescript
import { parse } from 'schematox'

const userModel = {
  type: 'object',
  of: {
    id: { type: 'string', brand: ['idFor', 'User'] },
    status: {
      type: 'union',
      of: [
        { type: 'literal', of: 'active' },
        { type: 'literal', of: 'banned' },
      ],
    },
    tags: { type: 'array', of: { type: 'string' } },
  },
} as const satisfies BaseRepoModelSchema

type UserModel = Infer<typeof userModel>
// ^? { id: string & { __idFor: 'User' }, status: 'active' | 'banned', tags: string[] }

parse(userModel, { id: '1', status: 'active', tags: ['x'] })
// ^? ParseResult<UserModel>

const brokenModel = {
  type: 'object',
  of: {
    profile: { type: 'object', of: { bio: { type: 'string' } } },
  },
  // @ts-expect-error nested `object` is not one of BaseRepoModelSchema's allowed field types
} satisfies BaseRepoModelSchema
```

Nothing here is special-cased by schematox — `ObjectSchema`, `ArraySchema`, `UnionSchema`, and friends are just regular generics over the same `Schema` union `Infer` reads, so any subset of the schema language you can describe with `Exclude`, unions, and nested generics becomes a type the compiler, `parse`, and `Infer` all agree on. This isn't available in schema-as-data libraries built on JSON Schema: TypeBox's `TSchema` subtypes carry the phantom `static`/`params` fields described in [Schema as data](./schema-as-data.md), so hand-composing a restricted schema type — rather than composing `Type.*` calls — breaks the machinery that produces `Static<T>`. Plain JSON Schema/ajv have no schema _type_ to narrow in the first place.

The narrowing composes like any other TypeScript type, so it isn't limited to a single flat object. A union of `BaseRepoModelSchema`s is itself still a fully narrowed schema:

```typescript
import type { UnionSchema } from 'schematox'

export type UnionRepoModelSchema = UnionSchema<Array<BaseRepoModelSchema>>
export type RepoModelSchema = BaseRepoModelSchema | UnionRepoModelSchema
```

And the same trick works one level up: you can write your own minimal contract for "a struct built from one of these schemas," without reaching for schematox's own `Struct<T>` type at all — a plain object type naming just the two members a consumer actually needs:

```typescript
import { object, string, number, array } from 'schematox'
import type { ParseResult } from 'schematox'

export type RepoStruct = {
  __schema: RepoModelSchema
  parse: (x: unknown) => ParseResult<unknown>
}

function saveModel(model: RepoStruct, data: unknown) {
  return model.parse(data)
}

const userModel = object({ id: string(), tags: array(string()) })
saveModel(userModel, { id: '1', tags: ['a'] }) // OK — flat schema satisfies RepoModelSchema

const brokenModel = object({ profile: object({ bio: string() }) })
saveModel(brokenModel, {}) // ❌ Type error — nested object schema doesn't satisfy RepoModelSchema
```

Any struct or construct built from a schema that satisfies `RepoModelSchema` also satisfies `RepoStruct` — `__schema` lines up structurally, and the extra `options?: ParseOptions` parameter on the real `parse` is compatible with the narrower signature declared here. `saveModel` can only ever be called with repo-shaped models; anything else — a struct with a nested `object` field, or a union with even one non-conforming member — is rejected before it reaches a database, by the compiler alone.
