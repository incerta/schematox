import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../../error'
import { parse } from '../../general-schema-parser'
import { validate } from '../../general-schema-validator'
import { numberUnion } from '../../programmatic-schema/number-union'
import { check, unknownX } from '../test-utils'

describe('Number union schema programmatic definition', () => {
  it('numberUnion: should require at least one argument specified', () => {
    // @ts-expect-error Expected at least 1 arguments
    expect(() => numberUnion()).not.toThrow()
  })

  it('numberUnion: should narrow the type of default argument', () => {
    // @ts-expect-error '1' is not assignable to parameter of type '0'
    expect(() => numberUnion(0).optional().default(1)).not.toThrow()
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
    expect(validate(schemaX.__schema, 0 as 0 & { __x: 'y' }).data).toBe(0)
    // @ts-expect-error 0 is not '{ __x: "y"; } & string'
    expect(validate(schemaX.__schema, 0).error).toBe(undefined)

    // @ts-expect-error Property 'brand' does not exist on type
    expect(() => schemaX.brand('x', 'y')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.brandDefined
    )

    // @ts-expect-error Property 'default' does not exist
    expect(() => schemaX.default()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.defaultNotAllowed
    )
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
    expect(validate(schemaX.__schema, 0 as 0 & { __x: 'y' }).data).toBe(0)
    // @ts-expect-error 0 is not assignable to parameter of type '{ __x: "y"; } & string'
    expect(validate(schemaX.__schema, 0).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined
    )
  })

  it('numberUnion: numberUnion -> brand -> optional -> default', () => {
    const schemaX = numberUnion(0, 1, 2).brand('x', 'y').optional().default(0)

    expect(schemaX.__schema).toStrictEqual({
      type: 'numberUnion',
      of: [0, 1, 2],
      brand: ['x', 'y'],
      optional: true,
      default: 0,
    })

    check<{
      __schema: {
        type: 'numberUnion'
        of: Readonly<Array<0 | 1 | 2>>
        brand: Readonly<['x', 'y']>
        optional: true
        default: 0 | 1 | 2
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        of: Readonly<Array<0 | 1 | 2>>
        brand: Readonly<['x', 'y']>
        optional: true
        default: 0 | 1 | 2
      }
      // @ts-expect-error '"numberUnion"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 0).data).toBe(0)
    expect(parse(schemaX.__schema, 0).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(0)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'default' does not exist
    expect(() => schemaX.default(0)).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.defaultDefined
    )
  })

  it('numberUnion: numberUnion -> brand -> optional -> default -> description', () => {
    const schemaX = numberUnion(0, 1)
      .brand('x', 'y')
      .optional()
      .default(0)
      .description('x')

    expect(schemaX.__schema).toStrictEqual({
      type: 'numberUnion',
      of: [0, 1],
      brand: ['x', 'y'],
      optional: true,
      default: 0,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'numberUnion'
        of: Readonly<Array<0 | 1>>
        brand: Readonly<['x', 'y']>
        optional: true
        default: 0 | 1
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
    expect(parse(schemaX.__schema, undefined).data).toBe(0)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description(0)).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined
    )
  })

  it('numberUnion: numberUnion -> description -> optional -> default -> brand', () => {
    const schemaX = numberUnion(0, 1)
      .description('x')
      .optional()
      .default(0)
      .brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'numberUnion',
      of: [0, 1],
      brand: ['x', 'y'],
      optional: true,
      default: 0,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'numberUnion'
        of: Readonly<Array<0 | 1>>
        brand: Readonly<['x', 'y']>
        optional: true
        default: 0 | 1
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
    expect(parse(schemaX.__schema, undefined).data).toBe(0)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description(0)).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined
    )
  })
})
