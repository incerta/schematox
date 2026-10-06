# Benchmarks

This directory compares schematox against [zod](https://www.npmjs.com/package/zod), [valibot](https://www.npmjs.com/package/valibot), [superstruct](https://www.npmjs.com/package/superstruct), [ajv](https://www.npmjs.com/package/ajv), and [yup](https://www.npmjs.com/package/yup), using [tinybench](https://www.npmjs.com/package/tinybench). It measures three separate things — **building** a schema once, **parsing** with an already-built schema, and **building + parsing once** (a schema used for a single call) — across four shapes (a bare primitive, a flat 3-field object, a 2-level nested object with an array field, and an array of 10 objects), each with both a valid and an invalid subject.

Run it yourself:

```sh
cd benchmark
npm install
npm run bench           # schematox vs. other libraries
npm run bench:features  # cost of { coerce: true }, .preprocess(), ~standard.validate
npm run bench:union     # discriminated unions; JITLESS=1 runs zod without new Function
npm run bench:self      # working tree vs. a git ref (BASELINE_REF, default main)
```

Numbers below were captured on 2026-10-06 with Node v23.7.0, Apple M1, against zod 4.6.5, valibot 1.5.0, superstruct 2.0.2, ajv 8.20.0, and yup 1.7.1. Absolute numbers will differ on your machine — what should hold up is the relative ordering and the reasoning behind it.

## Schema construction (ops/sec, higher is better)

| library     | primitive | flat object | nested object | array of 10 |
| ----------- | --------- | ----------- | ------------- | ----------- |
| valibot     | 16.5M     | 15.2M       | 8.95M         | 12.7M       |
| superstruct | 6.73M     | 8.05M       | 4.02M         | 6.46M       |
| schematox   | 1.04M     | 503K        | 253K          | 402K        |
| zod         | 324K      | 337K        | 160K          | 287K        |
| yup         | 667K      | 159K        | 83.1K         | 147K        |
| ajv         | 404       | 396         | 377           | 390         |

## Parsing a valid subject (ops/sec, higher is better)

| library     | primitive | flat object | nested object | array of 10 |
| ----------- | --------- | ----------- | ------------- | ----------- |
| schematox   | 23.8M     | 5.78M       | 3.11M         | 730K        |
| ajv         | 21.4M     | 20.8M       | 19.8M         | 10.6M       |
| zod         | 19.9M     | 11.9M       | 7.64M         | 2.61M       |
| valibot     | 19.3M     | 6.27M       | 2.94M         | 669K        |
| yup         | 2.85M     | 134K        | 29.7K         | 7.89K       |
| superstruct | 774K      | 796K        | 299K          | 75.1K       |

## Parsing an invalid subject — wrong type (ops/sec, higher is better)

| library     | primitive | flat object | nested object | array of 10 (last item) |
| ----------- | --------- | ----------- | ------------- | ----------------------- |
| ajv         | 23.5M     | 20.1M       | 19.9M         | 8.91M                   |
| schematox   | 19.9M     | 6.37M       | 3.12M         | 750K                    |
| valibot     | 11.2M     | 4.72M       | 2.16M         | 612K                    |
| zod         | 4.89M     | 4.16M       | 3.01M         | 1.58M                   |
| superstruct | 161K      | 169K        | 163K          | 54.7K                   |
| yup         | 60.5K     | 41.1K       | 29.6K         | 6.87K                   |

(A missing-required-field variant is also benchmarked for the object shapes, and a too-short variant for the primitive; they track the wrong-type numbers closely and aren't shown separately.)

## Building and parsing once (ops/sec, higher is better)

A fresh schema per call, discarded afterwards — schemas created per request, or any other short-lived use. schematox pays here for compiling a parse plan on the first parse of each schema object (see below); hoist schemas that are parsed more than once.

| library     | flat object | array of 10 |
| ----------- | ----------- | ----------- |
| valibot     | 4.40M       | 639K        |
| schematox   | 312K        | 191K        |
| superstruct | 306K        | 59.4K       |
| yup         | 63.7K       | 7.25K       |
| zod         | 43.8K       | 40.9K       |
| ajv         | 403         | 409         |

## Why the ranking flips depending on what's being measured

**ajv compiles; zod 4 compiles objects lazily with code generation; schematox compiles to closures; everyone else interprets.** `ajv.compile(schema)` turns a JSON Schema into a specialized validator function generated with `new Function` — at parse time there's no schema to walk, just a tight generated function doing exactly the checks that specific schema needs. That's why ajv wins almost every parsing benchmark, and also why it's thousands of times _slower_ than everything else at construction. zod 4 does the same for objects, but lazily: `z.object()` is cheap to build, and the first `safeParse()` generates a specialized parser with `new Function` that every later call reuses. That's where its 2-3.5x lead over schematox and valibot on valid compound subjects comes from — and why it's the slowest non-ajv library in the build-and-parse-once table, where that first call is the only call. In environments that forbid `eval` (a strict CSP), or with `z.config({ jitless: true })`, zod falls back to interpreting: a flat object then parsed at ~5.9M ops/sec in a separate run, close to schematox and valibot. schematox compiles too, but without `new Function`: the first parse of a schema object builds a tree of specialized closures (a "parse plan") — schema validation, constraint lookups and type dispatch happen once, and absent constraints cost nothing. The plan is cached in a `WeakMap` keyed by the schema object, so the schema itself is never written to and stays plain data, and the plan is garbage-collected along with it. That also means a schema must not be mutated after its first parse. valibot, superstruct and yup walk a schema tree (or a chain of validator objects) on every call — cheap to build, but they redo interpretation work every time. **The practical takeaway: a compiling library only wins if a schema is built once and reused for many parses.** Construction usually happens once at app startup in real usage, which is why the parsing tables matter more for most applications, but it's worth knowing which regime you're in.

**On a bare primitive, schematox is fastest at accepting valid input — including ajv — and second only to ajv at rejecting invalid input.** A `bigint`/`boolean`/`literal`/`number`/`string` check is one `typeof` plus a comparison or two, no allocation, no loop. There's no schema-tree depth for an interpreter's overhead to hide in, so schematox's minimal per-call work wins outright. zod's invalid-primitive path is notably slower than its valid one because it builds a richer issue object.

**On objects, records, arrays, and tuples ("compound schemas"), the cost is dominated by per-element work**, not the top-level check. Without code generation, schematox and valibot 1.5 are now neck and neck on valid compound subjects (valibot ~8% ahead on the flat object, schematox ~6-9% ahead on the nested object and array of 10), and schematox leads by 1.2-1.4x on invalid ones; both remain well ahead of superstruct and yup. zod 4 and ajv stay 2-3.5x and 3.5-15x ahead respectively through `new Function`.

**Array-of-objects looks worse than flat-object for every library, including ajv — that's volume, not an array-specific weakness.** The array benchmark validates 10 nested objects (30 field checks total) per call; the flat-object benchmark validates 3. Ops/sec drops roughly in proportion to the work per call for every library in the table.

**superstruct and valibot build fastest; yup is slow on both sides.** valibot 1.5 and superstruct build schemas an order of magnitude faster than schematox, which is also why valibot leads the build-and-parse-once table. yup is the only library here without a non-throwing validate API (its adapter wraps `validateSync()` in try/catch — see [`adapters.ts`](./adapters.ts)), and its schema resolution is the heaviest of the group regardless of outcome.

## Cost of opt-in parse features (`npm run bench:features`)

A flat 3-field object, relative to a plain `struct.parse()` on the same shape:

| case                                      | ops/sec | vs `struct.parse()` |
| ----------------------------------------- | ------- | ------------------- |
| `struct.parse()`                          | 8.48M   | 1.00x               |
| `parse(schema)`                           | 8.20M   | 0.97x               |
| `struct['~standard'].validate()`          | 8.47M   | 1.00x               |
| `{ coerce: true }`, already-typed input   | 6.76M   | 0.80x               |
| `{ coerce: true }`, string input          | 5.79M   | 0.68x               |
| `.preprocess()` on one field              | 6.89M   | 0.81x               |
| zod: plain `safeParse()`                  | 23.9M   | 2.82x               |
| zod: `z.coerce`/`z.stringbool()`, strings | 16.7M   | 1.97x               |
| zod: `z.preprocess()` on one field        | 13.9M   | 1.64x               |

Coercion and preprocessing are resolved when the parse plan is built: a node without `{ coerce: true }`, a coercible type, or a `.preprocess()` at its position carries no wrapper for them at all. Every row is faster in absolute terms than before plan compilation (`struct.parse()` was 5.11M, `{ coerce: true }` 4.59M, `.preprocess()` 4.29M); the ratios grew only because the plain parse sped up more. `parse(schema)` looks its plan up in the `WeakMap` on every call, while a struct holds its plan directly, hence the ~3% gap. A struct with a `.preprocess()` keeps its own plan for the preprocessed path and reuses the shared cached plans everywhere else.

## Discriminated unions (`npm run bench:union`)

A union of 10 object variants `{ type: 'v0' | … | 'v9', a: string, b: number, c: boolean }`, measured with each library's plain union and, where there is one, its discriminated-union API: zod `discriminatedUnion()`, valibot `variant()`, ajv `discriminator`, yup `lazy()` keyed by the tag. superstruct has no discriminated API. Captured on 2026-10-06, same machine and versions as above.

### Parsing (ops/sec, higher is better)

| library                             | first variant | middle | last  | wrong field in last | unknown tag |
| ----------------------------------- | ------------- | ------ | ----- | ------------------- | ----------- |
| ajv discriminator                   | 27.0M         | 24.2M  | 25.0M | 22.9M               | 23.1M       |
| zod `discriminatedUnion()`          | 17.2M         | 12.4M  | 12.3M | 4.03M               | 3.22M       |
| zod `discriminatedUnion()`, jitless | 3.46M         | 3.47M  | 3.38M | 1.95M               | 3.17M       |
| schematox `.discriminant()`         | 5.32M         | 4.99M  | 4.88M | 3.64M               | 13.2M       |
| valibot `variant()`                 | 4.36M         | 1.82M  | 1.09M | 995K                | 776K        |
| schematox `union()`                 | 5.42M         | 1.08M  | 544K  | 504K                | 540K        |
| superstruct `union()`               | 600K          | 116K   | 57.0K | 40.1K               | 43.4K       |
| yup `lazy()`                        | 171K          | 169K   | 167K  | 46.7K               | 48.6K       |

### Last variant as the union grows (ops/sec)

`{ type: literal, a: number }` variants:

| library                             | 10    | 100   | 1000  |
| ----------------------------------- | ----- | ----- | ----- |
| zod `discriminatedUnion()`          | 17.0M | 11.6M | 11.8M |
| zod `discriminatedUnion()`, jitless | 5.80M | 4.95M | 5.22M |
| schematox `.discriminant()`         | 6.99M | 6.76M | 6.75M |
| valibot `variant()`                 | 1.26M | 139K  | 14.5K |

### Building the 10-variant union (ops/sec)

| library                     | build only | build + parse once |
| --------------------------- | ---------- | ------------------ |
| valibot `variant()`         | 994K       | 508K               |
| schematox `.discriminant()` | 37.1K      | 25.5K              |
| zod `discriminatedUnion()`  | 24.9K      | 13.3K              |

### Where schematox is strong

- **Position doesn't matter.** Members are looked up through a tag → members index built once per schema. The first, middle and last variant all parse at ~4.9-5.3M, and 1000 variants parse at about the speed of 10. valibot `variant()` scans its members, so it drops ~90x from 10 to 1000 variants.
- **Rejecting an unknown tag is nearly free.** It's one `Map` lookup and an `INVALID_UNION`, with no member parsing and no error building: 13.2M, second only to ajv and ~4x zod.
- **Failures inside the matched variant stay cheap.** schematox reports the matched member's own errors (e.g. `INVALID_TYPE` at `['b']`) at almost the cost of a valid parse. zod drops from 12.3M to 4.03M on the same case because it builds richer issue objects.
- **Without code generation, it matches zod.** Under a CSP that forbids `eval`, or with `z.config({ jitless: true })`, schematox is ~1.4-1.5x faster than zod's discriminated union on valid subjects, ~1.9x on a wrong field, ~4x on an unknown tag, and 1.2-1.4x as the union grows. ajv and default zod get their lead from `new Function`, which isn't always allowed.
- **Its selection rules are more flexible.**
  - Soft fallback: members without the key, e.g. a `string()` beside the tagged objects, are still tried. zod and valibot require every member of a discriminated union to be an object carrying the key.
  - A priority list of keys (`.discriminant(['kind', 'type'])`) instead of a single key.
  - It works in plain-data, JSON-serializable schemas (`{ type: 'union', of, discriminant: 'type' }`).

### Where schematox is weak

- **On valid subjects, raw throughput trails `new Function` validators.** ajv is ~5x faster and default zod ~2.5-3.2x. Selection is not the bottleneck: once the member is found, schematox runs a closure-compiled parse plan, while zod and ajv run a generated function. This is the same gap as in the plain object tables above.
- **Construction is slow, and the cost is in the members.** 10 object members take ~25µs to build, and the `.discriminant()` call itself adds ~2µs to build the index; the first parse then compiles the parse plan (~12µs more). That's ~20x valibot for build + parse once, so schemas created per request should be hoisted. The index and plan are cached per schema object, and each chained call after `.discriminant()` (e.g. `.optional()`) creates a new schema and rebuilds them.
- **There are stricter rules on preprocessors.** A tagged member, or its tag property, can't have `.preprocess()`, and `makeStruct` throws. The index matches raw tag values, so a preprocessor that rewrote the tag would select the wrong member. The preprocessor has to go on the union instead.
- **Diagnostics are minimal.** An unknown tag, or several members sharing a matched tag, gives a bare `INVALID_UNION` without the expected tag values. Duplicate tags across members aren't flagged when the schema is built; they are simply tried in order.
- **Mutation goes unseen.** Mutating a schema object after its first parse isn't seen by the cached index or parse plan. Schemas are meant to be immutable.

## Regression check (`npm run bench:self`)

`bench:self` extracts `src/` from a git ref (`BASELINE_REF`, default `main`) and benchmarks it head-to-head against the working tree on the four shapes above. Measured noise (a ref against itself) is under 1%. Parse-plan compilation against the interpreter it replaced (`77d5efb`):

| case                      | interpreter | parse plan | delta  |
| ------------------------- | ----------- | ---------- | ------ |
| primitive: valid          | 32.8M       | 32.8M      | +0.1%  |
| primitive: wrong type     | 23.2M       | 23.2M      | +0.1%  |
| flat object: valid        | 4.81M       | 7.53M      | +56.6% |
| flat object: wrong type   | 4.50M       | 7.44M      | +65.5% |
| nested object: valid      | 2.07M       | 3.56M      | +72.5% |
| nested object: wrong type | 2.04M       | 3.62M      | +77.1% |
| array of 10: valid        | 520K        | 799K       | +53.7% |
| array of 10: wrong type   | 516K        | 815K       | +58.0% |

`bench:self` runs only schematox, so its absolute numbers are higher than in the shared-process cross-library tables above.
