# Migrating to v2.0.0

v2.0.0 ships four breaking changes and several bug fixes that can change
observed behavior even though they aren't type-breaking. This guide covers
both, in the order you're likely to hit them.

Full details and PR links are in the [CHANGELOG](./CHANGELOG.md#200).

## Breaking changes

### 1. `record()`'s `key` is now a chain method, not a positional argument

```diff
- record(number(), userId)
+ record(number()).key(userId)
```

This only affects the `record()` struct builder. The raw schema-object form
(`{ type: 'record', of, key }`) is unchanged — `key` was already a named
field there.

**Why the break wasn't made silent-compatible**: a positional
`record(value, key)` matches the `Record<K, V>` / zod convention, so a
natural next step would have been swapping the argument order to match. With
two same-shaped positional arguments, that swap would have compiled fine at
every existing call site while silently validating the wrong thing — keys
passing where values were expected. The chain method removes that class of
bug entirely: there's no positional slot left to swap.

Search your codebase for `record(` calls with a second argument and convert
them to `.key(...)`.

### 2. `record()`'s `key` schema is now enforced at parse time

Previously `key` only affected the inferred TypeScript type (e.g. branded
keys); every runtime key was accepted regardless of constraints like
`minLength`/`maxLength`/`brand`. Now a key that fails its `key` schema is
rejected: the entry is excluded from the parsed result and from
`minLength`/`maxLength` counting, and produces an error.

If you have a `record()` with a `key` schema and were relying on invalid
keys silently passing through, that data will now be dropped (with a
corresponding parse error) instead. Check any `record()` schemas that
declare `key` for subjects that wouldn't actually satisfy it.

### 3. `InvalidSubject` no longer has a `subject` field

`ParseError['error']` entries used to echo the raw parsed input value back
in `subject`. That could leak sensitive data (e.g. secrets from
`process.env`) whenever errors are logged or serialized. `code`, `path`,
and `schema` remain — only `subject` was removed.

```diff
  if (!result.success) {
-   console.log(result.error[0].subject)
    console.log(result.error[0].path, result.error[0].code)
  }
```

If you were using `subject` for debugging or error messages, use `path`
(the location in the original input) together with your own reference to
the input value instead.

### 4. `union()` reports `INVALID_UNION` instead of `INVALID_TYPE` on no match

A subject that satisfies none of a union's member schemas now gets
`code: 'INVALID_UNION'`. It's still exactly one error entry, and `schema`
is still the union schema itself (not any one branch).

```diff
  if (!result.success) {
-   if (result.error[0].code === 'INVALID_TYPE') { ... }
+   if (result.error[0].code === 'INVALID_UNION') { ... }
  }
```

Search for `INVALID_TYPE` checks that run against `union()` results and
update them to `INVALID_UNION`.

### 5. `tuple()` rejects extra elements instead of truncating them

```typescript
const struct = tuple([string(), number()])

struct.parse(['a', 1, 'extra']) // previously: succeeded, extra truncated
                                 // now: fails
```

Unlike `object()`'s documented "extra keys ignored" (a deliberate
forward-compatibility choice), a tuple's whole point is a fixed shape, and
the extra elements were never validated at all. A trailing element whose
own schema is `optional` can still be omitted — this only rejects *more*
elements than declared, not fewer.

If any code intentionally passed over-long arrays/tuples expecting silent
truncation, it will now get a `ParseError` instead.

## Bug fixes that can change observed behavior

These aren't SemVer-breaking (no type signatures changed), but they fix
bugs that some code may have come to depend on:

- **`parse()` never throws now, even for a malformed schema.** Previously a
  schema that wasn't a plain object, had an unrecognized `type` (at any
  nesting depth), a `bigint` `min`/`max` that wasn't a valid bigint string,
  or a `tuple`/`union` `of` that wasn't an array, could throw instead of
  returning a `ParseError`. All of these now return
  `code: 'INVALID_SCHEMA'`. If you had a `try`/`catch` around `parse()` to
  handle this, it will no longer trigger — check `result.success` instead.
- **`min`/`max`/`minLength`/`maxLength` of the wrong type is now a schema
  error.** A constraint present but not the expected type (e.g.
  `{ type: 'number', min: '5' }`, a string instead of a number) used to be
  silently ignored. It's now reported as `code: 'INVALID_SCHEMA'`. A
  constraint that's simply absent is still not an error.
- **`array()`/`record()` no longer drop child errors on a
  `minLength`/`maxLength` violation.** Previously, a range violation
  replaced any already-collected element/entry errors; now both are
  reported together. If code asserted on `result.error.length` for these
  schemas, that count may now be higher when both a range and a child
  error are present.
- **`__proto__`-keyed data no longer corrupts the parsed result's
  prototype.** `object()`/`record()` now use `Object.defineProperty`
  internally, so a `__proto__` key in the subject (or a schema field
  literally named `__proto__`) is stored and readable as ordinary data
  instead of altering the parsed object's prototype chain.
- **`object()`/`record()` accept a wider range of valid plain objects.**
  The type check now uses
  `Object.prototype.toString.call(subject) === '[object Object]'` instead
  of a strict `instanceof Object` check, so `process.env`,
  `Object.create(null)`, and cross-realm objects are now accepted.
  `Map`/`Set`/`Error`/typed arrays and other built-ins are still rejected.
  This only widens what's accepted — no valid input from before is now
  rejected.

## Suggested upgrade steps

1. `grep -rn "record(" --include="*.ts"` and convert any two-argument
   `record(value, key)` calls to `record(value).key(key)`.
2. `grep -rn "\.subject" --include="*.ts"` (scoped to your `ParseError`
   handling) and remove reliance on the removed field.
3. `grep -rn "INVALID_TYPE" --include="*.ts"` and check whether any of
   those checks run against a `union()` result — if so, add/switch to
   `INVALID_UNION`.
4. Re-run your test suite. The bug fixes above are the ones most likely to
   surface as test failures rather than compile errors, since none of them
   change a type signature.
