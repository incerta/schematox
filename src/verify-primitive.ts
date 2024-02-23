import { ERROR_CODE } from './error'

import { ErrorCode } from './error'
import type { PrimitiveSchema } from './types/base-detailed-schema-types'

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
        (typeof subject !== 'string' && typeof subject !== 'number') ||
        subject !== schema.of
      ) {
        return ERROR_CODE.invalidType
      }

      return true
    }
  }
}
