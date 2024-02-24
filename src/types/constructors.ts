import type {
  StringSchema,
  NumberSchema,
  BooleanSchema,
  LiteralSchema,
  PrimitiveSchema,
} from './primitives'

import type {
  ArraySchema,
  ObjectSchema,
  UnionSchema,
  Schema,
} from './compounds'

import type { ExtWith_SchemaParams_SubjT } from './extensions'

export type Con_PrimitiveSchema_TypeOnly_SubjT<T extends PrimitiveSchema> =
  T extends StringSchema
    ? string
    : T extends NumberSchema
      ? number
      : T extends BooleanSchema
        ? boolean
        : T extends LiteralSchema<infer U>
          ? U
          : never

export type Con_PrimitiveSchema_SubjT<
  T extends PrimitiveSchema,
  U = Con_PrimitiveSchema_TypeOnly_SubjT<T>,
  V = ExtWith_SchemaParams_SubjT<T, U>,
> = V

export type Con_ArraySchema_SubjT<T extends ArraySchema> =
  ExtWith_SchemaParams_SubjT<
    T,
    T extends { of: infer U }
      ? U extends PrimitiveSchema
        ? Array<Con_PrimitiveSchema_SubjT<U>>
        : U extends ArraySchema
          ? Array<Con_ArraySchema_SubjT<U>>
          : U extends ObjectSchema
            ? Array<Con_ObjectSchema_SubjT<U>>
            : U extends UnionSchema
              ? Array<Con_UnionSchema_SubjT<U>>
              : never
      : never
  >

export type Con_ObjectSchema_SubjT<T extends ObjectSchema> =
  ExtWith_SchemaParams_SubjT<
    T,
    T extends {
      of: infer U
    }
      ? {
          -readonly [k in keyof U]: U[k] extends PrimitiveSchema
            ? Con_PrimitiveSchema_SubjT<U[k]>
            : U[k] extends ObjectSchema
              ? Con_ObjectSchema_SubjT<U[k]>
              : U[k] extends ArraySchema
                ? Con_ArraySchema_SubjT<U[k]>
                : U[k] extends UnionSchema
                  ? Con_UnionSchema_SubjT<U[k]>
                  : never
        }
      : never
  >

export type Con_UnionSchema_SubjT<T extends UnionSchema> =
  ExtWith_SchemaParams_SubjT<
    T,
    T extends {
      type: 'union'
      of: Array<infer U>
    }
      ? U extends PrimitiveSchema
        ? Con_PrimitiveSchema_SubjT<U>
        : U extends ArraySchema
          ? Con_ArraySchema_SubjT<U>
          : U extends ObjectSchema
            ? Con_ObjectSchema_SubjT<U>
            : U extends UnionSchema
              ? Con_UnionSchema_SubjT<U>
              : never
      : never
  >

export type Con_Schema_SubjT<T extends Schema> = T extends PrimitiveSchema
  ? Con_PrimitiveSchema_SubjT<T>
  : T extends ArraySchema
    ? Con_ArraySchema_SubjT<T>
    : T extends ObjectSchema
      ? Con_ObjectSchema_SubjT<T>
      : T extends UnionSchema
        ? Con_UnionSchema_SubjT<T>
        : never

export type SubjectType<T extends { __schema: Schema } | Schema> = T extends {
  __schema: Schema
}
  ? Con_Schema_SubjT<T['__schema']>
  : T extends Schema
    ? Con_Schema_SubjT<T>
    : never
