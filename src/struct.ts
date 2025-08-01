import { PARAMS_BY_SCHEMA_TYPE } from './constants'
import { validate } from './validate'
import { parse } from './parse'

import type { StringSchema } from './types/primitives'
import type { NestedSchema, StructSchema, Schema } from './types/compounds'
import type { Struct, StructParams } from './types/struct'

export function makeStruct<T extends Schema>(schema: T): Struct<T>
export function makeStruct(schema: StructSchema) {
  const params = PARAMS_BY_SCHEMA_TYPE[schema.type] as Set<StructParams>
  const result: Record<string, unknown> = {
    __schema: schema,

    parse: (subj: unknown) => parse(schema, subj),
    validate: (subj: unknown) => validate(schema, subj),
    guard: (subj: unknown): subj is string | undefined =>
      validate(schema, subj).left === undefined,
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
    result.brand = (key: string, value: string) =>
      makeStruct({ ...schema, brand: [key, value] })
  }

  if (params.has('min')) {
    result.min = (min: number) => makeStruct({ ...schema, min })
  }

  if (params.has('max')) {
    result.max = (max: number) => makeStruct({ ...schema, max })
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

export function string() {
  return makeStruct({ type: 'string' })
}

export function number() {
  return makeStruct({ type: 'number' })
}

export function boolean() {
  return makeStruct({ type: 'boolean' })
}

export function literal<T extends string | number | boolean>(of: T) {
  return makeStruct({ type: 'literal', of })
}

export function object<
  T extends StructSchema,
  U extends Record<string, { __schema: T }>,
  V extends {
    type: 'object'
    of: Record<string, NestedSchema>
  } = { type: 'object'; of: { [k in keyof U]: U[k]['__schema'] } },
>(of: U) {
  const schema = { type: 'object', of: {} } as V

  for (const key in of) {
    schema.of[key] = (of[key] as NonNullable<(typeof of)[typeof key]>).__schema
  }

  return makeStruct(schema)
}

export function record<
  T extends { __schema: StructSchema },
  U extends { __schema: StringSchema },
  V extends { type: 'record'; of: T['__schema']; key: U['__schema'] },
>(of: T, key: U = { __schema: { type: 'string' } } as U) {
  const schema = { type: 'record', of: of.__schema, key: key.__schema } as V

  return makeStruct(schema)
}

export function array<
  T extends StructSchema,
  U extends { __schema: T },
  V extends { type: 'array'; of: StructSchema } = {
    type: 'array'
    of: U['__schema']
  },
>(of: U) {
  const schema = { type: 'array', of: of.__schema } as V

  return makeStruct(schema)
}

export function union<
  T extends StructSchema,
  U extends { __schema: T },
  V extends {
    type: 'union'
    of: Array<NestedSchema>
  } = { type: 'union'; of: Array<U['__schema']> },
>(of: Array<U>) {
  const schema = { type: 'union', of: [] as unknown[] } as V

  for (const subSchema of of) {
    schema.of.push(subSchema.__schema)
  }

  return makeStruct(schema)
}
