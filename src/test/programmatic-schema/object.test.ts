import { check } from '../test-utils'

import { parse } from '../../general-schema-parser'
import { validate } from '../../validate'

import {
  array,
  object,
  string,
  number,
  boolean,
  literal,
} from '../../programmatic-schema'

describe('Object schema programmatic definition', () => {
  it('object: required object with nested structure', () => {
    const schemaX = object({
      x: string(),
      y: boolean().optional(),
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
        y: { type: 'boolean', optional: true },
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

    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).not.toThrow()
  })

  it('object: optional -> description', () => {
    const schemaX = object({
      x: string(),
    })
      .optional()
      .description('x')

    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).not.toThrow()

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).not.toThrow()
  })

  it('object: description -> optional', () => {
    const schemaX = object({
      x: string(),
    })
      .description('x')
      .optional()

    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)

    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).not.toThrow()

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).not.toThrow()
  })

  it('array: nested object structure', () => {
    const schemaX = object({
      x: array(
        object({
          a: number(),
          b: string(),
          c: boolean(),
          e: literal('x'),
          f: literal(0),

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

describe('Check type inference and parse/validate/guard struct method', () => {
  const struct = object({ x: string(), y: number() })
  const subject = { x: 'x', y: 0 }

  it('object: parse', () => {
    const result = struct.parse(subject)

    if (!result.error) {
      check<{ x: string; y: number }>(result.data)
      // @ts-expect-error '{ x: string; y: number; }' is not '{ x: string; y: number; z: boolean; }'
      check<{ x: string; y: number; z: boolean }>(result.data)
    }

    expect(result.data).toStrictEqual(subject)
    expect(result.error).toBeUndefined()
  })

  it('object: validate', () => {
    const result = struct.validate(subject)

    if (!result.error) {
      check<{ x: string; y: number }>(result.data)
      // @ts-expect-error '{ x: string; y: number; }' is not '{ x: string; y: number; z: boolean; }'
      check<{ x: string; y: number; z: boolean }>(result.data)
    }

    expect(result.data).toStrictEqual(subject)
    expect(result.error).toBeUndefined()
  })

  it('object: guard', () => {
    const result = struct.guard(subject)

    expect(result).toBe(true)

    if (result) {
      check<{ x: string; y: number }>(subject)
      // @ts-expect-error '{ x: string; y: number; }' is not '{ x: string; y: number; z: boolean; }'
      check<{ x: string; y: number; z: boolean }>(subject)
      return
    }

    throw Error('Not expected')
  })
})
