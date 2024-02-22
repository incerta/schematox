import { error, data } from './utils/fp'
import { ERROR_CODE } from './error'
import { verifyPrimitive } from './verify-primitive'

import type { EitherError } from './utils/fp'
import type { Schema, Con_Schema_SubjT_V } from './types/compound-schema-types'
import type { InvalidSubject, ErrorPath } from './error'

export function parse<T extends Schema>(
  schema: T,
  subject: unknown
): EitherError<InvalidSubject[], Con_Schema_SubjT_V<T>>

export function parse(
  this: ErrorPath | void,
  schema: Schema,
  subject: unknown
): EitherError<InvalidSubject[], unknown> {
  const errors: InvalidSubject[] = []

  if (schema.optional === true && subject === undefined) {
    return data(undefined)
  }

  if (schema.nullable === true && subject === null) {
    return data(null)
  }

  if (schema.type === 'object') {
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

    const result: Record<string, unknown> = {}

    for (const key in schema.of) {
      const nestedSchema = schema.of[key] as Schema
      const nestedValue = (subject as Record<string, unknown>)[key]

      const parsed = parse.bind([...(this || []), key])(
        nestedSchema,
        nestedValue
      )

      if (parsed.error) {
        parsed.error.forEach((err) => errors.push(err))
        continue
      }

      result[key] = parsed.data
    }

    if (errors.length) {
      return error(errors)
    }

    return data(result)
  }

  if (schema.type === 'array') {
    if (Array.isArray(subject) === false) {
      return error([
        {
          code: ERROR_CODE.invalidType,
          path: this || [],
          subject,
          schema,
        },
      ])
    }

    const result: unknown[] = []

    for (let i = 0; i < subject.length; i++) {
      const nestedSchema = schema.of
      const nestedValue = subject[i]

      const parsed = parse.bind([...(this || []), i])(nestedSchema, nestedValue)

      if (parsed.error) {
        parsed.error.forEach((err) => errors.push(err))
        continue
      }

      result.push(parsed.data)
    }

    if (errors.length) {
      return error(errors)
    }

    if (
      typeof schema.minLength === 'number' &&
      result.length < schema.minLength
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
      result.length > schema.maxLength
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

    return data(result)
  }

  if (schema.type === 'union') {
    for (const subSchema of schema.of) {
      const parsed = parse(subSchema, subject)

      if (parsed.error === undefined) {
        return data(parsed.data)
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

  const verified = verifyPrimitive(schema, subject)

  if (verified === true) {
    return data(subject)
  }

  return error([
    {
      code: verified,
      path: this || [],
      subject,
      schema,
    },
  ])
}
