/**
 * @example ['idFor', 'User'] -> T & { __idFor: 'User' }
 **/
export type BrandSchema = Readonly<[__key: string, __keyFor: string]>

export type BD_String = {
  type: 'string'
  optional?: boolean

  description?: string
  brand?: BrandSchema

  minLength?: number /* >= */
  maxLength?: number /* <= */
}

export type BD_Number = {
  type: 'number'
  optional?: boolean

  description?: string
  brand?: BrandSchema

  min?: number /* >= */
  max?: number /* <= */
}

export type BD_Boolean = {
  type: 'boolean'
  optional?: boolean

  description?: string
  brand?: BrandSchema
}

export type BD_Literal<T extends string | number = string | number> = {
  type: 'literal'
  of: T
  optional?: boolean

  description?: string
  brand?: BrandSchema
}

export type BD_Schema = BD_String | BD_Number | BD_Boolean | BD_Literal

export type Con_BD_Schema_TypeOnly_SubjT<T extends BD_Schema> =
  T extends BD_String
    ? string
    : T extends BD_Number
      ? number
      : T extends BD_Boolean
        ? boolean
        : T extends BD_Literal<infer U>
          ? U
          : never

export type Con_BrandSchema_SubjT<T extends BrandSchema> = T extends Readonly<
  [infer U, infer V]
>
  ? U extends string
    ? { [k in `__${U}`]: V }
    : never
  : never

export type ExtWith_BrandSchema_SubjT<T extends BD_Schema, U> = T extends {
  brand: infer V
}
  ? V extends BrandSchema
    ? Con_BrandSchema_SubjT<V> & U
    : never
  : U

export type ExtWith_BD_OptionalSchema_SubjT_V<
  T extends BD_Schema,
  U,
> = T extends { optional: true } ? U | undefined : U

export type Con_BD_Schema_SubjT_V<
  T extends BD_Schema,
  U = Con_BD_Schema_TypeOnly_SubjT<T>,
> = ExtWith_BD_OptionalSchema_SubjT_V<T, ExtWith_BrandSchema_SubjT<T, U>>
