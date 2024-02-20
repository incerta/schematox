import { check } from '../test-utils'
import {
  literal,
  union,
  string,
  number,
  boolean,
  stringUnion,
  numberUnion,
  object,
  array,
} from '../../programmatic-schema'
import { ERROR_CODE } from '../../error'

import type { InvalidSubject } from '../../error'

describe('Union nested structures', () => {
  it('union: union of all types', () => {
    const struct = union([
      string(),
      number(),
      boolean(),
      stringUnion('x', 'y'),
      numberUnion(0, 1),
      literal('z'),
      literal(2),
      object({ x: string() }),
      array(number()),
    ])

    expect(struct.__schema).toStrictEqual({
      type: 'union',
      of: [
        { type: 'string' },
        { type: 'number' },
        { type: 'boolean' },
        { type: 'stringUnion', of: ['x', 'y'] },
        { type: 'numberUnion', of: [0, 1] },
        { type: 'literal', of: 'z' },
        { type: 'literal', of: 2 },
        { type: 'object', of: { x: { type: 'string' } } },
        { type: 'array', of: { type: 'number' } },
      ],
    })

    const subj = 'x' as unknown

    if (struct.guard(subj)) {
      check<string | number | boolean | { x: string } | number[]>(subj)

      // @ts-expect-error 'string | number | boolean | { x: string; } | number[]' is not 'string | boolean | number[] | { x: string; }'
      check<string | boolean | { x: string } | number[]>(subj)
    }
  })
})

describe('Union methods', () => {
  it('union: parse valid', () => {
    const struct = union([literal('x'), literal('y')])
    const parsed = struct.parse('x')

    if (parsed.error) {
      throw Error('Not expected')
    }

    check<'x' | 'y'>(parsed.data)
    // @ts-expect-error '"x" | "y"' is not assignable to parameter of type '"x"'
    check<'x'>(parsed.data)

    expect(parsed.data).toBe('x')
    expect(parsed.error).toBeUndefined()
  })

  it('union: parse invalid', () => {
    const struct = union([literal('x'), literal('y')])
    const subject = 'z'
    const parsed = struct.parse(subject)

    if (parsed.error) {
      check<InvalidSubject[]>(parsed.error)
      // @ts-expect-error 'InvalidSubject[]' is not 'string[]'
      check<string[]>(parsed.error)

      expect(parsed.error).toStrictEqual([
        {
          code: ERROR_CODE.invalidType,
          schema: struct.__schema,
          subject,
          path: [],
        },
      ])

      return
    }

    throw Error('Not expected')
  })

  it('union: validate valid', () => {
    const struct = union([literal('x'), literal('y')])
    const validated = struct.validate('x')

    if (validated.error) {
      throw Error('Not expected')
    }

    check<'x' | 'y'>(validated.data)
    // @ts-expect-error '"x" | "y"' is not assignable to parameter of type '"x"'
    check<'x'>(validated.data)

    expect(validated.data).toBe('x')
  })

  it('union: validate invalid', () => {
    const struct = union([literal('x'), literal('y')])
    const subject = 'z'
    const validated = struct.validate(subject)

    if (validated.error) {
      check<InvalidSubject[]>(validated.error)
      // @ts-expect-error 'InvalidSubject[]' is not 'string[]'
      check<string[]>(validated.error)

      expect(validated.error).toStrictEqual([
        {
          code: ERROR_CODE.invalidType,
          schema: struct.__schema,
          subject,
          path: [],
        },
      ])

      return
    }

    throw Error('Not expected')
  })

  it('union: guard valid', () => {
    const struct = union([literal('x'), literal('y')])
    const subject = 'y' as unknown
    const guarded = struct.guard(subject)

    if (guarded) {
      check<'x' | 'y'>(subject)
      // @ts-expect-error '"x" | "y"' is not assignable to parameter of type '"x"'
      check<'x'>(subject)
      return
    }

    throw Error('Not expected')
  })

  it('union: guard invalid', () => {
    const struct = union([literal('x'), literal('y')])
    const subject = 'z' as unknown
    const guarded = struct.guard(subject)

    if (guarded) {
      throw Error('Not expected')
    }
  })
})

describe('Check params', () => {
  it('union: optional -> description', () => {
    const struct = union([literal('x'), literal('y')])
      .optional()
      .description('x')

    expect(struct.__schema).toStrictEqual({
      type: 'union',
      of: [
        { type: 'literal', of: 'x' },
        { type: 'literal', of: 'y' },
      ],
      optional: true,
      description: 'x',
    })

    const parsed = struct.parse('x')

    if (parsed.error) {
      throw Error('Not expected')
    }

    check<'x' | 'y' | undefined>(parsed.data)
    // @ts-expect-error '"x" | "y" | undefined' is not '"x" | "y"'
    check<'x' | 'y'>(parsed.data)

    expect(parsed.data).toBe('x')

    // @ts-expect-error 'optional' does not exist
    expect(() => struct.optional()).not.toThrow()
    // @ts-expect-error 'description' does not exist
    expect(() => struct.description()).not.toThrow()
  })

  it('union: description -> optional', () => {
    const struct = union([literal('x'), literal('y')])
      .description('x')
      .optional()

    expect(struct.__schema).toStrictEqual({
      type: 'union',
      of: [
        { type: 'literal', of: 'x' },
        { type: 'literal', of: 'y' },
      ],
      optional: true,
      description: 'x',
    })

    const parsed = struct.parse('x')

    if (parsed.error) {
      throw Error('Not expected')
    }

    check<'x' | 'y' | undefined>(parsed.data)
    // @ts-expect-error '"x" | "y" | undefined' is not '"x" | "y"'
    check<'x' | 'y'>(parsed.data)

    expect(parsed.data).toBe('x')

    // @ts-expect-error 'optional' does not exist
    expect(() => struct.optional()).not.toThrow()
    // @ts-expect-error 'description' does not exist
    expect(() => struct.description()).not.toThrow()
  })
})
