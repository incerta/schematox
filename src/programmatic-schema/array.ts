import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../error'

type ExtWith_Option<T, U, V = T & U> = {
  __schema: V
} & ArrayOptions<V>

type ArrayOptions<T> = Omit<
  {
    optional: () => ExtWith_Option<T, { optional: true }>
    description: (
      description: string
    ) => ExtWith_Option<T, { description: string }>
  },
  keyof T
>

function arrayOptions<T>(schema: T): ArrayOptions<T>
function arrayOptions<T>(schema: T) {
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
        ...arrayOptions(updatedSchema),
      }
    },

    description: (description: string) => {
      if (except.has('description')) {
        throw Error(PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined)
      }

      const updatedSchema = { ...schema, description }

      return {
        __schema: updatedSchema,
        ...arrayOptions(updatedSchema),
      }
    },
  }
}

export function array<
  T,
  U extends { __schema: T },
  V extends { type: 'array'; of: unknown } = {
    type: 'array'
    of: U['__schema']
  },
>(of: U) {
  const schema = { type: 'array', of: of.__schema } as V

  return {
    __schema: schema,
    ...arrayOptions(schema),
  }
}
