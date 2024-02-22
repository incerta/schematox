import type {
  BD_Schema,
  Con_BD_Schema_SubjT_V,
} from './base-detailed-schema-types'

import { ExtWith_SchemaParams_SubjT } from './extensions'

export type BaseSchema = BD_Schema

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
export type NestedSchema = R<R<R<R<R<R<BaseSchema>>>>>>

/*
 * Schema without one layer or recursion.
 * Required for programmatic compound struct definition.
 **/
export type NestedStructSchema = R<R<R<R<R<BaseSchema>>>>>

export type ArraySchema<T extends NestedSchema = NestedSchema> =
  BaseArraySchema<T>

export type ObjectSchema<T extends NestedSchema = NestedSchema> =
  BaseObjectSchema<T>

export type UnionSchema<T extends NestedSchema = NestedSchema> =
  BaseUnionSchema<T>

export type CompoundSchema = ObjectSchema | ArraySchema | UnionSchema
export type Schema = BaseSchema | CompoundSchema

export type StructSchema =
  | ArraySchema<NestedStructSchema>
  | ObjectSchema<NestedStructSchema>
  | UnionSchema<NestedStructSchema>
  | BaseSchema

// TODO: move all constructors to `src/types/constructors.ts` file

/* Construct BaseSchema subject type */

// FIXME: should be removed before submitting current PR
export type Con_BaseSchema_SubjT_V<T extends BaseSchema> =
  Con_BD_Schema_SubjT_V<T>

/* Construct ArraySchema subject type */

export type Con_ArraySchema_SubjT_V<T extends ArraySchema> =
  ExtWith_SchemaParams_SubjT<
    T,
    T extends { of: infer U }
      ? U extends BaseSchema
        ? Array<Con_BaseSchema_SubjT_V<U>>
        : U extends ArraySchema
          ? Array<Con_ArraySchema_SubjT_V<U>>
          : U extends ObjectSchema
            ? Array<Con_ObjectSchema_SubjT_V<U>>
            : U extends UnionSchema
              ? Array<Con_UnionSchema_SubjT_V<U>>
              : never
      : never
  >

/* Construct ObjectSchema subject type */

export type Con_ObjectSchema_SubjT_V<T extends ObjectSchema> =
  ExtWith_SchemaParams_SubjT<
    T,
    T extends {
      of: infer U
    }
      ? {
          -readonly [k in keyof U]: U[k] extends BaseSchema
            ? Con_BaseSchema_SubjT_V<U[k]>
            : U[k] extends ObjectSchema
              ? Con_ObjectSchema_SubjT_V<U[k]>
              : U[k] extends ArraySchema
                ? Con_ArraySchema_SubjT_V<U[k]>
                : U[k] extends UnionSchema
                  ? Con_UnionSchema_SubjT_V<U[k]>
                  : never
        }
      : never
  >

/* Construct UnionSchema subject type */

export type Con_UnionSchema_SubjT_V<T extends UnionSchema> =
  ExtWith_SchemaParams_SubjT<
    T,
    T extends {
      type: 'union'
      of: Array<infer U>
    }
      ? U extends BaseSchema
        ? Con_BaseSchema_SubjT_V<U>
        : U extends ArraySchema
          ? Con_ArraySchema_SubjT_V<U>
          : U extends ObjectSchema
            ? Con_ObjectSchema_SubjT_V<U>
            : U extends UnionSchema
              ? Con_UnionSchema_SubjT_V<U>
              : never
      : never
  >

/* Construct Schema subject type */

export type Con_Schema_SubjT_V<T extends Schema> = T extends BaseSchema
  ? Con_BaseSchema_SubjT_V<T>
  : T extends ArraySchema
    ? Con_ArraySchema_SubjT_V<T>
    : T extends ObjectSchema
      ? Con_ObjectSchema_SubjT_V<T>
      : T extends UnionSchema
        ? Con_UnionSchema_SubjT_V<T>
        : never

/* Construct Schema subject type from schema or schema struct */

export type SubjectType<T extends { __schema: Schema } | Schema> = T extends {
  __schema: Schema
}
  ? Con_Schema_SubjT_V<T['__schema']>
  : T extends Schema
    ? Con_Schema_SubjT_V<T>
    : never
