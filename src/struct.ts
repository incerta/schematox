import { PARAMS_BY_SCHEMA_TYPE, STANDARD_SCHEMA } from './constants.js'
import { COERCER_PATH_ITEM } from './coerce.js'
import { parse } from './parse.js'
import { assignOwnProperty } from './utils.js'

import type { StandardSchemaV1 } from './types/standard-schema.ts'
import type {
  Schema,
  BigIntString,
  BrandSchema,
  StringSchema,
} from './types/schema.ts'
import type { CoercerPathEntry, CustomCoercer } from './types/coerce.ts'
import type { ParseOptions } from './types/utils.ts'
import type { Struct, StructParams, StructShape } from './types/struct.ts'

export function makeStruct<T extends Schema>(
  schema: T,
  coercers?: ReadonlyArray<CoercerPathEntry>
): Struct<T>
export function makeStruct(
  schema: Schema,
  coercers: ReadonlyArray<CoercerPathEntry> = []
) {
  const params = PARAMS_BY_SCHEMA_TYPE[schema.type] as Set<StructParams>
  const result: Record<string, unknown> & StandardSchemaV1 = {
    __schema: { ...schema },
    // Backs the public `coercer` method below. Kept off the `Struct<T>`
    // type itself (read back only by this module's own composition
    // functions — `object`/`array`/etc. — via `readCoercers`) since it's
    // an implementation detail of how a member's coercer reaches its
    // parent once composed; `coercer` is the actual public surface.
    __coercers: coercers,
    parse: (subj: unknown, options?: ParseOptions) =>
      parse(schema as never, subj, withStructCoercers(options, coercers)),
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

  result.optional = () => makeStruct({ ...schema, optional: true }, coercers)
  result.nullable = () => makeStruct({ ...schema, nullable: true }, coercers)
  result.description = (description: string) =>
    makeStruct({ ...schema, description }, coercers)

  // Unlike every param above, never touches `schema` — it's tracked
  // separately (see `coercers`) so it never appears in `__schema`. A later
  // call replaces the earlier one (last-write-wins, same as `description`),
  // and it stays available for repeated calls since nothing is ever added
  // to `keyof T` to remove it from the chain.
  result.coercer = (fn: CustomCoercer) =>
    makeStruct(schema, [...coercers, { path: [], fn }])

  /* Schema specific params */

  if (params.has('brand')) {
    result.brand = (...args: BrandSchema | [BrandSchema]) => {
      return makeStruct(
        {
          ...schema,
          brand: (Array.isArray(args[0]) ? args[0] : args) as BrandSchema,
        },
        coercers
      )
    }
  }

  if (params.has('key')) {
    result.key = (key: StructShape<StringSchema>) =>
      makeStruct({ ...schema, key: key.__schema }, coercers)
  }

  if (params.has('min')) {
    if (schema.type === 'bigint') {
      result.min = (min: BigIntString) =>
        makeStruct({ ...schema, min }, coercers)
    } else {
      result.min = (min: number) => makeStruct({ ...schema, min }, coercers)
    }
  }

  if (params.has('max')) {
    if (schema.type === 'bigint') {
      result.max = (max: BigIntString) =>
        makeStruct({ ...schema, max }, coercers)
    } else {
      result.max = (max: number) => makeStruct({ ...schema, max }, coercers)
    }
  }

  if (params.has('minLength')) {
    result.minLength = (minLength: number) =>
      makeStruct({ ...schema, minLength }, coercers)
  }

  if (params.has('maxLength')) {
    result.maxLength = (maxLength: number) =>
      makeStruct({ ...schema, maxLength }, coercers)
  }

  return result
}

function withStructCoercers(
  options: ParseOptions | undefined,
  structCoercers: ReadonlyArray<CoercerPathEntry>
): ParseOptions | undefined {
  if (structCoercers.length === 0) {
    return options
  }

  return {
    ...options,
    customCoercers: [...structCoercers, ...(options?.customCoercers ?? [])],
  }
}

function readCoercers(struct: object): ReadonlyArray<CoercerPathEntry> {
  return (
    (struct as { __coercers?: ReadonlyArray<CoercerPathEntry> }).__coercers ??
    []
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
  const coercers = readCoercers(of).map((entry) => ({
    path: [COERCER_PATH_ITEM, ...entry.path],
    fn: entry.fn,
  }))

  return makeStruct(
    {
      type: 'array',
      of: of.__schema as T['__schema'],
    },
    coercers
  )
}

export function object<T extends Record<string, StructShape<Schema>>>(of: T) {
  const schema = {
    type: 'object' as const,
    of: {} as { [K in keyof T]: T[K]['__schema'] },
  }
  const coercers: CoercerPathEntry[] = []

  for (const key in of) {
    const child = of[key] as NonNullable<(typeof of)[typeof key]>

    assignOwnProperty(schema.of, key, child.__schema)

    for (const entry of readCoercers(child)) {
      coercers.push({ path: [key, ...entry.path], fn: entry.fn })
    }
  }

  return makeStruct(schema, coercers)
}

export function record<T extends StructShape<Schema>>(of: T) {
  const coercers = readCoercers(of).map((entry) => ({
    path: [COERCER_PATH_ITEM, ...entry.path],
    fn: entry.fn,
  }))

  return makeStruct(
    {
      type: 'record',
      of: of.__schema as T['__schema'],
    },
    coercers
  )
}

export function tuple<
  T extends [StructShape<Schema>, ...Array<StructShape<Schema>>],
>(of: T) {
  const schema = {
    type: 'tuple',
    of: of.map((x) => x.__schema) as { [K in keyof T]: T[K]['__schema'] },
  } as const

  const coercers: CoercerPathEntry[] = []

  for (let i = 0; i < of.length; i++) {
    for (const entry of readCoercers(of[i]!)) {
      coercers.push({ path: [i, ...entry.path], fn: entry.fn })
    }
  }

  return makeStruct(schema, coercers)
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
  const coercers: CoercerPathEntry[] = []

  for (let i = 0; i < of.length; i++) {
    const subSchema = of[i]!

    schema.of.push(subSchema.__schema)

    for (const entry of readCoercers(subSchema)) {
      coercers.push({ path: [i, ...entry.path], fn: entry.fn })
    }
  }

  return makeStruct(schema, coercers)
}
