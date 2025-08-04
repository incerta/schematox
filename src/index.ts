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
  SubjectType, // @examples: SubjectType<typeof struct>, SubjectType<typeof schema>
  //
  Con_Schema_SubjT,
  Con_Struct_SubjT,
  //
  Con_ArraySchema_SubjT,
  Con_ObjectSchema_SubjT,
  Con_PrimitiveSchema_SubjT,
  Con_RecordSchema_SubjT,
  Con_TupleSchema_SubjT,
  Con_UnionSchema_SubjT,
  //
  MakeOptional,
  SimplifyObjectType,
} from './types/constructors'

export type {
  ErrorCode,
  ErrorPath,
  InvalidSubject,
  ParsingError,
} from './error'

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
  TupleSchema,
  UnionSchema,
  //
  CompoundSchema,
  StructSchema,
  //
  BaseArraySchema,
  BaseObjectSchema,
  BaseRecordSchema,
  BaseTupleSchema,
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

export type { Either, Left, Right } from './utils/fp'
