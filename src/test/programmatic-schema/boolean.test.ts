import { parse } from '../../general-schema-parser'
import { validate } from '../../general-schema-validator'
import { boolean } from '../../programmatic-schema'
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
    expect(validate(schemaX.__schema, false).data).toBe(false)

    // @ts-expect-error Property 'brand' does not exist on type
    expect(() => schemaX.brand('x', 'y')).not.toThrow()
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
    expect(validate(schemaX.__schema, true).data).toBe(true)
    expect(validate(schemaX.__schema, true).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).not.toThrow()
  })

  it('boolean: boolean -> brand -> optional -> description', () => {
    const schemaX = boolean().brand('x', 'y').optional().description('x')

    expect(schemaX.__schema).toStrictEqual({
      type: 'boolean',
      brand: ['x', 'y'],
      optional: true,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'boolean'
        brand: Readonly<['x', 'y']>
        optional: true
        description: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        description: string
      }
      // @ts-expect-error '"boolean"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, false).data).toBe(false)
    expect(parse(schemaX.__schema, false).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).not.toThrow()
  })

  it('boolean: boolean -> description -> optional -> brand', () => {
    const schemaX = boolean().description('x').optional().brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'boolean',
      brand: ['x', 'y'],
      optional: true,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'boolean'
        brand: Readonly<['x', 'y']>
        optional: true
        description: string
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'string'
        brand: Readonly<['x', 'y']>
        optional: true
        description: string
      }
      // @ts-expect-error '"boolean"' is not assignable to type '"string"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, true).data).toBe(true)
    expect(parse(schemaX.__schema, true).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).not.toThrow()
  })
})

describe('Validate/parse/guard using struct', () => {
  it('boolean: parse', () => {
    expect(boolean().parse(true).data).toBe(true)
    expect(boolean().parse(true).error).toBe(undefined)

    expect(boolean().parse(undefined).data).toBe(undefined)
    expect(boolean().parse(undefined).error).toBeTruthy()
  })

  it('boolean: validate', () => {
    expect(boolean().validate(true).data).toBe(true)
    expect(boolean().validate(true).error).toBe(undefined)

    expect(boolean().validate(undefined).data).toBe(undefined)
    expect(boolean().validate(undefined).error).toBeTruthy()
  })

  it('boolean: guard', () => {
    const struct = boolean()
    const subj: unknown = true
    const guard = struct.guard(subj)

    if (guard) {
      check<boolean>(subj)
      // @ts-expect-error 'boolean' is not assignable to parameter of type 'string'
      check<string>(subj)
    }
  })
})
