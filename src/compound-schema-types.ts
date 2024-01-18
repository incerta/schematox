import type { BS_Schema, Con_BS_Schema_SubjT } from './base-short-schema-types'
import type {
  BD_Schema,
  Con_BD_Schema_SubjT_P,
  Con_BD_Schema_SubjT_V,
} from './base-detailed-schema-types'

export type BaseSchema = BS_Schema | BD_Schema
export type CompoundSchema = ObjectSchema | ArraySchema
export type Schema = BaseSchema | CompoundSchema

type R<T> =
  | T
  | { type: 'array'; of: T }
  | { type: 'object'; of: Record<string, T> }

/* ArraySchema */

export type ArraySchema<T extends Schema = R<R<R<R<BaseSchema>>>>> = {
  type: 'array'
  of: T

  optional?: boolean
  description?: string
  minLength?: number /* >= */
  maxLength?: number /* <= */
}

/* ObjectSchema */

export type ObjectSchema<T extends Schema = R<R<R<R<BaseSchema>>>>> = {
  type: 'object'
  of: Record<string, T>

  optional?: boolean
  description?: string
}

/* Construct BaseSchema subject type */

export type Con_BaseSchema_SubjT_P<T extends BaseSchema> = T extends BS_Schema
  ? Con_BS_Schema_SubjT<T>
  : T extends BD_Schema
    ? Con_BD_Schema_SubjT_P<T>
    : never

export type Con_BaseSchema_SubjT_V<T extends BaseSchema> = T extends BS_Schema
  ? Con_BS_Schema_SubjT<T>
  : T extends BD_Schema
    ? Con_BD_Schema_SubjT_V<T>
    : never

/* Compound schema utility types */

export type ExtWith_CompoundSchemaOptionality<
  T extends { optional?: boolean },
  U,
> = T extends { optional: true } ? U | undefined : U

// TODO: should work as expected only if we add `& {}`
//        which is currently forbidden by our linter
export type Prettify_ObjectSchema_SubjT<T> = {
  [k in keyof T]: T[k]
}

/* Construct ArraySchema subject type */

export type Con_ArraySchema_SubjT_P<T extends ArraySchema> =
  ExtWith_CompoundSchemaOptionality<
    T,
    T extends { of: infer U }
      ? U extends BaseSchema
        ? Array<NonNullable<Con_BaseSchema_SubjT_P<U>>>
        : U extends ArraySchema
          ? Array<NonNullable<Con_ArraySchema_SubjT_P<U>>>
          : U extends ObjectSchema
            ? Array<NonNullable<Con_ObjectSchema_SubjT_P<U>>>
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
          [k in keyof U]: U[k] extends BaseSchema
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
          [k in keyof U]: U[k] extends BaseSchema
            ? Con_BaseSchema_SubjT_V<U[k]>
            : U[k] extends ObjectSchema
              ? Con_ObjectSchema_SubjT_V<U[k]>
              : U[k] extends ArraySchema
                ? Con_ArraySchema_SubjT_V<U[k]>
                : never
        }
      : never
  >

/* Construct Schema subject type (TBD) */
