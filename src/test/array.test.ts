import { check } from '../test-utils'

import { parse } from '../../parse'
import { validate } from '../../validate'

import {
  array,
  object,
  string,
  number,
  boolean,
  literal,
} from '../../programmatic-schema'

describe('Array schema programmatic definition', () => {
  it('array: required array', () => {
    const schemaX = array(string())
    const subject = ['x', 'y', 'z']

    expect(parse(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(parse(schemaX.__schema, subject).error).toBe(undefined)

    expect(validate(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).error).toBe(undefined)
  })

  it('array: required array -> optional', () => {
    const schemaX = array(string()).optional()
    const subject = ['x', 'y', 'z']

    expect(parse(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(parse(schemaX.__schema, subject).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)

    expect(validate(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).not.toThrow()
  })

  it('array: required array -> optional -> description', () => {
    const schemaX = array(string()).optional().description('x')
    const subject = ['x', 'y', 'z']

    expect(parse(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(parse(schemaX.__schema, subject).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)

    expect(validate(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).not.toThrow()

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).not.toThrow()
  })

  it('array: required array -> description -> optional', () => {
    const schemaX = array(string()).description('x').optional()
    const subject = ['x', 'y', 'z']

    expect(parse(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(parse(schemaX.__schema, subject).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)

    expect(validate(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).not.toThrow()

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).not.toThrow()
  })

  it('array: nested object structure', () => {
    const schemaX = array(
      object({
        a: number(),
        b: string(),
        c: boolean(),
        e: literal('x'),
        f: literal(0),

        g: array(
          object({
            a: number(),
            b: string(),
            c: boolean(),
          })
        ),
      })
    )

    const nestedSubject = {
      a: 0,
      b: 'x',
      c: true,
      e: 'x' as const,
      f: 0 as const,

      g: [{ a: 0, b: 'x', c: false }],
    }

    const subject = [nestedSubject, nestedSubject, nestedSubject]

    expect(parse(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(parse(schemaX.__schema, subject).error).toBe(undefined)

    expect(validate(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).error).toBe(undefined)
  })

  it('array: minLength -> maxLength', () => {
    const struct = array(string()).minLength(1).maxLength(2)

    expect(struct.__schema).toStrictEqual({
      type: 'array',
      of: { type: 'string' },
      minLength: 1,
      maxLength: 2,
    })

    expect(struct.parse(['x']).data).toStrictEqual(['x'])
    expect(struct.parse(['x']).error).toBeUndefined()
    expect(struct.validate(['x']).data).toStrictEqual(['x'])
    expect(struct.validate(['x']).error).toBeUndefined()

    // invalid subject minLength
    expect(struct.parse([]).data).toBeUndefined()
    expect(struct.parse([]).error).toBeTruthy()
    expect(struct.validate([]).data).toBeUndefined()
    expect(struct.validate([]).error).toBeTruthy()

    const invalidSubj = ['x', 'y', 'z']

    // invalid subject maxLength
    expect(struct.parse(invalidSubj).data).toBeUndefined()
    expect(struct.parse(invalidSubj).error).toBeTruthy()
    expect(struct.validate(invalidSubj).data).toBeUndefined()
    expect(struct.validate(invalidSubj).error).toBeTruthy()
  })
})

describe('Check type inference and parse/validate/guard struct method', () => {
  const struct = array(string())
  const subject = ['x', 'y']

  it('array: parse', () => {
    const result = struct.parse(subject)

    if (!result.error) {
      check<string[]>(result.data)
      // @ts-expect-error 'string[]' is not assignable to parameter of type 'number[]'
      check<number[]>(result.data)
    }

    expect(result.data).toStrictEqual(subject)
    expect(result.error).toBeUndefined()
  })

  it('array: validate', () => {
    const result = struct.validate(subject)

    if (!result.error) {
      check<string[]>(result.data)
      // @ts-expect-error 'string[]' is not assignable to parameter of type 'number[]'
      check<number[]>(result.data)
    }

    expect(result.data).toStrictEqual(subject)
    expect(result.error).toBeUndefined()
  })

  it('array: guard', () => {
    const result = struct.guard(subject)

    expect(result).toBe(true)

    if (result) {
      check<string[]>(subject)
      // @ts-expect-error 'string[]' is not assignable to parameter of type 'number[]'
      check<number[]>(subject)
      return
    }

    throw Error('Not expected')
  })
})
