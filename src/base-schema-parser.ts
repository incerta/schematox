import { error, data } from './utils/fp'
import { ERROR_CODE } from './error'

import type { EitherError } from './utils/fp'
import type {
  BaseSchema,
  Con_Schema_SubjT_P,
} from './types/compound-schema-types'
import type { InvalidSubject, ErrorPath } from './error'

export type BaseSchemaSubjectType = string | number | boolean | undefined

export function parseBaseSchemaSubject<T extends BaseSchema>(
  this: ErrorPath | void,
  schema: T,
  schemaSubject: unknown
): EitherError<InvalidSubject, Con_Schema_SubjT_P<T>>

export function parseBaseSchemaSubject(
  this: ErrorPath | void,
  schema: BaseSchema,
  subject: unknown
): EitherError<InvalidSubject, BaseSchemaSubjectType> {
  if (typeof schema === 'string') {
    switch (schema) {
      case 'string?':
      case 'string': {
        if (typeof subject !== 'string') {
          if (subject === null || subject === undefined) {
            if (schema === 'string?') {
              return data(undefined)
            }
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

      case 'number?':
      case 'number': {
        if (typeof subject !== 'number') {
          if (subject === null || subject === undefined) {
            if (schema === 'number?') {
              return data(undefined)
            }
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

        return data(subject)
      }

      case 'boolean?':
      case 'boolean': {
        if (typeof subject !== 'boolean') {
          if (subject === null || subject === undefined) {
            if (schema === 'boolean?') {
              return data(undefined)
            }
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
    }
  }

  const updatedSubject =
    typeof schema.default !== undefined &&
    schema.optional &&
    (subject === null || subject === undefined)
      ? schema.default
      : subject

  if (schema.optional) {
    if (updatedSubject === null || updatedSubject === undefined) {
      return data(undefined)
    }
  }

  switch (schema.type) {
    case 'string': {
      if (typeof updatedSubject !== 'string') {
        return error({
          code: ERROR_CODE.invalidType,
          subject: updatedSubject,
          path: this || [],
          schema,
        })
      }

      if (typeof schema.minLength === 'number') {
        if (updatedSubject.length < schema.minLength) {
          return error({
            code: ERROR_CODE.invalidRange,
            subject: updatedSubject,
            path: this || [],
            schema,
          })
        }
      }

      if (typeof schema.maxLength === 'number') {
        if (updatedSubject.length > schema.maxLength) {
          return error({
            code: ERROR_CODE.invalidRange,
            subject: updatedSubject,
            path: this || [],
            schema,
          })
        }
      }

      return data(updatedSubject)
    }

    case 'number': {
      if (typeof updatedSubject !== 'number') {
        return error({
          code: ERROR_CODE.invalidType,
          subject: updatedSubject,
          path: this || [],
          schema,
        })
      }

      if (Number.isFinite(updatedSubject) === false) {
        return error({
          code: ERROR_CODE.invalidType,
          subject: updatedSubject,
          path: this || [],
          schema,
        })
      }

      if (typeof schema.min === 'number') {
        if (updatedSubject < schema.min) {
          return error({
            code: ERROR_CODE.invalidRange,
            subject: updatedSubject,
            path: this || [],
            schema,
          })
        }
      }

      if (typeof schema.max === 'number') {
        if (updatedSubject > schema.max) {
          return error({
            code: ERROR_CODE.invalidRange,
            subject: updatedSubject,
            path: this || [],
            schema,
          })
        }
      }

      return data(updatedSubject)
    }

    case 'boolean': {
      if (typeof updatedSubject !== 'boolean') {
        return error({
          code: ERROR_CODE.invalidType,
          subject: updatedSubject,
          path: this || [],
          schema,
        })
      }

      return data(updatedSubject)
    }

    case 'stringUnion': {
      if (typeof updatedSubject !== 'string') {
        return error({
          code: ERROR_CODE.invalidType,
          subject: updatedSubject,
          path: this || [],
          schema,
        })
      }

      const unionSet = new Set(schema.of)

      if (unionSet.has(updatedSubject) === false) {
        return error({
          code: ERROR_CODE.invalidType,
          subject: updatedSubject,
          path: this || [],
          schema,
        })
      }

      return data(updatedSubject)
    }

    case 'numberUnion': {
      if (typeof updatedSubject !== 'number') {
        return error({
          code: ERROR_CODE.invalidType,
          subject: updatedSubject,
          path: this || [],
          schema,
        })
      }

      const unionSet = new Set(schema.of)

      if (unionSet.has(updatedSubject) === false) {
        return error({
          code: ERROR_CODE.invalidType,
          subject: updatedSubject,
          path: this || [],
          schema,
        })
      }

      return data(updatedSubject)
    }
  }
}
