import { check } from './test-utils'

import { parse } from '../parse'
import { validate } from '../validate'
import { array, object, string, number, boolean, literal } from '../struct'

describe('Array schema programmatic definition', () => {
  it('array: required array', () => {
    const schemaX = array(string())
    const subject = ['x', 'y', 'z']

    expect(parse(schemaX.__schema, subject).right).toStrictEqual(subject)
    expect(parse(schemaX.__schema, subject).left).toBe(undefined)

    expect(validate(schemaX.__schema, subject).right).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).left).toBe(undefined)
  })

  it('array: required array -> optional', () => {
    const schemaX = array(string()).optional()
    const subject = ['x', 'y', 'z']

    expect(parse(schemaX.__schema, subject).right).toStrictEqual(subject)
    expect(parse(schemaX.__schema, subject).left).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).left).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).right).toBe(undefined)

    expect(validate(schemaX.__schema, subject).right).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).left).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).right).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).left).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).not.toThrow()
  })

  it('array: required array -> optional -> description', () => {
    const schemaX = array(string()).optional().description('x')
    const subject = ['x', 'y', 'z']

    expect(parse(schemaX.__schema, subject).right).toStrictEqual(subject)
    expect(parse(schemaX.__schema, subject).left).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).left).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).right).toBe(undefined)

    expect(validate(schemaX.__schema, subject).right).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).left).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).right).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).left).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).not.toThrow()

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).not.toThrow()
  })

  it('array: required array -> description -> optional', () => {
    const schemaX = array(string()).description('x').optional()
    const subject = ['x', 'y', 'z']

    expect(parse(schemaX.__schema, subject).right).toStrictEqual(subject)
    expect(parse(schemaX.__schema, subject).left).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).left).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).right).toBe(undefined)

    expect(validate(schemaX.__schema, subject).right).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).left).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).right).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).left).toBe(undefined)

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

    expect(parse(schemaX.__schema, subject).right).toStrictEqual(subject)
    expect(parse(schemaX.__schema, subject).left).toBe(undefined)

    expect(validate(schemaX.__schema, subject).right).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).left).toBe(undefined)
  })

  it('array: minLength -> maxLength', () => {
    const struct = array(string()).minLength(1).maxLength(2)

    expect(struct.__schema).toStrictEqual({
      type: 'array',
      of: { type: 'string' },
      minLength: 1,
      maxLength: 2,
    })

    expect(struct.parse(['x']).right).toStrictEqual(['x'])
    expect(struct.parse(['x']).left).toBeUndefined()
    expect(struct.validate(['x']).right).toStrictEqual(['x'])
    expect(struct.validate(['x']).left).toBeUndefined()

    // invalid subject minLength
    expect(struct.parse([]).right).toBeUndefined()
    expect(struct.parse([]).left).toBeTruthy()
    expect(struct.validate([]).right).toBeUndefined()
    expect(struct.validate([]).left).toBeTruthy()

    const invalidSubj = ['x', 'y', 'z']

    // invalid subject maxLength
    expect(struct.parse(invalidSubj).right).toBeUndefined()
    expect(struct.parse(invalidSubj).left).toBeTruthy()
    expect(struct.validate(invalidSubj).right).toBeUndefined()
    expect(struct.validate(invalidSubj).left).toBeTruthy()
  })
})

describe('Check type inference and parse/validate/guard struct method', () => {
  const struct = array(string())
  const subject = ['x', 'y']

  it('array: parse', () => {
    const result = struct.parse(subject)

    if (!result.left) {
      check<string[]>(result.right)
      // @ts-expect-error 'string[]' is not assignable to parameter of type 'number[]'
      check<number[]>(result.right)
    }

    expect(result.right).toStrictEqual(subject)
    expect(result.left).toBeUndefined()
  })

  it('array: validate', () => {
    const result = struct.validate(subject)

    if (!result.left) {
      check<string[]>(result.right)
      // @ts-expect-error 'string[]' is not assignable to parameter of type 'number[]'
      check<number[]>(result.right)
    }

    expect(result.right).toStrictEqual(subject)
    expect(result.left).toBeUndefined()
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
