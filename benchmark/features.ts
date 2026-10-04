import { Bench } from 'tinybench'
import { z } from 'zod'

import * as tox from '../src/index.ts'

// Cost of the opt-in parse features — `{ coerce: true }`, `.preprocess()`,
// `~standard.validate` — relative to a plain struct `.parse()` on the same
// flat 3-field object. zod is included where its API is a direct
// counterpart (`z.coerce.*`/`z.stringbool()`, `z.preprocess()`).

const trim = (s: unknown) => (typeof s === 'string' ? s.trim() : s)

const typed = { name: 'John', age: 30, active: true }
const stringly = { name: 'John', age: '30', active: 'true' }
const padded = { name: '  John  ', age: 30, active: true }

const toxPlain = tox.object({
  name: tox.string(),
  age: tox.number(),
  active: tox.boolean(),
})

const toxPreprocess = tox.object({
  name: tox.string().preprocess(trim),
  age: tox.number(),
  active: tox.boolean(),
})

const zodPlain = z.object({
  name: z.string(),
  age: z.number(),
  active: z.boolean(),
})

const zodCoerce = z.object({
  name: z.coerce.string(),
  age: z.coerce.number(),
  active: z.stringbool(),
})

const zodPreprocess = z.object({
  name: z.preprocess(trim, z.string()),
  age: z.number(),
  active: z.boolean(),
})

const cases: Array<[string, () => unknown]> = [
  ['schematox: struct.parse()', () => toxPlain.parse(typed)],
  ['schematox: parse(schema)', () => tox.parse(toxPlain.__schema, typed)],
  [
    'schematox: ~standard.validate',
    () => toxPlain['~standard'].validate(typed),
  ],
  [
    'schematox: { coerce: true }, already typed',
    () => toxPlain.parse(typed, { coerce: true }),
  ],
  [
    'schematox: { coerce: true }, string input',
    () => toxPlain.parse(stringly, { coerce: true }),
  ],
  ['schematox: .preprocess() on one field', () => toxPreprocess.parse(padded)],
  ['zod: plain', () => zodPlain.safeParse(typed)],
  ['zod: coerce, string input', () => zodCoerce.safeParse(stringly)],
  ['zod: preprocess on one field', () => zodPreprocess.safeParse(padded)],
]

async function main() {
  // Sanity check: every case must actually succeed, or we'd be timing
  // the error path instead of the feature.
  for (const [label, fn] of cases) {
    const r = fn() as { success?: boolean; issues?: unknown }
    if (r.success === false || r.issues !== undefined) {
      throw new Error(`benchmark case failed to parse: ${label}`)
    }
  }

  const bench = new Bench({ name: 'opt-in features: flat object (3 fields)' })

  for (const [label, fn] of cases) {
    bench.add(label, fn)
  }

  await bench.run()

  const baseline = bench.tasks[0]!

  const ops = (task: (typeof bench.tasks)[number]) =>
    task.result.state === 'completed' ? task.result.throughput.mean : 0

  console.log(`\n${bench.name}`)
  console.table(
    bench.tasks.map((task) => ({
      case: task.name,
      'ops/sec': Math.round(ops(task)).toLocaleString(),
      'vs struct.parse()': `${(ops(task) / ops(baseline)).toFixed(2)}x`,
    }))
  )
}

main()
