import { describe, it, expect } from 'vitest'
import * as x from '../src/index.js'

import type { StructSharedKeys } from './type.js'

// `partial`/`partialExcept` derive a new object schema (PUT payload -> PATCH
// payload) by rewriting `of`. Unlike params they leave no field behind, so
// they stay available after being called, and the free functions produce
// the exact same JSON as the struct methods.

const putSchema = {
  type: 'object',
  of: {
    id: { type: 'string' },
    name: { type: 'string' },
    bio: { type: 'string', optional: true },
  },
} as const satisfies x.Schema

const putStruct = x.object({
  id: x.string(),
  name: x.string(),
  bio: x.string().optional(),
})

describe('partial', () => {
  it('without keys makes every member optional', () => {
    const expected = {
      type: 'object',
      of: {
        id: { type: 'string', optional: true },
        name: { type: 'string', optional: true },
        bio: { type: 'string', optional: true },
      },
    } as const satisfies x.Schema

    const schema = x.partial(putSchema)
    const struct = putStruct.partial()
    const construct = x.makeStruct(putSchema).partial()

    type Expected = {
      id?: string | undefined
      name?: string | undefined
      bio?: string | undefined
    }

    x.tCh<x.Infer<typeof schema>, Expected>()
    x.tCh<Expected, x.Infer<typeof schema>>()
    x.tCh<x.Infer<typeof struct>, Expected>()
    x.tCh<Expected, x.Infer<typeof struct>>()
    x.tCh<x.Infer<typeof construct>, Expected>()
    x.tCh<Expected, x.Infer<typeof construct>>()

    x.tCh<typeof schema, typeof expected>()
    x.tCh<typeof expected, typeof schema>()
    x.tCh<typeof struct.__schema, typeof expected>()
    x.tCh<typeof expected, typeof struct.__schema>()

    expect(schema).toStrictEqual(expected)
    expect(struct.__schema).toStrictEqual(expected)
    expect(construct.__schema).toStrictEqual(expected)

    for (const subject of [{}, { id: 'a' }, { name: 'b', bio: 'c' }]) {
      expect(x.parse(schema, subject).data).toStrictEqual(subject)
      expect(struct.parse(subject).data).toStrictEqual(subject)
    }

    expect(struct.parse({ id: 1 }).error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidType,
        path: ['id'],
        schema: expected.of.id,
      },
    ])
  })

  it('with keys makes only the listed members optional', () => {
    const expected = {
      type: 'object',
      of: {
        id: { type: 'string' },
        name: { type: 'string', optional: true },
        bio: { type: 'string', optional: true },
      },
    } as const satisfies x.Schema

    const schema = x.partial(putSchema, ['name'])
    const struct = putStruct.partial(['name'])

    type Expected = {
      id: string
      name?: string | undefined
      bio?: string | undefined
    }

    x.tCh<x.Infer<typeof schema>, Expected>()
    x.tCh<Expected, x.Infer<typeof schema>>()
    x.tCh<x.Infer<typeof struct>, Expected>()
    x.tCh<Expected, x.Infer<typeof struct>>()

    expect(schema).toStrictEqual(expected)
    expect(struct.__schema).toStrictEqual(expected)

    expect(struct.parse({ id: 'a' }).data).toStrictEqual({ id: 'a' })
    expect(struct.parse({}).error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidType,
        path: ['id'],
        schema: expected.of.id,
      },
    ])
  })
})

describe('partialExcept', () => {
  it('makes every member optional except the listed ones', () => {
    const expected = {
      type: 'object',
      of: {
        id: { type: 'string' },
        name: { type: 'string', optional: true },
        bio: { type: 'string', optional: true },
      },
    } as const satisfies x.Schema

    const schema = x.partialExcept(putSchema, ['id'])
    const struct = putStruct.partialExcept(['id'])

    type Expected = {
      id: string
      name?: string | undefined
      bio?: string | undefined
    }

    x.tCh<x.Infer<typeof schema>, Expected>()
    x.tCh<Expected, x.Infer<typeof schema>>()
    x.tCh<x.Infer<typeof struct>, Expected>()
    x.tCh<Expected, x.Infer<typeof struct>>()

    expect(schema).toStrictEqual(expected)
    expect(struct.__schema).toStrictEqual(expected)
  })

  it('leaves an excepted member that was already optional optional', () => {
    // `partial().required(keys)` elsewhere would turn `bio` required here
    const schema = x.partialExcept(putSchema, ['id', 'bio'])
    const struct = putStruct.partialExcept(['id', 'bio'])

    type Expected = {
      id: string
      name?: string | undefined
      bio?: string | undefined
    }

    x.tCh<x.Infer<typeof schema>, Expected>()
    x.tCh<Expected, x.Infer<typeof schema>>()
    x.tCh<x.Infer<typeof struct>, Expected>()
    x.tCh<Expected, x.Infer<typeof struct>>()

    expect(schema.of.bio).toBe(putSchema.of.bio)
    expect(struct.parse({ id: 'a' }).data).toStrictEqual({ id: 'a' })
  })
})

describe('Derived schema', () => {
  it('keeps the object params and leaves the source schema untouched', () => {
    const source = {
      type: 'object',
      of: { a: { type: 'number', nullable: true, brand: ['idFor', 'A'] } },
      nullable: true,
      description: 'source',
      meta: { table: 'a' },
    } as const satisfies x.Schema
    const snapshot = structuredClone(source)

    const schema = x.partial(source)

    type Expected = {
      a?: (number & { __idFor: 'A' }) | null | undefined
    } | null

    x.tCh<x.Infer<typeof schema>, Expected>()
    x.tCh<Expected, x.Infer<typeof schema>>()

    expect(schema).toStrictEqual({
      type: 'object',
      of: {
        a: {
          type: 'number',
          nullable: true,
          brand: ['idFor', 'A'],
          optional: true,
        },
      },
      nullable: true,
      description: 'source',
      meta: { table: 'a' },
    })
    expect(source).toStrictEqual(snapshot)
    expect(schema === (source as object)).toBe(false)
    expect(schema.of === (source.of as object)).toBe(false)
  })

  it('reuses members it does not change by reference', () => {
    const schema = x.partial(putSchema, ['name'])

    expect(schema.of.id).toBe(putSchema.of.id)
    expect(schema.of.bio).toBe(putSchema.of.bio)
    expect(schema.of.name).not.toBe(putSchema.of.name)
  })

  it('applies to the first level only', () => {
    const struct = x.object({ nested: x.object({ a: x.string() }) }).partial()

    type Expected = { nested?: { a: string } | undefined }

    x.tCh<x.Infer<typeof struct>, Expected>()
    x.tCh<Expected, x.Infer<typeof struct>>()

    expect(struct.parse({ nested: {} }).success).toBe(false)
    expect(struct.parse({}).success).toBe(true)
  })

  it('handles a `__proto__` member as an own key', () => {
    const source = JSON.parse(
      '{"type":"object","of":{"__proto__":{"type":"string"}}}'
    ) as { type: 'object'; of: Record<string, x.Schema> }

    const schema = x.partial(source, ['__proto__'])

    expect(Object.keys(schema.of)).toStrictEqual(['__proto__'])
    expect(Object.getPrototypeOf(schema.of)).toBe(Object.prototype)
    expect(schema.of['__proto__']).toStrictEqual({
      type: 'string',
      optional: true,
    })
  })
})

describe('Struct methods', () => {
  it('stay available after being called and chain with params', () => {
    type ExpectedKeys =
      | StructSharedKeys
      | 'optional'
      | 'nullable'
      | 'description'
      | 'partial'
      | 'partialExcept'

    const struct = putStruct.partial(['name'])

    x.tCh<keyof typeof struct, ExpectedKeys>()
    x.tCh<ExpectedKeys, keyof typeof struct>()

    const chained = struct.partialExcept(['id']).optional().partial()

    type Expected =
      | {
          id?: string | undefined
          name?: string | undefined
          bio?: string | undefined
        }
      | undefined

    x.tCh<x.Infer<typeof chained>, Expected>()
    x.tCh<Expected, x.Infer<typeof chained>>()

    expect(chained.__schema).toStrictEqual({
      ...x.partial(putSchema),
      optional: true,
    })
    expect(chained.parse(undefined).success).toBe(true)
  })

  it('exist only on object structs', () => {
    expect('partial' in x.string()).toBe(false)
    expect('partialExcept' in x.array(x.string())).toBe(false)

    // @ts-expect-error object-only method
    x.string().partial
    // @ts-expect-error object-only method
    x.record(x.string()).partialExcept
  })

  it('keep member preprocessors', () => {
    const struct = x
      .object({
        name: x
          .string()
          .preprocess((s) => (typeof s === 'string' ? s.trim() : s)),
      })
      .preprocess((s) => s ?? {})
      .partial()

    expect(struct.parse({ name: ' a ' }).data).toStrictEqual({ name: 'a' })
    expect(struct.parse(null).data).toStrictEqual({})
  })
})

describe('Keys', () => {
  it('reject keys that are not members, statically and at runtime', () => {
    expect(() =>
      // @ts-expect-error not a member
      putStruct.partial(['missing'])
    ).toThrow('object schema has no "missing" member')

    expect(() =>
      // @ts-expect-error not a member
      x.partialExcept(putSchema, ['toString'])
    ).toThrow('object schema has no "toString" member')
  })

  it('must be a non-empty list', () => {
    // @ts-expect-error empty list
    putStruct.partial([])
    // @ts-expect-error empty list
    x.partialExcept(putSchema, [])
  })
})
