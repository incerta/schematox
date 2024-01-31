import { PARSE_ERROR_CODE } from '../error'
import { parseBaseSchemaSubject } from '../base-schema-parser'
import { check, unknownX } from './test-utils'

import type { BaseSchemaParseError } from '../error'
import type { Schema } from '../types/compound-schema-types'

describe('Parse base short schema with valid subject', () => {
  it('parseBaseSchemaSubject: subject `"x"` - schema `"string"`', () => {
    expect(parseBaseSchemaSubject('string', 'x').data).toBe('x')
    expect(parseBaseSchemaSubject('string', 'x').error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: subject `"x"` - schema `"string?"`', () => {
    expect(parseBaseSchemaSubject('string', 'x').data).toBe('x')
    expect(parseBaseSchemaSubject('string', 'x').error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: subject `0` - schema `"number"`', () => {
    expect(parseBaseSchemaSubject('number', 0).data).toBe(0)
    expect(parseBaseSchemaSubject('number', 0).error).toBe(undefined)
  })
  it('parseBaseSchemaSubject: subject `0` - schema `"number?"`', () => {
    expect(parseBaseSchemaSubject('number', 0).data).toBe(0)
    expect(parseBaseSchemaSubject('number', 0).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: subject `true` - schema `"boolean"`', () => {
    expect(parseBaseSchemaSubject('boolean', true).data).toBe(true)
    expect(parseBaseSchemaSubject('boolean', true).error).toBe(undefined)
  })
  it('parseBaseSchemaSubject: subject `true` - schema `"boolean?"`', () => {
    expect(parseBaseSchemaSubject('boolean', true).data).toBe(true)
    expect(parseBaseSchemaSubject('boolean', true).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: subject `false` - schema `"boolean"`', () => {
    expect(parseBaseSchemaSubject('boolean', false).data).toBe(false)
    expect(parseBaseSchemaSubject('boolean', false).error).toBe(undefined)
  })
  it('parseBaseSchemaSubject: subject `false` - schema `"boolean?"`', () => {
    expect(parseBaseSchemaSubject('boolean', false).data).toBe(false)
    expect(parseBaseSchemaSubject('boolean', false).error).toBe(undefined)
  })
})

describe('Parse base short schema with `null | undefined` subject', () => {
  /* string | string? */

  it('parseBaseSchemaSubject: subject `undefined` - schema `"string"`', () => {
    const schema = 'string' satisfies Schema
    const subject = undefined
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: PARSE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `undefined` - schema `"string?"`', () => {
    const schema = 'string?' satisfies Schema
    const subject = undefined
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.data).toBe(undefined)
  })

  it('parseBaseSchemaSubject: subject `null` - schema `"string"`', () => {
    const schema = 'string' satisfies Schema
    const subject = null
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: PARSE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `null` - schema `"string?"`', () => {
    const schema = 'string?' satisfies Schema
    const subject = null
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.data).toBe(undefined)
  })

  /* number | number? */

  it('parseBaseSchemaSubject: subject `undefined` - schema `"number"`', () => {
    const schema = 'number' satisfies Schema
    const subject = undefined
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: PARSE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `undefined` - schema `"number?"`', () => {
    const schema = 'number?' satisfies Schema
    const subject = undefined
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.data).toBe(undefined)
  })

  it('parseBaseSchemaSubject: subject `null` - schema `"number"`', () => {
    const schema = 'number' satisfies Schema
    const subject = null
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: PARSE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `null` - schema `"number?"`', () => {
    const schema = 'number?' satisfies Schema
    const subject = null
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.data).toBe(undefined)
  })

  /* boolean | boolean? */

  it('parseBaseSchemaSubject: subject `undefined` - schema `"number"`', () => {
    const schema = 'number' satisfies Schema
    const subject = undefined
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: PARSE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `undefined` - schema `"number?"`', () => {
    const schema = 'number?' satisfies Schema
    const subject = undefined
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.data).toBe(undefined)
  })

  it('parseBaseSchemaSubject: subject `null` - schema `"number"`', () => {
    const schema = 'number' satisfies Schema
    const subject = null
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: PARSE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `null` - schema `"number?"`', () => {
    const schema = 'number?' satisfies Schema
    const subject = null
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.data).toBe(undefined)
  })

  /* boolean | boolean? */

  it('parseBaseSchemaSubject: subject `undefined` - schema `"boolean"`', () => {
    const schema = 'boolean' satisfies Schema
    const subject = undefined
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: PARSE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `undefined` - schema `"boolean?"`', () => {
    const schema = 'boolean?' satisfies Schema
    const subject = undefined
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.data).toBe(undefined)
  })

  it('parseBaseSchemaSubject: subject `null` - schema `"boolean"`', () => {
    const schema = 'boolean' satisfies Schema
    const subject = null
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: PARSE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `null` - schema `"boolean?"`', () => {
    const schema = 'boolean?' satisfies Schema
    const subject = null
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.data).toBe(undefined)
  })
})

describe('Number base schema invalid subject parsing special cases', () => {
  it('parseBaseSchemaSubject: subject `NaN` - schema `"number"`', () => {
    const schema = 'number' satisfies Schema
    const subject = NaN
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: PARSE_ERROR_CODE.NaN,
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `NaN` - schema `"number?"`', () => {
    const schema = 'number?' satisfies Schema
    const subject = NaN
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: PARSE_ERROR_CODE.NaN,
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `Infinity` - schema `"number"`', () => {
    const schema = 'number' satisfies Schema
    const subject = Infinity
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: PARSE_ERROR_CODE.infinity,
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `Infinity` - schema `"number?"`', () => {
    const schema = 'number?' satisfies Schema
    const subject = Infinity
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: PARSE_ERROR_CODE.infinity,
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `-Infinity` - schema `"number"`', () => {
    const schema = 'number' satisfies Schema
    const subject = -Infinity
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: PARSE_ERROR_CODE.infinity,
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `-Infinity` - schema `"number?"`', () => {
    const schema = 'number?' satisfies Schema
    const subject = -Infinity
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: PARSE_ERROR_CODE.infinity,
      schema,
      subject,
    })
  })
})

describe('Parse base short schema TYPE INFERENCE check', () => {
  /* string/string? */

  it('parseBaseSchemaSubject: string', () => {
    const schema = 'string' satisfies Schema
    const result = parseBaseSchemaSubject(schema, 'x')

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<string>(unknownX as typeof result.data)
    // @ts-expect-error 'string' is not assignable to parameter of type 'number'
    check<number>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: string?', () => {
    const schema = 'string?' satisfies Schema
    const result = parseBaseSchemaSubject(schema, 'x')

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<string | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'string | undefined' is not assignable to parameter of type 'string'
    check<string>(unknownX as typeof result.data)
  })

  /* number/number? */

  it('parseBaseSchemaSubject: number', () => {
    const schema = 'number' satisfies Schema
    const result = parseBaseSchemaSubject(schema, 0)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<number>(unknownX as typeof result.data)
    // @ts-expect-error type 'number' is not assignable to parameter of type 'string'
    check<string>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: number?', () => {
    const schema = 'number?' satisfies Schema
    const result = parseBaseSchemaSubject(schema, 0)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<number | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'number | undefined' is not assignable to parameter of type 'number'
    check<number>(unknownX as typeof result.data)
  })

  /* boolean/boolean? */

  it('parseBaseSchemaSubject: boolean', () => {
    const schema = 'boolean' satisfies Schema
    const result = parseBaseSchemaSubject(schema, true)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<boolean>(unknownX as typeof result.data)
    // @ts-expect-error type 'boolean' is not assignable to parameter of type 'string'
    check<string>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: boolean?', () => {
    const schema = 'boolean?' satisfies Schema
    const result = parseBaseSchemaSubject(schema, true)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<boolean | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'boolean | undefined' is not assignable to parameter of type 'boolean'
    check<boolean>(unknownX as typeof result.data)
  })
})

describe('Parse base STRING detailed schema', () => {
  it('parseBaseSchemaSubject: required schema with valid subject', () => {
    const schema = { type: 'string' } as const satisfies Schema
    const subject = 'x'

    expect(parseBaseSchemaSubject(schema, subject).data).toBe('x')
    expect(parseBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: required schema with invalid subject', () => {
    const schema = { type: 'string' } as const satisfies Schema

    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const numberSubj = 0

    expect(parseBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })

    const booleanSubj = true

    expect(parseBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })
  })

  it('parseBaseSchemaSubject: default schema property should be skipped in required schema', () => {
    const schema = { type: 'string', default: 'x' } as const satisfies Schema
    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const nullSubj = null

    expect(parseBaseSchemaSubject(schema, nullSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, nullSubj).error).toEqual({
      ...error,
      subject: nullSubj,
    })

    const numberSubj = 0

    expect(parseBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })
  })

  it('parseBaseSchemaSubject: optional schema with valid subject', () => {
    const schema = { type: 'string', optional: true } as const satisfies Schema
    const stringSubj = 'x'

    expect(parseBaseSchemaSubject(schema, stringSubj).data).toBe(stringSubj)
    expect(parseBaseSchemaSubject(schema, stringSubj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: optional schema with invalid subject', () => {
    const schema = { type: 'string', optional: true } as const satisfies Schema
    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const numberSubj = 0

    expect(parseBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })

    const booleanSubj = true

    expect(parseBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })
  })

  it('parseBaseSchemaSubject: optional default schema with valid subject', () => {
    const schema = {
      type: 'string',
      optional: true,
      default: 'DEFAULT_VALUE',
    } as const satisfies Schema

    const stringSubj = 'x'

    expect(parseBaseSchemaSubject(schema, stringSubj).data).toBe(stringSubj)
    expect(parseBaseSchemaSubject(schema, stringSubj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      schema.default
    )
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toBe(undefined)

    const nullSubj = null

    expect(parseBaseSchemaSubject(schema, nullSubj).data).toBe(schema.default)
    expect(parseBaseSchemaSubject(schema, nullSubj).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: optional default schema with invalid subject', () => {
    const schema = {
      type: 'string',
      optional: true,
      default: 'DEFAULT_VALUE',
    } as const satisfies Schema

    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const numberSubj = 0

    expect(parseBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })

    const booleanSubj = true

    expect(parseBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })
  })

  it('parseBaseSchemaSubject: minLength schema with valid subject', () => {
    const schema = {
      type: 'string',
      minLength: 0,
    } as const satisfies Schema

    const subject = ''

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(subject)
    expect(parseBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: minLength schema with invalid subject', () => {
    const schema = {
      type: 'string',
      minLength: 1,
    } as const satisfies Schema

    const subject = ''

    const error = {
      code: PARSE_ERROR_CODE.minRange,
      schema,
      subject,
    } satisfies BaseSchemaParseError

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('parseBaseSchemaSubject: maxLength schema with valid subject', () => {
    const schema = {
      type: 'string',
      maxLength: 0,
    } as const satisfies Schema

    const subject = ''

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(subject)
    expect(parseBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: minLength schema with invalid subject', () => {
    const schema = {
      type: 'string',
      maxLength: 0,
    } as const satisfies Schema

    const subject = 'x'

    const error = {
      code: PARSE_ERROR_CODE.maxRange,
      schema,
      subject,
    } satisfies BaseSchemaParseError

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('parseBaseSchemaSubject: invalid default value in the context of minLength', () => {
    const defaultValue = ''

    const schema = {
      type: 'string',
      optional: true,
      minLength: 1,
      default: defaultValue,
    } as const satisfies Schema

    const subject = undefined

    const error = {
      code: PARSE_ERROR_CODE.schemaDefaultMinRange,
      subject: defaultValue,
      schema,
    } satisfies BaseSchemaParseError

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('parseBaseSchemaSubject: invalid default value in the context of maxLength', () => {
    const defaultValue = 'x'

    const schema = {
      type: 'string',
      optional: true,
      maxLength: 0,
      default: defaultValue,
    } as const satisfies Schema

    const subject = undefined

    const error = {
      code: PARSE_ERROR_CODE.schemaDefaultMaxRange,
      subject: defaultValue,
      schema,
    } satisfies BaseSchemaParseError

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })
})

describe('Parse base NUMBER detailed schema', () => {
  it('parseBaseSchemaSubject: required schema with valid subject', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const subject = 0

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(0)
    expect(parseBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: required schema with invalid subject', () => {
    const schema = { type: 'number' } as const satisfies Schema

    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const stringSubj = 'x'

    expect(parseBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })

    const booleanSubj = true

    expect(parseBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })
  })

  it('parseBaseSchemaSubject: default schema property should be skipped in required schema', () => {
    const schema = { type: 'number', default: 0 } as const satisfies Schema
    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const nullSubj = null

    expect(parseBaseSchemaSubject(schema, nullSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, nullSubj).error).toEqual({
      ...error,
      subject: nullSubj,
    })

    const stringSubject = 'x'

    expect(parseBaseSchemaSubject(schema, stringSubject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, stringSubject).error).toEqual({
      ...error,
      subject: stringSubject,
    })
  })

  it('parseBaseSchemaSubject: optional schema with valid subject', () => {
    const schema = { type: 'number', optional: true } as const satisfies Schema
    const numberSubj = 0

    expect(parseBaseSchemaSubject(schema, numberSubj).data).toBe(numberSubj)
    expect(parseBaseSchemaSubject(schema, numberSubj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: optional schema with invalid subject', () => {
    const schema = { type: 'number', optional: true } as const satisfies Schema
    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const stringSubj = 'x'

    expect(parseBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })

    const booleanSubj = true

    expect(parseBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })
  })

  it('parseBaseSchemaSubject: optional default schema with valid subject', () => {
    const schema = {
      type: 'number',
      optional: true,
      default: 0,
    } as const satisfies Schema

    const numberSubj = 1

    expect(parseBaseSchemaSubject(schema, numberSubj).data).toBe(numberSubj)
    expect(parseBaseSchemaSubject(schema, numberSubj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      schema.default
    )
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toBe(undefined)

    const nullSubj = null

    expect(parseBaseSchemaSubject(schema, nullSubj).data).toBe(schema.default)
    expect(parseBaseSchemaSubject(schema, nullSubj).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: optional default schema with invalid subject', () => {
    const schema = {
      type: 'number',
      optional: true,
      default: 0,
    } as const satisfies Schema

    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const stringSubj = 'x'

    expect(parseBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })

    const booleanSubj = true

    expect(parseBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })
  })

  it('parseBaseSchemaSubject: min schema with valid subject', () => {
    const schema = {
      type: 'number',
      min: 0,
    } as const satisfies Schema

    const subject = 0

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(subject)
    expect(parseBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: min schema with invalid subject', () => {
    const schema = {
      type: 'number',
      min: 1,
    } as const satisfies Schema

    const subject = 0

    const error = {
      code: PARSE_ERROR_CODE.minRange,
      schema,
      subject,
    } satisfies BaseSchemaParseError

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('parseBaseSchemaSubject: max schema with valid subject', () => {
    const schema = {
      type: 'number',
      max: 0,
    } as const satisfies Schema

    const subject = 0

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(subject)
    expect(parseBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: min schema with invalid subject', () => {
    const schema = {
      type: 'number',
      max: 0,
    } as const satisfies Schema

    const subject = 1

    const error = {
      code: PARSE_ERROR_CODE.maxRange,
      schema,
      subject,
    } satisfies BaseSchemaParseError

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('parseBaseSchemaSubject: invalid default value in the context of min', () => {
    const defaultValue = 0

    const schema = {
      type: 'number',
      optional: true,
      min: 1,
      default: defaultValue,
    } as const satisfies Schema

    const subject = undefined

    const error = {
      code: PARSE_ERROR_CODE.schemaDefaultMinRange,
      subject: defaultValue,
      schema,
    } satisfies BaseSchemaParseError

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('parseBaseSchemaSubject: invalid default value in the context of max', () => {
    const defaultValue = 1

    const schema = {
      type: 'number',
      optional: true,
      max: 0,
      default: defaultValue,
    } as const satisfies Schema

    const subject = undefined

    const error = {
      code: PARSE_ERROR_CODE.schemaDefaultMaxRange,
      subject: defaultValue,
      schema,
    } satisfies BaseSchemaParseError

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('parseBaseSchemaSubject: subject `NaN`', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const subject = NaN
    const error = {
      code: PARSE_ERROR_CODE.NaN,
      schema,
      subject,
    } satisfies BaseSchemaParseError

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('parseBaseSchemaSubject: subject `Infinity`', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const subject = Infinity
    const error = {
      code: PARSE_ERROR_CODE.infinity,
      schema,
      subject,
    } satisfies BaseSchemaParseError

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('parseBaseSchemaSubject: subject `-Infinity`', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const subject = -Infinity
    const error = {
      code: PARSE_ERROR_CODE.infinity,
      schema,
      subject,
    } satisfies BaseSchemaParseError

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })
})

describe('Parse base BOOLEAN detailed schema', () => {
  it('parseBaseSchemaSubject: required schema with valid subject', () => {
    const schema = { type: 'boolean' } as const satisfies Schema
    const subject = false

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(false)
    expect(parseBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: required schema with invalid subject', () => {
    const schema = { type: 'boolean' } as const satisfies Schema

    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const stringSubj = 'x'

    expect(parseBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })

    const numberSubj = 0

    expect(parseBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })
  })

  it('parseBaseSchemaSubject: default schema property should be skipped in required schema', () => {
    const schema = { type: 'boolean', default: false } as const satisfies Schema
    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const nullSubj = null

    expect(parseBaseSchemaSubject(schema, nullSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, nullSubj).error).toEqual({
      ...error,
      subject: nullSubj,
    })

    const stringSubject = 'x'

    expect(parseBaseSchemaSubject(schema, stringSubject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, stringSubject).error).toEqual({
      ...error,
      subject: stringSubject,
    })
  })

  it('parseBaseSchemaSubject: optional schema with valid subject', () => {
    const schema = { type: 'boolean', optional: true } as const satisfies Schema
    const booleanSubj = false

    expect(parseBaseSchemaSubject(schema, booleanSubj).data).toBe(booleanSubj)
    expect(parseBaseSchemaSubject(schema, booleanSubj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: optional schema with invalid subject', () => {
    const schema = { type: 'boolean', optional: true } as const satisfies Schema
    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const stringSubj = 'x'

    expect(parseBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })

    const numberSubj = 0

    expect(parseBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })
  })
})

describe('Parse base STRING UNION detailed schema', () => {
  it('parseBaseSchemaSubject: required schema with valid subject', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
    } as const satisfies Schema

    const subjectX = 'x'

    expect(parseBaseSchemaSubject(schema, subjectX).data).toBe(subjectX)
    expect(parseBaseSchemaSubject(schema, subjectX).error).toBe(undefined)

    const subjectY = 'y'

    expect(parseBaseSchemaSubject(schema, subjectY).data).toBe(subjectY)
    expect(parseBaseSchemaSubject(schema, subjectY).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: required schema with invalid subject', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
    } as const satisfies Schema

    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const numberSubj = 0

    expect(parseBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })

    const booleanSubj = true

    expect(parseBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })

    const stringZSubj = 'z'

    expect(parseBaseSchemaSubject(schema, stringZSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, stringZSubj).error).toEqual({
      ...error,
      code: PARSE_ERROR_CODE.notInUnion,
      subject: stringZSubj,
    })
  })

  it('parseBaseSchemaSubject: default schema property should be skipped in required schema', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
      default: 'x',
    } as const satisfies Schema

    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const nullSubj = null

    expect(parseBaseSchemaSubject(schema, nullSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, nullSubj).error).toEqual({
      ...error,
      subject: nullSubj,
    })

    const numberSubj = 0

    expect(parseBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })
  })

  it('parseBaseSchemaSubject: optional schema with valid subject', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
      optional: true,
    } as const satisfies Schema
    const stringXSubj = 'x'

    expect(parseBaseSchemaSubject(schema, stringXSubj).data).toBe(stringXSubj)
    expect(parseBaseSchemaSubject(schema, stringXSubj).error).toBe(undefined)

    const stringYSubj = 'y'

    expect(parseBaseSchemaSubject(schema, stringYSubj).data).toBe(stringYSubj)
    expect(parseBaseSchemaSubject(schema, stringYSubj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toBe(undefined)

    const nullSubj = null

    expect(parseBaseSchemaSubject(schema, nullSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, nullSubj).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: optional schema with invalid subject', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
      optional: true,
    } as const satisfies Schema

    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const numberSubj = 0

    expect(parseBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })

    const booleanSubj = true

    expect(parseBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })

    const stringZSubj = 'z'

    expect(parseBaseSchemaSubject(schema, stringZSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, stringZSubj).error).toEqual({
      ...error,
      code: PARSE_ERROR_CODE.notInUnion,
      subject: stringZSubj,
    })
  })

  it('parseBaseSchemaSubject: optional default schema with valid subject', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
      optional: true,
      default: 'y',
    } as const satisfies Schema

    const stringSubj = 'x'

    expect(parseBaseSchemaSubject(schema, stringSubj).data).toBe(stringSubj)
    expect(parseBaseSchemaSubject(schema, stringSubj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      schema.default
    )
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toBe(undefined)

    const nullSubj = null

    expect(parseBaseSchemaSubject(schema, nullSubj).data).toBe(schema.default)
    expect(parseBaseSchemaSubject(schema, nullSubj).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: optional default schema with invalid subject', () => {
    const schema = {
      type: 'stringUnion',
      optional: true,
      of: ['x', 'y'],
      default: 'y',
    } as const satisfies Schema

    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const numberSubj = 0

    expect(parseBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })

    const booleanSubj = true

    expect(parseBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })
  })

  it('parseBaseSchemaSubject: invalid default value (NotInUnion)', () => {
    const defaultValue = 'z'

    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
      optional: true,
      default: defaultValue,
    } as const satisfies Schema

    const subject = undefined

    const error = {
      code: PARSE_ERROR_CODE.schemaDefaultNotInUnion,
      subject: defaultValue,
      schema,
    } satisfies BaseSchemaParseError

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })
})

describe('Parse base NUMBER UNION detailed schema', () => {
  it('parseBaseSchemaSubject: required schema with valid subject', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
    } as const satisfies Schema

    const subject0 = 0

    expect(parseBaseSchemaSubject(schema, subject0).data).toBe(subject0)
    expect(parseBaseSchemaSubject(schema, subject0).error).toBe(undefined)

    const subject1 = 1

    expect(parseBaseSchemaSubject(schema, subject1).data).toBe(subject1)
    expect(parseBaseSchemaSubject(schema, subject1).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: required schema with invalid subject', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
    } as const satisfies Schema

    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const stringSubj = 'x'

    expect(parseBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })

    const booleanSubj = true

    expect(parseBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })

    const number2Subj = 2

    expect(parseBaseSchemaSubject(schema, number2Subj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, number2Subj).error).toEqual({
      ...error,
      code: PARSE_ERROR_CODE.notInUnion,
      subject: number2Subj,
    })
  })

  it('parseBaseSchemaSubject: default schema property should be skipped in required schema', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
      default: 0,
    } as const satisfies Schema

    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const nullSubj = null

    expect(parseBaseSchemaSubject(schema, nullSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, nullSubj).error).toEqual({
      ...error,
      subject: nullSubj,
    })

    const stringSubj = 'x'

    expect(parseBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })
  })

  it('parseBaseSchemaSubject: optional schema with valid subject', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
      optional: true,
    } as const satisfies Schema

    const number0Subj = 0

    expect(parseBaseSchemaSubject(schema, number0Subj).data).toBe(number0Subj)
    expect(parseBaseSchemaSubject(schema, number0Subj).error).toBe(undefined)

    const number1Subj = 1

    expect(parseBaseSchemaSubject(schema, number1Subj).data).toBe(number1Subj)
    expect(parseBaseSchemaSubject(schema, number1Subj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toBe(undefined)

    const nullSubj = null

    expect(parseBaseSchemaSubject(schema, nullSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, nullSubj).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: optional schema with invalid subject', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
      optional: true,
    } as const satisfies Schema

    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const stringSubj = 'x'

    expect(parseBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })

    const booleanSubj = true

    expect(parseBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })

    const number2Subj = 2

    expect(parseBaseSchemaSubject(schema, number2Subj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, number2Subj).error).toEqual({
      ...error,
      code: PARSE_ERROR_CODE.notInUnion,
      subject: number2Subj,
    })
  })

  it('parseBaseSchemaSubject: optional default schema with valid subject', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
      optional: true,
      default: 0,
    } as const satisfies Schema

    const numberSubj = 0

    expect(parseBaseSchemaSubject(schema, numberSubj).data).toBe(numberSubj)
    expect(parseBaseSchemaSubject(schema, numberSubj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(parseBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      schema.default
    )
    expect(parseBaseSchemaSubject(schema, undefinedSubj).error).toBe(undefined)

    const nullSubj = null

    expect(parseBaseSchemaSubject(schema, nullSubj).data).toBe(schema.default)
    expect(parseBaseSchemaSubject(schema, nullSubj).error).toBe(undefined)
  })

  it('parseBaseSchemaSubject: optional default schema with invalid subject', () => {
    const schema = {
      type: 'numberUnion',
      optional: true,
      of: [0, 1],
      default: 0,
    } as const satisfies Schema

    const error = {
      code: PARSE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaParseError, 'subject'>

    const stringSubj = 'x'

    expect(parseBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })

    const booleanSubj = true

    expect(parseBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })
  })

  it('parseBaseSchemaSubject: invalid default value (NotInUnion)', () => {
    const defaultValue = 2

    const schema = {
      type: 'numberUnion',
      of: [0, 1],
      optional: true,
      default: defaultValue,
    } as const satisfies Schema

    const subject = undefined

    const error = {
      code: PARSE_ERROR_CODE.schemaDefaultNotInUnion,
      subject: defaultValue,
      schema,
    } satisfies BaseSchemaParseError

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })
})

describe('Parse base detailed schema TYPE INFERENCE check', () => {
  /* string required/optional/default */

  it('parseBaseSchemaSubject: string required', () => {
    const schema = { type: 'string' } as const satisfies Schema
    const result = parseBaseSchemaSubject(schema, 'x')

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<string>(unknownX as typeof result.data)
    // @ts-expect-error 'string' is not assignable to parameter of type 'number'
    check<number>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: string optional', () => {
    const schema = { type: 'string', optional: true } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<string | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'string | undefined' is not 'number | undefined'
    check<number | undefined>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: string optional default', () => {
    const schema = {
      type: 'string',
      optional: true,
      default: 'x',
    } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<string>(unknownX as typeof result.data)
    // @ts-expect-error 'string' is not assignable to parameter of type 'number'
    check<number>(unknownX as typeof result.data)
  })

  /* number required/optional/default */

  it('parseBaseSchemaSubject: number required', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const result = parseBaseSchemaSubject(schema, 0)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<number>(unknownX as typeof result.data)
    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    check<string>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: number optional', () => {
    const schema = { type: 'number', optional: true } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<number | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'number | undefined' is not 'string | undefined'
    check<string | undefined>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: number optional default', () => {
    const schema = {
      type: 'number',
      optional: true,
      default: 0,
    } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<number>(unknownX as typeof result.data)
    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    check<string>(unknownX as typeof result.data)
  })

  /* boolean required/optional/default */

  it('parseBaseSchemaSubject: boolean required', () => {
    const schema = { type: 'boolean' } as const satisfies Schema
    const result = parseBaseSchemaSubject(schema, false)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<boolean>(unknownX as typeof result.data)
    // @ts-expect-error 'boolean' is not assignable to parameter of type 'string'
    check<string>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: boolean optional', () => {
    const schema = { type: 'boolean', optional: true } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<boolean | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'boolean | undefined' is not 'string | undefined'
    check<string | undefined>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: boolean optional default', () => {
    const schema = {
      type: 'boolean',
      optional: true,
      default: false,
    } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<boolean>(unknownX as typeof result.data)
    // @ts-expect-error 'boolean' is not assignable to parameter of type 'string'
    check<string>(unknownX as typeof result.data)
  })

  /* stringUnion required/optional/default */

  it('parseBaseSchemaSubject: stringUnion required', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
    } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, 'x')

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<'x' | 'y'>(unknownX as typeof result.data)
    // @ts-expect-error '"x" | "y"' is not assignable to parameter of type '"x"'
    check<'x'>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: stringUnion optional', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
      optional: true,
    } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<'x' | 'y' | undefined>(unknownX as typeof result.data)
    // @ts-expect-error '"x" | "y" | undefined' is not '"x" | "y"'
    check<'x' | 'y'>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: stringUnion optional default', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
      optional: true,
      default: 'x',
    } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<'x' | 'y'>(unknownX as typeof result.data)
    // @ts-expect-error '"x" | "y"' is not assignable to parameter of type '"x"'
    check<'x'>(unknownX as typeof result.data)
  })

  /* numberUnion required/optional/default */

  it('parseBaseSchemaSubject: numberUnion required', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
    } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, 0)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<0 | 1>(unknownX as typeof result.data)
    // @ts-expect-error '0 | 1' is not assignable to parameter of type '0'
    check<0>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: numberUnion optional', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
      optional: true,
    } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<0 | 1 | undefined>(unknownX as typeof result.data)
    // @ts-expect-error '0 | 1 | undefined' is not  '0 | 1'
    check<0 | 1>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: numberUnion optional default', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
      optional: true,
      default: 0,
    } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaParseError>(unknownX as typeof result.error)
      check<BaseSchemaParseError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaParseError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<0 | 1>(unknownX as typeof result.data)
    // @ts-expect-error  '0 | 1' is not assignable to parameter of type '0'
    check<0>(unknownX as typeof result.data)
  })
})
