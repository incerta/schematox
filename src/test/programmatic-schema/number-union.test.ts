import { parse } from '../../general-schema-parser'
import { validate } from '../../general-schema-validator'
import { numberUnion } from '../../programmatic-schema/number-union'
import { check, unknownX } from '../test-utils'

describe('Number union schema programmatic definition', () => {
  it('numberUnion: should require at least one argument specified', () => {
    // @ts-expect-error Expected at least 1 arguments
    expect(() => numberUnion()).not.toThrow()
  })

  it('numberUnion: required numberUnion', () => {
    const schemaX = numberUnion(0, 1)

    expect(schemaX.__schema).toStrictEqual({
      type: 'numberUnion',
      of: [0, 1],
    })

    check<{ type: 'numberUnion'; of: Readonly<Array<0 | 1>> }>(
      unknownX as typeof schemaX.__schema
    )
    check<{ type: 'number'; of: Readonly<Array<0 | 1>> }>(
      // @ts-expect-error '"numberUnion"' is not assignable to type '"number"'
      unknownX as typeof schemaX.__schema
    )

    expect(parse(schemaX.__schema, 0).data).toBe(0)
    expect(parse(schemaX.__schema, 0).error).toBe(undefined)
    expect(validate(schemaX.__schema, 0).data).toBe(0)
    expect(validate(schemaX.__schema, 0).error).toBe(undefined)
  })

  it('numberUnion: numberUnion -> brand', () => {
    const schemaX = numberUnion(0, 1).brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'numberUnion',
      of: [0, 1],
      brand: ['x', 'y'],
    })

    check<{
      __schema: {
        type: 'numberUnion'
        of: Readonly<Array<0 | 1>>
        brand: Readonly<['x', 'y']>
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        of: Readonly<Array<0 | 1>>
        brand: Readonly<['x', 'y']>
      }
      // @ts-expect-error '"numberUnion"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 0).data).toBe(0)
    expect(parse(schemaX.__schema, 0).error).toBe(undefined)
    expect(validate(schemaX.__schema, 0).data).toBe(0)
    expect(validate(schemaX.__schema, 0).error).toBe(undefined)

    // @ts-expect-error Property 'brand' does not exist on type
    expect(() => schemaX.brand('x', 'y')).not.toThrow()
  })

  it('numberUnion: numberUnion -> brand -> optional', () => {
    const schemaX = numberUnion(0, 1).brand('x', 'y').optional()

    expect(schemaX.__schema).toStrictEqual({
      type: 'numberUnion',
      of: [0, 1],
      brand: ['x', 'y'],
      optional: true,
    })

    check<{
      __schema: {
        type: 'numberUnion'
        of: Readonly<Array<0 | 1>>
        brand: Readonly<['x', 'y']>
        optional: true
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        of: Readonly<Array<0 | 1>>
        brand: Readonly<['x', 'y']>
        optional: true
      }
      // @ts-expect-error '"numberUnion"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 0).data).toBe(0)
    expect(parse(schemaX.__schema, 0).error).toBe(undefined)
    expect(validate(schemaX.__schema, 0).data).toBe(0)
    expect(validate(schemaX.__schema, 0).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).not.toThrow()
  })

  it('numberUnion: numberUnion -> brand -> optional -> description', () => {
    const schemaX = numberUnion(0, 1)
      .brand('x', 'y')
      .optional()
      .description('x')

    expect(schemaX.__schema).toStrictEqual({
      type: 'numberUnion',
      of: [0, 1],
      brand: ['x', 'y'],
      optional: true,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'numberUnion'
        of: Readonly<Array<0 | 1>>
        brand: Readonly<['x', 'y']>
        optional: true
        description: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        of: Readonly<Array<0 | 1>>
        brand: Readonly<['x', 'y']>
        optional: true
        description: string
      }
      // @ts-expect-error '"numberUnion"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 0).data).toBe(0)
    expect(parse(schemaX.__schema, 0).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description(0)).not.toThrow()
  })

  it('numberUnion: numberUnion -> description -> optional -> brand', () => {
    const schemaX = numberUnion(0, 1)
      .description('x')
      .optional()
      .brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'numberUnion',
      of: [0, 1],
      brand: ['x', 'y'],
      optional: true,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'numberUnion'
        of: Readonly<Array<0 | 1>>
        brand: Readonly<['x', 'y']>
        optional: true
        description: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        of: Readonly<Array<0 | 1>>
        brand: Readonly<['x', 'y']>
        optional: true
        default: 0 | 1
        description: string
      }
      // @ts-expect-error '"numberUnion"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 0).data).toBe(0)
    expect(parse(schemaX.__schema, 0).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)
  })
})

describe('Validate/parse/guard using struct', () => {
  it('numberUnion: parse', () => {
    expect(numberUnion(0, 1).parse(0).data).toBe(0)
    expect(numberUnion(0, 1).parse(0).error).toBe(undefined)

    expect(numberUnion(0, 1).parse(undefined).data).toBe(undefined)
    expect(numberUnion(0, 1).parse(undefined).error).toBeTruthy()
  })

  it('numberUnion: validate', () => {
    expect(numberUnion(0, 1).validate(0).data).toBe(0)
    expect(numberUnion(0, 1).validate(0).error).toBe(undefined)

    expect(numberUnion(0, 1).validate(undefined).data).toBe(undefined)
    expect(numberUnion(0, 1).validate(undefined).error).toBeTruthy()
  })

  it('numberUnion: guard', () => {
    const struct = numberUnion(0, 1)
    const subj: unknown = 0
    const guard = struct.guard(subj)

    if (guard) {
      check<0 | 1>(subj)
      // @ts-expect-error '0 | 1' is not assignable to parameter of type '0'
      check<0>(subj)
    }
  })
})
