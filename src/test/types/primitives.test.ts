import { check, unknownX } from '../test-utils'
import type {
  Con_PrimitiveSchema_TypeOnly_SubjT,
  Con_PrimitiveSchema_SubjT,
  PrimitiveSchema,
} from '../../types/primitives'

it('Con_PrimitiveSchema_TypeOnly_SubjT<T>: construct schema subject type', () => {
  check<string>(
    unknownX as Con_PrimitiveSchema_TypeOnly_SubjT<{ type: 'string' }>
  )
  check<string>(
    // @ts-expect-error 'number' is not assignable 'string'
    unknownX as Con_PrimitiveSchema_TypeOnly_SubjT<{ type: 'number' }>
  )

  check<number>(
    unknownX as Con_PrimitiveSchema_TypeOnly_SubjT<{ type: 'number' }>
  )
  check<number>(
    // @ts-expect-error 'boolean' is not assignable to 'number'
    unknownX as Con_PrimitiveSchema_TypeOnly_SubjT<{ type: 'boolean' }>
  )

  check<boolean>(
    unknownX as Con_PrimitiveSchema_TypeOnly_SubjT<{ type: 'boolean' }>
  )
  check<boolean>(
    // @ts-expect-error 'string' is not assignable to parameter of type 'boolean'
    unknownX as Con_PrimitiveSchema_TypeOnly_SubjT<{ type: 'string' }>
  )

  check<'x'>(
    unknownX as Con_PrimitiveSchema_TypeOnly_SubjT<{ type: 'literal'; of: 'x' }>
  )
  check<'y'>(
    // @ts-expect-error '"x"' is not assignable to parameter of type '"y"'
    unknownX as Con_PrimitiveSchema_TypeOnly_SubjT<{ type: 'literal'; of: 'x' }>
  )

  check<0>(
    unknownX as Con_PrimitiveSchema_TypeOnly_SubjT<{ type: 'literal'; of: 0 }>
  )
  check<1>(
    // @ts-expect-error '0' is not assignable to parameter of type '1'
    unknownX as Con_PrimitiveSchema_TypeOnly_SubjT<{ type: 'literal'; of: 0 }>
  )
})

it('Con_PrimitiveSchema_SubjT<T>: check brand schema subject type extension', () => {
  check<string & { __id: 'X' }>(
    unknownX as Con_PrimitiveSchema_SubjT<{
      type: 'string'
      brand: ['id', 'X']
    }>
  )

  check<string & { __id: 'Y' }>(
    // @ts-expect-error '"X"' is not assignable to type '"Y"'
    unknownX as Con_PrimitiveSchema_SubjT<{
      type: 'string'
      brand: ['id', 'X']
    }>
  )
})

it('Con_PrimitiveSchema_SubjT<T>: "string" required', () => {
  const stringRequired = {
    type: 'string',
  } as const satisfies PrimitiveSchema

  check<string>(unknownX as Con_PrimitiveSchema_SubjT<typeof stringRequired>)
})

it('Con_PrimitiveSchema_SubjT<T>: "string" required & branded', () => {
  const stringRequired = {
    type: 'string',
    brand: ['id', 'X'],
  } as const satisfies PrimitiveSchema

  check<string & { __id: 'X' }>(
    unknownX as Con_PrimitiveSchema_SubjT<typeof stringRequired>
  )
})

it('Con_PrimitiveSchema_SubjT<T>: "string" optional', () => {
  const stringOptional = {
    type: 'string',
    optional: true,
  } as const satisfies PrimitiveSchema

  check<string | undefined>(
    unknownX as Con_PrimitiveSchema_SubjT<typeof stringOptional>
  )
  check<string>(
    unknownX as NonNullable<Con_PrimitiveSchema_SubjT<typeof stringOptional>>
  )
})

it('Con_PrimitiveSchema_SubjT<T>: "string/number/boolean" required', () => {
  const stringSchema = {
    type: 'string',
  } as const satisfies PrimitiveSchema

  check<string>(unknownX as Con_PrimitiveSchema_SubjT<typeof stringSchema>)

  const numberSchema = {
    type: 'number',
  } as const satisfies PrimitiveSchema

  check<number>(unknownX as Con_PrimitiveSchema_SubjT<typeof numberSchema>)

  const booleanSchema = {
    type: 'boolean',
  } as const satisfies PrimitiveSchema

  check<boolean>(unknownX as Con_PrimitiveSchema_SubjT<typeof booleanSchema>)
})

it('Con_PrimitiveSchema_SubjT<T>: check branded schema', () => {
  const schema = {
    type: 'string',
    brand: ['key', 'value'],
  } as const satisfies PrimitiveSchema

  check<string & { __key: 'value' }>(
    unknownX as Con_PrimitiveSchema_SubjT<typeof schema>
  )
  check<number & { __key: 'value' }>(
    // @ts-expect-error '{ __key: "value"; } & string' is not 'number & { __key: "value"; }'
    unknownX as Con_PrimitiveSchema_SubjT<typeof schema>
  )
})

describe('PrimitiveSchema parameters', () => {
  it('Con_PrimitiveSchema_SubjT<T>: optional', () => {
    type StrSubj = Con_PrimitiveSchema_SubjT<{
      type: 'string'
      optional: true
    }>

    check<string | undefined>(unknownX as StrSubj)
    // @ts-expect-error 'string | undefined' is not 'string'
    check<string>(unknownX as StrSubj)

    type NumSubj = Con_PrimitiveSchema_SubjT<{
      type: 'number'
      optional: true
    }>

    check<number | undefined>(unknownX as NumSubj)
    // @ts-expect-error 'number | undefined' is not 'number'
    check<number>(unknownX as NumSubj)

    type BoolSubj = Con_PrimitiveSchema_SubjT<{
      type: 'boolean'
      optional: true
    }>

    check<boolean | undefined>(unknownX as BoolSubj)
    // @ts-expect-error 'boolean | undefined' is not 'boolean'
    check<boolean>(unknownX as BoolSubj)

    type LitSubj = Con_PrimitiveSchema_SubjT<{
      type: 'literal'
      of: 'x'
      optional: true
    }>

    check<'x' | undefined>(unknownX as LitSubj)
    // @ts-expect-error 'string | undefined' is not 'string'
    check<'x'>(unknownX as LitSubj)
  })

  it('Con_PrimitiveSchema_SubjT<T>: nullable', () => {
    type StrSubj = Con_PrimitiveSchema_SubjT<{
      type: 'string'
      nullable: true
    }>

    check<string | null>(unknownX as StrSubj)
    // @ts-expect-error 'string | null' is not 'string'
    check<string>(unknownX as StrSubj)

    type NumSubj = Con_PrimitiveSchema_SubjT<{
      type: 'number'
      nullable: true
    }>

    check<number | null>(unknownX as NumSubj)
    // @ts-expect-error 'number | null' is not 'number'
    check<number>(unknownX as NumSubj)

    type BoolSubj = Con_PrimitiveSchema_SubjT<{
      type: 'boolean'
      nullable: true
    }>

    check<boolean | null>(unknownX as BoolSubj)
    // @ts-expect-error 'boolean | null' is not 'boolean'
    check<boolean>(unknownX as BoolSubj)

    type LitSubj = Con_PrimitiveSchema_SubjT<{
      type: 'literal'
      of: 'x'
      nullable: true
    }>

    check<'x' | null>(unknownX as LitSubj)
    // @ts-expect-error 'string | null' is not 'string'
    check<'x'>(unknownX as LitSubj)
  })
})
