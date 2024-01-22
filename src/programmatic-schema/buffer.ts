import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../error'

import type { BD_Buffer } from '../base-detailed-schema-types'

type ExtWith_Option<
  T extends BD_Buffer,
  U,
  V extends BD_Buffer = Readonly<T & U>,
> = {
  __schema: V
} & BufferOptions<V>

type BufferOptions<T extends BD_Buffer> = Omit<
  {
    optional: () => ExtWith_Option<T, { optional: true }>
    brand: <U extends string, V extends string>(
      key: U,
      value: V
    ) => ExtWith_Option<T, { brand: Readonly<[U, V]> }>

    minLength: (minLength: number) => ExtWith_Option<T, { minLength: number }>
    maxLength: (maxLength: number) => ExtWith_Option<T, { maxLength: number }>
    description: (
      description: string
    ) => ExtWith_Option<T, { description: string }>
  },
  keyof T
>

function bufferOptions<T extends BD_Buffer>(schema: T): BufferOptions<T>

function bufferOptions(schema: BD_Buffer) {
  const schemaKeys = Object.keys(schema) as Array<keyof BD_Buffer>
  const except = new Set(schemaKeys)

  return {
    brand: (key: string, value: string) => {
      if (except.has('brand')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.brandDefined)
      }

      const updatedSchema = { ...schema, brand: [key, value] as const }

      return {
        __schema: updatedSchema,
        ...bufferOptions(updatedSchema),
      }
    },

    optional: () => {
      if (except.has('optional')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined)
      }

      const updatedSchema = { ...schema, optional: true }

      return {
        __schema: updatedSchema,
        ...bufferOptions(updatedSchema),
      }
    },

    minLength: (minLength: number) => {
      if (except.has('minLength')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.minLengthDefined)
      }

      const updatedSchema = { ...schema, minLength }

      return {
        __schema: updatedSchema,
        ...bufferOptions(updatedSchema),
      }
    },

    maxLength: (maxLength: number) => {
      if (except.has('maxLength')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.maxLengthDefined)
      }

      const updatedSchema = { ...schema, maxLength }

      return {
        __schema: updatedSchema,
        ...bufferOptions(updatedSchema),
      }
    },

    description: (description: string) => {
      if (except.has('description')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined)
      }

      const updatedSchema = { ...schema, description }

      return {
        __schema: updatedSchema,
        ...bufferOptions(updatedSchema),
      }
    },
  }
}

export function buffer() {
  const schema = { type: 'buffer' } as const

  return {
    __schema: schema,
    ...bufferOptions(schema),
  }
}
