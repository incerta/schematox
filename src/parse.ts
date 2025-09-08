import { ERROR_CODE } from './error'
import { left, right, verifyPrimitive, makeErrorPath } from './utils'

import type { InvalidSubject, ErrorPath, ParsingError } from './error'
import type { Either } from './types/utils'
import type { Schema } from './types/compounds'
import type { Con_Schema_SubjT } from './types/constructors'

export function parse<T extends Schema>(
  schema: T,
  subject: unknown
): Either<ParsingError, Con_Schema_SubjT<T>>

export function parse(
  this: ErrorPath | unknown,
  schema: Schema,
  subject: unknown
): Either<ParsingError, unknown> {
  const errors: InvalidSubject[] = []

  if (schema.optional === true && subject === undefined) {
    return right(undefined)
  }

  if (schema.nullable === true && subject === null) {
    return right(null)
  }

  if (schema.type === 'object') {
    if (
      typeof subject !== 'object' ||
      subject === null ||
      subject.constructor !== Object
    ) {
      return left([
        {
          code: ERROR_CODE.invalidType,
          path: makeErrorPath(this),
          schema,
          subject,
        },
      ])
    }

    const result: Record<string, unknown> = {}

    for (const key in schema.of) {
      const narrowedSubj = subject as Record<string, unknown>
      const nestedSchema = schema.of[key] as Schema
      const nestedValue = narrowedSubj[key]

      const parsed = parse.bind(makeErrorPath(this, key))(
        nestedSchema,
        nestedValue
      )

      if (parsed.left) {
        parsed.left.forEach((err) => errors.push(err))
        continue
      }

      if (Object.prototype.hasOwnProperty.call(narrowedSubj, key)) {
        result[key] = parsed.right
      }
    }

    if (errors.length) {
      return left(errors)
    }

    return right(result)
  }

  if (schema.type === 'record') {
    if (
      typeof subject !== 'object' ||
      subject === null ||
      subject.constructor !== Object
    ) {
      return left([
        {
          code: ERROR_CODE.invalidType,
          path: makeErrorPath(this),
          schema,
          subject,
        },
      ])
    }

    const result: Record<string, unknown> = {}

    for (const key in subject) {
      const nestedValue = (subject as Record<string, unknown>)[key]

      if (nestedValue === undefined) {
        continue
      }

      const parsed = parse.bind(makeErrorPath(this, key))(
        schema.of,
        nestedValue
      )

      if (parsed.left) {
        parsed.left.forEach((err) => errors.push(err))
        continue
      }

      result[key] = parsed.right
    }

    if (errors.length) {
      return left(errors)
    }

    return right(result)
  }

  if (schema.type === 'array') {
    if (Array.isArray(subject) === false) {
      return left([
        {
          code: ERROR_CODE.invalidType,
          path: makeErrorPath(this),
          subject,
          schema,
        },
      ])
    }

    const result: unknown[] = []

    for (let i = 0; i < subject.length; i++) {
      const nestedSchema = schema.of
      const nestedValue = subject[i]

      const parsed = parse.bind(makeErrorPath(this, i))(
        nestedSchema,
        nestedValue
      )

      if (parsed.left) {
        parsed.left.forEach((err) => errors.push(err))
        continue
      }

      result.push(parsed.right)
    }

    if (errors.length) {
      return left(errors)
    }

    if (
      typeof schema.minLength === 'number' &&
      result.length < schema.minLength
    ) {
      return left([
        {
          code: ERROR_CODE.invalidRange,
          path: makeErrorPath(this),
          subject,
          schema,
        },
      ])
    }

    if (
      typeof schema.maxLength === 'number' &&
      result.length > schema.maxLength
    ) {
      return left([
        {
          code: ERROR_CODE.invalidRange,
          path: makeErrorPath(this),
          subject,
          schema,
        },
      ])
    }

    return right(result)
  }

  if (schema.type === 'union') {
    for (const subSchema of schema.of) {
      const parsed = parse(subSchema, subject)

      if (parsed.left === undefined) {
        return right(parsed.right)
      }
    }

    return left([
      {
        code: ERROR_CODE.invalidType,
        path: makeErrorPath(this),
        subject,
        schema,
      },
    ])
  }

  const errorCodeOrTrue = verifyPrimitive(schema, subject)

  if (errorCodeOrTrue !== true) {
    return left([
      {
        code: errorCodeOrTrue,
        path: makeErrorPath(this),
        subject,
        schema,
      },
    ])
  }

  return right(subject)
}
