import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../error'

import type { BD_StringUnion } from '../base-detailed-schema-types'

type ExtWith_Option<
  T extends BD_StringUnion,
  U,
  V extends BD_StringUnion = Readonly<T & U>,
> = {
  __schema: V
} & (V extends { optional: true }
  ? StringUnionOptional<V>
  : StringUnionRequired<V>)

type StringUnionShared<T extends BD_StringUnion> = {
  brand: <U extends string, V extends string>(
    key: U,
    value: V
  ) => ExtWith_Option<T, { brand: Readonly<[U, V]> }>

  description: (
    description: string
  ) => ExtWith_Option<T, { description: string }>
}

type StringUnionOptional<T extends BD_StringUnion> = Omit<
  {
    default: T extends { of: Readonly<Array<infer U>> }
      ? (defaultValue: U) => ExtWith_Option<T, { default: U }>
      : never
  } & StringUnionShared<T>,
  keyof T
>

type StringUnionRequired<T extends BD_StringUnion> = Omit<
  {
    optional: () => ExtWith_Option<T, { optional: true }>
  } & StringUnionShared<T>,
  keyof T
>

function stringUnionOptions<T extends BD_StringUnion>(
  schema: T
): T extends { optional: true }
  ? StringUnionOptional<T>
  : StringUnionRequired<T>

function stringUnionOptions(schema: BD_StringUnion) {
  const schemaKeys = Object.keys(schema) as Array<keyof BD_StringUnion>
  const except = new Set(schemaKeys)

  return {
    brand: (key: string, value: string) => {
      if (except.has('brand')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.brandDefined)
      }

      const updatedSchema = { ...schema, brand: [key, value] as const }

      return {
        __schema: updatedSchema,
        ...stringUnionOptions(updatedSchema),
      }
    },

    optional: () => {
      if (except.has('optional')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined)
      }

      const updatedSchema = { ...schema, optional: true }

      return {
        __schema: updatedSchema,
        ...stringUnionOptions(updatedSchema),
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
        ...stringUnionOptions(updatedSchema),
      }
    },

    description: (description: string) => {
      if (except.has('description')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined)
      }

      const updatedSchema = { ...schema, description }

      return {
        __schema: updatedSchema,
        ...stringUnionOptions(updatedSchema),
      }
    },
  }
}

export function stringUnion<T extends string>(...of: Readonly<[T, ...T[]]>) {
  const schema = { type: 'stringUnion', of } as const

  return {
    __schema: schema,
    ...stringUnionOptions(schema),
  }
}
