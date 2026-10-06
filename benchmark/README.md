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

Numbers below were captured on 2026-10-04 with Node v23.7.0, Apple M1, against zod 4.6.5, valibot 1.5.0, superstruct 2.0.2, ajv 8.20.0, and yup 1.7.1. Absolute numbers will differ on your machine — what should hold up is the relative ordering and the reasoning behind it.

## Schema construction (ops/sec, higher is better)

| library     | primitive | flat object | nested object | array of 10 |
| ----------- | --------- | ----------- | ------------- | ----------- |
| valibot     | 16.6M     | 15.3M       | 9.05M         | 12.6M       |
| superstruct | 6.82M     | 8.12M       | 4.11M         | 6.85M       |
| schematox   | 1.08M     | 535K        | 266K          | 422K        |
| zod         | 334K      | 333K        | 159K          | 285K        |
| yup         | 679K      | 161K        | 85.3K         | 155K        |
| ajv         | 418       | 413         | 391           | 405         |

## Parsing a valid subject (ops/sec, higher is better)

| library     | primitive | flat object | nested object | array of 10 |
| ----------- | --------- | ----------- | ------------- | ----------- |
| schematox   | 23.9M     | 4.39M       | 2.03M         | 515K        |
| ajv         | 21.6M     | 22.8M       | 20.0M         | 11.1M       |
| zod         | 20.0M     | 14.3M       | 7.78M         | 2.66M       |
| valibot     | 19.5M     | 6.75M       | 2.92M         | 690K        |
| yup         | 2.81M     | 143K        | 29.2K         | 7.44K       |
| superstruct | 781K      | 854K        | 313K          | 77.0K       |

## Parsing an invalid subject — wrong type (ops/sec, higher is better)

| library     | primitive | flat object | nested object | array of 10 (last item) |
| ----------- | --------- | ----------- | ------------- | ----------------------- |
| ajv         | 23.6M     | 20.3M       | 20.1M         | 9.28M                   |
| schematox   | 21.1M     | 3.97M       | 2.00M         | 512K                    |
| valibot     | 11.3M     | 4.80M       | 2.26M         | 644K                    |
| zod         | 4.82M     | 4.11M       | 2.99M         | 1.59M                   |
| superstruct | 167K      | 174K        | 164K          | 55.8K                   |
| yup         | 64.1K     | 43.1K       | 29.0K         | 6.66K                   |

(A missing-required-field variant is also benchmarked for the object shapes, and a too-short variant for the primitive; they track the wrong-type numbers closely and aren't shown separately.)

## Building and parsing once (ops/sec, higher is better)

A fresh schema per call, discarded afterwards — schemas created per request, or any other short-lived use.

| library     | flat object | array of 10 |
| ----------- | ----------- | ----------- |
| valibot     | 4.45M       | 650K        |
| schematox   | 459K        | 225K        |
| superstruct | 306K        | 59.8K       |
| yup         | 64.3K       | 7.15K       |
| zod         | 43.8K       | 40.5K       |
| ajv         | 402         | 409         |

## Why the ranking flips depending on what's being measured

**ajv compiles; zod 4 compiles objects lazily; everyone else interprets.** `ajv.compile(schema)` turns a JSON Schema into a specialized validator function generated with `new Function` — at parse time there's no schema to walk, just a tight generated function doing exactly the checks that specific schema needs. That's why ajv wins almost every parsing benchmark, and also why it's thousands of times _slower_ than everything else at construction. zod 4 does the same for objects, but lazily: `z.object()` is cheap to build, and the first `safeParse()` generates a specialized parser with `new Function` that every later call reuses. That's where its 3-5x lead over schematox and valibot on valid compound subjects comes from — and why it's the slowest non-ajv library in the build-and-parse-once table, where that first call is the only call. In environments that forbid `eval` (a strict CSP), or with `z.config({ jitless: true })`, zod falls back to interpreting: a flat object then parsed at ~5.9M ops/sec in a separate run, close to schematox and valibot. schematox, valibot, superstruct and yup walk a schema tree (or a chain of validator objects) on every call — cheap to build, but they redo interpretation work every time. **The practical takeaway: a compiling library only wins if a schema is built once and reused for many parses.** Construction usually happens once at app startup in real usage, which is why the parsing tables matter more for most applications, but it's worth knowing which regime you're in.

**On a bare primitive, schematox is fastest at accepting valid input — including ajv — and second only to ajv at rejecting invalid input.** A `bigint`/`boolean`/`literal`/`number`/`string` check is one `typeof` plus a comparison or two, no allocation, no loop. There's no schema-tree depth for an interpreter's overhead to hide in, so schematox's minimal per-call work wins outright. zod's invalid-primitive path is notably slower than its valid one because it builds a richer issue object.

**On objects, records, arrays, and tuples ("compound schemas"), the cost is dominated by per-element work**, not the top-level check. Among the interpreting libraries, valibot 1.5 is now ahead of schematox by roughly 1.3-1.5x on valid compound subjects and 1.1-1.3x on invalid ones; schematox remains well ahead of superstruct and yup.

**Array-of-objects looks worse than flat-object for every library, including ajv — that's volume, not an array-specific weakness.** The array benchmark validates 10 nested objects (30 field checks total) per call; the flat-object benchmark validates 3. Ops/sec drops roughly in proportion to the work per call for every library in the table.

**superstruct and valibot build fastest; yup is slow on both sides.** valibot 1.5 and superstruct build schemas an order of magnitude faster than schematox, which is also why valibot leads the build-and-parse-once table. yup is the only library here without a non-throwing validate API (its adapter wraps `validateSync()` in try/catch — see [`adapters.ts`](./adapters.ts)), and its schema resolution is the heaviest of the group regardless of outcome.

## Cost of opt-in parse features (`npm run bench:features`)

A flat 3-field object, relative to a plain `struct.parse()` on the same shape:

| case                                      | ops/sec | vs `struct.parse()` |
| ----------------------------------------- | ------- | ------------------- |
| `struct.parse()`                          | 5.11M   | 1.00x               |
| `parse(schema)`                           | 5.18M   | 1.01x               |
| `struct['~standard'].validate()`          | 5.18M   | 1.01x               |
| `{ coerce: true }`, already-typed input   | 4.59M   | 0.90x               |
| `{ coerce: true }`, string input          | 4.58M   | 0.90x               |
| `.preprocess()` on one field              | 4.29M   | 0.84x               |
| zod: plain `safeParse()`                  | 24.3M   | 4.75x               |
| zod: `z.coerce`/`z.stringbool()`, strings | 17.6M   | 3.44x               |
| zod: `z.preprocess()` on one field        | 14.5M   | 2.85x               |

Without `{ coerce: true }` and without a `.preprocess()` at a given position, the parser skips both lookups for that node; the small residual cost of supporting them at all is covered in the regression check below.

## Discriminated unions (`npm run bench:union`)

A union of 10 object variants `{ type: 'v0' | … | 'v9', a: string, b: number, c: boolean }`, measured with each library's plain union and, where there is one, its discriminated-union API: zod `discriminatedUnion()`, valibot `variant()`, ajv `discriminator`, yup `lazy()` keyed by the tag. superstruct has no discriminated API. Captured on 2026-10-06, same machine and versions as above.

### Parsing (ops/sec, higher is better)

| library                             | first variant | middle | last  | wrong field in last | unknown tag |
| ----------------------------------- | ------------- | ------ | ----- | ------------------- | ----------- |
| ajv discriminator                   | 27.4M         | 26.8M  | 27.1M | 23.0M               | 23.1M       |
| zod `discriminatedUnion()`          | 17.3M         | 13.3M  | 13.9M | 4.05M               | 3.32M       |
| zod `discriminatedUnion()`, jitless | 3.61M         | 3.37M  | 3.22M | 1.74M               | 2.83M       |
| schematox `.discriminant()`         | 3.80M         | 3.84M  | 3.84M | 3.60M               | 15.2M       |
| valibot `variant()`                 | 4.55M         | 2.04M  | 1.26M | 1.18M               | 816K        |
| schematox `union()`                 | 3.92M         | 911K   | 462K  | 446K                | 461K        |
| superstruct `union()`               | 595K          | 117K   | 58.4K | 40.4K               | 42.4K       |
| yup `lazy()`                        | 181K          | 175K   | 180K  | 47.8K               | 47.8K       |

### Last variant as the union grows (ops/sec)

`{ type: literal, a: number }` variants:

| library                             | 10    | 100   | 1000  |
| ----------------------------------- | ----- | ----- | ----- |
| zod `discriminatedUnion()`          | 17.3M | 11.3M | 11.7M |
| zod `discriminatedUnion()`, jitless | 5.46M | 4.55M | 4.57M |
| schematox `.discriminant()`         | 5.14M | 5.13M | 4.59M |
| valibot `variant()`                 | 1.28M | 121K  | 13.7K |

### Building the 10-variant union (ops/sec)

| library                     | build only | build + parse once |
| --------------------------- | ---------- | ------------------ |
| valibot `variant()`         | 1.01M      | 517K               |
| schematox `.discriminant()` | 36.2K      | 36.6K              |
| zod `discriminatedUnion()`  | 24.5K      | 12.4K              |

### Where schematox is strong

- **Position doesn't matter.** Members are looked up through a tag → members index built once per schema. The first, middle and last variant all parse at ~3.8M, and 1000 variants parse at about the speed of 10. valibot `variant()` scans its members, so it drops ~90x from 10 to 1000 variants.
- **Rejecting an unknown tag is nearly free.** It's one `Map` lookup and an `INVALID_UNION`, with no member parsing and no error building: 15.2M, second only to ajv and ~4.6x zod.
- **Failures inside the matched variant stay cheap.** schematox reports the matched member's own errors (e.g. `INVALID_TYPE` at `['b']`) at almost the cost of a valid parse. zod drops from 13.9M to 4.05M on the same case because it builds richer issue objects.
- **Without code generation, it matches zod.** Under a CSP that forbids `eval`, or with `z.config({ jitless: true })`, zod's discriminated union is within ±10% of schematox on valid subjects and slower on invalid ones. ajv and default zod get their lead from `new Function`, which isn't always allowed.
- **Its selection rules are more flexible.**
  - Soft fallback: members without the key, e.g. a `string()` beside the tagged objects, are still tried. zod and valibot require every member of a discriminated union to be an object carrying the key.
  - A priority list of keys (`.discriminant(['kind', 'type'])`) instead of a single key.
  - It works in plain-data, JSON-serializable schemas (`{ type: 'union', of, discriminant: 'type' }`).

### Where schematox is weak

- **On valid subjects, raw throughput trails compiled validators.** ajv is ~7x faster and default zod ~3.5-4.5x. Selection is not the bottleneck: once the member is found, schematox's object parser interprets the schema tree on every call, while zod and ajv run a generated function. This is the same gap as in the plain object tables above, and it won't close without code generation.
- **valibot wins on the first variant.** With 10 variants, `variant()`'s scan is cheaper than an index lookup when the match is first (4.55M vs 3.80M). The index pays off from the middle onward.
- **Construction is slow, and the cost is in the members.** 10 object members take ~25µs to build, and the `.discriminant()` call itself adds ~2µs to build the index. That's ~28x valibot, so schemas created per request should be hoisted. The index is cached per schema object, and each chained call after `.discriminant()` (e.g. `.optional()`) creates a new schema and rebuilds it.
- **There are stricter rules on preprocessors.** A tagged member, or its tag property, can't have `.preprocess()`, and `makeStruct` throws. The index matches raw tag values, so a preprocessor that rewrote the tag would select the wrong member. The preprocessor has to go on the union instead.
- **Diagnostics are minimal.** An unknown tag, or several members sharing a matched tag, gives a bare `INVALID_UNION` without the expected tag values. Duplicate tags across members aren't flagged when the schema is built; they are simply tried in order.
- **Mutation goes unseen.** Mutating a schema object after its first parse isn't seen by the cached index. Schemas are meant to be immutable.

## Regression check (`npm run bench:self`)

`bench:self` extracts `src/` from a git ref (`BASELINE_REF`, default `main`) and benchmarks it head-to-head against the working tree on the four shapes above. Measured noise (a ref against itself) is under 1%. Against the last benchmarked commit before coercion/preprocessing landed (`5ba7bab`), the current parser is within ~2% on every shape — the remaining cost of threading the coercion flag and preprocessor position through every node.
