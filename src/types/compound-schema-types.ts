import type {
  BD_Schema,
  Con_BD_Schema_SubjT_V,
} from './base-detailed-schema-types'

export type BaseSchema = BD_Schema
export type CompoundSchema = ObjectSchema | ArraySchema
export type Schema = BaseSchema | CompoundSchema

export type R<T> =
  | T
  | ({ type: 'array'; of: T } & ArrSchemaOptProps)
  | ({ type: 'object'; of: Record<string, T> } & ObjSchemaOptProps)

/* 7 layers of compound schema nesting is allowed */
export type NestedSchema = R<R<R<R<R<R<BaseSchema>>>>>>

/*
 * NestedSchemaLess is NestedSchema without one layer or recursion
 * Required for programmatic compound struct definition.
 **/
export type NestedSchemaLess = R<R<R<R<R<BaseSchema>>>>>
export type SchemaLess =
  | ArraySchema<NestedSchemaLess>
  | ObjectSchema<NestedSchemaLess>
  | BaseSchema

/* ArraySchema */

export type ArrSchemaOptProps = {
  optional?: boolean
  description?: string
  minLength?: number /* >= */
  maxLength?: number /* <= */
}

export type ArraySchema<T extends Schema = NestedSchema> = ArrSchemaOptProps & {
  type: 'array'
  of: T
}

/* ObjectSchema */

export type ObjSchemaOptProps = {
  optional?: boolean
  description?: string
}

export type ObjectSchema<T extends Schema = NestedSchema> =
  ObjSchemaOptProps & {
    type: 'object'
    of: Record<string, T>
  }

/* Construct BaseSchema subject type */

// FIXME: should be removed before submitting current PR
export type Con_BaseSchema_SubjT_V<T extends BaseSchema> =
  Con_BD_Schema_SubjT_V<T>

/* Compound schema utility types */

export type ExtWith_CompoundSchemaOptionality<
  T extends { optional?: boolean },
  U,
> = T extends { optional: true } ? U | undefined : U

/* Construct ArraySchema subject type */

export type Con_ArraySchema_SubjT_V<T extends ArraySchema> =
  ExtWith_CompoundSchemaOptionality<
    T,
    T extends { of: infer U }
      ? U extends BaseSchema
        ? Array<Con_BaseSchema_SubjT_V<U>>
        : U extends ArraySchema
          ? Array<Con_ArraySchema_SubjT_V<U>>
          : U extends ObjectSchema
            ? Array<Con_ObjectSchema_SubjT_V<U>>
            : never
      : never
  >

/* Construct ObjectSchema subject type */

export type Con_ObjectSchema_SubjT_V<T extends ObjectSchema> =
  ExtWith_CompoundSchemaOptionality<
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
                : never
        }
      : never
  >

/* Construct Schema subject type */

export type Con_Schema_SubjT_V<T extends Schema> = T extends BaseSchema
  ? Con_BaseSchema_SubjT_V<T>
  : T extends ArraySchema
    ? Con_ArraySchema_SubjT_V<T>
    : T extends ObjectSchema
      ? Con_ObjectSchema_SubjT_V<T>
      : never
