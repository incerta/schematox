import { check } from './test-utils'
import { parse } from '../parse'
import { array, object, string, number, boolean, literal } from '../struct'

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

    expect(parse(schemaX.__schema, subject).right).toStrictEqual({
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

    expect(parse(schemaX.__schema, subject).left).toBe(undefined)
  })

  it('object: max depth', () => {
    const schema = object({
      1: object({
        2: object({
          3: object({
            4: object({
              5: object({
                6: object({
                  7: object({
                    8: object({
                      9: object({
                        10: object({
                          11: object({ 12: object({ x: string() }) }),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    })

    const valid = {
      1: {
        2: {
          3: {
            4: {
              5: { 6: { 7: { 8: { 9: { 10: { 11: { 12: { x: 'x' } } } } } } } },
            },
          },
        },
      },
    }

    const validParsedEither = schema.parse(valid)

    if (validParsedEither.left) {
      throw Error('Not expected parsing error')
    }

    expect(validParsedEither.right).toStrictEqual(valid)

    const invalid = {
      0: {
        1: {
          2: {
            3: {
              4: { 5: { 6: { 7: { 8: { 9: { 10: {} } } } } } },
            },
          },
        },
      },
    }

    const invalidParsedEither = schema.parse(invalid)

    if (invalidParsedEither.right) {
      throw Error('Success result is not expected')
    }

    expect(invalidParsedEither.left).toBeTruthy()
  })

  it('object: optional object', () => {
    const schemaX = object({
      x: string(),
    }).optional()

    expect(parse(schemaX.__schema, undefined).right).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).left).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).not.toThrow()
  })

  it('object: optional -> description', () => {
    const schemaX = object({
      x: string(),
    })
      .optional()
      .description('x')

    expect(parse(schemaX.__schema, undefined).right).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).left).toBe(undefined)

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

    expect(parse(schemaX.__schema, undefined).right).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).left).toBe(undefined)

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

    expect(parse(schemaX.__schema, subject).right).toStrictEqual(subject)
    expect(parse(schemaX.__schema, subject).left).toBe(undefined)
  })
})

describe('Check type inference and parse/validate/guard struct method', () => {
  const struct = object({ x: string(), y: number() })
  const subject = { x: 'x', y: 0 }

  it('object: parse', () => {
    const result = struct.parse(subject)

    if (!result.left) {
      check<{ x: string; y: number }>(result.right)
      // @ts-expect-error '{ x: string; y: number; }' is not '{ x: string; y: number; z: boolean; }'
      check<{ x: string; y: number; z: boolean }>(result.right)
    }

    expect(result.right).toStrictEqual(subject)
    expect(result.left).toBeUndefined()
  })

  it('object: nested optionality', () => {
    const struct = object({ x: string(), y: string().optional() })
    const result = struct.parse({ x: '' })

    if (result.right) {
      type Expected = { x: string; y?: string | undefined }
      type Actual = typeof result.right

      check<Expected, Actual>()
      check<Actual, Expected>()
    }
  })
})
