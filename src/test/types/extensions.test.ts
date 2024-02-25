import { check } from '../test-utils'
import { ExtWith_SchemaParams_SubjT } from '../../types/extensions'

describe('ExtWith_SchemaParams_SubjT<T, U>: U is primitive', () => {
  type U = string

  it('Extend nothing if parameters are not specified', () => {
    const schema = {} as const

    type Expected = U
    type Actual = ExtWith_SchemaParams_SubjT<typeof schema, U>

    check<Expected, Actual>()
    check<Actual, Expected>()
  })

  it('Optional', () => {
    const schema = { optional: true } as const

    type Expected = U | undefined
    type Actual = ExtWith_SchemaParams_SubjT<typeof schema, U>

    check<Actual, Expected>()
    check<Expected, Actual>()
  })

  it('Nullable', () => {
    const schema = { nullable: true } as const

    type Expected = U | null
    type Actual = ExtWith_SchemaParams_SubjT<typeof schema, U>

    check<Actual, Expected>()
    check<Expected, Actual>()
  })

  it('Branded', () => {
    const schema = { brand: ['x', 'y'] } as const

    type Expected = U & { __x: 'y' }
    type Actual = ExtWith_SchemaParams_SubjT<typeof schema, U>

    check<Actual, Expected>()
    check<Expected, Actual>()
  })

  it('Optional + nullable + branded', () => {
    const schema = {
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
    } as const

    type Expected = (U & { __x: 'y' }) | null | undefined
    type Actual = ExtWith_SchemaParams_SubjT<typeof schema, U>

    check<Actual, Expected>()
    check<Expected, Actual>()
  })
})

describe('ExtWith_SchemaParams_SubjT<T, U>: U is object', () => {
  type U = { x: string; y: number }

  it('Extend nothing if parameters are not specified', () => {
    const schema = {} as const

    type Expected = U
    type Actual = ExtWith_SchemaParams_SubjT<typeof schema, U>

    check<Actual, Expected>()
    check<Expected, Actual>()
  })

  it('Optional', () => {
    const schema = { optional: true } as const

    type Expected = U | undefined
    type Actual = ExtWith_SchemaParams_SubjT<typeof schema, U>

    check<Actual, Expected>()
    check<Expected, Actual>()
  })

  it('Nullable', () => {
    const schema = { nullable: true } as const

    type Expected = U | null
    type Actual = ExtWith_SchemaParams_SubjT<typeof schema, U>

    check<Actual, Expected>()
    check<Expected, Actual>()
  })

  it('Branded', () => {
    const schema = { brand: ['x', 'y'] } as const

    type Expected = U & { __x: 'y' }
    type Actual = ExtWith_SchemaParams_SubjT<typeof schema, U>

    check<Actual, Expected>()
    check<Expected, Actual>()
  })

  it('Optional + nullable + branded', () => {
    const schema = {
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
    } as const

    type Expected = (U & { __x: 'y' }) | null | undefined
    type Actual = ExtWith_SchemaParams_SubjT<typeof schema, U>

    check<Actual, Expected>()
    check<Expected, Actual>()
  })
})
