import type { InferOptionality } from './shared'
import type * as PrimitiveDetailed from './primitive-detailed-types'

export type SharedSchema = {
  description?: string
  maxSizeBytes?: number /* <= */
}

export type BaseSchema<T = unknown> =
  | ({ default?: T; optional?: never } & SharedSchema)
  | ({ optional?: boolean } & SharedSchema)

export type StringSchema = BaseSchema<string> & {
  type: 'string'
  minLength?: number /* >= */
  maxLength?: number /* <= */
}

export type NumberSchema = BaseSchema<number> & {
  type: 'number'
  min?: number /* >= */
  max?: number /* <= */
}

export type BooleanSchema = BaseSchema<boolean> & {
  type: 'boolean'
}

export type BufferSchema = BaseSchema<Buffer> & {
  type: 'buffer'
}

export type StringLiteralSchema<T extends string = string> = BaseSchema<T> & {
  type: 'stringLiteral'
  of: T
}

export type NumberLiteralSchema<T extends number = number> = BaseSchema<T> & {
  type: 'numberLiteral'
  of: T
}

export type StringUnionSchema<T extends string = string> = BaseSchema<T> & {
  type: 'stringUnion'
  of: Array<T>
}

export type NumberUnionSchema<T extends number = number> = BaseSchema<T> & {
  type: 'numberUnion'
  of: Array<T>
}
export type PrimitiveSchemaObject =
  | PrimitiveDetailed.StringSchema
  | PrimitiveDetailed.NumberSchema
  | PrimitiveDetailed.BooleanSchema
  | PrimitiveDetailed.BufferSchema
  | StringLiteralSchema
  | NumberLiteralSchema
  | PrimitiveDetailed.StringUnionSchema
  | PrimitiveDetailed.NumberUnionSchema

export type InferPrimitiveSchemaObjectType<T extends PrimitiveSchema> =
  T extends PrimitiveSchemaShorthand
    ? InferPrimitiveSchemaShorthandType<T>
    : T extends StringSchema
      ? InferOptionality<T, string>
      : T extends NumberSchema
        ? InferOptionality<T, number>
        : T extends BooleanSchema
          ? InferOptionality<T, boolean>
          : T extends BufferSchema
            ? InferOptionality<T, Buffer>
            : T extends StringLiteralSchema<infer U>
              ? InferOptionality<T, U>
              : T extends NumberLiteralSchema<infer V>
                ? InferOptionality<T, V>
                : T extends StringUnionSchema<infer W>
                  ? InferOptionality<T, W>
                  : T extends NumberUnionSchema<infer X>
                    ? InferOptionality<T, X>
                    : never

/* PrimitiveSchemaShorthand */

export type RequiredPrimitiveSchemaShorthand =
  | 'string'
  | 'number'
  | 'boolean'
  | 'buffer'

export type OptionalPrimitiveSchemaShorthand =
  | 'string?'
  | 'number?'
  | 'boolean?'
  | 'buffer?'

export type PrimitiveSchemaShorthand =
  | RequiredPrimitiveSchemaShorthand
  | OptionalPrimitiveSchemaShorthand

export type PrimitiveSchema = PrimitiveSchemaShorthand | PrimitiveSchemaObject

type InferPrimitiveSchemaShorthandType<T extends PrimitiveSchemaShorthand> =
  T extends 'string'
    ? string
    : T extends 'string?'
      ? string | undefined
      : T extends 'number'
        ? number
        : T extends 'number?'
          ? number | undefined
          : T extends 'boolean'
            ? boolean
            : T extends 'boolean?'
              ? boolean | undefined
              : T extends 'buffer'
                ? Buffer
                : T extends 'buffer?'
                  ? Buffer | undefined
                  : never

export type InferPrimitiveSchemaType<T extends PrimitiveSchema> =
  T extends PrimitiveSchemaShorthand
    ? InferPrimitiveSchemaShorthandType<T>
    : T extends StringSchema
      ? InferOptionality<T, string>
      : T extends NumberSchema
        ? InferOptionality<T, number>
        : T extends BooleanSchema
          ? InferOptionality<T, boolean>
          : T extends BufferSchema
            ? InferOptionality<T, Buffer>
            : T extends StringLiteralSchema<infer U>
              ? InferOptionality<T, U>
              : T extends NumberLiteralSchema<infer V>
                ? InferOptionality<T, V>
                : T extends StringUnionSchema<infer W>
                  ? InferOptionality<T, W>
                  : T extends NumberUnionSchema<infer X>
                    ? InferOptionality<T, X>
                    : never

export type ArraySchemaObject<T extends PrimitiveSchema = PrimitiveSchema> = {
  type: 'array'
  of: T
  minLength?: number /* >= */
  maxLength?: number /* <= */
  optional?: boolean
} & SharedSchema

export type ArraySchemaShorthand<T extends PrimitiveSchema = PrimitiveSchema> =
  [T]

export type ArraySchema<T extends PrimitiveSchema = PrimitiveSchema> =
  | ArraySchemaObject<T>
  | ArraySchemaShorthand<T>

export type InferArraySchemaShorthand<
  T extends ArraySchemaShorthand = ArraySchemaShorthand,
> = T extends [infer U]
  ? U extends PrimitiveSchema
    ? Array<NonNullable<InferPrimitiveSchemaType<U>>>
    : never
  : never

export type InferArraySchemaObjectType<
  T extends ArraySchemaObject = ArraySchemaObject,
> = T extends ArraySchemaObject<infer U>
  ? U extends PrimitiveSchema
    ? InferOptionality<T, Array<NonNullable<InferPrimitiveSchemaType<U>>>>
    : never
  : never

export type ObjectSchema<
  T extends Record<string, PrimitiveSchema | ArraySchemaObject> = Record<
    string,
    PrimitiveSchema | ArraySchemaObject
  >,
> = {
  type: 'object'
  of: T
  optional?: boolean
} & SharedSchema

export type InferObjectSchemaType<T extends ObjectSchema> = T extends {
  of: infer U
}
  ? InferOptionality<
      T,
      {
        [k in keyof U]: U[k] extends PrimitiveSchema
          ? InferPrimitiveSchemaType<U[k]>
          : U[k] extends ArraySchemaObject
            ? InferArraySchemaObjectType<U[k]>
            : never
      }
    >
  : never

export type ObjectArraySchema<T extends ObjectSchema = ObjectSchema> = {
  type: 'objectArray'
  of: T
  optional?: boolean
  minLength?: number /* >= */
  maxLength?: number /* <= */
} & SharedSchema

export type InferObjectArraySchemaType<T extends ObjectArraySchema> =
  T extends {
    of: infer U
  }
    ? U extends ObjectSchema
      ? InferOptionality<T, NonNullable<InferObjectSchemaType<U>>[]>
      : never
    : never

export type CompoundSchema =
  | ArraySchemaObject
  | ObjectSchema
  | ObjectArraySchema

export type Schema = PrimitiveSchema | CompoundSchema

type InferCompoundSchemaType<T extends CompoundSchema> =
  T extends ArraySchemaObject
    ? InferArraySchemaObjectType<T>
    : T extends ObjectSchema
      ? InferObjectSchemaType<T>
      : T extends ObjectArraySchema
        ? InferObjectArraySchemaType<T>
        : never

export type InferSchemaType<T extends Schema> = T extends PrimitiveSchema
  ? InferPrimitiveSchemaType<T>
  : T extends CompoundSchema
    ? InferCompoundSchemaType<T>
    : never

export { InferOptionality } from './shared'
