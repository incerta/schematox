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

export type {
  BooleanSchema,
  BrandSchema,
  LiteralSchema,
  NumberSchema,
  PrimitiveSchema,
  StringSchema,
} from './types/primitives'

export type {
  ArraySchema,
  BaseArraySchema,
  BaseObjectSchema,
  BaseUnionSchema,
  CompoundSchema,
  NestedSchema,
  NestedStructSchema,
  ObjectSchema,
  Schema,
  StructSchema,
  UnionSchema,
} from './types/compounds'

export type {
  Con_ArraySchema_SubjT,
  Con_ObjectSchema_SubjT,
  Con_PrimitiveSchema_SubjT,
  Con_Schema_SubjT,
  Con_UnionSchema_SubjT,
  MakeOptional,
  Prettify,
  SubjectType,
} from './types/constructors'

export type {
  ExtWith_Undefined_SubjT,
  ExtWith_Null_SubjT,
  ExtWith_Brand_SubjT,
  ExtWith_SchemaParams_SubjT,
} from './types/extensions'

export type {
  ParsingError,
  InvalidSubject,
  ErrorPath,
  ErrorCode,
} from './error'

export type { Either, Left, Right } from './utils/fp'
