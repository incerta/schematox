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

type Con_PrimitiveSchema_SubjT<T extends PrimitiveSchema> =
  T extends StringSchema
    ? string
    : T extends NumberSchema
      ? number
      : T extends BooleanSchema
        ? boolean
        : T extends LiteralSchema<infer U>
          ? U
          : never

type Con_ArraySchema_SubjT<T extends ArraySchema> = T extends { of: infer U }
  ? U extends Schema
    ? Array<Con_Schema_SubjT<U>>
    : never
  : never

type Con_ObjectSchema_SubjT<T extends ObjectSchema> = T extends {
  of: infer U
}
  ? {
      -readonly [k in keyof U]: U[k] extends Schema
        ? Con_Schema_SubjT<U[k]>
        : never
    }
  : never

type Con_UnionSchema_SubjT<T extends UnionSchema> = T extends {
  type: 'union'
  of: Readonly<Array<infer U>>
}
  ? U extends Schema
    ? Con_Schema_SubjT<U>
    : never
  : never

export type Con_Schema_SubjT<T extends Schema> = ExtWith_SchemaParams_SubjT<
  T,
  T extends PrimitiveSchema
    ? Con_PrimitiveSchema_SubjT<T>
    : T extends ArraySchema
      ? Con_ArraySchema_SubjT<T>
      : T extends ObjectSchema
        ? Con_ObjectSchema_SubjT<T>
        : T extends UnionSchema
          ? Con_UnionSchema_SubjT<T>
          : never
>

export type SubjectType<T extends { __schema: Schema } | Schema> = T extends {
  __schema: Schema
}
  ? Con_Schema_SubjT<T['__schema']>
  : T extends Schema
    ? Con_Schema_SubjT<T>
    : never
