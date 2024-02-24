export { ERROR_CODE } from './error'

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
export { validate, guard } from './validate'

export type { Schema, SubjectType } from './types/compounds'

export type { InvalidSubject, ErrorPath, ErrorCode } from './error'
export type { EitherError, Error, Data } from './utils/fp'
