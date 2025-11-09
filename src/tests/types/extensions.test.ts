import * as x from '../../index'

describe('ExtWith_SchemaParams_SubjT<T, U>: U is primitive', () => {
  type U = boolean

  it('extend nothing if parameters are not specified', () => {
    const schema = {} as const

    type Expected = U
    type Actual = x.ExtendParams<typeof schema, U>

    x.tCh<Expected, Actual>()
    x.tCh<Actual, Expected>()
  })

  it('optional', () => {
    const schema = { optional: true } as const

    type Expected = U | undefined
    type Actual = x.ExtendParams<typeof schema, U>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()
  })

  it('nullable', () => {
    const schema = { nullable: true } as const

    type Expected = U | null
    type Actual = x.ExtendParams<typeof schema, U>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()
  })

  it('brand', () => {
    const schema = { brand: ['x', 'y'] } as const

    type Expected = U & { __x: 'y' }
    type Actual = x.ExtendParams<typeof schema, U>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()
  })

  it('optional + nullable + brand', () => {
    const schema = {
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
    } as const

    type Expected = (U & { __x: 'y' }) | null | undefined
    type Actual = x.ExtendParams<typeof schema, U>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()
  })
})

describe('ExtWith_SchemaParams_SubjT<T, U>: U is object', () => {
  type U = { x: string; y: number }

  it('extend nothing if parameters are not specified', () => {
    const schema = {} as const

    type Expected = U
    type Actual = x.ExtendParams<typeof schema, U>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()
  })

  it('optional', () => {
    const schema = { optional: true } as const

    type Expected = U | undefined
    type Actual = x.ExtendParams<typeof schema, U>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()
  })

  it('nullable', () => {
    const schema = { nullable: true } as const

    type Expected = U | null
    type Actual = x.ExtendParams<typeof schema, U>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()
  })

  it('brand', () => {
    const schema = { brand: ['x', 'y'] } as const

    type Expected = U & { __x: 'y' }
    type Actual = x.ExtendParams<typeof schema, U>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()
  })

  it('optional + nullable + brand', () => {
    const schema = {
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
    } as const

    type Expected = (U & { __x: 'y' }) | null | undefined
    type Actual = x.ExtendParams<typeof schema, U>

    x.tCh<Actual, Expected>()
    x.tCh<Expected, Actual>()
  })
})
