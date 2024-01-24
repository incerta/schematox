import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../error'

import type { BD_String } from '../types/base-detailed-schema-types'

type ExtWith_Option<
  T extends BD_String,
  U,
  V extends BD_String = Readonly<T & U>,
> = {
  __schema: V
} & (V extends { optional: true } ? StringOptional<V> : StringRequired<V>)

type StringShared<T extends BD_String> = {
  brand: <U extends string, V extends string>(
    key: U,
    value: V
  ) => ExtWith_Option<T, { brand: Readonly<[U, V]> }>

  minLength: (minLength: number) => ExtWith_Option<T, { minLength: number }>
  maxLength: (maxLength: number) => ExtWith_Option<T, { maxLength: number }>
  description: (
    description: string
  ) => ExtWith_Option<T, { description: string }>
}

type StringOptional<T extends BD_String> = Omit<
  {
    default: (defaultValue: string) => ExtWith_Option<T, { default: string }>
  } & StringShared<T>,
  keyof T
>

type StringRequired<T extends BD_String> = Omit<
  {
    optional: () => ExtWith_Option<T, { optional: true }>
  } & StringShared<T>,
  keyof T
>

function stringOptions<T extends BD_String>(
  schema: T
): T extends { optional: true } ? StringOptional<T> : StringRequired<T>

function stringOptions(schema: BD_String) {
  const schemaKeys = Object.keys(schema) as Array<keyof BD_String>
  const except = new Set(schemaKeys)

  return {
    brand: (key: string, value: string) => {
      if (except.has('brand')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.brandDefined)
      }

      const updatedSchema = { ...schema, brand: [key, value] as const }

      return {
        __schema: updatedSchema,
        ...stringOptions(updatedSchema),
      }
    },

    optional: () => {
      if (except.has('optional')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined)
      }

      const updatedSchema = { ...schema, optional: true }

      return {
        __schema: updatedSchema,
        ...stringOptions(updatedSchema),
      }
    },

    default: (defaultParsedValue: string) => {
      if (except.has('default')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.defaultDefined)
      }

      if (schema.optional === undefined) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.defaultNotAllowed)
      }

      const updatedSchema = { ...schema, default: defaultParsedValue }

      return {
        __schema: updatedSchema,
        ...stringOptions(updatedSchema),
      }
    },

    minLength: (minLength: number) => {
      if (except.has('minLength')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.minLengthDefined)
      }

      const updatedSchema = { ...schema, minLength }

      return {
        __schema: updatedSchema,
        ...stringOptions(updatedSchema),
      }
    },

    maxLength: (maxLength: number) => {
      if (except.has('maxLength')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.maxLengthDefined)
      }

      const updatedSchema = { ...schema, maxLength }

      return {
        __schema: updatedSchema,
        ...stringOptions(updatedSchema),
      }
    },

    description: (description: string) => {
      if (except.has('description')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined)
      }

      const updatedSchema = { ...schema, description }

      return {
        __schema: updatedSchema,
        ...stringOptions(updatedSchema),
      }
    },
  }
}

export function string() {
  const schema = { type: 'string' } as const

  return {
    __schema: schema,
    ...stringOptions(schema),
  }
}
