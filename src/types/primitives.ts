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

export type LiteralSchema<
  T extends string | number | boolean = string | number | boolean,
> = {
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
