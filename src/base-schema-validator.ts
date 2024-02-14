import { error, data } from './utils/fp'
import { ERROR_CODE } from './error'

import type { EitherError } from './utils/fp'
import type {
  BaseSchema,
  Con_Schema_SubjT_V,
} from './types/compound-schema-types'
import type { InvalidSubject, ErrorPath } from './error'

export type BaseSchemaSubjectType = string | number | boolean | undefined

export function validateBaseSchemaSubject<T extends BaseSchema>(
  this: ErrorPath | void,
  schema: T,
  schemaSubject: unknown
): EitherError<InvalidSubject, Con_Schema_SubjT_V<T>>

export function validateBaseSchemaSubject(
  this: ErrorPath | void,
  schema: BaseSchema,
  subject: unknown
): EitherError<InvalidSubject, BaseSchemaSubjectType> {
  switch (schema.type) {
    case 'string': {
      if (typeof subject !== 'string') {
        if (subject === undefined && schema.optional) {
          return data(undefined)
        }

        return error({
          code: ERROR_CODE.invalidType,
          path: this || [],
          schema,
          subject,
        })
      }

      if (typeof schema.minLength === 'number') {
        if (subject.length < schema.minLength) {
          return error({
            code: ERROR_CODE.invalidRange,
            path: this || [],
            schema,
            subject,
          })
        }
      }

      if (typeof schema.maxLength === 'number') {
        if (subject.length > schema.maxLength) {
          return error({
            code: ERROR_CODE.invalidRange,
            path: this || [],
            schema,
            subject,
          })
        }
      }

      return data(subject)
    }

    case 'number': {
      if (typeof subject !== 'number') {
        if (subject === undefined && schema.optional) {
          return data(undefined)
        }

        return error({
          code: ERROR_CODE.invalidType,
          path: this || [],
          schema,
          subject,
        })
      }

      if (Number.isFinite(subject) === false) {
        return error({
          code: ERROR_CODE.invalidType,
          path: this || [],
          schema,
          subject,
        })
      }

      if (typeof schema.min === 'number') {
        if (subject < schema.min) {
          return error({
            code: ERROR_CODE.invalidRange,
            path: this || [],
            schema,
            subject,
          })
        }
      }

      if (typeof schema.max === 'number') {
        if (subject > schema.max) {
          return error({
            code: ERROR_CODE.invalidRange,
            path: this || [],
            schema,
            subject,
          })
        }
      }

      return data(subject)
    }

    case 'boolean': {
      if (typeof subject !== 'boolean') {
        if (subject === undefined && schema.optional) {
          return data(undefined)
        }

        return error({
          code: ERROR_CODE.invalidType,
          path: this || [],
          schema,
          subject,
        })
      }

      return data(subject)
    }

    case 'stringUnion': {
      if (typeof subject !== 'string') {
        if (subject === undefined && schema.optional) {
          return data(undefined)
        }

        return error({
          code: ERROR_CODE.invalidType,
          path: this || [],
          schema,
          subject,
        })
      }

      const unionSet = new Set(schema.of)

      if (unionSet.has(subject) === false) {
        return error({
          code: ERROR_CODE.invalidType,
          path: this || [],
          schema,
          subject,
        })
      }

      return data(subject)
    }

    case 'numberUnion': {
      if (typeof subject !== 'number') {
        if (subject === undefined && schema.optional) {
          return data(undefined)
        }

        return error({
          code: ERROR_CODE.invalidType,
          path: this || [],
          schema,
          subject,
        })
      }

      const unionSet = new Set(schema.of)

      if (unionSet.has(subject) === false) {
        return error({
          code: ERROR_CODE.invalidType,
          path: this || [],
          schema,
          subject,
        })
      }

      return data(subject)
    }
  }
}
