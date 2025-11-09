import * as x from '../'

describe('Type equivalence check by `tCh` utility', () => {
  describe('Union of literals', () => {
    it('valid', () => {
      type Expected = 'x' | 'y'
      type Actual = 'x' | 'y'

      x.tCh<Expected, Actual>()
      x.tCh<Actual, Expected>()
    })

    it('union has extra member', () => {
      type Expected = 'x' | 'y'
      type Actual = 'x' | 'y' | 'z'

      // @ts-expect-error: '"z"' is not assignable to type 'Expected'
      x.tCh<Expected, Actual>()
      x.tCh<Actual, Expected>()
    })

    it('union has `never` instead of expected member', () => {
      type Expected = 'x' | 'y'
      type Actual = 'x' | never

      x.tCh<Expected, Actual>()
      // @ts-expect-error: 'Expected' does not satisfy the constraint '"x"'
      x.tCh<Actual, Expected>()
    })

    it('union is `never`', () => {
      type Expected = 'x' | 'y'
      type Actual = never

      x.tCh<Expected, Actual>()
      // @ts-expect-error: Type 'string' does not satisfy the constraint 'never'.
      x.tCh<Actual, Expected>()
    })
  })

  describe('Array of primitives', () => {
    it('valid', () => {
      type Expected = Array<string | number>
      type Actual = Array<string | number>

      x.tCh<Expected, Actual>()
      x.tCh<Actual, Expected>()
    })

    it('array union has one extra member', () => {
      type Expected = Array<string | number>
      type Actual = Array<string | number | boolean>

      // @ts-expect-error: 'string | number | boolean' is not assignable to type 'string | number'
      x.tCh<Expected, Actual>()
      x.tCh<Actual, Expected>()
    })

    it('array union has `never` instead of expected memeber', () => {
      type Expected = Array<string | number>
      type Actual = Array<string | never>

      x.tCh<Expected, Actual>()
      // @ts-expect-error: 'Expected' does not satisfy the constraint 'string[]'
      x.tCh<Actual, Expected>()
    })

    it('array of `never`', () => {
      type Expected = Array<string | number>
      type Actual = Array<never>

      x.tCh<Expected, Actual>()
      // @ts-expect-error: 'Expected' does not satisfy the constraint 'never[]'
      x.tCh<Actual, Expected>()
    })

    it('array is `never`', () => {
      type Expected = Array<string | number>
      type Actual = never

      x.tCh<Expected, Actual>()
      // @ts-expect-error: Type 'Expected' does not satisfy the constraint 'never'
      x.tCh<Actual, Expected>()
    })
  })

  describe('Object of primitives', () => {
    it('valid', () => {
      type Expected = { x: string; y: number }
      type Actual = { x: string; y: number }

      x.tCh<Expected, Actual>()
      x.tCh<Actual, Expected>()
    })

    it('has extra property', () => {
      type Expected = { x: string; y: number }
      type Actual = { x: string; y: number; z: boolean }

      x.tCh<Expected, Actual>()
      // @ts-expect-error: Property 'z' is missing in type 'Expected' but required in type 'Actual'
      x.tCh<Actual, Expected>()
    })

    it('one property has `never` value', () => {
      type Expected = { x: string; y: number }
      type Actual = { x: string; y: never }

      x.tCh<Expected, Actual>()
      // @ts-expect-error Types of property 'y' are incompatible.    Type 'number' is not assignable to type 'never'.
      x.tCh<Actual, Expected>()
    })

    it('all properties have `never` value', () => {
      type Expected = { x: string; y: number }
      type Actual = { x: never; y: never }

      x.tCh<Expected, Actual>()
      // @ts-expect-error 'Expected' does not satisfy the constraint 'Actual'
      x.tCh<Actual, Expected>()
    })
  })
})

describe('Check ParseResult utilities', () => {
  it('ParseResult typguards are functional', () => {
    const parsed = x.boolean().parse(undefined)

    if (parsed.success) {
      x.tCh<typeof parsed.data, boolean>()
      x.tCh<boolean, typeof parsed.data>()

      x.tCh<typeof parsed.error, undefined>()
      x.tCh<undefined, typeof parsed.error>()
    }

    if (parsed.data !== undefined) {
      x.tCh<typeof parsed.data, boolean>()
      x.tCh<boolean, typeof parsed.data>()

      x.tCh<typeof parsed.error, undefined>()
      x.tCh<undefined, typeof parsed.error>()
    }

    if (parsed.success === false) {
      x.tCh<typeof parsed.error, x.InvalidSubject[]>()
      x.tCh<x.InvalidSubject[], typeof parsed.error>()

      x.tCh<typeof parsed.data, undefined>()
      x.tCh<undefined, typeof parsed.data>()
    }

    if (parsed.error) {
      x.tCh<typeof parsed.error, x.InvalidSubject[]>()
      x.tCh<x.InvalidSubject[], typeof parsed.error>()

      x.tCh<typeof parsed.data, undefined>()
      x.tCh<undefined, typeof parsed.data>()
    }
  })

  it('ParseError result', () => {
    const invalidSubjects: x.InvalidSubject[] = [
      {
        code: x.ERROR_CODE.invalidType,
        path: [],
        schema: { type: 'string' },
        subject: undefined,
      },
    ]

    const parseError = x.error(invalidSubjects)

    expect('data' in parseError).toBe(false)
    expect(parseError.success).toBe(false)
    expect(parseError.error === invalidSubjects).toBe(true)
  })

  it('ParseSuccess result', () => {
    const validSubj = 'sample'
    const parsedSuccess = x.success(validSubj)

    expect('error' in parsedSuccess).toBe(false)
    expect(parsedSuccess.success).toBe(true)
    expect(parsedSuccess.data).toBe(validSubj)
  })
})

it('PARAMS_BY_SCHEMA_TYPE is exported', () => {
  expect(x.PARAMS_BY_SCHEMA_TYPE).toStrictEqual(x.PARAMS_BY_SCHEMA_TYPE)
})
