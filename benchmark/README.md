# Benchmarks

This directory compares schematox against [zod](https://www.npmjs.com/package/zod), [valibot](https://www.npmjs.com/package/valibot), [superstruct](https://www.npmjs.com/package/superstruct), [ajv](https://www.npmjs.com/package/ajv), and [yup](https://www.npmjs.com/package/yup), using [tinybench](https://www.npmjs.com/package/tinybench). It measures three separate things — **building** a schema once, **parsing** with an already-built schema, and **building + parsing once** (a schema used for a single call) — across four shapes (a bare primitive, a flat 3-field object, a 2-level nested object with an array field, and an array of 10 objects), each with both a valid and an invalid subject.

Run it yourself:

```sh
cd benchmark
npm install
npm run bench           # schematox vs. other libraries
npm run bench:features  # cost of { coerce: true }, .preprocess(), ~standard.validate
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

| case                                        | ops/sec | vs `struct.parse()` |
| ------------------------------------------- | ------- | ------------------- |
| `struct.parse()`                            | 5.11M   | 1.00x               |
| `parse(schema)`                             | 5.18M   | 1.01x               |
| `struct['~standard'].validate()`            | 5.18M   | 1.01x               |
| `{ coerce: true }`, already-typed input     | 4.59M   | 0.90x               |
| `{ coerce: true }`, string input            | 4.58M   | 0.90x               |
| `.preprocess()` on one field                | 4.29M   | 0.84x               |
| zod: plain `safeParse()`                    | 24.3M   | 4.75x               |
| zod: `z.coerce`/`z.stringbool()`, strings   | 17.6M   | 3.44x               |
| zod: `z.preprocess()` on one field          | 14.5M   | 2.85x               |

Without `{ coerce: true }` and without a `.preprocess()` at a given position, the parser skips both lookups for that node; the small residual cost of supporting them at all is covered in the regression check below.

## Regression check (`npm run bench:self`)

`bench:self` extracts `src/` from a git ref (`BASELINE_REF`, default `main`) and benchmarks it head-to-head against the working tree on the four shapes above. Measured noise (a ref against itself) is under 1%. Against the last benchmarked commit before coercion/preprocessing landed (`5ba7bab`), the current parser is within ~2% on every shape — the remaining cost of threading the coercion flag and preprocessor position through every node.
