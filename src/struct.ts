import { PARAMS_BY_SCHEMA_TYPE, STANDARD_SCHEMA } from './constants'
import { parse } from './parse'

import type { StandardSchemaV1 } from './types/standard-schema'
import type { Schema, BrandSchema, StringSchema } from './types/schema'
import type { Struct, StructParams, StructShape } from './types/struct'

export function makeStruct<T extends Schema>(schema: T): Struct<T>
export function makeStruct(schema: Schema) {
  const params = PARAMS_BY_SCHEMA_TYPE[schema.type] as Set<StructParams>
  const result: Record<string, unknown> & StandardSchemaV1 = {
    __schema: { ...schema },
    parse: (subj: unknown) => parse(schema as never, subj),
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

  if (params.has('optional')) {
    result.optional = () => makeStruct({ ...schema, optional: true })
  }

  if (params.has('nullable')) {
    result.nullable = () => makeStruct({ ...schema, nullable: true })
  }

  if (params.has('description')) {
    result.description = (description: string) =>
      makeStruct({ ...schema, description })
  }

  if (params.has('brand')) {
    result.brand = (...args: BrandSchema | [BrandSchema]) => {
      return makeStruct({
        ...schema,
        brand: (Array.isArray(args[0]) ? args[0] : args) as BrandSchema,
      })
    }
  }

  if (params.has('min')) {
    if (schema.type === 'bigint') {
      result.min = (min: bigint) => makeStruct({ ...schema, min })
    } else {
      result.min = (min: number) => makeStruct({ ...schema, min })
    }
  }

  if (params.has('max')) {
    if (schema.type === 'bigint') {
      result.max = (max: bigint) => makeStruct({ ...schema, max })
    } else {
      result.max = (max: number) => makeStruct({ ...schema, max })
    }
  }

  if (params.has('minLength')) {
    result.minLength = (minLength: number) =>
      makeStruct({ ...schema, minLength })
  }

  if (params.has('maxLength')) {
    result.maxLength = (maxLength: number) =>
      makeStruct({ ...schema, maxLength })
  }

  return result
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

/**
 * Compounds
 **/

export function array<T extends StructShape<Schema>>(of: T) {
  return makeStruct({
    type: 'array',
    of: of.__schema as T['__schema'],
  })
}

export function object<T extends Record<string, StructShape<Schema>>>(of: T) {
  const schema = {
    type: 'object' as const,
    of: {} as { [K in keyof T]: T[K]['__schema'] },
  }

  for (const key in of) {
    schema.of[key] = (of[key] as NonNullable<(typeof of)[typeof key]>).__schema
  }

  return makeStruct(schema)
}

export function record<T extends StructShape<Schema>>(
  of: T,
  key?: undefined
): Struct<{ type: 'record'; of: T['__schema'] }>

export function record<
  T extends StructShape<Schema>,
  U extends StructShape<StringSchema>,
>(
  of: T,
  key: U
): Struct<{ type: 'record'; of: T['__schema']; key: U['__schema'] }>

export function record(of: StructShape<any>, key?: StructShape<any>) {
  if (key !== undefined) {
    return makeStruct({
      type: 'record',
      of: of.__schema,
      key: key.__schema,
    })
  }

  return makeStruct({ type: 'record', of: of.__schema })
}

export function tuple<
  T extends [StructShape<Schema>, ...Array<StructShape<Schema>>],
>(of: T) {
  const schema = {
    type: 'tuple',
    of: of.map((x) => x.__schema) as { [K in keyof T]: T[K]['__schema'] },
  } as const

  return makeStruct(schema)
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

  for (const subSchema of of) {
    schema.of.push(subSchema.__schema)
  }

  return makeStruct(schema)
}
