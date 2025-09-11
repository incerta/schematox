import { ERROR_CODE } from './constants'

import type { PrimitiveSchema } from './types/primitives'
import type {
  ParseError,
  ParseSuccess,
  ErrorCode,
  ErrorPath,
  InvalidSubject,
} from './types/utils'

/**
 * Type equivalence check utility
 * @example tCh<TypeA, TypeB>(); tCh<TypeB, TypeA>()
 **/
export const tCh = <T, U extends T = T>(...x: T[]): U[] => x as U[]

export const error = (error: InvalidSubject[]): ParseError => ({
  success: false,
  error,
})

export const data = <T>(data: T): ParseSuccess<T> => ({ success: true, data })

export function verifyPrimitive(
  schema: PrimitiveSchema,
  subject: unknown
): true | ErrorCode {
  if (schema.optional === true && subject === undefined) {
    return true
  }

  if (schema.nullable === true && subject === null) {
    return true
  }

  switch (schema.type) {
    case 'string': {
      if (typeof subject !== 'string') {
        return ERROR_CODE.invalidType
      }

      if (typeof schema.minLength === 'number') {
        if (subject.length < schema.minLength) {
          return ERROR_CODE.invalidRange
        }
      }

      if (typeof schema.maxLength === 'number') {
        if (subject.length > schema.maxLength) {
          return ERROR_CODE.invalidRange
        }
      }

      return true
    }

    case 'number': {
      if (typeof subject !== 'number') {
        return ERROR_CODE.invalidType
      }

      if (Number.isFinite(subject) === false) {
        return ERROR_CODE.invalidType
      }

      if (typeof schema.min === 'number') {
        if (subject < schema.min) {
          return ERROR_CODE.invalidRange
        }
      }

      if (typeof schema.max === 'number') {
        if (subject > schema.max) {
          return ERROR_CODE.invalidRange
        }
      }

      return true
    }

    case 'boolean': {
      if (typeof subject !== 'boolean') {
        return ERROR_CODE.invalidType
      }

      return true
    }

    case 'literal': {
      if (
        (typeof subject !== 'string' &&
          typeof subject !== 'number' &&
          typeof subject !== 'boolean') ||
        subject !== schema.of
      ) {
        return ERROR_CODE.invalidType
      }

      return true
    }
  }
}

export function makeErrorPath(
  parentPath: ErrorPath | unknown,
  keyOrIndex?: number | string
): ErrorPath {
  const pathUpdate = Array.isArray(parentPath) ? [...parentPath] : []

  if (keyOrIndex !== undefined) {
    pathUpdate.push(keyOrIndex)
  }

  return pathUpdate
}
