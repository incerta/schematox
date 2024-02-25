import type { EitherError } from '../utils/fp'
import type { InvalidSubject } from '../error'

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
  parse: (s: unknown) => EitherError<InvalidSubject[], Con_Schema_SubjT<T>>
  validate: (s: unknown) => EitherError<InvalidSubject[], Con_Schema_SubjT<T>>
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

      minLength: (minLength: number) => Struct<T & { minLength: number }>
      maxLength: (maxLength: number) => Struct<T & { maxLength: number }>

      min: (min: number) => Struct<T & { min: number }>
      max: (max: number) => Struct<T & { max: number }>

      description: (description: string) => Struct<T & { description: string }>
    },
    ParamsBySchemaType[T['type']]
  >,
  keyof T
> & { __schema: Readonly<T> } & StructMethods<T>
