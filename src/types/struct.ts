import { ParseResult } from './utils'

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
  StringSchema,
} from './schema'

import type { Con_Schema_SubjT } from './constructors'

export type Struct<T extends Schema> = Omit<
  Pick<
    {
      optional: () => Struct<T & { optional: true }>
      nullable: () => Struct<T & { nullable: true }>

      brand: <V extends string, W extends string>(
        key: V,
        value: W
      ) => Struct<T & { brand: Readonly<[V, W]> }>

      minLength: <U extends number>(
        minLength: U
      ) => Struct<T & { minLength: U }>
      maxLength: <U extends number>(
        maxLength: U
      ) => Struct<T & { maxLength: U }>

      min: <U extends number>(min: U) => Struct<T & { min: U }>
      max: <U extends number>(max: U) => Struct<T & { max: U }>

      description: <U extends string>(
        description: U
      ) => Struct<T & { description: U }>
    },
    ParamsBySchemaType[T['type']]
  >,
  keyof T
> & {
  __schema: Readonly<T>
  parse: (s: unknown) => ParseResult<Con_Schema_SubjT<T>>
}

export type StructShape<T> = { __schema: T }

type ParamsBySchemaType = {
  boolean: ExtractParams<BooleanSchema>
  literal: ExtractParams<LiteralSchema>
  number: ExtractParams<NumberSchema>
  string: ExtractParams<StringSchema>
  //
  array: ExtractParams<ArraySchema>
  object: ExtractParams<ObjectSchema>
  record: Exclude<ExtractParams<RecordSchema>, 'key'>
  tuple: ExtractParams<TupleSchema>
  union: ExtractParams<UnionSchema>
}

type ExtractParams<T> = Exclude<keyof T, 'type' | 'of'>

export type StructParams =
  ParamsBySchemaType extends Record<string, infer U> ? U : never
