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

/* 12 layers of compound schema nesting is allowed */
export type NestedSchema = R/*0*/ <
  R/*1*/ <
    R/*2*/ <
      R/*3*/ <
        R/*4*/ <
          R/*5*/ <
            R/*6*/ <
              R/*7*/ <
                R/*8*/ <R/*9*/ <R/*10*/ <R/*11*/ <R/*12*/ <PrimitiveSchema>>>>>
              >
            >
          >
        >
      >
    >
  >
>

/*
 * Schema without one layer or recursion.
 * Required for programmatic compound struct definition.
 **/
export type NestedStructSchema = R/*1*/ <
  R/*2*/ <
    R/*3*/ <
      R/*4*/ <
        R/*5*/ <
          R/*6*/ <
            R/*7*/ <R/*8*/ <R/*9*/ <R/*10*/ <R/*11*/ <PrimitiveSchema>>>>>
          >
        >
      >
    >
  >
>

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
