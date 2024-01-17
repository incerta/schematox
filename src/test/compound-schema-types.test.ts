import { check, unknownX } from './test-utils'
import {
  Con_BaseSchema_SubjT_P,
  Con_BaseSchema_SubjT_V,
  Con_CD_Array_SubjT_P,
  Con_CD_Array_SubjT_V,
  Con_CS_Array_SubjT_P,
  Con_CS_Array_SubjT_V,
  Con_CS_Object_SubjT_V,
  CS_Object,
} from '../compound-schema-types'

/* Construct BASE schema subject type PARSED */

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

/* Construct BASE schema subject type VALIDATED */

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

/* Construct compound array short schema subject type PARSED */

it('Con_CS_Array_SubjT_P<T>: check BaseSchema subject type construction', () => {
  check<string[]>(unknownX as Con_CS_Array_SubjT_P<['string']>)
  // @ts-expect-error 'number[]' is not assignable to parameter of type 'string[]'
  check<string[]>(unknownX as Con_CS_Array_SubjT_P<['number']>)
})

it('Con_CS_Array_SubjT_P<T>: should ignore "undefined" in optional BaseSchema', () => {
  check<string[]>(unknownX as Con_CS_Array_SubjT_P<['string?']>)
  check<number[]>(unknownX as Con_CS_Array_SubjT_P<['number?']>)
  // @ts-expect-error 'number[]' is not assignable to parameter of type 'string[]'
  check<string[]>(unknownX as Con_CS_Array_SubjT_P<['number?']>)
})

it('Con_CS_Array_SubjT_P<T>: default value of BD_Schema is not matter in the context of parsed array', () => {
  check<string[]>(
    unknownX as Con_CS_Array_SubjT_P<
      [{ type: 'string'; optional: true; default: 'x' }]
    >
  )
  check<string[]>(
    // @ts-expect-error 'number[]' is not assignable to parameter of type 'string[]'
    unknownX as Con_CS_Array_SubjT_P<
      [{ type: 'number'; optional: true; default: 0 }]
    >
  )
})

/* Construct compound array short schema subject type VALIDATED */

it('Con_CS_Array_SubjT_V<T>: check BaseSchema subject type construction', () => {
  check<string[]>(unknownX as Con_CS_Array_SubjT_V<['string']>)
  // @ts-expect-error 'number[]' is not assignable to parameter of type 'string[]'
  check<string[]>(unknownX as Con_CS_Array_SubjT_V<['number']>)
})

it('Con_CS_Array_SubjT_V<T>: check nested BD_Array', () => {
  check<string[][]>(
    unknownX as Con_CS_Array_SubjT_V<[{ type: 'array'; of: 'string' }]>
  )

  check<string[][]>(
    // @ts-expect-error type 'number[][]' is not assignable to parameter of type 'string[
    unknownX as Con_CS_Array_SubjT_V<[{ type: 'array'; of: 'number' }]>
  )
})

it('Con_CS_Array_SubjT_V<T>: should NOT ignore "undefined" in optional BaseSchema', () => {
  check<Array<string | undefined>>(
    unknownX as Con_CS_Array_SubjT_V<['string?']>
  )
  check<Array<string | undefined>>(
    // @ts-expect-error '(number | undefined)[]' is not '(string | undefined)[]'
    unknownX as Con_CS_Array_SubjT_V<['number?']>
  )

  // @ts-expect-error '(string | undefined)[]' is not 'string[]'
  check<string[]>(unknownX as Con_CS_Array_SubjT_V<['string?']>)
})

it('Con_CS_Array_SubjT_V<T>: should ignore default value in optional BD_Schema', () => {
  check<Array<string | undefined>>(
    unknownX as Con_CS_Array_SubjT_V<
      [{ type: 'string'; optional: true; default: 'x' }]
    >
  )
  check<string[]>(
    // @ts-expect-error `'(string | undefined)[]' is not 'string[]'
    unknownX as Con_CS_Array_SubjT_V<
      [{ type: 'string'; optional: true; default: 'x' }]
    >
  )
})

/* Construct compound array detailed schema subject type PARSED */

it('Con_CD_Array_SubjT_P<T>: check BaseSchema subject type construction', () => {
  check<string[]>(
    unknownX as Con_CD_Array_SubjT_P<{ type: 'array'; of: 'string' }>
  )
  check<number[]>(
    unknownX as Con_CD_Array_SubjT_P<{ type: 'array'; of: 'number' }>
  )
  check<string[]>(
    // @ts-expect-error 'number[]' is not assignable to parameter of type 'string[]'
    unknownX as Con_CD_Array_SubjT_P<{ type: 'array'; of: 'number' }>
  )
})

it('Con_CD_Array_SubjT_P<T>: should ignore "undefined" in optional BaseSchema', () => {
  check<string[]>(
    unknownX as Con_CD_Array_SubjT_P<{ type: 'array'; of: 'string?' }>
  )
  check<number[]>(
    unknownX as Con_CD_Array_SubjT_P<{ type: 'array'; of: 'number?' }>
  )
  check<string[]>(
    // @ts-expect-error 'number[]' is not assignable to parameter of type 'string[]'
    unknownX as Con_CD_Array_SubjT_P<{ type: 'array'; of: 'number?' }>
  )
})

it('Con_CD_Array_SubjT_P<T>: default value of BD_Schema is not matter in the context of parsed array', () => {
  check<Array<string>>(
    unknownX as Con_CD_Array_SubjT_P<{
      type: 'array'
      of: { type: 'string'; optional: true; default: 'x' }
    }>
  )
  check<string[]>(
    unknownX as Con_CD_Array_SubjT_P<{
      type: 'array'
      of: { type: 'string'; optional: true; default: 'x' }
    }>
  )
})

it('Con_CD_Array_SubjT_P<T>: CD_Array can be optional by itself', () => {
  check<string[] | undefined>(
    unknownX as Con_CD_Array_SubjT_P<{
      type: 'array'
      of: 'string'
      optional: true
    }>
  )
  check<string[]>(
    // @ts-expect-error 'string[] | undefined' is not assignable to parameter of type 'string[]'
    unknownX as Con_CD_Array_SubjT_P<{
      type: 'array'
      of: 'string'
      optional: true
    }>
  )
})

/* Construct compound ARRAY detailed schema subject type VALIDATED */

it('Con_CD_Array_SubjT_V<T>: check BaseSchema subject type construction', () => {
  check<string[]>(
    unknownX as Con_CD_Array_SubjT_V<{ type: 'array'; of: 'string' }>
  )
  check<number[]>(
    unknownX as Con_CD_Array_SubjT_V<{ type: 'array'; of: 'number' }>
  )
  check<string[]>(
    // @ts-expect-error 'number[]' is not assignable to parameter of type 'string[]'
    unknownX as Con_CD_Array_SubjT_V<{ type: 'array'; of: 'number' }>
  )
})

it('Con_CD_Array_SubjT_V<T>: should NOT ignore "undefined" in optional BaseSchema', () => {
  check<Array<string | undefined>>(
    unknownX as Con_CD_Array_SubjT_V<{ type: 'array'; of: 'string?' }>
  )
  check<Array<number | undefined>>(
    unknownX as Con_CD_Array_SubjT_V<{ type: 'array'; of: 'number?' }>
  )
  check<string[]>(
    // @ts-expect-error '(number | undefined)[]' is not assignable to parameter of type 'string[]'
    unknownX as Con_CD_Array_SubjT_V<{ type: 'array'; of: 'number?' }>
  )
})

it('Con_CD_Array_SubjT_V<T>: CD_Array can be optional by itself', () => {
  check<string[] | undefined>(
    unknownX as Con_CD_Array_SubjT_V<{
      type: 'array'
      of: 'string'
      optional: true
    }>
  )
  check<string[]>(
    // @ts-expect-error 'string[] | undefined' is not assignable to parameter of type 'string[]'
    unknownX as Con_CD_Array_SubjT_V<{
      type: 'array'
      of: 'string'
      optional: true
    }>
  )
})

it('Con_CD_Array_SubjT_V<T>: should ignore default value in optional BD_Schema', () => {
  check<Array<string | undefined>>(
    unknownX as Con_CD_Array_SubjT_V<{
      type: 'array'
      of: { type: 'string'; optional: true; default: 'x' }
    }>
  )
  check<string[]>(
    // @ts-expect-error '(string | undefined)[]' is not assignable to parameter of type 'string[]'
    unknownX as Con_CD_Array_SubjT_V<{
      type: 'array'
      of: { type: 'string'; optional: true; default: 'x' }
    }>
  )
})

/* Construct compound OBJECT short schema subject type VALIDATED */

it('Con_CS_Object_SubjT_V<T>: check BaseSchema subject type construction', () => {
  check<{ x: string }>(unknownX as Con_CS_Object_SubjT_V<{ x: 'string' }>)
  // @ts-expect-error 'number' is not assignable to type 'string'
  check<{ x: string }>(unknownX as Con_CS_Object_SubjT_V<{ x: 'number' }>)
})

it('Con_CS_Object_SubjT_V<T>: check CS_Array/CD_Array subject type construction', () => {
  check<{ x: string[] }>(unknownX as Con_CS_Object_SubjT_V<{ x: ['string'] }>)
  // @ts-expect-error type 'number[]' is not assignable to type 'string[]'
  check<{ x: string[] }>(unknownX as Con_CS_Object_SubjT_V<{ x: ['number'] }>)
})

it('Con_CS_Object_SubjT_V<T>: should allow recursion', () => {
  check<{ x: { x: string } }>(
    unknownX as Con_CS_Object_SubjT_V<{
      x: {
        x: 'string'
      }
    }>
  )

  check<{ x: { x: string } }>(
    // @ts-expect-error type 'number' is not assignable to type 'string'
    unknownX as Con_CS_Object_SubjT_V<{
      x: {
        x: 'number'
      }
    }>
  )
})

it('Con_CS_Object_SubjT_V<T>: check BaseSchema subject type construction', () => {
  const schema = {
    x: ['string'],
    y: 'string',
    z: {
      x: 'number',
      y: {
        type: 'array',
        of: 'string',
      },
    },
  } as const satisfies CS_Object

  check<{ x: string[]; y: string; z: { x: number; y: string[] } }>(
    unknownX as Con_CS_Object_SubjT_V<typeof schema>
  )

  check<{ x: string[]; y: string; z: { x: string; y: string[] } }>(
    // @ts-expect-error The types of 'z.x' are incompatible between these types
    unknownX as Con_CS_Object_SubjT_V<typeof schema>
  )
})

/* Recursive definitions */

it('Con_CD_Array_SubjT_V<T>: CD_Array recursive definition should allow 2 layers of depth', () => {
  check<Array<Array<string>>>(
    unknownX as Con_CD_Array_SubjT_V<{
      type: 'array'
      of: {
        type: 'array'
        of: 'string'
      }
    }>
  )

  check<Array<Array<string>>>(
    // @ts-expect-error 'number[]' is not assignable to type 'string[]'
    unknownX as Con_CD_Array_SubjT_V<{
      type: 'array'
      of: {
        type: 'array'
        of: 'number'
      }
    }>
  )
})

it('Con_CD_Array_SubjT_V<T>: mixed CD_Array/CS_Array/CS_Object schemas', () => {
  check<Array<Array<string>>>(
    unknownX as Con_CD_Array_SubjT_V<{
      type: 'array'
      of: ['string']
    }>
  )

  check<Array<Array<number>>>(
    // @ts-expect-error Type 'string[][]' is not assignable to type 'number[][]'
    unknownX as Con_CD_Array_SubjT_V<{
      type: 'array'
      of: ['string']
    }>
  )

  check<Array<Array<{ x: string; y: number }>>>(
    unknownX as Con_CD_Array_SubjT_V<{
      type: 'array'
      of: [{ x: 'string'; y: 'number' }]
    }>
  )

  // FIXME: should be an error here
  check<Array<Array<{ x: number; y: number }>>>(
    unknownX as Con_CD_Array_SubjT_V<{
      type: 'array'
      of: [{ x: 'string'; y: 'number' }]
    }>
  )
})
