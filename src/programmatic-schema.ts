import { validate } from './validate'
import { parse } from './parse'

import type { EitherError } from './utils/fp'
import type {
  Con_Schema_SubjT,
  NestedSchema,
  StructSchema,
  Schema,
} from './types/compounds'
import type { InvalidSubject } from './error'

type StructMethods<T extends Schema> = {
  parse: (s: unknown) => EitherError<InvalidSubject[], Con_Schema_SubjT<T>>
  validate: (s: unknown) => EitherError<InvalidSubject[], Con_Schema_SubjT<T>>
  guard: (subject: unknown) => subject is Con_Schema_SubjT<T>
}

type Shared = 'optional' | 'nullable' | 'description'
type ParamsBySchemaType = {
  string: Shared | 'minLength' | 'maxLength' | 'brand'
  number: Shared | 'min' | 'max' | 'brand'
  boolean: Shared | 'brand'
  literal: Shared | 'brand'
  object: Shared
  union: Shared
  array: Shared | 'minLength' | 'maxLength'
}

type StructParams = ParamsBySchemaType extends Record<string, infer U>
  ? U
  : never

type Struct<T extends Schema> = Omit<
  Pick<
    {
      optional: () => Struct<T & { optional: true }>
      nullable: () => Struct<T & { nullable: true }>

      brand: <V extends string, W extends string>(
        key: V,
        value: W
      ) => Struct<T & { brand: Readonly<[V, W]> }>

      minLength: (minLength: number) => Struct<T & { minLength: number }>
      maxLength: (maxLength: number) => Struct<T & { maxLength: number }>

      min: (min: number) => Struct<T & { min: number }>
      max: (max: number) => Struct<T & { max: number }>

      description: (description: string) => Struct<T & { description: string }>
    },
    ParamsBySchemaType[T['type']]
  >,
  keyof T
> & { __schema: Readonly<T> } & StructMethods<T>

const PARAMS_BY_SCHEMA_TYPE = {
  string: new Set([
    'optional',
    'nullable',
    'brand',
    'description',
    'minLength',
    'maxLength',
  ] as const),
  number: new Set([
    'optional',
    'nullable',
    'brand',
    'description',
    'min',
    'max',
  ] as const),
  boolean: new Set(['optional', 'nullable', 'brand', 'description'] as const),
  literal: new Set(['optional', 'nullable', 'brand', 'description'] as const),
  object: new Set(['optional', 'nullable', 'description'] as const),
  array: new Set([
    'optional',
    'nullable',
    'description',
    'minLength',
    'maxLength',
  ] as const),
  union: new Set(['optional', 'nullable', 'description']),
} as const

export function makeStruct<T extends Schema>(schema: T): Struct<T>
export function makeStruct(schema: StructSchema) {
  const params = PARAMS_BY_SCHEMA_TYPE[schema.type] as Set<StructParams>
  const result: Record<string, unknown> = {
    __schema: schema,

    parse: (subj: unknown) => parse(schema, subj),
    validate: (subj: unknown) => validate(schema, subj),
    guard: (subj: unknown): subj is string | undefined =>
      validate(schema, subj).error === undefined,
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

export function literal<T extends string | number>(of: T) {
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
