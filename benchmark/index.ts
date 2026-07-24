import { Bench } from 'tinybench'

import { adapters, LIB_LABELS, type LibKey } from './adapters.ts'

import * as primitive from './schemas/primitive.ts'
import * as flatObject from './schemas/flat-object.ts'
import * as nestedObject from './schemas/nested-object.ts'
import * as arrayShape from './schemas/array.ts'

const LIB_KEYS: LibKey[] = ['tox', 'zod', 'sup', 'val', 'ajv', 'yup']

async function benchConstruction(
  label: string,
  builders: Record<LibKey, () => unknown>
) {
  const bench = new Bench({ name: `construction: ${label}` })

  for (const key of LIB_KEYS) {
    bench.add(LIB_LABELS[key], () => {
      builders[key]()
    })
  }

  await bench.run()
  printTable(bench)
}

async function benchParse(
  label: string,
  schemas: Record<LibKey, unknown>,
  subject: unknown
) {
  const bench = new Bench({ name: label })

  for (const key of LIB_KEYS) {
    bench.add(LIB_LABELS[key], () => {
      adapters[key](schemas[key], subject)
    })
  }

  await bench.run()
  printTable(bench)
}

function printTable(bench: Bench) {
  const opsByTask = bench.tasks.map((task) => ({
    library: task.name,
    ops: task.result?.throughput.mean ?? 0,
    meanMs: task.result?.latency.mean ?? 0,
  }))

  const fastestOps = Math.max(...opsByTask.map((t) => t.ops))

  console.log(`\n${bench.name}`)
  console.table(
    opsByTask
      .sort((a, b) => b.ops - a.ops)
      .map(({ library, ops, meanMs }) => ({
        library,
        'ops/sec': Math.round(ops).toLocaleString(),
        'mean (ms)': meanMs.toFixed(5),
        'vs fastest':
          ops === fastestOps
            ? 'fastest'
            : `${(fastestOps / ops).toFixed(2)}x slower`,
      }))
  )
}

async function main() {
  console.log('Schema construction (building the schema once)\n')
  await benchConstruction('primitive (string, minLength)', primitive.builders)
  await benchConstruction('flat object (3 fields)', flatObject.builders)
  await benchConstruction('nested object', nestedObject.builders)
  await benchConstruction(
    'array of 10 objects (schema only, not the array)',
    arrayShape.builders
  )

  console.log(
    '\n\nParsing/validation (schema built once, reused across calls)\n'
  )

  await benchParse(
    'primitive: valid subject',
    primitive.schemas,
    primitive.validSubject
  )
  await benchParse(
    'primitive: invalid subject (wrong type)',
    primitive.schemas,
    primitive.invalidSubjectWrongType
  )
  await benchParse(
    'primitive: invalid subject (too short)',
    primitive.schemas,
    primitive.invalidSubjectTooShort
  )

  await benchParse(
    'flat object: valid subject',
    flatObject.schemas,
    flatObject.validSubject
  )
  await benchParse(
    'flat object: invalid subject (wrong type)',
    flatObject.schemas,
    flatObject.invalidSubjectWrongType
  )
  await benchParse(
    'flat object: invalid subject (missing field)',
    flatObject.schemas,
    flatObject.invalidSubjectMissingField
  )

  await benchParse(
    'nested object: valid subject',
    nestedObject.schemas,
    nestedObject.validSubject
  )
  await benchParse(
    'nested object: invalid subject (wrong type)',
    nestedObject.schemas,
    nestedObject.invalidSubjectWrongType
  )
  await benchParse(
    'nested object: invalid subject (missing field)',
    nestedObject.schemas,
    nestedObject.invalidSubjectMissingField
  )

  await benchParse(
    'array (10 items): valid subject',
    arrayShape.schemas,
    arrayShape.validSubject
  )
  await benchParse(
    'array (10 items): invalid subject (wrong type in last item)',
    arrayShape.schemas,
    arrayShape.invalidSubjectWrongType
  )
}

main()
