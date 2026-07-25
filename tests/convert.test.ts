import { describe, it, expect } from 'vitest'
import * as x from '../src/index.js'

// Custom converters are a struct/parser feature, same as the built-in coerce
// table — they never touch the schema. `.convert()` is a real chain method
// (not a wrapper function): tests/type.ts's `StructSharedKeys` pins it once
// for every struct type, so it costs nothing in the by-struct fold tests.
describe('.convert(): always active once declared, independently of { coerce: true }', () => {
  it('runs with no options at all', () => {
    const struct = x.string().convert(() => 'replaced')

    expect(struct.parse('x')).toStrictEqual({ success: true, data: 'replaced' })
  })

  it('runs the same whether coerce is true or false', () => {
    const struct = x.string().convert(() => 'replaced')

    expect(struct.parse('x', { coerce: true })).toStrictEqual({
      success: true,
      data: 'replaced',
    })
    expect(struct.parse('x', { coerce: false })).toStrictEqual({
      success: true,
      data: 'replaced',
    })
  })

  it('a converter that returns the subject unchanged falls through to the ordinary error', () => {
    const struct = x.number().convert((s) => s)

    expect(struct.parse('abc').error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidType,
        path: [],
        schema: struct.__schema,
      },
    ])
  })
})

describe('.convert() vs { coerce: true }: two independent switches', () => {
  it("coerce: true doesn't retroactively enable a converter that wasn't declared", () => {
    // number() has no .convert() attached — only the built-in table applies
    const struct = x.number()

    expect(struct.parse('42', { coerce: true })).toStrictEqual({
      success: true,
      data: 42,
    })
    expect(struct.parse('42')).toStrictEqual({
      success: false,
      error: [
        { code: x.ERROR_CODE.invalidType, path: [], schema: struct.__schema },
      ],
    })
  })

  it('a custom converter runs first, then the built-in table still applies when coerce: true', () => {
    const price = x
      .number()
      .convert((s) =>
        typeof s === 'string' && s.startsWith('$') ? s.slice(1) : s
      )

    // custom converter alone turns "$42" into "42" (still a string) —
    // without { coerce: true } the built-in string→number conversion never runs
    expect(price.parse('$42').error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema: price.__schema },
    ])

    expect(price.parse('$42', { coerce: true })).toStrictEqual({
      success: true,
      data: 42,
    })
  })
})

describe('.convert(): does not mutate the struct it was called on', () => {
  it('the base struct keeps parsing without the attached converter', () => {
    const base = x.string()
    const upper = base.convert((s) =>
      typeof s === 'string' ? s.toUpperCase() : s
    )

    expect(base.parse('x')).toStrictEqual({ success: true, data: 'x' })
    expect(upper.parse('x')).toStrictEqual({ success: true, data: 'X' })
  })

  it('survives further chain calls in either order', () => {
    const a = x
      .string()
      .convert(() => 'A')
      .optional()
    const b = x.string().optional()

    expect(a.parse('x')).toStrictEqual({ success: true, data: 'A' })
    expect(b.parse('x')).toStrictEqual({ success: true, data: 'x' })
  })

  it('cannot be called a second time — removed from the type once applied, same as .brand()/.min()/etc.', () => {
    const struct = x.string().convert(() => 'first')

    type ExpectedKeys =
      | '__schema'
      | '~standard'
      | 'parse'
      | 'optional'
      | 'nullable'
      | 'brand'
      | 'minLength'
      | 'maxLength'
      | 'description'

    x.tCh<keyof typeof struct, ExpectedKeys>()
    x.tCh<ExpectedKeys, keyof typeof struct>()

    // @ts-expect-error: 'convert' does not exist on type 'Struct<..., true>'
    const goneAtRuntimeToo = struct.convert

    expect(goneAtRuntimeToo).toBe(undefined)
  })
})

describe('.convert(): composed into object() applies only at its own key', () => {
  const trimmed = x
    .string()
    .convert((s) => (typeof s === 'string' ? s.trim() : s))
  const struct = x.object({ name: trimmed, city: x.string() })

  it('converts the annotated key', () => {
    expect(struct.parse({ name: '  Ann  ', city: 'Berlin' })).toStrictEqual({
      success: true,
      data: { name: 'Ann', city: 'Berlin' },
    })
  })

  it('leaves a sibling key untouched', () => {
    expect(struct.parse({ name: 'Ann', city: '  Berlin  ' })).toStrictEqual({
      success: true,
      data: { name: 'Ann', city: '  Berlin  ' },
    })
  })
})

describe('.convert(): composed into array() applies uniformly to every item', () => {
  const dollars = x
    .number()
    .convert((s) =>
      typeof s === 'string' && s.startsWith('$') ? s.slice(1) : s
    )
  const struct = x.array(dollars)

  it('applies to every element regardless of index (built-in table still needs coerce: true)', () => {
    expect(struct.parse(['$10', '$20', '$30'], { coerce: true })).toStrictEqual(
      {
        success: true,
        data: [10, 20, 30],
      }
    )
  })

  it("an array's own converter and its item converter don't collide", () => {
    const wholeSubject = x
      .array(dollars)
      .convert((s) => (typeof s === 'string' ? s.split(',') : s))

    expect(wholeSubject.parse('$1,$2,$3', { coerce: true })).toStrictEqual({
      success: true,
      data: [1, 2, 3],
    })

    // The item converter alone (no whole-subject converter) still only
    // sees an already-array subject — a comma string is rejected as
    // INVALID_TYPE, proving the two converters are genuinely independent
    // positions.
    expect(struct.parse('$1,$2,$3', { coerce: true }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidType, path: [], schema: struct.__schema },
    ])
  })
})

describe('.convert(): composed into record() applies to every value, never to keys', () => {
  const struct = x.record(
    x
      .number()
      .convert((s) =>
        typeof s === 'string' && s.startsWith('$') ? s.slice(1) : s
      )
  )

  it('converts every value', () => {
    expect(struct.parse({ a: '$1', b: '$2' }, { coerce: true })).toStrictEqual({
      success: true,
      data: { a: 1, b: 2 },
    })
  })
})

describe('.convert(): composed into tuple() applies per position', () => {
  const struct = x.tuple([
    x.number().convert((s) => (s === 'zero' ? 0 : s)),
    x.number(),
  ])

  it('the converter at position 0 does not leak into position 1', () => {
    expect(struct.parse(['zero', 5])).toStrictEqual({
      success: true,
      data: [0, 5],
    })
    expect(struct.parse([1, 'zero']).error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidType,
        path: [1],
        schema: struct.__schema.of[1],
      },
    ])
  })
})

describe('.convert(): composed into union() applies per member', () => {
  it('a converter on one member does not affect the other', () => {
    const struct = x.union([
      x.literal('yes').convert((s) => (s === true ? 'yes' : s)),
      x.number(),
    ])

    expect(struct.parse(true)).toStrictEqual({ success: true, data: 'yes' })
    expect(struct.parse('42', { coerce: true })).toStrictEqual({
      success: true,
      data: 42,
    })
  })
})

describe('.convert(): propagates through multiple levels of composition', () => {
  it('object -> array -> object', () => {
    const id = x
      .number()
      .convert((s) =>
        typeof s === 'string' && s.startsWith('#') ? Number(s.slice(1)) : s
      )
    const struct = x.object({
      items: x.array(x.object({ id })),
    })

    expect(struct.parse({ items: [{ id: '#1' }, { id: '#2' }] })).toStrictEqual(
      {
        success: true,
        data: { items: [{ id: 1 }, { id: 2 }] },
      }
    )
  })

  it('two converters sharing a path prefix (same array item, different keys)', () => {
    const width = x
      .number()
      .convert((s) => (typeof s === 'string' ? Number(s.slice(1)) : s))
    const height = x
      .number()
      .convert((s) => (typeof s === 'string' ? Number(s.slice(1)) : s))
    const struct = x.array(x.object({ w: width, h: height }))

    expect(struct.parse([{ w: '#1', h: '#2' }])).toStrictEqual({
      success: true,
      data: [{ w: 1, h: 2 }],
    })
  })
})

describe('struct composition tolerates a struct-shaped value with no converters of its own', () => {
  it('object() accepts a plain { __schema } value', () => {
    const plain = { __schema: { type: 'string' } } as x.StructShape<x.Schema>
    const struct = x.object({ name: plain })

    expect(struct.parse({ name: 'x' })).toStrictEqual({
      success: true,
      data: { name: 'x' },
    })
  })
})

describe("~standard.validate does not support options, so a struct's converters don't apply through it", () => {
  it('the Standard Schema entry point stays strict', () => {
    const struct = x.number().convert(() => 42)
    const validated = struct['~standard'].validate('anything')

    if (validated instanceof Promise) {
      throw Error('Not expected')
    }

    expect(validated.issues).toStrictEqual([
      { message: x.ERROR_CODE.invalidType, path: [] },
    ])
  })
})
