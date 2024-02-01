import { error, data } from './utils/fp'
import { PARSE_ERROR_CODE } from './error'
import { parseBaseSchemaSubject } from './base-schema-parser'

import type { EitherError } from './utils/fp'
import type { Schema, Con_Schema_SubjT_P } from './types/compound-schema-types'
import type { ParseError, ErrorPath } from './error'

export function parse<T extends Schema>(
  schema: T,
  subject: unknown
): EitherError<ParseError[], Con_Schema_SubjT_P<T>>

export function parse(
  this: ErrorPath | undefined,
  schema: Schema,
  subject: unknown
): EitherError<ParseError[], unknown> {
  if (
    typeof schema === 'string' ||
    schema.type === 'string' ||
    schema.type === 'number' ||
    schema.type === 'boolean' ||
    schema.type === 'stringUnion' ||
    schema.type === 'numberUnion'
  ) {
    const parsed = parseBaseSchemaSubject(schema, subject)

    if (parsed.error) {
      return error([{ ...parsed.error, path: this || [] }])
    }

    return parsed
  }

  const errors: ParseError[] = []

  if (schema.type === 'object') {
    if (schema.optional) {
      if (subject === null || subject === undefined) {
        return data(undefined)
      }
    }

    if (
      typeof subject !== 'object' ||
      subject === null ||
      subject.constructor !== Object
    ) {
      return error([
        {
          code: PARSE_ERROR_CODE.invalidType,
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

  if (Array.isArray(subject) === false) {
    if (schema.optional) {
      if (subject === undefined || subject === null) {
        return data(undefined)
      }
    }

    return error([
      {
        code: PARSE_ERROR_CODE.invalidType,
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

  return data(result)
}
