import { describe, it, expect } from 'vitest'
import * as x from '../../src/index.js'

describe('Narrowing the Schema type itself', () => {
  /**
   * Only allows flat objects: fields may be a non-bigint primitive, a union
   * of string literals/strings, or an array of strings/numbers/that same
   * union — no nested object/record/tuple/bigint anywhere in it.
   */
  type BaseRepoModelSchema = x.ObjectSchema<
    Record<
      string,
      | Exclude<x.PrimitiveSchema, { type: 'bigint' }>
      | x.UnionSchema<Array<x.LiteralSchema<string> | x.StringSchema>>
      | x.ArraySchema<
          | x.StringSchema
          | x.NumberSchema
          | x.UnionSchema<
              Array<
                | x.StringSchema
                | x.LiteralSchema<string>
                | x.LiteralSchema<number>
              >
            >
        >
    >
  >

  it('accepts and parses a schema that satisfies the narrowed type', () => {
    const schema = {
      type: 'object',
      of: {
        id: { type: 'string', brand: ['idFor', 'User'] },
        status: {
          type: 'union',
          of: [
            { type: 'literal', of: 'active' },
            { type: 'literal', of: 'banned' },
          ],
        },
        tags: { type: 'array', of: { type: 'string' } },
      },
    } as const satisfies BaseRepoModelSchema

    // a BaseRepoModelSchema is structurally still a plain Schema
    const asSchema: x.Schema = schema

    type Expected = {
      id: string & { __idFor: 'User' }
      status: 'active' | 'banned'
      tags: string[]
    }
    type Actual = x.Infer<typeof schema>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()

    const parsed = x.parse(schema, {
      id: '1',
      status: 'active',
      tags: ['a', 'b'],
    })

    expect(parsed).toStrictEqual({
      success: true,
      data: { id: '1', status: 'active', tags: ['a', 'b'] },
    })

    expect(asSchema).toBe(schema)
  })

  it('rejects field shapes outside the narrowed type at compile time', () => {
    const bigintField = {
      type: 'object',
      of: { count: { type: 'bigint' } },
    } as const satisfies x.Schema

    // @ts-expect-error bigint is excluded from the allowed primitive fields
    const _bigint: BaseRepoModelSchema = bigintField

    const nestedObjectField = {
      type: 'object',
      of: { profile: { type: 'object', of: { bio: { type: 'string' } } } },
    } as const satisfies x.Schema

    // @ts-expect-error nested object is not one of the allowed field types
    const _nestedObject: BaseRepoModelSchema = nestedObjectField

    const arrayOfObjectsField = {
      type: 'object',
      of: {
        items: {
          type: 'array',
          of: { type: 'object', of: { x: { type: 'string' } } },
        },
      },
    } as const satisfies x.Schema

    // @ts-expect-error array members are restricted to string/number/union, not object
    const _arrayOfObjects: BaseRepoModelSchema = arrayOfObjectsField

    const tupleField = {
      type: 'object',
      of: {
        pair: { type: 'tuple', of: [{ type: 'string' }, { type: 'number' }] },
      },
    } as const satisfies x.Schema

    // @ts-expect-error tuple is not one of the allowed field types
    const _tuple: BaseRepoModelSchema = tupleField
  })

  type UnionRepoModelSchema = x.UnionSchema<Array<BaseRepoModelSchema>>
  type RepoModelSchema = BaseRepoModelSchema | UnionRepoModelSchema

  type RepoStruct = {
    __schema: RepoModelSchema
    parse: (x: unknown) => x.ParseResult<unknown>
  }

  it('accepts a struct built from a flat schema as a RepoStruct', () => {
    const struct = x.object({
      id: x.string().brand('idFor', 'User'),
      tags: x.array(x.string()),
    })

    const repoStruct: RepoStruct = struct

    const parsed = repoStruct.parse({ id: '1', tags: ['a'] })

    expect(parsed).toStrictEqual({
      success: true,
      data: { id: '1', tags: ['a'] },
    })
  })

  it('accepts a struct built from a union of flat schemas as a RepoStruct', () => {
    const struct = x.union([
      x.object({ id: x.string() }),
      x.object({ id: x.number() }),
    ])

    const repoStruct: RepoStruct = struct

    expect(repoStruct.parse({ id: '1' })).toStrictEqual({
      success: true,
      data: { id: '1' },
    })
    expect(repoStruct.parse({ id: 1 })).toStrictEqual({
      success: true,
      data: { id: 1 },
    })
  })

  it('rejects a struct built from a schema outside RepoModelSchema at compile time', () => {
    const nestedStruct = x.object({
      profile: x.object({ bio: x.string() }),
    })

    // @ts-expect-error nested object schema does not satisfy RepoModelSchema
    const _repoStruct: RepoStruct = nestedStruct

    const unionOfNestedStruct = x.union([
      x.object({ id: x.string() }),
      x.object({ profile: x.object({ bio: x.string() }) }),
    ])

    // @ts-expect-error a union member violating RepoModelSchema still fails the whole union
    const _repoUnionStruct: RepoStruct = unionOfNestedStruct
  })
})
