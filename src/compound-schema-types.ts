import type { BS_Schema, Con_BS_Schema_SubjT } from './base-short-schema-types'
import type {
  BD_Schema,
  Con_BD_Schema_SubjT_P,
  Con_BD_Schema_SubjT_V,
} from './base-detailed-schema-types'

/* BaseSchema */

export type BaseSchema = BS_Schema | BD_Schema

/* ArraySchema */

export type CD_Array<T extends BaseSchema = BaseSchema> = {
  type: 'array'
  of: T

  optional?: boolean
  description?: string
  minLength?: number /* >= */
  maxLength?: number /* <= */
}

type ArrR<T> = BaseSchema | ObjectSchema | [T]

export type CS_Array<
  T extends BaseSchema | ObjectSchema | CS_Array = ArrR<
    ArrR<ArrR<ArrR<ArrR<ArrR<ArrR<never>>>>>>
  >,
> = [T]

export type ArraySchema<T extends BaseSchema = BaseSchema> =
  | CD_Array<T>
  | CS_Array<T>

/* ObjectSchema */

// TODO: add `CS_Object` and `CD_Object` (current `ObjectSchema` is actually `CS_Object`)

type ObjR<T> = Record<string, BaseSchema | ArraySchema | T>

export type ObjectSchema<
  T extends Record<string, Schema> = ObjR<
    ObjR<ObjR<ObjR<ObjR<ObjR<ObjR<ObjR<never>>>>>>>
  >,
> = T

/* Schema */

export type Schema = BaseSchema | ArraySchema | ObjectSchema

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

/* Construct ArraySchema subject type */

// TODO: add or replace with `Con_CS_Array_SubjT_P`, `Con_CS_Array_SubjT_V`, `Con_CD_Array_SubjT_P`, `Con_CD_Array_SubjT_V`

export type Con_CS_Array_SubjT<T extends CS_Array> = T extends [infer U]
  ? U extends BaseSchema
    ? Array<NonNullable<Con_BaseSchema_SubjT_V<U>>>
    : U extends ObjectSchema
      ? Array<Con_ObjectSchema_SubjT_P<U>>
      : U extends CS_Array
        ? Array<Con_CS_Array_SubjT<U>>
        : never
  : never

export type Con_CD_Array_SubjT<T extends CD_Array> = T extends CD_Array<infer U>
  ? U extends BaseSchema
    ? T extends { optional: true }
      ? Con_CS_Array_SubjT<[U]> | undefined
      : Con_CS_Array_SubjT<[U]>
    : never
  : never

export type Con_ArraySchema_SubjT<T extends ArraySchema> = T extends CS_Array
  ? Con_CS_Array_SubjT<T>
  : T extends CD_Array
    ? Con_CD_Array_SubjT<T>
    : never

/* Construct ObjectSchema subject type */

// TODO: add `Con_CS_Object_SubjT_P`, `Con_CS_Object_SubjT_V`, `Con_CD_Object_SubjT_P`, `Con_CD_Object_SubjT_V`

export type Prettify_ObjectSchema_SubjT<T> = {
  [k in keyof T]: T[k]
}

export type Con_ObjectSchema_SubjT_P<T extends ObjectSchema> =
  Prettify_ObjectSchema_SubjT<{
    [k in keyof T]: T[k] extends BaseSchema
      ? Con_BaseSchema_SubjT_P<T[k]>
      : T[k] extends ArraySchema
        ? Con_ArraySchema_SubjT<T[k]>
        : T[k] extends ObjectSchema
          ? Con_ObjectSchema_SubjT_P<T[k]>
          : never
  }>

// TODO: add `Con_ObjectSchema_SubjT_V`

/* Construct Schema subject type (TBD) */

export type ConstructSchemaSubjectType_Validated<T extends Schema> =
  T extends unknown ? never : never
export type ConstructSchemaSubjectType_Parsed<T extends Schema> =
  T extends unknown ? never : never
