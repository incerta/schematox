import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../../error'
import { parse } from '../../general-schema-parser'
import { validate } from '../../general-schema-validator'
import { buffer } from '../../programmatic-schema/buffer'
import { check, unknownX } from '../test-utils'

describe('Buffer schema programmatic definition', () => {
  it('buffer: required buffer', () => {
    const schemaX = buffer()

    expect(schemaX.__schema).toStrictEqual({
      type: 'buffer',
    })

    check<{ type: 'buffer' }>(unknownX as typeof schemaX.__schema)
    // @ts-expect-error '{ readonly type: "buffer"; }' is not '{ type: "number"; }'
    check<{ type: 'number' }>(unknownX as typeof schemaX.__schema)

    expect(parse(schemaX.__schema, Buffer.from('x')).data).toStrictEqual(
      Buffer.from('x')
    )
    expect(parse(schemaX.__schema, Buffer.from('x')).error).toBe(undefined)
    expect(validate(schemaX.__schema, Buffer.from('x')).data).toStrictEqual(
      Buffer.from('x')
    )
    expect(validate(schemaX.__schema, Buffer.from('x')).error).toBe(undefined)
  })

  it('buffer: buffer -> brand', () => {
    const schemaX = buffer().brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'buffer',
      brand: ['x', 'y'],
    })

    check<{
      __schema: {
        type: 'buffer'
        brand: Readonly<['x', 'y']>
      }
    }>(unknownX as typeof schemaX)
    check<{
      __schema: {
        type: 'number'
        brand: Readonly<['x', 'y']>
      }
      // @ts-expect-error '"buffer"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, Buffer.from('x')).data).toStrictEqual(
      Buffer.from('x')
    )
    expect(parse(schemaX.__schema, Buffer.from('x')).error).toBe(undefined)
    expect(
      validate(schemaX.__schema, Buffer.from('x') as Buffer & { __x: 'y' }).data
    ).toStrictEqual(Buffer.from('x'))
    // @ts-expect-error 'Buffer' is not '{ __x: "y"; } & Buffer'
    expect(validate(schemaX.__schema, Buffer.from('x')).error).toBe(undefined)

    // @ts-expect-error Property 'brand' does not exist on type
    expect(() => schemaX.brand('x', 'y')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.brandDefined
    )
  })

  it('buffer: buffer -> brand -> optional', () => {
    const schemaX = buffer().brand('x', 'y').optional()

    expect(schemaX.__schema).toStrictEqual({
      type: 'buffer',
      brand: ['x', 'y'],
      optional: true,
    })

    check<{
      __schema: {
        type: 'buffer'
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
      // @ts-expect-error '"buffer"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, Buffer.from('x')).data).toStrictEqual(
      Buffer.from('x')
    )
    expect(parse(schemaX.__schema, Buffer.from('x')).error).toBe(undefined)
    expect(
      validate(schemaX.__schema, Buffer.from('x') as Buffer & { __x: 'y' }).data
    ).toStrictEqual(Buffer.from('x'))
    // @ts-expect-error 'Buffer' is not '{ __x: "y"; } & Buffer'
    expect(validate(schemaX.__schema, Buffer.from('x')).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined
    )
  })

  it('buffer: buffer -> brand -> optional -> minLength', () => {
    const schemaX = buffer().brand('x', 'y').optional().minLength(1)

    expect(schemaX.__schema).toStrictEqual({
      type: 'buffer',
      brand: ['x', 'y'],
      optional: true,
      minLength: 1,
    })

    check<{
      __schema: {
        type: 'buffer'
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
      // @ts-expect-error '"buffer"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, Buffer.from('x')).data).toStrictEqual(
      Buffer.from('x')
    )
    expect(parse(schemaX.__schema, Buffer.from('x')).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'minLength' does not exist
    expect(() => schemaX.minLength(1)).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.minLengthDefined
    )
  })

  it('buffer: buffer -> brand -> optional -> minLength -> maxLength', () => {
    const schemaX = buffer()
      .brand('x', 'y')
      .optional()
      .minLength(1)
      .maxLength(1)

    expect(schemaX.__schema).toStrictEqual({
      type: 'buffer',
      brand: ['x', 'y'],
      optional: true,
      minLength: 1,
      maxLength: 1,
    })

    check<{
      __schema: {
        type: 'buffer'
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
      // @ts-expect-error '"buffer"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, Buffer.from('x')).data).toStrictEqual(
      Buffer.from('x')
    )
    expect(parse(schemaX.__schema, Buffer.from('x')).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'maxLength' does not exist
    expect(() => schemaX.maxLength(1)).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.maxLengthDefined
    )
  })

  it('buffer: buffer -> brand -> optional -> minLength -> maxLength -> description', () => {
    const schemaX = buffer()
      .brand('x', 'y')
      .optional()
      .minLength(1)
      .maxLength(1)
      .description('x')

    expect(schemaX.__schema).toStrictEqual({
      type: 'buffer',
      brand: ['x', 'y'],
      optional: true,
      minLength: 1,
      maxLength: 1,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'buffer'
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
      // @ts-expect-error '"buffer"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, Buffer.from('x')).data).toStrictEqual(
      Buffer.from('x')
    )
    expect(parse(schemaX.__schema, Buffer.from('x')).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined
    )
  })

  it('buffer: buffer -> description -> maxLength -> minLength -> optional -> brand', () => {
    const schemaX = buffer()
      .description('x')
      .maxLength(1)
      .minLength(1)
      .optional()
      .brand('x', 'y')

    expect(schemaX.__schema).toStrictEqual({
      type: 'buffer',
      brand: ['x', 'y'],
      optional: true,
      minLength: 1,
      maxLength: 1,
      description: 'x',
    })

    check<{
      __schema: {
        type: 'buffer'
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
      // @ts-expect-error '"buffer"' is not assignable to type '"number"'
    }>(unknownX as typeof schemaX)

    expect(parse(schemaX.__schema, Buffer.from('x')).data).toStrictEqual(
      Buffer.from('x')
    )
    expect(parse(schemaX.__schema, Buffer.from('x')).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined
    )
  })
})
