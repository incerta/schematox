import { ERROR_CODE } from './constants.js'
import { assignOwnProperty, error, success } from './utils.js'

import type { InferSchema } from './types/infer.js'
import type { ErrorPath, InvalidSubject, ParseResult } from './types/utils.js'

import type {
  Schema,
  //
  ArraySchema,
  ObjectSchema,
  RecordSchema,
  TupleSchema,
  UnionSchema,
  //
  BigIntSchema,
  BooleanSchema,
  LiteralSchema,
  NumberSchema,
  StringSchema,
} from './types/schema.js'

const PARSE_FN_BY_SCHEMA_KIND = {
  bigint: parseBigInt,
  boolean: parseBoolean,
  literal: parseLiteral,
  number: parseNumber,
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

// Recursion depth follows the static schema's nesting, never the subject's, so untrusted input can't drive stack depth.
function parseRecursively(
  errorPath: ErrorPath,
  schema: Schema,
  subject: unknown
): ParseResult<unknown> {
  // Schemas are plain data and may come from an untyped external source
  // (JSON, a database) that TypeScript's `satisfies Schema` never actually
  // checked. A malformed schema must be reported like anything else, not
  // thrown — this guards every level, not just the root, since it's on the
  // one function every nested schema recurses through.
  if (
    typeof schema !== 'object' ||
    schema === null ||
    typeof PARSE_FN_BY_SCHEMA_KIND[(schema as Schema).type] !== 'function'
  ) {
    return error([
      {
        code: ERROR_CODE.invalidSchema,
        path: errorPath,
        schema: schema as Schema,
      },
    ])
  }

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

function parseBigInt(
  errorPath: ErrorPath,
  schema: BigIntSchema,
  subject: unknown
) {
  if (typeof subject !== 'bigint') {
    return error([
      {
        code: ERROR_CODE.invalidType,
        path: errorPath,
        schema,
      },
    ])
  }

  if (schema.min !== undefined) {
    if (typeof schema.min !== 'string') {
      return error([
        {
          code: ERROR_CODE.invalidSchema,
          path: errorPath,
          schema,
        },
      ])
    }

    let min: bigint

    try {
      min = BigInt(schema.min)
    } catch {
      return error([
        {
          code: ERROR_CODE.invalidSchema,
          path: errorPath,
          schema,
        },
      ])
    }

    if (subject < min) {
      return error([
        {
          code: ERROR_CODE.invalidRange,
          path: errorPath,
          schema,
        },
      ])
    }
  }

  if (schema.max !== undefined) {
    if (typeof schema.max !== 'string') {
      return error([
        {
          code: ERROR_CODE.invalidSchema,
          path: errorPath,
          schema,
        },
      ])
    }

    let max: bigint

    try {
      max = BigInt(schema.max)
    } catch {
      return error([
        {
          code: ERROR_CODE.invalidSchema,
          path: errorPath,
          schema,
        },
      ])
    }

    if (subject > max) {
      return error([
        {
          code: ERROR_CODE.invalidRange,
          path: errorPath,
          schema,
        },
      ])
    }
  }

  return success(subject)
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
        schema,
      },
    ])
  }

  if (schema.min !== undefined) {
    if (typeof schema.min !== 'number') {
      return error([
        {
          code: ERROR_CODE.invalidSchema,
          path: errorPath,
          schema,
        },
      ])
    }

    if (subject < schema.min) {
      return error([
        {
          code: ERROR_CODE.invalidRange,
          path: errorPath,
          schema,
        },
      ])
    }
  }

  if (schema.max !== undefined) {
    if (typeof schema.max !== 'number') {
      return error([
        {
          code: ERROR_CODE.invalidSchema,
          path: errorPath,
          schema,
        },
      ])
    }

    if (subject > schema.max) {
      return error([
        {
          code: ERROR_CODE.invalidRange,
          path: errorPath,
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
        schema,
      },
    ])
  }

  if (schema.minLength !== undefined) {
    if (typeof schema.minLength !== 'number') {
      return error([
        {
          code: ERROR_CODE.invalidSchema,
          path: errorPath,
          schema,
        },
      ])
    }

    if (subject.length < schema.minLength) {
      return error([
        {
          code: ERROR_CODE.invalidRange,
          path: errorPath,
          schema,
        },
      ])
    }
  }

  if (schema.maxLength !== undefined) {
    if (typeof schema.maxLength !== 'number') {
      return error([
        {
          code: ERROR_CODE.invalidSchema,
          path: errorPath,
          schema,
        },
      ])
    }

    if (subject.length > schema.maxLength) {
      return error([
        {
          code: ERROR_CODE.invalidRange,
          path: errorPath,
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
        schema,
      },
    ])
  }

  if (
    (schema.maxLength !== undefined && typeof schema.maxLength !== 'number') ||
    (schema.minLength !== undefined && typeof schema.minLength !== 'number')
  ) {
    return error([
      {
        code: ERROR_CODE.invalidSchema,
        path: errorPath,
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

    // Once the array is already too long, further elements can't change
    // that verdict — stop instead of validating an attacker-controlled
    // tail with unbounded work. Errors collected so far are preserved.
    if (
      typeof schema.maxLength === 'number' &&
      result.length > schema.maxLength
    ) {
      break
    }
  }

  if (
    typeof schema.maxLength === 'number' &&
    result.length > schema.maxLength
  ) {
    invalidSubjects = invalidSubjects ?? []

    invalidSubjects.push({
      code: ERROR_CODE.invalidRange,
      path: errorPath,
      schema,
    })
  }

  if (
    typeof schema.minLength === 'number' &&
    result.length < schema.minLength
  ) {
    invalidSubjects = invalidSubjects ?? []

    invalidSubjects.push({
      code: ERROR_CODE.invalidRange,
      path: errorPath,
      schema,
    })
  }

  if (invalidSubjects?.length) {
    return error(invalidSubjects)
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
    Object.prototype.toString.call(subject) !== '[object Object]'
  ) {
    return error([
      {
        code: ERROR_CODE.invalidType,
        path: errorPath,
        schema,
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
      assignOwnProperty(result, key, parsed.data)
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
    Object.prototype.toString.call(subject) !== '[object Object]'
  ) {
    return error([
      {
        code: ERROR_CODE.invalidType,
        path: errorPath,
        schema,
      },
    ])
  }

  if (
    (schema.maxLength !== undefined && typeof schema.maxLength !== 'number') ||
    (schema.minLength !== undefined && typeof schema.minLength !== 'number')
  ) {
    return error([
      {
        code: ERROR_CODE.invalidSchema,
        path: errorPath,
        schema,
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

    let keyIsValid = true

    if (schema.key !== undefined) {
      const parsedKey = parseRecursively(updatedErrorPath, schema.key, key)

      if (parsedKey.error) {
        keyIsValid = false
        invalidSubjects = invalidSubjects ?? []

        for (const invalidSubject of parsedKey.error) {
          invalidSubjects.push(invalidSubject)
        }
      }
    }

    const parsed = parseRecursively(updatedErrorPath, schema.of, nestedValue)

    if (parsed.error) {
      invalidSubjects = invalidSubjects ?? []

      for (const invalidSubject of parsed.error) {
        invalidSubjects.push(invalidSubject)
      }
      continue
    }

    if (!keyIsValid) {
      continue
    }

    validEntryCounter++
    assignOwnProperty(result, key, parsed.data)

    // Once the record already has too many entries, further ones can't
    // change that verdict — stop instead of validating an
    // attacker-controlled tail with unbounded work. Errors collected so
    // far are preserved.
    if (
      typeof schema.maxLength === 'number' &&
      validEntryCounter > schema.maxLength
    ) {
      break
    }
  }

  if (
    typeof schema.maxLength === 'number' &&
    validEntryCounter > schema.maxLength
  ) {
    invalidSubjects = invalidSubjects ?? []

    invalidSubjects.push({
      code: ERROR_CODE.invalidRange,
      path: errorPath,
      schema,
    })
  }

  if (
    typeof schema.minLength === 'number' &&
    validEntryCounter < schema.minLength
  ) {
    invalidSubjects = invalidSubjects ?? []

    invalidSubjects.push({
      code: ERROR_CODE.invalidRange,
      path: errorPath,
      schema,
    })
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
  if (Array.isArray(schema.of) === false) {
    return error([
      {
        code: ERROR_CODE.invalidSchema,
        path: errorPath,
        schema,
      },
    ])
  }

  if (Array.isArray(subject) === false) {
    return error([
      {
        code: ERROR_CODE.invalidType,
        path: errorPath,
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

  // Trailing elements beyond the declared arity are never validated, so
  // they must not be silently accepted either — unlike object()'s
  // documented "extra keys ignored", a tuple's whole point is a fixed
  // shape.
  if (subject.length > schema.of.length) {
    invalidSubjects = invalidSubjects ?? []

    invalidSubjects.push({
      code: ERROR_CODE.invalidRange,
      path: errorPath,
      schema,
    })
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
  if (Array.isArray(schema.of) === false) {
    return error([
      {
        code: ERROR_CODE.invalidSchema,
        path: errorPath,
        schema,
      },
    ])
  }

  for (const subSchema of schema.of) {
    const parsed = parseRecursively(errorPath, subSchema, subject)

    if (parsed.error === undefined) {
      return parsed
    }
  }

  return error([
    {
      code: ERROR_CODE.invalidUnion,
      path: errorPath,
      schema,
    },
  ])
}
