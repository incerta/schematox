import { ERROR_CODE } from './constants'
import { error, data } from './utils'

import type { ErrorPath, InvalidSubject, ParseResult } from './types/utils'
import type { Con_Schema_SubjT } from './types/constructors'

import type {
  BooleanSchema,
  LiteralSchema,
  NumberSchema,
  StringSchema,
} from './types/primitives'

import type {
  ArraySchema,
  ObjectSchema,
  RecordSchema,
  UnionSchema,
  Schema,
} from './types/compounds'

const PARSE_FN_BY_SCHEMA_KIND = {
  boolean: parseBoolean,
  literal: parseLiteral,
  number: parseNumber,
  string: parseString,
  //
  array: parseArray,
  object: parseObject,
  record: parseRecord,
  union: parseUnion,
}

export function parse<T extends Schema>(
  schema: T,
  subject: unknown
): ParseResult<Con_Schema_SubjT<T>>

export function parse(schema: Schema, subject: unknown): ParseResult<unknown> {
  return parseRecursively([], schema, subject)
}

function parseRecursively(
  errorPath: ErrorPath,
  schema: Schema,
  subject: unknown
): ParseResult<unknown> {
  if (schema.optional === true && subject === undefined) {
    return data(undefined)
  }

  if (schema.nullable === true && subject === null) {
    return data(null)
  }

  return PARSE_FN_BY_SCHEMA_KIND[schema.type](
    errorPath,
    schema as never,
    subject
  )
}

function parseBoolean(
  errorPath: ErrorPath,
  schema: BooleanSchema,
  subject: unknown
) {
  if (typeof subject !== 'boolean') {
    return error([
      {
        code: ERROR_CODE.invalidType,
        path: errorPath,
        subject,
        schema,
      },
    ])
  }

  return data(subject)
}

function parseLiteral(
  errorPath: ErrorPath,
  schema: LiteralSchema,
  subject: unknown
) {
  if (subject !== schema.of) {
    return error([
      {
        code: ERROR_CODE.invalidType,
        path: errorPath,
        subject,
        schema,
      },
    ])
  }

  return data(subject)
}

function parseNumber(
  errorPath: ErrorPath,
  schema: NumberSchema,
  subject: unknown
) {
  if (typeof subject !== 'number' || Number.isFinite(subject) === false) {
    return error([
      {
        code: ERROR_CODE.invalidType,
        path: errorPath,
        subject,
        schema,
      },
    ])
  }

  if (typeof schema.min === 'number') {
    if (subject < schema.min) {
      return error([
        {
          code: ERROR_CODE.invalidRange,
          path: errorPath,
          subject,
          schema,
        },
      ])
    }
  }

  if (typeof schema.max === 'number') {
    if (subject > schema.max) {
      return error([
        {
          code: ERROR_CODE.invalidRange,
          path: errorPath,
          subject,
          schema,
        },
      ])
    }
  }

  return data(subject)
}

function parseString(
  errorPath: ErrorPath,
  schema: StringSchema,
  subject: unknown
) {
  if (typeof subject !== 'string') {
    return error([
      {
        code: ERROR_CODE.invalidType,
        path: errorPath,
        subject,
        schema,
      },
    ])
  }

  if (typeof schema.minLength === 'number') {
    if (subject.length < schema.minLength) {
      return error([
        {
          code: ERROR_CODE.invalidRange,
          path: errorPath,
          subject,
          schema,
        },
      ])
    }
  }

  if (typeof schema.maxLength === 'number') {
    if (subject.length > schema.maxLength) {
      return error([
        {
          code: ERROR_CODE.invalidRange,
          path: errorPath,
          subject,
          schema,
        },
      ])
    }
  }

  return data(subject)
}

function parseArray(
  errorPath: ErrorPath,
  schema: ArraySchema,
  subject: unknown
) {
  if (Array.isArray(subject) === false) {
    return error([
      {
        code: ERROR_CODE.invalidType,
        path: errorPath,
        subject,
        schema,
      },
    ])
  }

  const result: unknown[] = []
  let errors: InvalidSubject[] | undefined

  for (let i = 0; i < subject.length; i++) {
    const nestedSchema = schema.of
    const nestedValue = subject[i]

    const updatedErrorPath = [...errorPath, i]
    const parsed = parseRecursively(updatedErrorPath, nestedSchema, nestedValue)

    if (parsed.error) {
      errors = errors ?? []
      parsed.error.forEach((err) => errors!.push(err))
      continue
    }

    result.push(parsed.data)
  }

  if (errors?.length) {
    return error(errors)
  }

  if (
    typeof schema.minLength === 'number' &&
    result.length < schema.minLength
  ) {
    return error([
      {
        code: ERROR_CODE.invalidRange,
        path: errorPath,
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
        path: errorPath,
        subject,
        schema,
      },
    ])
  }

  return data(result)
}

function parseObject(
  errorPath: ErrorPath,
  schema: ObjectSchema,
  subject: unknown
): ParseResult<unknown> {
  if (
    typeof subject !== 'object' ||
    subject === null ||
    subject.constructor !== Object
  ) {
    return error([
      {
        code: ERROR_CODE.invalidType,
        path: errorPath,
        schema,
        subject,
      },
    ])
  }

  const result: Record<string, unknown> = {}
  let errors: InvalidSubject[] | undefined

  for (const key in schema.of) {
    const narrowedSubj = subject as Record<string, unknown>
    const nestedSchema = schema.of[key] as Schema
    const nestedValue = narrowedSubj[key]

    const updatedErrorPath = [...errorPath, key]
    const parsed = parseRecursively(updatedErrorPath, nestedSchema, nestedValue)

    if (parsed.error) {
      errors = errors ?? []
      parsed.error.forEach((err) => errors!.push(err))
      continue
    }

    if (Object.prototype.hasOwnProperty.call(narrowedSubj, key)) {
      result[key] = parsed.data
    }
  }

  if (errors?.length) {
    return error(errors)
  }

  return data(result)
}

function parseRecord(
  errorPath: ErrorPath,
  schema: RecordSchema,
  subject: unknown
) {
  if (
    typeof subject !== 'object' ||
    subject === null ||
    subject.constructor !== Object
  ) {
    return error([
      {
        code: ERROR_CODE.invalidType,
        path: errorPath,
        schema,
        subject,
      },
    ])
  }

  const result: Record<string, unknown> = {}
  let errors: InvalidSubject[] | undefined

  for (const key in subject) {
    const nestedValue = (subject as Record<string, unknown>)[key]

    if (nestedValue === undefined) {
      // Undefined entry key is not included in parsed object
      continue
    }

    const updatedErrorPath = [...errorPath, key]
    const parsed = parseRecursively(updatedErrorPath, schema.of, nestedValue)

    if (parsed.error) {
      errors = errors ?? []
      parsed.error.forEach((err) => errors!.push(err))
      continue
    }

    result[key] = parsed.data
  }

  if (errors?.length) {
    return error(errors)
  }

  return data(result)
}

function parseUnion(
  errorPath: ErrorPath,
  schema: UnionSchema,
  subject: unknown
) {
  for (const subSchema of schema.of) {
    const parsed = parseRecursively(errorPath, subSchema, subject)

    if (parsed.error === undefined) {
      return parsed
    }
  }

  return error([
    {
      code: ERROR_CODE.invalidType,
      path: errorPath,
      subject,
      schema,
    },
  ])
}
