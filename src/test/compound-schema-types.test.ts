import { check, unknownX } from './test-utils'
import {
  Con_BaseSchema_SubjT_P,
  Con_BaseSchema_SubjT_V,
  Con_ArraySchema_SubjT_P,
  Con_ArraySchema_SubjT_V,
  Con_ObjectSchema_SubjT_P,
  Con_ObjectSchema_SubjT_V,
} from '../compound-schema-types'

describe('Construct BaseSchema subject type PARSED', () => {
  it('Con_BaseSchema_SubjT_P<T>: check base short schema required/optional cases', () => {
    check<string>(unknownX as Con_BaseSchema_SubjT_P<'string'>)
    check<string>(
      // @ts-expect-error 'number' is not assignable to 'string'
      unknownX as Con_BaseSchema_SubjT_P<'number'>
    )

    check<string | undefined>(unknownX as Con_BaseSchema_SubjT_P<'string?'>)
    // @ts-expect-error 'number | undefined' is not assignable to parameter of type 'string | undefined'
    check<string | undefined>(unknownX as Con_BaseSchema_SubjT_P<'number?'>)
  })

  it('Con_BaseSchema_SubjT_P<T>: check base detailed schema required/optional cases', () => {
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
  })

  it('Con_BaseSchema_SubjT_P<T>: should ignore schema optional property if default is set', () => {
    check<string>(
      unknownX as Con_BaseSchema_SubjT_P<{
        type: 'string'
        optional: true
        default: 'x'
      }>
    )

    check<string>(
      // @ts-expect-error 'number' is not assignable to parameter of type 'string'
      unknownX as Con_BaseSchema_SubjT_P<{
        type: 'number'
        optional: true
        default: 0
      }>
    )
  })
})

describe('Construct BaseSchema subject type VALIDATED', () => {
  it('Con_BaseSchema_SubjT_V<T>: check base short schema required/optional cases', () => {
    check<string>(unknownX as Con_BaseSchema_SubjT_P<'string'>)
    check<string>(
      // @ts-expect-error 'number' is not assignable to 'string'
      unknownX as Con_BaseSchema_SubjT_P<'number'>
    )

    check<string | undefined>(unknownX as Con_BaseSchema_SubjT_P<'string?'>)
    // @ts-expect-error 'number | undefined' is not assignable to parameter of type 'string | undefined'
    check<string | undefined>(unknownX as Con_BaseSchema_SubjT_P<'number?'>)
  })

  it('Con_BaseSchema_SubjT_V<T>: check base detailed schema required/optional cases', () => {
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
  })

  it('Con_BaseSchema_SubjT_V<T>: should ignore nestend schema default property', () => {
    check<string | undefined>(
      unknownX as Con_BaseSchema_SubjT_V<{
        type: 'string'
        optional: true
        default: 'x'
      }>
    )
    check<string>(
      // @ts-expect-error 'string | undefined' is not assignable to parameter of type 'string'
      unknownX as Con_BaseSchema_SubjT_V<{
        type: 'string'
        optional: true
        default: 'x'
      }>
    )
    check<string | undefined>(
      // @ts-expect-error 'number | undefined' is not assignable to parameter of type 'string | undefined'
      unknownX as Con_BaseSchema_SubjT_V<{
        type: 'number'
        optional: true
        default: 0
      }>
    )
  })
})

describe('Construct ArraySchema subject type PARSED', () => {
  it('Con_ArraySchema_SubjT_P<T>: check BaseSchema subject type construction', () => {
    check<string[]>(
      unknownX as Con_ArraySchema_SubjT_P<{ type: 'array'; of: 'string' }>
    )
    check<string[]>(
      // @ts-expect-error 'number[]' is not assignable to parameter of type 'string[]'
      unknownX as Con_ArraySchema_SubjT_P<{ type: 'array'; of: 'number' }>
    )

    check<string[]>(
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'string' }
      }>
    )
    check<string[]>(
      // @ts-expect-error 'number[]' is not assignable to parameter of type 'string[]'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'number' }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_P<T>: check nested ArraySchema subject type construction', () => {
    check<string[][]>(
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'array'; of: 'string' }
      }>
    )
    check<string[][]>(
      // @ts-expect-error 'number[][]' is not assignable to parameter of type 'string[][]'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'array'; of: 'number' }
      }>
    )

    check<string[][]>(
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'array'; of: { type: 'string' } }
      }>
    )
    check<string[][]>(
      // @ts-expect-error 'number[][]' is not assignable to parameter of type 'string[][]'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'array'; of: { type: 'number' } }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_P<T>: check nested ObjectSchema subject type construction', () => {
    check<Array<{ x: string }>>(
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'object'; of: { x: 'string' } }
      }>
    )
    check<Array<{ x: string }>>(
      // @ts-expect-error 'number' is not assignable to type 'string'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'object'; of: { x: 'number' } }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_P<T>: nested ObjectSchema nested BaseSchema should ignore optional property if default is set', () => {
    check<Array<{ x: string | undefined }>>(
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'object'; of: { x: { type: 'string'; optional: true } } }
      }>
    )
    check<Array<{ x: string | undefined }>>(
      // @ts-expect-error 'number | undefined' is not assignable to type 'string | undefined'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'object'; of: { x: { type: 'number'; optional: true } } }
      }>
    )

    check<Array<{ x: string }>>(
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: {
          type: 'object'
          of: { x: { type: 'string'; optional: true; default: 'x' } }
        }
      }>
    )
    check<Array<{ x: string }>>(
      // @ts-expect-error 'number' is not assignable to type 'string'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: {
          type: 'object'
          of: { x: { type: 'number'; optional: true; default: 0 } }
        }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_P<T>: should ignore nested BaseSchema optionality', () => {
    check<string[]>(
      unknownX as Con_ArraySchema_SubjT_P<{ type: 'array'; of: 'string?' }>
    )
    check<string[]>(
      // @ts-expect-error 'number[]' is not assignable to parameter of type 'string[]'
      unknownX as Con_ArraySchema_SubjT_P<{ type: 'array'; of: 'number?' }>
    )
    check<string[]>(
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'string'; optional: true }
      }>
    )
    check<string[]>(
      // @ts-expect-error 'number[]' is not assignable to parameter of type 'string[]'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'number'; optional: true }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_P<T>: should ignore nested ArraySchema optionality', () => {
    check<string[][]>(
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'array'; of: 'string'; optional: true }
      }>
    )
    check<string[][]>(
      // @ts-expect-error 'number[][]' is not assignable to parameter of type 'string[][]'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'array'; of: 'number'; optional: true }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_P<T>: should ignore nested ObjectSchema optionality', () => {
    check<Array<{ x: string }>>(
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'object'; of: { x: 'string' }; optional: true }
      }>
    )
    check<Array<{ x: string }>>(
      // @ts-expect-error 'number' is not assignable to type 'string'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'object'; of: { x: 'number' }; optional: true }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_P<T>: check ArraySchema can be optional by itself', () => {
    check<string[] | undefined>(
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: 'string'
        optional: true
      }>
    )
    check<string[]>(
      // @ts-expect-error 'string[] | undefined' is not assignable to parameter of type 'string[]'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: 'string'
        optional: true
      }>
    )
  })
})

describe('Construct ArraySchema subject type VALIDATED', () => {
  it('Con_ArraySchema_SubjT_V<T>: check BaseSchema subject type construction', () => {
    check<string[]>(
      unknownX as Con_ArraySchema_SubjT_V<{ type: 'array'; of: 'string' }>
    )
    check<string[]>(
      // @ts-expect-error 'number[]' is not assignable to parameter of type 'string[]'
      unknownX as Con_ArraySchema_SubjT_V<{ type: 'array'; of: 'number' }>
    )

    check<string[]>(
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'string' }
      }>
    )
    check<string[]>(
      // @ts-expect-error 'number[]' is not assignable to parameter of type 'string[]'
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'number' }
      }>
    )

    check<Array<string | undefined>>(
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'string'; optional: true }
      }>
    )
    check<Array<string | undefined>>(
      // @ts-expect-error 'number | undefined' is not assignable to type 'string | undefined'
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'number'; optional: true }
      }>
    )
    check<Array<string>>(
      // @ts-expect-error 'string | undefined' is not assignable to type 'string'
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'string'; optional: true; default: 'x' }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_V<T>: check nested ArraySchema subject type construction', () => {
    check<string[][]>(
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'array'; of: 'string' }
      }>
    )
    check<string[][]>(
      // @ts-expect-error 'number[][]' is not assignable to parameter of type 'string[][]'
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'array'; of: 'number' }
      }>
    )

    check<string[][]>(
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'array'; of: { type: 'string' } }
      }>
    )
    check<string[][]>(
      // @ts-expect-error 'number[][]' is not assignable to parameter of type 'string[][]'
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'array'; of: { type: 'number' } }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_V<T>: check nested ObjectSchema subject type construction', () => {
    check<Array<{ x: string }>>(
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'object'; of: { x: 'string' } }
      }>
    )
    check<Array<{ x: string }>>(
      // @ts-expect-error 'number' is not assignable to type 'string'
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'object'; of: { x: 'number' } }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_V<T>: nested ObjectSchema nested BaseSchema should ignore default property', () => {
    check<Array<{ x: string | undefined }>>(
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: {
          type: 'object'
          of: { x: { type: 'string'; optional: true; default: 'x' } }
        }
      }>
    )
    check<Array<{ x: string | undefined }>>(
      // @ts-expect-error 'number | undefined' is not assignable to type 'string | undefined'
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: {
          type: 'object'
          of: { x: { type: 'number'; optional: true; default: 0 } }
        }
      }>
    )

    check<Array<{ x: string }>>(
      // @ts-expect-error 'string | undefined' is not assignable to type 'string'
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: {
          type: 'object'
          of: { x: { type: 'string'; optional: true; default: 'x' } }
        }
      }>
    )
    check<Array<{ x: string }>>(
      // @ts-expect-error 'number | undefined' is not assignable to type 'string'
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: {
          type: 'object'
          of: { x: { type: 'number'; optional: true; default: 0 } }
        }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_V<T>: should ignore nested schema default property', () => {
    check<Array<string | undefined>>(
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'string'; optional: true; default: 'x' }
      }>
    )
    check<string[]>(
      // @ts-expect-error '(string | undefined)[]' is not assignable to parameter of type 'string[]'
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'string'; optional: true; default: 'x' }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_V<T>: check ArraySchema can be optional by itself', () => {
    check<Array<string> | undefined>(
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: 'string'
        optional: true
      }>
    )
    check<Array<string> | undefined>(
      // @ts-expect-error 'number[] | undefined' is not 'string[] | undefined'
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: 'number'
        optional: true
      }>
    )
  })
})

describe('Construct ObjectSchema subject type PARSED', () => {
  it('Con_ObjectSchema_SubjT_P<T>: check BaseSchema subject type construction', () => {
    check<{ x: string; y: number }>(
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: { x: 'string'; y: 'number' }
      }>
    )
    check<{ x: string; y: number }>(
      // @ts-expect-error 'number' is not assignable to type 'string'
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: { x: 'number'; y: 'number' }
      }>
    )

    check<{ x: string; y: number }>(
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: { x: { type: 'string' }; y: { type: 'number' } }
      }>
    )
    check<{ x: string; y: number }>(
      // @ts-expect-error 'number' is not assignable to type 'string'
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: { x: { type: 'number' }; y: { type: 'number' } }
      }>
    )

    check<{ x: string; y: number | undefined }>(
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: { x: { type: 'string' }; y: { type: 'number'; optional: true } }
      }>
    )
    check<{ x: string; y: number | undefined }>(
      // @ts-expect-error 'string' is not assignable to type 'number'
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: { x: { type: 'string' }; y: { type: 'string'; optional: true } }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_P<T>: nested BaseSchema should ignore optional proprety if default is set', () => {
    check<{ x: string; y: number }>(
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: { type: 'string' }
          y: { type: 'number'; optional: true; default: 0 }
        }
      }>
    )
    check<{ x: string; y: number }>(
      // @ts-expect-error 'string' is not assignable to type 'number'
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: { type: 'string' }
          y: { type: 'string'; optional: true; default: 'x' }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_P<T>: check nested ArraySchema subject type construction', () => {
    check<{ x: string[]; y: number[] }>(
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: { type: 'array'; of: 'string' }
          y: { type: 'array'; of: 'number' }
        }
      }>
    )

    check<{ x: string[]; y: number[] }>(
      // @ts-expect-error 'string' is not assignable to type 'number'
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: { type: 'array'; of: 'string' }
          y: { type: 'array'; of: 'string' }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_P<T>: nested ArraySchema should ignore its nested schema optionality', () => {
    check<{ x: string[]; y: number[] }>(
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: { type: 'array'; of: 'string?' }
          y: { type: 'array'; of: 'number?' }
        }
      }>
    )

    check<{ x: string[]; y: number[] }>(
      // @ts-expect-error 'string' is not assignable to type 'number'
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: { type: 'array'; of: 'string?' }
          y: { type: 'array'; of: 'string?' }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_P<T>: check nested ObjectSchema subject type construction', () => {
    check<{ x: { a: string; b: number }; y: { c: boolean; d: Buffer } }>(
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: { type: 'object'; of: { a: 'string'; b: 'number' } }
          y: { type: 'object'; of: { c: 'boolean'; d: 'buffer' } }
        }
      }>
    )

    check<{ x: { a: string; b: number }; y: { c: boolean; d: Buffer } }>(
      // @ts-expect-error 'y.d' are incompatible; 'string' is not  'Buffer'
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: { type: 'object'; of: { a: 'string'; b: 'number' } }
          y: { type: 'object'; of: { c: 'boolean'; d: 'string' } }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_P<T>: nested ObjectSchema nested BaseSchema should ignore optional property if default is set', () => {
    check<{ x: { y: string | undefined } }>(
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: { type: 'object'; of: { y: { type: 'string'; optional: true } } }
        }
      }>
    )
    check<{ x: { y: string | undefined } }>(
      // @ts-expect-error 'number | undefined' is not assignable to type 'string | undefined'
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: { type: 'object'; of: { y: { type: 'number'; optional: true } } }
        }
      }>
    )

    check<{ x: { y: string } }>(
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: {
            type: 'object'
            of: { y: { type: 'string'; optional: true; default: 'x' } }
          }
        }
      }>
    )
    check<{ x: { y: string } }>(
      // @ts-expect-error 'number' is not assignable to type 'string'
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: {
            type: 'object'
            of: { y: { type: 'number'; optional: true; default: 0 } }
          }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_P<T>: check ObjectSchema can be optional by itself', () => {
    check<{ x: string } | undefined>(
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: { x: 'string' }
        optional: true
      }>
    )
    check<{ x: string }>(
      // @ts-expect-error '{ x: string; } | undefined' is not assignable to parameter of type '{ x: string; }'
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: { x: 'string' }
        optional: true
      }>
    )
  })
})

describe('Construct ObjectSchema subject type VALIDATED', () => {
  it('Con_ObjectSchema_SubjT_V<T>: check BaseSchema subject type construction', () => {
    check<{ x: string; y: number }>(
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: { x: 'string'; y: 'number' }
      }>
    )
    check<{ x: string; y: number }>(
      // @ts-expect-error 'number' is not assignable to type 'string'
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: { x: 'number'; y: 'number' }
      }>
    )

    check<{ x: string; y: number }>(
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: { x: { type: 'string' }; y: { type: 'number' } }
      }>
    )
    check<{ x: string; y: number }>(
      // @ts-expect-error 'number' is not assignable to type 'string'
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: { x: { type: 'number' }; y: { type: 'number' } }
      }>
    )

    check<{ x: string; y: number | undefined }>(
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: { x: { type: 'string' }; y: { type: 'number'; optional: true } }
      }>
    )
    check<{ x: string; y: number | undefined }>(
      // @ts-expect-error 'string' is not assignable to type 'number'
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: { x: { type: 'string' }; y: { type: 'string'; optional: true } }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_V<T>: nested BaseSchema should ignore default property', () => {
    check<{ x: string; y: number | undefined }>(
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: { type: 'string' }
          y: { type: 'number'; optional: true; default: 0 }
        }
      }>
    )
    check<{ x: string; y: number | undefined }>(
      // @ts-expect-error 'string | undefined' is not assignable to type 'number | undefined'
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: { type: 'string' }
          y: { type: 'string'; optional: true; default: 'x' }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_V<T>: check nested ArraySchema subject type construction', () => {
    check<{ x: string[]; y: number[] }>(
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: { type: 'array'; of: 'string' }
          y: { type: 'array'; of: 'number' }
        }
      }>
    )

    check<{ x: string[]; y: number[] }>(
      // @ts-expect-error 'string[]' is not assignable to type 'number[]'
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: { type: 'array'; of: 'string' }
          y: { type: 'array'; of: 'string' }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_V<T>: nested ArraySchema should NOT ignore its nested schema optionality', () => {
    check<{ x: Array<string | undefined>; y: Array<number | undefined> }>(
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: { type: 'array'; of: 'string?' }
          y: { type: 'array'; of: 'number?' }
        }
      }>
    )
    check<{ x: Array<string | undefined>; y: Array<number | undefined> }>(
      // @ts-expect-error '(number | undefined)[]' is not assignable to type '(string | undefined)[]'
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: { type: 'array'; of: 'number?' }
          y: { type: 'array'; of: 'number?' }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_V<T>: check nested ObjectSchema subject type construction', () => {
    check<{ x: { a: string; b: number }; y: { c: boolean; d: Buffer } }>(
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: { type: 'object'; of: { a: 'string'; b: 'number' } }
          y: { type: 'object'; of: { c: 'boolean'; d: 'buffer' } }
        }
      }>
    )

    check<{ x: { a: string; b: number }; y: { c: boolean; d: Buffer } }>(
      // @ts-expect-error 'y.d' are incompatible; 'string' is not  'Buffer'
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: { type: 'object'; of: { a: 'string'; b: 'number' } }
          y: { type: 'object'; of: { c: 'boolean'; d: 'string' } }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_V<T>: nested ObjectSchema nested BaseSchema should ignore default property', () => {
    check<{ x: { y: string | undefined } }>(
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: {
            type: 'object'
            of: { y: { type: 'string'; optional: true; default: 'x' } }
          }
        }
      }>
    )
    check<{ x: { y: string | undefined } }>(
      // @ts-expect-error 'number | undefined' is not assignable to type 'string | undefined'
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: {
            type: 'object'
            of: { y: { type: 'number'; optional: true; default: 0 } }
          }
        }
      }>
    )

    check<{ x: { y: string | undefined } }>(
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: {
            type: 'object'
            of: { y: { type: 'string'; optional: true; default: 'x' } }
          }
        }
      }>
    )
    check<{ x: { y: string | undefined } }>(
      // @ts-expect-error type 'number | undefined' is not assignable to type 'string | undefined'
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: {
            type: 'object'
            of: { y: { type: 'number'; optional: true; default: 0 } }
          }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_V<T>: check ObjectSchema can be optional by itself', () => {
    check<{ x: string } | undefined>(
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: { x: 'string' }
        optional: true
      }>
    )
    check<{ x: string }>(
      // @ts-expect-error '{ x: string; } | undefined' is not assignable to parameter of type '{ x: string; }'
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: { x: 'string' }
        optional: true
      }>
    )
  })
})
