import { check, unknownX } from '../test-utils'

import type { Schema } from '../../types/compounds'

import type {
  Con_PrimitiveSchema_TypeOnly_SubjT,
  Con_PrimitiveSchema_SubjT,
  Con_ArraySchema_SubjT,
  Con_ObjectSchema_SubjT,
  Con_UnionSchema_SubjT,
  Con_Schema_SubjT,
} from '../../types/constructors'

describe('Construct PrimitiveSchema subject type', () => {
  it('Con_PrimitiveSchema_TypeOnly_SubjT<T>: required string/number/boolean/literal', () => {
    const stringS = { type: 'string' } as const satisfies Schema

    type StringSubj = Con_PrimitiveSchema_TypeOnly_SubjT<typeof stringS>

    check<string, StringSubj>()
    // @ts-expect-error always
    check<never, StringSubj>()

    const numberS = { type: 'number' } as const satisfies Schema

    type NumberSubj = Con_PrimitiveSchema_TypeOnly_SubjT<typeof numberS>

    check<number, NumberSubj>()
    // @ts-expect-error always
    check<never, NumberSubj>()

    const booleanS = { type: 'boolean' } as const satisfies Schema

    type BooleanSubj = Con_PrimitiveSchema_TypeOnly_SubjT<typeof booleanS>

    check<boolean, BooleanSubj>()
    // @ts-expect-error always
    check<never, BooleanSubj>()

    const literalStrS = { type: 'literal', of: 'x' } as const satisfies Schema

    type LiteralStrSubj = Con_PrimitiveSchema_TypeOnly_SubjT<typeof literalStrS>

    check<'x', LiteralStrSubj>()
    // @ts-expect-error '"x"' is not assignable to parameter of type '"y"'
    check<'y', LiteralStrSubj>()

    const literalNumS = { type: 'literal', of: 0 } as const satisfies Schema

    type LiteralNumSubj = Con_PrimitiveSchema_TypeOnly_SubjT<typeof literalNumS>

    check<0, LiteralNumSubj>()
    // @ts-expect-error '0' is not assignable to parameter of type '1'
    check<1, LiteralNumSubj>()
  })

  it('Con_PrimitiveSchema_SubjT<T>: required string/number/boolean/literal', () => {
    const stringS = { type: 'string' } as const satisfies Schema

    type StringSubj = Con_PrimitiveSchema_SubjT<typeof stringS>

    check<string, StringSubj>()
    // @ts-expect-error always
    check<never, StringSubj>()

    const numberS = { type: 'number' } as const satisfies Schema

    type NumberSubj = Con_PrimitiveSchema_SubjT<typeof numberS>

    check<number, NumberSubj>()
    // @ts-expect-error always
    check<never, NumberSubj>()

    const booleanS = { type: 'boolean' } as const satisfies Schema

    type BooleanSubj = Con_PrimitiveSchema_SubjT<typeof booleanS>

    check<boolean, BooleanSubj>()
    // @ts-expect-error always
    check<never, BooleanSubj>()

    const literalStrS = { type: 'literal', of: 'x' } as const satisfies Schema

    type LiteralStrSubj = Con_PrimitiveSchema_SubjT<typeof literalStrS>

    check<'x', LiteralStrSubj>()
    // @ts-expect-error '"x"' is not assignable to parameter of type '"y"'
    check<'y', LiteralStrSubj>()

    const literalNumS = { type: 'literal', of: 0 } as const satisfies Schema

    type LiteralNumSubj = Con_PrimitiveSchema_SubjT<typeof literalNumS>

    check<0, LiteralNumSubj>()
    // @ts-expect-error '0' is not assignable to parameter of type '1'
    check<1, LiteralNumSubj>()
  })

  it('Con_PrimitiveSchema_SubjT<T>: optional string/number/boolean/literal', () => {
    const stringS = { type: 'string', optional: true } as const satisfies Schema

    type StringSubj = Con_PrimitiveSchema_SubjT<typeof stringS>

    check<string | undefined, StringSubj>()
    // @ts-expect-error always
    check<never, StringSubj>()

    const numberS = { type: 'number', optional: true } as const satisfies Schema

    type NumberSubj = Con_PrimitiveSchema_SubjT<typeof numberS>

    check<number | undefined, NumberSubj>()
    // @ts-expect-error always
    check<never, NumberSubj>()

    const booleanS = {
      type: 'boolean',
      optional: true,
    } as const satisfies Schema

    type BooleanSubj = Con_PrimitiveSchema_SubjT<typeof booleanS>

    check<boolean | undefined, BooleanSubj>()
    // @ts-expect-error always
    check<never, BooleanSubj>()

    const literalStrS = {
      type: 'literal',
      of: 'x',
      optional: true,
    } as const satisfies Schema

    type LiteralStrSubj = Con_PrimitiveSchema_SubjT<typeof literalStrS>

    check<'x' | undefined, LiteralStrSubj>()
    // @ts-expect-error always
    check<never, LiteralStrSubj>()

    const literalNumS = {
      type: 'literal',
      of: 0,
      optional: true,
    } as const satisfies Schema

    type LiteralNumSubj = Con_PrimitiveSchema_SubjT<typeof literalNumS>

    check<0 | undefined, LiteralNumSubj>()
    // @ts-expect-error always
    check<never, LiteralNumSubj>()
  })

  it('Con_PrimitiveSchema_SubjT<T>: nullable string/number/boolean/literal', () => {
    const stringS = {
      type: 'string',
      nullable: true,
    } as const satisfies Schema

    type StringSubj = Con_PrimitiveSchema_SubjT<typeof stringS>

    check<string | null, StringSubj>()
    // @ts-expect-error always
    check<never, StringSubj>()

    const numberS = {
      type: 'number',
      nullable: true,
    } as const satisfies Schema

    type NumberSubj = Con_PrimitiveSchema_SubjT<typeof numberS>

    check<number | null, NumberSubj>()
    // @ts-expect-error always
    check<never, NumberSubj>()

    const booleanS = {
      type: 'boolean',
      nullable: true,
    } as const satisfies Schema

    type BooleanSubj = Con_PrimitiveSchema_SubjT<typeof booleanS>

    check<boolean | null, BooleanSubj>()
    // @ts-expect-error always
    check<never, BooleanSubj>()

    const literalStrS = {
      type: 'literal',
      of: 'x',
      nullable: true,
    } as const satisfies Schema

    type LiteralStrSubj = Con_PrimitiveSchema_SubjT<typeof literalStrS>

    check<'x' | null, LiteralStrSubj>()
    // @ts-expect-error always
    check<never, LiteralStrSubj>()

    const literalNumS = {
      type: 'literal',
      of: 0,
      nullable: true,
    } as const satisfies Schema

    type LiteralNumSubj = Con_PrimitiveSchema_SubjT<typeof literalNumS>

    check<0 | null, LiteralNumSubj>()
    // @ts-expect-error always
    check<never, LiteralNumSubj>()
  })

  it('Con_PrimitiveSchema_SubjT<T>: branded string/number/boolean/literal', () => {
    const stringS = {
      type: 'string',
      brand: ['x', 'y'],
    } as const satisfies Schema

    type StringSubj = Con_PrimitiveSchema_SubjT<typeof stringS>

    check<string & { __x: 'y' }, StringSubj>()
    // @ts-expect-error always
    check<never, StringSubj>()

    const numberS = {
      type: 'number',
      brand: ['x', 'y'],
    } as const satisfies Schema

    type NumberSubj = Con_PrimitiveSchema_SubjT<typeof numberS>

    check<number & { __x: 'y' }, NumberSubj>()
    // @ts-expect-error always
    check<never, NumberSubj>()

    const booleanS = {
      type: 'boolean',
      brand: ['x', 'y'],
    } as const satisfies Schema

    type BooleanSubj = Con_PrimitiveSchema_SubjT<typeof booleanS>

    check<boolean & { __x: 'y' }, BooleanSubj>()
    // @ts-expect-error always
    check<never, BooleanSubj>()

    const literalStrS = {
      type: 'literal',
      of: 'x',
      brand: ['x', 'y'],
    } as const satisfies Schema

    type LiteralStrSubj = Con_PrimitiveSchema_SubjT<typeof literalStrS>

    check<'x' & { __x: 'y' }, LiteralStrSubj>()
    // @ts-expect-error always
    check<never, LiteralStrSubj>()

    const literalNumS = {
      type: 'literal',
      of: 0,
      brand: ['x', 'y'],
    } as const satisfies Schema

    type LiteralNumSubj = Con_PrimitiveSchema_SubjT<typeof literalNumS>

    check<0 & { __x: 'y' }, LiteralNumSubj>()
    // @ts-expect-error always
    check<never, LiteralNumSubj>()
  })

  it('Con_PrimitiveSchema_SubjT<T>: optional + nullable + branded string/number/boolean/literal', () => {
    const stringS = {
      type: 'string',
      brand: ['x', 'y'],
      optional: true,
      nullable: true,
    } as const satisfies Schema

    type StringSubj = Con_PrimitiveSchema_SubjT<typeof stringS>

    check<(string & { __x: 'y' }) | null | undefined, StringSubj>()
    // @ts-expect-error always
    check<never, StringSubj>()

    const numberS = {
      type: 'number',
      brand: ['x', 'y'],
      optional: true,
      nullable: true,
    } as const satisfies Schema

    type NumberSubj = Con_PrimitiveSchema_SubjT<typeof numberS>

    check<(number & { __x: 'y' }) | null | undefined, NumberSubj>()
    // @ts-expect-error always
    check<never, NumberSubj>()

    const booleanS = {
      type: 'boolean',
      brand: ['x', 'y'],
      optional: true,
      nullable: true,
    } as const satisfies Schema

    type BooleanSubj = Con_PrimitiveSchema_SubjT<typeof booleanS>

    check<(boolean & { __x: 'y' }) | null | undefined, BooleanSubj>()
    // @ts-expect-error always
    check<never, BooleanSubj>()

    const literalStrS = {
      type: 'literal',
      of: 'x',
      brand: ['x', 'y'],
      optional: true,
      nullable: true,
    } as const satisfies Schema

    type LiteralStrSubj = Con_PrimitiveSchema_SubjT<typeof literalStrS>

    check<('x' & { __x: 'y' }) | null | undefined, LiteralStrSubj>()
    // @ts-expect-error always
    check<never, LiteralStrSubj>()

    const literalNumS = {
      type: 'literal',
      of: 0,
      brand: ['x', 'y'],
      optional: true,
      nullable: true,
    } as const satisfies Schema

    type LiteralNumSubj = Con_PrimitiveSchema_SubjT<typeof literalNumS>

    check<(0 & { __x: 'y' }) | null | undefined, LiteralNumSubj>()
    // @ts-expect-error always
    check<never, LiteralNumSubj>()
  })
})

describe('Construct ArraySchema subject type', () => {
  describe('Check different nested schema types', () => {
    it('Con_ArraySchema_SubjT<T>: array of string/number/boolean/literal', () => {
      const stringS = {
        type: 'array',
        of: { type: 'string' },
      } as const satisfies Schema

      type StringArrSubj = Con_ArraySchema_SubjT<typeof stringS>

      check<string[], StringArrSubj>()
      // @ts-expect-error always
      check<never, StringArrSubj>()

      const numberS = {
        type: 'array',
        of: { type: 'number' },
      } as const satisfies Schema

      type NumberArrSubj = Con_ArraySchema_SubjT<typeof numberS>

      check<number[], NumberArrSubj>()
      // @ts-expect-error 'number[]' does not satisfy the constraint 'string[]'
      check<string[], NumberArrSubj>()
      // @ts-expect-error always
      check<never, NumberArrSubj>()

      const booleanS = {
        type: 'array',
        of: { type: 'boolean' },
      } as const satisfies Schema

      type BooleanArrSubj = Con_ArraySchema_SubjT<typeof booleanS>

      check<boolean[], BooleanArrSubj>()
      // @ts-expect-error 'number[]' does not satisfy the constraint 'string[]'
      check<string[], BooleanArrSubj>()
      // @ts-expect-error always
      check<never, BooleanArrSubj>()

      const literalStrS = {
        type: 'array',
        of: { type: 'literal', of: 'x' },
      } as const satisfies Schema

      type LiteralStrArrSubj = Con_ArraySchema_SubjT<typeof literalStrS>

      check<Array<'x'>, LiteralStrArrSubj>()
      // @ts-expect-error always
      check<never, LiteralStrArrSubj>()

      const literalNumS = {
        type: 'array',
        of: { type: 'literal', of: 0 },
      } as const satisfies Schema

      type LiteralNumArrSubj = Con_ArraySchema_SubjT<typeof literalNumS>

      check<Array<0>, LiteralNumArrSubj>()
      // @ts-expect-error always
      check<never, LiteralNumArrSubj>()
    })

    it('Con_ArraySchema_SubjT<T>: array of array/object/union', () => {
      const nestedArrSchema = {
        type: 'array',
        of: { type: 'array', of: { type: 'string' } },
      } as const satisfies Schema

      type NestedArrSubj = Con_ArraySchema_SubjT<typeof nestedArrSchema>

      check<Array<string[]>, NestedArrSubj>()
      // @ts-expect-error always
      check<never, NestedArrSubj>()

      const nestedObjSchema = {
        type: 'array',
        of: { type: 'object', of: { x: { type: 'string' } } },
      } as const satisfies Schema

      type NestedObjSubj = Con_ArraySchema_SubjT<typeof nestedObjSchema>

      check<Array<{ x: string }>, NestedObjSubj>()
      // @ts-expect-error always
      check<never, NestedObjSubj>()

      const nestedUnionSchema = {
        type: 'array',
        of: { type: 'union', of: [{ type: 'string' }, { type: 'number' }] },
      } as const satisfies Schema

      type NestedUnionSubj = Con_ArraySchema_SubjT<typeof nestedUnionSchema>

      check<Array<string | number>, NestedUnionSubj>()
      // @ts-expect-error always
      check<never | never[], NestedUnionSubj>()
    })
  })

  describe('ArraySchema parameters', () => {
    it('Con_ArraySchema_SubjT<T>: required array', () => {
      const schema = {
        type: 'array',
        of: { type: 'string' },
      } as const satisfies Schema

      type Subject = Con_ArraySchema_SubjT<typeof schema>

      check<string[], Subject>()
      // @ts-expect-error always
      check<never, Subject>()
    })

    it('Con_ArraySchema_SubjT<T>: optional array', () => {
      const schema = {
        type: 'array',
        of: { type: 'string' },
        optional: true,
      } as const satisfies Schema

      type Subject = Con_ArraySchema_SubjT<typeof schema>

      check<string[] | undefined, Subject>()
      // @ts-expect-error always
      check<never, Subject>()
    })

    it('Con_ArraySchema_SubjT<T>: nullable array', () => {
      const schema = {
        type: 'array',
        of: { type: 'string' },
        nullable: true,
      } as const satisfies Schema

      type Subject = Con_ArraySchema_SubjT<typeof schema>

      check<string[] | null, Subject>()
      // @ts-expect-error always
      check<never, Subject>()
    })

    it('Con_ArraySchema_SubjT<T>: optional + nullable array', () => {
      const schema = {
        type: 'array',
        of: { type: 'string' },
        optional: true,
        nullable: true,
      } as const satisfies Schema

      type Subject = Con_ArraySchema_SubjT<typeof schema>

      check<string[] | null | undefined, Subject>()
      // @ts-expect-error always
      check<never, Subject>()
    })
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
