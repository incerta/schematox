import * as tox from '../../src/index.ts'
import { z } from 'zod'
import * as sup from 'superstruct'
import * as v from 'valibot'
import Ajv from 'ajv'
import * as yup from 'yup'

import type { LibKey } from '../adapters.ts'

// { user: { name: string, age: number }, meta: { createdAt: string, tags: string[] } }

export const builders: Record<LibKey, () => unknown> = {
  tox: () =>
    tox.object({
      user: tox.object({
        name: tox.string(),
        age: tox.number(),
      }),
      meta: tox.object({
        createdAt: tox.string(),
        tags: tox.array(tox.string()),
      }),
    }),
  zod: () =>
    z.object({
      user: z.object({
        name: z.string(),
        age: z.number(),
      }),
      meta: z.object({
        createdAt: z.string(),
        tags: z.array(z.string()),
      }),
    }),
  sup: () =>
    sup.object({
      user: sup.object({
        name: sup.string(),
        age: sup.number(),
      }),
      meta: sup.object({
        createdAt: sup.string(),
        tags: sup.array(sup.string()),
      }),
    }),
  val: () =>
    v.object({
      user: v.object({
        name: v.string(),
        age: v.number(),
      }),
      meta: v.object({
        createdAt: v.string(),
        tags: v.array(v.string()),
      }),
    }),
  ajv: () =>
    new Ajv().compile({
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
          required: ['name', 'age'],
        },
        meta: {
          type: 'object',
          properties: {
            createdAt: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
          },
          required: ['createdAt', 'tags'],
        },
      },
      required: ['user', 'meta'],
    }),
  yup: () =>
    yup.object({
      user: yup.object({
        name: yup.string().required(),
        age: yup.number().required(),
      }),
      meta: yup.object({
        createdAt: yup.string().required(),
        tags: yup.array(yup.string().required()).required(),
      }),
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

export const validSubject = {
  user: { name: 'John', age: 30 },
  meta: { createdAt: '2024-01-01', tags: ['a', 'b', 'c'] },
}

export const invalidSubjectWrongType = {
  user: { name: 'John', age: '30' },
  meta: { createdAt: '2024-01-01', tags: ['a', 'b', 'c'] },
}

export const invalidSubjectMissingField = {
  user: { name: 'John', age: 30 },
  meta: { createdAt: '2024-01-01' },
}
