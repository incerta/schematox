import { check, unknownX } from './test-utils'

import type {
  BaseSchema,
  InferArraySchemaType,
  InferObjectArraySchemaType,
  InferObjectSchemaType,
  InferOptionality,
  InferPrimitiveSchemaType,
  InferSchemaType,
} from '../types'

it('BaseSchema<T>: should error if specified both: "default" & "optional"', () => {
  check(
    unknownX as {
      // @ts-expect-error should be incompatible with "optional" prop
      default: unknownX
      optional: true
    } as BaseSchema
  )
})

it('InferOptionality<T, U>: required', () => {
  check<'x'>(
    unknownX as InferOptionality<{ type: 'string'; optional: false }, 'x'>
  )
  check<'x'>(
    unknownX as InferOptionality<{ type: 'string'; optional: false }, 'x'>
  )
})

it('InferOptionality<T, U>: optional', () => {
  check<'x' | undefined>(
    unknownX as InferOptionality<{ type: 'string'; optional: true }, 'x'>
  )
  check<'x'>(
    // @ts-expect-error `string | undefined` is not assignable to `'x'`
    unknownX as InferOptionality<{ type: 'string'; optional: true }, 'x'>
  )
})

it('InferPrimitiveSchemaType<T>: RequiredPrimitiveSchemaShorthand all cases', () => {
  check<string>(unknownX as InferPrimitiveSchemaType<'string'>)
  // @ts-expect-error `string` is not assignable to `number`
  check<number>(unknownX as InferPrimitiveSchemaType<'string'>)

  check<number>(unknownX as InferPrimitiveSchemaType<'number'>)
  // @ts-expect-error `number` is not assignable to `boolean`
  check<boolean>(unknownX as InferPrimitiveSchemaType<'number'>)

  check<boolean>(unknownX as InferPrimitiveSchemaType<'boolean'>)
  // @ts-expect-error `boolean` is not assignable to `Buffer`
  check<Buffer>(unknownX as InferPrimitiveSchemaType<'boolean'>)

  check<Buffer>(unknownX as InferPrimitiveSchemaType<'buffer'>)
  // @ts-expect-error `Buffer` is not assignable to `string`
  check<string>(unknownX as InferPrimitiveSchemaType<'buffer'>)

  check<string | undefined>(unknownX as InferPrimitiveSchemaType<'string?'>)
  check<string>(unknownX as NonNullable<InferPrimitiveSchemaType<'string?'>>)
  // @ts-expect-error `string | undefined` is not assignable to `string`
  check<string>(unknownX as InferPrimitiveSchemaType<'string?'>)

  check<number | undefined>(unknownX as InferPrimitiveSchemaType<'number?'>)
  check<number>(unknownX as NonNullable<InferPrimitiveSchemaType<'number?'>>)
  // @ts-expect-error `number | undefined` is not assignable to `number`
  check<number>(unknownX as InferPrimitiveSchemaType<'number?'>)

  check<Buffer | undefined>(unknownX as InferPrimitiveSchemaType<'buffer?'>)
  check<Buffer>(unknownX as NonNullable<InferPrimitiveSchemaType<'buffer?'>>)
  // @ts-expect-error `Buffer | undefined` is not assignable to `Buffer`
  check<Buffer>(unknownX as InferPrimitiveSchemaType<'buffer?'>)
})

it('InferPrimitiveSchemaType<T>: StringSchema required', () => {
  check<string>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'string'
    }>
  )
})

it('InferPrimitiveSchemaType<T>: StringSchema optional', () => {
  check<string | undefined>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'string'
      optional: true
    }>
  )
  check<string>(
    // @ts-expect-error `string | undefined` is not assignable to `string`
    unknownX as InferPrimitiveSchemaType<{
      type: 'string'
      optional: true
    }>
  )
})

it('InferPrimitiveSchemaType<T>: StringSchema default', () => {
  check<string>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'string'
      default: 'defaultValue'
    }>
  )

  check<'defaultValue'>(
    // @ts-expect-error `string` is not assignable to `'defaultValue'`
    unknownX as InferPrimitiveSchemaType<{
      type: 'string'
      default: 'defaultValue'
    }>
  )
})

it('InferPrimitiveSchemaType<T>: NumberSchema required', () => {
  check<number>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'number'
    }>
  )
})

it('InferPrimitiveSchemaType<T>: NumberSchema optional', () => {
  check<number | undefined>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'number'
      optional: true
    }>
  )

  check<number>(
    // @ts-expect-error `number | undefined` is not assignable to `number`
    unknownX as InferPrimitiveSchemaType<{
      type: 'number'
      optional: true
    }>
  )
})

it('InferPrimitiveSchemaType<T>: NumberSchema default', () => {
  check<number>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'number'
      default: 0
    }>
  )

  check<0>(
    // @ts-expect-error `number` is not assignable to `0`
    unknownX as InferPrimitiveSchemaType<{
      type: 'number'
      optional: 0
    }>
  )
})

it('InferPrimitiveSchemaType<T>: BooleanSchema required', () => {
  check<boolean>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'boolean'
    }>
  )
})

it('InferPrimitiveSchemaType<T>: BooleanSchema optional', () => {
  check<boolean | undefined>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'boolean'
      optional: true
    }>
  )

  check<boolean>(
    // @ts-expect-error `boolean | undefined` is not assignable to `boolean`
    unknownX as InferPrimitiveSchemaType<{
      type: 'boolean'
      optional: true
    }>
  )
})

it('InferPrimitiveSchemaType<T>: BooleanSchema default', () => {
  check<boolean>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'boolean'
      default: true
    }>
  )

  check<0>(
    // @ts-expect-error `number` is not assignable to `0`
    unknownX as InferPrimitiveSchemaType<{
      type: 'boolean'
      default: 0
    }>
  )
})

it('InferPrimitiveSchemaType<T>: StringLiteralSchema required', () => {
  check<'x'>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'stringLiteral'
      of: 'x'
    }>
  )

  check<'x'>(
    // @ts-expect-error `'y'` is not assignable to `'x'`
    unknownX as InferPrimitiveSchemaType<{
      type: 'stringLiteral'
      of: 'y'
    }>
  )

  check<1>(
    // @ts-expect-error should not satisfy `string` constraint
    unknownX as InferPrimitiveSchemaType<{
      type: 'stringLiteral'
      of: 1
    }>
  )
})

it('InferPrimitiveSchemaType<T>: StringLiteralSchema optional', () => {
  check<'x' | undefined>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'stringLiteral'
      of: 'x'
      optional: true
    }>
  )

  check<'x'>(
    // @ts-expect-error `'x' | undefined` is not assignable to `'x'`
    unknownX as InferPrimitiveSchemaType<{
      type: 'stringLiteral'
      of: 'x'
      optional: true
    }>
  )
})

it('InferPrimitiveSchemaType<T>: StringLiteralSchema default caveat', () => {
  check<'x' | 'y'>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'stringLiteral'
      of: 'x'
      default: 'y'
    }>
  )

  check<'x'>(
    // @ts-expect-error `'x' | 'y'` is not assignable to `'x'`
    unknownX as InferPrimitiveSchemaType<{
      type: 'stringLiteral'
      of: 'x'
      default: 'y'
    }>
  )
})

it('InferPrimitiveSchemaType<T>: NumberLiteralSchema required', () => {
  check<1>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'numberLiteral'
      of: 1
    }>
  )

  check<1>(
    // @ts-expect-error `2` is not assignable to `1`
    unknownX as InferPrimitiveSchemaType<{
      type: 'numberLiteral'
      of: 2
    }>
  )

  check<'x'>(
    // @ts-expect-error should not satisfy `number` constraint
    unknownX as InferPrimitiveSchemaType<{
      type: 'numberLiteral'
      of: 'x'
    }>
  )
})

it('InferPrimitiveSchemaType<T>: NumberLiteralSchema optional', () => {
  check<1 | undefined>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'numberLiteral'
      of: 1
      optional: true
    }>
  )

  check<1>(
    // @ts-expect-error `1 | undefined` is not assignable to `1`
    unknownX as InferPrimitiveSchemaType<{
      type: 'numberLiteral'
      of: 1
      optional: true
    }>
  )
})

it('InferPrimitiveSchemaType<T>: NumberLiteralSchema default caveat', () => {
  check<1 | 2>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'numberLiteral'
      of: 1
      default: 2
    }>
  )

  check<1>(
    // @ts-expect-error `1 | 2` is not assignable to `1`
    unknownX as InferPrimitiveSchemaType<{
      type: 'numberLiteral'
      of: 1
      default: 2
    }>
  )
})

it('InferPrimitiveSchemaType<T>: StringUnionSchema required', () => {
  check<'x' | 'y'>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'stringUnion'
      of: ['x', 'y']
    }>
  )

  check<'x'>(
    // @ts-expect-error `'x' | 'y'` is not assignable to `'x'`
    unknownX as InferPrimitiveSchemaType<{
      type: 'stringUnion'
      of: ['x' | 'y']
    }>
  )
})

it('InferPrimitiveSchemaType<T>: StringUnionSchema optional', () => {
  check<'x' | 'y' | undefined>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'stringUnion'
      of: ['x', 'y']
      optional: true
    }>
  )

  check<'x' | 'y'>(
    // @ts-expect-error `'x' | 'y' | undefined` is not assignable to `'x' | 'y'`
    unknownX as InferPrimitiveSchemaType<{
      type: 'stringUnion'
      of: ['x', 'y']
      optional: true
    }>
  )
})

it('InferPrimitiveSchemaType<T>: StringUnionSchema default caveat', () => {
  check<'x' | 'y' | 'z'>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'stringUnion'
      of: ['x', 'y']
      default: 'z'
    }>
  )

  check<'x' | 'y'>(
    // @ts-expect-error `'x' | 'y' | 'z'` is not assignable to `'x' | 'y'`
    unknownX as InferPrimitiveSchemaType<{
      type: 'stringUnion'
      of: ['x', 'y']
      default: 'z'
    }>
  )
})

it('InferPrimitiveSchemaType<T>: NumberUnionSchema required', () => {
  check<1 | 2>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'numberUnion'
      of: [1, 2]
    }>
  )

  check<1>(
    // @ts-expect-error `1 | 2` is not assignable to `1`
    unknownX as InferPrimitiveSchemaType<{
      type: 'numberUnion'
      of: [1, 2]
    }>
  )
})

it('InferPrimitiveSchemaType<T>: NumberUnionSchema optional', () => {
  check<1 | 2 | undefined>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'numberUnion'
      of: [1, 2]
      optional: true
    }>
  )

  check<1 | 2>(
    // @ts-expect-error `1 | 2 | undefined` is not assignable to `1 | 2`
    unknownX as InferPrimitiveSchemaType<{
      type: 'numberUnion'
      of: [1, 2]
      optional: true
    }>
  )
})

it('InferPrimitiveSchemaType<T>: NumberUnionSchema default caveat', () => {
  check<1 | 2 | 3>(
    unknownX as InferPrimitiveSchemaType<{
      type: 'numberUnion'
      of: [1, 2]
      default: 3
    }>
  )

  check<1 | 2>(
    // @ts-expect-error `1 | 2 | 3` is not assignable to `1 | 2`
    unknownX as InferPrimitiveSchemaType<{
      type: 'numberUnion'
      of: [1, 2]
      default: 3
    }>
  )
})

it('InferArraySchemaType<T>: all PrimitiveSchema cases, `array` is required', () => {
  /* string */

  check<string[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'string' }
    }>
  )

  check<string[]>(
    // @ts-expect-error `number[]` is not assignable to `string[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'number' }
    }>
  )

  check<string[]>(
    unknownX as InferArraySchemaType<{ type: 'array'; of: 'string' }>
  )

  check<string[]>(
    // @ts-expect-error `number[]` is not assignable to `string[]`
    unknownX as InferArraySchemaType<{ type: 'array'; of: 'number' }>
  )

  /* number */

  check<number[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'number' }
    }>
  )

  check<number[]>(
    // @ts-expect-error `boolean[]` is not assignable to `number[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'boolean' }
    }>
  )

  check<number[]>(
    unknownX as InferArraySchemaType<{ type: 'array'; of: 'number' }>
  )

  check<number[]>(
    // @ts-expect-error `boolean[]` is not assignable to `number[]`
    unknownX as InferArraySchemaType<{ type: 'array'; of: 'boolean' }>
  )

  /* boolean */

  check<boolean[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'boolean' }
    }>
  )

  check<boolean[]>(
    // @ts-expect-error `Buffer[]` is not assignable to `boolean[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'buffer' }
    }>
  )

  check<boolean[]>(
    unknownX as InferArraySchemaType<{ type: 'array'; of: 'boolean' }>
  )

  check<boolean[]>(
    // @ts-expect-error `Buffer[]` is not assignable to `boolean[]`
    unknownX as InferArraySchemaType<{ type: 'array'; of: 'buffer' }>
  )

  /* buffer */

  check<Buffer[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'buffer' }
    }>
  )

  check<Buffer[]>(
    // @ts-expect-error `'x'[]` is not assignable to `Buffer[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'stringLiteral'; of: 'x' }
    }>
  )

  check<Buffer[]>(
    unknownX as InferArraySchemaType<{ type: 'array'; of: 'buffer' }>
  )

  check<Buffer[]>(
    // @ts-expect-error `string[]` is not assignable to `Buffer[]`
    unknownX as InferArraySchemaType<{ type: 'array'; of: 'string' }>
  )

  /* stringLiteral */

  check<'x'[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'stringLiteral'; of: 'x' }
    }>
  )

  check<'x'[]>(
    // @ts-expect-error `1` is not assignable to `'x'[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'numberLiteral'; of: 1 }
    }>
  )

  /* numberLiteral */

  check<1[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'numberLiteral'; of: 1 }
    }>
  )

  check<1[]>(
    // @ts-expect-error `('x' | 'y')[]` is not assignable to `1[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'stringUnion'; of: ['x', 'y'] }
    }>
  )

  /* stringUnion */

  check<('x' | 'y')[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'stringUnion'; of: ['x', 'y'] }
    }>
  )

  check<('x' | 'y')[]>(
    // @ts-expect-error `(1 | 2)[]` is not assignable to `('x' | 'y')[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'numberUnion'; of: [1, 2] }
    }>
  )

  /* numberUnion */

  check<(1 | 2)[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'numberUnion'; of: [1, 2] }
    }>
  )

  check<(1 | 2)[]>(
    // @ts-expect-error `string[]` is not assignable to `(1 | 2)[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'string' }
    }>
  )
})

it('InferArraySchemaType<T>: all PrimitiveSchema cases, `array` is optional', () => {
  /* string */

  check<string[] | undefined>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'string' }
      optional: true
    }>
  )

  check<string[]>(
    unknownX as NonNullable<
      InferArraySchemaType<{
        type: 'array'
        of: 'string'
        optional: true
      }>
    >
  )

  check<string[]>(
    // @ts-expect-error `string[] | undefined` is not assignable to `string[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'string' }
      optional: true
    }>
  )

  /* number */

  check<number[] | undefined>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'number' }
      optional: true
    }>
  )

  check<number[]>(
    unknownX as NonNullable<
      InferArraySchemaType<{
        type: 'array'
        of: 'number'
        optional: true
      }>
    >
  )

  check<number[]>(
    // @ts-expect-error `number[] | undefined` is not assignable to `number[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'number' }
      optional: true
    }>
  )

  /* boolean */

  check<boolean[] | undefined>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'boolean' }
      optional: true
    }>
  )

  check<boolean[]>(
    unknownX as NonNullable<
      InferArraySchemaType<{
        type: 'array'
        of: 'boolean'
        optional: true
      }>
    >
  )

  check<boolean[]>(
    // @ts-expect-error `boolean[] | undefined` is not assignable to `boolean[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'boolean' }
      optional: true
    }>
  )

  /* buffer */

  check<Buffer[] | undefined>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'buffer' }
      optional: true
    }>
  )

  check<Buffer[]>(
    unknownX as NonNullable<
      InferArraySchemaType<{
        type: 'array'
        of: 'buffer'
        optional: true
      }>
    >
  )

  check<Buffer[]>(
    // @ts-expect-error `Buffer[] | undefined` is not assignable to `Buffer[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'buffer' }
      optional: true
    }>
  )

  /* stringLiteral */

  check<'x'[]>(
    // @ts-expect-error `'x'[] | undefined` is not assignable to `'x'[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'stringLiteral'; of: 'x' }
      optional: true
    }>
  )

  check<'x'[] | undefined>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'stringLiteral'; of: 'x' }
      optional: true
    }>
  )

  /* numberLiteral */

  check<1[]>(
    // @ts-expect-error `1[] | undefined` is not assignable to `1[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'numberLiteral'; of: 1 }
      optional: true
    }>
  )

  check<1[] | undefined>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'numberLiteral'; of: 1 }
      optional: true
    }>
  )

  /* stringUnion */

  check<('x' | 'y')[]>(
    // @ts-expect-error `('x' | 'y')[] | undefined` is not assignable to `('x' | 'y')[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'stringUnion'; of: ['x', 'y'] }
      optional: true
    }>
  )

  check<('x' | 'y')[] | undefined>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'stringUnion'; of: ['x', 'y'] }
      optional: true
    }>
  )

  /* numberUnion */

  check<(1 | 2)[]>(
    // @ts-expect-error `(1 | 2)[] | undefined` is not assignable to `(1 | 2)[]`
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'numberUnion'; of: [1, 2] }
      optional: true
    }>
  )

  check<(1 | 2)[] | undefined>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'numberUnion'; of: [1, 2] }
      optional: true
    }>
  )
})

it('InferArraySchemaType<T>: should omit nullable values', () => {
  check<string[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'string'; optional: true }
    }>
  )

  check<string[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: 'string?'
    }>
  )

  check<number[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'number'; optional: true }
    }>
  )

  check<number[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: 'number?'
    }>
  )

  check<boolean[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'boolean'; optional: true }
    }>
  )

  check<boolean[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: 'boolean?'
    }>
  )

  check<Buffer[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'buffer'; optional: true }
    }>
  )

  check<Buffer[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: 'buffer?'
    }>
  )

  check<'x'[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'stringLiteral'; of: 'x'; optional: true }
    }>
  )

  check<0[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'numberLiteral'; of: 0; optional: true }
    }>
  )

  check<('x' | 'y')[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'stringUnion'; of: ['x', 'y']; optional: true }
    }>
  )

  check<(0 | 1)[]>(
    unknownX as InferArraySchemaType<{
      type: 'array'
      of: { type: 'numberUnion'; of: [0, 1]; optional: true }
    }>
  )
})

it('InferObjectSchemaType<T>: should infer all types in one object', () => {
  check<{
    a: string
    b: number
    c: boolean
    d: Buffer
    e: 'x'
    f: 1
    g: 'x' | 'y'
    h: 1 | 2
    i: string[]
    j: number[]
    k: boolean[]
    l: Buffer[]
    m: 'x'[]
    n: 1[]
    o: ('x' | 'y')[]
    p: (1 | 2)[]
  }>(
    unknownX as InferObjectSchemaType<{
      type: 'object'
      of: {
        a: { type: 'string' }
        b: { type: 'number' }
        c: { type: 'boolean' }
        d: { type: 'buffer' }
        e: { type: 'stringLiteral'; of: 'x' }
        f: { type: 'numberLiteral'; of: 1 }
        g: { type: 'stringUnion'; of: ['x', 'y'] }
        h: { type: 'numberUnion'; of: [1, 2] }
        i: { type: 'array'; of: { type: 'string' } }
        j: { type: 'array'; of: { type: 'number' } }
        k: { type: 'array'; of: { type: 'boolean' } }
        l: { type: 'array'; of: { type: 'buffer' } }
        m: { type: 'array'; of: { type: 'stringLiteral'; of: 'x' } }
        n: { type: 'array'; of: { type: 'numberLiteral'; of: 1 } }
        o: { type: 'array'; of: { type: 'stringUnion'; of: ['x', 'y'] } }
        p: { type: 'array'; of: { type: 'numberUnion'; of: [1, 2] } }
      }
    }>
  )

  check<{
    a: string
    b: number
    c: boolean
    d: Buffer
    e: string[]
    f: number[]
    g: boolean[]
    h: Buffer[]
  }>(
    unknownX as InferObjectSchemaType<{
      type: 'object'
      of: {
        a: 'string'
        b: 'number'
        c: 'boolean'
        d: 'buffer'
        e: { type: 'array'; of: 'string' }
        f: { type: 'array'; of: 'number' }
        g: { type: 'array'; of: 'boolean' }
        h: { type: 'array'; of: 'buffer' }
      }
    }>
  )
})

it('InferObjectSchemaType<T>: optionality check', () => {
  check<{ x: string }>(
    // @ts-expect-error `{ x: string } | undefined` is not assignable to `{ x: string }`
    unknownX as InferObjectSchemaType<{
      type: 'object'
      of: {
        x: { type: 'string' }
      }
      optional: true
    }>
  )

  check<{ x: string | undefined }>(
    unknownX as InferObjectSchemaType<{
      type: 'object'
      of: {
        x: { type: 'string'; optional: true }
      }
    }>
  )

  check<{ x: string }>(
    // @ts-expect-error `{ x: string[] | undefined }` is not assignable to `{ x: string[] }`
    unknownX as InferObjectSchemaType<{
      type: 'object'
      of: {
        x: { type: 'string'; optional: true }
      }
    }>
  )

  check<{ x: string | undefined }>(
    unknownX as InferObjectSchemaType<{
      type: 'object'
      of: {
        x: 'string?'
      }
    }>
  )

  check<{ x: string }>(
    // @ts-expect-error `{ x: string[] | undefined }` is not assignable to `{ x: string[] }`
    unknownX as InferObjectSchemaType<{
      type: 'object'
      of: { x: 'string?' }
    }>
  )

  check<{ x: string[] | undefined }>(
    unknownX as InferObjectSchemaType<{
      type: 'object'
      of: {
        x: {
          type: 'array'
          of: { type: 'string' }
          optional: true
        }
      }
    }>
  )

  check<{ x: string[] }>(
    // @ts-expect-error `{ x: string[] | undefined }` is not assignable to `{ x: string[] }`
    unknownX as InferObjectSchemaType<{
      type: 'object'
      of: {
        x: {
          type: 'array'
          of: { type: 'string' }
          optional: true
        }
      }
    }>
  )

  check<{ x: string[] | undefined }>(
    unknownX as InferObjectSchemaType<{
      type: 'object'
      of: {
        x: {
          type: 'array'
          of: 'string?'
          optional: true
        }
      }
    }>
  )

  check<{ x: string[] }>(
    // @ts-expect-error `{ x: string[] | undefined }` is not assignable to `{ x: string[] }`
    unknownX as InferObjectSchemaType<{
      type: 'object'
      of: {
        x: {
          type: 'array'
          of: 'string?'
          optional: true
        }
      }
    }>
  )
})

it('InferObjectSchemaType<T>: expect structural error', () => {
  check<{ x: string; y: number }>(
    // @ts-expect-error `{ x: string }` is not assignable to `{ x: string; y: number }`
    unknownX as InferObjectSchemaType<{
      type: 'object'
      of: { x: { type: 'string' } }
    }>
  )
})

it('InferObjectArraySchemaType<T>: should infer all types in one object', () => {
  check<
    Array<{
      a: string
      b: number
      c: boolean
      d: Buffer
      e: 'x'
      f: 1
      g: 'x' | 'y'
      h: 1 | 2
      i: string[]
      j: number[]
      k: boolean[]
      l: Buffer[]
      m: 'x'[]
      n: 1[]
      o: ('x' | 'y')[]
      p: (1 | 2)[]
    }>
  >(
    unknownX as InferObjectArraySchemaType<{
      type: 'objectArray'
      of: {
        type: 'object'
        of: {
          a: { type: 'string' }
          b: { type: 'number' }
          c: { type: 'boolean' }
          d: { type: 'buffer' }
          e: { type: 'stringLiteral'; of: 'x' }
          f: { type: 'numberLiteral'; of: 1 }
          g: { type: 'stringUnion'; of: ['x', 'y'] }
          h: { type: 'numberUnion'; of: [1, 2] }
          i: { type: 'array'; of: { type: 'string' } }
          j: { type: 'array'; of: { type: 'number' } }
          k: { type: 'array'; of: { type: 'boolean' } }
          l: { type: 'array'; of: { type: 'buffer' } }
          m: { type: 'array'; of: { type: 'stringLiteral'; of: 'x' } }
          n: { type: 'array'; of: { type: 'numberLiteral'; of: 1 } }
          o: { type: 'array'; of: { type: 'stringUnion'; of: ['x', 'y'] } }
          p: { type: 'array'; of: { type: 'numberUnion'; of: [1, 2] } }
        }
      }
    }>
  )

  check<
    Array<{
      a: string
      b: number
      c: boolean
      d: Buffer
      e: string[]
      f: number[]
      g: boolean[]
      h: Buffer[]
    }>
  >(
    unknownX as InferObjectArraySchemaType<{
      type: 'objectArray'
      of: {
        type: 'object'
        of: {
          a: 'string'
          b: 'number'
          c: 'boolean'
          d: 'buffer'
          e: { type: 'array'; of: 'string' }
          f: { type: 'array'; of: 'number' }
          g: { type: 'array'; of: 'boolean' }
          h: { type: 'array'; of: 'buffer' }
        }
      }
    }>
  )
})

it('InferObjectArraySchemaType<T>: `object` `optional` property should be ignored', () => {
  check<Array<{ x: string }>>(
    unknownX as InferObjectArraySchemaType<{
      type: 'objectArray'
      of: {
        type: 'object'
        of: { x: { type: 'string' } }
      }
    }>
  )

  check<Array<{ x: string }>>(
    unknownX as InferObjectArraySchemaType<{
      type: 'objectArray'
      of: {
        type: 'object'
        of: { x: { type: 'string' } }
        optional: true
      }
    }>
  )
})

it('InferObjectArraySchemaType<T>: `objectArray` `optional` property should NOT be ignored', () => {
  check<Array<{ x: string }> | undefined>(
    unknownX as InferObjectArraySchemaType<{
      type: 'objectArray'
      optional: true
      of: {
        type: 'object'
        of: { x: { type: 'string' } }
      }
    }>
  )

  check<Array<{ x: string }>>(
    // @ts-expect-error `Array<{ x: string }> | undefined` is not assignable to `Array<{ x: string }>`
    unknownX as InferObjectArraySchemaType<{
      type: 'objectArray'
      optional: true
      of: {
        type: 'object'
        of: { x: { type: 'string' } }
      }
    }>
  )
})

it('InferObjectArraySchemaType<T>: check deepest level optionality', () => {
  check<Array<{ x: string }> | undefined>(
    unknownX as InferObjectArraySchemaType<{
      type: 'objectArray'
      optional: true
      of: {
        type: 'object'
        of: { x: { type: 'string' } }
      }
    }>
  )

  check<Array<{ x: string }>>(
    // @ts-expect-error `Array<{ x: string | undefined }>` is not assignable to `Array<{ x: string }>`
    unknownX as InferObjectArraySchemaType<{
      type: 'objectArray'
      of: {
        type: 'object'
        of: { x: { type: 'string'; optional: true } }
      }
    }>
  )

  check<Array<{ x: string }>>(
    // @ts-expect-error `Array<{ x: string | undefined }>` is not assignable to `Array<{ x: string }>`
    unknownX as InferObjectArraySchemaType<{
      type: 'objectArray'
      of: {
        type: 'object'
        of: { x: 'string?' }
      }
    }>
  )
})

it('InferType<T>: PrimitiveSchema check', () => {
  check<string>(
    unknownX as InferSchemaType<{
      type: 'string'
    }>
  )

  check<string>(
    // @ts-expect-error `string | undefined` is not assignable to `string`
    unknownX as InferSchemaType<{
      type: 'string'
      optional: true
    }>
  )

  check<string>(unknownX as InferSchemaType<'string'>)

  // @ts-expect-error `string | undefined` is not assignable to `string`
  check<string>(unknownX as InferSchemaType<'string?'>)
})

it('InferType<T>: ArraySchemaCheck check', () => {
  check<string[]>(
    unknownX as InferSchemaType<{
      type: 'array'
      of: { type: 'string' }
    }>
  )

  check<string[]>(
    // @ts-expect-error `string[] | undefined` is not assignable to `string[]`
    unknownX as InferSchemaType<{
      type: 'array'
      of: { type: 'string' }
      optional: true
    }>
  )

  check<string[]>(
    unknownX as InferSchemaType<{
      type: 'array'
      of: { type: 'string'; optional: true }
    }>
  )

  check<string[]>(unknownX as InferSchemaType<{ type: 'array'; of: 'string' }>)
  check<string[]>(unknownX as InferSchemaType<{ type: 'array'; of: 'string?' }>)
})

it('InferType<T>: ObjectSchema check', () => {
  check<{ x: string }>(
    unknownX as InferSchemaType<{
      type: 'object'
      of: { x: { type: 'string' } }
    }>
  )

  check<{ x: string }>(
    // @ts-expect-error `{ x: string } | undefined` is not assignable to `string[]`
    unknownX as InferSchemaType<{
      type: 'object'
      of: { x: { type: 'string' } }
      optional: true
    }>
  )

  check<{ x: string }>(
    unknownX as InferSchemaType<{
      type: 'object'
      of: { x: 'string' }
    }>
  )
})

it('InferType<T>: ObjectArraySchema check', () => {
  check<{ x: string }[]>(
    unknownX as InferSchemaType<{
      type: 'objectArray'
      of: {
        type: 'object'
        of: {
          x: { type: 'string' }
        }
      }
    }>
  )

  check<{ x: string }[]>(
    unknownX as InferSchemaType<{
      type: 'objectArray'
      of: {
        type: 'object'
        of: {
          x: 'string'
        }
      }
    }>
  )

  check<{ x: string }[]>(
    unknownX as InferSchemaType<{
      type: 'objectArray'
      of: {
        type: 'object'
        of: {
          x: { type: 'string' }
        }
        optional: true
      }
    }>
  )
})
