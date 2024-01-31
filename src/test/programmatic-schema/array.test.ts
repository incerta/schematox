import { PROGRAMMATICALLY_DEFINED_ERROR_MSG } from '../../error'

import { parse } from '../../general-schema-parser'
import { validate } from '../../general-schema-validator'

import { array } from '../../programmatic-schema/array'
import { object } from '../../programmatic-schema/object'

import { string } from '../../programmatic-schema/string'
import { number } from '../../programmatic-schema/number'
import { boolean } from '../../programmatic-schema/boolean'
import { stringUnion } from '../../programmatic-schema/string-union'
import { numberUnion } from '../../programmatic-schema/number-union'

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
    expect(parse(schemaX.__schema, null).error).toBe(undefined)
    expect(parse(schemaX.__schema, null).data).toBe(undefined)

    expect(validate(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined
    )
  })

  it('array: required array -> optional -> description', () => {
    const schemaX = array(string()).optional().description('x')
    const subject = ['x', 'y', 'z']

    expect(parse(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(parse(schemaX.__schema, subject).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, null).error).toBe(undefined)
    expect(parse(schemaX.__schema, null).data).toBe(undefined)

    expect(validate(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined
    )

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined
    )
  })

  it('array: required array -> description -> optional', () => {
    const schemaX = array(string()).description('x').optional()
    const subject = ['x', 'y', 'z']

    expect(parse(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(parse(schemaX.__schema, subject).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).error).toBe(undefined)
    expect(parse(schemaX.__schema, undefined).data).toBe(undefined)
    expect(parse(schemaX.__schema, null).error).toBe(undefined)
    expect(parse(schemaX.__schema, null).data).toBe(undefined)

    expect(validate(schemaX.__schema, subject).data).toStrictEqual(subject)
    expect(validate(schemaX.__schema, subject).error).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).data).toBe(undefined)
    expect(validate(schemaX.__schema, undefined).error).toBe(undefined)

    // @ts-expect-error Property 'optional' does not exist
    expect(() => schemaX.optional()).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.optionalDefined
    )

    // @ts-expect-error Property 'description' does not exist
    expect(() => schemaX.description('x')).toThrow(
      PROGRAMMATICALLY_DEFINED_ERROR_MSG.descriptionDefined
    )
  })

  it('array: nested object structure', () => {
    const schemaX = array(
      object({
        a: number(),
        b: string(),
        c: boolean(),
        e: stringUnion('x'),
        f: numberUnion(0),

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
})
