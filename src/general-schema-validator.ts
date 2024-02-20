import { error, data } from './utils/fp'
import { ERROR_CODE } from './error'
import { validateBaseSchemaSubject } from './base-schema-validator'

import type { EitherError } from './utils/fp'
import type { Schema, Con_Schema_SubjT_V } from './types/compound-schema-types'
import type { InvalidSubject, ErrorPath } from './error'

export function validate<T extends Schema>(
  schema: T,
  subject: unknown
): EitherError<InvalidSubject[], Con_Schema_SubjT_V<T>>

export function validate(
  this: ErrorPath | undefined,
  schema: Schema,
  subject: unknown
): EitherError<InvalidSubject[], unknown> {
  const errors: InvalidSubject[] = []

  if (schema.type === 'object') {
    if (schema.optional && subject === undefined) {
      return data(undefined)
    }

    if (
      typeof subject !== 'object' ||
      subject === null ||
      subject.constructor !== Object
    ) {
      return error([
        {
          code: ERROR_CODE.invalidType,
          path: this || [],
          schema,
          subject,
        },
      ])
    }

    for (const key in schema.of) {
      // @ts-expect-error typescript is not smart enough here, or am I?
      const nestedValue = subject[key]
      const nestedSchema = schema.of[key] as Schema

      const validated = validate.bind([...(this || []), key])(
        nestedSchema,
        nestedValue
      )

      if (validated.error) {
        validated.error.forEach((err) => errors.push(err))
        continue
      }
    }

    if (errors.length) {
      return error(errors)
    }

    return data(subject)
  }

  if (schema.type === 'array') {
    if (Array.isArray(subject) === false) {
      if (schema.optional && subject === undefined) {
        return data(undefined)
      }

      return error([
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

      if (validated.error) {
        validated.error.forEach((err) => errors.push(err))
        continue
      }
    }

    if (errors.length) {
      return error(errors)
    }

    if (
      typeof schema.minLength === 'number' &&
      subject.length < schema.minLength
    ) {
      return error([
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
      return error([
        {
          code: ERROR_CODE.invalidRange,
          path: this || [],
          subject,
          schema,
        },
      ])
    }

    return data(subject)
  }

  if (schema.type === 'union') {
    if (schema.optional) {
      if (subject === undefined) {
        return data(undefined)
      }
    }

    for (const subSchema of schema.of) {
      if (validate(subSchema, subject).error === undefined) {
        return data(subject)
      }
    }

    return error([
      {
        code: ERROR_CODE.invalidType,
        path: this || [],
        subject,
        schema,
      },
    ])
  }

  const validated = validateBaseSchemaSubject.bind(this)(schema, subject)

  if (validated.error) {
    return error([validated.error])
  }

  return data(subject)
}

export function guard<T extends Schema>(
  schema: T,
  subject: unknown
): subject is Con_Schema_SubjT_V<T> {
  return validate(schema, subject).error === undefined
}

export function assert<T extends Schema>(
  schema: T,
  subject: unknown
): asserts subject is Con_Schema_SubjT_V<T> {
  const { error } = validate(schema, subject)

  if (error !== undefined) {
    throw error
  }
}
