import { check, unknownX } from './test-utils'
import type {
  ConstructBrandSchemaSubjectType,
  ConstructSchemaSubjectBaseType,
  ConstructSchemaSubjectTypeParsed,
  ConstructSchemaSubjectTypeValidated,
  ExtendWithBrandTypeOfSchema,
  ExtendWithOptionalityOfSchemaParsed,
  ExtendWithOptionalityOfSchemaValidated,
  Schema,
} from '../primitive-detailed-types'

it('StringUnionSchema: check "as const" (imutability) constraint', () => {
  const mutableSchema = {
    type: 'stringUnion',
    of: ['x', 'y'],
  } satisfies Schema

  // @ts-expect-error '{ type: "stringUnion"; of: string[]; }' is not '{ type: "stringUnion"; of: ["x", "y"]; }'
  check<{ type: 'stringUnion'; of: ['x', 'y'] }>(mutableSchema)

  const imutableSchema = {
    type: 'stringUnion',
    of: ['x', 'y'],
  } as const satisfies Schema

  check<{ type: 'stringUnion'; of: ['x', 'y'] }>(imutableSchema)
})

it('NumberUnionSchema: check "as const" (imutability) constraint', () => {
  const mutableSchema = {
    type: 'numberUnion',
    of: [0, 1],
  } satisfies Schema

  // @ts-expect-error '{ type: "numberUnion"; of: number[]; }' is not '{ type: "numberUnion"; of: [0, 1]; }'
  check<{ type: 'numberUnion'; of: [0, 1] }>(mutableSchema)

  const imutableSchema = {
    type: 'numberUnion',
    of: [0, 1],
  } as const satisfies Schema

  check<{ type: 'numberUnion'; of: [0, 1] }>(imutableSchema)
})

it('ConstructSchemaSubjectBaseType<T>: should construct schema base subject type', () => {
  check<string>(unknownX as ConstructSchemaSubjectBaseType<{ type: 'string' }>)
  // @ts-expect-error 'number' is not assignable 'string'
  check<string>(unknownX as ConstructSchemaSubjectBaseType<{ type: 'number' }>)

  check<number>(unknownX as ConstructSchemaSubjectBaseType<{ type: 'number' }>)
  // @ts-expect-error 'boolean' is not assignable to 'number'
  check<number>(unknownX as ConstructSchemaSubjectBaseType<{ type: 'boolean' }>)

  check<boolean>(
    unknownX as ConstructSchemaSubjectBaseType<{ type: 'boolean' }>
  )
  // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean'
  check<boolean>(unknownX as ConstructSchemaSubjectBaseType<{ type: 'buffer' }>)

  check<Buffer>(unknownX as ConstructSchemaSubjectBaseType<{ type: 'buffer' }>)
  // @ts-expect-error 'string' is not assignable to 'Buffer'
  check<Buffer>(unknownX as ConstructSchemaSubjectBaseType<{ type: 'string' }>)

  check<'a' | 'b'>(
    unknownX as ConstructSchemaSubjectBaseType<{
      type: 'stringUnion'
      of: ['a', 'b']
    }>
  )

  check<'a' | 'b'>(
    // @ts-expect-error '"a" | "b" | "c"' is not assignable to '"a" | "b"'
    unknownX as ConstructSchemaSubjectBaseType<{
      type: 'stringUnion'
      of: ['a', 'b', 'c']
    }>
  )

  check<'a' | 'b'>(
    // @ts-expect-error '2 | 1' is not assignable to '"a" | "b"'
    unknownX as ConstructSchemaSubjectBaseType<{
      type: 'numberUnion'
      of: [0, 1]
    }>
  )

  check<0 | 1>(
    unknownX as ConstructSchemaSubjectBaseType<{
      type: 'numberUnion'
      of: [0, 1]
    }>
  )

  check<0 | 1>(
    // @ts-expect-error '0 | 2 | 1' is not assignable to '0 | 1'
    unknownX as ConstructSchemaSubjectBaseType<{
      type: 'numberUnion'
      of: [0, 1, 2]
    }>
  )

  check<0 | 1>(
    // @ts-expect-error 'string' is not assignable to parameter of type '0 | 1'
    unknownX as ConstructSchemaSubjectBaseType<{ type: 'string' }>
  )
})

it('ConstructBrandSchemaSubjectType<T>: should construct schema subject brand type', () => {
  check<{ __id: 'X' }>(unknownX as ConstructBrandSchemaSubjectType<['id', 'X']>)

  check<{ __id: 'Y' }>(
    // @ts-expect-error '{ __id: "X" }' is not assignable '{ __id: "Y" }'
    unknownX as ConstructBrandSchemaSubjectType<['id', 'X']>
  )

  check<{ __idX: 'X' }>(
    // @ts-expect-error '{ __idY: "X" }' is not assignable to '{ __idY: "X" }'
    unknownX as ConstructBrandSchemaSubjectType<['idY', 'X']>
  )
})

it('ExtendWithBrandTypeOfSchema<T, U>: should narrow U type with brand schema subject type', () => {
  check<string & { __id: 'X' }>(
    // @ts-expect-error 'string' is not assignable to 'string & { __id: "X" }'
    unknownX as ExtendWithBrandTypeOfSchema<{ type: 'string' }, string>
  )

  check<string & { __id: 'X' }>(
    unknownX as ExtendWithBrandTypeOfSchema<
      { type: 'string'; brand: ['id', 'X'] },
      string
    >
  )
})

it('ExtendWithOptionalityOfSchemaParsed<T, U>: optional case only', () => {
  check<string>(
    unknownX as ExtendWithOptionalityOfSchemaParsed<{ type: 'string' }, string>
  )

  check<string>(
    unknownX as NonNullable<
      ExtendWithOptionalityOfSchemaParsed<
        { type: 'string'; optional: true },
        string
      >
    >
  )

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable 'string'
    unknownX as ExtendWithOptionalityOfSchemaParsed<
      { type: 'string'; optional: true },
      string
    >
  )
})

it('ExtendWithOptionalityOfSchemaParsed<T, U>: optional + default case', () => {
  check<string>(
    unknownX as ExtendWithOptionalityOfSchemaParsed<
      { type: 'string'; optional: true; default: 'x' },
      string
    >
  )

  check<string>(
    unknownX as ExtendWithOptionalityOfSchemaParsed<
      { type: 'string'; optional: true; default: 'x' },
      string
    >
  )

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as ExtendWithOptionalityOfSchemaParsed<
      { type: 'string'; optional: true; default: undefined },
      string
    >
  )
})

it('ConstructSchemaSubjectTypeParsed<T>: check optionality extension', () => {
  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as ConstructSchemaSubjectTypeParsed<{
      type: 'string'
      optional: true
    }>
  )

  check<string>(
    unknownX as NonNullable<
      ConstructSchemaSubjectTypeParsed<{
        type: 'string'
        optional: true
      }>
    >
  )

  check<string>(
    unknownX as ConstructSchemaSubjectTypeParsed<{
      type: 'string'
      optional: true
      default: 'x'
    }>
  )
})

it('ConstructSchemaSubjectTypeParsed<T>: check brand schema subject type extension', () => {
  check<string & { __id: 'X' }>(
    unknownX as ConstructSchemaSubjectTypeParsed<{
      type: 'string'
      brand: ['id', 'X']
    }>
  )

  check<string & { __id: 'Y' }>(
    // @ts-expect-error '"X"' is not assignable to type '"Y"'
    unknownX as ConstructSchemaSubjectTypeParsed<{
      type: 'string'
      brand: ['id', 'X']
    }>
  )
})

it('ConstructSchemaSubjectTypeParsed<T>: "string" required', () => {
  const stringRequired = {
    type: 'string',
  } as const satisfies Schema

  check<string>(
    unknownX as ConstructSchemaSubjectTypeParsed<typeof stringRequired>
  )
})

it('ConstructSchemaSubjectTypeParsed<T>: "string" required & branded', () => {
  const stringRequired = {
    type: 'string',
    brand: ['id', 'X'],
  } as const satisfies Schema

  check<string & { __id: 'X' }>(
    unknownX as ConstructSchemaSubjectTypeParsed<typeof stringRequired>
  )
})

it('ConstructSchemaSubjectTypeParsed<T>: "string" optional', () => {
  const stringOptional = {
    type: 'string',
    optional: true,
  } as const satisfies Schema

  check<string | undefined>(
    unknownX as ConstructSchemaSubjectTypeParsed<typeof stringOptional>
  )
  check<string>(
    unknownX as NonNullable<
      ConstructSchemaSubjectTypeParsed<typeof stringOptional>
    >
  )
})

it('ConstructSchemaSubjectTypeParsed<T>: "string" optional defaulted', () => {
  const stringOptionalDefaulted = {
    type: 'string',
    optional: true,
    default: 'test',
  } as const satisfies Schema

  check<string>(
    unknownX as ConstructSchemaSubjectTypeParsed<typeof stringOptionalDefaulted>
  )
})

it('ConstructSchemaSubjectTypeParsed<T>: "number/boolean/buffer" required', () => {
  const numberSchema = {
    type: 'number',
  } as const satisfies Schema

  check<number>(
    unknownX as ConstructSchemaSubjectTypeParsed<typeof numberSchema>
  )

  const booleanSchema = {
    type: 'boolean',
  } as const satisfies Schema

  check<boolean>(
    unknownX as ConstructSchemaSubjectTypeParsed<typeof booleanSchema>
  )

  const bufferSchema = {
    type: 'buffer',
  } as const satisfies Schema

  check<Buffer>(
    unknownX as ConstructSchemaSubjectTypeParsed<typeof bufferSchema>
  )
})

it('ConstructSchemaSubjectTypeParsed<T>: "stringUnion/numberUnion" required', () => {
  const stringUnionSchema = {
    type: 'stringUnion',
    of: ['a', 'b'],
  } as const satisfies Schema

  check<'a' | 'b'>(
    unknownX as ConstructSchemaSubjectTypeParsed<typeof stringUnionSchema>
  )

  const numberUnionSchema = {
    type: 'numberUnion',
    of: [0, 1],
  } as const satisfies Schema

  check<0 | 1>(
    unknownX as ConstructSchemaSubjectTypeParsed<typeof numberUnionSchema>
  )
})

it('ExtendWithOptionalityOfSchemaValidated<T, U>: check `optional`', () => {
  check<string>(
    unknownX as ExtendWithOptionalityOfSchemaValidated<
      { type: 'string' },
      string
    >
  )

  check<string>(
    unknownX as ExtendWithOptionalityOfSchemaValidated<
      { type: 'string'; optional: false },
      string
    >
  )

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as ExtendWithOptionalityOfSchemaValidated<
      { type: 'string'; optional: true },
      string
    >
  )

  check<string>(
    unknownX as NonNullable<
      ExtendWithOptionalityOfSchemaValidated<
        { type: 'string'; optional: true },
        string
      >
    >
  )
})

it('ExtendWithOptionalityOfSchemaValidated<T, U>: should ignore `default`', () => {
  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as ExtendWithOptionalityOfSchemaValidated<
      { type: 'string'; optional: true; default: 'x' },
      string
    >
  )
})

it('ConstructSchemaSubjectTypeValidated<T>: check optionality extension', () => {
  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as ConstructSchemaSubjectTypeValidated<{
      type: 'string'
      optional: true
    }>
  )

  check<string>(
    unknownX as NonNullable<
      ConstructSchemaSubjectTypeValidated<{
        type: 'string'
        optional: true
      }>
    >
  )

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to parameter of type 'string'
    unknownX as ConstructSchemaSubjectTypeValidated<{
      type: 'string'
      optional: true
      default: 'x'
    }>
  )
})

it('ConstructSchemaSubjectTypeValidated<T>: check brand schema subject type extension', () => {
  check<string & { __id: 'X' }>(
    unknownX as ConstructSchemaSubjectTypeValidated<{
      type: 'string'
      brand: ['id', 'X']
    }>
  )

  check<string & { __id: 'Y' }>(
    // @ts-expect-error '"X"' is not assignable to type '"Y"'
    unknownX as ConstructSchemaSubjectTypeValidated<{
      type: 'string'
      brand: ['id', 'X']
    }>
  )
})

it('ConstructSchemaSubjectTypeValidated<T>: "string" required', () => {
  const stringRequired = {
    type: 'string',
  } as const satisfies Schema

  check<string>(
    unknownX as ConstructSchemaSubjectTypeValidated<typeof stringRequired>
  )
})

it('ConstructSchemaSubjectTypeValidated<T>: "string" required & branded', () => {
  const stringRequired = {
    type: 'string',
    brand: ['id', 'X'],
  } as const satisfies Schema

  check<string & { __id: 'X' }>(
    unknownX as ConstructSchemaSubjectTypeValidated<typeof stringRequired>
  )
})

it('ConstructSchemaSubjectTypeValidated<T>: "string" optional', () => {
  const stringOptional = {
    type: 'string',
    optional: true,
  } as const satisfies Schema

  check<string | undefined>(
    unknownX as ConstructSchemaSubjectTypeValidated<typeof stringOptional>
  )
  check<string>(
    unknownX as NonNullable<
      ConstructSchemaSubjectTypeValidated<typeof stringOptional>
    >
  )
})

it('ConstructSchemaSubjectTypeValidated<T>: "string" optional defaulted', () => {
  const stringOptionalDefaulted = {
    type: 'string',
    optional: true,
    default: 'test',
  } as const satisfies Schema

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as ConstructSchemaSubjectTypeValidated<
      typeof stringOptionalDefaulted
    >
  )
})

it('ConstructSchemaSubjectTypeValidated<T>: "number/boolean/buffer" required', () => {
  const numberSchema = {
    type: 'number',
  } as const satisfies Schema

  check<number>(
    unknownX as ConstructSchemaSubjectTypeValidated<typeof numberSchema>
  )

  const booleanSchema = {
    type: 'boolean',
  } as const satisfies Schema

  check<boolean>(
    unknownX as ConstructSchemaSubjectTypeValidated<typeof booleanSchema>
  )

  const bufferSchema = {
    type: 'buffer',
  } as const satisfies Schema

  check<Buffer>(
    unknownX as ConstructSchemaSubjectTypeValidated<typeof bufferSchema>
  )
})

it('ConstructSchemaSubjectTypeValidated<T>: "stringUnion/numberUnion" required', () => {
  const stringUnionSchema = {
    type: 'stringUnion',
    of: ['a', 'b'],
  } as const satisfies Schema

  check<'a' | 'b'>(
    unknownX as ConstructSchemaSubjectTypeValidated<typeof stringUnionSchema>
  )

  const numberUnionSchema = {
    type: 'numberUnion',
    of: [0, 1],
  } as const satisfies Schema

  check<0 | 1>(
    unknownX as ConstructSchemaSubjectTypeValidated<typeof numberUnionSchema>
  )
})
