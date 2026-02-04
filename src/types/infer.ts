import type {
  Schema,
  //
  ArraySchema,
  ObjectSchema,
  RecordSchema,
  TupleSchema,
  UnionSchema,
  //
  PrimitiveSchema,
  //
  BooleanSchema,
  LiteralSchema,
  NumberSchema,
  BigintSchema,
  StringSchema,
  //
  BrandSchema,
} from './schema'

import type { StructShape } from './struct'
import type { PrettifyObject } from './utils'

import type { ExtendParams, ExtendBrand } from './extensions'

/**
 * @example Infer<typeof struct> | Infer<typeof schema>
 **/
export type Infer<T> =
  T extends StructShape<infer U> ? InferSchema<U> : InferSchema<T>

export type InferSchema<T> = ExtendParams<
  T,
  T extends PrimitiveSchema
    ? InferPrimitive<T>
    : T extends ArraySchema
      ? InferArray<T>
      : T extends ObjectSchema
        ? InferObject<T>
        : T extends RecordSchema
          ? InferRecord<T>
          : T extends TupleSchema
            ? InferTuple<T>
            : T extends UnionSchema
              ? InferUnion<T>
              : never
>

export type InferBrand<T extends BrandSchema> =
  T extends BrandSchema<infer Category, infer SubCategory>
    ? Category extends string
      ? { [K in `__${Category}`]: SubCategory }
      : never
    : never

export type InferPrimitive<T> = T extends StringSchema
  ? string
  : T extends NumberSchema
    ? number
    : T extends BigintSchema
      ? bigint
    : T extends BooleanSchema
      ? boolean
      : T extends LiteralSchema<infer U>
        ? U
        : never

export type InferArray<T> =
  T extends ArraySchema<infer U> ? Array<InferSchema<U>> : never

export type InferObject<T> =
  T extends ObjectSchema<infer U>
    ? PrettifyObject<
        {
          [K in keyof U as U[K] extends { optional: true }
            ? K
            : never]?: InferSchema<U[K]>
        } & {
          [K in keyof U as U[K] extends { optional: true }
            ? never
            : K]: InferSchema<U[K]>
        }
      >
    : never

export type InferRecord<T> = T extends {
  key?: infer U
  of: infer V
}
  ? Record<
      U extends StringSchema ? ExtendBrand<U, InferPrimitive<U>> : string,
      V extends Schema ? InferSchema<V> : never
    >
  : never

export type InferTuple<T> =
  T extends TupleSchema<infer U>
    ? U extends [...infer V]
      ? {
          [K in keyof V]: InferSchema<V[K]>
        }
      : never
    : never

export type InferUnion<T> = T extends {
  type: 'union'
  of: Readonly<Array<infer U>>
}
  ? U extends Schema
    ? InferSchema<U>
    : never
  : never
