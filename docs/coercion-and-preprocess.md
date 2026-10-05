# Coercion and preprocessors

## Coercion

Coercion is a parse-time option, not a schema property. It's opt-in per call, on both the free `parse()` function and a struct's `.parse()`:

```typescript
import { parse, number } from 'schematox'

const schema = { type: 'number' } as const satisfies Schema

parse(schema, '42') // error — "42" is not a number
parse(schema, '42', { coerce: true }) // { success: true, data: 42 }

number().parse('42', { coerce: true }) // { success: true, data: 42 }
```

The same `schema`/`struct` parses raw strings from a URL query, a form submission, or an env var one way, and an already-typed JSON body another — without needing two schemas or a `.coerce()`-flavored variant of every primitive to keep around. This is also why coercion isn't a schema field: a schema that always coerced would silently accept `"42"` even where a caller specifically wanted to reject it (e.g. an internal API that only trusts a JSON body). Whether coercion applies is a property of a specific `parse()` call, so it can differ per call site even when the schema itself is shared.

Because coercion only changes which raw inputs are _accepted_, never what a successful parse _returns_, it has no effect on `Infer`/`InferSchema` — a coerced `number` schema still infers as `number`, the same as without coercion.

Only `bigint`, `boolean`, `number`, and `string` are coercible, and only from one of the other three — the conversion is always unambiguous, never a parse of arbitrary text:

| target    | accepted input             | conversion                                                                                                                                                                                                                              |
| --------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `number`  | non-empty numeric `string` | `Number(x)`, rejected if `NaN` or outside `Number.isSafeInteger` range (for an integer value — `Number` can't represent every integer a `string`/`bigint` can, so a result outside that range is rejected rather than silently rounded) |
|           | `boolean`                  | `true → 1`, `false → 0`                                                                                                                                                                                                                 |
|           | `bigint`                   | `Number(x)`, rejected outside `Number.isSafeInteger` range, same reasoning                                                                                                                                                              |
| `bigint`  | integer `string`/`number`  | `BigInt(x)`, rejected if it throws (e.g. `"4.2"`, `4.2`)                                                                                                                                                                                |
|           | `boolean`                  | `true → 1n`, `false → 0n`                                                                                                                                                                                                               |
| `string`  | `number`/`boolean`         | `String(x)`                                                                                                                                                                                                                             |
|           | `bigint`                   | `x.toString()`                                                                                                                                                                                                                          |
| `boolean` | `string`                   | only the exact strings `"true"`/`"false"` — not `"TRUE"`, `"1"`, `"yes"`                                                                                                                                                                |
|           | `number`/`bigint`          | only `1`/`0` or `1n`/`0n`                                                                                                                                                                                                               |

A conversion that doesn't apply (wrong source type) or fails (e.g. `"abc"` for `number`, `"4.2"` for `bigint`) is left as-is and falls through to the same `INVALID_TYPE` error parsing would produce without coercion — coercion never throws and never introduces a new error code. `min`/`max`/`minLength`/`maxLength` are checked against the coerced value, so `parse({ type: 'number', min: 10 }, '5', { coerce: true })` fails with `INVALID_RANGE`, not `INVALID_TYPE`.

`literal` and `unknown` are never coerced — a `literal`'s target type depends on the runtime type of `of` rather than `schema.type` alone, and `unknown` already accepts anything. Compound schemas (`array`/`object`/`record`/`tuple`/`union`) aren't coerced themselves (there's no single scalar to convert a subject into an array from), but `{ coerce: true }` still reaches every coercible descendant: `parse(array(number()), ['1', '2'], { coerce: true })` succeeds with `[1, 2]`.

`optional`/`nullable` are checked before coercion runs, so `undefined`/`null` pass straight through rather than being coerced into e.g. `0`/`false`.

Coercion is a `parse()`-call option, not a schema property (see above), and there's no struct-construction-time way to request it either — so there's nothing for a struct's `['~standard'].validate` to turn on by default. Its input is whatever the calling library passes, unchanged; use `parse()`/`struct.parse()` directly when you need coercion.

If a struct only ever reaches your code through `~standard.validate` (e.g. a form library's Standard-Schema-only resolver) and it still needs `"42"` → `42`-style conversion, `.preprocess()` below is the way to get it: unlike `{ coerce: true }`, a preprocessor is attached to the struct itself at construction time, so it runs on every `~standard.validate` call too, no per-call option needed. The four functions behind the built-in table above are themselves exported — `coerceBigInt`/`coerceBoolean`/`coerceNumber`/`coerceString` — so the same conversion `{ coerce: true }` would have applied can be attached directly: `number().preprocess(coerceNumber)` reaches `"42" → 42` through `~standard.validate` with the exact built-in behavior, no hand-written conversion needed.

## Custom preprocessors

The built-in table only covers `bigint`/`boolean`/`number`/`string`. `.preprocess()` attaches a custom pre-validation function to any struct — like every other struct param, it's a chain method, not a schema field: `T & unknown` schemas stay JSON-serializable data, and the preprocessor itself is tracked separately, never written into `__schema`. Named to match [Zod's `z.preprocess()`](https://zod.dev/api), which does the same thing: run before validation, not after (unlike `.transform()`, which runs on the already-validated value and can change its type — this doesn't).

```typescript
import { object, string } from 'schematox'

const trimmed = string().preprocess((s) =>
  typeof s === 'string' ? s.trim() : s
)

const struct = object({ name: trimmed })

struct.parse({ name: '  Ann  ' })
// { success: true, data: { name: 'Ann' } }
```

`.preprocess()` is struct-only. A function can't be represented in JSON, so the preprocessor is kept outside the schema object. It is not part of `struct.__schema`, and it is dropped when you serialize the schema or rebuild a struct with `makeStruct(schema)`. If you work with static schemas (literals, schemas loaded from a database, or generated ones), don't use `.preprocess()`. Pass `{ coerce: true }` or transform the input before calling `parse()` instead.

A preprocessor is a plain `(subject: unknown) => unknown` function, following the same contract as the built-in table: given a subject it doesn't recognize, return it unchanged rather than throwing, and let the ordinary validation report `INVALID_TYPE`. Unlike `.brand()`/`.min()`/etc., `.preprocess()` isn't a one-time application — it isn't a schema field, so there's nothing for it to "use up"; calling it again just replaces the earlier function.

**`.preprocess()` and `{ coerce: true }` are two independent switches.** `{ coerce: true }` gates the built-in bigint/boolean/number/string table — a blanket, call-site opt-in, since it isn't tied to any one field. A struct's own `.preprocess()` is the opposite: an explicit, per-field declaration, active on every `.parse()` call the moment it's attached, exactly like `.brand()` or `.min()` — no separate flag needed to "turn it on", and `{ coerce: true }` has no bearing on whether it runs. When both apply to the same position, the custom one runs first and the built-in one still runs afterward on its result _if_ `{ coerce: true }` was also passed — e.g. a custom preprocessor can strip a `"$"` prefix unconditionally, and the built-in string→number conversion turns what's left into a number only when coercion was explicitly requested for that call:

```typescript
const price = number().preprocess((s) =>
  typeof s === 'string' && s.startsWith('$') ? s.slice(1) : s
)

price.parse('$42')
// error — the preprocessor strips "$", leaving the string "42", but
// nothing converts it to a number without { coerce: true }

price.parse('$42', { coerce: true })
// { success: true, data: 42 }
```

`.preprocess()` composes through `array()`/`object()`/`record()`/`tuple()`/`union()` — attach it at any depth before composing, and it's tracked by position so it only fires where it was declared:

```typescript
import { array, number } from 'schematox'

const dollars = number().preprocess((s) =>
  typeof s === 'string' && s.startsWith('$') ? s.slice(1) : s
)

array(dollars).parse(['$10', '$20'], { coerce: true })
// { success: true, data: [10, 20] }
```

The one exception is a union with a [`discriminant`](./schema-types.md#discriminant): a tagged member, or its tag property, can't have a preprocessor. Preprocess the union itself instead.

A preprocessor attached to a compound struct itself (its own subject, before that struct's own validation runs) and one attached to its child (e.g. every array element) are different positions and don't collide — `array(dollars).preprocess((s) => typeof s === 'string' ? s.split(',') : s)` splits a whole comma-separated string into an array first, and the item-level `dollars` preprocessor still runs on each resulting element afterward. It doesn't mutate the struct it's called on — the original still parses without the attached preprocessor.

`.preprocess()` is only available through a struct — there's no equivalent for a static schema used on its own, since a preprocessor's position is only meaningful relative to a specific struct's composition. `record()`'s `key` schema doesn't support a custom preprocessor either — record keys are always plain strings already, and only the built-in string table applies to them.
