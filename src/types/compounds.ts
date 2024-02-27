import type { PrimitiveSchema } from './primitives'

export type BaseObjectSchema<T> = {
  type: 'object'
  of: Record<string, T>

  optional?: boolean
  nullable?: boolean

  description?: string
}

export type BaseArraySchema<T> = {
  type: 'array'
  of: T

  optional?: boolean
  nullable?: boolean

  description?: string
  minLength?: number
  maxLength?: number
}

// TODO: `discriminant` key as performance optimization measure
export type BaseUnionSchema<T> = {
  type: 'union'
  of: Readonly<Array<T>>

  optional?: boolean
  nullable?: boolean

  description?: string
}

export type R<T> =
  | T
  | BaseObjectSchema<T>
  | BaseArraySchema<T>
  | BaseUnionSchema<T>

/* 7 layers of compound schema nesting is allowed */
export type NestedSchema = R<R<R<R<R<R<PrimitiveSchema>>>>>>

/*
 * Schema without one layer or recursion.
 * Required for programmatic compound struct definition.
 **/
export type NestedStructSchema = R<R<R<R<R<PrimitiveSchema>>>>>

export type ArraySchema<T extends NestedSchema = NestedSchema> =
  BaseArraySchema<T>

export type ObjectSchema<T extends NestedSchema = NestedSchema> =
  BaseObjectSchema<T>

export type UnionSchema<T extends NestedSchema = NestedSchema> =
  BaseUnionSchema<T>

export type CompoundSchema = ObjectSchema | ArraySchema | UnionSchema
export type Schema = PrimitiveSchema | CompoundSchema

export type StructSchema =
  | ArraySchema<NestedStructSchema>
  | ObjectSchema<NestedStructSchema>
  | UnionSchema<NestedStructSchema>
  | PrimitiveSchema
