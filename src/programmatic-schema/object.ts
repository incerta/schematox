import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../error'

type ExtWith_Option<T, U, V = T & U> = {
  __schema: V
} & ObjectOptions<V>

type ObjectOptions<T> = Omit<
  {
    optional: () => ExtWith_Option<T, { optional: true }>
    description: (
      description: string
    ) => ExtWith_Option<T, { description: string }>
  },
  keyof T
>

function objectOptions<T>(schema: T): ObjectOptions<T>
function objectOptions<T>(schema: T) {
  const schemaKeys = Object.keys(schema as Record<string, unknown>) as Array<
    'optional' | 'description'
  >
  const except = new Set(schemaKeys)

  return {
    optional: () => {
      if (except.has('optional')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined)
      }

      const updatedSchema = { ...schema, optional: true }

      return {
        __schema: updatedSchema,
        ...objectOptions(updatedSchema),
      }
    },

    description: (description: string) => {
      if (except.has('description')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined)
      }

      const updatedSchema = { ...schema, description }

      return {
        __schema: updatedSchema,
        ...objectOptions(updatedSchema),
      }
    },
  }
}

export function object<
  T,
  U extends Record<string, { __schema: Record<string, T> }>,
  V extends {
    type: 'object'
    of: Record<string, unknown>
  } = { type: 'object'; of: { [k in keyof U]: U[k]['__schema'] } },
>(of: U) {
  const schema = { type: 'object', of: {} } as V

  for (const key in of) {
    schema.of[key] = (of[key] as NonNullable<(typeof of)[typeof key]>).__schema
  }

  return {
    __schema: schema,
    ...objectOptions(schema),
  }
}
