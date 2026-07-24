import { describe, it, expect } from 'vitest'
import * as x from '../src/index.js'

// Schemas are plain data and may come from an untyped external source (JSON,
// a database) that TypeScript's `satisfies Schema` never actually checked —
// `parse()` must report a malformed schema like anything else, never throw.
describe('parse() never throws, even when the schema itself is malformed', () => {
  it('rejects a schema that is not a plain object, at any nesting depth', () => {
    const malformedSchemas: unknown[] = [
      null,
      undefined,
      'garbage',
      42,
      [],
      {},
      { type: 'not-a-real-type' },
    ]

    for (const schema of malformedSchemas) {
      expect(() => x.parse(schema as never, 'x')).not.toThrow()

      const parsed = x.parse(schema as never, 'x')

      expect(parsed.error).toStrictEqual([
        {
          code: x.ERROR_CODE.invalidSchema,
          path: [],
          schema,
        },
      ])
    }
  })

  it('rejects a malformed schema nested inside a compound schema, at its own path', () => {
    const schema = {
      type: 'object',
      of: { a: {} },
    } as never

    const parsed = x.parse(schema, { a: 1 })

    expect(parsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: ['a'],
        schema: {},
      },
    ])
  })

  it('rejects a record key schema that is malformed, without discarding it as a value error', () => {
    const schema = {
      type: 'record',
      of: { type: 'string' },
      key: { type: 'bad' },
    } as never

    const parsed = x.parse(schema, { a: 'x' })

    expect(parsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: ['a'],
        schema: { type: 'bad' },
      },
    ])
  })

  it('rejects a bigint schema whose min/max is not a valid bigint string, instead of letting BigInt() throw', () => {
    expect(() =>
      x.parse({ type: 'bigint', min: 'not-a-bigint' } as never, 5n)
    ).not.toThrow()

    const minParsed = x.parse(
      { type: 'bigint', min: 'not-a-bigint' } as never,
      5n
    )

    expect(minParsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: [],
        schema: { type: 'bigint', min: 'not-a-bigint' },
      },
    ])

    const maxParsed = x.parse({ type: 'bigint', max: 'nope' } as never, 5n)

    expect(maxParsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: [],
        schema: { type: 'bigint', max: 'nope' },
      },
    ])
  })

  it('rejects a tuple schema whose `of` is not an array', () => {
    const schema = { type: 'tuple', of: 'nope' } as never

    expect(() => x.parse(schema, ['a'])).not.toThrow()

    const parsed = x.parse(schema, ['a'])

    expect(parsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: [],
        schema: { type: 'tuple', of: 'nope' },
      },
    ])
  })

  it('rejects a union schema whose `of` is not an array', () => {
    const schema = { type: 'union', of: 42 } as never

    expect(() => x.parse(schema, 'x')).not.toThrow()

    const parsed = x.parse(schema, 'x')

    expect(parsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: [],
        schema: { type: 'union', of: 42 },
      },
    ])
  })
})

// Previously these silently skipped the constraint instead of enforcing it
// or flagging the schema — a schema-authoring mistake (e.g. min: '5' where
// a number was expected) went unnoticed rather than being reported.
describe('a min/max/minLength/maxLength of the wrong type is a schema error, not silently ignored', () => {
  it('bigint: min/max must be a string (BigIntString), not any other type', () => {
    const minParsed = x.parse({ type: 'bigint', min: 5 } as never, 3n)

    expect(minParsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: [],
        schema: { type: 'bigint', min: 5 },
      },
    ])

    const maxParsed = x.parse({ type: 'bigint', max: 5 } as never, 3n)

    expect(maxParsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: [],
        schema: { type: 'bigint', max: 5 },
      },
    ])
  })

  it('number: min/max must be a number', () => {
    const minParsed = x.parse({ type: 'number', min: '5' } as never, 3)

    expect(minParsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: [],
        schema: { type: 'number', min: '5' },
      },
    ])

    const maxParsed = x.parse({ type: 'number', max: '5' } as never, 10)

    expect(maxParsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: [],
        schema: { type: 'number', max: '5' },
      },
    ])
  })

  it('string: minLength/maxLength must be a number', () => {
    const minParsed = x.parse({ type: 'string', minLength: '5' } as never, 'a')

    expect(minParsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: [],
        schema: { type: 'string', minLength: '5' },
      },
    ])

    const maxParsed = x.parse(
      { type: 'string', maxLength: '5' } as never,
      'abcdefgh'
    )

    expect(maxParsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: [],
        schema: { type: 'string', maxLength: '5' },
      },
    ])
  })

  it('array: minLength/maxLength must be a number', () => {
    const schemaOf = { type: 'boolean' } as const

    const minParsed = x.parse(
      { type: 'array', of: schemaOf, minLength: '1' } as never,
      []
    )

    expect(minParsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: [],
        schema: { type: 'array', of: schemaOf, minLength: '1' },
      },
    ])

    const maxParsed = x.parse(
      { type: 'array', of: schemaOf, maxLength: '1' } as never,
      [true, true, true]
    )

    expect(maxParsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: [],
        schema: { type: 'array', of: schemaOf, maxLength: '1' },
      },
    ])
  })

  it('record: minLength/maxLength must be a number', () => {
    const schemaOf = { type: 'string' } as const

    const minParsed = x.parse(
      { type: 'record', of: schemaOf, minLength: '1' } as never,
      {}
    )

    expect(minParsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: [],
        schema: { type: 'record', of: schemaOf, minLength: '1' },
      },
    ])

    const maxParsed = x.parse(
      { type: 'record', of: schemaOf, maxLength: '1' } as never,
      { a: 'x', b: 'y' }
    )

    expect(maxParsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: [],
        schema: { type: 'record', of: schemaOf, maxLength: '1' },
      },
    ])
  })

  it('a constraint that is simply absent is not an error (only present-but-wrong-type is)', () => {
    expect(x.parse({ type: 'number' }, 42).error).toBe(undefined)
    expect(x.parse({ type: 'string' }, 'x').error).toBe(undefined)
    expect(
      x.parse({ type: 'array', of: { type: 'boolean' } }, [true]).error
    ).toBe(undefined)
  })
})
