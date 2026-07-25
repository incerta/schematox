import { describe, it, expect } from 'vitest'
import * as x from '../src/index.js'

// Custom coercers are a struct/parser feature, same as the built-in table —
// they never touch the schema. `withCoercer` is a free function (not a
// `.coercer()` chain method) specifically so it doesn't add a new key to
// every struct's public shape; see its doc comment in src/struct.ts.
describe('withCoercer: gated behind { coerce: true }, same as the built-in table', () => {
  it('does nothing when coerce is omitted or false', () => {
    const struct = x.withCoercer(x.string(), () => 'always this')

    expect(struct.parse('x')).toStrictEqual({ success: true, data: 'x' })
    expect(struct.parse('x', { coerce: false })).toStrictEqual({
      success: true,
      data: 'x',
    })
  })

  it('runs when coerce is true', () => {
    const struct = x.withCoercer(x.string(), () => 'replaced')

    expect(struct.parse('x', { coerce: true })).toStrictEqual({
      success: true,
      data: 'replaced',
    })
  })

  it('a coercer that returns the subject unchanged falls through to the ordinary error', () => {
    const struct = x.withCoercer(x.number(), (s) => s)

    expect(struct.parse('abc', { coerce: true }).error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidType,
        path: [],
        schema: struct.__schema,
      },
    ])
  })
})

describe('withCoercer: runs before the built-in table, so the two compose', () => {
  it('a custom coercer can pre-process, then the built-in string→number still applies', () => {
    const price = x.withCoercer(x.number(), (s) =>
      typeof s === 'string' && s.startsWith('$') ? s.slice(1) : s
    )

    expect(price.parse('$42', { coerce: true })).toStrictEqual({
      success: true,
      data: 42,
    })
  })
})

describe('withCoercer: does not mutate the original struct', () => {
  it('the base struct keeps parsing without the attached coercer', () => {
    const base = x.string()
    const upper = x.withCoercer(base, (s) =>
      typeof s === 'string' ? s.toUpperCase() : s
    )

    expect(base.parse('x', { coerce: true })).toStrictEqual({
      success: true,
      data: 'x',
    })
    expect(upper.parse('x', { coerce: true })).toStrictEqual({
      success: true,
      data: 'X',
    })
  })

  it('survives further chain calls in either order', () => {
    const a = x.withCoercer(x.string(), () => 'A').optional()
    const b = x.string().optional()

    expect(a.parse('x', { coerce: true })).toStrictEqual({
      success: true,
      data: 'A',
    })
    expect(b.parse('x', { coerce: true })).toStrictEqual({
      success: true,
      data: 'x',
    })
  })

  it('calling withCoercer twice: the last one wins', () => {
    const struct = x.withCoercer(
      x.withCoercer(x.string(), () => 'first'),
      () => 'second'
    )

    expect(struct.parse('x', { coerce: true })).toStrictEqual({
      success: true,
      data: 'second',
    })
  })
})

describe('withCoercer: composed into object() applies only at its own key', () => {
  const trimmed = x.withCoercer(x.string(), (s) =>
    typeof s === 'string' ? s.trim() : s
  )
  const struct = x.object({ name: trimmed, city: x.string() })

  it('coerces the annotated key', () => {
    expect(
      struct.parse({ name: '  Ann  ', city: 'Berlin' }, { coerce: true })
    ).toStrictEqual({
      success: true,
      data: { name: 'Ann', city: 'Berlin' },
    })
  })

  it('leaves a sibling key untouched', () => {
    expect(
      struct.parse({ name: 'Ann', city: '  Berlin  ' }, { coerce: true })
    ).toStrictEqual({
      success: true,
      data: { name: 'Ann', city: '  Berlin  ' },
    })
  })

  it('does not run at all without coerce: true', () => {
    expect(struct.parse({ name: '  Ann  ', city: 'Berlin' })).toStrictEqual({
      success: true,
      data: { name: '  Ann  ', city: 'Berlin' },
    })
  })
})

describe('withCoercer: composed into array() applies uniformly to every item', () => {
  const dollars = x.withCoercer(x.number(), (s) =>
    typeof s === 'string' && s.startsWith('$') ? s.slice(1) : s
  )
  const struct = x.array(dollars)

  it('applies to every element regardless of index', () => {
    expect(struct.parse(['$10', '$20', '$30'], { coerce: true })).toStrictEqual(
      {
        success: true,
        data: [10, 20, 30],
      }
    )
  })

  it("an array's own coercer and its item coercer don't collide", () => {
    const wholeSubject = x.withCoercer(x.array(dollars), (s) =>
      typeof s === 'string' ? s.split(',') : s
    )

    expect(wholeSubject.parse('$1,$2,$3', { coerce: true })).toStrictEqual({
      success: true,
      data: [1, 2, 3],
    })

    // The item coercer alone (no whole-subject coercer) still only sees
    // an already-array subject — a comma string is rejected as INVALID_TYPE,
    // proving the two coercers are genuinely independent positions.
    expect(struct.parse('$1,$2,$3', { coerce: true }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema: struct.__schema },
    ])
  })
})

describe('withCoercer: composed into record() applies to every value, never to keys', () => {
  const struct = x.record(
    x.withCoercer(x.number(), (s) =>
      typeof s === 'string' && s.startsWith('$') ? s.slice(1) : s
    )
  )

  it('coerces every value', () => {
    expect(struct.parse({ a: '$1', b: '$2' }, { coerce: true })).toStrictEqual({
      success: true,
      data: { a: 1, b: 2 },
    })
  })
})

describe('withCoercer: composed into tuple() applies per position', () => {
  const struct = x.tuple([
    x.withCoercer(x.number(), (s) => (s === 'zero' ? 0 : s)),
    x.number(),
  ])

  it('the coercer at position 0 does not leak into position 1', () => {
    expect(struct.parse(['zero', 5], { coerce: true })).toStrictEqual({
      success: true,
      data: [0, 5],
    })
    expect(struct.parse([1, 'zero'], { coerce: true }).error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidType,
        path: [1],
        schema: struct.__schema.of[1],
      },
    ])
  })
})

describe('withCoercer: composed into union() applies per member', () => {
  it('a coercer on one member does not affect the other', () => {
    const struct = x.union([
      x.withCoercer(x.literal('yes'), (s) => (s === true ? 'yes' : s)),
      x.number(),
    ])

    expect(struct.parse(true, { coerce: true })).toStrictEqual({
      success: true,
      data: 'yes',
    })
    expect(struct.parse('42', { coerce: true })).toStrictEqual({
      success: true,
      data: 42,
    })
  })
})

describe('withCoercer: propagates through multiple levels of composition', () => {
  it('object -> array -> object', () => {
    const id = x.withCoercer(x.number(), (s) =>
      typeof s === 'string' && s.startsWith('#') ? s.slice(1) : s
    )
    const struct = x.object({
      items: x.array(x.object({ id })),
    })

    expect(
      struct.parse({ items: [{ id: '#1' }, { id: '#2' }] }, { coerce: true })
    ).toStrictEqual({
      success: true,
      data: { items: [{ id: 1 }, { id: 2 }] },
    })
  })

  it('two coercers sharing a path prefix (same array item, different keys)', () => {
    const width = x.withCoercer(x.number(), (s) =>
      typeof s === 'string' ? s.slice(1) : s
    )
    const height = x.withCoercer(x.number(), (s) =>
      typeof s === 'string' ? s.slice(1) : s
    )
    const struct = x.array(x.object({ w: width, h: height }))

    expect(
      struct.parse([{ w: '#1', h: '#2' }], { coerce: true })
    ).toStrictEqual({
      success: true,
      data: [{ w: 1, h: 2 }],
    })
  })
})

describe('struct composition tolerates a struct-shaped value with no __coercers of its own', () => {
  it('object() accepts a plain { __schema } value', () => {
    const plain = { __schema: { type: 'string' } } as x.StructShape<x.Schema>
    const struct = x.object({ name: plain })

    expect(struct.parse({ name: 'x' })).toStrictEqual({
      success: true,
      data: { name: 'x' },
    })
  })
})

describe('parse(): customCoercers can be supplied directly for a static schema, without a struct', () => {
  it('a top-level coercer via an empty path', () => {
    const schema = { type: 'number' } as const satisfies x.Schema

    const parsed = x.parse(schema, '$5', {
      coerce: true,
      customCoercers: [
        { path: [], fn: (s) => (typeof s === 'string' ? s.slice(1) : s) },
      ],
    })

    expect(parsed).toStrictEqual({ success: true, data: 5 })
  })

  it('an item-level coercer via COERCER_PATH_ITEM, for a raw array schema', () => {
    const schema = {
      type: 'array',
      of: { type: 'number' },
    } as const satisfies x.Schema

    const parsed = x.parse(schema, ['$1', '$2'], {
      coerce: true,
      customCoercers: [
        {
          path: [x.COERCER_PATH_ITEM],
          fn: (s) => (typeof s === 'string' ? s.slice(1) : s),
        },
      ],
    })

    expect(parsed).toStrictEqual({ success: true, data: [1, 2] })
  })

  it('customCoercers is ignored unless coerce is also true', () => {
    const schema = { type: 'number' } as const satisfies x.Schema

    const parsed = x.parse(schema, '$5', {
      customCoercers: [
        { path: [], fn: (s) => (typeof s === 'string' ? s.slice(1) : s) },
      ],
    })

    expect(parsed.error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema },
    ])
  })
})

describe("~standard.validate does not support options, so struct-level coercers don't apply through it", () => {
  it('the Standard Schema entry point stays strict', () => {
    const struct = x.withCoercer(x.number(), () => 42)
    const validated = struct['~standard'].validate('anything')

    if (validated instanceof Promise) {
      throw Error('Not expected')
    }

    expect(validated.issues).toStrictEqual([
      { message: x.ERROR_CODE.invalidType, path: [] },
    ])
  })
})
