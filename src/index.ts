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
  union,
} from './struct'

export { tCh, error, data, verifyPrimitive, makeErrorPath } from './utils'
export { parse } from './parse'

export { ERROR_CODE, PARAMS_BY_SCHEMA_TYPE } from './constants'

export type {
  ErrorCode,
  ErrorPath,
  InvalidSubject,
  ParseError,
  ParseResult,
  ParseSuccess,
} from './types/utils'

export type {
  Infer,
  //
  Con_Schema_SubjT,
  //
  Con_ArraySchema_SubjT,
  Con_ObjectSchema_SubjT,
  Con_PrimitiveSchema_SubjT,
  Con_RecordSchema_SubjT,
  Con_UnionSchema_SubjT,
  //
  MakeOptional,
} from './types/constructors'

export type {
  PrimitiveSchema,
  //
  BooleanSchema,
  LiteralSchema,
  NumberSchema,
  StringSchema,
  //
  BrandSchema,
} from './types/primitives'

export type {
  Schema,
  //
  ArraySchema,
  ObjectSchema,
  RecordSchema,
  UnionSchema,
  //
  CompoundSchema,
  StructSchema,
  //
  BaseArraySchema,
  BaseObjectSchema,
  BaseRecordSchema,
  BaseUnionSchema,
  //
  NestedSchema,
  NestedStructSchema,
} from './types/compounds'

export type {
  ExtWith_Undefined_SubjT,
  ExtWith_Null_SubjT,
  ExtWith_Brand_SubjT,
  ExtWith_SchemaParams_SubjT,
} from './types/extensions'
