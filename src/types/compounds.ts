import type { PrimitiveSchema, Con_PrimitiveSchema_SubjT } from './primitives'
import type { ExtWith_SchemaParams_SubjT } from './extensions'

type BaseObjectSchema<T> = {
  type: 'object'
  of: Record<string, T>

  optional?: boolean
  nullable?: boolean

  description?: string
}

type BaseArraySchema<T> = {
  type: 'array'
  of: T

  optional?: boolean
  nullable?: boolean

  description?: string
  minLength?: number
  maxLength?: number
}

// TODO: `discriminant` key as performance optimization measure
type BaseUnionSchema<T> = {
  type: 'union'
  of: Readonly<Array<T>>

  optional?: boolean
  nullable?: boolean

  description?: string
}

export type R<T> =
  | T
  | BaseObjectSchema<T>
  | BaseArraySchema<T>
  | BaseUnionSchema<T>

/* 7 layers of compound schema nesting is allowed */
export type NestedSchema = R<R<R<R<R<R<PrimitiveSchema>>>>>>

/*
 * Schema without one layer or recursion.
 * Required for programmatic compound struct definition.
 **/
export type NestedStructSchema = R<R<R<R<R<PrimitiveSchema>>>>>

export type ArraySchema<T extends NestedSchema = NestedSchema> =
  BaseArraySchema<T>

export type ObjectSchema<T extends NestedSchema = NestedSchema> =
  BaseObjectSchema<T>

export type UnionSchema<T extends NestedSchema = NestedSchema> =
  BaseUnionSchema<T>

export type CompoundSchema = ObjectSchema | ArraySchema | UnionSchema
export type Schema = PrimitiveSchema | CompoundSchema

export type StructSchema =
  | ArraySchema<NestedStructSchema>
  | ObjectSchema<NestedStructSchema>
  | UnionSchema<NestedStructSchema>
  | PrimitiveSchema

// TODO: move all constructors to `src/types/constructors.ts` file

/* Construct ArraySchema subject type */

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

/* Construct ObjectSchema subject type */

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

/* Construct UnionSchema subject type */

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

/* Construct Schema subject type */

export type Con_Schema_SubjT<T extends Schema> = T extends PrimitiveSchema
  ? Con_PrimitiveSchema_SubjT<T>
  : T extends ArraySchema
    ? Con_ArraySchema_SubjT<T>
    : T extends ObjectSchema
      ? Con_ObjectSchema_SubjT<T>
      : T extends UnionSchema
        ? Con_UnionSchema_SubjT<T>
        : never

/* Construct Schema subject type from schema or schema struct */

export type SubjectType<T extends { __schema: Schema } | Schema> = T extends {
  __schema: Schema
}
  ? Con_Schema_SubjT<T['__schema']>
  : T extends Schema
    ? Con_Schema_SubjT<T>
    : never
