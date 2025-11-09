export { ERROR_CODE, PARAMS_BY_SCHEMA_TYPE } from './constants'

export { parse } from './parse'

export {
  makeStruct,
  //
  boolean,
  literal,
  number,
  string,
  //
  array,
  object,
  record,
  tuple,
  union,
} from './struct'

export { error, success, tCh } from './utils'

export type {
  ErrorCode,
  ErrorPath,
  InvalidSubject,
  ParseError,
  ParseResult,
  ParseSuccess,
  PrettifyObject,
} from './types/utils'

export type {
  Infer,
  //
  InferSchema,
  InferPrimitive,
  //
  InferArray,
  InferObject,
  InferRecord,
  InferUnion,
} from './types/infer'

export type {
  Schema,
  PrimitiveSchema,
  //
  ArraySchema,
  ObjectSchema,
  RecordSchema,
  UnionSchema,
  //
  BrandSchema,
  //
  BooleanSchema,
  LiteralSchema,
  NumberSchema,
  StringSchema,
} from './types/schema'

export type { Struct, StructShape, StructParams } from './types/struct'

export type {
  ExtendParams,
  //
  ExtendBrand,
  ExtendOptional,
  ExtendNullable,
} from './types/extensions'
