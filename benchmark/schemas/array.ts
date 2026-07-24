import * as tox from '../../src/index.ts'
import { z } from 'zod'
import * as sup from 'superstruct'
import * as v from 'valibot'
import Ajv from 'ajv'
import * as yup from 'yup'

import type { LibKey } from '../adapters.ts'

// Array<{ name: string, age: number, active: boolean }>

export const builders: Record<LibKey, () => unknown> = {
  tox: () =>
    tox.array(
      tox.object({
        name: tox.string(),
        age: tox.number(),
        active: tox.boolean(),
      })
    ),
  zod: () =>
    z.array(
      z.object({
        name: z.string(),
        age: z.number(),
        active: z.boolean(),
      })
    ),
  sup: () =>
    sup.array(
      sup.object({
        name: sup.string(),
        age: sup.number(),
        active: sup.boolean(),
      })
    ),
  val: () =>
    v.array(
      v.object({
        name: v.string(),
        age: v.number(),
        active: v.boolean(),
      })
    ),
  ajv: () =>
    new Ajv().compile({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
          active: { type: 'boolean' },
        },
        required: ['name', 'age', 'active'],
      },
    }),
  yup: () =>
    yup.array(
      yup.object({
        name: yup.string().required(),
        age: yup.number().required(),
        active: yup.boolean().required(),
      })
    ),
}

export const schemas = {
  tox: builders.tox(),
  zod: builders.zod(),
  sup: builders.sup(),
  val: builders.val(),
  ajv: builders.ajv(),
  yup: builders.yup(),
} as Record<LibKey, any>

const ITEM_COUNT = 10

export const validSubject = Array.from({ length: ITEM_COUNT }, (_, i) => ({
  name: `user-${i}`,
  age: 20 + i,
  active: i % 2 === 0,
}))

export const invalidSubjectWrongType = validSubject.map((item, i) =>
  i === ITEM_COUNT - 1 ? { ...item, age: 'not-a-number' } : item
)
