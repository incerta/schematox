import { check, unknownX } from '../test-utils'
import type {
  Con_BaseSchema_SubjT_P,
  Con_BaseSchema_SubjT_V,
  Con_ArraySchema_SubjT_P,
  Con_ArraySchema_SubjT_V,
  Con_ObjectSchema_SubjT_P,
  Con_ObjectSchema_SubjT_V,
  Con_Schema_SubjT_P,
  Con_Schema_SubjT_V,
  Schema,
} from '../../types/compound-schema-types'

describe('Construct BaseSchema subject type PARSED', () => {
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

  it('Con_BaseSchema_SubjT_P<T>: check base detailed schema brand', () => {
    const schema = {
      type: 'string',
      brand: ['key', 'value'],
    } as const satisfies Schema

    check<string>(unknownX as Con_BaseSchema_SubjT_P<typeof schema>)
    // @ts-expect-error '{ __key: "value"; } & string' is not 'number'
    check<number>(unknownX as Con_BaseSchema_SubjT_P<typeof schema>)
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
        of: { type: 'object'; of: { x: { type: 'string' } } }
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

  it('Con_ArraySchema_SubjT_P<T>: must not ignore nested BaseSchema optionality', () => {
    check<Array<string | undefined>>(
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'string'; optional: true }
      }>
    )
    check<Array<string>>(
      // @ts-expect-error '(string | undefined)[]' is not assignable to parameter of type 'string[]'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'string'; optional: true }
      }>
    )
    check<Array<number | undefined>>(
      // @ts-expect-error '(string | undefined)[]' is not '(number | undefined)[]'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'string?'; optional: true }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_P<T>: must not ignore nested ArraySchema optionality', () => {
    check<Array<string[] | undefined>>(
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'array'; of: { type: 'string' }; optional: true }
      }>
    )
    check<Array<string[]>>(
      // @ts-expect-error '(string[] | undefined)[]' is not assignable to parameter of type 'string[][]'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'array'; of: 'string'; optional: true }
      }>
    )
    check<Array<number[] | undefined>>(
      // @ts-expect-error '(string[] | undefined)[]' is not '(number[] | undefined)[]'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'array'; of: 'string'; optional: true }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_P<T>: must not ignore ObjectSchema optionality', () => {
    check<Array<{ x: string } | undefined>>(
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'object'; of: { x: { type: 'string' } }; optional: true }
      }>
    )
    check<Array<{ x: string }>>(
      // @ts-expect-error '({ x: string; } | undefined)[]' is not '{ x: string; }[]'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'object'; of: { x: { type: 'string' } }; optional: true }
      }>
    )
    check<Array<{ x: number } | undefined>>(
      // @ts-expect-error '({ x: string; } | undefined)[]' is not '({ x: number; } | undefined)[]'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'object'; of: { x: { type: 'string' } }; optional: true }
      }>
    )
  })

  it('Con_ArraySchema_SubjT_P<T>: check ArraySchema can be optional by itself', () => {
    check<string[] | undefined>(
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'string' }
        optional: true
      }>
    )
    check<string[]>(
      // @ts-expect-error 'string[] | undefined' is not assignable to parameter of type 'string[]'
      unknownX as Con_ArraySchema_SubjT_P<{
        type: 'array'
        of: { type: 'string' }
        optional: true
      }>
    )
  })
})

describe('Construct ArraySchema subject type VALIDATED', () => {
  it('Con_ArraySchema_SubjT_V<T>: check BaseSchema subject type construction', () => {
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
        of: { type: 'object'; of: { x: { type: 'string' } } }
      }>
    )
    check<Array<{ x: string }>>(
      // @ts-expect-error 'number' is not assignable to type 'string'
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'object'; of: { x: { type: 'number' } } }
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
        of: { type: 'string' }
        optional: true
      }>
    )
    check<Array<string> | undefined>(
      // @ts-expect-error 'number[] | undefined' is not 'string[] | undefined'
      unknownX as Con_ArraySchema_SubjT_V<{
        type: 'array'
        of: { type: 'number' }
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
          x: { type: 'array'; of: { type: 'string' } }
          y: { type: 'array'; of: { type: 'number' } }
        }
      }>
    )

    check<{ x: string[]; y: number[] }>(
      // @ts-expect-error 'string' is not assignable to type 'number'
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: { type: 'array'; of: { type: 'string' } }
          y: { type: 'array'; of: { type: 'string' } }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_P<T>: nested ArraySchema must not ignore its nested schema optionality', () => {
    check<{ x: Array<string | undefined>; y: Array<number | undefined> }>(
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: { type: 'array'; of: { type: 'string'; optional: true } }
          y: { type: 'array'; of: { type: 'number'; optional: true } }
        }
      }>
    )
    check<{ x: Array<string | undefined>; y: Array<number | undefined> }>(
      // @ts-expect-error 'string | undefined' is not assignable to type 'number | undefined'
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: { type: 'array'; of: { type: 'string'; optional: true } }
          y: { type: 'array'; of: { type: 'string'; optional: true } }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_P<T>: check nested ObjectSchema subject type construction', () => {
    check<{ x: { a: string; b: number }; y: { c: boolean; d: string } }>(
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: {
            type: 'object'
            of: { a: { type: 'string' }; b: { type: 'number' } }
          }
          y: {
            type: 'object'
            of: { c: { type: 'boolean' }; d: { type: 'string' } }
          }
        }
      }>
    )

    check<{ x: { a: string; b: number }; y: { c: boolean; d: number } }>(
      // @ts-expect-error 'y.d' are incompatible; 'string' is not  'number'
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: {
          x: {
            type: 'object'
            of: { a: { type: 'string' }; b: { type: 'number' } }
          }
          y: {
            type: 'object'
            of: { c: { type: 'boolean' }; d: { type: 'string' } }
          }
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
        of: { x: { type: 'string' } }
        optional: true
      }>
    )
    check<{ x: string }>(
      // @ts-expect-error '{ x: string; } | undefined' is not assignable to parameter of type '{ x: string; }'
      unknownX as Con_ObjectSchema_SubjT_P<{
        type: 'object'
        of: { x: { type: 'string' } }
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
          x: { type: 'array'; of: { type: 'string' } }
          y: { type: 'array'; of: { type: 'number' } }
        }
      }>
    )

    check<{ x: string[]; y: number[] }>(
      // @ts-expect-error 'string[]' is not assignable to type 'number[]'
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: { type: 'array'; of: { type: 'string' } }
          y: { type: 'array'; of: { type: 'string' } }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_V<T>: nested ArraySchema should NOT ignore its nested schema optionality', () => {
    check<{ x: Array<string | undefined>; y: Array<number | undefined> }>(
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: { type: 'array'; of: { type: 'string'; optional: true } }
          y: { type: 'array'; of: { type: 'number'; optional: true } }
        }
      }>
    )
    check<{ x: Array<string | undefined>; y: Array<number | undefined> }>(
      // @ts-expect-error '(number | undefined)[]' is not assignable to type '(string | undefined)[]'
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: { type: 'array'; of: { type: 'number'; optional: true } }
          y: { type: 'array'; of: { type: 'number'; optional: true } }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_V<T>: check nested ObjectSchema subject type construction', () => {
    check<{ x: { a: string; b: number }; y: { c: boolean; d: string } }>(
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: {
            type: 'object'
            of: { a: { type: 'string' }; b: { type: 'number' } }
          }
          y: {
            type: 'object'
            of: { c: { type: 'boolean' }; d: { type: 'string' } }
          }
        }
      }>
    )

    check<{ x: { a: string; b: number }; y: { c: boolean; d: number } }>(
      // @ts-expect-error 'y.d' are incompatible; 'string' is not 'number'
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: {
          x: {
            type: 'object'
            of: { a: { type: 'string' }; b: { type: 'number' } }
          }
          y: {
            type: 'object'
            of: { c: { type: 'boolean' }; d: { type: 'string' } }
          }
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
        of: { x: { type: 'string' } }
        optional: true
      }>
    )
    check<{ x: string }>(
      // @ts-expect-error '{ x: string; } | undefined' is not assignable to parameter of type '{ x: string; }'
      unknownX as Con_ObjectSchema_SubjT_V<{
        type: 'object'
        of: { x: { type: 'string' } }
        optional: true
      }>
    )
  })

  it('Con_ObjectSchema_SubjT_V<T>: nested branded types', () => {
    const schema = {
      type: 'object',
      of: {
        x: { type: 'string', brand: ['key', 'value'] },
      },
    } as const satisfies Schema

    check<{ x: string & { __key: 'value' } }>(
      unknownX as Con_ObjectSchema_SubjT_V<typeof schema>
    )
    check<{ x: number & { __key: 'value' } }>(
      // @ts-expect-error '{ __key: "value"; } & string' is not assignable to type 'number'
      unknownX as Con_ObjectSchema_SubjT_V<typeof schema>
    )
  })
})

describe('Construct Schema subject type PARSED/VALIDATED differences', () => {
  it('BaseSchema default property subject type diff depending on the SubjT_P/Subj_V context', () => {
    const stringSchemaWithDefaultProperty = {
      type: 'string',
      optional: true,
      default: 'x',
    } as const satisfies Schema

    check<string>(
      unknownX as Con_Schema_SubjT_P<typeof stringSchemaWithDefaultProperty>
    )
    check<string | undefined>(
      unknownX as Con_Schema_SubjT_V<typeof stringSchemaWithDefaultProperty>
    )
    check<string>(
      // @ts-expect-error 'string | undefined' is not assignable to parameter of type 'string'
      unknownX as Con_Schema_SubjT_V<typeof stringSchemaWithDefaultProperty>
    )
  })

  it('ArraySchema default property subject type diff depending on the SubjT_P/Subj_V context', () => {
    const arraySchemaWithDefaultNestedSchema = {
      type: 'array',
      of: { type: 'string', optional: true, default: 'x' },
    } as const satisfies Schema

    check<string[]>(
      unknownX as Con_Schema_SubjT_P<typeof arraySchemaWithDefaultNestedSchema>
    )
    check<(string | undefined)[]>(
      unknownX as Con_Schema_SubjT_V<typeof arraySchemaWithDefaultNestedSchema>
    )
    check<string[]>(
      // @ts-expect-error '(string | undefined)[]' is not assignable to parameter of type 'string[]'
      unknownX as Con_Schema_SubjT_V<typeof arraySchemaWithDefaultNestedSchema>
    )
  })
})

describe('Construct Schema subject type in the context of deeply nested schemas', () => {
  it('ArraySchema should allow 7 depth levels', () => {
    const array7DepthLevelSchema = {
      // Depth 1
      type: 'array',
      of: {
        // Depth 2
        type: 'array',
        of: {
          // Depth 3
          type: 'array',
          of: {
            // Depth 4
            type: 'array',
            of: {
              // Depth 5
              type: 'array',
              of: {
                // Depth 6
                type: 'array',
                of: {
                  // Depth 7
                  type: 'array',
                  of: { type: 'string' },
                },
              },
            },
          },
        },
      },
    } as const satisfies Schema

    type ParsedSubjectType = Con_Schema_SubjT_P<typeof array7DepthLevelSchema>

    check<Array<Array<Array<Array<Array<Array<Array<string>>>>>>>>(
      unknownX as ParsedSubjectType
    )
    check<Array<Array<Array<Array<Array<Array<Array<number>>>>>>>>(
      // @ts-expect-error 'string[]' is not assignable to type 'number[]'
      unknownX as ParsedSubjectType
    )

    type ValidatedSubjectType = Con_Schema_SubjT_V<
      typeof array7DepthLevelSchema
    >

    check<Array<Array<Array<Array<Array<Array<Array<string>>>>>>>>(
      unknownX as ValidatedSubjectType
    )
    check<Array<Array<Array<Array<Array<Array<Array<number>>>>>>>>(
      // @ts-expect-error 'string[]' is not assignable to type 'number[]'
      unknownX as ValidatedSubjectType
    )
  })

  it('ObjectSchema should allow 7 depth levels', () => {
    const object7DepthLevelSchema = {
      // Depth 1
      type: 'object',
      of: {
        x: {
          // Depth 2
          type: 'object',
          of: {
            x: {
              // Depth 3
              type: 'object',
              of: {
                x: {
                  // Depth 4
                  type: 'object',
                  of: {
                    x: {
                      // Depth 5
                      type: 'object',
                      of: {
                        x: {
                          // Depth 6
                          type: 'object',
                          of: {
                            x: {
                              // Depth 7
                              type: 'object',
                              of: {
                                x: { type: 'string' },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    } as const satisfies Schema

    type ParsedSubjectType = Con_Schema_SubjT_P<typeof object7DepthLevelSchema>

    check<{ x: { x: { x: { x: { x: { x: { x: string } } } } } } }>(
      unknownX as ParsedSubjectType
    )
    check<{ x: { x: { x: { x: { x: { x: { x: number } } } } } } }>(
      // @ts-expect-error 'string' is not assignable to type 'number'
      unknownX as ParsedSubjectType
    )

    type ValidatedSubjectType = Con_Schema_SubjT_V<
      typeof object7DepthLevelSchema
    >

    check<{ x: { x: { x: { x: { x: { x: { x: string } } } } } } }>(
      unknownX as ValidatedSubjectType
    )
    check<{ x: { x: { x: { x: { x: { x: { x: number } } } } } } }>(
      // @ts-expect-error 'string' is not assignable to type 'number'
      unknownX as ValidatedSubjectType
    )
  })

  it('Multilevel Schema with all possible string variations', () => {
    const schema = {
      type: 'object',
      of: {
        /* Base short required/optional string schema (BS_String_Req/BS_String_Opt) */

        baseSchemaShortString: {
          type: 'object',
          of: {
            objectSchema: {
              type: 'object',
              of: {
                required: {
                  type: 'object',
                  of: {
                    requiredString: { type: 'string' },
                    optionalString: { type: 'string', optional: true },
                  },
                },
                optional: {
                  type: 'object',
                  optional: true,
                  of: {
                    requiredString: { type: 'string' },
                    optionalString: { type: 'string', optional: true },
                  },
                },
              },
            },

            arraySchema: {
              type: 'object',
              of: {
                required: {
                  type: 'object',
                  of: {
                    requiredString: { type: 'array', of: { type: 'string' } },
                    optionalString: {
                      type: 'array',
                      of: { type: 'string', optional: true },
                    },
                  },
                },

                optional: {
                  type: 'object',
                  of: {
                    requiredString: {
                      type: 'array',
                      optional: true,
                      of: { type: 'string' },
                    },
                    optionalString: {
                      type: 'array',
                      optional: true,
                      of: { type: 'string', optional: true },
                    },
                  },
                },
              },
            },
          },
        },

        /* Base detailed required/optional/default/branded string schema (BD_String) */

        baseSchemaDetailedString: {
          type: 'object',
          of: {
            objectSchema: {
              type: 'object',
              of: {
                required: {
                  type: 'object',
                  of: {
                    requiredString: { type: 'string' },
                    requiredStringBranded: {
                      type: 'string',
                      brand: ['K', 'V'],
                    },
                    optionalString: { type: 'string', optional: true },
                    optionalStringBranded: {
                      type: 'string',
                      optional: true,
                      brand: ['K', 'V'],
                    },
                    optionalStringDefault: {
                      type: 'string',
                      optional: true,
                      default: 'x',
                    },
                    optionalStringDefaultBranded: {
                      type: 'string',
                      optional: true,
                      default: 'x',
                      brand: ['K', 'V'],
                    },
                  },
                },
                optional: {
                  type: 'object',
                  optional: true,
                  of: {
                    requiredString: { type: 'string' },
                    requiredStringBranded: {
                      type: 'string',
                      brand: ['K', 'V'],
                    },
                    optionalString: { type: 'string', optional: true },
                    optionalStringBranded: {
                      type: 'string',
                      optional: true,
                      brand: ['K', 'V'],
                    },
                    optionalStringDefault: {
                      type: 'string',
                      optional: true,
                      default: 'x',
                    },
                    optionalStringDefaultBranded: {
                      type: 'string',
                      optional: true,
                      default: 'x',
                      brand: ['K', 'V'],
                    },
                  },
                },
              },
            },

            arraySchema: {
              type: 'object',
              of: {
                required: {
                  type: 'object',
                  of: {
                    requiredString: { type: 'array', of: { type: 'string' } },
                    requiredStringBranded: {
                      type: 'array',
                      of: {
                        type: 'string',
                        brand: ['K', 'V'],
                      },
                    },
                    optionalString: {
                      type: 'array',
                      of: { type: 'string', optional: true },
                    },
                    optionalStringBranded: {
                      type: 'array',
                      of: {
                        type: 'string',
                        optional: true,
                        brand: ['K', 'V'],
                      },
                    },
                    optionalStringDefault: {
                      type: 'array',
                      of: {
                        type: 'string',
                        optional: true,
                        default: 'x',
                      },
                    },
                    optionalStringDefaultBranded: {
                      type: 'array',
                      of: {
                        type: 'string',
                        optional: true,
                        default: 'x',
                        brand: ['K', 'V'],
                      },
                    },
                  },
                },
                optional: {
                  type: 'object',
                  optional: true,
                  of: {
                    requiredString: {
                      type: 'array',
                      optional: true,
                      of: { type: 'string' },
                    },
                    requiredStringBranded: {
                      type: 'array',
                      optional: true,
                      of: {
                        type: 'string',
                        brand: ['K', 'V'],
                      },
                    },
                    optionalString: {
                      type: 'array',
                      optional: true,
                      of: { type: 'string', optional: true },
                    },
                    optionalStringBranded: {
                      type: 'array',
                      optional: true,
                      of: {
                        type: 'string',
                        optional: true,
                        brand: ['K', 'V'],
                      },
                    },
                    optionalStringDefault: {
                      type: 'array',
                      optional: true,
                      of: {
                        type: 'string',
                        optional: true,
                        default: 'x',
                      },
                    },
                    optionalStringDefaultBranded: {
                      type: 'array',
                      optional: true,
                      of: {
                        type: 'string',
                        optional: true,
                        default: 'x',
                        brand: ['K', 'V'],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    } as const satisfies Schema

    type ValidatedSubjectType = Con_Schema_SubjT_V<typeof schema>
    type ExpectedValidatedSubjectType = {
      baseSchemaShortString: {
        objectSchema: {
          required: {
            requiredString: string
            optionalString?: string
          }
          optional?: {
            requiredString: string
            optionalString?: string
          }
        }
        arraySchema: {
          required: {
            requiredString: string[]
            optionalString: (string | undefined)[]
          }
          optional: {
            requiredString?: string[]
            optionalString?: (string | undefined)[]
          }
        }
      }

      baseSchemaDetailedString: {
        objectSchema: {
          required: {
            requiredString: string
            requiredStringBranded: string & { __K: 'V' }
            optionalString?: string
            optionalStringBranded?: string & { __K: 'V' }
            optionalStringDefault?: string
            optionalStringDefaultBranded?: string & {
              __K: 'V'
            }
          }
          optional?: {
            requiredString: string
            requiredStringBranded: string & { __K: 'V' }
            optionalString?: string
            optionalStringBranded?: string & { __K: 'V' }
            optionalStringDefault?: string
            optionalStringDefaultBranded?: string & {
              __K: 'V'
            }
          }
        }

        arraySchema: {
          required: {
            requiredString: string[]
            requiredStringBranded: Array<string & { __K: 'V' }>
            optionalString: (string | undefined)[]
            optionalStringBranded: Array<(string & { __K: 'V' }) | undefined>
            optionalStringDefault: (string | undefined)[]
            optionalStringDefaultBranded: Array<
              (string & { __K: 'V' }) | undefined
            >
          }
          optional?: {
            requiredString?: string[]
            requiredStringBranded?: Array<string & { __K: 'V' }>
            optionalString?: (string | undefined)[]
            optionalStringBranded?: Array<(string & { __K: 'V' }) | undefined>
            optionalStringDefault?: (string | undefined)[]
            optionalStringDefaultBranded?: Array<
              (string & { __K: 'V' }) | undefined
            >
          }
        }
      }
    }

    check<ExpectedValidatedSubjectType>(unknownX as ValidatedSubjectType)
    check<ExpectedValidatedSubjectType & { x: number }>(
      // @ts-expect-error but required in type '{ x: number; }'
      unknownX as ValidatedSubjectType
    )

    type ParsedSubjectType = Con_Schema_SubjT_P<typeof schema>
    type ExpectedParsedSubjectType = {
      baseSchemaShortString: {
        objectSchema: {
          required: {
            requiredString: string
            optionalString?: string
          }
          optional?: {
            requiredString: string
            optionalString?: string
          }
        }
        arraySchema: {
          required: {
            requiredString: string[]
            optionalString: (string | undefined)[]
          }
          optional: {
            requiredString?: string[]
            optionalString?: (string | undefined)[]
          }
        }
      }

      baseSchemaDetailedString: {
        objectSchema: {
          required: {
            requiredString: string
            requiredStringBranded: string & { __K: 'V' }
            optionalString?: string
            optionalStringBranded?: string & { __K: 'V' }
            optionalStringDefault: string
            optionalStringDefaultBranded: string & {
              __K: 'V'
            }
          }
          optional?: {
            requiredString: string
            requiredStringBranded: string & { __K: 'V' }
            optionalString?: string
            optionalStringBranded?: string & { __K: 'V' }
            optionalStringDefault: string
            optionalStringDefaultBranded: string & {
              __K: 'V'
            }
          }
        }

        arraySchema: {
          required: {
            requiredString: string[]
            requiredStringBranded: Array<string & { __K: 'V' }>
            optionalString: (undefined | string)[]
            optionalStringBranded: Array<(string & { __K: 'V' }) | undefined>
            optionalStringDefault: string[]
            optionalStringDefaultBranded: Array<string & { __K: 'V' }>
          }
          optional?: {
            requiredString?: string[]
            requiredStringBranded?: Array<string & { __K: 'V' }>
            optionalString?: (string | undefined)[]
            optionalStringBranded?: Array<(string & { __K: 'V' }) | undefined>
            optionalStringDefault?: string[]
            optionalStringDefaultBranded?: Array<string & { __K: 'V' }>
          }
        }
      }
    }

    check<ExpectedParsedSubjectType>(unknownX as ParsedSubjectType)
    check<ExpectedParsedSubjectType & { x: number }>(
      // @ts-expect-error but required in type '{ x: number; }'
      unknownX as ParsedSubjectType
    )
  })
})
