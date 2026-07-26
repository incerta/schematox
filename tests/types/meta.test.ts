import { describe, it, expect } from 'vitest'
import * as x from '../../src/index.js'

describe('Schema-level `meta` field', () => {
  it('is a real member of Schema, so a direct `satisfies Schema` check accepts it', () => {
    const schema = {
      type: 'string',
      meta: { dbColumn: 'user_id' },
    } as const satisfies x.Schema

    type Meta = (typeof schema)['meta']

    x.tCh<Meta, { readonly dbColumn: 'user_id' }>()
    x.tCh<{ readonly dbColumn: 'user_id' }, Meta>()

    expect(schema.meta).toStrictEqual({ dbColumn: 'user_id' })
  })

  it('never leaks into Infer or the parsed data', () => {
    const schema = {
      type: 'object',
      of: {
        id: { type: 'string', meta: { dbColumn: 'user_id' } },
        name: { type: 'string', meta: { dbColumn: 'full_name' } },
      },
    } as const satisfies x.Schema

    type Expected = { id: string; name: string }
    type Actual = x.Infer<typeof schema>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()

    const parsed = x.parse(schema, { id: '1', name: 'John' })

    expect(parsed.success && parsed.data).toStrictEqual({
      id: '1',
      name: 'John',
    })
  })

  it('is usable for its intended purpose: deriving column names', () => {
    const schema = {
      type: 'object',
      of: {
        id: { type: 'string', meta: { dbColumn: 'user_id' } },
        name: { type: 'string', meta: { dbColumn: 'full_name' } },
      },
    } as const satisfies x.Schema

    function columnNames(s: typeof schema) {
      return Object.values(s.of).map((field) => field.meta.dbColumn)
    }

    expect(columnNames(schema)).toStrictEqual(['user_id', 'full_name'])
  })

  describe('Struct.meta()', () => {
    it('attaches meta, preserving its literal type', () => {
      const struct = x.string().meta({ dbColumn: 'user_id' })

      type Actual = (typeof struct.__schema)['meta']

      x.tCh<Actual, { dbColumn: string }>()
      x.tCh<{ dbColumn: string }, Actual>()

      expect(struct.__schema).toStrictEqual({
        type: 'string',
        meta: { dbColumn: 'user_id' },
      })
    })

    it('does not mutate the original struct schema', () => {
      const prevStruct = x.string()
      const struct = prevStruct.meta({ dbColumn: 'user_id' })

      expect(prevStruct.__schema).toStrictEqual({ type: 'string' })
      expect(prevStruct.__schema === struct.__schema).toBe(false)
    })

    it('does not affect parsing', () => {
      const struct = x.string().meta({ dbColumn: 'user_id' })

      expect(struct.parse('x')).toStrictEqual({ success: true, data: 'x' })
      expect(struct.parse(1).success).toBe(false)
    })

    it('is available on every schema type', () => {
      x.boolean().meta({ a: 1 })
      x.literal('x').meta({ a: 1 })
      x.number().meta({ a: 1 })
      x.bigint().meta({ a: 1 })
      x.string().meta({ a: 1 })
      x.unknown().meta({ a: 1 })
      x.array(x.string()).meta({ a: 1 })
      x.object({ id: x.string() }).meta({ a: 1 })
      x.record(x.string()).meta({ a: 1 })
      x.tuple([x.string()]).meta({ a: 1 })
      x.union([x.string(), x.number()]).meta({ a: 1 })
    })
  })
})
