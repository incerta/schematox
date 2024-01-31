import { error, data } from './utils/fp'
import { PARSE_ERROR_CODE } from './error'

import type { EitherError } from './utils/fp'
import type { BD_String, BD_Number } from './types/base-detailed-schema-types'
import type {
  BaseSchema,
  Con_Schema_SubjT_P,
} from './types/compound-schema-types'
import type { BaseSchemaParseError } from './error'

export type BaseSchemaSubjectType = string | number | boolean | undefined

export function parseBaseSchemaSubject<T extends BaseSchema>(
  schema: T,
  schemaSubject: unknown
): EitherError<BaseSchemaParseError, Con_Schema_SubjT_P<T>>

export function parseBaseSchemaSubject(
  schema: BaseSchema,
  subject: unknown
): EitherError<BaseSchemaParseError, BaseSchemaSubjectType> {
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
            code: PARSE_ERROR_CODE.invalidType,
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
            code: PARSE_ERROR_CODE.invalidType,
            schema,
            subject,
          })
        }

        if (Number.isNaN(subject)) {
          return error({
            code: PARSE_ERROR_CODE.NaN,
            schema,
            subject,
          })
        }

        if (Number.isFinite(subject) === false) {
          return error({
            code: PARSE_ERROR_CODE.infinity,
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
            code: PARSE_ERROR_CODE.invalidType,
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
          code: PARSE_ERROR_CODE.invalidType,
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
          code: PARSE_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      if (Number.isNaN(subject)) {
        return error({
          code: PARSE_ERROR_CODE.NaN,
          schema,
          subject,
        })
      }

      if (Number.isFinite(subject) === false) {
        return error({
          code: PARSE_ERROR_CODE.infinity,
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
          code: PARSE_ERROR_CODE.invalidType,
          schema,
          subject,
        })
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
                  code: PARSE_ERROR_CODE.schemaDefaultNotInUnion,
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
          code: PARSE_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      const unionSet = new Set(schema.of)

      if (unionSet.has(subject) === false) {
        return error({
          code: PARSE_ERROR_CODE.notInUnion,
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
                  code: PARSE_ERROR_CODE.schemaDefaultNotInUnion,
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
          code: PARSE_ERROR_CODE.invalidType,
          schema,
          subject,
        })
      }

      const unionSet = new Set(schema.of)

      if (unionSet.has(subject) === false) {
        return error({
          code: PARSE_ERROR_CODE.notInUnion,
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
): BaseSchemaParseError | undefined {
  if (typeof schema.minLength === 'number') {
    if (subject.length < schema.minLength) {
      return {
        code: isSubjectFromSchemaDefault
          ? PARSE_ERROR_CODE.schemaDefaultMinRange
          : PARSE_ERROR_CODE.minRange,
        schema,
        subject,
      }
    }
  }

  if (typeof schema.maxLength === 'number') {
    if (subject.length > schema.maxLength) {
      return {
        code: isSubjectFromSchemaDefault
          ? PARSE_ERROR_CODE.schemaDefaultMaxRange
          : PARSE_ERROR_CODE.maxRange,
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
): BaseSchemaParseError | undefined {
  if (typeof schema.min === 'number') {
    if (subject < schema.min) {
      return {
        code: isSubjectFromSchemaDefault
          ? PARSE_ERROR_CODE.schemaDefaultMinRange
          : PARSE_ERROR_CODE.minRange,
        schema,
        subject,
      }
    }
  }

  if (typeof schema.max === 'number') {
    if (subject > schema.max) {
      return {
        code: isSubjectFromSchemaDefault
          ? PARSE_ERROR_CODE.schemaDefaultMaxRange
          : PARSE_ERROR_CODE.maxRange,
        schema,
        subject,
      }
    }
  }
}
