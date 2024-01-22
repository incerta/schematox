import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../../error'
import { parse } from '../../general-schema-parser'
import { validate } from '../../general-schema-validator'
import { string } from '../../programmatic-schema/string'
import { check, unknownX } from '../test-utils'

describe('String schema programmatic definition', () => {
  it('string: required string', () => {
    const schemaX = string()

    expect(schemaX.__schema).toStrictEqual({
      type: 'string',
    })

    check<{ type: 'string' }>(unknownX as typeof schemaX.__schema)
    // @ts-expect-error Type '"string"' is not assignable to type '"number"'
    check<{ type: 'number' }>(unknownX as typeof schemaX.__schema)

    expect(parse(schemaX.__schema, 'x').data).toBe('x')
    expect(parse(schemaX.__schema, 'x').error).toBe(undefined)
    expect(validate(schemaX.__schema, 'x').data).toBe('x')
    expect(validate(schemaX.__schema, 'x').error).toBe(undefined)
  })

  it('string: string -> brand', () => {
    const schemaX = string().brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'string',
      brand: ['x', 'y'],
    })

    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
      }
      // @ts-expect-error '"string"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 'x').data).toBe('x')
    expect(parse(schemaX.__schema, 'x').error).toBe(undefined)
    expect(validate(schemaX.__schema, 'x' as string & { __x: 'y' }).data).toBe(
      'x'
    )
    // @ts-expect-error 'string' is not '{ __x: "y"; } & string'
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

  it('string: string -> brand -> optional', () => {
    const schemaX = string().brand('x', 'y').optional()

    expect(schemaX.__schema).toStrictEqual({
      type: 'string',
      brand: ['x', 'y'],
      optional: true,
    })

    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
      }
      // @ts-expect-error '"string"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 'x').data).toBe('x')
    expect(parse(schemaX.__schema, 'x').error).toBe(undefined)
    expect(validate(schemaX.__schema, 'x' as string & { __x: 'y' }).data).toBe(
      'x'
    )
    // @ts-expect-error 'string' is not assignable to parameter of type '{ __x: "y"; } & string'
    expect(validate(schemaX.__schema, 'x').error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined
    )
  })

  it('string: string -> brand -> optional -> default', () => {
    const schemaX = string().brand('x', 'y').optional().default('x')

    expect(schemaX.__schema).toStrictEqual({
      type: 'string',
      brand: ['x', 'y'],
      optional: true,
      default: 'x',
    })

    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        default: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
        default: string
      }
      // @ts-expect-error '"string"' is not assignable to type '"number"'
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

  it('string: string -> brand -> optional -> default -> minLength', () => {
    const schemaX = string()
      .brand('x', 'y')
      .optional()
      .default('x')
      .minLength(1)

    expect(schemaX.__schema).toStrictEqual({
      type: 'string',
      brand: ['x', 'y'],
      optional: true,
      default: 'x',
      minLength: 1,
    })

    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        default: string
        minLength: number
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
        default: string
        minLength: number
      }
      // @ts-expect-error '"string"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 'x').data).toBe('x')
    expect(parse(schemaX.__schema, 'x').error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe('x')
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error 'minLength' does not exist
    expect(() => schemaX.minLength(1)).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.minLengthDefined
    )
  })

  it('string: string -> brand -> optional -> default -> minLength -> maxLength', () => {
    const schemaX = string()
      .brand('x', 'y')
      .optional()
      .default('x')
      .minLength(1)
      .maxLength(1)

    expect(schemaX.__schema).toStrictEqual({
      type: 'string',
      brand: ['x', 'y'],
      optional: true,
      default: 'x',
      minLength: 1,
      maxLength: 1,
    })

    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        default: string
        minLength: number
        maxLength: number
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
        default: string
        minLength: number
        maxLength: number
      }
      // @ts-expect-error '"string"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 'x').data).toBe('x')
    expect(parse(schemaX.__schema, 'x').error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe('x')
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'maxLength' does not exist
    expect(() => schemaX.maxLength(1)).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.maxLengthDefined
    )
  })

  it('string: string -> brand -> optional -> default -> minLength -> maxLength -> description', () => {
    const schemaX = string()
      .brand('x', 'y')
      .optional()
      .default('x')
      .minLength(1)
      .maxLength(1)
      .description('x')

    expect(schemaX.__schema).toStrictEqual({
      type: 'string',
      brand: ['x', 'y'],
      optional: true,
      default: 'x',
      minLength: 1,
      maxLength: 1,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        default: string
        minLength: number
        maxLength: number
        description: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
        default: string
        minLength: number
        maxLength: number
        description: string
      }
      // @ts-expect-error '"string"' is not assignable to type '"number"'
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

  it('string: string -> description -> maxLength -> minLength -> optional -> default -> brand', () => {
    const schemaX = string()
      .description('x')
      .maxLength(1)
      .minLength(1)
      .optional()
      .default('x')
      .brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'string',
      brand: ['x', 'y'],
      optional: true,
      default: 'x',
      minLength: 1,
      maxLength: 1,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        default: string
        minLength: number
        maxLength: number
        description: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
        default: string
        minLength: number
        maxLength: number
        description: string
      }
      // @ts-expect-error '"string"' is not assignable to type '"number"'
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
