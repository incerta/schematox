import type { Schema, BaseSchema } from './types/compound-schema-types'

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE]

export type InvalidSubject = {
  code: ErrorCode
  schema: Schema
  subject: unknown
  path: ErrorPath
}

export type ValidateErrorCode =
  (typeof VALIDATE_ERROR_CODE)[keyof typeof VALIDATE_ERROR_CODE]

export type BaseSchemaValidateError = {
  code: ValidateErrorCode
  schema: BaseSchema
  subject: unknown
}

export type ErrorPath = Array<
  string /* object key */ | number /* array index */
>

export type ValidateError = {
  path: ErrorPath
  schema: Schema
  subject: unknown
}

export const ERROR_CODE = {
  invalidType: 'INVALID_TYPE',
  invalidRange: 'INVALID_RANGE',
}

export const VALIDATE_ERROR_CODE = {
  invalidType: 'INVALID_TYPE',
  NaN: 'NOT_A_NUMBER',
  infinity: 'INFINITY',
  minRange: 'MIN_RANGE',
  maxRange: 'MAX_RANGE',
  notInUnion: 'NOT_IN_UNION',
} as const

export const PROGRAMMATICALLY_DEFINED_ERROR_MSG = {
  optionalDefined: 'Schema "optional" is already defined',
  brandDefined: 'Schema "brand" is already defined',
  minDefined: 'Schema "min" is already defined',
  maxDefined: 'Schema "max" is already defined',
  minLengthDefined: 'Schema "minLength" is already defined',
  maxLengthDefined: 'Schema "maxLength" is already defined',
  descriptionDefined: 'Schema "description" is already defined',
  defaultDefined: 'Schema "default" is already defined',
  defaultNotAllowed: 'Schema "default" is allowed only for optional properties',
} as const
