import { parse } from '../../general-schema-parser'
import { validate } from '../../general-schema-validator'
import { stringUnion } from '../../programmatic-schema/string-union'
import { check, unknownX } from '../test-utils'

describe('String union schema programmatic definition', () => {
  it('stringUnion: should require at least one argument specified', () => {
    // @ts-expect-error Expected at least 1 arguments
    expect(() => stringUnion()).not.toThrow()
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
    expect(validate(schemaX.__schema, 'x').data).toBe('x')
    expect(validate(schemaX.__schema, 'x').error).toBe(undefined)

    // @ts-expect-error Property 'brand' does not exist on type
    expect(() => schemaX.brand('x', 'y')).not.toThrow()
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
    expect(validate(schemaX.__schema, 'x').data).toBe('x')
    expect(validate(schemaX.__schema, 'x').error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).not.toThrow()
  })

  it('stringUnion: stringUnion -> brand -> optional -> default -> description', () => {
    const schemaX = stringUnion('x', 'y')
      .brand('x', 'y')
      .optional()
      .description('x')

    expect(schemaX.__schema).toStrictEqual({
      type: 'stringUnion',
      of: ['x', 'y'],
      brand: ['x', 'y'],
      optional: true,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'stringUnion'
        of: Readonly<Array<'x' | 'y'>>
        brand: Readonly<['x', 'y']>
        optional: true
        description: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        of: Readonly<Array<'x' | 'y'>>
        brand: Readonly<['x', 'y']>
        optional: true
        description: string
      }
      // @ts-expect-error '"stringUnion"' is not assignable to type '"number"'
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

  it('stringUnion: stringUnion -> description -> optional -> brand', () => {
    const schemaX = stringUnion('x', 'y')
      .description('x')
      .optional()
      .brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'stringUnion',
      of: ['x', 'y'],
      brand: ['x', 'y'],
      optional: true,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'stringUnion'
        of: Readonly<Array<'x' | 'y'>>
        brand: Readonly<['x', 'y']>
        optional: true
        description: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        of: Readonly<Array<'x' | 'y'>>
        brand: Readonly<['x', 'y']>
        optional: true
        description: string
      }
      // @ts-expect-error '"stringUnion"' is not assignable to type '"number"'
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
  it('stringUnion: parse', () => {
    expect(stringUnion('x', 'y').parse('x').data).toBe('x')
    expect(stringUnion('x', 'y').parse('x').error).toBe(undefined)

    expect(stringUnion('x', 'y').parse(undefined).data).toBe(undefined)
    expect(stringUnion('x', 'y').parse(undefined).error).toBeTruthy()
  })

  it('stringUnion: validate', () => {
    expect(stringUnion('x', 'y').validate('x').data).toBe('x')
    expect(stringUnion('x', 'y').validate('x').error).toBe(undefined)

    expect(stringUnion('x', 'y').validate(undefined).data).toBe(undefined)
    expect(stringUnion('x', 'y').validate(undefined).error).toBeTruthy()
  })

  it('stringUnion: guard', () => {
    const struct = stringUnion('x', 'y')
    const subj: unknown = 'x'
    const guard = struct.guard(subj)

    if (guard) {
      check<'x' | 'y'>(subj)
      // @ts-expect-error '"x" | "y"' is not assignable to parameter of type '"x"'
      check<'x'>(subj)
    }
  })
})
