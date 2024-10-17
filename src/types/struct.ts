import type { Either } from '../utils/fp'
import type { ParsingError } from '../error'

import type {
  StringSchema,
  NumberSchema,
  BooleanSchema,
  LiteralSchema,
} from './primitives'

import type {
  Schema,
  ObjectSchema,
  ArraySchema,
  UnionSchema,
} from './compounds'

import type { Con_Schema_SubjT } from './constructors'

type StructMethods<T extends Schema> = {
  parse: (s: unknown) => Either<ParsingError, Con_Schema_SubjT<T>>
  validate: (s: unknown) => Either<ParsingError, Con_Schema_SubjT<T>>
  guard: (subject: unknown) => subject is Con_Schema_SubjT<T>
}

type ExtractParams<T extends Schema> = Exclude<keyof T, 'type' | 'of'>

type ParamsBySchemaType = {
  string: ExtractParams<StringSchema>
  number: ExtractParams<NumberSchema>
  boolean: ExtractParams<BooleanSchema>
  literal: ExtractParams<LiteralSchema>
  object: ExtractParams<ObjectSchema>
  union: ExtractParams<UnionSchema>
  array: ExtractParams<ArraySchema>
}

export type StructParams = ParamsBySchemaType extends Record<string, infer U>
  ? U
  : never

export type Struct<T extends Schema> = Omit<
  Pick<
    {
      optional: () => Struct<T & { optional: true }>
      nullable: () => Struct<T & { nullable: true }>

      brand: <V extends string, W extends string>(
        key: V,
        value: W
      ) => Struct<T & { brand: Readonly<[V, W]> }>

      minLength: <U extends number>(
        minLength: U
      ) => Struct<T & { minLength: U }>
      maxLength: <U extends number>(
        maxLength: U
      ) => Struct<T & { maxLength: U }>

      min: <U extends number>(min: U) => Struct<T & { min: U }>
      max: <U extends number>(max: U) => Struct<T & { max: U }>

      description: <U extends string>(
        description: U
      ) => Struct<T & { description: U }>
    },
    ParamsBySchemaType[T['type']]
  >,
  keyof T
> & { __schema: Readonly<T> } & StructMethods<T>
