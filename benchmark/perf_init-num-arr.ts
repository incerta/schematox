import * as tox from 'schematox'
import * as zod from 'zod'
import * as sup from 'superstruct'

import { withPerfTest, getPerCentHigherThanFastest } from './utils'

const MANUAL_REPERTITIONS = 3
const I1 = 1_000_00 ^ 100
const I2 = 10

const TOTAL_REPERTITIONS = I1 * I2 * MANUAL_REPERTITIONS

export function perf_initNumArr() {
  const zodNumberArrInit = () => {
    const schemas = [] as unknown[]

    for (let i = I1; i > 0; i--) {
      schemas.push(zod.array(zod.number()))
    }

    return schemas
  }

  const toxNumberArrInit = () => {
    const schemas = [] as unknown[]

    for (let i = I1; i > 0; i--) {
      schemas.push(tox.array(tox.number()))
    }

    return schemas
  }

  const supNumberArrInit = () => {
    const schemas = [] as unknown[]

    for (let i = I1; i > 0; i--) {
      schemas.push(sup.array(sup.number()))
    }

    return schemas
  }

  const t1Result = {
    zod: 0,
    tox: 0,
    sup: 0,
  }

  for (let i = I2; i > 0; i--) {
    t1Result.zod += withPerfTest(
      'Schema initialization test: zod',
      zodNumberArrInit
    )
    t1Result.tox += withPerfTest(
      'Schema initialization test: tox',
      toxNumberArrInit
    )
    t1Result.sup += withPerfTest(
      'Schema initialization test: sup',
      supNumberArrInit
    )

    t1Result.sup += withPerfTest(
      'Schema initialization test: sup',
      supNumberArrInit
    )
    t1Result.tox += withPerfTest(
      'Schema initialization test: tox',
      toxNumberArrInit
    )
    t1Result.zod += withPerfTest(
      'Schema initialization test: zod',
      zodNumberArrInit
    )

    t1Result.tox += withPerfTest(
      'Schema initialization test: tox',
      toxNumberArrInit
    )
    t1Result.sup += withPerfTest(
      'Schema initialization test: sup',
      supNumberArrInit
    )
    t1Result.zod += withPerfTest(
      'Schema initialization test: zod',
      zodNumberArrInit
    )
  }

  console.info(
    `T1: Initialization of number array schema: ${TOTAL_REPERTITIONS} times:\n`,
    getPerCentHigherThanFastest(t1Result)
  )

  return t1Result
}
