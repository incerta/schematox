import { check } from '../test-utils'

import type { Schema } from '../../types/compounds'
import type { SubjectType } from '../../types/constructors'

describe('Construct PrimitiveSchema subject type', () => {
  describe('String schema', () => {
    it('Required', () => {
      const schema = { type: 'string' } as const satisfies Schema

      type Expected = string
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional', () => {
      const schema = {
        type: 'string',
        optional: true,
      } as const satisfies Schema

      type Expected = string | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Nullable', () => {
      const schema = {
        type: 'string',
        nullable: true,
      } as const satisfies Schema

      type Expected = string | null
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Branded', () => {
      const schema = {
        type: 'string',
        brand: ['x', 'y'],
      } as const satisfies Schema

      type Expected = string & { __x: 'y' }
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional + nullable + branded', () => {
      const schema = {
        type: 'string',
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies Schema

      type Expected = (string & { __x: 'y' }) | null | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })
  })

  describe('Number schema', () => {
    it('Required', () => {
      const schema = { type: 'number' } as const satisfies Schema

      type Expected = number
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional', () => {
      const schema = {
        type: 'number',
        optional: true,
      } as const satisfies Schema

      type Expected = number | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Nullable', () => {
      const schema = {
        type: 'number',
        nullable: true,
      } as const satisfies Schema

      type Expected = number | null
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Branded', () => {
      const schema = {
        type: 'number',
        brand: ['x', 'y'],
      } as const satisfies Schema

      type Expected = number & { __x: 'y' }
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional + nullable + branded', () => {
      const schema = {
        type: 'number',
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies Schema

      type Expected = (number & { __x: 'y' }) | null | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })
  })

  describe('Boolean schema', () => {
    it('Required', () => {
      const schema = { type: 'boolean' } as const satisfies Schema

      type Expected = boolean
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional', () => {
      const schema = {
        type: 'boolean',
        optional: true,
      } as const satisfies Schema

      type Expected = boolean | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Nullable', () => {
      const schema = {
        type: 'boolean',
        nullable: true,
      } as const satisfies Schema

      type Expected = boolean | null
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Branded', () => {
      const schema = {
        type: 'boolean',
        brand: ['x', 'y'],
      } as const satisfies Schema

      type Expected = boolean & { __x: 'y' }
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional + nullable + branded', () => {
      const schema = {
        type: 'boolean',
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies Schema

      type Expected = (boolean & { __x: 'y' }) | null | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })
  })

  describe('Literal string schema', () => {
    it('Required', () => {
      const subject = 'x'
      const schema = { type: 'literal', of: subject } as const satisfies Schema

      type Expected = typeof subject
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional', () => {
      const subject = 'x'
      const schema = {
        type: 'literal',
        of: subject,
        optional: true,
      } as const satisfies Schema

      type Expected = typeof subject | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Nullable', () => {
      const subject = 'x'
      const schema = {
        type: 'literal',
        of: subject,
        nullable: true,
      } as const satisfies Schema

      type Expected = typeof subject | null
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Branded', () => {
      const subject = 'x'
      const schema = {
        type: 'literal',
        of: subject,
        brand: ['x', 'y'],
      } as const satisfies Schema

      type Expected = typeof subject & { __x: 'y' }
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional + nullable + branded', () => {
      const subject = 'x'
      const schema = {
        type: 'literal',
        of: subject,
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies Schema

      type Expected = (typeof subject & { __x: 'y' }) | null | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })
  })

  describe('Literal number schema', () => {
    it('Required', () => {
      const subject = 0
      const schema = { type: 'literal', of: subject } as const satisfies Schema

      type Expected = typeof subject
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional', () => {
      const subject = 0
      const schema = {
        type: 'literal',
        of: subject,
        optional: true,
      } as const satisfies Schema

      type Expected = typeof subject | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Nullable', () => {
      const subject = 0
      const schema = {
        type: 'literal',
        of: subject,
        nullable: true,
      } as const satisfies Schema

      type Expected = typeof subject | null
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Branded', () => {
      const subject = 0
      const schema = {
        type: 'literal',
        of: subject,
        brand: ['x', 'y'],
      } as const satisfies Schema

      type Expected = typeof subject & { __x: 'y' }
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional + nullable + branded', () => {
      const subject = 0
      const schema = {
        type: 'literal',
        of: subject,
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies Schema

      type Expected = (typeof subject & { __x: 'y' }) | null | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })
  })
})

describe('Construct ArraySchema subject type', () => {
  describe('Parent schema type related parameters', () => {
    const nested = { type: 'string' } as const satisfies Schema
    type T = SubjectType<typeof nested>

    it('Required', () => {
      const schema = { type: 'array', of: nested } as const satisfies Schema

      type Expected = T[]
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional', () => {
      const schema = {
        type: 'array',
        of: nested,
        optional: true,
      } as const satisfies Schema

      type Expected = T[] | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Nullable', () => {
      const schema = {
        type: 'array',
        of: nested,
        nullable: true,
      } as const satisfies Schema

      type Expected = T[] | null
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional + nullable', () => {
      const schema = {
        type: 'array',
        of: nested,
        optional: true,
        nullable: true,
      } as const satisfies Schema

      type Expected = T[] | null | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })
  })

  describe('Nested PrimitiveSchema with no/all type related parameters set', () => {
    it('String required', () => {
      const nested = { type: 'string' } as const satisfies Schema
      const schema = { type: 'array', of: nested } as const satisfies Schema

      type Expected = string[]
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('String optional + nullable + branded', () => {
      const nested = {
        type: 'string',
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies Schema

      const schema = {
        type: 'array',
        of: nested,
      } as const satisfies Schema

      type Expected = Array<(string & { __x: 'y' }) | null | undefined>
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Number required', () => {
      const nested = { type: 'string' } as const satisfies Schema
      const schema = { type: 'array', of: nested } as const satisfies Schema

      type Expected = string[]
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Number optional + nullable + branded', () => {
      const nested = {
        type: 'string',
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies Schema

      const schema = {
        type: 'array',
        of: nested,
      } as const satisfies Schema

      type Expected = Array<(string & { __x: 'y' }) | null | undefined>
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Boolean required', () => {
      const nested = { type: 'boolean' } as const satisfies Schema
      const schema = { type: 'array', of: nested } as const satisfies Schema

      type Expected = boolean[]
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Boolean optional + nullable + branded', () => {
      const nested = {
        type: 'boolean',
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies Schema

      const schema = {
        type: 'array',
        of: nested,
      } as const satisfies Schema

      type Expected = Array<(boolean & { __x: 'y' }) | null | undefined>
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Literal string required', () => {
      const subject = 'x'
      const nested = {
        type: 'literal',
        of: subject,
      } as const satisfies Schema
      const schema = { type: 'array', of: nested } as const satisfies Schema

      type Expected = Array<typeof subject>
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Literal string optional + nullable + branded', () => {
      const subject = 'x'
      const nested = {
        type: 'literal',
        of: subject,
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies Schema

      const schema = {
        type: 'array',
        of: nested,
      } as const satisfies Schema

      type Expected = Array<(typeof subject & { __x: 'y' }) | null | undefined>
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Literal string required', () => {
      const subject = 0
      const nested = {
        type: 'literal',
        of: subject,
      } as const satisfies Schema
      const schema = { type: 'array', of: nested } as const satisfies Schema

      type Expected = Array<typeof subject>
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Literal string optional + nullable + branded', () => {
      const subject = 0
      const nested = {
        type: 'literal',
        of: subject,
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies Schema

      const schema = {
        type: 'array',
        of: nested,
      } as const satisfies Schema

      type Expected = Array<(typeof subject & { __x: 'y' }) | null | undefined>
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })
  })

  describe('Nested CompoundSchema with no/all type related parameters set', () => {
    const deeplyNested = { type: 'string' } as const satisfies Schema
    type T = SubjectType<typeof deeplyNested>

    it('ArraySchema required', () => {
      const nested = {
        type: 'array',
        of: deeplyNested,
      } as const satisfies Schema

      const schema = {
        type: 'array',
        of: nested,
      } as const satisfies Schema

      type Expected = Array<T[]>
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('ArraySchema optional + nullable', () => {
      const nested = {
        type: 'array',
        of: deeplyNested,
        optional: true,
        nullable: true,
      } as const satisfies Schema

      const schema = {
        type: 'array',
        of: nested,
      } as const satisfies Schema

      type Expected = Array<T[] | null | undefined>
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('ObjectSchema required', () => {
      const nested = {
        type: 'object',
        of: { x: deeplyNested },
      } as const satisfies Schema

      const schema = {
        type: 'array',
        of: nested,
      } as const satisfies Schema

      type Expected = Array<{ x: T }>
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('ObjectSchema optional + nullable', () => {
      const nested = {
        type: 'object',
        of: { x: deeplyNested },
        optional: true,
        nullable: true,
      } as const satisfies Schema

      const schema = {
        type: 'array',
        of: nested,
      } as const satisfies Schema

      type Expected = Array<{ x: T } | null | undefined>
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('UnionSchema required', () => {
      const subjX = 'x'
      const subjY = 'y'

      type T = typeof subjX | typeof subjY

      const nested = {
        type: 'union',
        of: [
          { type: 'literal', of: subjX },
          { type: 'literal', of: subjY },
        ],
      } as const satisfies Schema

      const schema = {
        type: 'array',
        of: nested,
      } as const satisfies Schema

      type Expected = T[]
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('UnionSchema optional + nullable', () => {
      const subjX = 'x'
      const subjY = 'y'

      type T = typeof subjX | typeof subjY

      const nested = {
        type: 'union',
        of: [
          { type: 'literal', of: subjX },
          { type: 'literal', of: subjY },
        ],
        optional: true,
        nullable: true,
      } as const satisfies Schema

      const schema = {
        type: 'array',
        of: nested,
      } as const satisfies Schema

      type Expected = Array<T | null | undefined>
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })
  })
})

describe('Construct UnionSchema subject type', () => {
  describe('Parent schema type related parameters', () => {
    const nested = { type: 'string' } as const satisfies Schema
    type T = SubjectType<typeof nested>

    it('Required', () => {
      const schema = { type: 'union', of: [nested] } as const satisfies Schema

      type Expected = T
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional', () => {
      const schema = {
        type: 'union',
        of: [nested],
        optional: true,
      } as const satisfies Schema

      type Expected = T | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Nullable', () => {
      const schema = {
        type: 'union',
        of: [nested],
        nullable: true,
      } as const satisfies Schema

      type Expected = T | null
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional + nullable', () => {
      const schema = {
        type: 'union',
        of: [nested],
        optional: true,
        nullable: true,
      } as const satisfies Schema

      type Expected = T | null | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })
  })

  describe('Nested PrimitiveSchema with no/all type related parameters', () => {
    it('string/number/boolean required', () => {
      const schema = {
        type: 'union',
        of: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
      } as const satisfies Schema

      type Expected = string | number | boolean
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('string/number/boolean all optional + nullable + branded', () => {
      const schema = {
        type: 'union',
        of: [
          { type: 'string', optional: true, nullable: true, brand: ['x', 'y'] },
          { type: 'number', optional: true, nullable: true, brand: ['y', 'y'] },
          {
            type: 'boolean',
            optional: true,
            nullable: true,
            brand: ['z', 'y'],
          },
        ],
      } as const satisfies Schema

      type Expected =
        | (string & { __x: 'y' })
        | (number & { __y: 'y' })
        | (boolean & { __z: 'y' })
        | null
        | undefined

      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('literal required', () => {
      const schema = {
        type: 'union',
        of: [
          { type: 'literal', of: 'x' },
          { type: 'literal', of: 0 },
        ],
      } as const satisfies Schema

      type Expected = 'x' | 0
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('literal optional + nullable + branded', () => {
      const schema = {
        type: 'union',
        of: [
          {
            type: 'literal',
            of: 'x',
            optional: true,
            nullable: true,
            brand: ['x', 'y'],
          },
          {
            type: 'literal',
            of: 0,
            optional: true,
            nullable: true,
            brand: ['y', 'y'],
          },
        ],
      } as const satisfies Schema

      type Expected =
        | ('x' & { __x: 'y' })
        | (0 & { __y: 'y' })
        | undefined
        | null

      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })
  })
})

describe('Construct ObjectSchema subject type', () => {
  describe('Parent schema type related parameters', () => {
    const nested = { type: 'string' } as const satisfies Schema
    type T = SubjectType<typeof nested>

    it('Required', () => {
      const schema = {
        type: 'object',
        of: { x: nested },
      } as const satisfies Schema

      type Expected = { x: T }
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional', () => {
      const schema = {
        type: 'object',
        of: { x: nested },
        optional: true,
      } as const satisfies Schema

      type Expected = { x: T } | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Nullable', () => {
      const schema = {
        type: 'object',
        of: { x: nested },
        nullable: true,
      } as const satisfies Schema

      type Expected = { x: T } | null
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional + nullable', () => {
      const schema = {
        type: 'object',
        of: { x: nested },
        optional: true,
        nullable: true,
      } as const satisfies Schema

      type Expected = { x: T } | null | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })
  })

  describe('Nested PrimitiveSchema with no/all type related parameters', () => {
    it('Required', () => {
      const schema = {
        type: 'object',
        of: {
          string: { type: 'string' },
          number: { type: 'number' },
          boolean: { type: 'boolean' },
          literalString: { type: 'literal', of: 'x' },
          literalNumber: { type: 'literal', of: 0 },
        },
      } as const satisfies Schema

      type Expected = {
        string: string
        number: number
        boolean: boolean
        literalString: 'x'
        literalNumber: 0
      }

      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional + nullable + branded', () => {
      const schema = {
        type: 'object',
        of: {
          string: {
            type: 'string',
            optional: true,
            nullable: true,
            brand: ['x', 'string'],
          },
          number: {
            type: 'number',
            optional: true,
            nullable: true,
            brand: ['x', 'number'],
          },
          boolean: {
            type: 'boolean',
            optional: true,
            nullable: true,
            brand: ['x', 'boolean'],
          },
          literalString: {
            type: 'literal',
            of: 'x',
            optional: true,
            nullable: true,
            brand: ['x', 'literalString'],
          },
          literalNumber: {
            type: 'literal',
            of: 0,
            optional: true,
            nullable: true,
            brand: ['x', 'literalNumber'],
          },
        },
      } as const satisfies Schema

      type Expected = {
        string?: (string & { __x: 'string' }) | null
        number?: (number & { __x: 'number' }) | null
        boolean?: (boolean & { __x: 'boolean' }) | null
        literalString?: ('x' & { __x: 'literalString' }) | null
        literalNumber?: (0 & { __x: 'literalNumber' }) | null
      }

      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })
  })

  describe('Nested CompoundSchema with no/all type related parameters', () => {
    const deeplyNested = { type: 'string' } as const satisfies Schema
    type T = SubjectType<typeof deeplyNested>

    it('Required', () => {
      const schema = {
        type: 'object',
        of: {
          object: {
            type: 'object',
            of: {
              x: deeplyNested,
            },
          },
          array: {
            type: 'array',
            of: deeplyNested,
          },
          union: {
            type: 'union',
            of: [deeplyNested],
          },
        },
      } as const satisfies Schema

      type Expected = {
        object: { x: T }
        array: T[]
        union: T
      }

      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional + nullable', () => {
      const schema = {
        type: 'object',
        of: {
          object: {
            type: 'object',
            of: {
              x: deeplyNested,
            },
            optional: true,
            nullable: true,
          },
          array: {
            type: 'array',
            of: deeplyNested,
            optional: true,
            nullable: true,
          },
          union: {
            type: 'union',
            of: [deeplyNested],
            optional: true,
            nullable: true,
          },
        },
      } as const satisfies Schema

      type Expected = {
        object?: { x: T } | null | undefined
        array?: T[] | null | undefined
        union?: string | null | undefined
      }

      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })
  })
})

describe('Construct RECORD subject type', () => {
  describe('Parent schema type related parameters', () => {
    const nested = { type: 'string' } as const satisfies Schema

    it('Required', () => {
      const schema = {
        type: 'record',
        of: nested,
      } as const satisfies Schema

      type Expected = Record<string, string>
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional', () => {
      const schema = {
        type: 'record',
        of: nested,
        optional: true,
      } as const satisfies Schema

      type Expected = Record<string, string> | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Nullable', () => {
      const schema = {
        type: 'record',
        of: nested,
        nullable: true,
      } as const satisfies Schema

      type Expected = Record<string, string> | null
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional + nullable', () => {
      const schema = {
        type: 'record',
        of: nested,
        optional: true,
        nullable: true,
      } as const satisfies Schema

      type Expected = Record<string, string> | null | undefined
      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('With branded key', () => {
      const schema = {
        key: { type: 'string', brand: ['x', 'y'] },
        type: 'record',
        of: nested,
      } as const satisfies Schema

      type Expected = Record<string & { __x: 'y' }, string | undefined>
      type Actual = SubjectType<typeof schema>

      check<keyof Actual, keyof Expected>()
      check<keyof Expected, keyof Actual>()
    })
  })

  describe('Nested CompoundSchema with no/all type related parameters', () => {
    const deeplyNested = { type: 'string' } as const satisfies Schema
    type T = SubjectType<typeof deeplyNested>

    it('Required', () => {
      const schema = {
        type: 'record',
        of: {
          type: 'object',
          of: {
            object: {
              type: 'object',
              of: {
                x: deeplyNested,
              },
            },
            array: {
              type: 'array',
              of: deeplyNested,
            },
            union: {
              type: 'union',
              of: [deeplyNested],
            },
          },
        },
      } as const satisfies Schema

      type Expected = Record<
        string,
        {
          object: { x: T }
          array: T[]
          union: T
        }
      >

      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })

    it('Optional + nullable', () => {
      const schema = {
        type: 'record',
        of: {
          type: 'object',
          of: {
            object: {
              type: 'object',
              of: {
                x: deeplyNested,
              },
              optional: true,
              nullable: true,
            },
            array: {
              type: 'array',
              of: deeplyNested,
              optional: true,
              nullable: true,
            },
            union: {
              type: 'union',
              of: [deeplyNested],
              optional: true,
              nullable: true,
            },
          },
        },
      } as const satisfies Schema

      type Expected = Record<
        string,
        {
          object?: { x: T } | null | undefined
          array?: T[] | null | undefined
          union?: string | null | undefined
        }
      >

      type Actual = SubjectType<typeof schema>

      check<Actual, Expected>()
      check<Expected, Actual>()
    })
  })
})

describe('Construct Schema subject type in the context of deeply nested schemas', () => {
  const deeplyNested = { type: 'string' } as const satisfies Schema
  type T = SubjectType<typeof deeplyNested>

  it('ArraySchema should allow 7 depth levels', () => {
    const schema = {
      // Depth 1
      type: 'array',
      of: {
        // Depth 2
        type: 'array',
        of: {
          // Depth 3
          type: 'array',
          of: {
            // Depth 4
            type: 'array',
            of: {
              // Depth 5
              type: 'array',
              of: {
                // Depth 6
                type: 'array',
                of: {
                  // Depth 7
                  type: 'array',
                  of: deeplyNested,
                },
              },
            },
          },
        },
      },
    } as const satisfies Schema

    type Expected = Array<Array<Array<Array<Array<Array<Array<T>>>>>>>
    type Actual = SubjectType<typeof schema>

    check<Actual, Expected>()
    check<Expected, Actual>()
  })

  it('ObjectSchema should allow 7 depth levels', () => {
    const schema = {
      // Depth 1
      type: 'object',
      of: {
        x: {
          // Depth 2
          type: 'object',
          of: {
            x: {
              // Depth 3
              type: 'object',
              of: {
                x: {
                  // Depth 4
                  type: 'object',
                  of: {
                    x: {
                      // Depth 5
                      type: 'object',
                      of: {
                        x: {
                          // Depth 6
                          type: 'object',
                          of: {
                            x: {
                              // Depth 7
                              type: 'object',
                              of: {
                                x: deeplyNested,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    } as const satisfies Schema

    type Expected = { x: { x: { x: { x: { x: { x: { x: T } } } } } } }
    type Actual = SubjectType<typeof schema>

    check<Actual, Expected>()
    check<Expected, Actual>()
  })
})
