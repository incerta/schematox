import type {
  BD_Schema,
  Con_BD_Schema_SubjT_P,
  Con_BD_Schema_SubjT_V,
} from './base-detailed-schema-types'

export type BaseSchema = BD_Schema
export type CompoundSchema = ObjectSchema | ArraySchema
export type Schema = BaseSchema | CompoundSchema

type R<T> =
  | T
  | ({ type: 'array'; of: T } & ArrSchemaOptProps)
  | ({ type: 'object'; of: Record<string, T> } & ObjSchemaOptProps)

/* 7 layers of compound schema nesting is allowed */
type NestedSchema = R<R<R<R<R<R<BaseSchema>>>>>>

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

// TODO: get rid of this intermediate type when the following issue is ready:
//       "Remove support of default value on the schema level"
//       https://github.com/incerta/schematox/issues/14
export type Con_BaseSchema_SubjT_P<T extends BaseSchema> =
  Con_BD_Schema_SubjT_P<T>
export type Con_BaseSchema_SubjT_V<T extends BaseSchema> =
  Con_BD_Schema_SubjT_V<T>

/* Compound schema utility types */

export type ExtWith_CompoundSchemaOptionality<
  T extends { optional?: boolean },
  U,
> = T extends { optional: true } ? U | undefined : U

/* Construct ArraySchema subject type */

export type Con_ArraySchema_SubjT_P<T extends ArraySchema> =
  ExtWith_CompoundSchemaOptionality<
    T,
    T extends { of: infer U }
      ? U extends BaseSchema
        ? Array<Con_BaseSchema_SubjT_P<U>>
        : U extends ArraySchema
          ? Array<Con_ArraySchema_SubjT_P<U>>
          : U extends ObjectSchema
            ? Array<Con_ObjectSchema_SubjT_P<U>>
            : never
      : never
  >

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

export type Con_ObjectSchema_SubjT_P<T extends ObjectSchema> =
  ExtWith_CompoundSchemaOptionality<
    T,
    T extends {
      of: infer U
    }
      ? {
          -readonly [k in keyof U]: U[k] extends BaseSchema
            ? Con_BaseSchema_SubjT_P<U[k]>
            : U[k] extends ObjectSchema
              ? Con_ObjectSchema_SubjT_P<U[k]>
              : U[k] extends ArraySchema
                ? Con_ArraySchema_SubjT_P<U[k]>
                : never
        }
      : never
  >

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

export type Con_Schema_SubjT_P<T extends Schema> = T extends BaseSchema
  ? Con_BaseSchema_SubjT_P<T>
  : T extends ArraySchema
    ? Con_ArraySchema_SubjT_P<T>
    : T extends ObjectSchema
      ? Con_ObjectSchema_SubjT_P<T>
      : never

export type Con_Schema_SubjT_V<T extends Schema> = T extends BaseSchema
  ? Con_BaseSchema_SubjT_V<T>
  : T extends ArraySchema
    ? Con_ArraySchema_SubjT_V<T>
    : T extends ObjectSchema
      ? Con_ObjectSchema_SubjT_V<T>
      : never
