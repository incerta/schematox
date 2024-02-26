import { check } from './test-utils'
import { literal } from '../struct'
import { ERROR_CODE } from '../error'

import type { InvalidSubject } from '../error'

describe('Required string literal', () => {
  it('literal: parse valid', () => {
    const struct = literal('x')
    const parsed = struct.parse('x')

    if (parsed.error) {
      throw Error('Not expected')
    }

    check<'x'>(parsed.data)
    // @ts-expect-error '"x"' is not assignable to parameter of type '"y"'
    check<'y'>(parsed.data)

    expect(parsed.data).toBe('x')
    expect(parsed.error).toBeUndefined()
  })

  it('literal: parse invalid', () => {
    const struct = literal('x')
    const subject = 'y'
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

  it('literal: validate valid', () => {
    const struct = literal('x')
    const validated = struct.validate('x')

    if (validated.error) {
      throw Error('Not expected')
    }

    check<'x'>(validated.data)
    // @ts-expect-error '"x"' is not assignable to parameter of type '"y"'
    check<'y'>(validated.data)

    expect(validated.data).toBe('x')
  })

  it('literal: validate invalid', () => {
    const struct = literal('x')
    const subject = 'y'
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

  it('literal: guard valid', () => {
    const struct = literal('x')
    const subject = 'x' as unknown
    const guarded = struct.guard(subject)

    if (guarded) {
      check<'x'>(subject)
      // @ts-expect-error '"x"' is not assignable to parameter of type '"y"'
      check<'y'>(subject)

      return
    }

    throw Error('Not expected')
  })

  it('literal: guard invalid', () => {
    const struct = literal('x')
    const subject = 'y' as unknown
    const guarded = struct.guard(subject)

    if (guarded) {
      check<'x'>(subject)
      // @ts-expect-error '"x"' is not assignable to parameter of type '"y"'
      check<'y'>(subject)

      throw Error('Not expected')
    }
  })
})

describe('Required number literal', () => {
  it('literal: parse valid', () => {
    const struct = literal(0)
    const parsed = struct.parse(0)

    if (parsed.error) {
      throw Error('Not expected')
    }

    check<0>(parsed.data)
    // @ts-expect-error '0' is not assignable to parameter of type '1'
    check<1>(parsed.data)

    expect(parsed.data).toBe(0)
    expect(parsed.error).toBeUndefined()
  })

  it('literal: parse invalid', () => {
    const struct = literal(0)
    const subject = 1
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

  it('literal: validate valid', () => {
    const struct = literal(0)
    const validated = struct.validate(0)

    if (validated.error) {
      throw Error('Not expected')
    }

    check<0>(validated.data)
    // @ts-expect-error '"x"' is not assignable to parameter of type '"y"'
    check<'y'>(validated.data)

    expect(validated.data).toBe(0)
  })

  it('literal: validate invalid', () => {
    const struct = literal(0)
    const subject = 1
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

  it('literal: guard valid', () => {
    const struct = literal(0)
    const subject = 0 as unknown
    const guarded = struct.guard(subject)

    if (guarded) {
      check<0>(subject)
      // @ts-expect-error '"x"' is not assignable to parameter of type '"y"'
      check<'y'>(subject)

      return
    }

    throw Error('Not expected')
  })

  it('literal: guard invalid', () => {
    const struct = literal(0)
    const subject = 'y' as unknown
    const guarded = struct.guard(subject)

    if (guarded) {
      check<0>(subject)
      // @ts-expect-error '"x"' is not assignable to parameter of type '"y"'
      check<'y'>(subject)

      throw Error('Not expected')
    }
  })
})
