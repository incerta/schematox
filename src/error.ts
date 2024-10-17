import type { Schema } from './types/compounds'

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE]

export type InvalidSubject = {
  code: ErrorCode
  schema: Schema
  subject: unknown
  path: ErrorPath
}

export type ParsingError = InvalidSubject[]

export type ErrorPath = Array<
  string /* object key */ | number /* array index */
>

export const ERROR_CODE = {
  invalidType: 'INVALID_TYPE',
  invalidRange: 'INVALID_RANGE',
} as const
