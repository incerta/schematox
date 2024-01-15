import { check, unknownX } from './test-utils'
import {
  ConstructPrimitiveSchemaSubjectTypeParsed,
  ConstructPrimitiveSchemaSubjectTypeValidated,
  ConstructArraySchemaShortSubjectType,
  ConstructArraySchemaDetailedSubjectType,
  ConstructArraySchemaSubjectType,
  ConstructObjectSchemaSubjectTypeParsed,
  ObjectSchema,
  ArraySchemaShort,
  Schema,
} from '../compound-types'

it('ConstructPrimitiveSchemaSubjectTypeParsed<T>: check "string" PrimitiveShort & PrimitiveDetailed required/optional/default cases', () => {
  /* PrimitiveDetailed */

  check<string>(
    unknownX as ConstructPrimitiveSchemaSubjectTypeParsed<{ type: 'string' }>
  )

  check<string>(
    // @ts-expect-error 'number' is not assignable to 'string'
    unknownX as ConstructPrimitiveSchemaSubjectTypeParsed<{ type: 'number' }>
  )

  check<string | undefined>(
    unknownX as ConstructPrimitiveSchemaSubjectTypeParsed<{
      type: 'string'
      optional: true
    }>
  )

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as ConstructPrimitiveSchemaSubjectTypeParsed<{
      type: 'string'
      optional: true
    }>
  )

  check<string>(
    unknownX as ConstructPrimitiveSchemaSubjectTypeParsed<{
      type: 'string'
      optional: true
      default: 'x'
    }>
  )

  /* PrimitiveShort */

  check<string>(unknownX as ConstructPrimitiveSchemaSubjectTypeParsed<'string'>)

  check<string>(
    // @ts-expect-error 'number' is not assignable to 'string'
    unknownX as ConstructPrimitiveSchemaSubjectTypeParsed<'number'>
  )
})

it('ConstructPrimitiveSchemaSubjectTypeValidated<T>: check "string" PrimitiveShort & PrimitiveDetailed required/optional/default cases', () => {
  /* PrimitiveDetailedSchema */

  check<string>(
    unknownX as ConstructPrimitiveSchemaSubjectTypeValidated<{ type: 'string' }>
  )

  check<string>(
    // @ts-expect-error 'number' is not assignable to 'string'
    unknownX as ConstructPrimitiveSchemaSubjectTypeValidated<{ type: 'number' }>
  )

  check<string | undefined>(
    unknownX as ConstructPrimitiveSchemaSubjectTypeValidated<{
      type: 'string'
      optional: true
    }>
  )

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as ConstructPrimitiveSchemaSubjectTypeValidated<{
      type: 'string'
      optional: true
    }>
  )

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as ConstructPrimitiveSchemaSubjectTypeValidated<{
      type: 'string'
      optional: true
      default: 'x'
    }>
  )

  /* PrimitiveShortSchema */

  check<string>(
    unknownX as ConstructPrimitiveSchemaSubjectTypeValidated<'string'>
  )

  check<string>(
    // @ts-expect-error 'number' is not assignable to 'string'
    unknownX as ConstructPrimitiveSchemaSubjectTypeValidated<'number'>
  )
})

it('ConstructArraySchemaShortSubjectType<T>: check ArrSchema subject type', () => {
  check<Array<Array<string>>>(
    unknownX as ConstructArraySchemaShortSubjectType<[['string']]>
  )

  check<Array<Array<string>>>(
    // @ts-expect-error 'number[]' is not assignable to type 'string[]'
    unknownX as ConstructArraySchemaShortSubjectType<[['number']]>
  )

  const arrSchemaShortSample = [
    // depth 1 Array<Array<T>>
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
  ] as const satisfies ArraySchemaShort

  type ResultType = ConstructArraySchemaShortSubjectType<
    typeof arrSchemaShortSample
  >

  check<Array<Array<Array<Array<Array<Array<Array<string>>>>>>>>(
    unknownX as ResultType
  )
})

it('ConstructArraySchemaShortSubjectType<T>: check ObjectSchema subject type', () => {
  check<Array<{ x: string }>>(
    unknownX as ConstructArraySchemaShortSubjectType<[{ x: 'string' }]>
  )

  check<Array<{ x: string }>>(
    // @ts-expect-error '{ x: number; }[]' is not assignable to '{ x: string; }[]'
    unknownX as ConstructArraySchemaShortSubjectType<[{ x: 'number' }]>
  )
})

it('ConstructArraySchemaShortSubjectType<T>: should ignore optional/default values', () => {
  check<string[]>(unknownX as ConstructArraySchemaShortSubjectType<['string']>)

  check<string[]>(
    // @ts-expect-error 'number[]' is not assignable to 'string[]'
    unknownX as ConstructArraySchemaShortSubjectType<['number']>
  )

  check<string[]>(unknownX as ConstructArraySchemaShortSubjectType<['string?']>)

  check<string[]>(
    unknownX as ConstructArraySchemaShortSubjectType<[{ type: 'string' }]>
  )

  check<string[]>(
    // @ts-expect-error 'number[]' is not assignable to 'string[]'
    unknownX as ConstructArraySchemaShortSubjectType<[{ type: 'number' }]>
  )

  check<string[]>(
    unknownX as ConstructArraySchemaShortSubjectType<
      [{ type: 'string'; optional: true }]
    >
  )

  check<string[]>(
    unknownX as ConstructArraySchemaShortSubjectType<
      [{ type: 'string'; optional: true; default: 'x' }]
    >
  )
})

it('ConstructArraySchemaDetailedSubjectType<T>: should ignore optional/default `of` schema props', () => {
  check<string[]>(
    unknownX as ConstructArraySchemaDetailedSubjectType<{
      type: 'array'
      of: 'string'
    }>
  )

  check<string[]>(
    // @ts-expect-error 'number[]' is not assignable to 'string[]'
    unknownX as ConstructArraySchemaDetailedSubjectType<{
      type: 'array'
      of: 'number'
    }>
  )

  check<string[]>(
    unknownX as ConstructArraySchemaDetailedSubjectType<{
      type: 'array'
      of: 'string?'
    }>
  )

  check<string[]>(
    unknownX as ConstructArraySchemaDetailedSubjectType<{
      type: 'array'
      of: { type: 'string' }
    }>
  )

  check<string[]>(
    // @ts-expect-error 'number[]' is not assignable to 'string[]'
    unknownX as ConstructArraySchemaDetailedSubjectType<{
      type: 'array'
      of: { type: 'number' }
    }>
  )

  check<string[]>(
    unknownX as ConstructArraySchemaDetailedSubjectType<{
      type: 'array'
      of: { type: 'string'; optional: true }
    }>
  )

  check<string[]>(
    unknownX as ConstructArraySchemaDetailedSubjectType<{
      type: 'array'
      of: { type: 'string'; optional: true; default: 'x' }
    }>
  )
})

it('ConstructArraySchemaDetailedSubjectType<T>: ArraySchemaDetailed can be optional by itself', () => {
  check<string[] | undefined>(
    unknownX as ConstructArraySchemaDetailedSubjectType<{
      type: 'array'
      of: 'string'
      optional: true
    }>
  )

  check<string[]>(
    // @ts-expect-error 'string[] | undefined' is not assignable to 'string[]'
    unknownX as ConstructArraySchemaDetailedSubjectType<{
      type: 'array'
      of: 'string'
      optional: true
    }>
  )
})

it('ConstructArraySchemaSubjectType<T>: required "string[]" Detailed & Short cases', () => {
  const requiredStringArrDetailed = {
    type: 'array',
    of: 'string',
  } as const satisfies Schema

  check<string[]>(
    unknownX as ConstructArraySchemaSubjectType<
      typeof requiredStringArrDetailed
    >
  )

  check<number[]>(
    // @ts-expect-error 'string[]' is not assignable to 'number[]'
    unknownX as ConstructArraySchemaSubjectType<
      typeof requiredStringArrDetailed
    >
  )

  const requiredStringArrShort = ['string'] as const satisfies Schema

  check<string[]>(
    unknownX as ConstructArraySchemaSubjectType<typeof requiredStringArrShort>
  )

  check<number[]>(
    // @ts-expect-error 'string[]' is not assignable to 'number[]'
    unknownX as ConstructArraySchemaSubjectType<typeof requiredStringArrShort>
  )
})

it('ConstructObjectSchemaSubjectTypeParsed<T>: ...', () => {
  check<{ x: string }>(
    unknownX as ConstructObjectSchemaSubjectTypeParsed<{
      x: 'string'
    }>
  )

  check<{ x: string; y: { x: string } }>(
    unknownX as ConstructObjectSchemaSubjectTypeParsed<{
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
  }>(
    unknownX as ConstructObjectSchemaSubjectTypeParsed<
      typeof objectSchemaSample
    >
  )
})
