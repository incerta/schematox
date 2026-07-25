import { PARAMS_BY_SCHEMA_TYPE, STANDARD_SCHEMA } from './constants.js'
import { CONVERT_PATH_ITEM } from './convert.js'
import { parse, parseWithConverters } from './parse.js'
import { assignOwnProperty } from './utils.js'

import type { StandardSchemaV1 } from './types/standard-schema.ts'
import type {
  Schema,
  BigIntString,
  BrandSchema,
  StringSchema,
} from './types/schema.ts'
import type { ConvertFn, ConvertPathEntry } from './types/convert.ts'
import type { ParseOptions } from './types/utils.ts'
import type { Struct, StructParams, StructShape } from './types/struct.ts'

export function makeStruct<T extends Schema>(
  schema: T,
  converters?: ReadonlyArray<ConvertPathEntry>
): Struct<T>
export function makeStruct(
  schema: Schema,
  converters: ReadonlyArray<ConvertPathEntry> = []
) {
  const params = PARAMS_BY_SCHEMA_TYPE[schema.type] as Set<StructParams>
  const result: Record<string, unknown> & StandardSchemaV1 = {
    __schema: { ...schema },
    // Backs the public `convert` method below. Kept off the `Struct<T>`
    // type itself (read back only by this module's own composition
    // functions — `object`/`array`/etc. — via `readConverters`) since it's
    // an implementation detail of how a member's converter reaches its
    // parent once composed; `convert` is the actual public surface.
    __converters: converters,
    parse: (subj: unknown, options?: ParseOptions) =>
      parseWithConverters(schema as never, subj, options, converters),
    ['~standard']: {
      ...STANDARD_SCHEMA,
      validate: (input) => {
        const parsed = parse(schema as never, input)

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

  result.optional = () => makeStruct({ ...schema, optional: true }, converters)
  result.nullable = () => makeStruct({ ...schema, nullable: true }, converters)
  result.description = (description: string) =>
    makeStruct({ ...schema, description }, converters)

  // Unlike every param above, never touches `schema` — it's tracked
  // separately (see `converters`) so it never appears in `__schema`. Still
  // only applicable once, same as every param above: an entry with an
  // empty path is this struct's own converter (as opposed to one inherited
  // from a composed child, which always has at least one path segment —
  // see `array`/`object`/etc. below), so its presence means `.convert()`
  // already ran and the method is omitted this time around, matching
  // `Struct<T, Converted>`'s type-level removal of `convert` once applied.
  if (converters.every((entry) => entry.path.length > 0)) {
    result.convert = (fn: ConvertFn) =>
      makeStruct(schema, [...converters, { path: [], fn }])
  }

  /* Schema specific params */

  if (params.has('brand')) {
    result.brand = (...args: BrandSchema | [BrandSchema]) => {
      return makeStruct(
        {
          ...schema,
          brand: (Array.isArray(args[0]) ? args[0] : args) as BrandSchema,
        },
        converters
      )
    }
  }

  if (params.has('key')) {
    result.key = (key: StructShape<StringSchema>) =>
      makeStruct({ ...schema, key: key.__schema }, converters)
  }

  if (params.has('min')) {
    if (schema.type === 'bigint') {
      result.min = (min: BigIntString) =>
        makeStruct({ ...schema, min }, converters)
    } else {
      result.min = (min: number) => makeStruct({ ...schema, min }, converters)
    }
  }

  if (params.has('max')) {
    if (schema.type === 'bigint') {
      result.max = (max: BigIntString) =>
        makeStruct({ ...schema, max }, converters)
    } else {
      result.max = (max: number) => makeStruct({ ...schema, max }, converters)
    }
  }

  if (params.has('minLength')) {
    result.minLength = (minLength: number) =>
      makeStruct({ ...schema, minLength }, converters)
  }

  if (params.has('maxLength')) {
    result.maxLength = (maxLength: number) =>
      makeStruct({ ...schema, maxLength }, converters)
  }

  return result
}

function readConverters(struct: object): ReadonlyArray<ConvertPathEntry> {
  return (
    (struct as { __converters?: ReadonlyArray<ConvertPathEntry> })
      .__converters ?? []
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
  const converters = readConverters(of).map((entry) => ({
    path: [CONVERT_PATH_ITEM, ...entry.path],
    fn: entry.fn,
  }))

  return makeStruct(
    {
      type: 'array',
      of: of.__schema as T['__schema'],
    },
    converters
  )
}

export function object<T extends Record<string, StructShape<Schema>>>(of: T) {
  const schema = {
    type: 'object' as const,
    of: {} as { [K in keyof T]: T[K]['__schema'] },
  }
  const converters: ConvertPathEntry[] = []

  for (const key in of) {
    const child = of[key] as NonNullable<(typeof of)[typeof key]>

    assignOwnProperty(schema.of, key, child.__schema)

    for (const entry of readConverters(child)) {
      converters.push({ path: [key, ...entry.path], fn: entry.fn })
    }
  }

  return makeStruct(schema, converters)
}

export function record<T extends StructShape<Schema>>(of: T) {
  const converters = readConverters(of).map((entry) => ({
    path: [CONVERT_PATH_ITEM, ...entry.path],
    fn: entry.fn,
  }))

  return makeStruct(
    {
      type: 'record',
      of: of.__schema as T['__schema'],
    },
    converters
  )
}

export function tuple<
  T extends [StructShape<Schema>, ...Array<StructShape<Schema>>],
>(of: T) {
  const schema = {
    type: 'tuple',
    of: of.map((x) => x.__schema) as { [K in keyof T]: T[K]['__schema'] },
  } as const

  const converters: ConvertPathEntry[] = []

  for (let i = 0; i < of.length; i++) {
    for (const entry of readConverters(of[i]!)) {
      converters.push({ path: [i, ...entry.path], fn: entry.fn })
    }
  }

  return makeStruct(schema, converters)
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
  const converters: ConvertPathEntry[] = []

  for (let i = 0; i < of.length; i++) {
    const subSchema = of[i]!

    schema.of.push(subSchema.__schema)

    for (const entry of readConverters(subSchema)) {
      converters.push({ path: [i, ...entry.path], fn: entry.fn })
    }
  }

  return makeStruct(schema, converters)
}
