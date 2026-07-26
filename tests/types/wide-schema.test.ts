import { describe, it, expect } from 'vitest'
import * as x from '../../src/index.js'

// `Schema` itself now has a `meta` field for exactly this purpose (see
// tests/types/meta.test.ts) — this file documents the more general
// fallback for genuinely arbitrary top-level keys, which still works
// but can't go through a direct `satisfies Schema` check.
describe('Custom metadata attached to a schema is preserved', () => {
  const userSchema = x.makeStruct({
    type: 'object',
    of: {
      id: { type: 'string', brand: ['idFor', 'User'], dbColumn: 'user_id' },
      name: { type: 'string', dbColumn: 'full_name' },
    },
  } as const)

  it('survives on __schema, fully typed, through makeStruct', () => {
    type IdColumn = (typeof userSchema.__schema.of.id)['dbColumn']
    type NameColumn = (typeof userSchema.__schema.of.name)['dbColumn']

    x.tCh<IdColumn, 'user_id'>()
    x.tCh<'user_id', IdColumn>()
    x.tCh<NameColumn, 'full_name'>()
    x.tCh<'full_name', NameColumn>()

    expect(userSchema.__schema.of.id.dbColumn).toBe('user_id')
    expect(userSchema.__schema.of.name.dbColumn).toBe('full_name')
  })

  it('survives through parse() too, via the same generic inference', () => {
    const parsed = x.parse(userSchema.__schema, { id: '1', name: 'John' })

    expect(parsed.success && parsed.data).toStrictEqual({
      id: '1',
      name: 'John',
    })
  })

  it('never leaks into Infer or the parsed data', () => {
    type Expected = { id: string & { __idFor: 'User' }; name: string }
    type Actual = x.Infer<typeof userSchema.__schema>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()

    const parsed = userSchema.parse({ id: '1', name: 'John' })

    expect(parsed.success && parsed.data).toStrictEqual({
      id: '1',
      name: 'John',
    })
    expect(parsed.success && 'dbColumn' in parsed.data).toBe(false)
  })

  it('is usable for its intended purpose: deriving column names', () => {
    function columnNames(schema: typeof userSchema.__schema) {
      return Object.values(schema.of).map((field) => field.dbColumn)
    }

    expect(columnNames(userSchema.__schema)).toStrictEqual([
      'user_id',
      'full_name',
    ])
  })

  it('is rejected by a direct `satisfies Schema` check on the same literal', () => {
    // @ts-expect-error unlike makeStruct()/parse(), a direct `satisfies` check excess-property-checks the fresh literal
    const _direct = { type: 'string', dbColumn: 'user_id' } satisfies x.Schema
  })
})
