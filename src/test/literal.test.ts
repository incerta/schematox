import { ERROR_CODE } from '../error'
import { parse } from '../parse'
import { validate, guard } from '../validate'
import { literal } from '../struct'
import { check } from './test-utils'

import { Schema } from '../types/compounds'

const INVALID_TYPE_SUBJECTS = [
  undefined,
  null,
  'string',
  1000_000,
  Infinity,
  -Infinity,
  NaN,
  /^regexp/,
  {},
  [],
  new Map(),
  new Set(),
] as unknown[]

describe('No schema parameters (string literal)', () => {
  const actualLiteral = 'x'
  const schema = {
    type: 'literal',
    of: actualLiteral,
  } as const satisfies Schema
  const struct = literal(actualLiteral)

  const validSubjects: unknown[] = [actualLiteral]
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS

  type Expected = typeof actualLiteral

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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = parse(schema, subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = validate(schema, subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.parse(subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.validate(subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

describe('optional (number literal)', () => {
  const actualLiteral = 0
  const schema = {
    type: 'literal',
    of: actualLiteral,
    optional: true,
  } as const satisfies Schema
  const struct = literal(actualLiteral).optional()

  const validSubjects: unknown[] = [actualLiteral, undefined]
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS.filter(
    (x) => x !== undefined
  )

  type Expected = typeof actualLiteral | undefined

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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = parse(schema, subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = validate(schema, subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.parse(subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.validate(subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

describe('nullable (boolean literal)', () => {
  const actualLiteral = false
  const schema = {
    type: 'literal',
    of: actualLiteral,
    nullable: true,
  } as const satisfies Schema
  const struct = literal(actualLiteral).nullable()

  const validSubjects: unknown[] = [actualLiteral, null]
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS.filter(
    (x) => x !== null
  )

  type Expected = typeof actualLiteral | null

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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = parse(schema, subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = validate(schema, subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.parse(subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.validate(subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

describe('brand (boolean literal)', () => {
  const actualLiteral = true
  const brandKey = 'x'
  const brandValue = 'y'
  const brandResultKey = `__${brandKey}`

  const schema = {
    type: 'literal',
    of: actualLiteral,
    brand: [brandKey, brandValue],
  } as const satisfies Schema

  const struct = literal(actualLiteral).brand(brandKey, brandValue)

  const validSubjects: unknown[] = [actualLiteral]
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS

  type Expected = typeof actualLiteral & { [brandResultKey]: typeof brandValue }

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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = parse(schema, subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = validate(schema, subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.parse(subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.validate(subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

describe('description (string literal)', () => {
  const actualLiteral = 'x'
  const description = 'x'
  const schema = {
    type: 'literal',
    of: actualLiteral,
    description,
  } as const satisfies Schema
  const struct = literal(actualLiteral).description(description)

  it('Struct `__schema` should be identical to static `schema`', () => {
    type Expected = typeof schema
    type Actual = typeof struct.__schema

    check<Actual, Expected>()
    check<Expected, Actual>()

    expect(struct.__schema).toStrictEqual(schema)
  })
})

describe('optional + nullable + brand + description (number literal)', () => {
  const actualLiteral = 0
  const description = 'x'

  const schema = {
    type: 'literal',
    of: actualLiteral,
    optional: true,
    nullable: true,
    brand: ['x', 'y'],
    description,
  } as const satisfies Schema

  const struct = literal(actualLiteral)
    .optional()
    .nullable()
    .brand('x', 'y')
    .description(description)

  const validSubjects: unknown[] = [actualLiteral, null, undefined]
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS.filter((x) => {
    if (x === undefined) return false
    if (x === null) return false
    return true
  })

  type Expected = (typeof actualLiteral & { __x: 'y' }) | undefined | null

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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = parse(schema, subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = validate(schema, subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Parse INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.parse(subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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

        if (actual.left) {
          throw Error('Not expected')
        }

        type Actual = typeof actual.right

        check<Actual, Expected>()
        check<Expected, Actual>()

        expect(actual.right).toBe(subject)
        expect(actual.left).toBeUndefined()
      }
    })

    it('Validate INVALID_TYPE subjects', () => {
      for (const subject of invalidSubjects) {
        const actual = struct.validate(subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
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
