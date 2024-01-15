/**
 * @example ['idFor', 'User'] -> T & { __idFor: 'User' }
 **/
export type SchemaBrand = [__key: string, __keyFor: string]

export type StringSchema = {
  type: 'string'
  optional?: boolean

  default?: string
  description?: string
  brand?: SchemaBrand

  minLength?: number /* >= */
  maxLength?: number /* <= */
}

export type NumberSchema = {
  type: 'number'
  optional?: boolean

  default?: number
  description?: string
  brand?: SchemaBrand

  min?: number /* >= */
  max?: number /* <= */
}

export type BooleanSchema = {
  type: 'boolean'
  optional?: boolean

  default?: boolean
  description?: string
  brand?: SchemaBrand
}

export type BufferSchema = {
  type: 'buffer'
  optional?: boolean

  default?: string | number
  description?: string
  brand?: SchemaBrand

  minLength?: number /* >= */
  maxLength?: number /* <= */
}

export type StringUnionSchema<T extends string = string> = {
  type: 'stringUnion'
  of: Array<T>
  optional?: boolean
  default?: T

  description?: string
  brand?: SchemaBrand
}

export type NumberUnionSchema<T extends number = number> = {
  type: 'numberUnion'
  of: Array<T>
  default?: T

  optional?: boolean
  description?: string
  brand?: SchemaBrand
}

export type Schema =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | BufferSchema
  | StringUnionSchema
  | NumberUnionSchema

export type ConstructSchemaSubjectBaseType<T extends Schema> =
  T extends StringSchema
    ? string
    : T extends NumberSchema
      ? number
      : T extends BooleanSchema
        ? boolean
        : T extends BufferSchema
          ? Buffer
          : T extends StringUnionSchema<infer U>
            ? U
            : T extends NumberUnionSchema<infer V>
              ? V
              : never

export type ConstructBrandSchemaSubjectType<T extends SchemaBrand> = T extends [
  infer U,
  infer V,
]
  ? U extends string
    ? { [k in `__${U}`]: V }
    : never
  : never

export type ExtendWithBrandTypeOfSchema<T extends Schema, U> = T extends {
  brand: infer V
}
  ? V extends SchemaBrand
    ? ConstructBrandSchemaSubjectType<V> & U
    : never
  : U

export type ExtendWithOptionalityOfSchemaParsed<
  T extends Schema,
  U,
> = T extends {
  optional: true
}
  ? T extends { default: infer V }
    ? V extends undefined
      ? U | undefined
      : U
    : U | undefined
  : U

export type ConstructSchemaSubjectTypeParsed<
  T extends Schema,
  U = ConstructSchemaSubjectBaseType<T>,
> = ExtendWithOptionalityOfSchemaParsed<T, ExtendWithBrandTypeOfSchema<T, U>>

export type ExtendWithOptionalityOfSchemaValidated<
  T extends Schema,
  U,
> = T extends { optional: true } ? U | undefined : U

export type ConstructSchemaSubjectTypeValidated<
  T extends Schema,
  U = ConstructSchemaSubjectBaseType<T>,
> = ExtendWithOptionalityOfSchemaValidated<T, ExtendWithBrandTypeOfSchema<T, U>>
