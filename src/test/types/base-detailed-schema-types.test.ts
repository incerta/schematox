import { check, unknownX } from '../test-utils'
import type {
  Con_BrandSchema_SubjT,
  Con_BD_Schema_TypeOnly_SubjT,
  Con_BD_Schema_SubjT_V,
  ExtWith_BrandSchema_SubjT,
  ExtWith_BD_OptionalSchema_SubjT_V,
  BD_Schema,
} from '../../types/base-detailed-schema-types'

it('Con_BD_Schema_TypeOnly_SubjT<T>: should construct schema base subject type', () => {
  check<string>(unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'string' }>)
  // @ts-expect-error 'number' is not assignable 'string'
  check<string>(unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'number' }>)

  check<number>(unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'number' }>)
  // @ts-expect-error 'boolean' is not assignable to 'number'
  check<number>(unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'boolean' }>)

  check<boolean>(unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'boolean' }>)
  // @ts-expect-error 'string' is not assignable to parameter of type 'boolean'
  check<boolean>(unknownX as Con_BD_Schema_TypeOnly_SubjT<{ type: 'string' }>)
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

it('Con_BD_Schema_SubjT_V<T>: "string/number/boolean" required', () => {
  const stringSchema = {
    type: 'string',
  } as const satisfies BD_Schema

  check<string>(unknownX as Con_BD_Schema_SubjT_V<typeof stringSchema>)

  const numberSchema = {
    type: 'number',
  } as const satisfies BD_Schema

  check<number>(unknownX as Con_BD_Schema_SubjT_V<typeof numberSchema>)

  const booleanSchema = {
    type: 'boolean',
  } as const satisfies BD_Schema

  check<boolean>(unknownX as Con_BD_Schema_SubjT_V<typeof booleanSchema>)
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
