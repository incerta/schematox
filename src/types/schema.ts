export type SchemaShared = {
  optional?: boolean
  nullable?: boolean
  description?: string
}

// Compound schema code duplication exists due to generic type circularly reference limitation (ts 2456)
// prettier-ignore
export type Schema =
   | PrimitiveSchema
   | { type: 'array'; of: Schema; minLength?: number; maxLength?: number } & SchemaShared
   | { type: 'object'; of: Record<string, Schema> } & SchemaShared
   | { type: 'record'; of: Schema; key?: StringSchema } & SchemaShared
   | { type: 'tuple'; of: Array<Schema> } & SchemaShared
   | { type: 'union'; of: Array<Schema> } & SchemaShared

/**
 * Compound schema
 **/

export type ArraySchema<T = unknown> = SchemaShared & {
  type: 'array'
  of: T
  minLength?: number /* >= */
  maxLength?: number /* <= */
}

export type ObjectSchema<T = unknown> = SchemaShared & {
  type: 'object'
  of: T
}

export type RecordSchema<T = unknown> = SchemaShared & {
  type: 'record'
  of: T
  key?: StringSchema
}

export type TupleSchema<T = unknown> = SchemaShared & {
  type: 'tuple'
  of: T
}

export type UnionSchema<T = unknown> = SchemaShared & {
  type: 'union'
  of: T
}

/**
 * Primitive schema
 **/

/**
 * @example ['idFor', 'User'] -> T & { __idFor: 'User' }
 **/
export type BrandSchema = Readonly<[string, string]>

export type PrimitiveSchemaShared = SchemaShared & { brand?: BrandSchema }

export type PrimitiveSchema =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | LiteralSchema

export type BooleanSchema = PrimitiveSchemaShared & {
  type: 'boolean'
}

export type StringSchema = PrimitiveSchemaShared & {
  type: 'string'
  minLength?: number /* >= */
  maxLength?: number /* <= */
}

export type NumberSchema = PrimitiveSchemaShared & {
  type: 'number'
  min?: number /* >= */
  max?: number /* <= */
}

export type LiteralSchema<
  T extends string | number | boolean = string | number | boolean,
> = PrimitiveSchemaShared & {
  type: 'literal'
  of: T
}
