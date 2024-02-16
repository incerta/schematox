import type { BD_String } from '../types/base-detailed-schema-types'

type Struct<T extends BD_String> = Omit<
  {
    optional: () => Struct<T & { optional: true }>

    brand: <U extends string, V extends string>(
      key: U,
      value: V
    ) => Struct<T & { brand: Readonly<[U, V]> }>

    minLength: (minLength: number) => Struct<T & { minLength: number }>
    maxLength: (maxLength: number) => Struct<T & { maxLength: number }>

    description: (description: string) => Struct<T & { description: string }>
  },
  keyof T
> & { __schema: T }

function struct<T extends BD_String>(schema: T): Struct<T>
function struct(schema: BD_String) {
  return {
    __schema: schema,

    brand: (key: string, value: string) => {
      return struct({ ...schema, brand: [key, value] })
    },

    optional: () => {
      return struct({ ...schema, optional: true })
    },

    minLength: (minLength: number) => {
      return struct({ ...schema, minLength })
    },

    maxLength: (maxLength: number) => {
      return struct({ ...schema, maxLength })
    },

    description: (description: string) => {
      return struct({ ...schema, description })
    },
  }
}

export function string() {
  return struct({ type: 'string' })
}
