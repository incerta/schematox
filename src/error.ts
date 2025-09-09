import type { Schema } from './types/compounds'

export type InvalidSubject = {
  code: ErrorCode
  path: ErrorPath
  schema: Schema
  subject: unknown
}

export type ErrorPath = Array<
  string /* object key */ | number /* array index */
>

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE]

export const ERROR_CODE = {
  invalidType: 'INVALID_TYPE',
  invalidRange: 'INVALID_RANGE',
} as const
