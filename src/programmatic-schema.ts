import { validate } from './general-schema-validator'
import { parse } from './general-schema-parser'

import type { EitherError } from './utils/fp'
import type {
  Con_Schema_SubjT_V,
  NestedSchema,
  StructSchema,
  Schema,
} from './types/compound-schema-types'
import type { InvalidSubject } from './error'

type StructMethods<T extends Schema> = {
  parse: (
    subject: unknown
  ) => EitherError<InvalidSubject[], Con_Schema_SubjT_V<T>>

  validate: (
    subject: unknown
  ) => EitherError<InvalidSubject[], Con_Schema_SubjT_V<T>>

  guard: (subject: unknown) => subject is Con_Schema_SubjT_V<T>
}

type StructParams =
  | 'optional'
  | 'description'
  | 'brand'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'

type Struct<T extends Schema, U extends StructParams> = Omit<
  Pick<
    {
      optional: () => Struct<T & { optional: true }, U>

      brand: <V extends string, W extends string>(
        key: V,
        value: W
      ) => Struct<T & { brand: Readonly<[V, W]> }, U>

      minLength: (minLength: number) => Struct<T & { minLength: number }, U>
      maxLength: (maxLength: number) => Struct<T & { maxLength: number }, U>

      min: (min: number) => Struct<T & { min: number }, U>
      max: (max: number) => Struct<T & { max: number }, U>

      description: (
        description: string
      ) => Struct<T & { description: string }, U>
    },
    U
  >,
  keyof T
> & { __schema: T } & StructMethods<T>

function makeStruct<T extends Schema, U extends StructParams>(
  schema: T,
  params: Set<U>
): Struct<T, U>
function makeStruct(schema: StructSchema, params: Set<StructParams>) {
  const result = {
    __schema: schema,

    parse: (subj: unknown) => parse(schema, subj),
    validate: (subj: unknown) => validate(schema, subj),
    guard: (subj: unknown): subj is string | undefined =>
      validate(schema, subj).error === undefined,
  } as any

  if (params.has('optional')) {
    result.optional = () => makeStruct({ ...schema, optional: true }, params)
  }

  if (params.has('description')) {
    result.description = (description: string) =>
      makeStruct({ ...schema, description }, params)
  }

  if (params.has('brand')) {
    result.brand = (key: string, value: string) =>
      makeStruct({ ...schema, brand: [key, value] }, params)
  }

  if (params.has('min')) {
    result.min = (min: number) => makeStruct({ ...schema, min }, params)
  }

  if (params.has('max')) {
    result.max = (max: number) => makeStruct({ ...schema, max }, params)
  }

  if (params.has('minLength')) {
    result.minLength = (minLength: number) =>
      makeStruct({ ...schema, minLength }, params)
  }

  if (params.has('maxLength')) {
    result.maxLength = (maxLength: number) =>
      makeStruct({ ...schema, maxLength }, params)
  }

  return result
}

const STRING_PARAMS = new Set([
  'optional',
  'minLength',
  'maxLength',
  'brand',
  'description',
]) satisfies Set<StructParams>

export function string() {
  return makeStruct({ type: 'string' }, STRING_PARAMS)
}

const NUMBER_PARAMS = new Set([
  'optional',
  'min',
  'max',
  'brand',
  'description',
]) satisfies Set<StructParams>

export function number() {
  return makeStruct({ type: 'number' }, NUMBER_PARAMS)
}

const BOOLEAN_PARAMS = new Set([
  'optional',
  'brand',
  'description',
]) satisfies Set<StructParams>

export function boolean() {
  return makeStruct({ type: 'boolean' }, BOOLEAN_PARAMS)
}

const STRING_UNION_PARAMS = new Set([
  'optional',
  'brand',
  'description',
]) satisfies Set<StructParams>

export function stringUnion<T extends string>(...of: Readonly<[T, ...T[]]>) {
  return makeStruct({ type: 'stringUnion', of }, STRING_UNION_PARAMS)
}

const NUMBER_UNION_PARAMS = new Set([
  'optional',
  'brand',
  'description',
]) satisfies Set<StructParams>

export function numberUnion<T extends number>(...of: Readonly<[T, ...T[]]>) {
  return makeStruct({ type: 'numberUnion', of }, NUMBER_UNION_PARAMS)
}

const LITERAL_PARAMS = new Set([
  'optional',
  'brand',
  'description',
]) satisfies Set<StructParams>

export function literal<T extends string | number>(of: T) {
  return makeStruct({ type: 'literal', of }, LITERAL_PARAMS)
}

const OBJECT_PARAMS = new Set([
  'optional',
  'brand',
  'description',
]) satisfies Set<StructParams>

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

  return makeStruct(schema, OBJECT_PARAMS)
}

const ARRAY_PARAMS = new Set([
  'optional',
  'brand',
  'minLength',
  'maxLength',
  'description',
]) satisfies Set<StructParams>

export function array<
  T extends StructSchema,
  U extends { __schema: T },
  V extends { type: 'array'; of: StructSchema } = {
    type: 'array'
    of: U['__schema']
  },
>(of: U) {
  const schema = { type: 'array', of: of.__schema } as V

  return makeStruct(schema, ARRAY_PARAMS)
}
