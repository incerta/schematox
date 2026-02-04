import { ERROR_CODE } from './constants'
import { error, success } from './utils'

import type { InferSchema } from './types/infer'
import type { ErrorPath, InvalidSubject, ParseResult } from './types/utils'

import type {
  Schema,
  //
  ArraySchema,
  ObjectSchema,
  RecordSchema,
  TupleSchema,
  UnionSchema,
  //
  BooleanSchema,
  LiteralSchema,
  NumberSchema,
  BigintSchema,
  StringSchema,
} from './types/schema'

const PARSE_FN_BY_SCHEMA_KIND = {
  boolean: parseBoolean,
  literal: parseLiteral,
  number: parseNumber,
  bigint: parseBigint,
  string: parseString,
  //
  array: parseArray,
  object: parseObject,
  record: parseRecord,
  tuple: parseTuple,
  union: parseUnion,
}

export function parse<T extends Schema>(
  schema: T,
  subject: unknown
): ParseResult<InferSchema<T>>

export function parse(schema: Schema, subject: unknown): ParseResult<unknown> {
  return parseRecursively([], schema, subject)
}

function parseRecursively(
  errorPath: ErrorPath,
  schema: Schema,
  subject: unknown
): ParseResult<unknown> {
  if (schema.optional === true && subject === undefined) {
    return success(undefined)
  }

  if (schema.nullable === true && subject === null) {
    return success(null)
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

  return success(subject)
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

  return success(subject)
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

  return success(subject)
}

function parseBigint(
  errorPath: ErrorPath,
  schema: BigintSchema,
  subject: unknown
) {
  if (typeof subject !== 'bigint') {
    return error([
      {
        code: ERROR_CODE.invalidType,
        path: errorPath,
        subject,
        schema,
      },
    ])
  }

  if (typeof schema.min === 'bigint') {
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

  if (typeof schema.max === 'bigint') {
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

  return success(subject)
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

  return success(subject)
}

function parseArray(
  errorPath: ErrorPath,
  schema: ArraySchema<Schema>,
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
  let invalidSubjects: InvalidSubject[] | undefined

  for (let i = 0; i < subject.length; i++) {
    const nestedSchema = schema.of
    const nestedValue = subject[i]

    const updatedErrorPath = [...errorPath, i]
    const parsed = parseRecursively(updatedErrorPath, nestedSchema, nestedValue)

    if (parsed.error) {
      invalidSubjects = invalidSubjects ?? []

      for (const invalidSubject of parsed.error) {
        invalidSubjects.push(invalidSubject)
      }
      continue
    }

    result.push(parsed.data)

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
  }

  if (invalidSubjects?.length) {
    return error(invalidSubjects)
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

  return success(result)
}

function parseObject(
  errorPath: ErrorPath,
  schema: ObjectSchema<Record<string, Schema>>,
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
  let invalidSubjects: InvalidSubject[] | undefined

  // Extra keys in the subject are ignored
  for (const key in schema.of) {
    const narrowedSubj = subject as Record<string, unknown>
    const nestedSchema = schema.of[key] as Schema
    const nestedValue = narrowedSubj[key]

    const updatedErrorPath = [...errorPath, key]
    const parsed = parseRecursively(updatedErrorPath, nestedSchema, nestedValue)

    if (parsed.error) {
      invalidSubjects = invalidSubjects ?? []

      for (const invalidSubject of parsed.error) {
        invalidSubjects.push(invalidSubject)
      }
      continue
    }

    if (Object.prototype.hasOwnProperty.call(narrowedSubj, key)) {
      result[key] = parsed.data
    }
  }

  if (invalidSubjects?.length) {
    return error(invalidSubjects)
  }

  return success(result)
}

function parseRecord(
  errorPath: ErrorPath,
  schema: RecordSchema<Schema>,
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
  let invalidSubjects: InvalidSubject[] | undefined
  let validEntryCounter = 0

  for (const key in subject) {
    const nestedValue = (subject as Record<string, unknown>)[key]

    if (nestedValue === undefined) {
      // Undefined entry key is not included in parsed object
      continue
    }

    const updatedErrorPath = [...errorPath, key]
    const parsed = parseRecursively(updatedErrorPath, schema.of, nestedValue)

    if (parsed.error) {
      invalidSubjects = invalidSubjects ?? []

      for (const invalidSubject of parsed.error) {
        invalidSubjects.push(invalidSubject)
      }
      continue
    }

    validEntryCounter++

    if (
      typeof schema.maxLength === 'number' &&
      validEntryCounter > schema.maxLength
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

    result[key] = parsed.data
  }

  if (
    typeof schema.minLength === 'number' &&
    validEntryCounter < schema.minLength
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

  if (invalidSubjects?.length) {
    return error(invalidSubjects)
  }

  return success(result)
}

function parseTuple(
  errorPath: ErrorPath,
  schema: TupleSchema<Array<Schema>>,
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
  let invalidSubjects: InvalidSubject[] | undefined

  for (let i = 0; i < schema.of.length; i++) {
    const nestedSchema = schema.of[i]!
    const nestedValue = subject[i]

    const updatedErrorPath = [...errorPath, i]
    const parsed = parseRecursively(updatedErrorPath, nestedSchema, nestedValue)

    if (parsed.error) {
      invalidSubjects = invalidSubjects ?? []

      for (const invalidSubject of parsed.error) {
        invalidSubjects.push(invalidSubject)
      }
      continue
    }

    result.push(parsed.data)
  }

  if (invalidSubjects?.length) {
    return error(invalidSubjects)
  }

  return success(result)
}

function parseUnion(
  errorPath: ErrorPath,
  schema: UnionSchema<Array<Schema>>,
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
