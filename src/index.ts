export { ERROR_CODE, PARAMS_BY_SCHEMA_TYPE } from './constants.js'

export { parse } from './parse.js'

export {
  makeStruct,
  //
  boolean,
  literal,
  number,
  bigint,
  string,
  //
  array,
  object,
  record,
  tuple,
  union,
} from './struct.js'

export { error, success, tCh } from './utils.js'

export type {
  ErrorCode,
  ErrorPath,
  InvalidSubject,
  ParseError,
  ParseResult,
  ParseSuccess,
  PrettifyObject,
} from './types/utils.js'

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
} from './types/infer.js'

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
  BigIntSchema,
  BooleanSchema,
  LiteralSchema,
  NumberSchema,
  StringSchema,
  //
  BigIntString,
} from './types/schema.js'

export type { Struct, StructShape, StructParams } from './types/struct.js'

export type {
  ExtendParams,
  //
  ExtendBrand,
  ExtendOptional,
  ExtendNullable,
} from './types/extensions.js'
