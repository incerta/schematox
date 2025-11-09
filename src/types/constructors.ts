import type {
  Schema,
  //
  ArraySchema,
  ObjectSchema,
  RecordSchema,
  UnionSchema,
  //
  PrimitiveSchema,
  //
  BooleanSchema,
  LiteralSchema,
  NumberSchema,
  StringSchema,
} from './schema'

import type { StructShape } from './struct'

import type {
  ExtWith_SchemaParams_SubjT,
  ExtWith_Brand_SubjT,
} from './extensions'

export type Con_PrimitiveSchema_SubjT<T> = T extends StringSchema
  ? string
  : T extends NumberSchema
    ? number
    : T extends BooleanSchema
      ? boolean
      : T extends LiteralSchema<infer U>
        ? U
        : never

export type Con_ArraySchema_SubjT<T> =
  T extends ArraySchema<infer U> ? Array<Con_Schema_SubjT<U>> : never

type PrettifyRecord<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K]
} & {}

export type Con_ObjectSchema_SubjT<T> =
  T extends ObjectSchema<infer U>
    ? PrettifyRecord<
        {
          [K in keyof U as U[K] extends { optional: true }
            ? K
            : never]?: Con_Schema_SubjT<U[K]>
        } & {
          [K in keyof U as U[K] extends { optional: true }
            ? never
            : K]: Con_Schema_SubjT<U[K]>
        }
      >
    : never

export type Con_RecordSchema_SubjT<T> = T extends {
  key?: infer U
  of: infer V
}
  ? Record<
      U extends StringSchema
        ? ExtWith_Brand_SubjT<U, Con_PrimitiveSchema_SubjT<U>>
        : string,
      V extends Schema ? Con_Schema_SubjT<V> : never
    >
  : never

export type Con_UnionSchema_SubjT<T> = T extends {
  type: 'union'
  of: Readonly<Array<infer U>>
}
  ? U extends Schema
    ? Con_Schema_SubjT<U>
    : never
  : never

export type Con_Schema_SubjT<T> = ExtWith_SchemaParams_SubjT<
  T,
  T extends PrimitiveSchema
    ? Con_PrimitiveSchema_SubjT<T>
    : T extends ArraySchema
      ? Con_ArraySchema_SubjT<T>
      : T extends ObjectSchema
        ? Con_ObjectSchema_SubjT<T>
        : T extends RecordSchema
          ? Con_RecordSchema_SubjT<T>
          : T extends UnionSchema
            ? Con_UnionSchema_SubjT<T>
            : never
>

/**
 * @example Infer<typeof struct> | Infer<typeof schema>
 **/
export type Infer<T> =
  T extends StructShape<infer U> ? Con_Schema_SubjT<U> : Con_Schema_SubjT<T>
