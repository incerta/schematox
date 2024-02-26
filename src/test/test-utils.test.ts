import { check, unknownX } from './test-utils'

describe('Union of literals', () => {
  it('Valid case', () => {
    type Expected = 'x' | 'y'
    type Actual = 'x' | 'y'

    check<Expected, Actual>()
    check<Actual, Expected>()

    check<Actual>(unknownX as Expected)
    check<Expected>(unknownX as Actual)
  })

  it('Actual union has extra member', () => {
    type Expected = 'x' | 'y'
    type Actual = 'x' | 'y' | 'z'

    // @ts-expect-error '"z"' is not assignable to type 'Expected'
    check<Expected, Actual>()
    check<Actual, Expected>()

    // @ts-expect-error 'Actual' is not assignable to parameter of type 'Expected'
    check<Expected>(unknownX as Actual)
    check<Actual>(unknownX as Expected)
  })

  it('Actual union has "never" that replaced one of its members', () => {
    type Expected = 'x' | 'y'
    type Actual = 'x' | never

    check<Expected, Actual>()
    // @ts-expect-error 'Expected' does not satisfy the constraint '"x"'
    check<Actual, Expected>()

    check<Expected>(unknownX as Actual)
    // @ts-expect-error 'Expected' does not satisfy the constraint '"x"'
    check<Actual>(unknownX as Expected)
  })

  it('Actual is "never"', () => {
    type Expected = 'x' | 'y'
    type Actual = 'x' | never

    check<Expected, Actual>()
    // @ts-expect-error 'Expected' does not satisfy the constraint '"x"'
    check<Actual, Expected>()

    check<Expected>(unknownX as Actual)
    // @ts-expect-error 'Expected' does not satisfy the constraint '"x"'
    check<Actual>(unknownX as Expected)
  })
})

describe('Array of primitives', () => {
  it('Valid case', () => {
    type Expected = Array<string | number>
    type Actual = Array<string | number>

    check<Expected, Actual>()
    check<Actual, Expected>()

    check<Expected>(unknownX as Actual)
    check<Actual>(unknownX as Expected)
  })

  it('Actual array elements has one extra member', () => {
    type Expected = Array<string | number>
    type Actual = Array<string | number | boolean>

    // @ts-expect-error 'string | number | boolean' is not assignable to type 'string | number'
    check<Expected, Actual>()
    check<Actual, Expected>()

    // @ts-expect-error 'string | number | boolean' is not assignable to type 'string | number'
    check<Expected>(unknownX as Actual)
    check<Actual>(unknownX as Expected)
  })

  it('Actual array elements han one member replaced by "never"', () => {
    type Expected = Array<string | number>
    type Actual = Array<string | never>

    check<Expected, Actual>()
    // @ts-expect-error 'Expected' does not satisfy the constraint 'string[]'
    check<Actual, Expected>()

    check<Expected>(unknownX as Actual)
    // @ts-expect-error 'Expected' does not satisfy the constraint 'string[]'
    check<Actual>(unknownX as Expected)
  })

  it('Actual array elements is "never"', () => {
    type Expected = Array<string | number>
    type Actual = Array<never>

    check<Expected, Actual>()
    // @ts-expect-error 'Expected' does not satisfy the constraint 'never[]'
    check<Actual, Expected>()

    check<Expected>(unknownX as Actual)
    // @ts-expect-error 'Expected' does not satisfy the constraint 'never[]'
    check<Actual>(unknownX as Expected)
  })

  it('Actual array elements is "never"', () => {
    type Expected = Array<string | number>
    type Actual = Array<never>

    check<Expected, Actual>()
    // @ts-expect-error 'Expected' does not satisfy the constraint 'never[]'
    check<Actual, Expected>()

    check<Expected>(unknownX as Actual)
    // @ts-expect-error 'Expected' does not satisfy the constraint 'never[]'
    check<Actual>(unknownX as Expected)
  })

  it('Actual "never"', () => {
    type Expected = Array<string | number>
    type Actual = never

    check<Expected, Actual>()
    // @ts-expect-error 'Expected' does not satisfy the constraint 'never'
    check<Actual, Expected>()

    check<Expected>(unknownX as Actual)
    // @ts-expect-error 'Expected' does not satisfy the constraint 'never'
    check<Actual>(unknownX as Expected)
  })
})

describe('Object of primitive props', () => {
  it('Valid case', () => {
    type Expected = { x: string; y: number }
    type Actual = { x: string; y: number }

    check<Expected, Actual>()
    check<Actual, Expected>()

    check<Expected>(unknownX as Actual)
    check<Actual>(unknownX as Expected)
  })

  it('Actual has extra property', () => {
    type Expected = { x: string; y: number }
    type Actual = { x: string; y: number; z: boolean }

    check<Expected, Actual>()
    // @ts-expect-error Property 'z' is missing in type 'Expected' but required in type 'Actual'
    check<Actual, Expected>()

    check<Expected>(unknownX as Actual)
    // @ts-expect-error Property 'z' is missing in type 'Expected' but required in type 'Actual'
    check<Actual>(unknownX as Expected)
  })

  it('One of actual properties has "never" value type', () => {
    type Expected = { x: string; y: number }
    type Actual = { x: string; y: never }

    check<Expected, Actual>()
    // @ts-expect-error Types of property 'y' are incompatible.    Type 'number' is not assignable to type 'never'.
    check<Actual, Expected>()

    check<Expected>(unknownX as Actual)
    // @ts-expect-error Types of property 'y' are incompatible.    Type 'number' is not assignable to type 'never'.
    check<Actual>(unknownX as Expected)
  })

  it('All actual properties has "never" value type', () => {
    type Expected = { x: string; y: number }
    type Actual = { x: never; y: never }

    check<Expected, Actual>()
    // @ts-expect-error 'Expected' does not satisfy the constraint 'Actual'
    check<Actual, Expected>()

    check<Expected>(unknownX as Actual)
    // @ts-expect-error 'Expected' does not satisfy the constraint 'Actual'
    check<Actual>(unknownX as Expected)
  })
})
