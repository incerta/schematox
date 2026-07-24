import * as tox from '../../src/index.ts'
import { z } from 'zod'
import * as sup from 'superstruct'
import * as v from 'valibot'
import Ajv from 'ajv'
import * as yup from 'yup'

import type { LibKey } from '../adapters.ts'

// { name: string, age: number, active: boolean }

export const builders: Record<LibKey, () => unknown> = {
  tox: () =>
    tox.object({
      name: tox.string(),
      age: tox.number(),
      active: tox.boolean(),
    }),
  zod: () =>
    z.object({
      name: z.string(),
      age: z.number(),
      active: z.boolean(),
    }),
  sup: () =>
    sup.object({
      name: sup.string(),
      age: sup.number(),
      active: sup.boolean(),
    }),
  val: () =>
    v.object({
      name: v.string(),
      age: v.number(),
      active: v.boolean(),
    }),
  ajv: () =>
    new Ajv().compile({
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        active: { type: 'boolean' },
      },
      required: ['name', 'age', 'active'],
    }),
  yup: () =>
    yup.object({
      name: yup.string().required(),
      age: yup.number().required(),
      active: yup.boolean().required(),
    }),
}

export const schemas = {
  tox: builders.tox(),
  zod: builders.zod(),
  sup: builders.sup(),
  val: builders.val(),
  ajv: builders.ajv(),
  yup: builders.yup(),
} as Record<LibKey, any>

export const validSubject = { name: 'John', age: 30, active: true }
export const invalidSubjectWrongType = {
  name: 'John',
  age: 'thirty',
  active: true,
}
export const invalidSubjectMissingField = { name: 'John', active: true }
