# Error shape

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

The `result.error` shape is:

```json
[
  {
    "code": "INVALID_TYPE",
    "path": ["x", "y", 0, "z"],
    "schema": { "type": "string" }
  }
]
```

It's always an array of `InvalidSubject` entries, each has the following properties:

- `code`:
  - `INVALID_TYPE`: schema subject or default value don't meet schema type specifications
  - `INVALID_RANGE`: `min/max` or `minLength/maxLength` schema requirements aren't met
  - `INVALID_UNION`: subject didn't satisfy any of `union`'s member schemas. `schema` is the union schema itself, not any one member — the subject isn't required to conform to a specific branch, so blaming one wouldn't be accurate.
  - `INVALID_SCHEMA`: the schema itself is malformed — not a plain object, an unrecognized `type`, a `tuple`/`union` `of` that isn't an array, or any `min`/`max`/`minLength`/`maxLength` that's present but the wrong type (e.g. a `number` schema's `min` isn't a `number`, a `bigint` schema's `min`/`max` isn't a valid bigint string). Since schemas can be plain data from an untyped external source (JSON, a database), TypeScript's `satisfies Schema` never actually ran on them; `parse()` still never throws, it reports this instead. A constraint that's simply absent is not an error — only present-but-wrong-type is.
- `schema`: the specific section of `schema` where the invalid value is found.
- `path`: traces the route from the root to the error subject, with strings as keys and numbers as array indexes.

Note: the parsed input itself is intentionally **not** included in the error — only the schema fragment and path. This prevents sensitive data (e.g. secrets from `process.env`) from ending up in logs when errors are serialized (`JSON.stringify(result.error)`).

## When can `result.error` have more than one entry?

Only `object`, `record`, `array`, and `tuple` can produce more than one `InvalidSubject`. Each independently validates multiple children (object keys, record entries, array/tuple elements) and collects every failure into a single flat array — including a `minLength`/`maxLength` violation, which is reported _alongside_ any child errors rather than replacing them. For example, an array that's both too short and has an invalid element reports both problems, not just one.

Every other type — `bigint`, `boolean`, `literal`, `number`, `string`, `union` — performs a single check with no aggregation, so parsing one directly can only ever produce exactly one entry (or none, on success). When one of these is nested inside a compound schema, its single error just becomes one of potentially several entries contributed by the surrounding `object`/`record`/`array`/`tuple`. `unknown` never performs a check at all — it accepts any subject, so it can never contribute an entry.
