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
  RecordSchema,
  UnionSchema,
  Schema,
} from './compounds'

import type {
  ExtWith_SchemaParams_SubjT,
  ExtWith_Brand_SubjT,
} from './extensions'

export type Con_PrimitiveSchema_SubjT<T extends PrimitiveSchema> =
  T extends StringSchema
    ? string
    : T extends NumberSchema
      ? number
      : T extends BooleanSchema
        ? boolean
        : T extends LiteralSchema<infer U>
          ? U
          : never

export type Con_ArraySchema_SubjT<T extends ArraySchema> = T extends {
  of: infer U
}
  ? U extends Schema
    ? Array<Con_Schema_SubjT<U>>
    : never
  : never

export type Prettify<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K]
} & {}

/**
 * ```MakeOptional{ x: T | undefined, y: T }```
 *
 * will make:
 *
 * ```{ x?: T | undefined, y: T }```
 *
 * NOTE: `Exclude<T[K], undefined> will not work
 *       so we have technical constraint here
 **/
export type MakeOptional<T> = Prettify<
  {
    [K in keyof T as undefined extends T[K] ? K : never]?: T[K]
  } & {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K]
  }
>

export type Con_ObjectSchema_SubjT<T extends ObjectSchema> = T extends {
  of: infer U
}
  ? MakeOptional<{
      -readonly [k in keyof U]: U[k] extends Schema
        ? Con_Schema_SubjT<U[k]>
        : never
    }>
  : never

export type Con_RecordSchema_SubjT<T extends RecordSchema> = T extends {
  key?: infer U
  of: infer V
}
  ? Record<
      U extends StringSchema
        ? ExtWith_Brand_SubjT<U, Con_PrimitiveSchema_SubjT<U>>
        : string,
      V extends Schema ? Con_Schema_SubjT<V> | undefined : never
    >
  : never

export type Con_UnionSchema_SubjT<T extends UnionSchema> = T extends {
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
        : T extends RecordSchema
          ? Con_RecordSchema_SubjT<T>
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
