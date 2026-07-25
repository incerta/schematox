import { describe, it, expect } from 'vitest'
import * as x from '../src/index.js'

// Coercion is a parse-time option, not a schema property — the same schema
// parses identically with and without `{ coerce: true }` unless the option
// is explicitly passed. These tests never touch `Schema`/`Infer` at all,
// which is the point: coercion only changes which raw inputs are accepted,
// never the parsed output type.
describe('coerce: off by default', () => {
  it('a schema parsed without options behaves exactly as before', () => {
    expect(x.parse({ type: 'number' }, '42').error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema: { type: 'number' } },
    ])
  })

  it('{ coerce: false } behaves the same as omitting the option', () => {
    const parsed = x.parse({ type: 'number' }, '42', { coerce: false })

    expect(parsed.error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema: { type: 'number' } },
    ])
  })
})

describe('coerce: number', () => {
  const schema = { type: 'number' } as const satisfies x.Schema

  it('accepts a numeric string', () => {
    expect(x.parse(schema, '42', { coerce: true })).toStrictEqual({
      success: true,
      data: 42,
    })
    expect(x.parse(schema, '-0.5', { coerce: true })).toStrictEqual({
      success: true,
      data: -0.5,
    })
  })

  it('accepts a boolean as 1/0', () => {
    expect(x.parse(schema, true, { coerce: true })).toStrictEqual({
      success: true,
      data: 1,
    })
    expect(x.parse(schema, false, { coerce: true })).toStrictEqual({
      success: true,
      data: 0,
    })
  })

  it('accepts a bigint', () => {
    expect(x.parse(schema, 10n, { coerce: true })).toStrictEqual({
      success: true,
      data: 10,
    })
  })

  it('rejects a non-numeric or empty string with the ordinary INVALID_TYPE error', () => {
    expect(x.parse(schema, 'abc', { coerce: true }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema },
    ])
    expect(x.parse(schema, '', { coerce: true }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema },
    ])
    expect(x.parse(schema, '   ', { coerce: true }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema },
    ])
  })

  it('applies min/max to the coerced value, not the original subject', () => {
    const bounded = { type: 'number', min: 10 } as const satisfies x.Schema

    expect(x.parse(bounded, '5', { coerce: true }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidRange, path: [], schema: bounded },
    ])
    expect(x.parse(bounded, '15', { coerce: true })).toStrictEqual({
      success: true,
      data: 15,
    })
  })

  it('rejects a bigint beyond the safe integer range instead of silently rounding it', () => {
    // 2^53 + 1 — Number(9007199254740993n) rounds to 9007199254740992,
    // a different, wrong value, if left unguarded.
    expect(
      x.parse(schema, 9007199254740993n, { coerce: true }).error
    ).toStrictEqual([{ code: x.ERROR_CODE.invalidType, path: [], schema }])

    // Within range: coerces normally.
    expect(x.parse(schema, 9007199254740991n, { coerce: true })).toStrictEqual({
      success: true,
      data: 9007199254740991,
    })

    // Astronomically large: Number(x) is already Infinity, still rejected.
    expect(x.parse(schema, 10n ** 400n, { coerce: true }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema },
    ])
  })

  it('rejects an integer string beyond the safe integer range instead of silently rounding it', () => {
    expect(
      x.parse(schema, '9007199254740993', { coerce: true }).error
    ).toStrictEqual([{ code: x.ERROR_CODE.invalidType, path: [], schema }])

    expect(x.parse(schema, '9007199254740991', { coerce: true })).toStrictEqual(
      { success: true, data: 9007199254740991 }
    )
  })
})

describe('coerce: bigint', () => {
  const schema = { type: 'bigint' } as const satisfies x.Schema

  it('accepts an integer string', () => {
    expect(x.parse(schema, '42', { coerce: true })).toStrictEqual({
      success: true,
      data: 42n,
    })
  })

  it('accepts an integer number', () => {
    expect(x.parse(schema, 42, { coerce: true })).toStrictEqual({
      success: true,
      data: 42n,
    })
  })

  it('accepts a boolean as 1n/0n', () => {
    expect(x.parse(schema, true, { coerce: true })).toStrictEqual({
      success: true,
      data: 1n,
    })
    expect(x.parse(schema, false, { coerce: true })).toStrictEqual({
      success: true,
      data: 0n,
    })
  })

  it('rejects a non-integer number or malformed string with the ordinary INVALID_TYPE error', () => {
    expect(x.parse(schema, 4.2, { coerce: true }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema },
    ])
    expect(
      x.parse(schema, 'not-a-number', { coerce: true }).error
    ).toStrictEqual([{ code: x.ERROR_CODE.invalidType, path: [], schema }])
  })
})

describe('coerce: string', () => {
  const schema = { type: 'string' } as const satisfies x.Schema

  it('accepts a number', () => {
    expect(x.parse(schema, 42, { coerce: true })).toStrictEqual({
      success: true,
      data: '42',
    })
  })

  it('accepts a boolean', () => {
    expect(x.parse(schema, true, { coerce: true })).toStrictEqual({
      success: true,
      data: 'true',
    })
  })

  it('accepts a bigint', () => {
    expect(x.parse(schema, 10n, { coerce: true })).toStrictEqual({
      success: true,
      data: '10',
    })
  })
})

describe('coerce: boolean', () => {
  const schema = { type: 'boolean' } as const satisfies x.Schema

  it('accepts only the exact strings "true"/"false", nothing else', () => {
    expect(x.parse(schema, 'true', { coerce: true })).toStrictEqual({
      success: true,
      data: true,
    })
    expect(x.parse(schema, 'false', { coerce: true })).toStrictEqual({
      success: true,
      data: false,
    })
    expect(x.parse(schema, 'TRUE', { coerce: true }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema },
    ])
    expect(x.parse(schema, 'yes', { coerce: true }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema },
    ])
  })

  it('accepts only 1/0, nothing else', () => {
    expect(x.parse(schema, 1, { coerce: true })).toStrictEqual({
      success: true,
      data: true,
    })
    expect(x.parse(schema, 0, { coerce: true })).toStrictEqual({
      success: true,
      data: false,
    })
    expect(x.parse(schema, 2, { coerce: true }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema },
    ])
  })

  it('accepts only 1n/0n, nothing else', () => {
    expect(x.parse(schema, 1n, { coerce: true })).toStrictEqual({
      success: true,
      data: true,
    })
    expect(x.parse(schema, 0n, { coerce: true })).toStrictEqual({
      success: true,
      data: false,
    })
  })
})

describe('coerce: a subject already matching the target type passes through unchanged', () => {
  it('bigint', () => {
    expect(x.parse({ type: 'bigint' }, 5n, { coerce: true })).toStrictEqual({
      success: true,
      data: 5n,
    })
  })

  it('string', () => {
    expect(
      x.parse({ type: 'string' }, 'already', { coerce: true })
    ).toStrictEqual({
      success: true,
      data: 'already',
    })
  })
})

describe('coerce: unaffected schema kinds', () => {
  it('never coerces `literal`', () => {
    const schema = { type: 'literal', of: 5 } as const satisfies x.Schema

    expect(x.parse(schema, '5', { coerce: true }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema },
    ])
  })

  it('optional/nullable short-circuit before coercion is attempted', () => {
    const schema = {
      type: 'number',
      optional: true,
      nullable: true,
    } as const satisfies x.Schema

    expect(x.parse(schema, undefined, { coerce: true })).toStrictEqual({
      success: true,
      data: undefined,
    })
    expect(x.parse(schema, null, { coerce: true })).toStrictEqual({
      success: true,
      data: null,
    })
  })
})

describe('coerce: propagates into nested/compound schemas', () => {
  it('array', () => {
    const schema = {
      type: 'array',
      of: { type: 'number' },
    } as const satisfies x.Schema

    expect(x.parse(schema, ['1', '2', '3'], { coerce: true })).toStrictEqual({
      success: true,
      data: [1, 2, 3],
    })
  })

  it('object', () => {
    const schema = {
      type: 'object',
      of: { id: { type: 'number' }, active: { type: 'boolean' } },
    } as const satisfies x.Schema

    expect(
      x.parse(schema, { id: '7', active: 'true' }, { coerce: true })
    ).toStrictEqual({
      success: true,
      data: { id: 7, active: true },
    })
  })

  it('record values are coerced, keys are unaffected (already strings)', () => {
    const schema = {
      type: 'record',
      of: { type: 'number' },
    } as const satisfies x.Schema

    expect(x.parse(schema, { a: '1', b: '2' }, { coerce: true })).toStrictEqual(
      {
        success: true,
        data: { a: 1, b: 2 },
      }
    )
  })

  it('tuple', () => {
    const schema = {
      type: 'tuple',
      of: [{ type: 'number' }, { type: 'string' }],
    } as const satisfies x.Schema

    expect(x.parse(schema, ['1', 2], { coerce: true })).toStrictEqual({
      success: true,
      data: [1, '2'],
    })
  })

  it('union: coercion applies while trying each member in order', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'boolean' }, { type: 'number' }],
    } as const satisfies x.Schema

    expect(x.parse(schema, '42', { coerce: true })).toStrictEqual({
      success: true,
      data: 42,
    })
  })

  it('deeply nested', () => {
    const schema = {
      type: 'object',
      of: { xs: { type: 'array', of: { type: 'number' } } },
    } as const satisfies x.Schema

    expect(x.parse(schema, { xs: ['1', '2'] }, { coerce: true })).toStrictEqual(
      {
        success: true,
        data: { xs: [1, 2] },
      }
    )
  })
})

describe('coerce: struct.parse accepts the same options as parse()', () => {
  it('number struct', () => {
    const struct = x.number()

    expect(struct.parse('42', { coerce: true })).toStrictEqual({
      success: true,
      data: 42,
    })
    expect(struct.parse('42').error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema: struct.__schema },
    ])
  })

  it('makeStruct construct', () => {
    const construct = x.makeStruct({ type: 'number' } as const)

    expect(construct.parse('42', { coerce: true })).toStrictEqual({
      success: true,
      data: 42,
    })
  })

  it('nested struct', () => {
    const struct = x.object({ id: x.number() })

    expect(struct.parse({ id: '9' }, { coerce: true })).toStrictEqual({
      success: true,
      data: { id: 9 },
    })
  })
})
