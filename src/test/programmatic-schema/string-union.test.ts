import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../../error'
import { parse } from '../../general-schema-parser'
import { validate } from '../../general-schema-validator'
import { stringUnion } from '../../programmatic-schema/string-union'
import { check, unknownX } from '../test-utils'

describe('String union schema programmatic definition', () => {
  it('stringUnion: should require at least one argument specified', () => {
    // @ts-expect-error Expected at least 1 arguments
    expect(() => stringUnion()).not.toThrow()
  })

  it('stringUnion: should narrow the type of default argument', () => {
    // @ts-expect-error '"y"' is not assignable to parameter of type '"x"'
    expect(() => stringUnion('x').optional().default('y')).not.toThrow()
  })

  it('stringUnion: required stringUnion', () => {
    const schemaX = stringUnion('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'stringUnion',
      of: ['x', 'y'],
    })

    check<{ type: 'stringUnion'; of: Readonly<Array<'x' | 'y'>> }>(
      unknownX as typeof schemaX.__schema
    )
    check<{ type: 'number'; of: Readonly<Array<'x' | 'y'>> }>(
      // @ts-expect-error '"stringUnion"' is not assignable to type '"number"'
      unknownX as typeof schemaX.__schema
    )

    expect(parse(schemaX.__schema, 'x').data).toBe('x')
    expect(parse(schemaX.__schema, 'x').error).toBe(undefined)
    expect(validate(schemaX.__schema, 'x').data).toBe('x')
    expect(validate(schemaX.__schema, 'x').error).toBe(undefined)
  })

  it('stringUnion: stringUnion -> brand', () => {
    const schemaX = stringUnion('x', 'y').brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'stringUnion',
      of: ['x', 'y'],
      brand: ['x', 'y'],
    })

    check<{
      __schema: {
        type: 'stringUnion'
        of: Readonly<Array<'x' | 'y'>>
        brand: Readonly<['x', 'y']>
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        of: Readonly<Array<'x' | 'y'>>
        brand: Readonly<['x', 'y']>
      }
      // @ts-expect-error '"stringUnion"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 'x').data).toBe('x')
    expect(parse(schemaX.__schema, 'x').error).toBe(undefined)
    expect(validate(schemaX.__schema, 'x' as 'x' & { __x: 'y' }).data).toBe('x')
    // @ts-expect-error 'x' is not '{ __x: "y"; } & string'
    expect(validate(schemaX.__schema, 'x').error).toBe(undefined)

    // @ts-expect-error Property 'brand' does not exist on type
    expect(() => schemaX.brand('x', 'y')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.brandDefined
    )

    // @ts-expect-error Property 'default' does not exist
    expect(() => schemaX.default()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.defaultNotAllowed
    )
  })

  it('stringUnion: stringUnion -> brand -> optional', () => {
    const schemaX = stringUnion('x', 'y').brand('x', 'y').optional()

    expect(schemaX.__schema).toStrictEqual({
      type: 'stringUnion',
      of: ['x', 'y'],
      brand: ['x', 'y'],
      optional: true,
    })

    check<{
      __schema: {
        type: 'stringUnion'
        of: Readonly<Array<'x' | 'y'>>
        brand: Readonly<['x', 'y']>
        optional: true
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        of: Readonly<Array<'x' | 'y'>>
        brand: Readonly<['x', 'y']>
        optional: true
      }
      // @ts-expect-error '"stringUnion"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 'x').data).toBe('x')
    expect(parse(schemaX.__schema, 'x').error).toBe(undefined)
    expect(validate(schemaX.__schema, 'x' as 'x' & { __x: 'y' }).data).toBe('x')
    // @ts-expect-error 'x' is not assignable to parameter of type '{ __x: "y"; } & string'
    expect(validate(schemaX.__schema, 'x').error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined
    )
  })

  it('stringUnion: stringUnion -> brand -> optional -> default', () => {
    const schemaX = stringUnion('x', 'y', 'z')
      .brand('x', 'y')
      .optional()
      .default('x')

    expect(schemaX.__schema).toStrictEqual({
      type: 'stringUnion',
      of: ['x', 'y', 'z'],
      brand: ['x', 'y'],
      optional: true,
      default: 'x',
    })

    check<{
      __schema: {
        type: 'stringUnion'
        of: Readonly<Array<'x' | 'y' | 'z'>>
        brand: Readonly<['x', 'y']>
        optional: true
        default: 'x' | 'y' | 'z'
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        of: Readonly<Array<'x' | 'y' | 'z'>>
        brand: Readonly<['x', 'y']>
        optional: true
        default: 'x' | 'y' | 'z'
      }
      // @ts-expect-error '"stringUnion"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 'x').data).toBe('x')
    expect(parse(schemaX.__schema, 'x').error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe('x')
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'default' does not exist
    expect(() => schemaX.default('x')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.defaultDefined
    )
  })

  it('stringUnion: stringUnion -> brand -> optional -> default -> description', () => {
    const schemaX = stringUnion('x', 'y')
      .brand('x', 'y')
      .optional()
      .default('x')
      .description('x')

    expect(schemaX.__schema).toStrictEqual({
      type: 'stringUnion',
      of: ['x', 'y'],
      brand: ['x', 'y'],
      optional: true,
      default: 'x',
      description: 'x',
    })

    check<{
      __schema: {
        type: 'stringUnion'
        of: Readonly<Array<'x' | 'y'>>
        brand: Readonly<['x', 'y']>
        optional: true
        default: 'x' | 'y'
        description: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        of: Readonly<Array<'x' | 'y'>>
        brand: Readonly<['x', 'y']>
        optional: true
        default: 'x' | 'y'
        description: string
      }
      // @ts-expect-error '"stringUnion"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 'x').data).toBe('x')
    expect(parse(schemaX.__schema, 'x').error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe('x')
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined
    )
  })

  it('stringUnion: stringUnion -> description -> optional -> default -> brand', () => {
    const schemaX = stringUnion('x', 'y')
      .description('x')
      .optional()
      .default('x')
      .brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'stringUnion',
      of: ['x', 'y'],
      brand: ['x', 'y'],
      optional: true,
      default: 'x',
      description: 'x',
    })

    check<{
      __schema: {
        type: 'stringUnion'
        of: Readonly<Array<'x' | 'y'>>
        brand: Readonly<['x', 'y']>
        optional: true
        default: 'x' | 'y'
        description: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        of: Readonly<Array<'x' | 'y'>>
        brand: Readonly<['x', 'y']>
        optional: true
        default: 'x' | 'y'
        description: string
      }
      // @ts-expect-error '"stringUnion"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 'x').data).toBe('x')
    expect(parse(schemaX.__schema, 'x').error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe('x')
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined
    )
  })
})
