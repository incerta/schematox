import { left, right } from './utils/fp'
import { ERROR_CODE } from './error'
import { verifyPrimitive } from './verify-primitive'

import type { EitherError } from './utils/fp'
import type { Schema } from './types/compounds'
import type { InvalidSubject, ErrorPath } from './error'
import type { Con_Schema_SubjT } from './types/constructors'

export function validate<T extends Schema>(
  schema: T,
  subject: unknown
): EitherError<InvalidSubject[], Con_Schema_SubjT<T>>

export function validate(
  this: ErrorPath | undefined,
  schema: Schema,
  subject: unknown
): EitherError<InvalidSubject[], unknown> {
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
          path: this || [],
          schema,
          subject,
        },
      ])
    }

    const subjectKeySet = new Set(Object.keys(subject))

    for (const key in schema.of) {
      subjectKeySet.delete(key)

      const nestedValue = (subject as Record<string, unknown>)[key]
      const nestedSchema = schema.of[key] as Schema

      const validated = validate.bind([...(this || []), key])(
        nestedSchema,
        nestedValue
      )

      if (validated.left) {
        validated.left.forEach((err) => errors.push(err))
        continue
      }
    }

    if (errors.length) {
      return left(errors)
    }

    if (subjectKeySet.size !== 0) {
      errors.push({
        code: ERROR_CODE.invalidType,
        subject,
        schema,
        path: this || [],
      })

      return left(errors)
    }

    return right(subject)
  }

  if (schema.type === 'array') {
    if (Array.isArray(subject) === false) {
      return left([
        {
          code: ERROR_CODE.invalidType,
          path: this || [],
          subject,
          schema,
        },
      ])
    }

    for (let i = 0; i < subject.length; i++) {
      const nestedSchema = schema.of
      const nestedValue = subject[i]

      const validated = validate.bind([...(this || []), i])(
        nestedSchema,
        nestedValue
      )

      if (validated.left) {
        validated.left.forEach((err) => errors.push(err))
        continue
      }
    }

    if (errors.length) {
      return left(errors)
    }

    if (
      typeof schema.minLength === 'number' &&
      subject.length < schema.minLength
    ) {
      return left([
        {
          code: ERROR_CODE.invalidRange,
          path: this || [],
          subject,
          schema,
        },
      ])
    }

    if (
      typeof schema.maxLength === 'number' &&
      subject.length > schema.maxLength
    ) {
      return left([
        {
          code: ERROR_CODE.invalidRange,
          path: this || [],
          subject,
          schema,
        },
      ])
    }

    return right(subject)
  }

  if (schema.type === 'union') {
    for (const subSchema of schema.of) {
      if (validate(subSchema, subject).left === undefined) {
        return right(subject)
      }
    }

    return left([
      {
        code: ERROR_CODE.invalidType,
        path: this || [],
        subject,
        schema,
      },
    ])
  }

  const verified = verifyPrimitive(schema, subject)

  if (verified === true) {
    return right(subject)
  }

  return left([
    {
      code: verified,
      path: this || [],
      subject,
      schema,
    },
  ])
}

export function guard<T extends Schema>(
  schema: T,
  subject: unknown
): subject is Con_Schema_SubjT<T> {
  return validate(schema, subject).left === undefined
}
