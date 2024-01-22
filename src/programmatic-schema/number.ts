import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../error'

import type { BD_Number } from '../base-detailed-schema-types'

type ExtWith_Option<
  T extends BD_Number,
  U,
  V extends BD_Number = Readonly<T & U>,
> = {
  __schema: V
} & (V extends { optional: true } ? NumberOptional<V> : NumberRequired<V>)

type NumberShared<T extends BD_Number> = {
  brand: <U extends string, V extends string>(
    key: U,
    value: V
  ) => ExtWith_Option<T, { brand: Readonly<[U, V]> }>

  min: (min: number) => ExtWith_Option<T, { min: number }>
  max: (max: number) => ExtWith_Option<T, { max: number }>
  description: (
    description: string
  ) => ExtWith_Option<T, { description: string }>
}

type NumberOptional<T extends BD_Number> = Omit<
  {
    default: (defaultValue: number) => ExtWith_Option<T, { default: number }>
  } & NumberShared<T>,
  keyof T
>

type NumberRequired<T extends BD_Number> = Omit<
  {
    optional: () => ExtWith_Option<T, { optional: true }>
  } & NumberShared<T>,
  keyof T
>

function numberOptions<T extends BD_Number>(
  schema: T
): T extends { optional: true } ? NumberOptional<T> : NumberRequired<T>

function numberOptions(schema: BD_Number) {
  const schemaKeys = Object.keys(schema) as Array<keyof BD_Number>
  const except = new Set(schemaKeys)

  return {
    brand: (key: string, value: string) => {
      if (except.has('brand')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.brandDefined)
      }

      const updatedSchema = { ...schema, brand: [key, value] as const }

      return {
        __schema: updatedSchema,
        ...numberOptions(updatedSchema),
      }
    },

    optional: () => {
      if (except.has('optional')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined)
      }

      const updatedSchema = { ...schema, optional: true }

      return {
        __schema: updatedSchema,
        ...numberOptions(updatedSchema),
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
        ...numberOptions(updatedSchema),
      }
    },

    min: (min: number) => {
      if (except.has('min')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.minDefined)
      }

      const updatedSchema = { ...schema, min }

      return {
        __schema: updatedSchema,
        ...numberOptions(updatedSchema),
      }
    },

    max: (max: number) => {
      if (except.has('max')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.maxDefined)
      }

      const updatedSchema = { ...schema, max }

      return {
        __schema: updatedSchema,
        ...numberOptions(updatedSchema),
      }
    },

    description: (description: string) => {
      if (except.has('description')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined)
      }

      const updatedSchema = { ...schema, description }

      return {
        __schema: updatedSchema,
        ...numberOptions(updatedSchema),
      }
    },
  }
}

export function number() {
  const schema = { type: 'number' } as const

  return {
    __schema: schema,
    ...numberOptions(schema),
  }
}
