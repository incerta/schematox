import { check, unknownX } from '../utils/unit-test'

import type {
  InferOptionality,
  InferPrimitiveSchemaType,
  SchemaBase,
} from '../types'

it('SchemaBase<T>: should error if specified both: "default" & "optional"', () => {
  check(
    unknownX as {
      // @ts-expect-error should be incompatible with "optional" prop
      default: unknownX
      optional: true
    } as SchemaBase
  )
})

it('InferOptionality<T, U>: required', () => {
  check<'x'>(unknownX as InferOptionality<{ type: 'string' }, 'x'>)
  check<'x'>(
    unknownX as InferOptionality<{ type: 'string'; optional: false }, 'x'>
  )
})

it('InferOptionality<T, U>: optional', () => {
  check<'x' | undefined>(
    unknownX as InferOptionality<{ type: 'string'; optional: true }, 'x'>
  )
  check<'x'>(
    // @ts-expect-error should infer `'x' | undefined`
    unknownX as InferOptionality<{ type: 'string'; optional: true }, 'x'>
  )
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
    // @ts-expect-error should be optional
    unknownX as InferPrimitiveSchemaType<{
      type: 'string'
      optional: true
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
    // @ts-expect-error should be optional
    unknownX as InferPrimitiveSchemaType<{
      type: 'number'
      optional: true
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
    // @ts-expect-error should be optional
    unknownX as InferPrimitiveSchemaType<{
      type: 'boolean'
      optional: true
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
    // @ts-expect-error should not satisfy 'string' constraint
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
    // @ts-expect-error should not satisfy 'number' constraint
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
    // @ts-expect-error `'x' | 'y'` is not assignable to `'x' | 'y' | `z``
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
