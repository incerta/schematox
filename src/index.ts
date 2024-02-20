/**
 * This index file is where the public API of the "SchematoX" library is defined.
 * All export members will not change their interface without a MAJOR library version update.
 * Export member interfaces can only be extended on a MINOR library version update.
 *
 * Currently, we are on MAJOR version 0, so definitions/interfaces of this public API might change,
 * but only with a MINOR version update.
 **/

import type { Schema, Con_Schema_SubjT_V } from './types/compound-schema-types'

/* Programmatic base schema definition */

export {
  string,
  number,
  boolean,
  stringUnion,
  numberUnion,
  literal,
  union,
  array,
  object,
} from './programmatic-schema'

/* Utils */

export { isError, isData, error, data } from './utils/fp'

export { parse } from './general-schema-parser'
export { validate, guard, assert } from './general-schema-validator'

// FIXME: the method is deprecated
export { x } from './x-closure'

/* Typings */

export type { BaseSchema, Schema, R } from './types/compound-schema-types'
export type { InvalidSubject } from './error'
export type { EitherError } from './utils/fp'

export type SubjectType<T extends { __schema: Schema } | Schema> = T extends {
  __schema: Schema
}
  ? Con_Schema_SubjT_V<T['__schema']>
  : T extends Schema
    ? Con_Schema_SubjT_V<T>
    : never
