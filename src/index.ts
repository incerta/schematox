/**
 * This index file is where the public API of the "SchematoX" library is defined.
 * All export members will not change their interface without a MAJOR library version update.
 * Export member interfaces can only be extended on a MINOR library version update.
 *
 * Currently, we are on MAJOR version 0, so definitions/interfaces of this public API might change,
 * but only with a MINOR version update.
 **/

export {
  string,
  number,
  boolean,
  literal,
  union,
  array,
  object,
} from './programmatic-schema'

export { isError, isData, error, data } from './utils/fp'

export { parse } from './general-schema-parser'
export { validate, guard, assert } from './general-schema-validator'
export { ERROR_CODE } from './error'

export type {
  BaseSchema,
  Schema,
  SubjectType,
} from './types/compound-schema-types'

export type { InvalidSubject, ErrorPath, ErrorCode } from './error'
export type { EitherError } from './utils/fp'
