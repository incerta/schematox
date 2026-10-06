import { Bench } from 'tinybench'
import * as tox from '../src/index.ts'
import { z } from 'zod'
import * as sup from 'superstruct'
import * as v from 'valibot'
import Ajv from 'ajv'
import * as yup from 'yup'

// JITLESS=1 runs zod without its `new Function` object parsers — what it
// does under a CSP that forbids eval
if (process.env.JITLESS === '1') {
  z.config({ jitless: true })
}

// Tagged union of 10 object variants:
// { type: 'v0' | … | 'v9', a: string, b: number, c: boolean }
//
// Each library is measured with its plain union and, where it has one, its
// dedicated discriminated-union API — so the table shows both what the
// discriminant buys within a library and how libraries compare.

const VARIANT_COUNT = 10
const TAGS = Array.from({ length: VARIANT_COUNT }, (_, i) => `v${i}`)

type Validate = (subject: unknown) => boolean

const toxMembers = TAGS.map((tag) =>
  tox.object({
    type: tox.literal(tag),
    a: tox.string(),
    b: tox.number(),
    c: tox.boolean(),
  })
) as unknown as [tox.Struct<tox.Schema>]

const zodMembers = TAGS.map((tag) =>
  z.object({
    type: z.literal(tag),
    a: z.string(),
    b: z.number(),
    c: z.boolean(),
  })
) as unknown as [z.ZodObject<any>, z.ZodObject<any>]

const valMembers = TAGS.map((tag) =>
  v.object({
    type: v.literal(tag),
    a: v.string(),
    b: v.number(),
    c: v.boolean(),
  })
)

const supMembers = TAGS.map((tag) =>
  sup.object({
    type: sup.literal(tag),
    a: sup.string(),
    b: sup.number(),
    c: sup.boolean(),
  })
) as unknown as [sup.Struct<any>, sup.Struct<any>]

const ajvMembers = TAGS.map((tag) => ({
  type: 'object',
  properties: {
    type: { const: tag },
    a: { type: 'string' },
    b: { type: 'number' },
    c: { type: 'boolean' },
  },
  required: ['type', 'a', 'b', 'c'],
}))

const yupByTag = Object.fromEntries(
  TAGS.map((tag) => [
    tag,
    yup.object({
      type: yup.string().oneOf([tag]).required(),
      a: yup.string().strict().required(),
      b: yup.number().strict().required(),
      c: yup.boolean().strict().required(),
    }),
  ])
)
const yupUnknownTag = yup.object({
  type: yup.string().oneOf(TAGS).required(),
})

const toxUnion = tox.union(toxMembers)
const toxDiscriminated = tox.union(toxMembers).discriminant('type' as never)
const zodUnion = z.union(zodMembers)
const zodDiscriminated = z.discriminatedUnion('type', zodMembers)
const valUnion = v.union(valMembers)
const valVariant = v.variant('type', valMembers)
const supUnion = sup.union(supMembers)
const ajvAnyOf = new Ajv().compile({ anyOf: ajvMembers })
const ajvDiscriminator = new Ajv({ discriminator: true }).compile({
  type: 'object',
  discriminator: { propertyName: 'type' },
  required: ['type'],
  oneOf: ajvMembers,
})
const yupLazy = yup.lazy(
  (subject: any) => yupByTag[subject?.type] ?? yupUnknownTag
)

const contenders: Array<[label: string, validate: Validate]> = [
  [
    'schematox union().discriminant()',
    (s) => toxDiscriminated.parse(s).success,
  ],
  ['schematox union()', (s) => toxUnion.parse(s).success],
  ['zod discriminatedUnion()', (s) => zodDiscriminated.safeParse(s).success],
  ['zod union()', (s) => zodUnion.safeParse(s).success],
  ['valibot variant()', (s) => v.safeParse(valVariant, s).success],
  ['valibot union()', (s) => v.safeParse(valUnion, s).success],
  ['ajv discriminator', (s) => ajvDiscriminator(s) === true],
  ['ajv anyOf', (s) => ajvAnyOf(s) === true],
  ['superstruct union()', (s) => sup.validate(s, supUnion)[0] === undefined],
  [
    'yup lazy()',
    (s) => {
      try {
        yupLazy.validateSync(s)
        return true
      } catch {
        return false
      }
    },
  ],
]

const valid = (tag: string) => ({ type: tag, a: 'str', b: 1, c: true })

const scenarios: Array<[label: string, subject: unknown, expected: boolean]> = [
  ['valid: first variant', valid('v0'), true],
  ['valid: middle variant', valid('v4'), true],
  ['valid: last variant', valid('v9'), true],
  [
    'invalid: wrong field type in last variant',
    { ...valid('v9'), b: 'x' },
    false,
  ],
  ['invalid: unknown tag', valid('v99'), false],
]

function sanityCheck() {
  for (const [scenario, subject, expected] of scenarios) {
    for (const [label, validate] of contenders) {
      if (validate(subject) !== expected) {
        throw Error(`${label} returned ${!expected} for "${scenario}"`)
      }
    }
  }
}

// Last-variant match as the union grows: an index (zod, schematox) keeps
// selection constant, a scan over members (valibot) grows with N.
async function benchScaling() {
  for (const n of [10, 100, 1000]) {
    const tags = Array.from({ length: n }, (_, i) => `v${i}`)
    const t = tox
      .union(
        tags.map((tag) =>
          tox.object({ type: tox.literal(tag), a: tox.number() })
        ) as never
      )
      .discriminant('type' as never)
    const zd = z.discriminatedUnion(
      'type',
      tags.map((tag) =>
        z.object({ type: z.literal(tag), a: z.number() })
      ) as never
    )
    const vv = v.variant(
      'type',
      tags.map((tag) => v.object({ type: v.literal(tag), a: v.number() }))
    )
    const subject = { type: `v${n - 1}`, a: 1 }
    const bench = new Bench({ name: `scaling: ${n} variants, last variant` })

    bench.add('schematox union().discriminant()', () => {
      t.parse(subject)
    })
    bench.add('zod discriminatedUnion()', () => {
      zd.safeParse(subject)
    })
    bench.add('valibot variant()', () => {
      v.safeParse(vv, subject)
    })

    await bench.run()
    printTable(bench)
  }
}

// Building a 10-variant union, alone and followed by a single parse — the
// cost a schema created per call pays. Members are rebuilt every time, so
// this is the whole schema, not just the union wrapper.
async function benchConstruction() {
  const subject = valid('v9')
  const build = {
    'schematox union().discriminant()': () =>
      tox
        .union(
          TAGS.map((tag) =>
            tox.object({
              type: tox.literal(tag),
              a: tox.string(),
              b: tox.number(),
              c: tox.boolean(),
            })
          ) as never
        )
        .discriminant('type' as never),
    'zod discriminatedUnion()': () =>
      z.discriminatedUnion(
        'type',
        TAGS.map((tag) =>
          z.object({
            type: z.literal(tag),
            a: z.string(),
            b: z.number(),
            c: z.boolean(),
          })
        ) as never
      ),
    'valibot variant()': () =>
      v.variant(
        'type',
        TAGS.map((tag) =>
          v.object({
            type: v.literal(tag),
            a: v.string(),
            b: v.number(),
            c: v.boolean(),
          })
        )
      ),
  }
  const parseOnce = {
    'schematox union().discriminant()': () =>
      build['schematox union().discriminant()']().parse(subject),
    'zod discriminatedUnion()': () =>
      build['zod discriminatedUnion()']().safeParse(subject),
    'valibot variant()': () =>
      v.safeParse(build['valibot variant()'](), subject),
  }

  for (const [name, tasks] of [
    ['construction: 10 variants', build],
    ['build + parse once: 10 variants, last variant', parseOnce],
  ] as const) {
    const bench = new Bench({ name })

    for (const [label, fn] of Object.entries(tasks)) {
      bench.add(label, () => {
        fn()
      })
    }

    await bench.run()
    printTable(bench)
  }
}

function printTable(bench: Bench) {
  const rows = bench.tasks.map((task) => ({
    library: task.name,
    ops: task.result.state === 'completed' ? task.result.throughput.mean : 0,
  }))
  const fastest = Math.max(...rows.map((r) => r.ops))

  console.log(`\n${bench.name}`)
  console.table(
    rows
      .sort((a, b) => b.ops - a.ops)
      .map(({ library, ops }) => ({
        library,
        'ops/sec': Math.round(ops).toLocaleString(),
        'vs fastest':
          ops === fastest ? 'fastest' : `${(fastest / ops).toFixed(2)}x slower`,
      }))
  )
}

async function main() {
  sanityCheck()

  console.log(`Tagged union of ${VARIANT_COUNT} object variants (ops/sec)\n`)

  for (const [scenario, subject] of scenarios) {
    const bench = new Bench({ name: scenario })

    for (const [label, validate] of contenders) {
      bench.add(label, () => {
        validate(subject)
      })
    }

    await bench.run()
    printTable(bench)
  }
}

main().then(benchScaling).then(benchConstruction)
