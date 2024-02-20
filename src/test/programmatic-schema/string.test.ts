import { parse } from '../../general-schema-parser'
import { validate } from '../../general-schema-validator'
import { string } from '../../programmatic-schema'
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

    // @ts-expect-error Property 'brand' does not exist on type
    expect(() => schemaX.brand('x', 'y')).not.toThrow()
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

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).not.toThrow()
  })

  it('string: string -> brand -> optional -> default -> minLength', () => {
    const schemaX = string().brand('x', 'y').optional().minLength(1)

    expect(schemaX.__schema).toStrictEqual({
      type: 'string',
      brand: ['x', 'y'],
      optional: true,
      minLength: 1,
    })

    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        minLength: number
      }
    }>(unknownX as typeof schemaX)

    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
        minLength: number
      }
      // @ts-expect-error '"string"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 'x').data).toBe('x')
    expect(parse(schemaX.__schema, 'x').error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error 'minLength' does not exist
    expect(() => schemaX.minLength(1)).not.toThrow()
  })

  it('string: string -> brand -> optional -> minLength -> maxLength', () => {
    const schemaX = string()
      .brand('x', 'y')
      .optional()
      .minLength(1)
      .maxLength(1)

    expect(schemaX.__schema).toStrictEqual({
      type: 'string',
      brand: ['x', 'y'],
      optional: true,
      minLength: 1,
      maxLength: 1,
    })

    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        minLength: number
        maxLength: number
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
        minLength: number
        maxLength: number
      }
      // @ts-expect-error '"string"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 'x').data).toBe('x')
    expect(parse(schemaX.__schema, 'x').error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'maxLength' does not exist
    expect(() => schemaX.maxLength(1)).not.toThrow()
  })

  it('string: string -> brand -> optional -> minLength -> maxLength -> description', () => {
    const schemaX = string()
      .brand('x', 'y')
      .optional()
      .minLength(1)
      .maxLength(1)
      .description('x')

    expect(schemaX.__schema).toStrictEqual({
      type: 'string',
      brand: ['x', 'y'],
      optional: true,
      minLength: 1,
      maxLength: 1,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
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
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).not.toThrow()
  })

  it('string: string -> description -> maxLength -> minLength -> optional -> brand', () => {
    const schemaX = string()
      .description('x')
      .maxLength(1)
      .minLength(1)
      .optional()
      .brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'string',
      brand: ['x', 'y'],
      optional: true,
      minLength: 1,
      maxLength: 1,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
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
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).not.toThrow()
  })
})

describe('Validate/parse/guard using struct', () => {
  it('string: parse', () => {
    expect(string().parse('x').data).toBe('x')
    expect(string().parse('x').error).toBe(undefined)

    expect(string().parse(undefined).data).toBe(undefined)
    expect(string().parse(undefined).error).toBeTruthy()
  })

  it('string: validate', () => {
    expect(string().validate('x').data).toBe('x')
    expect(string().validate('x').error).toBe(undefined)

    expect(string().validate(undefined).data).toBe(undefined)
    expect(string().validate(undefined).error).toBeTruthy()
  })

  it('string: guard', () => {
    const struct = string()
    const subj: unknown = 'x'
    const guard = struct.guard(subj)

    if (guard) {
      check<string>(subj)
      // @ts-expect-error 'string' is not assignable to parameter of type 'number'
      check<number>(subj)
    }
  })
})
