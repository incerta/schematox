import { check, unknownX } from '../test-utils'

import type { PrimitiveSchema } from '../../types/primitives'
import type { Schema } from '../../types/compounds'

import type {
  Con_PrimitiveSchema_TypeOnly_SubjT,
  Con_PrimitiveSchema_SubjT,
  Con_ArraySchema_SubjT,
  Con_ObjectSchema_SubjT,
  Con_UnionSchema_SubjT,
  Con_Schema_SubjT,
} from '../../types/constructors'

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

describe('Construct BaseSchema subject type', () => {
  it('Con_PrimitiveSchema_SubjT<T>: check base detailed schema required/optional cases', () => {
    check<string>(unknownX as Con_PrimitiveSchema_SubjT<{ type: 'string' }>)
    check<string>(
      // @ts-expect-error 'number' is not assignable to 'string'
      unknownX as Con_PrimitiveSchema_SubjT<{ type: 'number' }>
    )

    check<string | undefined>(
      unknownX as Con_PrimitiveSchema_SubjT<{
        type: 'string'
        optional: true
      }>
    )
    check<string>(
      // @ts-expect-error 'string | undefined' is not assignable to 'string'
      unknownX as Con_PrimitiveSchema_SubjT<{
        type: 'string'
        optional: true
      }>
    )
  })

  it('Con_PrimitiveSchema_SubjT<T>: should ignore nestend schema default property', () => {
    check<string | undefined>(
      unknownX as Con_PrimitiveSchema_SubjT<{
        type: 'string'
        optional: true
        default: 'x'
      }>
    )
    check<string>(
      // @ts-expect-error 'string | undefined' is not assignable to parameter of type 'string'
      unknownX as Con_PrimitiveSchema_SubjT<{
        type: 'string'
        optional: true
        default: 'x'
      }>
    )
    check<string | undefined>(
      // @ts-expect-error 'number | undefined' is not assignable to parameter of type 'string | undefined'
      unknownX as Con_PrimitiveSchema_SubjT<{
        type: 'number'
        optional: true
        default: 0
      }>
    )
  })
})

describe('Construct ArraySchema subject type', () => {
  it('Con_ArraySchema_SubjT<T>: check BaseSchema subject type construction', () => {
    check<string[]>(
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: { type: 'string' }
      }>
    )
    check<string[]>(
      // @ts-expect-error 'number[]' is not assignable to parameter of type 'string[]'
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: { type: 'number' }
      }>
    )

    check<Array<string | undefined>>(
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: { type: 'string'; optional: true }
      }>
    )
    check<Array<string | undefined>>(
      // @ts-expect-error 'number | undefined' is not assignable to type 'string | undefined'
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: { type: 'number'; optional: true }
      }>
    )
    check<Array<string>>(
      // @ts-expect-error 'string | undefined' is not assignable to type 'string'
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: { type: 'string'; optional: true; default: 'x' }
      }>
    )
  })

  it('Con_ArraySchema_SubjT<T>: check nested ArraySchema subject type construction', () => {
    check<string[][]>(
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: { type: 'array'; of: { type: 'string' } }
      }>
    )
    check<string[][]>(
      // @ts-expect-error 'number[][]' is not assignable to parameter of type 'string[][]'
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: { type: 'array'; of: { type: 'number' } }
      }>
    )
  })

  it('Con_ArraySchema_SubjT<T>: check nested ObjectSchema subject type construction', () => {
    check<Array<{ x: string }>>(
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: { type: 'object'; of: { x: { type: 'string' } } }
      }>
    )
    check<Array<{ x: string }>>(
      // @ts-expect-error 'number' is not assignable to type 'string'
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: { type: 'object'; of: { x: { type: 'number' } } }
      }>
    )
  })

  it('Con_ArraySchema_SubjT<T>: nested ObjectSchema nested BaseSchema should ignore default property', () => {
    check<Array<{ x: string | undefined }>>(
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: {
          type: 'object'
          of: { x: { type: 'string'; optional: true; default: 'x' } }
        }
      }>
    )
    check<Array<{ x: string | undefined }>>(
      // @ts-expect-error 'number | undefined' is not assignable to type 'string | undefined'
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: {
          type: 'object'
          of: { x: { type: 'number'; optional: true; default: 0 } }
        }
      }>
    )

    check<Array<{ x: string }>>(
      // @ts-expect-error 'string | undefined' is not assignable to type 'string'
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: {
          type: 'object'
          of: { x: { type: 'string'; optional: true; default: 'x' } }
        }
      }>
    )
    check<Array<{ x: string }>>(
      // @ts-expect-error 'number | undefined' is not assignable to type 'string'
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: {
          type: 'object'
          of: { x: { type: 'number'; optional: true; default: 0 } }
        }
      }>
    )
  })

  it('Con_ArraySchema_SubjT<T>: should ignore nested schema default property', () => {
    check<Array<string | undefined>>(
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: { type: 'string'; optional: true; default: 'x' }
      }>
    )
    check<string[]>(
      // @ts-expect-error '(string | undefined)[]' is not assignable to parameter of type 'string[]'
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: { type: 'string'; optional: true; default: 'x' }
      }>
    )
  })

  it('Con_ArraySchema_SubjT<T>: check ArraySchema can be optional by itself', () => {
    check<Array<string> | undefined>(
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: { type: 'string' }
        optional: true
      }>
    )
    check<Array<string> | undefined>(
      // @ts-expect-error 'number[] | undefined' is not 'string[] | undefined'
      unknownX as Con_ArraySchema_SubjT<{
        type: 'array'
        of: { type: 'number' }
        optional: true
      }>
    )
  })

  it('Con_ArraySchema_SubjT<T>: nested UnionSchema', () => {
    type Subject = Con_ArraySchema_SubjT<{
      type: 'array'
      of: { type: 'union'; of: Array<{ type: 'string' } | { type: 'number' }> }
    }>

    check<Array<string | number>>(unknownX as Subject)
    // @ts-expect-error '(string | number)[]' is not 'string[]'
    check<Array<string>>(unknownX as Subject)
  })
})

describe('Construct UnionSchema subject type', () => {
  it('Con_UnionSchema_SubjT<T>: base schema mix', () => {
    type Subject = Con_UnionSchema_SubjT<{
      type: 'union'
      of: Array<{ type: 'string' } | { type: 'number' } | { type: 'boolean' }>
    }>

    check<string | number | boolean>(unknownX as Subject)
    // @ts-expect-error 'string | number | boolean' is not 'string | number'
    check<string | number>(unknownX as Subject)
  })

  it('Con_UnionSchema_SubjT<T>: literals', () => {
    type Subject = Con_UnionSchema_SubjT<{
      type: 'union'
      of: Array<{ type: 'literal'; of: 'x' } | { type: 'literal'; of: 0 }>
    }>

    check<'x' | 0>(unknownX as Subject)
    // @ts-expect-error '0 | "x"' is not assignable to parameter of type '"x"'
    check<'x'>(unknownX as Subject)
  })

  it('Con_UnionSchema_SubjT<T>: literals', () => {
    type Subject = Con_UnionSchema_SubjT<{
      type: 'union'
      of: Array<{ type: 'literal'; of: 'x' } | { type: 'literal'; of: 0 }>
    }>

    check<'x' | 0>(unknownX as Subject)
    // @ts-expect-error '0 | "x"' is not assignable to parameter of type '"x"'
    check<'x'>(unknownX as Subject)
  })

  it('Con_UnionSchema_SubjT<T>: objects', () => {
    type Subject = Con_UnionSchema_SubjT<{
      type: 'union'
      of: Array<
        | { type: 'object'; of: { x: { type: 'string' } } }
        | { type: 'object'; of: { y: { type: 'number' } } }
        | { type: 'object'; of: { z: { type: 'boolean' } } }
      >
    }>

    check<{ x: string } | { y: number } | { z: boolean }>(unknownX as Subject)
    // @ts-expect-error '{ x: string; } | { y: number; } | { z: boolean; }' is not '{ x: string; } | { z: boolean; }'
    check<{ x: string } | { z: boolean }>(unknownX as Subject)
  })

  it('Con_UnionSchema_SubjT<T>: objects', () => {
    type Subject = Con_UnionSchema_SubjT<{
      type: 'union'
      of: Array<
        | { type: 'object'; of: { x: { type: 'string' } } }
        | { type: 'object'; of: { y: { type: 'number' } } }
        | { type: 'object'; of: { z: { type: 'boolean' } } }
      >
    }>

    check<{ x: string } | { y: number } | { z: boolean }>(unknownX as Subject)
    // @ts-expect-error '{ x: string; } | { y: number; } | { z: boolean; }' is not '{ x: string; } | { z: boolean; }'
    check<{ x: string } | { z: boolean }>(unknownX as Subject)
  })

  it('Con_UnionSchema_SubjT<T>: objects', () => {
    type Subject = Con_UnionSchema_SubjT<{
      type: 'union'
      of: Array<
        | { type: 'string'; optional: true }
        | { type: 'number' }
        | { type: 'boolean' }
        | { type: 'literal'; of: 'z' }
        | { type: 'literal'; of: 2 }
        | { type: 'object'; of: { x: { type: 'string' } } }
        | { type: 'array'; of: { type: 'number' } }
      >
    }>

    check<string | number | boolean | undefined | { x: string } | number[]>(
      unknownX as Subject
    )
    check<string | number | boolean | { x: string } | number[]>(
      // @ts-expect-error 'string | number | boolean | { x: string; } | number[] | undefined' is not 'string | number | boolean | number[] | { x: string; }'
      unknownX as Subject
    )
  })

  it('Con_UnionSchema_SubjT<T>: optional by itself', () => {
    type Subject = Con_UnionSchema_SubjT<{
      type: 'union'
      of: Array<{ type: 'string' }>
      optional: true
    }>

    check<string | undefined>(unknownX as Subject)
    // @ts-expect-error 'string | undefined' is not 'string'
    check<string>(unknownX as Subject)
  })
})

describe('Construct ObjectSchema subject type', () => {
  it('Con_ObjectSchema_SubjT<T>: check BaseSchema subject type construction', () => {
    check<{ x: string; y: number }>(
      unknownX as Con_ObjectSchema_SubjT<{
        type: 'object'
        of: { x: { type: 'string' }; y: { type: 'number' } }
      }>
    )
    check<{ x: string; y: number }>(
      // @ts-expect-error 'number' is not assignable to type 'string'
      unknownX as Con_ObjectSchema_SubjT<{
        type: 'object'
        of: { x: { type: 'number' }; y: { type: 'number' } }
      }>
    )

    check<{ x: string; y: number }>(
      unknownX as Con_ObjectSchema_SubjT<{
        type: 'object'
        of: { x: { type: 'string' }; y: { type: 'number' } }
      }>
    )
    check<{ x: string; y: number }>(
      // @ts-expect-error 'number' is not assignable to type 'string'
      unknownX as Con_ObjectSchema_SubjT<{
        type: 'object'
        of: { x: { type: 'number' }; y: { type: 'number' } }
      }>
    )

    check<{ x: string; y: number | undefined }>(
      unknownX as Con_ObjectSchema_SubjT<{
        type: 'object'
        of: { x: { type: 'string' }; y: { type: 'number'; optional: true } }
      }>
    )
    check<{ x: string; y: number | undefined }>(
      // @ts-expect-error 'string' is not assignable to type 'number'
      unknownX as Con_ObjectSchema_SubjT<{
        type: 'object'
        of: { x: { type: 'string' }; y: { type: 'string'; optional: true } }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT<T>: check nested ArraySchema subject type construction', () => {
    check<{ x: string[]; y: number[] }>(
      unknownX as Con_ObjectSchema_SubjT<{
        type: 'object'
        of: {
          x: { type: 'array'; of: { type: 'string' } }
          y: { type: 'array'; of: { type: 'number' } }
        }
      }>
    )

    check<{ x: string[]; y: number[] }>(
      // @ts-expect-error 'string[]' is not assignable to type 'number[]'
      unknownX as Con_ObjectSchema_SubjT<{
        type: 'object'
        of: {
          x: { type: 'array'; of: { type: 'string' } }
          y: { type: 'array'; of: { type: 'string' } }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT<T>: nested ArraySchema should NOT ignore its nested schema optionality', () => {
    check<{ x: Array<string | undefined>; y: Array<number | undefined> }>(
      unknownX as Con_ObjectSchema_SubjT<{
        type: 'object'
        of: {
          x: { type: 'array'; of: { type: 'string'; optional: true } }
          y: { type: 'array'; of: { type: 'number'; optional: true } }
        }
      }>
    )
    check<{ x: Array<string | undefined>; y: Array<number | undefined> }>(
      // @ts-expect-error '(number | undefined)[]' is not assignable to type '(string | undefined)[]'
      unknownX as Con_ObjectSchema_SubjT<{
        type: 'object'
        of: {
          x: { type: 'array'; of: { type: 'number'; optional: true } }
          y: { type: 'array'; of: { type: 'number'; optional: true } }
        }
      }>
    )
  })

  it('Con_ObjectSchema_SubjT<T>: check nested ObjectSchema subject type construction', () => {
    check<{ x: { a: string; b: number }; y: { c: boolean; d: string } }>(
      unknownX as Con_ObjectSchema_SubjT<{
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
      unknownX as Con_ObjectSchema_SubjT<{
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

  it('Con_ObjectSchema_SubjT<T>: nested ObjectSchema nested BaseSchema should ignore default property', () => {
    check<{ x: { y: string | undefined } }>(
      unknownX as Con_ObjectSchema_SubjT<{
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
      unknownX as Con_ObjectSchema_SubjT<{
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
      unknownX as Con_ObjectSchema_SubjT<{
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
      unknownX as Con_ObjectSchema_SubjT<{
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

  it('Con_ObjectSchema_SubjT<T>: check ObjectSchema can be optional by itself', () => {
    check<{ x: string } | undefined>(
      unknownX as Con_ObjectSchema_SubjT<{
        type: 'object'
        of: { x: { type: 'string' } }
        optional: true
      }>
    )
    check<{ x: string }>(
      // @ts-expect-error '{ x: string; } | undefined' is not assignable to parameter of type '{ x: string; }'
      unknownX as Con_ObjectSchema_SubjT<{
        type: 'object'
        of: { x: { type: 'string' } }
        optional: true
      }>
    )
  })

  it('Con_ObjectSchema_SubjT<T>: nested branded types', () => {
    const schema = {
      type: 'object',
      of: {
        x: { type: 'string', brand: ['key', 'value'] },
      },
    } as const satisfies Schema

    check<{ x: string & { __key: 'value' } }>(
      unknownX as Con_ObjectSchema_SubjT<typeof schema>
    )
    check<{ x: number & { __key: 'value' } }>(
      // @ts-expect-error '{ __key: "value"; } & string' is not assignable to type 'number'
      unknownX as Con_ObjectSchema_SubjT<typeof schema>
    )
  })

  it('Con_ObjectSchema_SubjT<T>: nested UnionSchema', () => {
    type Subject = Con_ObjectSchema_SubjT<{
      type: 'object'
      of: {
        x: { type: 'union'; of: Array<{ type: 'string' } | { type: 'number' }> }
      }
    }>

    check<{ x: string | number }>(unknownX as Subject)
    // @ts-expect-error '{ x: string | number; }' is not '{ x: string; }'
    check<{ x: string }>(unknownX as Subject)
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

    type ParsedSubjectType = Con_Schema_SubjT<typeof array7DepthLevelSchema>

    check<Array<Array<Array<Array<Array<Array<Array<string>>>>>>>>(
      unknownX as ParsedSubjectType
    )
    check<Array<Array<Array<Array<Array<Array<Array<number>>>>>>>>(
      // @ts-expect-error 'string[]' is not assignable to type 'number[]'
      unknownX as ParsedSubjectType
    )

    type ValidatedSubjectType = Con_Schema_SubjT<typeof array7DepthLevelSchema>

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

    type ParsedSubjectType = Con_Schema_SubjT<typeof object7DepthLevelSchema>

    check<{ x: { x: { x: { x: { x: { x: { x: string } } } } } } }>(
      unknownX as ParsedSubjectType
    )
    check<{ x: { x: { x: { x: { x: { x: { x: number } } } } } } }>(
      // @ts-expect-error 'string' is not assignable to type 'number'
      unknownX as ParsedSubjectType
    )

    type ValidatedSubjectType = Con_Schema_SubjT<typeof object7DepthLevelSchema>

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

        /* Base detailed required/optional/default/branded string schema (StringSchema) */

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
                  },
                },
              },
            },
          },
        },
      },
    } as const satisfies Schema

    type ValidatedSubjectType = Con_Schema_SubjT<typeof schema>
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
          }
          optional?: {
            requiredString?: string[]
            requiredStringBranded?: Array<string & { __K: 'V' }>
            optionalString?: (string | undefined)[]
            optionalStringBranded?: Array<(string & { __K: 'V' }) | undefined>
          }
        }
      }
    }

    check<ExpectedValidatedSubjectType>(unknownX as ValidatedSubjectType)
    check<ExpectedValidatedSubjectType & { x: number }>(
      // @ts-expect-error but required in type '{ x: number; }'
      unknownX as ValidatedSubjectType
    )

    type ParsedSubjectType = Con_Schema_SubjT<typeof schema>
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
          }
          optional?: {
            requiredString: string
            requiredStringBranded: string & { __K: 'V' }
            optionalString?: string
            optionalStringBranded?: string & { __K: 'V' }
          }
        }

        arraySchema: {
          required: {
            requiredString: string[]
            requiredStringBranded: Array<string & { __K: 'V' }>
            optionalString: (undefined | string)[]
            optionalStringBranded: Array<(string & { __K: 'V' }) | undefined>
          }
          optional?: {
            requiredString?: string[]
            requiredStringBranded?: Array<string & { __K: 'V' }>
            optionalString?: (string | undefined)[]
            optionalStringBranded?: Array<(string & { __K: 'V' }) | undefined>
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

  it('Con_Schema_SubjT<T>: check UnionSchema', () => {
    type Subject = Con_Schema_SubjT<{
      type: 'union'
      of: Array<{ type: 'string' } | { type: 'number' }>
    }>

    check<string | number>(unknownX as Subject)
    // @ts-expect-error 'string | number' is not 'string'
    check<string>(unknownX as Subject)
  })
})
