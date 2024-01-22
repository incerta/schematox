import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../../error'
import { parse } from '../../general-schema-parser'
import { validate } from '../../general-schema-validator'
import { boolean } from '../../programmatic-schema/boolean'
import { check, unknownX } from '../test-utils'

describe('Boolean schema programmatic definition', () => {
  it('boolean: required boolean', () => {
    const schemaX = boolean()

    expect(schemaX.__schema).toStrictEqual({
      type: 'boolean',
    })

    check<{ type: 'boolean' }>(unknownX as typeof schemaX.__schema)
    // @ts-expect-error '"boolean"' is not assignable to type '"string"'
    check<{ type: 'string' }>(unknownX as typeof schemaX.__schema)

    expect(parse(schemaX.__schema, false).data).toBe(false)
    expect(parse(schemaX.__schema, false).error).toBe(undefined)
    expect(validate(schemaX.__schema, false).data).toBe(false)
    expect(validate(schemaX.__schema, false).error).toBe(undefined)
  })

  it('boolean: boolean -> brand', () => {
    const schemaX = boolean().brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'boolean',
      brand: ['x', 'y'],
    })

    check<{
      __schema: {
        type: 'boolean'
        brand: Readonly<['x', 'y']>
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
      }
      // @ts-expect-error '"boolean"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, false).data).toBe(false)
    expect(parse(schemaX.__schema, false).error).toBe(undefined)
    expect(
      validate(schemaX.__schema, false as boolean & { __x: 'y' }).data
    ).toBe(false)
    // @ts-expect-error 'false' is not '{ __x: "y"; } & boolean'
    expect(validate(schemaX.__schema, false).error).toBe(undefined)

    // @ts-expect-error Property 'brand' does not exist on type
    expect(() => schemaX.brand('x', 'y')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.brandDefined
    )

    // @ts-expect-error Property 'default' does not exist
    expect(() => schemaX.default()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.defaultNotAllowed
    )
  })

  it('boolean: boolean -> brand -> optional', () => {
    const schemaX = boolean().brand('x', 'y').optional()

    expect(schemaX.__schema).toStrictEqual({
      type: 'boolean',
      brand: ['x', 'y'],
      optional: true,
    })

    check<{
      __schema: {
        type: 'boolean'
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
      // @ts-expect-error '"boolean"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, false).data).toBe(false)
    expect(parse(schemaX.__schema, false).error).toBe(undefined)
    expect(
      validate(schemaX.__schema, true as boolean & { __x: 'y' }).data
    ).toBe(true)
    // @ts-expect-error 'true' is not '({ __x: "y"; } & boolean) | undefined'
    expect(validate(schemaX.__schema, true).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined
    )
  })

  it('boolean: boolean -> brand -> optional -> default', () => {
    const schemaX = boolean().brand('x', 'y').optional().default(false)

    expect(schemaX.__schema).toStrictEqual({
      type: 'boolean',
      brand: ['x', 'y'],
      optional: true,
      default: false,
    })

    check<{
      __schema: {
        type: 'boolean'
        brand: Readonly<['x', 'y']>
        optional: true
        default: boolean
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        default: boolean
      }
      // @ts-expect-error '"boolean"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, false).data).toBe(false)
    expect(parse(schemaX.__schema, false).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(false)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'default' does not exist
    expect(() => schemaX.default(false)).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.defaultDefined
    )
  })

  it('boolean: boolean -> brand -> optional -> default -> description', () => {
    const schemaX = boolean()
      .brand('x', 'y')
      .optional()
      .default(false)
      .description('x')

    expect(schemaX.__schema).toStrictEqual({
      type: 'boolean',
      brand: ['x', 'y'],
      optional: true,
      default: false,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'boolean'
        brand: Readonly<['x', 'y']>
        optional: true
        default: boolean
        description: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        default: boolean
        description: string
      }
      // @ts-expect-error '"boolean"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, false).data).toBe(false)
    expect(parse(schemaX.__schema, false).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(false)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined
    )
  })

  it('boolean: boolean -> description -> optional -> default -> brand', () => {
    const schemaX = boolean()
      .description('x')
      .optional()
      .default(true)
      .brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'boolean',
      brand: ['x', 'y'],
      optional: true,
      default: true,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'boolean'
        brand: Readonly<['x', 'y']>
        optional: true
        default: boolean
        description: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        default: boolean
        description: string
      }
      // @ts-expect-error '"boolean"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, true).data).toBe(true)
    expect(parse(schemaX.__schema, true).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(true)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined
    )
  })
})
