import * as x from '../../index'

describe('Construct all primitive schemas subject type', () => {
  describe('BooleanSchema', () => {
    it('required', () => {
      const schema = { type: 'boolean' } as const satisfies x.Schema

      type Expected = boolean
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional', () => {
      const schema = {
        type: 'boolean',
        optional: true,
      } as const satisfies x.Schema

      type Expected = boolean | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('nullable', () => {
      const schema = {
        type: 'boolean',
        nullable: true,
      } as const satisfies x.Schema

      type Expected = boolean | null
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('brand', () => {
      const schema = {
        type: 'boolean',
        brand: ['x', 'y'],
      } as const satisfies x.Schema

      type Expected = boolean & { __x: 'y' }
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable + brand', () => {
      const schema = {
        type: 'boolean',
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies x.Schema

      type Expected = (boolean & { __x: 'y' }) | null | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })

  describe('LiteralSchema boolean', () => {
    it('required', () => {
      const subject = false
      const schema = {
        type: 'literal',
        of: subject,
      } as const satisfies x.Schema

      type Expected = typeof subject
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional', () => {
      const subject = true
      const schema = {
        type: 'literal',
        of: subject,
        optional: true,
      } as const satisfies x.Schema

      type Expected = typeof subject | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('nullable', () => {
      const subject = false
      const schema = {
        type: 'literal',
        of: subject,
        nullable: true,
      } as const satisfies x.Schema

      type Expected = typeof subject | null
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('brand', () => {
      const subject = true
      const schema = {
        type: 'literal',
        of: subject,
        brand: ['x', 'y'],
      } as const satisfies x.Schema

      type Expected = typeof subject & { __x: 'y' }
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable + brand', () => {
      const subject = true
      const schema = {
        type: 'literal',
        of: subject,
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies x.Schema

      type Expected = (typeof subject & { __x: 'y' }) | null | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })

  describe('LiteralSchema number', () => {
    it('required', () => {
      const subject = 0
      const schema = {
        type: 'literal',
        of: subject,
      } as const satisfies x.Schema

      type Expected = typeof subject
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional', () => {
      const subject = 0
      const schema = {
        type: 'literal',
        of: subject,
        optional: true,
      } as const satisfies x.Schema

      type Expected = typeof subject | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('nullable', () => {
      const subject = 0
      const schema = {
        type: 'literal',
        of: subject,
        nullable: true,
      } as const satisfies x.Schema

      type Expected = typeof subject | null
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('brand', () => {
      const subject = 0
      const schema = {
        type: 'literal',
        of: subject,
        brand: ['x', 'y'],
      } as const satisfies x.Schema

      type Expected = typeof subject & { __x: 'y' }
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable + brand', () => {
      const subject = 0
      const schema = {
        type: 'literal',
        of: subject,
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies x.Schema

      type Expected = (typeof subject & { __x: 'y' }) | null | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })

  describe('LiteralSchema string', () => {
    it('required', () => {
      const subject = 'x'
      const schema = {
        type: 'literal',
        of: subject,
      } as const satisfies x.Schema

      type Expected = typeof subject
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional', () => {
      const subject = 'x'
      const schema = {
        type: 'literal',
        of: subject,
        optional: true,
      } as const satisfies x.Schema

      type Expected = typeof subject | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('nullable', () => {
      const subject = 'x'
      const schema = {
        type: 'literal',
        of: subject,
        nullable: true,
      } as const satisfies x.Schema

      type Expected = typeof subject | null
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('brand', () => {
      const subject = 'x'
      const schema = {
        type: 'literal',
        of: subject,
        brand: ['x', 'y'],
      } as const satisfies x.Schema

      type Expected = typeof subject & { __x: 'y' }
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable + brand', () => {
      const subject = 'x'
      const schema = {
        type: 'literal',
        of: subject,
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies x.Schema

      type Expected = (typeof subject & { __x: 'y' }) | null | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })

  describe('NumberSchema', () => {
    it('required', () => {
      const schema = { type: 'number' } as const satisfies x.Schema

      type Expected = number
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional', () => {
      const schema = {
        type: 'number',
        optional: true,
      } as const satisfies x.Schema

      type Expected = number | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('nullable', () => {
      const schema = {
        type: 'number',
        nullable: true,
      } as const satisfies x.Schema

      type Expected = number | null
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('brand', () => {
      const schema = {
        type: 'number',
        brand: ['x', 'y'],
      } as const satisfies x.Schema

      type Expected = number & { __x: 'y' }
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable + brand', () => {
      const schema = {
        type: 'number',
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies x.Schema

      type Expected = (number & { __x: 'y' }) | null | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })

  describe('StringSchema', () => {
    it('required', () => {
      const schema = { type: 'string' } as const satisfies x.Schema

      type Expected = string
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional', () => {
      const schema = {
        type: 'string',
        optional: true,
      } as const satisfies x.Schema

      type Expected = string | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('nullable', () => {
      const schema = {
        type: 'string',
        nullable: true,
      } as const satisfies x.Schema

      type Expected = string | null
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('brand', () => {
      const schema = {
        type: 'string',
        brand: ['x', 'y'],
      } as const satisfies x.Schema

      type Expected = string & { __x: 'y' }
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable + brand', () => {
      const schema = {
        type: 'string',
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies x.Schema

      type Expected = (string & { __x: 'y' }) | null | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })
})

describe('Construct ArraySchema subject type', () => {
  describe('Parent schema type related parameters', () => {
    const nested = { type: 'string' } as const satisfies x.Schema
    type T = x.Infer<typeof nested>

    it('required', () => {
      const schema = { type: 'array', of: nested } as const satisfies x.Schema

      type Expected = T[]
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional', () => {
      const schema = {
        type: 'array',
        of: nested,
        optional: true,
      } as const satisfies x.Schema

      type Expected = T[] | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('nullable', () => {
      const schema = {
        type: 'array',
        of: nested,
        nullable: true,
      } as const satisfies x.Schema

      type Expected = T[] | null
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable', () => {
      const schema = {
        type: 'array',
        of: nested,
        optional: true,
        nullable: true,
      } as const satisfies x.Schema

      type Expected = T[] | null | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })

  describe('Nested primitive schema with no/all type related parameters set', () => {
    it('required', () => {
      const nested = { type: 'boolean' } as const satisfies x.Schema
      const schema = { type: 'array', of: nested } as const satisfies x.Schema

      type Expected = boolean[]
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable + brand', () => {
      const nested = {
        type: 'boolean',
        optional: true,
        nullable: true,
        brand: ['x', 'y'],
      } as const satisfies x.Schema

      const schema = {
        type: 'array',
        of: nested,
      } as const satisfies x.Schema

      type Expected = Array<(boolean & { __x: 'y' }) | null | undefined>
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })

  describe('Nested compound schema with no/all type related parameters set', () => {
    const deeplyNested = { type: 'boolean' } as const satisfies x.Schema
    type T = x.Infer<typeof deeplyNested>

    it('required', () => {
      const nested = {
        type: 'array',
        of: deeplyNested,
      } as const satisfies x.Schema

      const schema = {
        type: 'array',
        of: nested,
      } as const satisfies x.Schema

      type Expected = Array<T[]>
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable', () => {
      const nested = {
        type: 'array',
        of: deeplyNested,
        optional: true,
        nullable: true,
      } as const satisfies x.Schema

      const schema = {
        type: 'array',
        of: nested,
      } as const satisfies x.Schema

      type Expected = Array<T[] | null | undefined>
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })
})

describe('Construct ObjectSchema subject type', () => {
  describe('Parent schema type related parameters', () => {
    const nested = { type: 'boolean' } as const satisfies x.Schema
    type T = x.Infer<typeof nested>

    it('required', () => {
      const schema = {
        type: 'object',
        of: { x: nested },
      } as const satisfies x.Schema

      type Expected = { x: T }
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional', () => {
      const schema = {
        type: 'object',
        of: { x: nested },
        optional: true,
      } as const satisfies x.Schema

      type Expected = { x: T } | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('nullable', () => {
      const schema = {
        type: 'object',
        of: { x: nested },
        nullable: true,
      } as const satisfies x.Schema

      type Expected = { x: T } | null
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable', () => {
      const schema = {
        type: 'object',
        of: { x: nested },
        optional: true,
        nullable: true,
      } as const satisfies x.Schema

      type Expected = { x: T } | null | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })

  describe('Nested primitive schema with no/all type related parameters', () => {
    it('required', () => {
      const schema = {
        type: 'object',
        of: {
          boolean: { type: 'boolean' },
          literalBoolean: { type: 'literal', of: false },
          literalNumber: { type: 'literal', of: 0 },
          literalString: { type: 'literal', of: 'x' },
          number: { type: 'number' },
          string: { type: 'string' },
        },
      } as const satisfies x.Schema

      type Expected = {
        boolean: boolean
        literalBoolean: false
        literalNumber: 0
        literalString: 'x'
        number: number
        string: string
      }

      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable + brand', () => {
      // prettier-ignore
      const schema = {
        type: 'object',
        of: {
          boolean: { type: 'boolean', optional: true, nullable: true, brand: ['x', 'boolean'] },
          literalBoolean: { type: 'literal', of: false, optional: true, nullable: true, brand: ['x', 'literalBoolean'] },
          literalNumber: { type: 'literal', of: 0, optional: true, nullable: true, brand: ['x', 'literalNumber'] },
          literalString: { type: 'literal', of: 'x', optional: true, nullable: true, brand: ['x', 'literalString'] },
          number: { type: 'number', optional: true, nullable: true, brand: ['x', 'number'] },
          string: { type: 'string', optional: true, nullable: true, brand: ['x', 'string'] },
        },
      } as const satisfies x.Schema

      type Expected = {
        boolean?: (boolean & { __x: 'boolean' }) | null
        literalBoolean?: (false & { __x: 'literalBoolean' }) | null
        literalNumber?: (0 & { __x: 'literalNumber' }) | null
        literalString?: ('x' & { __x: 'literalString' }) | null
        number?: (number & { __x: 'number' }) | null
        string?: (string & { __x: 'string' }) | null
      }

      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })

  describe('Nested compound schema with no/all type related parameters', () => {
    const deeplyNested = { type: 'string' } as const satisfies x.Schema
    type T = x.Infer<typeof deeplyNested>

    it('required', () => {
      // prettier-ignore
      const schema = {
        type: 'object',
        of: {
          array: { type: 'array', of: deeplyNested },
          object: { type: 'object', of: { x: deeplyNested }},
          record: { type: 'record', of: deeplyNested },
          union: { type: 'union', of: [deeplyNested]},
        },
      } as const satisfies x.Schema

      type Expected = {
        array: T[]
        object: { x: T }
        record: Record<string, T>
        union: T
      }

      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable', () => {
      // prettier-ignore
      const schema = {
        type: 'object',
        of: {
          array: { type: 'array', of: deeplyNested, optional: true, nullable: true },
          object: { type: 'object', of: { x: deeplyNested }, optional: true, nullable: true },
          record: { type: 'record', of: deeplyNested, optional: true, nullable: true },
          union: { type: 'union', of: [deeplyNested], optional: true, nullable: true },
        },
      } as const satisfies x.Schema

      type Expected = {
        array?: T[] | undefined | null
        object?: { x: T } | undefined | null
        record?: Record<string, T> | undefined | null
        union?: T | undefined | null
      }

      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })
})

describe('Construct RecordSchema subject type', () => {
  describe('Parent schema type related parameters', () => {
    const nested = { type: 'boolean' } as const satisfies x.Schema

    it('required', () => {
      const schema = {
        type: 'record',
        of: nested,
      } as const satisfies x.Schema

      type Expected = Record<string, boolean>
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional', () => {
      const schema = {
        type: 'record',
        of: nested,
        optional: true,
      } as const satisfies x.Schema

      type Expected = Record<string, boolean> | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('nullable', () => {
      const schema = {
        type: 'record',
        of: nested,
        nullable: true,
      } as const satisfies x.Schema

      type Expected = Record<string, boolean> | null
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('key brand', () => {
      const schema = {
        type: 'record',
        of: nested,
        key: { type: 'string', brand: ['x', 'y'] },
      } as const satisfies x.Schema

      type BrandedKey = string & { __x: 'y' }
      type Expected = Record<BrandedKey, boolean>
      type Actual = x.Infer<typeof schema>

      // @ts-expect-error must not allow not branded string key declaration
      const subject: Actual = { x: true }
      // @ts-expect-error must not allow not branded string property access
      subject['x'] = false
      subject['x' as BrandedKey]

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable + key brand', () => {
      const schema = {
        type: 'record',
        of: nested,
        optional: true,
        nullable: true,
        key: { type: 'string', brand: ['x', 'y'] },
      } as const satisfies x.Schema

      type BrandedKey = string & { __x: 'y' }
      type Expected = Record<BrandedKey, boolean> | null | undefined
      type Actual = x.Infer<typeof schema>

      // @ts-expect-error must not allow not branded string key declaration
      const subject: Actual = { x: true }

      // TODO: jest complains after #52 PR merge
      // // @ts-expect-error must not allow not branded string property access
      // subject?.['x'] = false

      subject?.['x' as BrandedKey]

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })

  describe('Nested compound schema with no/all type related parameters', () => {
    const deeplyNested = { type: 'boolean' } as const satisfies x.Schema
    type T = x.Infer<typeof deeplyNested>

    it('required', () => {
      const schema = {
        type: 'record',
        of: { type: 'array', of: deeplyNested },
      } as const satisfies x.Schema

      type Expected = Record<string, T[]>
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable', () => {
      const schema = {
        type: 'record',
        of: { type: 'array', of: deeplyNested, optional: true, nullable: true },
      } as const satisfies x.Schema

      type Expected = Record<string, T[] | undefined | null>
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })
})

describe('Construct UnionSchema subject type', () => {
  describe('Parent schema type related parameters', () => {
    const nested = { type: 'boolean' } as const satisfies x.Schema
    type T = x.Infer<typeof nested>

    it('required', () => {
      const schema = { type: 'union', of: [nested] } as const satisfies x.Schema

      type Expected = T
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional', () => {
      const schema = {
        type: 'union',
        of: [nested],
        optional: true,
      } as const satisfies x.Schema

      type Expected = T | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('nullable', () => {
      const schema = {
        type: 'union',
        of: [nested],
        nullable: true,
      } as const satisfies x.Schema

      type Expected = T | null
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable', () => {
      const schema = {
        type: 'union',
        of: [nested],
        optional: true,
        nullable: true,
      } as const satisfies x.Schema

      type Expected = T | null | undefined
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })

  describe('Nested primitive schema with no/all type related parameters', () => {
    it('required', () => {
      const schema = {
        type: 'union',
        of: [
          { type: 'boolean' },
          { type: 'literal', of: false },
          { type: 'literal', of: 0 },
          { type: 'literal', of: 'x' },
          { type: 'number' },
          { type: 'string' },
        ],
      } as const satisfies x.Schema

      type Expected = boolean | false | 0 | 'x' | number | string
      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable + brand', () => {
      // prettier-ignore
      const schema = {
        type: 'union',
        of: [
          { type: 'boolean', optional: true, nullable: true, brand: ['z', 'y'] },
          { type: 'literal', of: false, optional: true, nullable: true, brand: ['z', 'y']  },
          { type: 'literal', of: 0, optional: true, nullable: true, brand: ['z', 'y'] },
          { type: 'literal', of: 'x', optional: true, nullable: true, brand: ['z', 'y'] },
          { type: 'number', optional: true, nullable: true, brand: ['y', 'y'] },
          { type: 'string', optional: true, nullable: true, brand: ['x', 'y'] },
        ],
      } as const satisfies x.Schema

      type Expected =
        | (boolean & { __z: 'y' })
        | (true & { __z: 'y' })
        | (0 & { __z: 'y' })
        | ('x' & { __z: 'y' })
        | (number & { __y: 'y' })
        | (string & { __x: 'y' })
        | null
        | undefined

      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })

  describe('Nested compound schema with no/all type related parameters', () => {
    it('required', () => {
      // prettier-ignore
      const schema = {
        type: 'union',
        of: [
          { type: 'array', of: { type: 'boolean' }},
          { type: 'object', of: { x: { type: 'boolean' }}},
          { type: 'record', of: { type: 'boolean' }},
          { type: 'union', of: [{ type: 'boolean' }, { type: 'literal', of: 0 }]},
        ],
      } as const satisfies x.Schema

      type Expected =
        | boolean[]
        | { x: boolean }
        | Record<string, boolean>
        | boolean
        | 0

      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })

    it('optional + nullable', () => {
      // prettier-ignore
      const schema = {
        type: 'union',
        of: [
          { type: 'array', of: { type: 'boolean', optional: true, nullable: true }},
          { type: 'object', of: { x: { type: 'boolean', optional: true, nullable: true }}},
          { type: 'record', of: { type: 'boolean', optional: true, nullable: true }},
          { type: 'union', of: [{ type: 'boolean', optional: true, nullable: true }, { type: 'literal', of: 0, optional: true, nullable: true }]},
        ],
      } as const satisfies x.Schema

      type Expected =
        | Array<boolean | undefined | null>
        | { x?: boolean | undefined | null }
        | Record<string, boolean | undefined>
        | boolean
        | 0
        | undefined
        | null

      type Actual = x.Infer<typeof schema>

      x.tCh<Actual, Expected>()
      x.tCh<Expected, Actual>()
    })
  })
})

describe('Construct all compound schemas with 7 depth by itself', () => {
  const deeplyNested = { type: 'boolean' } as const satisfies x.Schema
  type T = x.Infer<typeof deeplyNested>

  it('ArraySchema', () => {
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
    } as const satisfies x.Schema

    type Expected = Array<Array<Array<Array<Array<Array<Array<T>>>>>>>
    type Actual = x.Infer<typeof schema>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()
  })

  it('ObjectSchema', () => {
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
    } as const satisfies x.Schema

    type Expected = { x: { x: { x: { x: { x: { x: { x: T } } } } } } }
    type Actual = x.Infer<typeof schema>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()
  })

  it('RecordSchema', () => {
    const schema = {
      // Depth 1
      type: 'record',
      of: {
        // Depth 2
        type: 'record',
        of: {
          // Depth 3
          type: 'record',
          of: {
            // Depth 4
            type: 'record',
            of: {
              // Depth 5
              type: 'record',
              of: {
                // Depth 6
                type: 'record',
                of: {
                  // Depth 7
                  type: 'record',
                  of: deeplyNested,
                },
              },
            },
          },
        },
      },
    } as const satisfies x.Schema

    type Expected = Record<
      string,
      Record<
        string,
        Record<
          string,
          Record<string, Record<string, Record<string, Record<string, T>>>>
        >
      >
    >

    type Actual = x.Infer<typeof schema>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()
  })

  it('UnionSchema', () => {
    const schema = {
      // Depth 1
      type: 'union',
      of: [
        {
          // Depth 2
          type: 'union',
          of: [
            {
              // Depth 3
              type: 'union',
              of: [
                {
                  // Depth 4
                  type: 'union',
                  of: [
                    {
                      // Depth 5
                      type: 'union',
                      of: [
                        {
                          // Depth 6
                          type: 'union',
                          of: [
                            {
                              // Depth 7
                              type: 'union',
                              of: [deeplyNested],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    } as const satisfies x.Schema

    type Expected = boolean
    type Actual = x.Infer<typeof schema>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()
  })
})

describe('Different kinds of brand', () => {
  it('brand: [string, boolean]', () => {
    const brand = ['Category', true] as const satisfies x.BrandSchema
    const schema = { type: 'boolean', brand } as const satisfies x.Schema

    const structA = x.boolean().brand('Category', true)
    const structB = x.boolean().brand(brand)
    const construct = x.makeStruct(schema)

    type Expected = { __Category: true } & boolean

    type Schema = x.Infer<typeof schema>

    x.tCh<Expected, Schema>()
    x.tCh<Schema, Expected>()

    type StructA = x.Infer<typeof structA>

    x.tCh<Expected, StructA>()
    x.tCh<StructA, Expected>()

    type StructB = x.Infer<typeof structB>

    x.tCh<Expected, StructB>()
    x.tCh<StructB, Expected>()

    type Construct = x.Infer<typeof construct>

    x.tCh<Expected, Construct>()
    x.tCh<Construct, Expected>()

    expect(structA.__schema.brand).toStrictEqual(brand)
    expect(structB.__schema.brand).toStrictEqual(brand)
    expect(construct.__schema.brand).toStrictEqual(brand)
  })

  it('brand: [string, number]', () => {
    const brand = ['Category', 0] as const satisfies x.BrandSchema
    const schema = { type: 'boolean', brand } as const satisfies x.Schema

    const structA = x.boolean().brand('Category', 0)
    const structB = x.boolean().brand(brand)
    const construct = x.makeStruct(schema)

    type Expected = { __Category: 0 } & boolean

    type Schema = x.Infer<typeof schema>

    x.tCh<Expected, Schema>()
    x.tCh<Schema, Expected>()

    type StructA = x.Infer<typeof structA>

    x.tCh<Expected, StructA>()
    x.tCh<StructA, Expected>()

    type StructB = x.Infer<typeof structB>

    x.tCh<Expected, StructB>()
    x.tCh<StructB, Expected>()

    type Construct = x.Infer<typeof construct>

    x.tCh<Expected, Construct>()
    x.tCh<Construct, Expected>()

    expect(structA.__schema.brand).toStrictEqual(brand)
    expect(structB.__schema.brand).toStrictEqual(brand)
    expect(construct.__schema.brand).toStrictEqual(brand)
  })

  it('brand: [string, string]', () => {
    const brand = ['Category', 'SubCategory'] as const satisfies x.BrandSchema
    const schema = { type: 'boolean', brand } as const satisfies x.Schema

    const structA = x.boolean().brand('Category', 'SubCategory')
    const structB = x.boolean().brand(brand)
    const construct = x.makeStruct(schema)

    type Expected = { __Category: 'SubCategory' } & boolean

    type Schema = x.Infer<typeof schema>

    x.tCh<Expected, Schema>()
    x.tCh<Schema, Expected>()

    type StructA = x.Infer<typeof structA>

    x.tCh<Expected, StructA>()
    x.tCh<StructA, Expected>()

    type StructB = x.Infer<typeof structB>

    x.tCh<Expected, StructB>()
    x.tCh<StructB, Expected>()

    type Construct = x.Infer<typeof construct>

    x.tCh<Expected, Construct>()
    x.tCh<Construct, Expected>()

    expect(structA.__schema.brand).toStrictEqual(brand)
    expect(structB.__schema.brand).toStrictEqual(brand)
    expect(construct.__schema.brand).toStrictEqual(brand)
  })

  it('brand: [string, array]', () => {
    const brand = ['Category', ['x']] as const satisfies x.BrandSchema
    const schema = { type: 'boolean', brand } as const satisfies x.Schema

    const structA = x.boolean().brand('Category', ['x'] as const)
    const structB = x.boolean().brand(brand)
    const construct = x.makeStruct(schema)

    type Expected = { __Category: Readonly<['x']> } & boolean

    type Schema = x.Infer<typeof schema>

    x.tCh<Expected, Schema>()
    x.tCh<Schema, Expected>()

    type StructA = x.Infer<typeof structA>

    x.tCh<Expected, StructA>()
    x.tCh<StructA, Expected>()

    type StructB = x.Infer<typeof structB>

    x.tCh<Expected, StructB>()
    x.tCh<StructB, Expected>()

    type Construct = x.Infer<typeof construct>

    x.tCh<Expected, Construct>()
    x.tCh<Construct, Expected>()

    expect(structA.__schema.brand).toStrictEqual(brand)
    expect(structB.__schema.brand).toStrictEqual(brand)
    expect(construct.__schema.brand).toStrictEqual(brand)
  })

  it('brand: [string, record]', () => {
    const brand = [
      'Category',
      { x: 'x-value' },
    ] as const satisfies x.BrandSchema

    const schema = { type: 'boolean', brand } as const satisfies x.Schema

    const structA = x.boolean().brand('Category', { x: 'x-value' } as const)
    const structB = x.boolean().brand(brand)
    const construct = x.makeStruct(schema)

    type Expected = { __Category: { x: 'x-value' } } & boolean

    type Schema = x.Infer<typeof schema>

    x.tCh<Expected, Schema>()
    x.tCh<Schema, Expected>()

    type StructA = x.Infer<typeof structA>

    x.tCh<Expected, StructA>()
    x.tCh<StructA, Expected>()

    type StructB = x.Infer<typeof structB>

    x.tCh<Expected, StructB>()
    x.tCh<StructB, Expected>()

    type Construct = x.Infer<typeof construct>

    x.tCh<Expected, Construct>()
    x.tCh<Construct, Expected>()

    expect(structA.__schema.brand).toStrictEqual(brand)
    expect(structB.__schema.brand).toStrictEqual(brand)
    expect(construct.__schema.brand).toStrictEqual(brand)
  })
})
