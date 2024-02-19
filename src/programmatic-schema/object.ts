import { validate } from '../general-schema-validator'
import { parse } from '../general-schema-parser'

import type { EitherError } from '../utils/fp'
import type {
  Con_Schema_SubjT_V,
  ObjectSchema,
  SchemaLess,
  NestedSchema,
} from '../types/compound-schema-types'
import type { InvalidSubject } from '../error'

type Struct<T extends ObjectSchema> = Omit<
  {
    optional: () => Struct<T & { optional: true }>
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

function struct<T extends ObjectSchema>(schema: T): Struct<T>
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
    description: (description: string) => {
      return struct({ ...schema, description })
    },
  }
}

export function object<
  T extends SchemaLess,
  U extends Record<string, { __schema: T }>,
  V extends {
    type: 'object'
    of: Record<string, NestedSchema>
  } = { type: 'object'; of: { [k in keyof U]: U[k]['__schema'] } },
>(of: U) {
  const schema = { type: 'object', of: {} } as V

  for (const key in of) {
    schema.of[key] = (of[key] as NonNullable<(typeof of)[typeof key]>).__schema
  }

  return struct(schema)
}
