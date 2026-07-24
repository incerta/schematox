import type { Schema } from './schema.ts'

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

  /** Path to the invalid data: object keys and array indices from the root */
  path: ErrorPath

  /** The schema fragment that the invalid data failed to satisfy */
  schema: Schema
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
