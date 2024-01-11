export type SchemaShared = {
  description?: string
  maxSizeBytes?: number /* <= */
}

export type SchemaBase<T = unknown> =
  | ({ default?: T; optional?: never } & SchemaShared)
  | ({ optional?: boolean } | SchemaShared)

export type StringSchema = SchemaBase<string> & {
  type: 'string'
  minLength?: number /* >= */
  maxLength?: number /* <= */
}

export type NumberSchema = SchemaBase<number> & {
  type: 'number'
  min?: number /* >= */
  max?: number /* <= */
}

export type BooleanSchema = SchemaBase<boolean> & {
  type: 'boolean'
}

export type BufferSchema = SchemaBase<Buffer> & {
  type: 'buffer'
}

export type StringLiteralSchema<T extends string = string> = SchemaBase<T> & {
  type: 'stringLiteral'
  of: T
}

export type NumberLiteralSchema<T extends number = number> = SchemaBase<T> & {
  type: 'numberLiteral'
  of: T
}

export type StringUnionSchema<T extends string = string> = SchemaBase<T> & {
  type: 'stringUnion'
  of: Array<T>
}

export type NumberUnionSchema<T extends number = number> = SchemaBase<T> & {
  type: 'numberUnion'
  of: Array<T>
}

export type Schema =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | BufferSchema
  | StringLiteralSchema
  | NumberLiteralSchema
  | StringUnionSchema
  | NumberUnionSchema

export type InferOptionality<T extends Schema, U> = T extends {
  optional: true
}
  ? U | undefined
  : U

export type InferPrimitiveSchemaType<T extends Schema> = T extends {
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
