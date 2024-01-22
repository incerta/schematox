import { check, unknownX } from './test-utils'
import type {
  Con_BrandSchema_SubjT,
  Con_BD_Schema_TypeOnly_SubjT,
  Con_BD_Schema_SubjT_P,
  Con_BD_Schema_SubjT_V,
  ExtWith_BrandSchema_SubjT,
  ExtWith_BD_OptionalSchema_SubjT_P,
  ExtWith_BD_OptionalSchema_SubjT_V,
  BD_Schema,
} from '../base-detailed-schema-types'

it('BD_StringUnion: check "as const" (immutability) constraint', () => {
  const mutableSchema = {
    type: 'stringUnion',
    of: ['x', 'y'],
  } satisfies BD_Schema

  // @ts-expect-error '{ type: "stringUnion"; of: string[]; }' is not '{ type: "stringUnion"; of: ["x", "y"]; }'
  check<{ type: 'stringUnion'; of: Readonly<['x', 'y']> }>(mutableSchema)

  const immutableSchema = {
    type: 'stringUnion',
    of: ['x', 'y'],
  } as const satisfies BD_Schema

  check<{ type: 'stringUnion'; of: Readonly<['x', 'y']> }>(immutableSchema)
})

it('BD_NumberUnion: check "as const" (immutability) constraint', () => {
  const mutableSchema = {
    type: 'numberUnion',
    of: [0, 1],
  } satisfies BD_Schema

  // @ts-expect-error '{ type: "numberUnion"; of: number[]; }' is not '{ type: "numberUnion"; of: readonly [0, 1]; }'
  check<{ type: 'numberUnion'; of: Readonly<[0, 1]> }>(mutableSchema)

  const immutableSchema = {
    type: 'numberUnion',
    of: [0, 1],
  } as const satisfies BD_Schema

  check<{ type: 'numberUnion'; of: Readonly<[0, 1]> }>(immutableSchema)
})

it('Con_BD_Schema_TypeOnly_SubjT<T>: should construct schema base subject type', () => {
  check<string>(unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'string' }>)
  // @ts-expect-error 'number' is not assignable 'string'
  check<string>(unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'number' }>)

  check<number>(unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'number' }>)
  // @ts-expect-error 'boolean' is not assignable to 'number'
  check<number>(unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'boolean' }>)

  check<boolean>(unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'boolean' }>)
  // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean'
  check<boolean>(unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'buffer' }>)

  check<Buffer>(unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'buffer' }>)
  // @ts-expect-error 'string' is not assignable to 'Buffer'
  check<Buffer>(unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'string' }>)

  check<'a' | 'b'>(
    unknownX as Con_BD_Schema_TypeOnly_SubjT<{
      type: 'stringUnion'
      of: ['a', 'b']
    }>
  )

  check<'a' | 'b'>(
    // @ts-expect-error '"a" | "b" | "c"' is not assignable to '"a" | "b"'
    unknownX as Con_BD_Schema_TypeOnly_SubjT<{
      type: 'stringUnion'
      of: ['a', 'b', 'c']
    }>
  )

  check<'a' | 'b'>(
    // @ts-expect-error '2 | 1' is not assignable to '"a" | "b"'
    unknownX as Con_BD_Schema_TypeOnly_SubjT<{
      type: 'numberUnion'
      of: [0, 1]
    }>
  )

  check<0 | 1>(
    unknownX as Con_BD_Schema_TypeOnly_SubjT<{
      type: 'numberUnion'
      of: [0, 1]
    }>
  )

  check<0 | 1>(
    // @ts-expect-error '0 | 2 | 1' is not assignable to '0 | 1'
    unknownX as Con_BD_Schema_TypeOnly_SubjT<{
      type: 'numberUnion'
      of: [0, 1, 2]
    }>
  )

  check<0 | 1>(
    // @ts-expect-error 'string' is not assignable to parameter of type '0 | 1'
    unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'string' }>
  )
})

it('Con_BrandSchema_SubjT<T>: should construct schema subject brand type', () => {
  check<{ __id: 'X' }>(unknownX as Con_BrandSchema_SubjT<['id', 'X']>)

  check<{ __id: 'Y' }>(
    // @ts-expect-error '{ __id: "X" }' is not assignable '{ __id: "Y" }'
    unknownX as Con_BrandSchema_SubjT<['id', 'X']>
  )

  check<{ __idX: 'X' }>(
    // @ts-expect-error '{ __idY: "X" }' is not assignable to '{ __idY: "X" }'
    unknownX as Con_BrandSchema_SubjT<['idY', 'X']>
  )
})

it('ExtWith_BrandSchema_SubjT<T, U>: should narrow U type with brand schema subject type', () => {
  check<string & { __id: 'X' }>(
    // @ts-expect-error 'string' is not assignable to 'string & { __id: "X" }'
    unknownX as ExtWith_BrandSchema_SubjT<{ type: 'string' }, string>
  )

  check<string & { __id: 'X' }>(
    unknownX as ExtWith_BrandSchema_SubjT<
      { type: 'string'; brand: ['id', 'X'] },
      string
    >
  )
})

it('ExtWith_BD_OptionalSchema_SubjT_P<T, U>: optional case only', () => {
  check<string>(
    unknownX as ExtWith_BD_OptionalSchema_SubjT_P<{ type: 'string' }, string>
  )

  check<string>(
    unknownX as NonNullable<
      ExtWith_BD_OptionalSchema_SubjT_P<
        { type: 'string'; optional: true },
        string
      >
    >
  )

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable 'string'
    unknownX as ExtWith_BD_OptionalSchema_SubjT_P<
      { type: 'string'; optional: true },
      string
    >
  )
})

it('ExtWith_BD_OptionalSchema_SubjT_P<T, U>: optional + default case', () => {
  check<string>(
    unknownX as ExtWith_BD_OptionalSchema_SubjT_P<
      { type: 'string'; optional: true; default: 'x' },
      string
    >
  )

  check<string>(
    unknownX as ExtWith_BD_OptionalSchema_SubjT_P<
      { type: 'string'; optional: true; default: 'x' },
      string
    >
  )

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as ExtWith_BD_OptionalSchema_SubjT_P<
      { type: 'string'; optional: true; default: undefined },
      string
    >
  )
})

it('Con_BD_Schema_SubjT_P<T>: check optionality extension', () => {
  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as Con_BD_Schema_SubjT_P<{
      type: 'string'
      optional: true
    }>
  )

  check<string>(
    unknownX as NonNullable<
      Con_BD_Schema_SubjT_P<{
        type: 'string'
        optional: true
      }>
    >
  )

  check<string>(
    unknownX as Con_BD_Schema_SubjT_P<{
      type: 'string'
      optional: true
      default: 'x'
    }>
  )
})

it('Con_BD_Schema_SubjT_P<T>: check brand schema subject type extension', () => {
  check<string & { __id: 'X' }>(
    unknownX as Con_BD_Schema_SubjT_P<{
      type: 'string'
      brand: ['id', 'X']
    }>
  )

  check<string & { __id: 'Y' }>(
    // @ts-expect-error '"X"' is not assignable to type '"Y"'
    unknownX as Con_BD_Schema_SubjT_P<{
      type: 'string'
      brand: ['id', 'X']
    }>
  )
})

it('Con_BD_Schema_SubjT_P<T>: "string" required', () => {
  const stringRequired = {
    type: 'string',
  } as const satisfies BD_Schema

  check<string>(unknownX as Con_BD_Schema_SubjT_P<typeof stringRequired>)
})

it('Con_BD_Schema_SubjT_P<T>: "string" required & branded', () => {
  const stringRequired = {
    type: 'string',
    brand: ['id', 'X'],
  } as const satisfies BD_Schema

  check<string & { __id: 'X' }>(
    unknownX as Con_BD_Schema_SubjT_P<typeof stringRequired>
  )
})

it('Con_BD_Schema_SubjT_P<T>: "string" optional', () => {
  const stringOptional = {
    type: 'string',
    optional: true,
  } as const satisfies BD_Schema

  check<string | undefined>(
    unknownX as Con_BD_Schema_SubjT_P<typeof stringOptional>
  )
  check<string>(
    unknownX as NonNullable<Con_BD_Schema_SubjT_P<typeof stringOptional>>
  )
})

it('Con_BD_Schema_SubjT_P<T>: "string" optional defaulted', () => {
  const stringOptionalDefaulted = {
    type: 'string',
    optional: true,
    default: 'test',
  } as const satisfies BD_Schema

  check<string>(
    unknownX as Con_BD_Schema_SubjT_P<typeof stringOptionalDefaulted>
  )
})

it('Con_BD_Schema_SubjT_P<T>: "number/boolean/buffer" required', () => {
  const numberSchema = {
    type: 'number',
  } as const satisfies BD_Schema

  check<number>(unknownX as Con_BD_Schema_SubjT_P<typeof numberSchema>)

  const booleanSchema = {
    type: 'boolean',
  } as const satisfies BD_Schema

  check<boolean>(unknownX as Con_BD_Schema_SubjT_P<typeof booleanSchema>)

  const bufferSchema = {
    type: 'buffer',
  } as const satisfies BD_Schema

  check<Buffer>(unknownX as Con_BD_Schema_SubjT_P<typeof bufferSchema>)
})

it('Con_BD_Schema_SubjT_P<T>: "stringUnion/numberUnion" required', () => {
  const stringUnionSchema = {
    type: 'stringUnion',
    of: ['a', 'b'],
  } as const satisfies BD_Schema

  check<'a' | 'b'>(unknownX as Con_BD_Schema_SubjT_P<typeof stringUnionSchema>)

  const numberUnionSchema = {
    type: 'numberUnion',
    of: [0, 1],
  } as const satisfies BD_Schema

  check<0 | 1>(unknownX as Con_BD_Schema_SubjT_P<typeof numberUnionSchema>)
})

it('Con_BD_Schema_SubjT_P<T>: check branded schema', () => {
  const schema = {
    type: 'string',
    brand: ['key', 'value'],
  } as const satisfies BD_Schema

  check<string & { __key: 'value' }>(
    unknownX as Con_BD_Schema_SubjT_P<typeof schema>
  )
  check<number & { __key: 'value' }>(
    // @ts-expect-error '{ __key: "value"; } & string' is not 'number & { __key: "value"; }'
    unknownX as Con_BD_Schema_SubjT_P<typeof schema>
  )
})

it('ExtWith_BD_OptionalSchema_SubjT_V<T, U>: check `optional`', () => {
  check<string>(
    unknownX as ExtWith_BD_OptionalSchema_SubjT_V<{ type: 'string' }, string>
  )

  check<string>(
    unknownX as ExtWith_BD_OptionalSchema_SubjT_V<
      { type: 'string'; optional: false },
      string
    >
  )

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as ExtWith_BD_OptionalSchema_SubjT_V<
      { type: 'string'; optional: true },
      string
    >
  )

  check<string>(
    unknownX as NonNullable<
      ExtWith_BD_OptionalSchema_SubjT_V<
        { type: 'string'; optional: true },
        string
      >
    >
  )
})

it('ExtWith_BD_OptionalSchema_SubjT_V<T, U>: should ignore `default`', () => {
  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as ExtWith_BD_OptionalSchema_SubjT_V<
      { type: 'string'; optional: true; default: 'x' },
      string
    >
  )
})

it('Con_BD_Schema_SubjT_V<T>: check optionality extension', () => {
  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as Con_BD_Schema_SubjT_V<{
      type: 'string'
      optional: true
    }>
  )

  check<string>(
    unknownX as NonNullable<
      Con_BD_Schema_SubjT_V<{
        type: 'string'
        optional: true
      }>
    >
  )

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to parameter of type 'string'
    unknownX as Con_BD_Schema_SubjT_V<{
      type: 'string'
      optional: true
      default: 'x'
    }>
  )
})

it('Con_BD_Schema_SubjT_V<T>: check brand schema subject type extension', () => {
  check<string & { __id: 'X' }>(
    unknownX as Con_BD_Schema_SubjT_V<{
      type: 'string'
      brand: ['id', 'X']
    }>
  )

  check<string & { __id: 'Y' }>(
    // @ts-expect-error '"X"' is not assignable to type '"Y"'
    unknownX as Con_BD_Schema_SubjT_V<{
      type: 'string'
      brand: ['id', 'X']
    }>
  )
})

it('Con_BD_Schema_SubjT_V<T>: "string" required', () => {
  const stringRequired = {
    type: 'string',
  } as const satisfies BD_Schema

  check<string>(unknownX as Con_BD_Schema_SubjT_V<typeof stringRequired>)
})

it('Con_BD_Schema_SubjT_V<T>: "string" required & branded', () => {
  const stringRequired = {
    type: 'string',
    brand: ['id', 'X'],
  } as const satisfies BD_Schema

  check<string & { __id: 'X' }>(
    unknownX as Con_BD_Schema_SubjT_V<typeof stringRequired>
  )
})

it('Con_BD_Schema_SubjT_V<T>: "string" optional', () => {
  const stringOptional = {
    type: 'string',
    optional: true,
  } as const satisfies BD_Schema

  check<string | undefined>(
    unknownX as Con_BD_Schema_SubjT_V<typeof stringOptional>
  )
  check<string>(
    unknownX as NonNullable<Con_BD_Schema_SubjT_V<typeof stringOptional>>
  )
})

it('Con_BD_Schema_SubjT_V<T>: "string" optional defaulted', () => {
  const stringOptionalDefaulted = {
    type: 'string',
    optional: true,
    default: 'test',
  } as const satisfies BD_Schema

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as Con_BD_Schema_SubjT_V<typeof stringOptionalDefaulted>
  )
})

it('Con_BD_Schema_SubjT_V<T>: "number/boolean/buffer" required', () => {
  const numberSchema = {
    type: 'number',
  } as const satisfies BD_Schema

  check<number>(unknownX as Con_BD_Schema_SubjT_V<typeof numberSchema>)

  const booleanSchema = {
    type: 'boolean',
  } as const satisfies BD_Schema

  check<boolean>(unknownX as Con_BD_Schema_SubjT_V<typeof booleanSchema>)

  const bufferSchema = {
    type: 'buffer',
  } as const satisfies BD_Schema

  check<Buffer>(unknownX as Con_BD_Schema_SubjT_V<typeof bufferSchema>)
})

it('Con_BD_Schema_SubjT_V<T>: "stringUnion/numberUnion" required', () => {
  const stringUnionSchema = {
    type: 'stringUnion',
    of: ['a', 'b'],
  } as const satisfies BD_Schema

  check<'a' | 'b'>(unknownX as Con_BD_Schema_SubjT_V<typeof stringUnionSchema>)

  const numberUnionSchema = {
    type: 'numberUnion',
    of: [0, 1],
  } as const satisfies BD_Schema

  check<0 | 1>(unknownX as Con_BD_Schema_SubjT_V<typeof numberUnionSchema>)
})

it('Con_BD_Schema_SubjT_V<T>: check branded schema', () => {
  const schema = {
    type: 'string',
    brand: ['key', 'value'],
  } as const satisfies BD_Schema

  check<string & { __key: 'value' }>(
    unknownX as Con_BD_Schema_SubjT_V<typeof schema>
  )
  check<number & { __key: 'value' }>(
    // @ts-expect-error '{ __key: "value"; } & string' is not 'number & { __key: "value"; }'
    unknownX as Con_BD_Schema_SubjT_V<typeof schema>
  )
})
