import { validate } from '../general-schema-validator'
import { parse } from '../general-schema-parser'

import type { BD_Number } from '../types/base-detailed-schema-types'
import type { EitherError } from '../utils/fp'
import type { Con_Schema_SubjT_V } from '../types/compound-schema-types'
import type { InvalidSubject } from '../error'

type Struct<T extends BD_Number> = Omit<
  {
    optional: () => Struct<T & { optional: true }>

    brand: <U extends string, V extends string>(
      key: U,
      value: V
    ) => Struct<T & { brand: Readonly<[U, V]> }>

    min: (min: number) => Struct<T & { min: number }>
    max: (max: number) => Struct<T & { max: number }>

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

function struct<T extends BD_Number>(schema: T): Struct<T>
function struct(schema: BD_Number) {
  return {
    __schema: schema,

    parse: (subj: unknown) => parse(schema, subj),
    validate: (subj: unknown) => validate(schema, subj),
    guard: (subj: unknown): subj is number | undefined =>
      validate(schema, subj).error === undefined,

    brand: (key: string, value: string) => {
      return struct({ ...schema, brand: [key, value] as const })
    },

    optional: () => {
      return struct({ ...schema, optional: true })
    },

    min: (min: number) => {
      return struct({ ...schema, min })
    },

    max: (max: number) => {
      return struct({ ...schema, max })
    },

    description: (description: string) => {
      return struct({ ...schema, description })
    },
  }
}

export function number() {
  return struct({ type: 'number' })
}
