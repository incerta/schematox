import type { Schema } from './schema'

export type ParseResult<T> = NonNullable<ParseError | ParseSuccess<T>>

export type ErrorCode = 'INVALID_TYPE' | 'INVALID_RANGE'

export type ErrorPath = Array<
  string /* object key */ | number /* array index */
>

export type InvalidSubject = {
  code: ErrorCode
  path: ErrorPath
  schema: Schema
  subject: unknown
}

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
