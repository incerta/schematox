export type StringSchemaRequired = 'string'
export type StringSchemaOptional = 'string?'

export type NumberSchemaRequired = 'number'
export type NumberSchemaOptional = 'number?'

export type BooleanSchemaRequired = 'boolean'
export type BooleanSchemaOptional = 'boolean?'

export type BufferSchemaRequired = 'buffer'
export type BufferSchemaOptional = 'buffer?'

export type SchemaRequired =
  | StringSchemaRequired
  | NumberSchemaRequired
  | BooleanSchemaRequired
  | BufferSchemaRequired

export type SchemaOptional =
  | StringSchemaOptional
  | NumberSchemaOptional
  | BooleanSchemaOptional
  | BufferSchemaOptional

export type Schema = SchemaRequired | SchemaOptional

export type ConstructSchemaRequiredSubjectType<T extends SchemaRequired> =
  T extends StringSchemaRequired
    ? string
    : T extends NumberSchemaRequired
      ? number
      : T extends BooleanSchemaRequired
        ? boolean
        : T extends BufferSchemaRequired
          ? Buffer
          : never

export type ConstructSchemaOptionalSubjectType<T extends SchemaOptional> =
  T extends StringSchemaOptional
    ? string | undefined
    : T extends NumberSchemaOptional
      ? number | undefined
      : T extends BooleanSchemaOptional
        ? boolean | undefined
        : T extends BufferSchemaOptional
          ? Buffer | undefined
          : never

export type ConstructSchemaSubjectType<T extends Schema> =
  T extends SchemaRequired
    ? ConstructSchemaRequiredSubjectType<T>
    : T extends SchemaOptional
      ? ConstructSchemaOptionalSubjectType<T>
      : never
