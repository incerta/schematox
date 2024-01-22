import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../../error'
import { parse } from '../../general-schema-parser'
import { validate } from '../../general-schema-validator'
import { number } from '../../programmatic-schema/number'
import { check, unknownX } from '../test-utils'

describe('Number schema programmatic definition', () => {
  it('number: required number', () => {
    const schemaX = number()

    expect(schemaX.__schema).toStrictEqual({
      type: 'number',
    })

    check<{ type: 'number' }>(unknownX as typeof schemaX.__schema)
    // @ts-expect-error Type '"number"' is not assignable to type '"number"'
    check<{ type: 'string' }>(unknownX as typeof schemaX.__schema)

    expect(parse(schemaX.__schema, 0).data).toBe(0)
    expect(parse(schemaX.__schema, 0).error).toBe(undefined)
    expect(validate(schemaX.__schema, 0).data).toBe(0)
    expect(validate(schemaX.__schema, 0).error).toBe(undefined)
  })

  it('number: number -> brand', () => {
    const schemaX = number().brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'number',
      brand: ['x', 'y'],
    })

    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
      }
      // @ts-expect-error '"number"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 1).data).toBe(1)
    expect(parse(schemaX.__schema, 1).error).toBe(undefined)
    expect(validate(schemaX.__schema, 1 as number & { __x: 'y' }).data).toBe(1)
    // @ts-expect-error 'number' is not '{ __x: "y"; } & number'
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

  it('number: number -> brand -> optional', () => {
    const schemaX = number().brand('x', 'y').optional()

    expect(schemaX.__schema).toStrictEqual({
      type: 'number',
      brand: ['x', 'y'],
      optional: true,
    })

    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
      }
      // @ts-expect-error '"number"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 1).data).toBe(1)
    expect(parse(schemaX.__schema, 1).error).toBe(undefined)
    expect(validate(schemaX.__schema, 0 as number & { __x: 'y' }).data).toBe(0)
    // @ts-expect-error 'number' is not '{ __x: "y"; } & number'
    expect(validate(schemaX.__schema, 0).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined
    )
  })

  it('number: number -> brand -> optional -> default', () => {
    const schemaX = number().brand('x', 'y').optional().default(0)

    expect(schemaX.__schema).toStrictEqual({
      type: 'number',
      brand: ['x', 'y'],
      optional: true,
      default: 0,
    })

    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
        default: number
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        default: number
      }
      // @ts-expect-error '"number"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 0).data).toBe(0)
    expect(parse(schemaX.__schema, 0).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(0)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'default' does not exist
    expect(() => schemaX.default('x')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.defaultDefined
    )
  })

  it('number: number -> brand -> optional -> default -> min', () => {
    const schemaX = number().brand('x', 'y').optional().default(1).min(1)

    expect(schemaX.__schema).toStrictEqual({
      type: 'number',
      brand: ['x', 'y'],
      optional: true,
      default: 1,
      min: 1,
    })

    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
        default: number
        min: number
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        default: number
        min: number
      }
      // @ts-expect-error '"number"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 1).data).toBe(1)
    expect(parse(schemaX.__schema, 1).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(1)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error 'min' does not exist
    expect(() => schemaX.min(1)).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.minDefined
    )
  })

  it('number: number -> brand -> optional -> default -> min -> max', () => {
    const schemaX = number().brand('x', 'y').optional().default(1).min(1).max(1)

    expect(schemaX.__schema).toStrictEqual({
      type: 'number',
      brand: ['x', 'y'],
      optional: true,
      default: 1,
      min: 1,
      max: 1,
    })

    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
        default: number
        min: number
        max: number
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        default: number
        min: number
        max: number
      }
      // @ts-expect-error '"number"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 1).data).toBe(1)
    expect(parse(schemaX.__schema, 1).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(1)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'max' does not exist
    expect(() => schemaX.max(1)).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.maxDefined
    )
  })

  it('number: number -> brand -> optional -> default -> min -> max -> description', () => {
    const schemaX = number()
      .brand('x', 'y')
      .optional()
      .default(1)
      .min(1)
      .max(1)
      .description('x')

    expect(schemaX.__schema).toStrictEqual({
      type: 'number',
      brand: ['x', 'y'],
      optional: true,
      default: 1,
      min: 1,
      max: 1,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
        default: number
        min: number
        max: number
        description: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        default: number
        min: number
        max: number
        description: string
      }
      // @ts-expect-error '"number"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 1).data).toBe(1)
    expect(parse(schemaX.__schema, 1).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(1)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined
    )
  })

  it('number: number -> description -> max -> min -> optional -> default -> brand', () => {
    const schemaX = number()
      .description('x')
      .max(1)
      .min(1)
      .optional()
      .default(1)
      .brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'number',
      brand: ['x', 'y'],
      optional: true,
      default: 1,
      min: 1,
      max: 1,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
        default: number
        min: number
        max: number
        description: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        default: number
        min: number
        max: number
        description: string
      }
      // @ts-expect-error '"number"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 1).data).toBe(1)
    expect(parse(schemaX.__schema, 1).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(1)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined
    )
  })
})
