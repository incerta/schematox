import { ERROR_CODE } from '../error'
import { parse } from '../parse'
import { validate, guard } from '../validate'
import { string } from '../struct'
import { check } from './test-utils'

import { Schema } from '../types/compounds'

const VALID_TYPE_SUBJECTS = ['', 'x', 'xy', 'xyz', '0'] as unknown[]
const INVALID_TYPE_SUBJECTS = [
  undefined,
  null,
  0,
  Infinity,
  -Infinity,
  NaN,
  true,
  false,
  /^regexp/,
  {},
  [],
  new Map(),
  new Set(),
] as unknown[]

describe('No schema parameters', () => {
  const schema = { type: 'string' } as const satisfies Schema
  const struct = string()

  const validSubjects: unknown[] = VALID_TYPE_SUBJECTS
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS

  type Expected = string

  it('Struct `__schema` should be identical to static `schema`', () => {
    type Expected = typeof schema
    type Actual = typeof struct.__schema

    check<Actual, Expected>()
    check<Expected, Actual>()

    expect(struct.__schema).toStrictEqual(schema)
  })

  describe('Schema direct parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = parse(schema, subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = parse(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = validate(schema, subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = validate(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Guard valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = guard(schema, subject)

        if (actual === false) {
          throw Error('Not expected')
        }

        type Actual = typeof subject

        check<Actual, Expected>()
        check<Expected, Actual>()
      }
    })

    it('Guard INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const expected = false
        const actual = guard(schema, subject)

        expect(actual).toBe(expected)
      }
    })
  })

  describe('Struct method parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of VALID_TYPE_SUBJECTS) {
        const actual = struct.parse(subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of INVALID_TYPE_SUBJECTS) {
        const actual = struct.parse(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate valid subjects', () => {
      for (const subject of VALID_TYPE_SUBJECTS) {
        const actual = struct.validate(subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of INVALID_TYPE_SUBJECTS) {
        const actual = struct.validate(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Guard valid subjects', () => {
      for (const subject of VALID_TYPE_SUBJECTS) {
        const actual = struct.guard(subject)

        if (actual === false) {
          throw Error('Not expected')
        }

        type Actual = typeof subject

        check<Actual, Expected>()
        check<Expected, Actual>()
      }
    })

    it('Guard INVALID_TYPE subjects', () => {
      for (const subject of INVALID_TYPE_SUBJECTS) {
        const expected = false
        const actual = struct.guard(subject)

        expect(actual).toBe(expected)
      }
    })
  })
})

describe('optional', () => {
  const schema = { type: 'string', optional: true } as const satisfies Schema
  const struct = string().optional()

  const validSubjects: unknown[] = [...VALID_TYPE_SUBJECTS, undefined]
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS.filter(
    (x) => x !== undefined
  )

  type Expected = string | undefined

  it('Struct `__schema` should be identical to static `schema`', () => {
    type Expected = typeof schema
    type Actual = typeof struct.__schema

    check<Actual, Expected>()
    check<Expected, Actual>()

    expect(struct.__schema).toStrictEqual(schema)
  })

  describe('Schema direct parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = parse(schema, subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = parse(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = validate(schema, subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = validate(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Guard valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = guard(schema, subject)

        if (actual === false) {
          throw Error('Not expected')
        }

        type Actual = typeof subject

        check<Actual, Expected>()
        check<Expected, Actual>()
      }
    })

    it('Guard INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const expected = false
        const actual = guard(schema, subject)

        expect(actual).toBe(expected)
      }
    })
  })

  describe('Struct method parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of VALID_TYPE_SUBJECTS) {
        const actual = struct.parse(subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.parse(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = struct.validate(subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.validate(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Guard valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = struct.guard(subject)

        if (actual === false) {
          throw Error('Not expected')
        }

        type Actual = typeof subject

        check<Actual, Expected>()
        check<Expected, Actual>()
      }
    })

    it('Guard INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const expected = false
        const actual = struct.guard(subject)

        expect(actual).toBe(expected)
      }
    })
  })
})

describe('nullable', () => {
  const schema = { type: 'string', nullable: true } as const satisfies Schema
  const struct = string().nullable()

  const validSubjects: unknown[] = [...VALID_TYPE_SUBJECTS, null]
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS.filter(
    (x) => x !== null
  )

  type Expected = string | null

  it('Struct `__schema` should be identical to static `schema`', () => {
    type Expected = typeof schema
    type Actual = typeof struct.__schema

    check<Actual, Expected>()
    check<Expected, Actual>()

    expect(struct.__schema).toStrictEqual(schema)
  })

  describe('Schema direct parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = parse(schema, subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = parse(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = validate(schema, subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = validate(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Guard valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = guard(schema, subject)

        if (actual === false) {
          throw Error('Not expected')
        }

        type Actual = typeof subject

        check<Actual, Expected>()
        check<Expected, Actual>()
      }
    })

    it('Guard INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const expected = false
        const actual = guard(schema, subject)

        expect(actual).toBe(expected)
      }
    })
  })

  describe('Struct method parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = struct.parse(subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.parse(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = struct.validate(subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.validate(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Guard valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = struct.guard(subject)

        if (actual === false) {
          throw Error('Not expected')
        }

        type Actual = typeof subject

        check<Actual, Expected>()
        check<Expected, Actual>()
      }
    })

    it('Guard INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const expected = false
        const actual = struct.guard(subject)

        expect(actual).toBe(expected)
      }
    })
  })
})

describe('brand', () => {
  const brandKey = 'x'
  const brandValue = 'y'
  const brandResultKey = `__${brandKey}`

  const schema = {
    type: 'string',
    brand: [brandKey, brandValue],
  } as const satisfies Schema

  const struct = string().brand(brandKey, brandValue)

  const validSubjects = VALID_TYPE_SUBJECTS
  const invalidSubjects = INVALID_TYPE_SUBJECTS

  type Expected = string & { [brandResultKey]: typeof brandValue }

  it('Struct `__schema` should be identical to static `schema`', () => {
    type Expected = typeof schema
    type Actual = typeof struct.__schema

    check<Actual, Expected>()
    check<Expected, Actual>()

    expect(struct.__schema).toStrictEqual(schema)
  })

  describe('Schema direct parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = parse(schema, subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = parse(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = validate(schema, subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = validate(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Guard valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = guard(schema, subject)

        if (actual === false) {
          throw Error('Not expected')
        }

        type Actual = typeof subject

        check<Actual, Expected>()
        check<Expected, Actual>()
      }
    })

    it('Guard INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const expected = false
        const actual = guard(schema, subject)

        expect(actual).toBe(expected)
      }
    })
  })

  describe('Struct method parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = struct.parse(subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.parse(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = struct.validate(subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.validate(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Guard valid subjects', () => {
      for (const subject of validSubjects) {
        const actual = struct.guard(subject)

        if (actual === false) {
          throw Error('Not expected')
        }

        type Actual = typeof subject

        check<Actual, Expected>()
        check<Expected, Actual>()
      }
    })

    it('Guard INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const expected = false
        const actual = struct.guard(subject)

        expect(actual).toBe(expected)
      }
    })
  })
})

describe('minLength', () => {
  const minLength = 3
  const schema = { type: 'string', minLength } as const satisfies Schema
  const struct = string().minLength(minLength)

  const validRangeSubjects: unknown[] = ['xxx', 'xxxx', 'xxxxx']
  const invalidTypeSubjects: unknown[] = INVALID_TYPE_SUBJECTS
  const invalidRangeSubjects: unknown[] = ['', 'x', 'xx']

  type Expected = string

  it('Struct `__schema` should be identical to static `schema`', () => {
    type Expected = typeof schema
    type Actual = typeof struct.__schema

    check<Actual, Expected>()
    check<Expected, Actual>()

    expect(struct.__schema).toStrictEqual(schema)
  })

  describe('Schema direct parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = parse(schema, subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const actual = parse(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Parse INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = parse(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = validate(schema, subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const actual = validate(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = validate(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Guard valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = guard(schema, subject)

        if (actual === false) {
          throw Error('Not expected')
        }

        type Actual = typeof subject

        check<Actual, Expected>()
        check<Expected, Actual>()
      }
    })

    it('Guard INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const expected = false
        const actual = guard(schema, subject)

        expect(actual).toBe(expected)
      }
    })

    it('Guard INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const expected = false
        const actual = guard(schema, subject)

        expect(actual).toBe(expected)
      }
    })
  })

  describe('Struct method parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = struct.parse(subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const actual = struct.parse(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Parse INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = struct.parse(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = struct.validate(subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const actual = struct.validate(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = struct.validate(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Guard valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = struct.guard(subject)

        if (actual === false) {
          throw Error('Not expected')
        }

        type Actual = typeof subject

        check<Actual, Expected>()
        check<Expected, Actual>()
      }
    })

    it('Guard INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const expected = false
        const actual = struct.guard(subject)

        expect(actual).toBe(expected)
      }
    })

    it('Guard INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const expected = false
        const actual = struct.guard(subject)

        expect(actual).toBe(expected)
      }
    })
  })
})

describe('maxLength', () => {
  const maxLength = 2
  const schema = { type: 'string', maxLength } as const satisfies Schema
  const struct = string().maxLength(maxLength)

  const validRangeSubjects: unknown[] = ['', 'x', 'xx']
  const invalidTypeSubjects: unknown[] = INVALID_TYPE_SUBJECTS
  const invalidRangeSubjects: unknown[] = ['xxx', 'xxxx', 'xxxx']

  type Expected = string

  it('Struct `__schema` should be identical to static `schema`', () => {
    type Expected = typeof schema
    type Actual = typeof struct.__schema

    check<Actual, Expected>()
    check<Expected, Actual>()

    expect(struct.__schema).toStrictEqual(schema)
  })

  describe('Schema direct parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = parse(schema, subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const actual = parse(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Parse INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = parse(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = validate(schema, subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const actual = validate(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = validate(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Guard valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = guard(schema, subject)

        if (actual === false) {
          throw Error('Not expected')
        }

        type Actual = typeof subject

        check<Actual, Expected>()
        check<Expected, Actual>()
      }
    })

    it('Guard INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const expected = false
        const actual = guard(schema, subject)

        expect(actual).toBe(expected)
      }
    })

    it('Guard INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const expected = false
        const actual = guard(schema, subject)

        expect(actual).toBe(expected)
      }
    })
  })

  describe('Struct method parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = struct.parse(subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const actual = struct.parse(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Parse INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = struct.parse(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = struct.validate(subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const actual = struct.validate(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = struct.validate(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Guard valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = struct.guard(subject)

        if (actual === false) {
          throw Error('Not expected')
        }

        type Actual = typeof subject

        check<Actual, Expected>()
        check<Expected, Actual>()
      }
    })

    it('Guard INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const expected = false
        const actual = struct.guard(subject)

        expect(actual).toBe(expected)
      }
    })

    it('Guard INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const expected = false
        const actual = struct.guard(subject)

        expect(actual).toBe(expected)
      }
    })
  })
})

describe('description', () => {
  const description = 'x'
  const schema = { type: 'string', description } as const satisfies Schema
  const struct = string().description(description)

  it('Struct `__schema` should be identical to static `schema`', () => {
    type Expected = typeof schema
    type Actual = typeof struct.__schema

    check<Actual, Expected>()
    check<Expected, Actual>()

    expect(struct.__schema).toStrictEqual(schema)
  })
})

describe('optional + nullable + brand + minLength + maxLength + description', () => {
  const minLength = 2
  const maxLength = 3
  const description = 'x'

  const schema = {
    type: 'string',
    optional: true,
    nullable: true,
    brand: ['x', 'y'],
    description,
    maxLength,
    minLength,
  } as const satisfies Schema

  const struct = string()
    .optional()
    .nullable()
    .brand('x', 'y')
    .minLength(minLength)
    .maxLength(maxLength)
    .description(description)

  const validRangeSubjects: unknown[] = ['xx', 'xxx']
  const invalidRangeSubjects: unknown[] = ['', 'x', 'xxxx', 'xxxx']

  const invalidTypeSubjects: unknown[] = INVALID_TYPE_SUBJECTS.filter((x) => {
    if (x === undefined) return false
    if (x === null) return false
    return true
  })

  type Expected = (string & { __x: 'y' }) | undefined | null

  it('Struct `__schema` should be identical to static `schema`', () => {
    type Expected = typeof schema
    type Actual = typeof struct.__schema

    check<Actual, Expected>()
    check<Expected, Actual>()

    expect(struct.__schema).toStrictEqual(schema)
  })

  describe('Schema direct parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = parse(schema, subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const actual = parse(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Parse INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = parse(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = validate(schema, subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const actual = validate(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = validate(schema, subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Guard valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = guard(schema, subject)

        if (actual === false) {
          throw Error('Not expected')
        }

        type Actual = typeof subject

        check<Actual, Expected>()
        check<Expected, Actual>()
      }
    })

    it('Guard INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const expected = false
        const actual = guard(schema, subject)

        expect(actual).toBe(expected)
      }
    })

    it('Guard INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const expected = false
        const actual = guard(schema, subject)

        expect(actual).toBe(expected)
      }
    })
  })

  describe('Struct method parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = struct.parse(subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const actual = struct.parse(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Parse INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = struct.parse(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = struct.validate(subject)

        if (actual.error) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.data

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.data).toBe(subject)
        expect(actual.error).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const actual = struct.validate(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidType,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Validate INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = struct.validate(subject)

        if (actual.error === undefined) {
          throw Error('Not expected')
        }

        expect(actual.data).toBeUndefined()
        expect(actual.error).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })

    it('Guard valid subjects', () => {
      for (const subject of validRangeSubjects) {
        const actual = struct.guard(subject)

        if (actual === false) {
          throw Error('Not expected')
        }

        type Actual = typeof subject

        check<Actual, Expected>()
        check<Expected, Actual>()
      }
    })

    it('Guard INVALID_TYPE subjects', () => {
      for (const subject of invalidTypeSubjects) {
        const expected = false
        const actual = struct.guard(subject)

        expect(actual).toBe(expected)
      }
    })

    it('Guard INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const expected = false
        const actual = struct.guard(subject)

        expect(actual).toBe(expected)
      }
    })
  })
})
