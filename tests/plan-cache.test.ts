import { describe, it, expect } from 'vitest'
import * as x from '../src/index.js'

// Each schema object is compiled into a parse plan on its first parse, and
// the plan is cached by the schema's reference (a WeakMap). The schema itself
// is never written to, so it stays plain data.
describe('parse plans cached by schema reference', () => {
  it('gives the same result on every parse of the same schema', () => {
    const schema = {
      type: 'object',
      of: { a: { type: 'string', minLength: 2 }, b: { type: 'number' } },
    } as const

    for (let i = 0; i < 3; i++) {
      expect(x.parse(schema, { a: 'xy', b: 1 })).toStrictEqual({
        success: true,
        data: { a: 'xy', b: 1 },
      })
      expect(x.parse(schema, { a: 'x', b: 1 }).error).toStrictEqual([
        {
          code: x.ERROR_CODE.invalidRange,
          path: ['a'],
          schema: schema.of.a,
        },
      ])
    }
  })

  it('never mutates the schema, and parses a deeply frozen one', () => {
    const schema = {
      type: 'union',
      discriminant: 'kind',
      of: [
        {
          type: 'object',
          of: {
            kind: { type: 'literal', of: 'a' },
            tags: { type: 'array', of: { type: 'string' } },
          },
        },
        { type: 'record', of: { type: 'number' } },
      ],
    } as const

    const snapshot = structuredClone(schema)
    const deepFreeze = (value: unknown): void => {
      if (typeof value === 'object' && value !== null) {
        Object.values(value).forEach(deepFreeze)
        Object.freeze(value)
      }
    }

    deepFreeze(schema)

    expect(x.parse(schema as never, { kind: 'a', tags: ['t'] }).success).toBe(
      true
    )
    expect(x.parse(schema as never, { n: 1 }, { coerce: true }).success).toBe(
      true
    )
    expect(schema).toStrictEqual(snapshot)
  })

  it('keeps coerce: true and coerce: false plans of the same schema apart, in either order', () => {
    const first = { type: 'number' } as const
    const second = { type: 'number' } as const

    expect(x.parse(first, '1').success).toBe(false)
    expect(x.parse(first, '1', { coerce: true })).toStrictEqual({
      success: true,
      data: 1,
    })

    expect(x.parse(second, '1', { coerce: true }).success).toBe(true)
    expect(x.parse(second, '1').success).toBe(false)
  })

  it("doesn't leak a struct's preprocessor into other uses of the same child schema", () => {
    const child = x.string()
    const preprocessed = x.object({ a: child.preprocess((s) => `${s}!`) })
    const plain = x.object({ a: child })

    expect(preprocessed.parse({ a: 'x' }).data).toStrictEqual({ a: 'x!' })
    expect(plain.parse({ a: 'x' }).data).toStrictEqual({ a: 'x' })
    expect(x.parse(child.__schema, 'x').data).toBe('x')
    expect(preprocessed.parse({ a: 'y' }).data).toStrictEqual({ a: 'y!' })
  })

  it('parses a self-referencing schema graph without looping while building its plan', () => {
    const node: { type: 'object'; of: Record<string, unknown> } = {
      type: 'object',
      of: { value: { type: 'number' } },
    }

    node.of.next = { type: 'union', of: [{ type: 'literal', of: 0 }, node] }

    const subject = { value: 1, next: { value: 2, next: 0 } }

    expect(x.parse(node as never, subject)).toStrictEqual({
      success: true,
      data: subject,
    })
    expect(
      x.parse(node as never, { value: 1, next: { value: 'x', next: 0 } }).error
    ).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidUnion,
        path: ['next'],
        schema: node.of.next,
      },
    ])
  })

  it('reports a malformed nested schema at its own path when a preprocessor sits on that path', () => {
    const struct = x.makeStruct({ type: 'object', of: { a: null } } as never, [
      { path: ['a'], fn: () => 'replaced' },
    ])

    expect(struct.parse({ a: 1 }).error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidSchema,
        path: ['a'],
        schema: null,
      },
    ])
  })

  it('still reports INVALID_TYPE before a malformed number/string bound', () => {
    const number = { type: 'number', min: '1' } as never
    const string = { type: 'string', maxLength: '1' } as never

    for (const [schema, subject] of [
      [number, 'x'],
      [string, 1],
    ] as const) {
      expect(x.parse(schema, subject).error).toStrictEqual([
        { code: x.ERROR_CODE.invalidType, path: [], schema },
      ])
    }
  })
})
