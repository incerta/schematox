import { ERROR_CODE } from '../error'
import { parse } from '../parse'
import { number } from '../struct'
import { check } from './test-utils'

import { Schema } from '../types/compounds'

const VALID_TYPE_SUBJECTS = [-1000_000_000, 0, 1000_000_000] as unknown[]
const INVALID_TYPE_SUBJECTS = [
  'string',
  undefined,
  null,
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
  const schema = { type: 'number' } as const satisfies Schema
  const struct = number()

  const validSubjects: unknown[] = VALID_TYPE_SUBJECTS
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS

  type Expected = number

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
  })
})

describe('optional', () => {
  const schema = { type: 'number', optional: true } as const satisfies Schema
  const struct = number().optional()

  const validSubjects: unknown[] = [...VALID_TYPE_SUBJECTS, undefined]
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS.filter(
    (x) => x !== undefined
  )

  type Expected = number | undefined

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
  })
})

describe('nullable', () => {
  const schema = { type: 'number', nullable: true } as const satisfies Schema
  const struct = number().nullable()

  const validSubjects: unknown[] = [...VALID_TYPE_SUBJECTS, null]
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS.filter(
    (x) => x !== null
  )

  type Expected = number | null

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
  })
})

describe('brand', () => {
  const brandKey = 'x'
  const brandValue = 'y'
  const brandResultKey = `__${brandKey}`

  const schema = {
    type: 'number',
    brand: [brandKey, brandValue],
  } as const satisfies Schema

  const struct = number().brand(brandKey, brandValue)

  const validSubjects = VALID_TYPE_SUBJECTS
  const invalidSubjects = INVALID_TYPE_SUBJECTS

  type Expected = number & { [brandResultKey]: typeof brandValue }

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
  })
})

describe('minLength', () => {
  const min = 2
  const schema = { type: 'number', min } as const satisfies Schema
  const struct = number().min(min)

  const validRangeSubjects: unknown[] = [2, 3, 4]
  const invalidTypeSubjects: unknown[] = INVALID_TYPE_SUBJECTS
  const invalidRangeSubjects: unknown[] = [-1, 0, 1]

  type Expected = number

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
      for (const subject of invalidTypeSubjects) {
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

    it('Parse INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = parse(schema, subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })
  })

  describe('Struct method parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validRangeSubjects) {
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
      for (const subject of invalidTypeSubjects) {
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

    it('Parse INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = struct.parse(subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })
  })
})

describe('maxLength', () => {
  const max = 2
  const schema = { type: 'number', max } as const satisfies Schema
  const struct = number().max(max)

  const validRangeSubjects: unknown[] = [-1, 0, 1, 2]
  const invalidTypeSubjects: unknown[] = INVALID_TYPE_SUBJECTS
  const invalidRangeSubjects: unknown[] = [3, 4, 5]

  type Expected = number

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
      for (const subject of invalidTypeSubjects) {
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

    it('Parse INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = parse(schema, subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })
  })

  describe('Struct method parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validRangeSubjects) {
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
      for (const subject of invalidTypeSubjects) {
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

    it('Parse INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = struct.parse(subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })
  })
})

describe('description', () => {
  const description = 'x'
  const schema = { type: 'number', description } as const satisfies Schema
  const struct = number().description(description)

  it('Struct `__schema` should be identical to static `schema`', () => {
    type Expected = typeof schema
    type Actual = typeof struct.__schema

    check<Actual, Expected>()
    check<Expected, Actual>()

    expect(struct.__schema).toStrictEqual(schema)
  })
})

describe('optional + nullable + brand + minLength + maxLength + description', () => {
  const min = -1
  const max = 1
  const description = 'x'

  const schema = {
    type: 'number',
    optional: true,
    nullable: true,
    brand: ['x', 'y'],
    description,
    max,
    min,
  } as const satisfies Schema

  const struct = number()
    .optional()
    .nullable()
    .brand('x', 'y')
    .min(min)
    .max(max)
    .description(description)

  const validRangeSubjects: unknown[] = [-1, 0, 1, undefined, null]
  const invalidRangeSubjects: unknown[] = [-3, -2, 2, 3]

  const invalidTypeSubjects = INVALID_TYPE_SUBJECTS.filter((x) => {
    if (x === undefined) return false
    if (x === null) return false
    return true
  })

  type Expected = (number & { __x: 'y' }) | undefined | null

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
      for (const subject of invalidTypeSubjects) {
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

    it('Parse INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = parse(schema, subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })
  })

  describe('Struct method parse/validate/guard', () => {
    it('Parse valid subjects', () => {
      for (const subject of validRangeSubjects) {
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
      for (const subject of invalidTypeSubjects) {
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

    it('Parse INVALID_RANGE subjects', () => {
      for (const subject of invalidRangeSubjects) {
        const actual = struct.parse(subject)

        if (actual.left === undefined) {
          throw Error('Not expected')
        }

        expect(actual.right).toBeUndefined()
        expect(actual.left).toStrictEqual([
          {
            code: ERROR_CODE.invalidRange,
            schema: struct.__schema,
            subject: subject,
            path: [],
          },
        ])
      }
    })
  })
})
