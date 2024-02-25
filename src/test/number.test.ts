import { parse } from '../../parse'
import { validate } from '../../validate'
import { number } from '../../programmatic-schema'
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

    // @ts-expect-error Property 'brand' does not exist on type
    expect(() => schemaX.brand('x', 'y')).not.toThrow()
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
    expect(validate(schemaX.__schema, 0).data).toBe(0)
    expect(validate(schemaX.__schema, 0).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).not.toThrow()
  })

  it('number: number -> brand -> optional -> min', () => {
    const schemaX = number().brand('x', 'y').optional().min(1)

    expect(schemaX.__schema).toStrictEqual({
      type: 'number',
      brand: ['x', 'y'],
      optional: true,
      min: 1,
    })

    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
        min: number
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        min: number
      }
      // @ts-expect-error '"number"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 1).data).toBe(1)
    expect(parse(schemaX.__schema, 1).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error 'min' does not exist
    expect(() => schemaX.min(1)).not.toThrow()
  })

  it('number: number -> brand -> optional -> min -> max', () => {
    const schemaX = number().brand('x', 'y').optional().min(1).max(1)

    expect(schemaX.__schema).toStrictEqual({
      type: 'number',
      brand: ['x', 'y'],
      optional: true,
      min: 1,
      max: 1,
    })

    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
        min: number
        max: number
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        min: number
        max: number
      }
      // @ts-expect-error '"number"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, 1).data).toBe(1)
    expect(parse(schemaX.__schema, 1).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'max' does not exist
    expect(() => schemaX.max(1)).not.toThrow()
  })

  it('number: number -> brand -> optional -> min -> max -> description', () => {
    const schemaX = number()
      .brand('x', 'y')
      .optional()
      .min(1)
      .max(1)
      .description('x')

    expect(schemaX.__schema).toStrictEqual({
      type: 'number',
      brand: ['x', 'y'],
      optional: true,
      min: 1,
      max: 1,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
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

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).not.toThrow()
  })

  it('number: number -> description -> max -> min -> optional -> brand', () => {
    const schemaX = number()
      .description('x')
      .max(1)
      .min(1)
      .optional()
      .brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'number',
      brand: ['x', 'y'],
      optional: true,
      min: 1,
      max: 1,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
        optional: true
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

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).not.toThrow()
  })
})

describe('Parse/validate/guard using struct', () => {
  it('number: parse', () => {
    expect(number().parse(0).data).toBe(0)
    expect(number().parse(0).error).toBe(undefined)

    expect(number().parse(undefined).data).toBe(undefined)
    expect(number().parse(undefined).error).toBeTruthy()
  })

  it('number: validate', () => {
    expect(number().validate(0).data).toBe(0)
    expect(number().validate(0).error).toBe(undefined)

    expect(number().validate(undefined).data).toBe(undefined)
    expect(number().validate(undefined).error).toBeTruthy()
  })

  it('number: guard', () => {
    const struct = number()
    const subj: unknown = 0
    const guard = struct.guard(subj)

    if (guard) {
      check<number>(subj)
      // @ts-expect-error 'number' is not assignable to parameter of type 'boolean'
      check<boolean>(subj)
    }
  })
})
