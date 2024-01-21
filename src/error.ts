import type { Schema } from './compound-schema-types'

export type ParsingError = {
  code: (typeof PARSE_ERROR_CODE)[keyof typeof PARSE_ERROR_CODE]
  schema: Schema
  subject: unknown
}

export type ValidatingError = {
  code: (typeof VALIDATE_ERROR_CODE)[keyof typeof VALIDATE_ERROR_CODE]
  schema: Schema
  subject: unknown
}

export type ErrorPath = Array<
  string /* object key */ | number /* array index */
>

export type GeneralParsingError = ParsingError & {
  path: ErrorPath
}

export const PARSE_ERROR_CODE = {
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

export const VALIDATE_ERROR_CODE = {
  invalidType: 'INVALID_TYPE',
  NaN: 'NOT_A_NUMBER',
  infinity: 'INFINITY',
  minRange: 'MIN_RANGE',
  maxRange: 'MAX_RANGE',
  notInUnion: 'NOT_IN_UNION',
} as const
