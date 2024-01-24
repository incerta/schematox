import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../error'

import type { BD_NumberUnion } from '../types/base-detailed-schema-types'

type ExtWith_Option<
  T extends BD_NumberUnion,
  U,
  V extends BD_NumberUnion = Readonly<T & U>,
> = {
  __schema: V
} & (V extends { optional: true }
  ? NumberUnionOptional<V>
  : NumberUnionRequired<V>)

type NumberUnionShared<T extends BD_NumberUnion> = {
  brand: <U extends string, V extends string>(
    key: U,
    value: V
  ) => ExtWith_Option<T, { brand: Readonly<[U, V]> }>

  description: (
    description: string
  ) => ExtWith_Option<T, { description: string }>
}

type NumberUnionOptional<T extends BD_NumberUnion> = Omit<
  {
    default: T extends { of: Readonly<Array<infer U>> }
      ? (defaultValue: U) => ExtWith_Option<T, { default: U }>
      : never
  } & NumberUnionShared<T>,
  keyof T
>

type NumberUnionRequired<T extends BD_NumberUnion> = Omit<
  {
    optional: () => ExtWith_Option<T, { optional: true }>
  } & NumberUnionShared<T>,
  keyof T
>

function numberUnionOptions<T extends BD_NumberUnion>(
  schema: T
): T extends { optional: true }
  ? NumberUnionOptional<T>
  : NumberUnionRequired<T>

function numberUnionOptions(schema: BD_NumberUnion) {
  const schemaKeys = Object.keys(schema) as Array<keyof BD_NumberUnion>
  const except = new Set(schemaKeys)

  return {
    brand: (key: string, value: string) => {
      if (except.has('brand')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.brandDefined)
      }

      const updatedSchema = { ...schema, brand: [key, value] as const }

      return {
        __schema: updatedSchema,
        ...numberUnionOptions(updatedSchema),
      }
    },

    optional: () => {
      if (except.has('optional')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined)
      }

      const updatedSchema = { ...schema, optional: true }

      return {
        __schema: updatedSchema,
        ...numberUnionOptions(updatedSchema),
      }
    },

    default: (defaultParsedValue: number) => {
      if (except.has('default')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.defaultDefined)
      }

      if (schema.optional === undefined) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.defaultNotAllowed)
      }

      const updatedSchema = { ...schema, default: defaultParsedValue }

      return {
        __schema: updatedSchema,
        ...numberUnionOptions(updatedSchema),
      }
    },

    description: (description: string) => {
      if (except.has('description')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined)
      }

      const updatedSchema = { ...schema, description }

      return {
        __schema: updatedSchema,
        ...numberUnionOptions(updatedSchema),
      }
    },
  }
}

export function numberUnion<T extends number>(...of: Readonly<[T, ...T[]]>) {
  const schema = { type: 'numberUnion', of } as const

  return {
    __schema: schema,
    ...numberUnionOptions(schema),
  }
}
