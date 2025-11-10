import type { Schema } from './schema'

export type ParseResult<T> = ParseError | ParseSuccess<T>

export type ParseError = {
  success: false
  error: InvalidSubject[]
  data?: never
}

export type ParseSuccess<T> = {
  success: true
  error?: never
  data: T
}

export type InvalidSubject = {
  code: ErrorCode

  /**
   * Path to the invalid data, represented as an array of object keys (strings)
   * and array indices (numbers) that can be used to navigate to the specific
   * location where validation failed
   **/
  path: ErrorPath

  /**
   * The specific part of the schema definition that was used to validate
   * the subject data (not necessarily the overall schema, but the schema
   * fragment that caused the validation failure)
   **/
  schema: Schema

  /**
   * The specific data value that failed validation (not necessarily the
   * entire input, but the particular piece of data that caused the issue)
   **/
  subject: unknown
}

export type ErrorCode = 'INVALID_TYPE' | 'INVALID_RANGE'

export type ErrorPath = Array<
  string /* object key */ | number /* array index */
>

/**
 * Flattens complex types into their resolved object form
 */
export type PrettifyObject<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K]
} & {}
