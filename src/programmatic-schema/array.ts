import { validate } from '../general-schema-validator'
import { parse } from '../general-schema-parser'

import type { EitherError } from '../utils/fp'
import type {
  Con_Schema_SubjT_V,
  SchemaLess,
  ArraySchema,
} from '../types/compound-schema-types'
import type { InvalidSubject } from '../error'

type Struct<T extends ArraySchema> = Omit<
  {
    optional: () => Struct<T & { optional: true }>

    minLength: (minLength: number) => Struct<T & { minLength: number }>
    maxLength: (maxLength: number) => Struct<T & { maxLength: number }>

    description: (description: string) => Struct<T & { description: string }>
  },
  keyof T
> & {
  __schema: T

  parse: (
    subject: unknown
  ) => EitherError<InvalidSubject[], Con_Schema_SubjT_V<T>>

  validate: (
    subject: unknown
  ) => EitherError<InvalidSubject[], Con_Schema_SubjT_V<T>>

  guard: (subject: unknown) => subject is Con_Schema_SubjT_V<T>
}

function struct<T extends ArraySchema>(schema: T): Struct<T>
function struct(schema: any) {
  return {
    __schema: schema,

    parse: (subj: unknown) => parse(schema, subj),
    validate: (subj: unknown) => validate(schema, subj),
    guard: (subj: unknown): subj is string | undefined =>
      validate(schema, subj).error === undefined,

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

export function array<
  T extends SchemaLess,
  U extends { __schema: T },
  V extends { type: 'array'; of: SchemaLess } = {
    type: 'array'
    of: U['__schema']
  },
>(of: U) {
  const schema = { type: 'array', of: of.__schema } as V

  return struct(schema)
}
