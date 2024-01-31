import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../../error'

import { parse } from '../../general-schema-parser'
import { validate } from '../../general-schema-validator'

import { array } from '../../programmatic-schema/array'
import { object } from '../../programmatic-schema/object'

import { string } from '../../programmatic-schema/string'
import { number } from '../../programmatic-schema/number'
import { boolean } from '../../programmatic-schema/boolean'
import { stringUnion } from '../../programmatic-schema/string-union'
import { numberUnion } from '../../programmatic-schema/number-union'

describe('Object schema programmatic definition', () => {
  it('object: required object with nested structure', () => {
    const schemaX = object({
      x: string(),
      y: boolean().optional().default(false),
      z: object({
        x: number().min(1),
        y: object({
          x: number().max(2),
          y: object({
            x: number(),
          }),
        }),
      }),
    })

    expect(schemaX.__schema).toStrictEqual({
      type: 'object',
      of: {
        x: { type: 'string' },
        y: { type: 'boolean', optional: true, default: false },
        z: {
          type: 'object',
          of: {
            x: { type: 'number', min: 1 },
            y: {
              type: 'object',
              of: {
                x: { type: 'number', max: 2 },
                y: {
                  type: 'object',
                  of: {
                    x: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    })

    const subject = {
      x: 'xValue',
      y: undefined,
      z: {
        x: 1,
        y: {
          x: 2,
          y: {
            x: 0,
          },
        },
      },
    }

    expect(parse(schemaX.__schema, subject).data).toStrictEqual({
      x: 'xValue',
      y: false,
      z: {
        x: 1,
        y: {
          x: 2,
          y: {
            x: 0,
          },
        },
      },
    })

    expect(parse(schemaX.__schema, subject).error).toBe(undefined)

    expect(validate(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).error).toStrictEqual(undefined)
  })

  it('object: optional object', () => {
    const schemaX = object({
      x: string(),
    }).optional()

    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, null).data).toBe(undefined)
    expect(parse(schemaX.__schema, null).error).toBe(undefined)

    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined
    )
  })

  it('object: optional -> description', () => {
    const schemaX = object({
      x: string(),
    })
      .optional()
      .description('x')

    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, null).data).toBe(undefined)
    expect(parse(schemaX.__schema, null).error).toBe(undefined)

    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined
    )

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined
    )
  })

  it('object: description -> optional', () => {
    const schemaX = object({
      x: string(),
    })
      .description('x')
      .optional()

    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, null).data).toBe(undefined)
    expect(parse(schemaX.__schema, null).error).toBe(undefined)

    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined
    )

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined
    )
  })

  it('array: nested object structure', () => {
    const schemaX = object({
      x: array(
        object({
          a: number(),
          b: string(),
          c: boolean(),
          e: stringUnion('x'),
          f: numberUnion(0),

          g: array(
            object({
              a: number(),
              b: string(),
              c: boolean(),
            })
          ),
        })
      ),
    })

    const nestedSubject = {
      a: 0,
      b: 'x',
      c: true,
      e: 'x' as const,
      f: 0 as const,

      g: [{ a: 0, b: 'x', c: false }],
    }

    const subject = { x: [nestedSubject, nestedSubject, nestedSubject] }

    expect(parse(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(parse(schemaX.__schema, subject).error).toBe(undefined)

    expect(validate(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).error).toBe(undefined)
  })
})
