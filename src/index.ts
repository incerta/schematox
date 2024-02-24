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
export { parse } from './parse'
export { validate, guard } from './validate'

export type { Schema } from './types/compounds'
export type { SubjectType } from './types/constructors'

export type { InvalidSubject, ErrorPath, ErrorCode } from './error'
export type { EitherError, Error, Data } from './utils/fp'
