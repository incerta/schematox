import { describe, it, expect } from 'vitest'
import * as x from '../src/index.js'

// `target[key] = value` is normally safe, but for the one key name
// `__proto__` it invokes Object.prototype's accessor instead of creating an
// own property — object()/record() build their parsed result this way from
// keys that can come directly from untrusted subject data (record) or from
// schema authoring (object), so both needed a defense.
describe('__proto__-keyed data is stored safely, not dropped or used to corrupt the prototype chain', () => {
  it("record(): a __proto__ key with an object value is stored as an own property, without swapping the result's actual prototype", () => {
    const subject = Object.defineProperty({ safe: { a: 'y' } }, '__proto__', {
      value: { a: 'x' },
      enumerable: true,
      configurable: true,
      writable: true,
    })

    const struct = x.record(x.object({ a: x.string() }))
    const parsed = struct.parse(subject)

    expect(parsed.error).toBe(undefined)
    expect(Object.keys(parsed.data ?? {})).toStrictEqual(['safe', '__proto__'])
    expect(Object.getPrototypeOf(parsed.data)).toBe(Object.prototype)
    expect(parsed.data?.__proto__).toStrictEqual({ a: 'x' })
    // the value that would have polluted the prototype must not be reachable
    // as an inherited property
    expect((parsed.data as Record<string, unknown>)['a']).toBe(undefined)
  })

  it('record(): a __proto__ key with a valid string value is preserved, not silently dropped', () => {
    const subject = Object.defineProperty({ safe: 'ok' }, '__proto__', {
      value: 'polluted-value',
      enumerable: true,
      configurable: true,
      writable: true,
    })

    const struct = x.record(x.string())
    const parsed = struct.parse(subject)

    expect(parsed.error).toBe(undefined)
    expect(Object.keys(parsed.data ?? {})).toStrictEqual(['safe', '__proto__'])
    expect(parsed.data?.['safe']).toBe('ok')
    expect(parsed.data?.['__proto__']).toBe('polluted-value')
  })

  it('object(): a schema field literally named __proto__ round-trips through both the struct builder and parse() safely', () => {
    const fields: Record<string, x.Struct<x.StringSchema>> = {}

    Object.defineProperty(fields, '__proto__', {
      value: x.string(),
      enumerable: true,
      configurable: true,
      writable: true,
    })

    const struct = x.object(fields)

    expect(Object.keys(struct.__schema.of)).toStrictEqual(['__proto__'])

    const subject = Object.defineProperty({}, '__proto__', {
      value: 'hello',
      enumerable: true,
      configurable: true,
      writable: true,
    })

    const parsed = struct.parse(subject)

    expect(parsed.error).toBe(undefined)
    expect(Object.getPrototypeOf(parsed.data)).toBe(Object.prototype)
    expect(Object.keys(parsed.data ?? {})).toStrictEqual(['__proto__'])
    expect(parsed.data?.['__proto__']).toBe('hello')
  })

  it('does not affect the global Object.prototype', () => {
    const subject = Object.defineProperty({}, '__proto__', {
      value: { polluted: true },
      enumerable: true,
      configurable: true,
      writable: true,
    })

    x.record(x.object({ polluted: x.boolean() })).parse(subject)

    expect(({} as Record<string, unknown>)['polluted']).toBe(undefined)
  })
})
