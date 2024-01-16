import { check, unknownX } from './test-utils'
import {
  Con_BaseSchema_SubjT_P,
  Con_BaseSchema_SubjT_V,
  Con_CS_Array_SubjT,
  Con_CD_Array_SubjT,
  Con_ArraySchema_SubjT,
  Con_ObjectSchema_SubjT_P,
  ObjectSchema,
  CS_Array,
  Schema,
} from '../compound-schema-types'

it('Con_BaseSchema_SubjT_P<T>: check "string" BS & BD required/optional/default cases', () => {
  /* Base detailed schema */

  check<string>(unknownX as Con_BaseSchema_SubjT_P<{ type: 'string' }>)

  check<string>(
    // @ts-expect-error 'number' is not assignable to 'string'
    unknownX as Con_BaseSchema_SubjT_P<{ type: 'number' }>
  )

  check<string | undefined>(
    unknownX as Con_BaseSchema_SubjT_P<{
      type: 'string'
      optional: true
    }>
  )

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as Con_BaseSchema_SubjT_P<{
      type: 'string'
      optional: true
    }>
  )

  check<string>(
    unknownX as Con_BaseSchema_SubjT_P<{
      type: 'string'
      optional: true
      default: 'x'
    }>
  )

  /* Base short schema */

  check<string>(unknownX as Con_BaseSchema_SubjT_P<'string'>)

  check<string>(
    // @ts-expect-error 'number' is not assignable to 'string'
    unknownX as Con_BaseSchema_SubjT_P<'number'>
  )
})

it('Con_BaseSchema_SubjT_V<T>: check "string" BS & BD required/optional/default cases', () => {
  /* Base detailed schema */

  check<string>(unknownX as Con_BaseSchema_SubjT_V<{ type: 'string' }>)

  check<string>(
    // @ts-expect-error 'number' is not assignable to 'string'
    unknownX as Con_BaseSchema_SubjT_V<{ type: 'number' }>
  )

  check<string | undefined>(
    unknownX as Con_BaseSchema_SubjT_V<{
      type: 'string'
      optional: true
    }>
  )

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as Con_BaseSchema_SubjT_V<{
      type: 'string'
      optional: true
    }>
  )

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as Con_BaseSchema_SubjT_V<{
      type: 'string'
      optional: true
      default: 'x'
    }>
  )

  /* Base short schema */

  check<string>(unknownX as Con_BaseSchema_SubjT_V<'string'>)

  check<string>(
    // @ts-expect-error 'number' is not assignable to 'string'
    unknownX as Con_BaseSchema_SubjT_V<'number'>
  )
})

it('Con_CS_Array_SubjT<T>: check ArrSchema subject type', () => {
  check<Array<Array<string>>>(unknownX as Con_CS_Array_SubjT<[['string']]>)

  check<Array<Array<string>>>(
    // @ts-expect-error 'number[]' is not assignable to type 'string[]'
    unknownX as Con_CS_Array_SubjT<[['number']]>
  )

  const arrSchemaShortSample = [
    // depth 1 Array<T>
    [
      // depth 2 Array<Array<T>>
      [
        // depth 3 Array<Array<Array<T>>>
        [
          // depth 4 Array<Array<Array<Array<T>>>>
          [
            // depth 5 Array<Array<Array<Array<Array<T>>>>>
            [
              // depth 6 Array<Array<Array<Array<Array<Array<T>>>>>>
              [
                // depth 7 Array<Array<Array<Array<Array<Array<Array<T>>>>>>>
                'string',
              ],
            ],
          ],
        ],
      ],
    ],
  ] as const satisfies CS_Array

  type ResultType = Con_CS_Array_SubjT<typeof arrSchemaShortSample>

  check<Array<Array<Array<Array<Array<Array<Array<string>>>>>>>>(
    unknownX as ResultType
  )
})

it('Con_CS_Array_SubjT<T>: check CS_Object subject type', () => {
  check<Array<{ x: string }>>(unknownX as Con_CS_Array_SubjT<[{ x: 'string' }]>)

  check<Array<{ x: string }>>(
    // @ts-expect-error '{ x: number; }[]' is not assignable to '{ x: string; }[]'
    unknownX as Con_CS_Array_SubjT<[{ x: 'number' }]>
  )
})

it('Con_CS_Array_SubjT<T>: should ignore optional/default values', () => {
  check<string[]>(unknownX as Con_CS_Array_SubjT<['string']>)

  check<string[]>(
    // @ts-expect-error 'number[]' is not assignable to 'string[]'
    unknownX as Con_CS_Array_SubjT<['number']>
  )

  check<string[]>(unknownX as Con_CS_Array_SubjT<['string?']>)

  check<string[]>(unknownX as Con_CS_Array_SubjT<[{ type: 'string' }]>)

  check<string[]>(
    // @ts-expect-error 'number[]' is not assignable to 'string[]'
    unknownX as Con_CS_Array_SubjT<[{ type: 'number' }]>
  )

  check<string[]>(
    unknownX as Con_CS_Array_SubjT<[{ type: 'string'; optional: true }]>
  )

  check<string[]>(
    unknownX as Con_CS_Array_SubjT<
      [{ type: 'string'; optional: true; default: 'x' }]
    >
  )
})

it('Con_CD_Array_SubjT<T>: should ignore optional/default `of` schema props', () => {
  check<string[]>(
    unknownX as Con_CD_Array_SubjT<{
      type: 'array'
      of: 'string'
    }>
  )

  check<string[]>(
    // @ts-expect-error 'number[]' is not assignable to 'string[]'
    unknownX as Con_CD_Array_SubjT<{
      type: 'array'
      of: 'number'
    }>
  )

  check<string[]>(
    unknownX as Con_CD_Array_SubjT<{
      type: 'array'
      of: 'string?'
    }>
  )

  check<string[]>(
    unknownX as Con_CD_Array_SubjT<{
      type: 'array'
      of: { type: 'string' }
    }>
  )

  check<string[]>(
    // @ts-expect-error 'number[]' is not assignable to 'string[]'
    unknownX as Con_CD_Array_SubjT<{
      type: 'array'
      of: { type: 'number' }
    }>
  )

  check<string[]>(
    unknownX as Con_CD_Array_SubjT<{
      type: 'array'
      of: { type: 'string'; optional: true }
    }>
  )

  check<string[]>(
    unknownX as Con_CD_Array_SubjT<{
      type: 'array'
      of: { type: 'string'; optional: true; default: 'x' }
    }>
  )
})

it('Con_CD_Array_SubjT<T>: CD_Array can be optional by itself', () => {
  check<string[] | undefined>(
    unknownX as Con_CD_Array_SubjT<{
      type: 'array'
      of: 'string'
      optional: true
    }>
  )

  check<string[]>(
    // @ts-expect-error 'string[] | undefined' is not assignable to 'string[]'
    unknownX as Con_CD_Array_SubjT<{
      type: 'array'
      of: 'string'
      optional: true
    }>
  )
})

it('Con_ArraySchema_SubjT<T>: required "string[]" Detailed & Short cases', () => {
  const requiredStringArrDetailed = {
    type: 'array',
    of: 'string',
  } as const satisfies Schema

  check<string[]>(
    unknownX as Con_ArraySchema_SubjT<typeof requiredStringArrDetailed>
  )

  check<number[]>(
    // @ts-expect-error 'string[]' is not assignable to 'number[]'
    unknownX as Con_ArraySchema_SubjT<typeof requiredStringArrDetailed>
  )

  const requiredStringArrShort = ['string'] as const satisfies Schema

  check<string[]>(
    unknownX as Con_ArraySchema_SubjT<typeof requiredStringArrShort>
  )

  check<number[]>(
    // @ts-expect-error 'string[]' is not assignable to 'number[]'
    unknownX as Con_ArraySchema_SubjT<typeof requiredStringArrShort>
  )
})

it('Con_ObjectSchema_SubjT_P<T>: check object schema nesting', () => {
  check<{ x: string }>(
    unknownX as Con_ObjectSchema_SubjT_P<{
      x: 'string'
    }>
  )

  check<{ x: string; y: { x: string } }>(
    unknownX as Con_ObjectSchema_SubjT_P<{
      x: 'string'
      y: {
        x: 'string'
      }
    }>
  )

  const objectSchemaSample = {
    '1': {
      x: { type: 'string' },
      '2': {
        x: 'string',
        '3': {
          x: 'string',
          '4': {
            x: 'string',
            '5': {
              x: 'string',
              '6': {
                x: 'string',
                '7': {
                  x: 'string',
                },
              },
            },
          },
        },
      },
    },
  } as const satisfies ObjectSchema

  check<{
    '1': {
      x: string
      '2': {
        x: string
        '3': {
          x: string
          '4': {
            x: string
            '5': {
              x: string
              '6': {
                x: string
                '7': {
                  x: string
                }
              }
            }
          }
        }
      }
    }
  }>(unknownX as Con_ObjectSchema_SubjT_P<typeof objectSchemaSample>)
})
