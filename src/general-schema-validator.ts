import { error, data } from './utils/fp'
import { VALIDATE_ERROR_CODE } from './error'
import { validateBaseSchemaSubject } from './base-schema-validator'

import type { EitherError } from './utils/fp'
import type { Schema, Con_Schema_SubjT_V } from './types/compound-schema-types'
import type { ValidateError, ErrorPath } from './error'

export function validate<T extends Schema>(
  schema: T,
  subject: Con_Schema_SubjT_V<T>
): EitherError<ValidateError[], Con_Schema_SubjT_V<T>>

export function validate(
  this: ErrorPath | undefined,
  schema: Schema,
  subject: unknown
): EitherError<ValidateError[], unknown> {
  if (
    typeof schema === 'string' ||
    schema.type === 'string' ||
    schema.type === 'number' ||
    schema.type === 'boolean' ||
    schema.type === 'buffer' ||
    schema.type === 'stringUnion' ||
    schema.type === 'numberUnion'
  ) {
    const validated = validateBaseSchemaSubject(schema, subject)

    if (validated.error) {
      return error([{ ...validated.error, path: this || [] }])
    }

    return data(subject)
  }

  const errors: ValidateError[] = []

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
          code: VALIDATE_ERROR_CODE.invalidType,
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

  if (Array.isArray(subject) === false) {
    if (schema.optional && subject === undefined) {
      return data(undefined)
    }

    return error([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
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

  return data(subject)
}
