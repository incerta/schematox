import { ERROR_CODE } from '../error'
import { parseBaseSchemaSubject } from '../base-schema-parser'
import { check, unknownX } from './test-utils'

import type { InvalidSubject } from '../error'
import type { Schema } from '../types/compound-schema-types'

describe('Number base schema invalid subject parsing special cases', () => {
  it('parseBaseSchemaSubject: subject `NaN` - schema `"number"`', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = NaN
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `NaN` - schema `"number?"`', () => {
    const schema = { type: 'number', optional: true } satisfies Schema
    const subject = NaN
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `Infinity` - schema `"number"`', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = Infinity
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `Infinity` - schema `"number?"`', () => {
    const schema = { type: 'number', optional: true } satisfies Schema
    const subject = Infinity
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `-Infinity` - schema `"number"`', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = -Infinity
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
  })

  it('parseBaseSchemaSubject: subject `-Infinity` - schema `"number?"`', () => {
    const schema = { type: 'number', optional: true } satisfies Schema
    const subject = -Infinity
    const parsed = parseBaseSchemaSubject(schema, subject)

    expect(parsed.error).toEqual({
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    })
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
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
    } satisfies Omit<InvalidSubject, 'subject'>

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
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
    } satisfies Omit<InvalidSubject, 'subject'>

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
      code: ERROR_CODE.invalidRange,
      path: [],
      schema,
      subject,
    } satisfies InvalidSubject

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
      code: ERROR_CODE.invalidRange,
      path: [],
      schema,
      subject,
    } satisfies InvalidSubject

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
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
    } satisfies Omit<InvalidSubject, 'subject'>

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
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
    } satisfies Omit<InvalidSubject, 'subject'>

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
      code: ERROR_CODE.invalidRange,
      path: [],
      schema,
      subject,
    } satisfies InvalidSubject

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
      code: ERROR_CODE.invalidRange,
      path: [],
      schema,
      subject,
    } satisfies InvalidSubject

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('parseBaseSchemaSubject: subject `NaN`', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const subject = NaN
    const error = {
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    } satisfies InvalidSubject

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('parseBaseSchemaSubject: subject `Infinity`', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const subject = Infinity
    const error = {
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    } satisfies InvalidSubject

    expect(parseBaseSchemaSubject(schema, subject).data).toBe(undefined)
    expect(parseBaseSchemaSubject(schema, subject).error).toEqual(error)
  })

  it('parseBaseSchemaSubject: subject `-Infinity`', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const subject = -Infinity
    const error = {
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
      subject,
    } satisfies InvalidSubject

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
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
    } satisfies Omit<InvalidSubject, 'subject'>

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
      code: ERROR_CODE.invalidType,
      path: [],
      schema,
    } satisfies Omit<InvalidSubject, 'subject'>

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

describe('Parse base detailed schema TYPE INFERENCE check', () => {
  /* string required/optional/default */

  it('parseBaseSchemaSubject: string required', () => {
    const schema = { type: 'string' } as const satisfies Schema
    const result = parseBaseSchemaSubject(schema, 'x')

    if (result.error) {
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'InvalidSubject'
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
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'InvalidSubject'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<string | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'string | undefined' is not 'number | undefined'
    check<number | undefined>(unknownX as typeof result.data)
  })

  /* number required/optional */

  it('parseBaseSchemaSubject: number required', () => {
    const schema = { type: 'number' } as const satisfies Schema
    const result = parseBaseSchemaSubject(schema, 0)

    if (result.error) {
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'InvalidSubject'
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
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: number }>(
        // @ts-expect-error Property 'x' is missing in type 'InvalidSubject'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<number | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'number | undefined' is not 'string | undefined'
    check<string | undefined>(unknownX as typeof result.data)
  })

  /* boolean required/optional */

  it('parseBaseSchemaSubject: boolean required', () => {
    const schema = { type: 'boolean' } as const satisfies Schema
    const result = parseBaseSchemaSubject(schema, false)

    if (result.error) {
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'InvalidSubject'
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
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'InvalidSubject'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<boolean | undefined>(unknownX as typeof result.data)
    // @ts-expect-error 'boolean | undefined' is not 'string | undefined'
    check<string | undefined>(unknownX as typeof result.data)
  })

  /* string literal required/optional */

  it('parseBaseSchemaSubject: string literal required', () => {
    const schema = {
      type: 'literal',
      of: 'x',
    } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, 'x')

    if (result.error) {
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'InvalidSubject'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<'x'>(unknownX as typeof result.data)
    // @ts-expect-error '"x"' is not assignable to parameter of type '"y"'
    check<'y'>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: string literal optional', () => {
    const schema = {
      type: 'literal',
      of: 'x',
      optional: true,
    } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'InvalidSubject'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<'x' | undefined>(unknownX as typeof result.data)
    // @ts-expect-error '"x" | undefined' is not assignable to parameter of type '"x"'
    check<'x'>(unknownX as typeof result.data)
  })

  /* number literal required/optional */

  it('parseBaseSchemaSubject: number literal required', () => {
    const schema = {
      type: 'literal',
      of: 0,
    } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, 0)

    if (result.error) {
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'InvalidSubject'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<0>(unknownX as typeof result.data)
    // @ts-expect-error '0' is not assignable to parameter of type '1'
    check<1>(unknownX as typeof result.data)
  })

  it('parseBaseSchemaSubject: number literal optional', () => {
    const schema = {
      type: 'literal',
      of: 0,
      optional: true,
    } as const satisfies Schema

    const result = parseBaseSchemaSubject(schema, undefined)

    if (result.error) {
      check<InvalidSubject>(unknownX as typeof result.error)
      check<InvalidSubject & { x: boolean }>(
        // @ts-expect-error Property 'x' is missing in type 'InvalidSubject'
        unknownX as typeof result.error
      )
      throw Error('Not expected')
    }

    check<0 | undefined>(unknownX as typeof result.data)
    // @ts-expect-error '0 | undefined' is not assignable to parameter of type '0'
    check<0>(unknownX as typeof result.data)
  })
})
