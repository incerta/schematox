import { Bench } from 'tinybench'

import * as head from '../src/index.ts'

// schematox vs. itself: the working tree's `src/` against a baseline `src/`
// extracted by `npm run bench:self` (see package.json) into `.baseline/`.
// Pick the baseline with BASELINE_REF (default: main), e.g.
// `BASELINE_REF=v2.1.0 npm run bench:self`.
// @ts-ignore -- generated at run time, absent from the repo
import * as base from './.baseline/src/index.ts'

type Tox = typeof head

const shapes: Array<{
  label: string
  build: (tox: Tox) => { parse: (subject: unknown) => { success: boolean } }
  subjects: Array<[string, unknown]>
}> = [
  {
    label: 'primitive',
    build: (tox) => tox.string().minLength(3),
    subjects: [
      ['valid', 'hello world'],
      ['wrong type', 42],
    ],
  },
  {
    label: 'flat object',
    build: (tox) =>
      tox.object({
        name: tox.string(),
        age: tox.number(),
        active: tox.boolean(),
      }),
    subjects: [
      ['valid', { name: 'John', age: 30, active: true }],
      ['wrong type', { name: 'John', age: '30', active: true }],
    ],
  },
  {
    label: 'nested object',
    build: (tox) =>
      tox.object({
        user: tox.object({ name: tox.string(), age: tox.number() }),
        meta: tox.object({
          createdAt: tox.string(),
          tags: tox.array(tox.string()),
        }),
      }),
    subjects: [
      [
        'valid',
        {
          user: { name: 'John', age: 30 },
          meta: { createdAt: '2024-01-01', tags: ['a', 'b', 'c'] },
        },
      ],
      [
        'wrong type',
        {
          user: { name: 'John', age: '30' },
          meta: { createdAt: '2024-01-01', tags: ['a', 'b', 'c'] },
        },
      ],
    ],
  },
  {
    label: 'array of 10',
    build: (tox) =>
      tox.array(
        tox.object({
          name: tox.string(),
          age: tox.number(),
          active: tox.boolean(),
        })
      ),
    subjects: (() => {
      const valid = Array.from({ length: 10 }, (_, i) => ({
        name: `user-${i}`,
        age: 20 + i,
        active: i % 2 === 0,
      }))
      const invalid = valid.map((item, i) =>
        i === 9 ? { ...item, age: 'x' } : item
      )
      return [
        ['valid', valid],
        ['wrong type', invalid],
      ] as Array<[string, unknown]>
    })(),
  },
]

async function main() {
  const rows: Record<string, string>[] = []

  for (const shape of shapes) {
    const schemaHead = shape.build(head)
    const schemaBase = shape.build(base as Tox)

    for (const [subjectLabel, subject] of shape.subjects) {
      const bench = new Bench({ time: 1000 })

      bench
        .add('base', () => schemaBase.parse(subject))
        .add('head', () => schemaHead.parse(subject))

      await bench.run()

      const [b, h] = bench.tasks.map((t) =>
        t.result.state === 'completed' ? t.result.throughput.mean : 0
      )
      const delta = ((h - b) / b) * 100

      rows.push({
        case: `${shape.label}: ${subjectLabel}`,
        'base ops/sec': Math.round(b).toLocaleString(),
        'head ops/sec': Math.round(h).toLocaleString(),
        delta: `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`,
      })
    }
  }

  console.log(`\nschematox: head vs ${process.env.BASELINE_REF ?? 'main'}`)
  console.table(rows)
}

main()
