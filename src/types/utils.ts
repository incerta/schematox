import type { Schema } from './schema.ts'

export type ParseOptions = {
  /**
   * Attempt to convert the subject to the schema's target type before
   * validating it — e.g. the string `"42"` becomes the number `42` for a
   * `number` schema. Off by default. Only a fixed set of unambiguous
   * conversions between `bigint`/`boolean`/`number`/`string` are attempted;
   * a failed or inapplicable conversion silently falls through to the
   * subject as-is, so validation reports the same INVALID_TYPE error it
   * would without coercion. Compound schemas (array/object/record/tuple/
   * union), `literal`, and `unknown` are never coerced themselves — the
   * flag still reaches their coercible descendants.
   **/
  coerce?: boolean
}

export type ParseResult<T> = ParseError | ParseSuccess<T>

export type ParseError = {
  success: false
  /** Length > 1 only for object/record/array/tuple — see README's Error Shape section */
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

export type ErrorCode =
  'INVALID_TYPE' | 'INVALID_RANGE' | 'INVALID_UNION' | 'INVALID_SCHEMA'

export type ErrorPath = Array<
  string /* object key */ | number /* array index */
>

/**
 * Flattens complex types into their resolved object form
 */
export type PrettifyObject<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K]
} & {}
