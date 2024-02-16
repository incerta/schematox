import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../error'
import { parse } from '../general-schema-parser'
import { validate } from '../general-schema-validator'

import type { BD_String } from '../types/base-detailed-schema-types'
import type { EitherError } from '../utils/fp'
import type { Con_Schema_SubjT_V } from '../types/compound-schema-types'
import type { InvalidSubject } from '../error'

type ExtWith_Option<
  T extends BD_String,
  U,
  V extends BD_String = Readonly<T & U>,
> = { __schema: V } & StringOptions<V>

type StringOptions<T extends BD_String> = Omit<
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

function stringStruct<T extends BD_String>(schema: T): StringOptions<T>

function stringStruct(schema: BD_String) {
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
        ...stringStruct(updatedSchema),
      }
    },

    optional: () => {
      if (except.has('optional')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined)
      }

      const updatedSchema = { ...schema, optional: true }

      return {
        __schema: updatedSchema,
        ...stringStruct(updatedSchema),
      }
    },

    minLength: (minLength: number) => {
      if (except.has('minLength')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.minLengthDefined)
      }

      const updatedSchema = { ...schema, minLength }

      return {
        __schema: updatedSchema,
        ...stringStruct(updatedSchema),
      }
    },

    maxLength: (maxLength: number) => {
      if (except.has('maxLength')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.maxLengthDefined)
      }

      const updatedSchema = { ...schema, maxLength }

      return {
        __schema: updatedSchema,
        ...stringStruct(updatedSchema),
      }
    },

    description: (description: string) => {
      if (except.has('description')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined)
      }

      const updatedSchema = { ...schema, description }

      return {
        __schema: updatedSchema,
        ...stringStruct(updatedSchema),
      }
    },
  }
}

export function string() {
  const schema = { type: 'string' } as const

  return {
    __schema: schema,
    ...stringStruct(schema),
  }
}
