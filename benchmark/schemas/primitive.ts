import * as tox from '../../src/index.ts'
import { z } from 'zod'
import * as sup from 'superstruct'
import * as v from 'valibot'
import Ajv from 'ajv'
import * as yup from 'yup'

import type { LibKey } from '../adapters.ts'

// A string with a minLength constraint, present in every library's API.

export const builders: Record<LibKey, () => unknown> = {
  tox: () => tox.string().minLength(3),
  zod: () => z.string().min(3),
  sup: () => sup.size(sup.string(), 3, Infinity),
  val: () => v.pipe(v.string(), v.minLength(3)),
  ajv: () => new Ajv().compile({ type: 'string', minLength: 3 }),
  yup: () => yup.string().min(3),
}

export const schemas = {
  tox: builders.tox(),
  zod: builders.zod(),
  sup: builders.sup(),
  val: builders.val(),
  ajv: builders.ajv(),
  yup: builders.yup(),
} as Record<LibKey, any>

export const validSubject = 'hello world'
export const invalidSubjectWrongType = 42
export const invalidSubjectTooShort = 'ab'
