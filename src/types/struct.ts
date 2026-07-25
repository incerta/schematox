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

/**
 * `Converted` is a phantom flag, not derived from `T`/`Schema` — `.convert()`
 * deliberately never touches the schema (see its own doc comment below), so
 * there's no schema field for `Omit<..., keyof T>` to key off of the way it
 * does for every other param. Tracking "has `.convert()` already been
 * called" as a second type parameter instead reproduces the same
 * once-only-application rule this library already enforces for `.brand()`/
 * `.min()`/etc., without writing anything into `__schema` to get it.
 **/
export type Struct<T extends Schema, Converted extends boolean = false> = Omit<
  Pick<
    {
      optional: () => Struct<T & { optional: true }, Converted>
      nullable: () => Struct<T & { nullable: true }, Converted>

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
        },
        Converted
      >

      key: <U extends StructShape<StringSchema>>(
        key: U
      ) => Struct<T & { key: U['__schema'] }, Converted>

      minLength: <U extends number>(
        minLength: U
      ) => Struct<T & { minLength: U }, Converted>

      maxLength: <U extends number>(
        maxLength: U
      ) => Struct<T & { maxLength: U }, Converted>

      max: T extends BigIntSchema
        ? <U extends BigIntString>(max: U) => Struct<T & { max: U }, Converted>
        : <U extends number>(max: U) => Struct<T & { max: U }, Converted>

      min: T extends BigIntSchema
        ? <U extends BigIntString>(min: U) => Struct<T & { min: U }, Converted>
        : <U extends number>(min: U) => Struct<T & { min: U }, Converted>

      description: <U extends string>(
        description: U
      ) => Struct<T & { description: U }, Converted>
    },
    ParamsBySchemaType[T['type']]
  >,
  keyof T
> & {
  __schema: Readonly<T>
  parse: (s: unknown, options?: ParseOptions) => ParseResult<InferSchema<T>>
} & StandardSchemaV1<unknown, InferSchema<T>> &
  (Converted extends true
    ? unknown
    : {
        /**
         * Attaches a custom conversion function at this struct's own
         * position in the schema tree. Never stored on the schema — so it
         * never appears in `keyof T`/`__schema` — but still only
         * applicable once per struct, same as every param above: calling
         * `.convert()` flips `Converted` to `true`, which removes `convert`
         * from the returned struct's own type.
         *
         * Runs on every `.parse()` call unconditionally, independently of
         * the `coerce` option — see `ParseOptions.coerce`'s doc comment for
         * why it's a separate switch from the built-in
         * bigint/boolean/number/string table.
         **/
        convert: (fn: CustomCoercer) => Struct<T, true>
      })

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
