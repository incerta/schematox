import { describe, it, expect } from 'vitest'
import * as x from '../src/index.js'

// `~standard.jsonSchema` is a struct/construct-only feature — same as
// `~standard.validate` — reached via `x.makeStruct(schema)` for a plain
// static schema, or directly off the fluent API. `input()`/`output()` are
// identical for schematox (see `src/json-schema.ts`), so each case below
// only checks `output()`.
describe('~standard.jsonSchema.output(): primitives', () => {
  it('boolean', () => {
    const struct = x.boolean()

    expect(
      struct['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({
      type: 'boolean',
    })
  })

  it('string with minLength/maxLength', () => {
    const struct = x.string().minLength(1).maxLength(10)

    expect(
      struct['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({
      type: 'string',
      minLength: 1,
      maxLength: 10,
    })
  })

  it('number with min/max', () => {
    const struct = x.number().min(0).max(100)

    expect(
      struct['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({
      type: 'number',
      minimum: 0,
      maximum: 100,
    })
  })

  it('literal', () => {
    expect(
      x
        .literal('active')
        ['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({ const: 'active' })
    expect(
      x.literal(1)['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({ const: 1 })
  })

  it('unknown', () => {
    expect(
      x.unknown()['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({})
  })

  it('bigint throws — no JSON value can represent a bigint', () => {
    expect(() =>
      x.bigint()['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toThrow(/bigint/)
  })
})

describe('~standard.jsonSchema.output(): modifiers', () => {
  it("optional has no effect on the schema itself (only on a parent object's required list)", () => {
    expect(
      x
        .string()
        .optional()
        ['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({ type: 'string' })
  })

  it('nullable widens `type` to include "null"', () => {
    expect(
      x
        .string()
        .nullable()
        ['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({ type: ['string', 'null'] })
  })

  it('nullable wraps a `const` (literal) in anyOf', () => {
    expect(
      x
        .literal('x')
        .nullable()
        ['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({ anyOf: [{ const: 'x' }, { type: 'null' }] })
  })

  it('nullable flattens into an existing anyOf (union)', () => {
    const struct = x.union([x.string(), x.number()]).nullable()

    expect(
      struct['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'number' }, { type: 'null' }],
    })
  })

  it('nullable is a no-op for unknown, which already accepts null', () => {
    expect(
      x
        .unknown()
        .nullable()
        ['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({})
  })

  it('description passes through as-is', () => {
    expect(
      x
        .string()
        .description('a user handle')
        ['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({ type: 'string', description: 'a user handle' })
  })

  it('brand and meta are dropped — neither has a JSON Schema representation', () => {
    expect(
      x
        .string()
        .brand('idFor', 'User')
        .meta({ column: 'user_id' })
        ['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({ type: 'string' })
  })
})

describe('~standard.jsonSchema.output(): compounds', () => {
  it('array', () => {
    const struct = x.array(x.number()).minLength(1).maxLength(5)

    expect(
      struct['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({
      type: 'array',
      items: { type: 'number' },
      minItems: 1,
      maxItems: 5,
    })
  })

  it('object: required omits optional keys', () => {
    const struct = x.object({
      id: x.string(),
      nickname: x.string().optional(),
    })

    expect(
      struct['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({
      type: 'object',
      properties: {
        id: { type: 'string' },
        nickname: { type: 'string' },
      },
      required: ['id'],
    })
  })

  it('object: required is omitted entirely when every key is optional', () => {
    const struct = x.object({ nickname: x.string().optional() })

    expect(
      struct['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({
      type: 'object',
      properties: { nickname: { type: 'string' } },
    })
  })

  it('record without a key schema', () => {
    const struct = x.record(x.number()).minLength(1).maxLength(3)

    expect(
      struct['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({
      type: 'object',
      additionalProperties: { type: 'number' },
      minProperties: 1,
      maxProperties: 3,
    })
  })

  it('record with a key schema maps to propertyNames', () => {
    const struct = x.record(x.number()).key(x.string().minLength(1))

    expect(
      struct['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({
      type: 'object',
      additionalProperties: { type: 'number' },
      propertyNames: { type: 'string', minLength: 1 },
    })
  })

  it('union maps to anyOf', () => {
    const struct = x.union([x.string(), x.number(), x.boolean()])

    expect(
      struct['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    })
  })

  it('tuple on draft-2020-12 uses prefixItems and closes with items: false', () => {
    const struct = x.tuple([x.string(), x.number()])

    expect(
      struct['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({
      type: 'array',
      prefixItems: [{ type: 'string' }, { type: 'number' }],
      items: false,
      minItems: 2,
      maxItems: 2,
    })
  })

  it('tuple on draft-07 uses positional items and closes with additionalItems: false', () => {
    const struct = x.tuple([x.string(), x.number()])

    expect(
      struct['~standard'].jsonSchema.output({ target: 'draft-07' })
    ).toStrictEqual({
      type: 'array',
      items: [{ type: 'string' }, { type: 'number' }],
      additionalItems: false,
      minItems: 2,
      maxItems: 2,
    })
  })

  it('nested compound schema converts recursively', () => {
    const struct = x.object({
      tags: x.array(x.string()),
      address: x.object({ city: x.string().nullable() }),
    })

    expect(
      struct['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({
      type: 'object',
      properties: {
        tags: { type: 'array', items: { type: 'string' } },
        address: {
          type: 'object',
          properties: { city: { type: ['string', 'null'] } },
          required: ['city'],
        },
      },
      required: ['tags', 'address'],
    })
  })
})

describe('~standard.jsonSchema: target support', () => {
  it('throws for an unsupported target', () => {
    expect(() =>
      x.string()['~standard'].jsonSchema.output({ target: 'openapi-3.0' })
    ).toThrow(/openapi-3\.0/)
  })

  it('input() and output() agree — schematox has no separate transform step between them', () => {
    const struct = x.object({ id: x.string(), age: x.number().optional() })

    expect(
      struct['~standard'].jsonSchema.input({ target: 'draft-2020-12' })
    ).toStrictEqual(
      struct['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    )
  })

  it('works the same for a construct built from a static schema', () => {
    const schema = { type: 'string', minLength: 2 } as const satisfies x.Schema
    const construct = x.makeStruct(schema)

    expect(
      construct['~standard'].jsonSchema.output({ target: 'draft-2020-12' })
    ).toStrictEqual({ type: 'string', minLength: 2 })
  })
})
