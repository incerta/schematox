import type { BS_Schema, Con_BS_Schema_SubjT } from './base-short-schema-types'
import type {
  BD_Schema,
  Con_BD_Schema_SubjT_P,
  Con_BD_Schema_SubjT_V,
} from './base-detailed-schema-types'

export type PrimitiveSchema = BS_Schema | BD_Schema

export type Con_BaseSchema_SubjT_P<T extends PrimitiveSchema> =
  T extends BS_Schema
    ? Con_BS_Schema_SubjT<T>
    : T extends BD_Schema
      ? Con_BD_Schema_SubjT_P<T>
      : never

export type Con_BaseSchema_SubjT_V<T extends PrimitiveSchema> =
  T extends BS_Schema
    ? Con_BS_Schema_SubjT<T>
    : T extends BD_Schema
      ? Con_BD_Schema_SubjT_V<T>
      : never

/* ArraySchema */

export type ArraySchemaDetailed<T extends PrimitiveSchema = PrimitiveSchema> = {
  type: 'array'
  of: T

  optional?: boolean
  description?: string
  minLength?: number /* >= */
  maxLength?: number /* <= */
}

type ArrSD<T> = PrimitiveSchema | ObjectSchema | [T]

export type ArraySchemaShort<
  T extends PrimitiveSchema | ObjectSchema | ArraySchemaShort = ArrSD<
    ArrSD<ArrSD<ArrSD<ArrSD<ArrSD<ArrSD<never>>>>>>
  >,
> = [T]

export type ConstructArraySchemaShortSubjectType<T extends ArraySchemaShort> =
  T extends [infer U]
    ? U extends PrimitiveSchema
      ? Array<NonNullable<Con_BaseSchema_SubjT_V<U>>>
      : U extends ObjectSchema
        ? Array<ConstructObjectSchemaSubjectTypeParsed<U>>
        : U extends ArraySchemaShort
          ? Array<ConstructArraySchemaShortSubjectType<U>>
          : never
    : never

export type ConstructArraySchemaDetailedSubjectType<
  T extends ArraySchemaDetailed,
> = T extends ArraySchemaDetailed<infer U>
  ? U extends PrimitiveSchema
    ? T extends { optional: true }
      ? ConstructArraySchemaShortSubjectType<[U]> | undefined
      : ConstructArraySchemaShortSubjectType<[U]>
    : never
  : never

export type ArraySchema<T extends PrimitiveSchema = PrimitiveSchema> =
  | ArraySchemaDetailed<T>
  | ArraySchemaShort<T>

export type ConstructArraySchemaSubjectType<T extends ArraySchema> =
  T extends ArraySchemaShort
    ? ConstructArraySchemaShortSubjectType<T>
    : T extends ArraySchemaDetailed
      ? ConstructArraySchemaDetailedSubjectType<T>
      : never

export type Schema = PrimitiveSchema | ArraySchema | ObjectSchema

/* ObjectSchema */

type ObjR<T> = Record<string, PrimitiveSchema | ArraySchema | T>

export type ObjectSchema<
  T extends Record<string, Schema> = ObjR<
    ObjR<ObjR<ObjR<ObjR<ObjR<ObjR<ObjR<never>>>>>>>
  >,
> = T

export type Prettify<T> = {
  [k in keyof T]: T[k]
}

export type ConstructObjectSchemaSubjectTypeParsed<T extends ObjectSchema> =
  Prettify<{
    [k in keyof T]: T[k] extends PrimitiveSchema
      ? Con_BaseSchema_SubjT_P<T[k]>
      : T[k] extends ArraySchema
        ? ConstructArraySchemaSubjectType<T[k]>
        : T[k] extends ObjectSchema
          ? ConstructObjectSchemaSubjectTypeParsed<T[k]>
          : never
  }>
