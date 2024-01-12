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

export type PrimitiveSchema =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | BufferSchema
  | StringLiteralSchema
  | NumberLiteralSchema
  | StringUnionSchema
  | NumberUnionSchema

export type InferOptionality<T extends { optional?: boolean }, U> = T extends {
  optional: true
}
  ? U | undefined
  : U

export type InferPrimitiveSchemaType<T extends PrimitiveSchema> = T extends {
  type: 'string'
}
  ? InferOptionality<T, string>
  : T extends { type: 'number' }
    ? InferOptionality<T, number>
    : T extends { type: 'boolean' }
      ? InferOptionality<T, boolean>
      : T extends { type: 'buffer' }
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

export type ArraySchema<T extends PrimitiveSchema = PrimitiveSchema> = {
  type: 'array'
  of: T
  minLength?: number /* >= */
  maxLength?: number /* <= */
  optional?: boolean
} & SharedSchema

export type InferArraySchemaType<T extends ArraySchema = ArraySchema> =
  T extends { of: infer U; optional?: boolean }
    ? U extends PrimitiveSchema
      ? InferOptionality<T, Array<NonNullable<InferPrimitiveSchemaType<U>>>>
      : never
    : never

export type ObjectSchema<
  T extends Record<string, PrimitiveSchema | ArraySchema> = Record<
    string,
    PrimitiveSchema | ArraySchema
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
          : U[k] extends ArraySchema
            ? InferArraySchemaType<U[k]>
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

export type CompoundSchema = ArraySchema | ObjectSchema | ObjectArraySchema

export type Schema = PrimitiveSchema | CompoundSchema

type InferCompoundSchemaType<T extends CompoundSchema> = T extends ArraySchema
  ? InferArraySchemaType<T>
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
