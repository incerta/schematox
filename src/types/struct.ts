import { ParseOptions, ParseResult } from './utils.js'

import type { StandardSchemaV1 } from './standard-schema.ts'
import type { StandardJSONSchemaV1 } from './standard-json-schema.ts'
import type {
  Schema,
  //
  ArraySchema,
  ObjectSchema,
  RecordSchema,
  TupleSchema,
  UnionSchema,
  //
  BrandSchema,
  //
  BigIntSchema,
  BooleanSchema,
  LiteralSchema,
  NumberSchema,
  StringSchema,
  UnknownSchema,
  //
  BigIntString,
} from './schema.ts'

import type { PreprocessFn } from './preprocess.ts'
import type { InferSchema } from './infer.ts'

export type Struct<T extends Schema> = Omit<
  Pick<
    {
      /** Allows `undefined` in addition to the usual value. */
      optional: () => Struct<T & { optional: true }>

      /** Allows `null` in addition to the usual value. */
      nullable: () => Struct<T & { nullable: true }>

      /** Tags the value as a nominal type, e.g. `string & { __idFor: 'User' }`. */
      brand: <
        U extends [string, BrandSubType] | [Readonly<[string, BrandSubType]>],
      >(
        ...args: U
      ) => Struct<
        T & {
          brand: U extends [infer V, infer W]
            ? BrandSchema<V, W>
            : U extends [Readonly<[infer V, infer W]>]
              ? BrandSchema<V, W>
              : never
        }
      >

      /** Schema used to validate a record's keys. */
      key: <U extends StructShape<StringSchema>>(
        key: U
      ) => Struct<T & { key: U['__schema'] }>

      /** Minimum length/size allowed. */
      minLength: <U extends number>(
        minLength: U
      ) => Struct<T & { minLength: U }>

      /** Maximum length/size allowed. */
      maxLength: <U extends number>(
        maxLength: U
      ) => Struct<T & { maxLength: U }>

      /** Maximum value allowed. */
      max: T extends BigIntSchema
        ? <U extends BigIntString>(max: U) => Struct<T & { max: U }>
        : <U extends number>(max: U) => Struct<T & { max: U }>

      /** Minimum value allowed. */
      min: T extends BigIntSchema
        ? <U extends BigIntString>(min: U) => Struct<T & { min: U }>
        : <U extends number>(min: U) => Struct<T & { min: U }>

      /** Free-text description, for documentation purposes only. */
      description: <U extends string>(
        description: U
      ) => Struct<T & { description: U }>

      /** Arbitrary user-defined data, ignored by parse/Infer. */
      meta: <U extends Record<string, unknown>>(
        meta: U
      ) => Struct<T & { meta: U }>
    },
    ParamsBySchemaType[T['type']]
  >,
  keyof T
> & {
  __schema: Readonly<T>

  /**
   * Runs before validation to adjust the raw input — e.g. trim a string,
   * strip a currency prefix. Independent of the schema and of the
   * `coerce` option: it always runs, and never appears in `__schema`.
   **/
  preprocess: (fn: PreprocessFn) => Struct<T & { preprocess: PreprocessFn }>

  parse: (s: unknown, options?: ParseOptions) => ParseResult<InferSchema<T>>
} & StandardSchemaV1<unknown, InferSchema<T>> &
  StandardJSONSchemaV1<unknown, InferSchema<T>>

type BrandSubType =
  boolean | number | string | ReadonlyArray<unknown> | Record<string, unknown>

export type StructShape<T> = { __schema: T }

type ParamsBySchemaType = {
  bigint: ExtractParams<BigIntSchema>
  boolean: ExtractParams<BooleanSchema>
  literal: ExtractParams<LiteralSchema>
  number: ExtractParams<NumberSchema>
  string: ExtractParams<StringSchema>
  unknown: ExtractParams<UnknownSchema>
  //
  array: ExtractParams<ArraySchema>
  object: ExtractParams<ObjectSchema>
  record: ExtractParams<RecordSchema>
  tuple: ExtractParams<TupleSchema>
  union: ExtractParams<UnionSchema>
}

type ExtractParams<T> = Exclude<keyof T, 'type' | 'of'>

export type StructParams =
  ParamsBySchemaType extends Record<string, infer U> ? U : never
