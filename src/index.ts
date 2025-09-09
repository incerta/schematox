export { ERROR_CODE } from './error'

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

export { tCh, left, right, verifyPrimitive, makeErrorPath } from './utils'
export { parse } from './parse'

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

export type { ErrorCode, ErrorPath, InvalidSubject } from './error'

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

export type { Either, Left, Right } from './types/utils'
