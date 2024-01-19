import { error, data } from './utils/fp'

import type { Either } from './utils/fp'
import type { BD_String, BD_Number } from './base-detailed-schema-types'
import type { BaseSchema, Con_Schema_SubjT_P } from './compound-schema-types'

export const PARSING_ERROR_CODE = {
  invalidType: 'INVALID_TYPE',
  NaN: 'NOT_A_NUMBER',
  infinity: 'INFINITY',
  minRange: 'MIN_RANGE',
  maxRange: 'MAX_RANGE',
  notInUnion: 'NOT_IN_UNION',
  schemaDefaultMinRange: 'SCHEMA_DEFAULT_MIN_RANGE',
  schemaDefaultMaxRange: 'SCHEMA_DEFAULT_MAX_RANGE',
  schemaDefaultNotInUnion: 'SCHEMA_DEFAULT_NOT_IN_UNION',
} as const

export type ParsingError = {
  code: (typeof PARSING_ERROR_CODE)[keyof typeof PARSING_ERROR_CODE]
  schema: BaseSchema
  subject: unknown
}

export type BaseSchemaSubjectType =
  | string
  | number
  | boolean
  | Buffer
  | undefined

export function parseBaseSchemaSubject<T extends BaseSchema>(
  schema: T,
  schemaSubject: unknown
): Either<ParsingError, Con_Schema_SubjT_P<T>>

export function parseBaseSchemaSubject(
  schema: BaseSchema,
  subject: unknown
): Either<ParsingError, BaseSchemaSubjectType> {
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
            code: PARSING_ERROR_CODE.invalidType,
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
            code: PARSING_ERROR_CODE.invalidType,
            schema,
            subject,
          })
        }

        if (Number.isNaN(subject)) {
          return error({
            code: PARSING_ERROR_CODE.NaN,
            schema,
            subject,
          })
        }

        if (Number.isFinite(subject) === false) {
          return error({
            code: PARSING_ERROR_CODE.infinity,
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
            code: PARSING_ERROR_CODE.invalidType,
            schema,
            subject,
          })
        }

        return data(subject)
      }

      case 'buffer?':
      case 'buffer': {
        if (Buffer.isBuffer(subject) === false) {
          if (subject === null || subject === undefined) {
            if (schema === 'buffer?') {
              return data(undefined)
            }
          }

          return error({
            code: PARSING_ERROR_CODE.invalidType,
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
        if (subject === undefined || subject === null) {
          if (schema.optional) {
            if (typeof schema.default === 'string') {
              const rangeError = getStringRangeError(
                schema,
                schema.default,
                true
              )

              if (rangeError) {
                return error(rangeError)
              }

              return data(schema.default)
            }

            return data(undefined)
          }
        }

        return error({
          code: PARSING_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      const rangeError = getStringRangeError(schema, subject, false)

      if (rangeError) {
        return error(rangeError)
      }

      return data(subject)
    }

    case 'number': {
      if (typeof subject !== 'number') {
        if (subject === undefined || subject === null) {
          if (schema.optional) {
            if (typeof schema.default === 'number') {
              const rangeError = getNumberRangeError(
                schema,
                schema.default,
                true
              )

              if (rangeError) {
                return error(rangeError)
              }

              return data(schema.default)
            }

            return data(undefined)
          }
        }

        return error({
          code: PARSING_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      if (Number.isNaN(subject)) {
        return error({
          code: PARSING_ERROR_CODE.NaN,
          schema,
          subject,
        })
      }

      if (Number.isFinite(subject) === false) {
        return error({
          code: PARSING_ERROR_CODE.infinity,
          schema,
          subject,
        })
      }

      const rangeError = getNumberRangeError(schema, subject, false)

      if (rangeError) {
        return error(rangeError)
      }

      return data(subject)
    }

    case 'boolean': {
      if (typeof subject !== 'boolean') {
        if (subject === undefined || subject === null) {
          if (schema.optional) {
            if (typeof schema.default === 'boolean') {
              return data(schema.default)
            }

            return data(undefined)
          }
        }

        return error({
          code: PARSING_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      return data(subject)
    }

    case 'buffer': {
      if (Buffer.isBuffer(subject) === false) {
        if (subject === undefined || subject === null) {
          if (schema.optional) {
            return data(undefined)
          }
        }

        return error({
          code: PARSING_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      if (typeof schema.minLength === 'number') {
        if (subject.length < schema.minLength) {
          return error({
            code: PARSING_ERROR_CODE.minRange,
            schema,
            subject,
          })
        }
      }

      if (typeof schema.maxLength === 'number') {
        if (subject.length > schema.maxLength) {
          return error({
            code: PARSING_ERROR_CODE.maxRange,
            schema,
            subject,
          })
        }
      }

      return data(subject)
    }

    case 'stringUnion': {
      if (typeof subject !== 'string') {
        if (subject === undefined || subject === null) {
          if (schema.optional) {
            if (typeof schema.default === 'string') {
              const unionSet = new Set(schema.of)

              if (unionSet.has(schema.default) === false) {
                return error({
                  code: PARSING_ERROR_CODE.schemaDefaultNotInUnion,
                  subject: schema.default,
                  schema,
                })
              }

              return data(schema.default)
            }

            return data(undefined)
          }
        }

        return error({
          code: PARSING_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      const unionSet = new Set(schema.of)

      if (unionSet.has(subject) === false) {
        return error({
          code: PARSING_ERROR_CODE.notInUnion,
          schema,
          subject,
        })
      }

      return data(subject)
    }

    case 'numberUnion': {
      if (typeof subject !== 'number') {
        if (subject === undefined || subject === null) {
          if (schema.optional) {
            if (typeof schema.default === 'number') {
              const unionSet = new Set(schema.of)

              if (unionSet.has(schema.default) === false) {
                return error({
                  code: PARSING_ERROR_CODE.schemaDefaultNotInUnion,
                  subject: schema.default,
                  schema,
                })
              }

              return data(schema.default)
            }

            return data(undefined)
          }
        }

        return error({
          code: PARSING_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      const unionSet = new Set(schema.of)

      if (unionSet.has(subject) === false) {
        return error({
          code: PARSING_ERROR_CODE.notInUnion,
          schema,
          subject,
        })
      }

      return data(subject)
    }
  }
}

function getStringRangeError(
  schema: BD_String,
  subject: string,
  isSubjectFromSchemaDefault: boolean
): ParsingError | undefined {
  if (typeof schema.minLength === 'number') {
    if (subject.length < schema.minLength) {
      return {
        code: isSubjectFromSchemaDefault
          ? PARSING_ERROR_CODE.schemaDefaultMinRange
          : PARSING_ERROR_CODE.minRange,
        schema,
        subject,
      }
    }
  }

  if (typeof schema.maxLength === 'number') {
    if (subject.length > schema.maxLength) {
      return {
        code: isSubjectFromSchemaDefault
          ? PARSING_ERROR_CODE.schemaDefaultMaxRange
          : PARSING_ERROR_CODE.maxRange,
        schema,
        subject,
      }
    }
  }
}

function getNumberRangeError(
  schema: BD_Number,
  subject: number,
  isSubjectFromSchemaDefault: boolean
): ParsingError | undefined {
  if (typeof schema.min === 'number') {
    if (subject < schema.min) {
      return {
        code: isSubjectFromSchemaDefault
          ? PARSING_ERROR_CODE.schemaDefaultMinRange
          : PARSING_ERROR_CODE.minRange,
        schema,
        subject,
      }
    }
  }

  if (typeof schema.max === 'number') {
    if (subject > schema.max) {
      return {
        code: isSubjectFromSchemaDefault
          ? PARSING_ERROR_CODE.schemaDefaultMaxRange
          : PARSING_ERROR_CODE.maxRange,
        schema,
        subject,
      }
    }
  }
}
