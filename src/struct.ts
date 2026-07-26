import { PARAMS_BY_SCHEMA_TYPE, STANDARD_SCHEMA } from './constants.js'
import { PREPROCESS_PATH_ITEM } from './preprocess.js'
import { parseWithPreprocessors } from './parse.js'
import { assignOwnProperty } from './utils.js'

import type { StandardSchemaV1 } from './types/standard-schema.ts'
import type {
  Schema,
  BigIntString,
  BrandSchema,
  StringSchema,
} from './types/schema.ts'
import type { PreprocessFn, PreprocessPathEntry } from './types/preprocess.ts'
import type { ParseOptions } from './types/utils.ts'
import type { Struct, StructParams, StructShape } from './types/struct.ts'

export function makeStruct<T extends Schema>(
  schema: T,
  preprocessors?: ReadonlyArray<PreprocessPathEntry>
): Struct<T>
export function makeStruct(
  schema: Schema,
  preprocessors: ReadonlyArray<PreprocessPathEntry> = []
) {
  const params = PARAMS_BY_SCHEMA_TYPE[schema.type] as Set<StructParams>
  const result: Record<string, unknown> & StandardSchemaV1 = {
    __schema: { ...schema },
    // Backs the public `preprocess` method below. Kept off the `Struct<T>`
    // type itself (read back only by this module's own composition
    // functions — `object`/`array`/etc. — via `readPreprocessors`) since
    // it's an implementation detail of how a member's preprocessor reaches
    // its parent once composed; `preprocess` is the actual public surface.
    __preprocessors: preprocessors,
    parse: (subj: unknown, options?: ParseOptions) =>
      parseWithPreprocessors(schema as never, subj, options, preprocessors),
    ['~standard']: {
      ...STANDARD_SCHEMA,
      validate: (input) => {
        const parsed = parseWithPreprocessors(
          schema as never,
          input,
          undefined,
          preprocessors
        )

        return parsed.success
          ? { value: parsed.data }
          : {
              issues: parsed.error.map((x) => ({
                path: x.path,
                message: x.code,
              })),
            }
      },
    },
  }

  /* Params present in all schema types */

  result.optional = () =>
    makeStruct({ ...schema, optional: true }, preprocessors)
  result.nullable = () =>
    makeStruct({ ...schema, nullable: true }, preprocessors)
  result.description = (description: string) =>
    makeStruct({ ...schema, description }, preprocessors)
  result.meta = (meta: Record<string, unknown>) =>
    makeStruct({ ...schema, meta }, preprocessors)

  // Unlike every param above, never touches `schema` — it's tracked
  // separately (see `preprocessors`) so it never appears in `__schema`.
  // Unlike every param above, it's also not a one-time application: since
  // it isn't a schema field, there's nothing for the type system to key a
  // "used up" state off of, so repeated calls are allowed — an entry with
  // an empty path is this struct's own preprocessor, and a later one
  // simply replaces the earlier one (`buildPreprocessTree` keeps the last
  // entry for a given path).
  result.preprocess = (fn: PreprocessFn) =>
    makeStruct(schema, [...preprocessors, { path: [], fn }])

  /* Schema specific params */

  if (params.has('brand')) {
    result.brand = (...args: BrandSchema | [BrandSchema]) => {
      return makeStruct(
        {
          ...schema,
          brand: (Array.isArray(args[0]) ? args[0] : args) as BrandSchema,
        },
        preprocessors
      )
    }
  }

  if (params.has('key')) {
    result.key = (key: StructShape<StringSchema>) =>
      makeStruct({ ...schema, key: key.__schema }, preprocessors)
  }

  if (params.has('min')) {
    if (schema.type === 'bigint') {
      result.min = (min: BigIntString) =>
        makeStruct({ ...schema, min }, preprocessors)
    } else {
      result.min = (min: number) =>
        makeStruct({ ...schema, min }, preprocessors)
    }
  }

  if (params.has('max')) {
    if (schema.type === 'bigint') {
      result.max = (max: BigIntString) =>
        makeStruct({ ...schema, max }, preprocessors)
    } else {
      result.max = (max: number) =>
        makeStruct({ ...schema, max }, preprocessors)
    }
  }

  if (params.has('minLength')) {
    result.minLength = (minLength: number) =>
      makeStruct({ ...schema, minLength }, preprocessors)
  }

  if (params.has('maxLength')) {
    result.maxLength = (maxLength: number) =>
      makeStruct({ ...schema, maxLength }, preprocessors)
  }

  return result
}

function readPreprocessors(struct: object): ReadonlyArray<PreprocessPathEntry> {
  return (
    (struct as { __preprocessors?: ReadonlyArray<PreprocessPathEntry> })
      .__preprocessors ?? []
  )
}

/**
 * Primitives
 **/

export function boolean() {
  return makeStruct({ type: 'boolean' })
}

export function literal<T extends string | number | boolean>(of: T) {
  return makeStruct({ type: 'literal', of })
}

export function number() {
  return makeStruct({ type: 'number' })
}

export function bigint() {
  return makeStruct({ type: 'bigint' })
}

export function string() {
  return makeStruct({ type: 'string' })
}

export function unknown() {
  return makeStruct({ type: 'unknown' })
}

/**
 * Compounds
 **/

export function array<T extends StructShape<Schema>>(of: T) {
  const preprocessors = readPreprocessors(of).map((entry) => ({
    path: [PREPROCESS_PATH_ITEM, ...entry.path],
    fn: entry.fn,
  }))

  return makeStruct(
    {
      type: 'array',
      of: of.__schema as T['__schema'],
    },
    preprocessors
  )
}

export function object<T extends Record<string, StructShape<Schema>>>(of: T) {
  const schema = {
    type: 'object' as const,
    of: {} as { [K in keyof T]: T[K]['__schema'] },
  }
  const preprocessors: PreprocessPathEntry[] = []

  for (const key in of) {
    const child = of[key] as NonNullable<(typeof of)[typeof key]>

    assignOwnProperty(schema.of, key, child.__schema)

    for (const entry of readPreprocessors(child)) {
      preprocessors.push({ path: [key, ...entry.path], fn: entry.fn })
    }
  }

  return makeStruct(schema, preprocessors)
}

export function record<T extends StructShape<Schema>>(of: T) {
  const preprocessors = readPreprocessors(of).map((entry) => ({
    path: [PREPROCESS_PATH_ITEM, ...entry.path],
    fn: entry.fn,
  }))

  return makeStruct(
    {
      type: 'record',
      of: of.__schema as T['__schema'],
    },
    preprocessors
  )
}

export function tuple<
  T extends [StructShape<Schema>, ...Array<StructShape<Schema>>],
>(of: T) {
  const schema = {
    type: 'tuple',
    of: of.map((x) => x.__schema) as { [K in keyof T]: T[K]['__schema'] },
  } as const

  const preprocessors: PreprocessPathEntry[] = []

  for (let i = 0; i < of.length; i++) {
    for (const entry of readPreprocessors(of[i]!)) {
      preprocessors.push({ path: [i, ...entry.path], fn: entry.fn })
    }
  }

  return makeStruct(schema, preprocessors)
}

export function union<
  T extends [StructShape<Schema>, ...Array<StructShape<Schema>>],
>(of: T) {
  const schema = { type: 'union', of: [] as unknown[] } as {
    type: 'union'
    of: T extends [...infer U]
      ? {
          [K in keyof U]: U[K] extends StructShape<infer V> ? V : never
        }
      : never
  }
  const preprocessors: PreprocessPathEntry[] = []

  for (let i = 0; i < of.length; i++) {
    const subSchema = of[i]!

    schema.of.push(subSchema.__schema)

    for (const entry of readPreprocessors(subSchema)) {
      preprocessors.push({ path: [i, ...entry.path], fn: entry.fn })
    }
  }

  return makeStruct(schema, preprocessors)
}
