import { VALIDATE_ERROR_CODE } from '../error'
import { validateBaseSchemaSubject } from '../base-schema-validator'
import { check, unknownX } from './test-utils'

import type { BaseSchemaValidateError } from '../error'
import type { Schema } from '../types/compound-schema-types'

describe('Validate base short schema with valid subject', () => {
  it('validateBaseSchemaSubject: subject `"x"` - schema `"string"`', () => {
    expect(validateBaseSchemaSubject('string', 'x').data).toBe('x')
    expect(validateBaseSchemaSubject('string', 'x').error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: subject `"x"` - schema `"string?"`', () => {
    expect(validateBaseSchemaSubject('string', 'x').data).toBe('x')
    expect(validateBaseSchemaSubject('string', 'x').error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: subject `0` - schema `"number"`', () => {
    expect(validateBaseSchemaSubject('number', 0).data).toBe(0)
    expect(validateBaseSchemaSubject('number', 0).error).toBe(undefined)
  })
  it('validateBaseSchemaSubject: subject `0` - schema `"number?"`', () => {
    expect(validateBaseSchemaSubject('number', 0).data).toBe(0)
    expect(validateBaseSchemaSubject('number', 0).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: subject `true` - schema `"boolean"`', () => {
    expect(validateBaseSchemaSubject('boolean', true).data).toBe(true)
    expect(validateBaseSchemaSubject('boolean', true).error).toBe(undefined)
  })
  it('validateBaseSchemaSubject: subject `true` - schema `"boolean?"`', () => {
    expect(validateBaseSchemaSubject('boolean', true).data).toBe(true)
    expect(validateBaseSchemaSubject('boolean', true).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: subject `false` - schema `"boolean"`', () => {
    expect(validateBaseSchemaSubject('boolean', false).data).toBe(false)
    expect(validateBaseSchemaSubject('boolean', false).error).toBe(undefined)
  })
  it('validateBaseSchemaSubject: subject `false` - schema `"boolean?"`', () => {
    expect(validateBaseSchemaSubject('boolean', false).data).toBe(false)
    expect(validateBaseSchemaSubject('boolean', false).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: subject `Buffer` - schema `"buffer"`', () => {
    expect(
      Buffer.isBuffer(
        validateBaseSchemaSubject('buffer', Buffer.from('x')).data
      )
    ).toBe(true)
    expect(validateBaseSchemaSubject('buffer', Buffer.from('x')).error).toBe(
      undefined
    )
  })
  it('validateBaseSchemaSubject: subject `Buffer` - schema `"buffer?"`', () => {
    expect(
      Buffer.isBuffer(
        validateBaseSchemaSubject('buffer?', Buffer.from('x')).data
      )
    ).toBe(true)
    expect(validateBaseSchemaSubject('buffer?', Buffer.from('x')).error).toBe(
      undefined
    )
  })
})

describe('Validate base short schema with `null | undefined` subject', () => {
  /* string | string? */

  it('validateBaseSchemaSubject: subject `undefined` - schema `"string"`', () => {
    const schema = 'string' satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `undefined` - schema `"string?"`', () => {
    const schema = 'string?' satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  it('validateBaseSchemaSubject: subject `null` - schema `"string"`', () => {
    const schema = 'string' satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `null` - schema `"string?"`', () => {
    const schema = 'string?' satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  /* number | number? */

  it('validateBaseSchemaSubject: subject `undefined` - schema `"number"`', () => {
    const schema = 'number' satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `undefined` - schema `"number?"`', () => {
    const schema = 'number?' satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  it('validateBaseSchemaSubject: subject `null` - schema `"number"`', () => {
    const schema = 'number' satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `null` - schema `"number?"`', () => {
    const schema = 'number?' satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  /* boolean | boolean? */

  it('validateBaseSchemaSubject: subject `undefined` - schema `"number"`', () => {
    const schema = 'number' satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `undefined` - schema `"number?"`', () => {
    const schema = 'number?' satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  it('validateBaseSchemaSubject: subject `null` - schema `"number"`', () => {
    const schema = 'number' satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `null` - schema `"number?"`', () => {
    const schema = 'number?' satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  /* boolean | boolean? */

  it('validateBaseSchemaSubject: subject `undefined` - schema `"boolean"`', () => {
    const schema = 'boolean' satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `undefined` - schema `"boolean?"`', () => {
    const schema = 'boolean?' satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  it('validateBaseSchemaSubject: subject `null` - schema `"boolean"`', () => {
    const schema = 'boolean' satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `null` - schema `"boolean?"`', () => {
    const schema = 'boolean?' satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  /* buffer | buffer? */

  it('validateBaseSchemaSubject: subject `undefined` - schema `"buffer"`', () => {
    const schema = 'buffer' satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `undefined` - schema `"buffer?"`', () => {
    const schema = 'buffer?' satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  it('validateBaseSchemaSubject: subject `null` - schema `"buffer"`', () => {
    const schema = 'buffer' satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `null` - schema `"buffer?"`', () => {
    const schema = 'buffer?' satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })
})

describe('Number base schema invalid subject validation special cases', () => {
  it('validateBaseSchemaSubject: subject `NaN` - schema `"number"`', () => {
    const schema = 'number' satisfies Schema
    const subject = NaN
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.NaN,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `NaN` - schema `"number?"`', () => {
    const schema = 'number?' satisfies Schema
    const subject = NaN
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.NaN,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `Infinity` - schema `"number"`', () => {
    const schema = 'number' satisfies Schema
    const subject = Infinity
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.infinity,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `Infinity` - schema `"number?"`', () => {
    const schema = 'number?' satisfies Schema
    const subject = Infinity
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.infinity,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `-Infinity` - schema `"number"`', () => {
    const schema = 'number' satisfies Schema
    const subject = -Infinity
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.infinity,
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `-Infinity` - schema `"number?"`', () => {
    const schema = 'number?' satisfies Schema
    const subject = -Infinity
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: VALIDATE_ERROR_CODE.infinity,
      schema,
      subject,
    })
  })
})

describe('Validate base short schema TYPE INFERENCE check', () => {
  /* string/string? */

  it('validateBaseSchemaSubject: string', () => {
    const schema = 'string' satisfies Schema
    const result = validateBaseSchemaSubject(schema, 'x')

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<string>(unknownX as typeof result.data)
    // @ts-expect-error 'string' is not assignable to parameter of type 'number'
    check<number>(unknownX as typeof result.data)
  })

  it('validateBaseSchemaSubject: string?', () => {
    const schema = 'string?' satisfies Schema
    const result = validateBaseSchemaSubject(schema, 'x')

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<string | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'string | undefined' is not assignable to parameter of type 'string'
    check<string>(unknownX as typeof result.data)
  })

  /* number/number? */

  it('validateBaseSchemaSubject: number', () => {
    const schema = 'number' satisfies Schema
    const result = validateBaseSchemaSubject(schema, 0)

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<number>(unknownX as typeof result.data)
    // @ts-expect-error type 'number' is not assignable to parameter of type 'string'
    check<string>(unknownX as typeof result.data)
  })

  it('validateBaseSchemaSubject: number?', () => {
    const schema = 'number?' satisfies Schema
    const result = validateBaseSchemaSubject(schema, 0)

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<number | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'number | undefined' is not assignable to parameter of type 'number'
    check<number>(unknownX as typeof result.data)
  })

  /* boolean/boolean? */

  it('validateBaseSchemaSubject: boolean', () => {
    const schema = 'boolean' satisfies Schema
    const result = validateBaseSchemaSubject(schema, true)

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<boolean>(unknownX as typeof result.data)
    // @ts-expect-error type 'boolean' is not assignable to parameter of type 'string'
    check<string>(unknownX as typeof result.data)
  })

  it('validateBaseSchemaSubject: boolean?', () => {
    const schema = 'boolean?' satisfies Schema
    const result = validateBaseSchemaSubject(schema, true)

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<boolean | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'boolean | undefined' is not assignable to parameter of type 'boolean'
    check<boolean>(unknownX as typeof result.data)
  })

  /* buffer/buffer? */

  it('validateBaseSchemaSubject: buffer', () => {
    const schema = 'buffer' satisfies Schema
    const result = validateBaseSchemaSubject(schema, Buffer.from('x'))

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: Buffer }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<Buffer>(unknownX as typeof result.data)
    // @ts-expect-error type 'Buffer' is not assignable to parameter of type 'string'
    check<string>(unknownX as typeof result.data)
  })

  it('validateBaseSchemaSubject: buffer?', () => {
    const schema = 'buffer?' satisfies Schema
    const result = validateBaseSchemaSubject(schema, Buffer.from('x'))

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: Buffer }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<Buffer | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'Buffer | undefined' is not assignable to parameter of type 'Buffer'
    check<Buffer>(unknownX as typeof result.data)
  })
})

describe('Validate base STRING detailed schema', () => {
  it('validateBaseSchemaSubject: required schema with valid subject', () => {
    const schema = { type: 'string' } as const satisfies Schema
    const subject = 'x'

    expect(validateBaseSchemaSubject(schema, subject).data).toBe('x')
    expect(validateBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: required schema with invalid subject', () => {
    const schema = { type: 'string' } as const satisfies Schema

    const error = {
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaValidateError, 'subject'>

    const undefinedSubj = undefined

    expect(validateBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      undefined
    )
    expect(validateBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const numberSubj = 0

    expect(validateBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })

    const booleanSubj = true

    expect(validateBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })

    const bufferSubj = Buffer.from('x')

    expect(validateBaseSchemaSubject(schema, bufferSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, bufferSubj).error).toEqual({
      ...error,
      subject: bufferSubj,
    })
  })

  it('validateBaseSchemaSubject: optional schema with valid subject', () => {
    const schema = { type: 'string', optional: true } as const satisfies Schema
    const stringSubj = 'x'

    expect(validateBaseSchemaSubject(schema, stringSubj).data).toBe(stringSubj)
    expect(validateBaseSchemaSubject(schema, stringSubj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(validateBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      undefined
    )
    expect(validateBaseSchemaSubject(schema, undefinedSubj).error).toBe(
      undefined
    )
  })

  it('validateBaseSchemaSubject: optional schema with invalid subject', () => {
    const schema = { type: 'string', optional: true } as const satisfies Schema
    const error = {
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaValidateError, 'subject'>

    const numberSubj = 0

    expect(validateBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })

    const booleanSubj = true

    expect(validateBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })
  })

  it('validateBaseSchemaSubject: minLength schema with valid subject', () => {
    const schema = {
      type: 'string',
      minLength: 0,
    } as const satisfies Schema

    const subject = ''

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(subject)
    expect(validateBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: minLength schema with invalid subject', () => {
    const schema = {
      type: 'string',
      minLength: 1,
    } as const satisfies Schema

    const subject = ''

    const error = {
      code: VALIDATE_ERROR_CODE.minRange,
      schema,
      subject,
    } satisfies BaseSchemaValidateError

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('validateBaseSchemaSubject: maxLength schema with valid subject', () => {
    const schema = {
      type: 'string',
      maxLength: 0,
    } as const satisfies Schema

    const subject = ''

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(subject)
    expect(validateBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: minLength schema with invalid subject', () => {
    const schema = {
      type: 'string',
      maxLength: 0,
    } as const satisfies Schema

    const subject = 'x'

    const error = {
      code: VALIDATE_ERROR_CODE.maxRange,
      schema,
      subject,
    } satisfies BaseSchemaValidateError

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, subject).error).toEqual(error)
  })
})

describe('Validate base NUMBER detailed schema', () => {
  it('validateBaseSchemaSubject: required schema with valid subject', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const subject = 0

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(0)
    expect(validateBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: required schema with invalid subject', () => {
    const schema = { type: 'number' } as const satisfies Schema

    const error = {
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaValidateError, 'subject'>

    const undefinedSubj = undefined

    expect(validateBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      undefined
    )
    expect(validateBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const stringSubj = 'x'

    expect(validateBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })

    const booleanSubj = true

    expect(validateBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })

    const bufferSubj = Buffer.from('x')

    expect(validateBaseSchemaSubject(schema, bufferSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, bufferSubj).error).toEqual({
      ...error,
      subject: bufferSubj,
    })
  })

  it('validateBaseSchemaSubject: optional schema with valid subject', () => {
    const schema = { type: 'number', optional: true } as const satisfies Schema
    const numberSubj = 0

    expect(validateBaseSchemaSubject(schema, numberSubj).data).toBe(numberSubj)
    expect(validateBaseSchemaSubject(schema, numberSubj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(validateBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      undefined
    )
    expect(validateBaseSchemaSubject(schema, undefinedSubj).error).toBe(
      undefined
    )
  })

  it('validateBaseSchemaSubject: optional schema with invalid subject', () => {
    const schema = { type: 'number', optional: true } as const satisfies Schema
    const error = {
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaValidateError, 'subject'>

    const stringSubj = 'x'

    expect(validateBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })

    const booleanSubj = true

    expect(validateBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })
  })

  it('validateBaseSchemaSubject: min schema with valid subject', () => {
    const schema = {
      type: 'number',
      min: 0,
    } as const satisfies Schema

    const subject = 0

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(subject)
    expect(validateBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: min schema with invalid subject', () => {
    const schema = {
      type: 'number',
      min: 1,
    } as const satisfies Schema

    const subject = 0

    const error = {
      code: VALIDATE_ERROR_CODE.minRange,
      schema,
      subject,
    } satisfies BaseSchemaValidateError

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('validateBaseSchemaSubject: max schema with valid subject', () => {
    const schema = {
      type: 'number',
      max: 0,
    } as const satisfies Schema

    const subject = 0

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(subject)
    expect(validateBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: min schema with invalid subject', () => {
    const schema = {
      type: 'number',
      max: 0,
    } as const satisfies Schema

    const subject = 1

    const error = {
      code: VALIDATE_ERROR_CODE.maxRange,
      schema,
      subject,
    } satisfies BaseSchemaValidateError

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('validateBaseSchemaSubject: subject `NaN`', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const subject = NaN
    const error = {
      code: VALIDATE_ERROR_CODE.NaN,
      schema,
      subject,
    } satisfies BaseSchemaValidateError

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('validateBaseSchemaSubject: subject `Infinity`', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const subject = Infinity
    const error = {
      code: VALIDATE_ERROR_CODE.infinity,
      schema,
      subject,
    } satisfies BaseSchemaValidateError

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('validateBaseSchemaSubject: subject `-Infinity`', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const subject = -Infinity
    const error = {
      code: VALIDATE_ERROR_CODE.infinity,
      schema,
      subject,
    } satisfies BaseSchemaValidateError

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, subject).error).toEqual(error)
  })
})

describe('Validate base BOOLEAN detailed schema', () => {
  it('validateBaseSchemaSubject: required schema with valid subject', () => {
    const schema = { type: 'boolean' } as const satisfies Schema
    const subject = false

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(false)
    expect(validateBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: required schema with invalid subject', () => {
    const schema = { type: 'boolean' } as const satisfies Schema

    const error = {
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaValidateError, 'subject'>

    const undefinedSubj = undefined

    expect(validateBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      undefined
    )
    expect(validateBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const stringSubj = 'x'

    expect(validateBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })

    const numberSubj = 0

    expect(validateBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })

    const bufferSubj = Buffer.from('x')

    expect(validateBaseSchemaSubject(schema, bufferSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, bufferSubj).error).toEqual({
      ...error,
      subject: bufferSubj,
    })
  })

  it('validateBaseSchemaSubject: optional schema with valid subject', () => {
    const schema = { type: 'boolean', optional: true } as const satisfies Schema
    const booleanSubj = false

    expect(validateBaseSchemaSubject(schema, booleanSubj).data).toBe(
      booleanSubj
    )
    expect(validateBaseSchemaSubject(schema, booleanSubj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(validateBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      undefined
    )
    expect(validateBaseSchemaSubject(schema, undefinedSubj).error).toBe(
      undefined
    )
  })

  it('validateBaseSchemaSubject: optional schema with invalid subject', () => {
    const schema = { type: 'boolean', optional: true } as const satisfies Schema
    const error = {
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaValidateError, 'subject'>

    const stringSubj = 'x'

    expect(validateBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })

    const numberSubj = 0

    expect(validateBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })
  })
})

describe('Validate base BUFFER detailed schema', () => {
  it('validateBaseSchemaSubject: required schema with valid subject', () => {
    const schema = { type: 'buffer' } as const satisfies Schema
    const subject = Buffer.from('x')

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(subject)
    expect(validateBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: required schema with invalid subject', () => {
    const schema = { type: 'buffer' } as const satisfies Schema

    const error = {
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaValidateError, 'subject'>

    const undefinedSubj = undefined

    expect(validateBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      undefined
    )
    expect(validateBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const numberSubj = 0

    expect(validateBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })

    const booleanSubj = true

    expect(validateBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })

    const stringSubj = 'x'

    expect(validateBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })
  })

  it('validateBaseSchemaSubject: optional schema with valid subject', () => {
    const schema = { type: 'buffer', optional: true } as const satisfies Schema
    const bufferSubj = Buffer.from('x')

    expect(validateBaseSchemaSubject(schema, bufferSubj).data).toBe(bufferSubj)
    expect(validateBaseSchemaSubject(schema, bufferSubj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(validateBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      undefined
    )
    expect(validateBaseSchemaSubject(schema, undefinedSubj).error).toBe(
      undefined
    )
  })

  it('validateBaseSchemaSubject: optional schema with invalid subject', () => {
    const schema = { type: 'buffer', optional: true } as const satisfies Schema
    const error = {
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaValidateError, 'subject'>

    const numberSubj = 0

    expect(validateBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })

    const booleanSubj = true

    expect(validateBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })
  })

  it('validateBaseSchemaSubject: minLength schema with valid subject', () => {
    const schema = {
      type: 'buffer',
      minLength: 1,
    } as const satisfies Schema

    const subject = Buffer.from('x')

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(subject)
    expect(validateBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: minLength schema with invalid subject', () => {
    const schema = {
      type: 'buffer',
      minLength: 2,
    } as const satisfies Schema

    const subject = Buffer.from('x')

    const error = {
      code: VALIDATE_ERROR_CODE.minRange,
      schema,
      subject,
    } satisfies BaseSchemaValidateError

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('validateBaseSchemaSubject: maxLength schema with valid subject', () => {
    const schema = {
      type: 'buffer',
      maxLength: 1,
    } as const satisfies Schema

    const subject = Buffer.from('x')

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(subject)
    expect(validateBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: minLength schema with invalid subject', () => {
    const schema = {
      type: 'buffer',
      maxLength: 1,
    } as const satisfies Schema

    const subject = Buffer.from('xx')

    const error = {
      code: VALIDATE_ERROR_CODE.maxRange,
      schema,
      subject,
    } satisfies BaseSchemaValidateError

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, subject).error).toEqual(error)
  })
})

describe('Validate base STRING UNION detailed schema', () => {
  it('validateBaseSchemaSubject: required schema with valid subject', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
    } as const satisfies Schema

    const subjectX = 'x'

    expect(validateBaseSchemaSubject(schema, subjectX).data).toBe(subjectX)
    expect(validateBaseSchemaSubject(schema, subjectX).error).toBe(undefined)

    const subjectY = 'y'

    expect(validateBaseSchemaSubject(schema, subjectY).data).toBe(subjectY)
    expect(validateBaseSchemaSubject(schema, subjectY).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: required schema with invalid subject', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
    } as const satisfies Schema

    const error = {
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaValidateError, 'subject'>

    const undefinedSubj = undefined

    expect(validateBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      undefined
    )
    expect(validateBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const numberSubj = 0

    expect(validateBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })

    const booleanSubj = true

    expect(validateBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })

    const bufferSubj = Buffer.from('x')

    expect(validateBaseSchemaSubject(schema, bufferSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, bufferSubj).error).toEqual({
      ...error,
      subject: bufferSubj,
    })

    const stringZSubj = 'z'

    expect(validateBaseSchemaSubject(schema, stringZSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, stringZSubj).error).toEqual({
      ...error,
      code: VALIDATE_ERROR_CODE.notInUnion,
      subject: stringZSubj,
    })
  })

  it('validateBaseSchemaSubject: optional schema with valid subject', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
      optional: true,
    } as const satisfies Schema
    const stringXSubj = 'x'

    expect(validateBaseSchemaSubject(schema, stringXSubj).data).toBe(
      stringXSubj
    )
    expect(validateBaseSchemaSubject(schema, stringXSubj).error).toBe(undefined)

    const stringYSubj = 'y'

    expect(validateBaseSchemaSubject(schema, stringYSubj).data).toBe(
      stringYSubj
    )
    expect(validateBaseSchemaSubject(schema, stringYSubj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(validateBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      undefined
    )
    expect(validateBaseSchemaSubject(schema, undefinedSubj).error).toBe(
      undefined
    )
  })

  it('validateBaseSchemaSubject: optional schema with invalid subject', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
      optional: true,
    } as const satisfies Schema

    const error = {
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaValidateError, 'subject'>

    const nullSubj = null

    expect(validateBaseSchemaSubject(schema, nullSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, nullSubj).error).toEqual({
      ...error,
      subject: nullSubj,
    })

    const numberSubj = 0

    expect(validateBaseSchemaSubject(schema, numberSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, numberSubj).error).toEqual({
      ...error,
      subject: numberSubj,
    })

    const booleanSubj = true

    expect(validateBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })

    const stringZSubj = 'z'

    expect(validateBaseSchemaSubject(schema, stringZSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, stringZSubj).error).toEqual({
      ...error,
      code: VALIDATE_ERROR_CODE.notInUnion,
      subject: stringZSubj,
    })
  })
})

describe('Validate base NUMBER UNION detailed schema', () => {
  it('validateBaseSchemaSubject: required schema with valid subject', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
    } as const satisfies Schema

    const subject0 = 0

    expect(validateBaseSchemaSubject(schema, subject0).data).toBe(subject0)
    expect(validateBaseSchemaSubject(schema, subject0).error).toBe(undefined)

    const subject1 = 1

    expect(validateBaseSchemaSubject(schema, subject1).data).toBe(subject1)
    expect(validateBaseSchemaSubject(schema, subject1).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: required schema with invalid subject', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
    } as const satisfies Schema

    const error = {
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaValidateError, 'subject'>

    const undefinedSubj = undefined

    expect(validateBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      undefined
    )
    expect(validateBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const stringSubj = 'x'

    expect(validateBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })

    const booleanSubj = true

    expect(validateBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })

    const bufferSubj = Buffer.from('x')

    expect(validateBaseSchemaSubject(schema, bufferSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, bufferSubj).error).toEqual({
      ...error,
      subject: bufferSubj,
    })

    const number2Subj = 2

    expect(validateBaseSchemaSubject(schema, number2Subj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, number2Subj).error).toEqual({
      ...error,
      code: VALIDATE_ERROR_CODE.notInUnion,
      subject: number2Subj,
    })
  })

  it('validateBaseSchemaSubject: optional schema with valid subject', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
      optional: true,
    } as const satisfies Schema

    const number0Subj = 0

    expect(validateBaseSchemaSubject(schema, number0Subj).data).toBe(
      number0Subj
    )
    expect(validateBaseSchemaSubject(schema, number0Subj).error).toBe(undefined)

    const number1Subj = 1

    expect(validateBaseSchemaSubject(schema, number1Subj).data).toBe(
      number1Subj
    )
    expect(validateBaseSchemaSubject(schema, number1Subj).error).toBe(undefined)

    const undefinedSubj = undefined

    expect(validateBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      undefined
    )
    expect(validateBaseSchemaSubject(schema, undefinedSubj).error).toBe(
      undefined
    )
  })

  it('validateBaseSchemaSubject: optional schema with invalid subject', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
      optional: true,
    } as const satisfies Schema

    const error = {
      code: VALIDATE_ERROR_CODE.invalidType,
      schema,
    } satisfies Omit<BaseSchemaValidateError, 'subject'>

    const nullSubj = null

    expect(validateBaseSchemaSubject(schema, nullSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, nullSubj).error).toEqual({
      ...error,
      subject: nullSubj,
    })

    const stringSubj = 'x'

    expect(validateBaseSchemaSubject(schema, stringSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, stringSubj).error).toEqual({
      ...error,
      subject: stringSubj,
    })

    const booleanSubj = true

    expect(validateBaseSchemaSubject(schema, booleanSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, booleanSubj).error).toEqual({
      ...error,
      subject: booleanSubj,
    })

    const number2Subj = 2

    expect(validateBaseSchemaSubject(schema, number2Subj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, number2Subj).error).toEqual({
      ...error,
      code: VALIDATE_ERROR_CODE.notInUnion,
      subject: number2Subj,
    })
  })
})

describe('Validate base detailed schema TYPE INFERENCE check', () => {
  /* string required/optional */

  it('validateBaseSchemaSubject: string required', () => {
    const schema = { type: 'string' } as const satisfies Schema
    const result = validateBaseSchemaSubject(schema, 'x')

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<string>(unknownX as typeof result.data)
    // @ts-expect-error 'string' is not assignable to parameter of type 'number'
    check<number>(unknownX as typeof result.data)
  })

  it('validateBaseSchemaSubject: string optional', () => {
    const schema = { type: 'string', optional: true } as const satisfies Schema

    const result = validateBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<string | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'string | undefined' is not 'number | undefined'
    check<number | undefined>(unknownX as typeof result.data)
  })

  /* number required/optional */

  it('validateBaseSchemaSubject: number required', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const result = validateBaseSchemaSubject(schema, 0)

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<number>(unknownX as typeof result.data)
    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    check<string>(unknownX as typeof result.data)
  })

  it('validateBaseSchemaSubject: number optional', () => {
    const schema = { type: 'number', optional: true } as const satisfies Schema

    const result = validateBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<number | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'number | undefined' is not 'string | undefined'
    check<string | undefined>(unknownX as typeof result.data)
  })

  /* boolean required/optional */

  it('validateBaseSchemaSubject: boolean required', () => {
    const schema = { type: 'boolean' } as const satisfies Schema
    const result = validateBaseSchemaSubject(schema, false)

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<boolean>(unknownX as typeof result.data)
    // @ts-expect-error 'boolean' is not assignable to parameter of type 'string'
    check<string>(unknownX as typeof result.data)
  })

  it('validateBaseSchemaSubject: boolean optional', () => {
    const schema = { type: 'boolean', optional: true } as const satisfies Schema

    const result = validateBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<boolean | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'boolean | undefined' is not 'string | undefined'
    check<string | undefined>(unknownX as typeof result.data)
  })

  /* buffer required/optional */

  it('validateBaseSchemaSubject: buffer required', () => {
    const schema = { type: 'buffer' } as const satisfies Schema
    const result = validateBaseSchemaSubject(schema, Buffer.from('x'))

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: Buffer }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<Buffer>(unknownX as typeof result.data)
    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'string'
    check<string>(unknownX as typeof result.data)
  })

  it('validateBaseSchemaSubject: buffer optional', () => {
    const schema = { type: 'buffer', optional: true } as const satisfies Schema
    const result = validateBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: Buffer }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<Buffer | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'Buffer | undefined' is not 'string | undefined'
    check<string | undefined>(unknownX as typeof result.data)
  })

  /* stringUnion required/optional */

  it('validateBaseSchemaSubject: stringUnion required', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
    } as const satisfies Schema

    const result = validateBaseSchemaSubject(schema, 'x')

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<'x' | 'y'>(unknownX as typeof result.data)
    // @ts-expect-error '"x" | "y"' is not assignable to parameter of type '"x"'
    check<'x'>(unknownX as typeof result.data)
  })

  it('validateBaseSchemaSubject: stringUnion optional', () => {
    const schema = {
      type: 'stringUnion',
      of: ['x', 'y'],
      optional: true,
    } as const satisfies Schema

    const result = validateBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<'x' | 'y' | undefined>(unknownX as typeof result.data)
    // @ts-expect-error '"x" | "y" | undefined' is not '"x" | "y"'
    check<'x' | 'y'>(unknownX as typeof result.data)
  })

  /* numberUnion required/optional */

  it('validateBaseSchemaSubject: numberUnion required', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
    } as const satisfies Schema

    const result = validateBaseSchemaSubject(schema, 0)

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<0 | 1>(unknownX as typeof result.data)
    // @ts-expect-error '0 | 1' is not assignable to parameter of type '0'
    check<0>(unknownX as typeof result.data)
  })

  it('validateBaseSchemaSubject: numberUnion optional', () => {
    const schema = {
      type: 'numberUnion',
      of: [0, 1],
      optional: true,
    } as const satisfies Schema

    const result = validateBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<BaseSchemaValidateError>(unknownX as typeof result.error)
      check<BaseSchemaValidateError & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<0 | 1 | undefined>(unknownX as typeof result.data)
    // @ts-expect-error '0 | 1 | undefined' is not  '0 | 1'
    check<0 | 1>(unknownX as typeof result.data)
  })
})
