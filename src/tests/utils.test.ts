import * as x from '../'
import { DATA_TYPE, DATA_VARIANTS_BY_TYPE } from './fixtures'

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

describe('Check `left` and `right` utilities', () => {
  it('error: creates error object', () => {
    expect(x.left('x')).toEqual({ left: 'x' })
  })

  it('data: creates data object', () => {
    expect(x.right('x')).toEqual({ right: 'x' })
  })
})

describe('Check `verifyPrimitive` utility', () => {
  describe('boolean', () => {
    const baseSchema = { type: 'boolean' } as const satisfies x.Schema

    it('valid: required', () => {
      for (const subject of DATA_VARIANTS_BY_TYPE.boolean) {
        expect(x.verifyPrimitive(baseSchema, subject)).toBe(true)
      }
    })

    it('valid: optional', () => {
      expect(
        x.verifyPrimitive({ ...baseSchema, optional: true }, undefined)
      ).toBe(true)
    })

    it('valid: nullable', () => {
      expect(x.verifyPrimitive({ ...baseSchema, nullable: true }, null)).toBe(
        true
      )
    })

    it('valid: optional + nullable', () => {
      expect(
        x.verifyPrimitive(
          { ...baseSchema, optional: true, nullable: true },
          undefined
        )
      ).toBe(true)
      expect(
        x.verifyPrimitive(
          { ...baseSchema, optional: true, nullable: true },
          null
        )
      ).toBe(true)
    })

    it('INVALID_TYPE', () => {
      for (const [type, subjects] of DATA_TYPE) {
        if (type === baseSchema.type) {
          continue
        }

        for (const subject of subjects) {
          expect(x.verifyPrimitive(baseSchema, subject)).toBe(
            x.ERROR_CODE.invalidType
          )
        }
      }
    })
  })

  describe('literal: boolean', () => {
    const baseSchema = {
      type: 'literal',
      of: false,
    } as const satisfies x.Schema

    it('valid: required', () => {
      expect(x.verifyPrimitive(baseSchema, baseSchema.of)).toBe(true)
    })

    it('valid: optional', () => {
      expect(
        x.verifyPrimitive({ ...baseSchema, optional: true }, undefined)
      ).toBe(true)
    })

    it('valid: nullable', () => {
      expect(x.verifyPrimitive({ ...baseSchema, nullable: true }, null)).toBe(
        true
      )
    })

    it('valid: optional + nullable', () => {
      expect(
        x.verifyPrimitive(
          { ...baseSchema, optional: true, nullable: true },
          undefined
        )
      ).toBe(true)
      expect(
        x.verifyPrimitive(
          { ...baseSchema, optional: true, nullable: true },
          null
        )
      ).toBe(true)
    })

    it('INVALID_TYPE', () => {
      for (const [type, subjects] of DATA_TYPE) {
        for (const subject of subjects) {
          if (subject === baseSchema.of) {
            continue
          }

          expect(x.verifyPrimitive(baseSchema, subject)).toBe(
            x.ERROR_CODE.invalidType
          )
        }
      }
    })
  })

  describe('literal: number', () => {
    const baseSchema = {
      type: 'literal',
      of: 0,
    } as const satisfies x.Schema

    it('valid: required', () => {
      expect(x.verifyPrimitive(baseSchema, baseSchema.of)).toBe(true)
    })

    it('valid: optional', () => {
      expect(
        x.verifyPrimitive({ ...baseSchema, optional: true }, undefined)
      ).toBe(true)
    })

    it('valid: nullable', () => {
      expect(x.verifyPrimitive({ ...baseSchema, nullable: true }, null)).toBe(
        true
      )
    })

    it('valid: optional + nullable', () => {
      expect(
        x.verifyPrimitive(
          { ...baseSchema, optional: true, nullable: true },
          undefined
        )
      ).toBe(true)
      expect(
        x.verifyPrimitive(
          { ...baseSchema, optional: true, nullable: true },
          null
        )
      ).toBe(true)
    })

    it('INVALID_TYPE', () => {
      for (const [type, subjects] of DATA_TYPE) {
        for (const subject of subjects) {
          if (subject === baseSchema.of) {
            continue
          }

          expect(x.verifyPrimitive(baseSchema, subject)).toBe(
            x.ERROR_CODE.invalidType
          )
        }
      }
    })
  })

  describe('literal: string', () => {
    const baseSchema = {
      type: 'literal',
      of: 'x',
    } as const satisfies x.Schema

    it('valid: required', () => {
      expect(x.verifyPrimitive(baseSchema, baseSchema.of)).toBe(true)
    })

    it('valid: optional', () => {
      expect(
        x.verifyPrimitive({ ...baseSchema, optional: true }, undefined)
      ).toBe(true)
    })

    it('valid: nullable', () => {
      expect(x.verifyPrimitive({ ...baseSchema, nullable: true }, null)).toBe(
        true
      )
    })

    it('valid: optional + nullable', () => {
      expect(
        x.verifyPrimitive(
          { ...baseSchema, optional: true, nullable: true },
          undefined
        )
      ).toBe(true)
      expect(
        x.verifyPrimitive(
          { ...baseSchema, optional: true, nullable: true },
          null
        )
      ).toBe(true)
    })

    it('INVALID_TYPE', () => {
      for (const [type, subjects] of DATA_TYPE) {
        for (const subject of subjects) {
          if (subject === baseSchema.of) {
            continue
          }

          expect(x.verifyPrimitive(baseSchema, subject)).toBe(
            x.ERROR_CODE.invalidType
          )
        }
      }
    })
  })

  describe('number', () => {
    const baseSchema = { type: 'number' } as const satisfies x.Schema

    it('valid: required', () => {
      for (const subject of DATA_VARIANTS_BY_TYPE.number) {
        expect(x.verifyPrimitive(baseSchema, subject)).toBe(true)
      }
    })

    it('valid: optional', () => {
      expect(
        x.verifyPrimitive({ ...baseSchema, optional: true }, undefined)
      ).toBe(true)
    })

    it('valid: nullable', () => {
      expect(x.verifyPrimitive({ ...baseSchema, nullable: true }, null)).toBe(
        true
      )
    })

    it('valid: optional + nullable', () => {
      expect(
        x.verifyPrimitive(
          { ...baseSchema, optional: true, nullable: true },
          undefined
        )
      ).toBe(true)
      expect(
        x.verifyPrimitive(
          { ...baseSchema, optional: true, nullable: true },
          null
        )
      ).toBe(true)
    })

    it('INVALID_TYPE', () => {
      for (const [type, subjects] of DATA_TYPE) {
        if (type === baseSchema.type) {
          continue
        }

        for (const subject of subjects) {
          expect(x.verifyPrimitive(baseSchema, subject)).toBe(
            x.ERROR_CODE.invalidType
          )
        }
      }
    })

    it('INVALID_RANGE: min', () => {
      const schema = { ...baseSchema, min: 2 } as const satisfies x.Schema
      const subjects: Array<x.Infer<typeof schema>> = [-1, 0, 1]

      for (const subject of subjects) {
        expect(x.verifyPrimitive(schema, subject)).toBe(
          x.ERROR_CODE.invalidRange
        )
      }
    })

    it('INVALID_RANGE: max', () => {
      const schema = { ...baseSchema, max: -2 } as const satisfies x.Schema
      const subjects: Array<x.Infer<typeof schema>> = [-1, 0, 1]

      for (const subject of subjects) {
        expect(x.verifyPrimitive(schema, subject)).toBe(
          x.ERROR_CODE.invalidRange
        )
      }
    })

    it('INVALID_RANGE: min + max', () => {
      const schema = {
        ...baseSchema,
        min: 0,
        max: 0,
      } as const satisfies x.Schema

      const subjects: Array<x.Infer<typeof schema>> = [-2, -1, 1]

      for (const subject of subjects) {
        expect(x.verifyPrimitive(schema, subject)).toBe(
          x.ERROR_CODE.invalidRange
        )
      }
    })
  })

  describe('string', () => {
    const baseSchema = { type: 'string' } as const satisfies x.Schema

    it('valid: required', () => {
      for (const subject of DATA_VARIANTS_BY_TYPE.string) {
        expect(x.verifyPrimitive(baseSchema, subject)).toBe(true)
      }
    })

    it('valid: optional', () => {
      expect(
        x.verifyPrimitive({ ...baseSchema, optional: true }, undefined)
      ).toBe(true)
    })

    it('valid: nullable', () => {
      expect(x.verifyPrimitive({ ...baseSchema, nullable: true }, null)).toBe(
        true
      )
    })

    it('valid: optional + nullable', () => {
      expect(
        x.verifyPrimitive(
          { ...baseSchema, optional: true, nullable: true },
          undefined
        )
      ).toBe(true)
      expect(
        x.verifyPrimitive(
          { ...baseSchema, optional: true, nullable: true },
          null
        )
      ).toBe(true)
    })

    it('INVALID_TYPE', () => {
      for (const [type, subjects] of DATA_TYPE) {
        if (type === baseSchema.type) {
          continue
        }

        for (const subject of subjects) {
          expect(x.verifyPrimitive(baseSchema, subject)).toBe(
            x.ERROR_CODE.invalidType
          )
        }
      }
    })

    it('INVALID_RANGE: minLength', () => {
      const schema = { ...baseSchema, minLength: 3 } as const satisfies x.Schema
      const subjects: Array<x.Infer<typeof schema>> = ['', 'x', 'xy']

      for (const subject of subjects) {
        expect(x.verifyPrimitive(schema, subject)).toBe(
          x.ERROR_CODE.invalidRange
        )
      }
    })

    it('INVALID_RANGE: maxLength', () => {
      const schema = { ...baseSchema, maxLength: 0 } as const satisfies x.Schema
      const subjects: Array<x.Infer<typeof schema>> = ['x', 'xy', 'xyz']

      for (const subject of subjects) {
        expect(x.verifyPrimitive(schema, subject)).toBe(
          x.ERROR_CODE.invalidRange
        )
      }
    })

    it('INVALID_RANGE: minLength + maxLength', () => {
      const schema = {
        ...baseSchema,
        minLength: 3,
        maxLength: 3,
      } as const satisfies x.Schema

      const subjects: Array<x.Infer<typeof schema>> = ['x', 'xy', 'xyza']

      for (const subject of subjects) {
        expect(x.verifyPrimitive(schema, subject)).toBe(
          x.ERROR_CODE.invalidRange
        )
      }
    })
  })
})

describe('Check `makeErrorPath`', () => {
  it('no key or index & no parentPath', () => {
    const pathA = x.makeErrorPath(this)
    const pathB = x.makeErrorPath(this)

    expect(pathA).toStrictEqual([])
    expect(pathB).toStrictEqual([])
    expect(pathA === pathB).toBe(false)
  })

  it('no key or index & has parentPath', () => {
    const parentPath = [0, 'x', 1]
    const pathA = x.makeErrorPath(parentPath)
    const pathB = x.makeErrorPath(parentPath)

    expect(pathA).toStrictEqual(parentPath)
    expect(pathB).toStrictEqual(parentPath)
    expect(pathA === parentPath).toBe(false)
    expect(pathA === pathB).toBe(false)
  })

  it('has parentPath & key', () => {
    const parentPath = [0, 'x', 1]
    const key = 'y'
    const pathA = x.makeErrorPath(parentPath, key)
    const pathB = x.makeErrorPath(parentPath, key)

    expect(pathA).toStrictEqual([...parentPath, key])
    expect(pathB).toStrictEqual([...parentPath, key])
    expect(pathA === parentPath).toBe(false)
    expect(pathA === pathB).toBe(false)
  })

  it('has parentPath & index', () => {
    const parentPath = [0, 'x', 1]
    const index = 2
    const pathA = x.makeErrorPath(parentPath, index)
    const pathB = x.makeErrorPath(parentPath, index)

    expect(pathA).toStrictEqual([...parentPath, index])
    expect(pathB).toStrictEqual([...parentPath, index])
    expect(pathA === parentPath).toBe(false)
    expect(pathA === pathB).toBe(false)
  })

  it('no parentPath & index', () => {
    const index = 0
    const pathA = x.makeErrorPath(this, index)
    const pathB = x.makeErrorPath(this, index)

    expect(pathA).toStrictEqual([index])
    expect(pathB).toStrictEqual([index])
    expect(pathA === pathB).toBe(false)
  })

  it('no parentPath & key', () => {
    const key = 'x'
    const pathA = x.makeErrorPath(this, key)
    const pathB = x.makeErrorPath(this, key)

    expect(pathA).toStrictEqual([key])
    expect(pathB).toStrictEqual([key])
    expect(pathA === pathB).toBe(false)
  })
})
