import { check } from './test-utils'
import {
  literal,
  union,
  string,
  number,
  boolean,
  object,
  array,
} from '../struct'
import { ERROR_CODE } from '../error'

import type { InvalidSubject } from '../error'

describe('Union nested structures', () => {
  it('union: union of all types', () => {
    const struct = union([
      string(),
      number(),
      boolean(),
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

    if (parsed.left) {
      throw Error('Not expected')
    }

    check<'x' | 'y'>(parsed.right)
    // @ts-expect-error '"x" | "y"' is not assignable to parameter of type '"x"'
    check<'x'>(parsed.right)

    expect(parsed.right).toBe('x')
    expect(parsed.left).toBeUndefined()
  })

  it('union: parse invalid', () => {
    const struct = union([literal('x'), literal('y')])
    const subject = 'z'
    const parsed = struct.parse(subject)

    if (parsed.left) {
      check<InvalidSubject[]>(parsed.left)
      // @ts-expect-error 'InvalidSubject[]' is not 'string[]'
      check<string[]>(parsed.left)

      expect(parsed.left).toStrictEqual([
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

    if (validated.left) {
      throw Error('Not expected')
    }

    check<'x' | 'y'>(validated.right)
    // @ts-expect-error '"x" | "y"' is not assignable to parameter of type '"x"'
    check<'x'>(validated.right)

    expect(validated.right).toBe('x')
  })

  it('union: validate invalid', () => {
    const struct = union([literal('x'), literal('y')])
    const subject = 'z'
    const validated = struct.validate(subject)

    if (validated.left) {
      check<InvalidSubject[]>(validated.left)
      // @ts-expect-error 'InvalidSubject[]' is not 'string[]'
      check<string[]>(validated.left)

      expect(validated.left).toStrictEqual([
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

    if (parsed.left) {
      throw Error('Not expected')
    }

    check<'x' | 'y' | undefined>(parsed.right)
    // @ts-expect-error '"x" | "y" | undefined' is not '"x" | "y"'
    check<'x' | 'y'>(parsed.right)

    expect(parsed.right).toBe('x')

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

    if (parsed.left) {
      throw Error('Not expected')
    }

    check<'x' | 'y' | undefined>(parsed.right)
    // @ts-expect-error '"x" | "y" | undefined' is not '"x" | "y"'
    check<'x' | 'y'>(parsed.right)

    expect(parsed.right).toBe('x')

    // @ts-expect-error 'optional' does not exist
    expect(() => struct.optional()).not.toThrow()
    // @ts-expect-error 'description' does not exist
    expect(() => struct.description()).not.toThrow()
  })

  it('union: of branded strings', () => {
    const struct = union([string().brand('x', 'y'), string().brand('x', 'z')])
    const parsed = struct.parse('')

    if (parsed.left) {
      throw new Error('Not expected')
    }

    const result = parsed.right

    type Expected = (string & { __x: 'y' }) | (string & { __x: 'z' })
    type Actual = typeof result

    check<Expected, Actual>()
    check<Actual, Expected>()
  })

  it('union: of branded strings inside object', () => {
    const struct = object({
      x: union([string().brand('x', 'y'), string().brand('x', 'z')]),
    })
    const parsed = struct.parse({ x: '' })

    if (parsed.left) {
      throw new Error('Not expected')
    }

    const result = parsed.right

    type ExpectedUnion = (string & { __x: 'y' }) | (string & { __x: 'z' })
    type Expected = { x: ExpectedUnion }

    type Actual = typeof result

    check<Expected, Actual>()
    check<Actual, Expected>()
  })
})
