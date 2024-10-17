export { ERROR_CODE } from './error'

export {
  makeStruct,
  string,
  number,
  boolean,
  literal,
  union,
  array,
  object,
} from './struct'

export { left, right } from './utils/fp'
export { parse } from './parse'
export { validate, guard } from './validate'

export type {
  StringSchema,
  NumberSchema,
  BooleanSchema,
  LiteralSchema,
  PrimitiveSchema,
} from './types/primitives'

export type {
  Schema,
  BaseArraySchema,
  BaseObjectSchema,
  BaseUnionSchema,
  ObjectSchema,
  ArraySchema,
  UnionSchema,
} from './types/compounds'

export type { SubjectType } from './types/constructors'

export type {
  ParsingError,
  InvalidSubject,
  ErrorPath,
  ErrorCode,
} from './error'

export type { Either, Left, Right } from './utils/fp'
