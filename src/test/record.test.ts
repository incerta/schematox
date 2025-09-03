import { check } from './test-utils'
import { parse } from '../parse'
import {
  array,
  object,
  string,
  number,
  boolean,
  literal,
  record,
} from '../struct'

describe('Record schema programmatic definition', () => {
  it('record: required record with nested structure', () => {
    const struct = record(object({ x: string() }))

    expect(struct.__schema).toStrictEqual({
      type: 'record',
      key: { type: 'string' },
      of: {
        type: 'object',
        of: {
          x: { type: 'string' },
        },
      },
    })

    const subject = {
      a: { x: 'a:x' },
      b: { x: 'b:x' },
    } as unknown

    const parsed = parse(struct.__schema, subject)

    expect(parsed.left).toBe(undefined)
    expect(parsed.right === subject).toBe(false)

    const validated = parse(struct.__schema, subject)

    expect(validated.left).toBe(undefined)
    expect(validated.right === subject).toBe(false)
  })

  it('record: optional record', () => {
    const struct = record(string()).optional()

    expect(struct.__schema).toStrictEqual({
      type: 'record',
      key: { type: 'string' },
      of: { type: 'string' },
      optional: true,
    })

    const subject = undefined as unknown

    const parsed = parse(struct.__schema, subject)

    expect(parsed.left).toBe(undefined)
  })

  it('record: optional -> description', () => {
    const struct = record(string()).optional().description('x')

    expect(struct.__schema).toStrictEqual({
      type: 'record',
      key: { type: 'string' },
      of: { type: 'string' },
      optional: true,
      description: 'x',
    })

    expect(parse(struct.__schema, undefined).right).toBe(undefined)
    expect(parse(struct.__schema, undefined).left).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => struct.optional()).not.toThrow()

    // @ts-expect-error Property 'description' does not exist
    expect(() => struct.description('x')).not.toThrow()
  })

  it('record: description -> optional', () => {
    const struct = record(string()).description('x').optional()

    expect(struct.__schema).toStrictEqual({
      type: 'record',
      key: { type: 'string' },
      of: { type: 'string' },
      optional: true,
      description: 'x',
    })

    expect(parse(struct.__schema, undefined).right).toBe(undefined)
    expect(parse(struct.__schema, undefined).left).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => struct.optional()).not.toThrow()

    // @ts-expect-error Property 'description' does not exist
    expect(() => struct.description('x')).not.toThrow()
  })

  it('record: nested object structure', () => {
    const schemaX = record(
      object({
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
    )

    const nestedSubj = {
      x: [
        {
          a: 0,
          b: 'x',
          c: true,
          e: 'x' as const,
          f: 0 as const,

          g: [{ a: 0, b: 'x', c: false }],
        },
      ],
    }

    const subject = { x: nestedSubj, y: nestedSubj, z: nestedSubj }

    expect(parse(schemaX.__schema, subject).left).toBe(undefined)
    expect(parse(schemaX.__schema, subject).right).toStrictEqual(subject)
  })
})

describe('Check type inference and parse/validate/guard struct method', () => {
  const struct = record(object({ x: string(), y: number() }))
  const subject = {
    x: { x: 'xx', y: 0 },
    y: { x: 'yx', y: 1 },
  }

  it('record: parse', () => {
    const parsed = struct.parse(subject)

    if (!parsed.left) {
      check<Record<string, { x: string; y: number } | undefined>>(parsed.right)
      check<Record<string, { x: string; y: number; z: boolean } | undefined>>(
        // @ts-expect-error '{ x: string; y: number; } | undefined' is not '{ x: string; y: number; z: boolean; } | undefined'
        parsed.right
      )
    }

    expect(parsed.right).toStrictEqual(subject)
    expect(parsed.left).toBeUndefined()
  })

  it('record: nested nullability', () => {
    const struct = record(string().nullable())
    const parsed = struct.parse({})

    if (parsed.right) {
      type Expected = Record<string, string | null>
      type Actual = typeof parsed.right

      check<Expected, Actual>()
      check<Actual, Expected>()
    }
  })
})
