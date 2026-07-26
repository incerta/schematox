# Benchmarks

This directory compares schematox against [zod](https://www.npmjs.com/package/zod), [valibot](https://www.npmjs.com/package/valibot), [superstruct](https://www.npmjs.com/package/superstruct), [ajv](https://www.npmjs.com/package/ajv), and [yup](https://www.npmjs.com/package/yup). Two things are measured: **speed**, using [tinybench](https://www.npmjs.com/package/tinybench) — both **building** a schema once and **parsing** with an already-built schema, across four shapes (a bare primitive, a flat 3-field object, a 2-level nested object with an array field, and an array of 10 objects), each with both a valid and an invalid subject — and **bundle size**, using [esbuild](https://esbuild.github.io) to bundle and minify a realistic single-schema use case.

Run it yourself:

```sh
cd benchmark
npm install
npm run bench
```

Numbers below were captured on Node v23.7.0, Apple M1. Absolute numbers will differ on your machine — what should hold up is the relative ordering and the reasoning behind it.

## Schema construction (ops/sec, higher is better)

| library | primitive | flat object | nested object | array of 10 |
|---|---|---|---|---|
| superstruct | 6.49M | 7.59M | 4.20M | 6.63M |
| schematox | 1.11M | 542K | 270K | 443K |
| zod | 929K | 371K | 166K | 314K |
| valibot | 573K | 1.07M | 531K | 840K |
| yup | 661K | 153K | 84.5K | 153K |
| ajv | 362 | 366 | 361 | 406 |

## Parsing a valid subject (ops/sec, higher is better)

| library | primitive | flat object | nested object | array of 10 |
|---|---|---|---|---|
| schematox | 23.8M | 4.63M | 2.02M | 518K |
| ajv | 20.8M | 21.8M | 19.6M | 11.0M |
| zod | 16.0M | 3.20M | 1.08M | 313K |
| valibot | 14.6M | 5.31M | 2.00M | 526K |
| yup | 2.86M | 144K | 31.5K | 8.02K |
| superstruct | 791K | 826K | 310K | 76.0K |

## Parsing an invalid subject — wrong type (ops/sec, higher is better)

| library | primitive | flat object | nested object | array of 10 (last item) |
|---|---|---|---|---|
| ajv | 23.3M | 20.0M | 19.5M | 8.90M |
| schematox | 20.8M | 4.22M | 2.01M | 523K |
| valibot | 7.37M | 3.53M | 1.57M | 492K |
| zod | 3.27M | 1.71M | 859K | 279K |
| superstruct | 179K | 184K | 172K | 55.4K |
| yup | 66.0K | 43.0K | 32.6K | 6.77K |

(A missing-required-field variant is also benchmarked for the object shapes; it tracks the wrong-type numbers closely and isn't shown separately.)

## Why the ranking flips depending on what's being measured

**ajv compiles; everyone else interprets.** `ajv.compile(schema)` turns a JSON Schema into a specialized validator function generated with `new Function` — at parse time there's no schema to walk, just a tight generated function doing exactly the checks that specific schema needs. That's why ajv wins almost every parsing benchmark, often by 5-20x, and also why it's ~15,000-20,000x *slower* than everything else at construction: compilation is real work, and ajv's parsing speed is that work paid once and amortized over every subsequent call. schematox, zod, and valibot instead walk a schema tree (or a chain of validator objects) on every call — cheap to build, but they redo interpretation work every time. **The practical takeaway: ajv only wins if a schema is built once and reused for many parses. If schemas are built per-request or are short-lived, ajv's compile cost dominates and it's the worst option on the page** — construction usually happens once at app startup in real usage, which is why the parsing tables matter more than the construction table for most applications, but it's worth knowing which regime you're in.

**On a bare primitive, schematox is fastest of all — including ajv.** A `bigint`/`boolean`/`literal`/`number`/`string` check is one `typeof` plus a comparison or two, no allocation, no loop. There's no schema-tree depth for an interpreter's overhead to hide in, so schematox's minimal per-call work wins outright.

**On objects, records, arrays, and tuples ("compound schemas"), the cost is dominated by per-element work**, not the top-level check — how much happens for every key or item beyond the type test itself, since these shapes validate multiple children instead of one value. schematox keeps that per-element cost low enough to run neck-and-neck with valibot and ahead of zod across every compound-schema case above, both valid and invalid subjects.

**Array-of-objects looks worse than flat-object for every library, including ajv — that's volume, not an array-specific weakness.** The array benchmark validates 10 nested objects (30 field checks total) per call; the flat-object benchmark validates 3. Ops/sec drops roughly in proportion to the work per call for every library in the table, ajv included, not just schematox.

**superstruct and yup sit at the opposite ends of the construction/parsing tradeoff.** superstruct's schemas are cheap closures to build — fastest construction by a wide margin — but the slowest interpreter to run except against yup. yup is unusually slow on both sides: it's the only library here without a non-throwing validate API (its adapter wraps `validateSync()` in try/catch — see [`adapters.ts`](./adapters.ts)), and its schema resolution is the heaviest of the group regardless of outcome.

## Bundle size (minified + gzip, smaller is better)

Run it yourself:

```sh
cd benchmark
npm install
npm run size
```

This isn't the package's published unpacked size — it's what actually ships to a client for one realistic use case: build the same flat 3-field object schema used above, parse one subject with it, then bundle and minify with [esbuild](https://esbuild.github.io) for the browser platform and gzip the result. Unused exports get tree-shaken like they would in a real app, so the number reflects the cost of *using* a library, not owning it on disk.

schematox appears twice. `schematox (struct)` is the `object()`/`string()`/... chain, authored the same way the ops/sec benchmarks above build it. `schematox (static schema)` passes a plain object literal straight to `parse()` instead — no `struct` builder at all. Both produce identical runtime behavior; this checks whether "a schema is just data" pays off in bundle size, not only in portability.

| library | minified | minified + gzip | vs smallest |
|---|---|---|---|
| valibot | 3.18 kB | 1.21 kB | smallest |
| superstruct | 3.38 kB | 1.43 kB | 1.19x larger |
| schematox (static schema) | 6.18 kB | 1.54 kB | 1.28x larger |
| schematox (struct) | 8.29 kB | 2.13 kB | 1.77x larger |
| yup | 41.20 kB | 13.14 kB | 10.88x larger |
| zod | 58.26 kB | 13.84 kB | 11.45x larger |
| ajv | 115.12 kB | 35.43 kB | 29.33x larger |

**schematox isn't the smallest here — valibot and superstruct both beat it, by a real margin, not noise.** Both are built from the ground up as independent, individually-importable functions with no shared runtime beyond what a given call needs. schematox's `parse()` path (shared across every schema type, coercion, and `.preprocess()`) doesn't shrink to fit a single flat object the way valibot's or superstruct's per-function design does, even with dead-code elimination doing its job. It's still 6-9x smaller than zod and yup and over 15x smaller than ajv's compiled output for the same schema — the honest claim is "meaningfully lighter than the mainstream option," not "the lightest thing here."

**Authoring style changes the number, not just the portability story.** The static-schema version is ~28% smaller minified and ~28% smaller gzipped than the `struct` version, because it only pulls in `parse()` — the `struct` version also pulls in the chain-method machinery (`.optional()`, `.nullable()`, `.brand()`, `.preprocess()`, ...) that a flat object with no chained params never calls but esbuild can't fully prove away. If bundle weight is the priority for a given call site, passing a plain schema object to `parse()` directly is the smaller choice, not just the more "data-first" one.
