import { ExtWith_SchemaParams_SubjT } from './extensions'

/**
 * @example ['idFor', 'User'] -> T & { __idFor: 'User' }
 **/
export type BrandSchema = Readonly<[string, string]>

export type StringSchema = {
  type: 'string'

  optional?: boolean
  nullable?: boolean

  description?: string
  brand?: BrandSchema

  minLength?: number /* >= */
  maxLength?: number /* <= */
}

export type NumberSchema = {
  type: 'number'

  optional?: boolean
  nullable?: boolean

  description?: string
  brand?: BrandSchema

  min?: number /* >= */
  max?: number /* <= */
}

export type BooleanSchema = {
  type: 'boolean'

  optional?: boolean
  nullable?: boolean

  description?: string
  brand?: BrandSchema
}

export type LiteralSchema<T extends string | number = string | number> = {
  type: 'literal'
  of: T

  optional?: boolean
  nullable?: boolean

  description?: string
  brand?: BrandSchema
}

export type PrimitiveSchema =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | LiteralSchema

export type Con_PrimitiveSchema_TypeOnly_SubjT<T extends PrimitiveSchema> =
  T extends StringSchema
    ? string
    : T extends NumberSchema
      ? number
      : T extends BooleanSchema
        ? boolean
        : T extends LiteralSchema<infer U>
          ? U
          : never

export type Con_PrimitiveSchema_SubjT<
  T extends PrimitiveSchema,
  U = Con_PrimitiveSchema_TypeOnly_SubjT<T>,
  V = ExtWith_SchemaParams_SubjT<T, U>,
> = V
