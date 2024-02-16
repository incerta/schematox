import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../error'

import type { BD_Boolean } from '../types/base-detailed-schema-types'

type ExtWith_Option<
  T extends BD_Boolean,
  U,
  V extends BD_Boolean = Readonly<T & U>,
> = {
  __schema: V
} & (V extends { optional: true } ? BooleanOptional<V> : BooleanRequired<V>)

type BooleanShared<T extends BD_Boolean> = {
  brand: <U extends string, V extends string>(
    key: U,
    value: V
  ) => ExtWith_Option<T, { brand: Readonly<[U, V]> }>

  description: (
    description: string
  ) => ExtWith_Option<T, { description: string }>
}

type BooleanOptional<T extends BD_Boolean> = Omit<BooleanShared<T>, keyof T>

type BooleanRequired<T extends BD_Boolean> = Omit<
  {
    optional: () => ExtWith_Option<T, { optional: true }>
  } & BooleanShared<T>,
  keyof T
>

function booleanOptions<T extends BD_Boolean>(
  schema: T
): T extends { optional: true } ? BooleanOptional<T> : BooleanRequired<T>

function booleanOptions(schema: BD_Boolean) {
  const schemaKeys = Object.keys(schema) as Array<keyof BD_Boolean>
  const except = new Set(schemaKeys)

  return {
    brand: (key: string, value: string) => {
      if (except.has('brand')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.brandDefined)
      }

      const updatedSchema = { ...schema, brand: [key, value] as const }

      return {
        __schema: updatedSchema,
        ...booleanOptions(updatedSchema),
      }
    },

    optional: () => {
      if (except.has('optional')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined)
      }

      const updatedSchema = { ...schema, optional: true }

      return {
        __schema: updatedSchema,
        ...booleanOptions(updatedSchema),
      }
    },

    description: (description: string) => {
      if (except.has('description')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined)
      }

      const updatedSchema = { ...schema, description }

      return {
        __schema: updatedSchema,
        ...booleanOptions(updatedSchema),
      }
    },
  }
}

export function boolean() {
  const schema = { type: 'boolean' } as const

  return {
    __schema: schema,
    ...booleanOptions(schema),
  }
}
