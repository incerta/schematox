import { ERROR_CODE } from '../error'
import { parse } from '../parse'
import { boolean } from '../struct'
import { check } from './test-utils'

import { Schema } from '../types/compounds'

const VALID_TYPE_SUBJECTS = [true, false] as unknown[]
const INVALID_TYPE_SUBJECTS = [
  undefined,
  null,
  'string',
  0,
  Infinity,
  -Infinity,
  NaN,
  /^regexp/,
  {},
  [],
  new Map(),
  new Set(),
] as unknown[]

describe('No schema parameters', () => {
  const schema = { type: 'boolean' } as const satisfies Schema
  const struct = boolean()

  const validSubjects: unknown[] = VALID_TYPE_SUBJECTS
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS

  type Expected = boolean

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
  const schema = { type: 'boolean', optional: true } as const satisfies Schema
  const struct = boolean().optional()

  const validSubjects: unknown[] = [...VALID_TYPE_SUBJECTS, undefined]
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS.filter(
    (x) => x !== undefined
  )

  type Expected = boolean | undefined

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
  const schema = { type: 'boolean', nullable: true } as const satisfies Schema
  const struct = boolean().nullable()

  const validSubjects: unknown[] = [...VALID_TYPE_SUBJECTS, null]
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS.filter(
    (x) => x !== null
  )

  type Expected = boolean | null

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
    type: 'boolean',
    brand: [brandKey, brandValue],
  } as const satisfies Schema

  const struct = boolean().brand(brandKey, brandValue)

  const validSubjects = VALID_TYPE_SUBJECTS
  const invalidSubjects = INVALID_TYPE_SUBJECTS

  type Expected = boolean & { [brandResultKey]: typeof brandValue }

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

describe('description', () => {
  const description = 'x'
  const schema = { type: 'boolean', description } as const satisfies Schema
  const struct = boolean().description(description)

  it('Struct `__schema` should be identical to static `schema`', () => {
    type Expected = typeof schema
    type Actual = typeof struct.__schema

    check<Actual, Expected>()
    check<Expected, Actual>()

    expect(struct.__schema).toStrictEqual(schema)
  })
})

describe('optional + nullable + brand + description', () => {
  const description = 'x'

  const schema = {
    type: 'boolean',
    optional: true,
    nullable: true,
    brand: ['x', 'y'],
    description,
  } as const satisfies Schema

  const struct = boolean()
    .optional()
    .nullable()
    .brand('x', 'y')
    .description(description)

  const validSubjects: unknown[] = [true, false, undefined, null]
  const invalidSubjects: unknown[] = INVALID_TYPE_SUBJECTS.filter((x) => {
    if (x === undefined) return false
    if (x === null) return false
    return true
  })

  type Expected = (boolean & { __x: 'y' }) | undefined | null

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
