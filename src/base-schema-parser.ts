import { error, data } from './utils/fp'
import { ERROR_CODE } from './error'

import type { EitherError } from './utils/fp'
import type {
  BaseSchema,
  Con_Schema_SubjT_V,
} from './types/compound-schema-types'
import type { InvalidSubject, ErrorPath } from './error'

export type BaseSchemaSubjectType = string | number | boolean | undefined

export function parseBaseSchemaSubject<T extends BaseSchema>(
  this: ErrorPath | void,
  schema: T,
  schemaSubject: unknown
): EitherError<InvalidSubject, Con_Schema_SubjT_V<T>>

export function parseBaseSchemaSubject(
  this: ErrorPath | void,
  schema: BaseSchema,
  subject: unknown
): EitherError<InvalidSubject, BaseSchemaSubjectType> {
  if (schema.optional) {
    if (subject === null || subject === undefined) {
      return data(undefined)
    }
  }

  switch (schema.type) {
    case 'string': {
      if (typeof subject !== 'string') {
        return error({
          code: ERROR_CODE.invalidType,
          subject: subject,
          path: this || [],
          schema,
        })
      }

      if (typeof schema.minLength === 'number') {
        if (subject.length < schema.minLength) {
          return error({
            code: ERROR_CODE.invalidRange,
            subject: subject,
            path: this || [],
            schema,
          })
        }
      }

      if (typeof schema.maxLength === 'number') {
        if (subject.length > schema.maxLength) {
          return error({
            code: ERROR_CODE.invalidRange,
            subject: subject,
            path: this || [],
            schema,
          })
        }
      }

      return data(subject)
    }

    case 'number': {
      if (typeof subject !== 'number') {
        return error({
          code: ERROR_CODE.invalidType,
          subject: subject,
          path: this || [],
          schema,
        })
      }

      if (Number.isFinite(subject) === false) {
        return error({
          code: ERROR_CODE.invalidType,
          subject: subject,
          path: this || [],
          schema,
        })
      }

      if (typeof schema.min === 'number') {
        if (subject < schema.min) {
          return error({
            code: ERROR_CODE.invalidRange,
            subject: subject,
            path: this || [],
            schema,
          })
        }
      }

      if (typeof schema.max === 'number') {
        if (subject > schema.max) {
          return error({
            code: ERROR_CODE.invalidRange,
            subject: subject,
            path: this || [],
            schema,
          })
        }
      }

      return data(subject)
    }

    case 'boolean': {
      if (typeof subject !== 'boolean') {
        return error({
          code: ERROR_CODE.invalidType,
          subject: subject,
          path: this || [],
          schema,
        })
      }

      return data(subject)
    }

    case 'stringUnion': {
      if (typeof subject !== 'string') {
        return error({
          code: ERROR_CODE.invalidType,
          subject: subject,
          path: this || [],
          schema,
        })
      }

      const unionSet = new Set(schema.of)

      if (unionSet.has(subject) === false) {
        return error({
          code: ERROR_CODE.invalidType,
          subject: subject,
          path: this || [],
          schema,
        })
      }

      return data(subject)
    }

    case 'numberUnion': {
      if (typeof subject !== 'number') {
        return error({
          code: ERROR_CODE.invalidType,
          subject: subject,
          path: this || [],
          schema,
        })
      }

      const unionSet = new Set(schema.of)

      if (unionSet.has(subject) === false) {
        return error({
          code: ERROR_CODE.invalidType,
          subject: subject,
          path: this || [],
          schema,
        })
      }

      return data(subject)
    }

    case 'literal': {
      if (
        (typeof subject !== 'string' && typeof subject !== 'number') ||
        subject !== schema.of
      ) {
        return error({
          code: ERROR_CODE.invalidType,
          subject: subject,
          path: this || [],
          schema,
        })
      }

      return data(subject)
    }
  }
}
