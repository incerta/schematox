import { ParseOptions, ParseResult } from './utils.js'

import type { StandardSchemaV1 } from './standard-schema.ts'
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

import type { CustomCoercer } from './coerce.ts'
import type { InferSchema } from './infer.ts'

export type Struct<T extends Schema> = Omit<
  Pick<
    {
      optional: () => Struct<T & { optional: true }>
      nullable: () => Struct<T & { nullable: true }>

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

      key: <U extends StructShape<StringSchema>>(
        key: U
      ) => Struct<T & { key: U['__schema'] }>

      minLength: <U extends number>(
        minLength: U
      ) => Struct<T & { minLength: U }>

      maxLength: <U extends number>(
        maxLength: U
      ) => Struct<T & { maxLength: U }>

      max: T extends BigIntSchema
        ? <U extends BigIntString>(max: U) => Struct<T & { max: U }>
        : <U extends number>(max: U) => Struct<T & { max: U }>

      min: T extends BigIntSchema
        ? <U extends BigIntString>(min: U) => Struct<T & { min: U }>
        : <U extends number>(min: U) => Struct<T & { min: U }>

      description: <U extends string>(
        description: U
      ) => Struct<T & { description: U }>
    },
    ParamsBySchemaType[T['type']]
  >,
  keyof T
> & {
  __schema: Readonly<T>

  /**
   * Attaches a custom coercer at this struct's own position in the schema
   * tree. Unlike every other param above, it's never stored on the schema
   * (so it never appears in `keyof T`/`__schema`, and is never "used up" —
   * it stays callable indefinitely; a later call replaces the earlier one).
   * Runs on every `.parse()` call unconditionally, independently of the
   * `coerce` option — see `ParseOptions.coerce`'s doc comment for why it's
   * a separate switch from the built-in bigint/boolean/number/string table.
   **/
  coercer: (fn: CustomCoercer) => Struct<T>

  parse: (s: unknown, options?: ParseOptions) => ParseResult<InferSchema<T>>
} & StandardSchemaV1<unknown, InferSchema<T>>

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
