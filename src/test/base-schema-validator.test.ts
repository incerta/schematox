import { ERROR_CODE } from '../error'
import { validateBaseSchemaSubject } from '../base-schema-validator'
import { check, unknownX } from './test-utils'

import type { InvalidSubject } from '../error'
import type { Schema } from '../types/compound-schema-types'

describe('Validate base schema with `null | undefined` subject', () => {
  /* string */

  it('validateBaseSchemaSubject: subject `undefined` - required string', () => {
    const schema = { type: 'string' } satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `undefined` - optional string', () => {
    const schema = { type: 'string', optional: true } satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  it('validateBaseSchemaSubject: subject `null` - required string', () => {
    const schema = { type: 'string' } satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `null` - optional string', () => {
    const schema = { type: 'string', optional: true } satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  /* number */

  it('validateBaseSchemaSubject: subject `undefined` - required number', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `undefined` - optional number', () => {
    const schema = { type: 'number', optional: true } satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  it('validateBaseSchemaSubject: subject `null` - required number', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `null` - optional number', () => {
    const schema = { type: 'number', optional: true } satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  /* boolean */

  it('validateBaseSchemaSubject: subject `undefined` - required number', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `undefined` - optional number', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  it('validateBaseSchemaSubject: subject `null` - required number', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `null` - optional number', () => {
    const schema = { type: 'number', optional: true } satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  /* boolean */

  it('validateBaseSchemaSubject: subject `undefined` - required boolean', () => {
    const schema = { type: 'boolean' } satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `undefined` - optional boolean', () => {
    const schema = { type: 'boolean', optional: true } satisfies Schema
    const subject = undefined
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })

  it('validateBaseSchemaSubject: subject `null` - required boolean', () => {
    const schema = { type: 'boolean' } satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `null` - optional boolean', () => {
    const schema = { type: 'boolean', optional: true } satisfies Schema
    const subject = null
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.data).toBe(undefined)
  })
})

describe('Number base schema invalid subject validation special cases', () => {
  it('validateBaseSchemaSubject: subject `NaN` - required number', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = NaN
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `NaN` - optional number', () => {
    const schema = { type: 'number', optional: true } satisfies Schema
    const subject = NaN
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `Infinity` - required number', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = Infinity
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `Infinity` - optional number', () => {
    const schema = { type: 'number', optional: true } satisfies Schema
    const subject = Infinity
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `-Infinity` - required number', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = -Infinity
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('validateBaseSchemaSubject: subject `-Infinity` - optional number', () => {
    const schema = { type: 'number', optional: true } satisfies Schema
    const subject = -Infinity
    const validated = validateBaseSchemaSubject(schema, subject)

    expect(validated.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
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
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
    } satisfies Omit<InvalidSubject, 'subject'>

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
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
    } satisfies Omit<InvalidSubject, 'subject'>

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
      code: ERROR_CODE.invalidRange,
      path: [],
      schema,
      subject,
    } satisfies InvalidSubject

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
      code: ERROR_CODE.invalidRange,
      path: [],
      schema,
      subject,
    } satisfies InvalidSubject

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
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
    } satisfies Omit<InvalidSubject, 'subject'>

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
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
    } satisfies Omit<InvalidSubject, 'subject'>

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
      code: ERROR_CODE.invalidRange,
      path: [],
      schema,
      subject,
    } satisfies InvalidSubject

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
      code: ERROR_CODE.invalidRange,
      path: [],
      schema,
      subject,
    } satisfies InvalidSubject

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('validateBaseSchemaSubject: subject `NaN`', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const subject = NaN
    const error = {
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    } satisfies InvalidSubject

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('validateBaseSchemaSubject: subject `Infinity`', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const subject = Infinity
    const error = {
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    } satisfies InvalidSubject

    expect(validateBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('validateBaseSchemaSubject: subject `-Infinity`', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const subject = -Infinity
    const error = {
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    } satisfies InvalidSubject

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
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
    } satisfies Omit<InvalidSubject, 'subject'>

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
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
    } satisfies Omit<InvalidSubject, 'subject'>

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

describe('Validate base LITERAL detailed schema', () => {
  it('validateBaseSchemaSubject: required schema with valid subject', () => {
    const schema = { type: 'literal', of: 'x' } as const satisfies Schema
    const subject = 'x'

    expect(validateBaseSchemaSubject(schema, subject).data).toBe('x')
    expect(validateBaseSchemaSubject(schema, subject).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: required schema with invalid subject', () => {
    const schema = { type: 'literal', of: 'x' } as const satisfies Schema

    const error = {
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
    } satisfies Omit<InvalidSubject, 'subject'>

    const undefinedSubj = undefined

    expect(validateBaseSchemaSubject(schema, undefinedSubj).data).toBe(
      undefined
    )
    expect(validateBaseSchemaSubject(schema, undefinedSubj).error).toEqual({
      ...error,
      subject: undefinedSubj,
    })

    const stringSubj = 'y'

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

  it('validateBaseSchemaSubject: optional schema with valid subject', () => {
    const schema = {
      type: 'literal',
      of: 0,
      optional: true,
    } as const satisfies Schema

    const litSubj = 0

    expect(validateBaseSchemaSubject(schema, litSubj).data).toBe(litSubj)
    expect(validateBaseSchemaSubject(schema, litSubj).error).toBe(undefined)

    const undSubj = undefined

    expect(validateBaseSchemaSubject(schema, undSubj).data).toBe(undefined)
    expect(validateBaseSchemaSubject(schema, undSubj).error).toBe(undefined)
  })

  it('validateBaseSchemaSubject: optional schema with invalid subject', () => {
    const schema = {
      type: 'literal',
      of: 'z',
      optional: true,
    } as const satisfies Schema

    const error = {
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
    } satisfies Omit<InvalidSubject, 'subject'>

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

describe('Validate base detailed schema TYPE INFERENCE check', () => {
  /* string required/optional */

  it('validateBaseSchemaSubject: string required', () => {
    const schema = { type: 'string' } as const satisfies Schema
    const result = validateBaseSchemaSubject(schema, 'x')

    if (result.error) {
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: number }>(
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
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: number }>(
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
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: number }>(
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
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: number }>(
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
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: boolean }>(
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
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<boolean | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'boolean | undefined' is not 'string | undefined'
    check<string | undefined>(unknownX as typeof result.data)
  })

  /* string literal required/optional */

  it('validateBaseSchemaSubject: string literal required', () => {
    const schema = {
      type: 'literal',
      of: 'x',
    } as const satisfies Schema

    const result = validateBaseSchemaSubject(schema, 'x')

    if (result.error) {
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<'x'>(unknownX as typeof result.data)
    // @ts-expect-error '"x"' is not assignable to parameter of type '"y"'
    check<'y'>(unknownX as typeof result.data)
  })

  it('validateBaseSchemaSubject: string literal optional', () => {
    const schema = {
      type: 'literal',
      of: 'x',
      optional: true,
    } as const satisfies Schema

    const result = validateBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<'x' | undefined>(unknownX as typeof result.data)
    // @ts-expect-error '"x" | undefined' is not assignable to parameter of type '"x"'
    check<'x'>(unknownX as typeof result.data)
  })

  /* number literal required/optional */

  it('validateBaseSchemaSubject: number literal required', () => {
    const schema = {
      type: 'literal',
      of: 0,
    } as const satisfies Schema

    const result = validateBaseSchemaSubject(schema, 0)

    if (result.error) {
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<0>(unknownX as typeof result.data)
    // @ts-expect-error '0' is not assignable to parameter of type '1'
    check<1>(unknownX as typeof result.data)
  })

  it('validateBaseSchemaSubject: number literal optional', () => {
    const schema = {
      type: 'literal',
      of: 0,
      optional: true,
    } as const satisfies Schema

    const result = validateBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'BaseSchemaValidateError'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<0 | undefined>(unknownX as typeof result.data)
    // @ts-expect-error '0 | undefined' is not assignable to parameter of type '0'
    check<0>(unknownX as typeof result.data)
  })
})
