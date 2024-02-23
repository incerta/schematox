export {
  string,
  number,
  boolean,
  literal,
  union,
  array,
  object,
} from './programmatic-schema'

export { error, data } from './utils/fp'

export { parse } from './general-schema-parser'
export { validate, guard } from './general-schema-validator'
export { ERROR_CODE } from './error'

export type { BaseSchema, Schema, SubjectType } from './types/compounds'

export type { InvalidSubject, ErrorPath, ErrorCode } from './error'

export type { EitherError, Error, Data } from './utils/fp'
