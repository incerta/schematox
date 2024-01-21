import { error, data } from './utils/fp'
import { VALIDATE_ERROR_CODE } from './error'

import type { EitherError } from './utils/fp'
import type { BaseSchema, Con_Schema_SubjT_V } from './compound-schema-types'
import type { ValidatingError } from './error'

export type BaseSchemaSubjectType =
  | string
  | number
  | boolean
  | Buffer
  | undefined

export function validateBaseSchemaSubject<T extends BaseSchema>(
  schema: T,
  schemaSubject: unknown
): EitherError<ValidatingError, Con_Schema_SubjT_V<T>>

export function validateBaseSchemaSubject(
  schema: BaseSchema,
  subject: unknown
): EitherError<ValidatingError, BaseSchemaSubjectType> {
  if (typeof schema === 'string') {
    switch (schema) {
      case 'string?':
      case 'string': {
        if (typeof subject !== 'string') {
          if (subject === undefined && schema === 'string?') {
            return data(undefined)
          }

          return error({
            code: VALIDATE_ERROR_CODE.invalidType,
            schema,
            subject,
          })
        }

        return data(subject)
      }

      case 'number?':
      case 'number': {
        if (typeof subject !== 'number') {
          if (subject === undefined && schema === 'number?') {
            return data(undefined)
          }

          return error({
            code: VALIDATE_ERROR_CODE.invalidType,
            schema,
            subject,
          })
        }

        if (Number.isNaN(subject)) {
          return error({
            code: VALIDATE_ERROR_CODE.NaN,
            schema,
            subject,
          })
        }

        if (Number.isFinite(subject) === false) {
          return error({
            code: VALIDATE_ERROR_CODE.infinity,
            schema,
            subject,
          })
        }

        return data(subject)
      }

      case 'boolean?':
      case 'boolean': {
        if (typeof subject !== 'boolean') {
          if (subject === undefined && schema === 'boolean?') {
            return data(undefined)
          }

          return error({
            code: VALIDATE_ERROR_CODE.invalidType,
            schema,
            subject,
          })
        }

        return data(subject)
      }

      case 'buffer?':
      case 'buffer': {
        if (Buffer.isBuffer(subject) === false) {
          if (subject === undefined && schema === 'buffer?') {
            return data(undefined)
          }

          return error({
            code: VALIDATE_ERROR_CODE.invalidType,
            schema,
            subject,
          })
        }

        return data(subject)
      }
    }
  }

  switch (schema.type) {
    case 'string': {
      if (typeof subject !== 'string') {
        if (subject === undefined && schema.optional) {
          return data(undefined)
        }

        return error({
          code: VALIDATE_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      if (typeof schema.minLength === 'number') {
        if (subject.length < schema.minLength) {
          return error({
            code: VALIDATE_ERROR_CODE.minRange,
            schema,
            subject,
          })
        }
      }

      if (typeof schema.maxLength === 'number') {
        if (subject.length > schema.maxLength) {
          return error({
            code: VALIDATE_ERROR_CODE.maxRange,
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
          code: VALIDATE_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      if (Number.isNaN(subject)) {
        return error({
          code: VALIDATE_ERROR_CODE.NaN,
          schema,
          subject,
        })
      }

      if (Number.isFinite(subject) === false) {
        return error({
          code: VALIDATE_ERROR_CODE.infinity,
          schema,
          subject,
        })
      }

      if (typeof schema.min === 'number') {
        if (subject < schema.min) {
          return error({
            code: VALIDATE_ERROR_CODE.minRange,
            schema,
            subject,
          })
        }
      }

      if (typeof schema.max === 'number') {
        if (subject > schema.max) {
          return error({
            code: VALIDATE_ERROR_CODE.maxRange,
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
          code: VALIDATE_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      return data(subject)
    }

    case 'buffer': {
      if (Buffer.isBuffer(subject) === false) {
        if (subject === undefined && schema.optional) {
          return data(undefined)
        }

        return error({
          code: VALIDATE_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      if (typeof schema.minLength === 'number') {
        if (subject.length < schema.minLength) {
          return error({
            code: VALIDATE_ERROR_CODE.minRange,
            schema,
            subject,
          })
        }
      }

      if (typeof schema.maxLength === 'number') {
        if (subject.length > schema.maxLength) {
          return error({
            code: VALIDATE_ERROR_CODE.maxRange,
            schema,
            subject,
          })
        }
      }

      return data(subject)
    }

    case 'stringUnion': {
      if (typeof subject !== 'string') {
        if (subject === undefined && schema.optional) {
          return data(undefined)
        }

        return error({
          code: VALIDATE_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      const unionSet = new Set(schema.of)

      if (unionSet.has(subject) === false) {
        return error({
          code: VALIDATE_ERROR_CODE.notInUnion,
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
          code: VALIDATE_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      const unionSet = new Set(schema.of)

      if (unionSet.has(subject) === false) {
        return error({
          code: VALIDATE_ERROR_CODE.notInUnion,
          schema,
          subject,
        })
      }

      return data(subject)
    }
  }
}
