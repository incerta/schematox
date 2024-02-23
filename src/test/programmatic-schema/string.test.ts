import { ERROR_CODE } from '../../error'
import { parse } from '../../general-schema-parser'
import { validate } from '../../general-schema-validator'
import { string, makeStruct } from '../../programmatic-schema'
import { check } from '../test-utils'

import { Schema } from '../../types/compounds'

// Describe layer
it.todo('Struct: no parameters')

// TODO: in order to ensure that each defined property is not affecting
//       anything that not directly related to it we need to test the
//       same thing similar flow for each

it.todo('Struct: optional')
it.todo('Struct: optional + nullable')
it.todo('Struct: optional + nullable')
it.todo('Struct: optional + nullable + brand')
it.todo('Struct: optional + nullable + brand + minLength')
it.todo('Struct: optional + nullable + brand + minLength + maxLength')
it.todo(
  'Struct: optional + nullable + brand + minLength + maxLength + description'
)

it.todo('Struct: description')
it.todo('Struct: description + maxLength')
it.todo('Struct: description + maxLength + minLength')
it.todo('Struct: description + maxLength + minLength + brand')
it.todo('Struct: description + maxLength + minLength + brand + nullable')
it.todo(
  'Struct: description + maxLength + minLength + brand + nullable + optional'
)

check<Array<unknown>, [string, number]>

/* On each describe layer whenever makes sense */

it.todo('string: %parameter_distinct_effect')
it.todo(
  'Programmatic `struct` made by `makeStruct` from `shema` and schema type params is identical'
)
it.todo('string: struct keys presence in type')
it.todo('string: struct keys runtime presense')
it.todo('string: strcut.__schema')
it.todo('string: parse VALID')
it.todo('string: parse INVALID_TYPE')
it.todo('string: parse INVALID_RANGE')
it.todo('string: validate VALID')
it.todo('string: validate INVALID_TYPE')
it.todo('string: validate INVALID_RANGE')
it.todo('string: guard VALID')
it.todo('string: guard INVALID_TYPE')
it.todo('string: guard INVALID_RANGE')

// TODO: another strategy we can implement is handle each parameter individually.
//       however some parameters can work in combination.
//       We can distinguish few categories of struct keys:
//
//       methods: parse/validate/guard
//       struct static schema: __schema
//
//       schema params: `nullable/optional/brand/description/minLength/maxLength`
//       All those parameters is affecting all `methods` behavior. The exception is
//       `description` and `guard` method: there is no detectable side effect we can
//       check. So we can distinguish three major categories of parameters:
//
//       Affects types only: brand
//       Affects both types and INVALID_TYPE code error resolution: nullable/optional
//       Affects INVALID_RANGE code error resolution only: minLength, maxLength
//       Affects static schema and therefore InvalidSubject error "schema" key value only: description
//
//       In order to cover all possible combinations of parameters applied in any possible order
//       we need factorial of N where N is the number of possible parameters which in in our case 6
//       and factorial of 6 is 720, each of the 720 test should check valid/invalid subject case for
//       each method + INVALID_TYPE/INVALID_RANGE branches in some cases. So we have ~14.
//
//       We also shouldn't forget about the fact that all those tests should be applied to each
//       schema type which we currently have 7.
//
//       In total: 720 * 14 * 7 = 7 560 tests which is ridicules amount of tests. We could automate
//       such tests creation, however because `optional/nullable/brand` affecting the type inference
//       automation is not possible without static typescript code analyzers and this domain will
//       blow complexity of entire library drastically.
//
//       So the best course of actions is to have tests for each parameter individually and in bulk
//       applied in two opposite orders.

type StructProps =
  // result schema
  | '__schema'
  // methods
  | 'parse'
  | 'validate'
  | 'guard'
  // shcema params
  | 'optional'
  | 'nullable'
  | 'brand'
  | 'minLength'
  | 'maxLength'
  | 'description'

const EXPECTED_PROPS = new Set([
  '__schema',
  'parse',
  'validate',
  'guard',
  'optional',
  'nullable',
  'brand',
  'minLength',
  'maxLength',
  'description',
] as Array<StructProps>)

describe('Struct: no schema parameters', () => {
  const schema = { type: 'string' } as const satisfies Schema
  const struct = string()

  it('struct keys', () => {
    check<StructProps, keyof typeof struct>
    // @ts-expect-error always
    check<never, keyof typeof struct>
  })

  it('Programmatic `struct` made by `makeStruct` from `shema` and schema type params is identical', () => {
    const madeStruct = makeStruct(schema)

    check<typeof struct, typeof madeStruct>
    check<typeof madeStruct, typeof struct>

    expect(Object.keys(madeStruct)).toStrictEqual(Object.keys(struct))
  })

  it('Progrmmatic `struct.__schema` is identical to static `schema`', () => {
    check<typeof schema>(struct.__schema)
    check<typeof struct.__schema>(struct.__schema)

    // @ts-expect-error always
    check<never>(struct.__schema)
    // @ts-expect-error always
    check<never>(schema)

    expect(struct.__schema).toStrictEqual(schema)
    expect(new Set(Object.keys(struct))).toStrictEqual(EXPECTED_PROPS)
  })

  it('parse VALID', () => {
    const validSubjects = ['', 'x', 'xy', 'xyz', '0']

    for (const subject of validSubjects) {
      const resultS = parse(struct.__schema, subject)
      const resultP = struct.parse(subject)

      if (resultS.error) {
        throw Error('Not expected')
      }

      check<string>(resultS.data)
      // @ts-expect-error always
      check<never>(resultS.data)

      expect(resultS.data).toBe(subject)
      expect(resultS.error).toBeUndefined()

      if (resultP.error) {
        throw Error('Not expected')
      }

      check<string>(resultP.data)
      // @ts-expect-error always
      check<never>(resultP.data)

      expect(resultP.data).toBe(subject)
      expect(resultP.error).toBeUndefined()
    }
  })

  it('parse INVALID_TYPE', () => {
    const subject = 0

    const resultS = parse(struct.__schema, subject)
    const resultP = struct.parse(subject)

    if (resultS.error === undefined) {
      throw Error('Not expected')
    }

    check<undefined>(resultS.data)
    // @ts-expect-error always
    check<never>(resultS.data)

    expect(resultS.data).toBeUndefined()
    expect(resultS.error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        schema: struct.__schema,
        subject: subject,
        path: [],
      },
    ])

    if (resultP.error === undefined) {
      throw Error('Not expected')
    }

    check<undefined>(resultP.data)
    // @ts-expect-error always
    check<never>(resultP.data)

    expect(resultP.data).toBeUndefined()
    expect(resultP.error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        schema: struct.__schema,
        subject: subject,
        path: [],
      },
    ])
  })

  it('validate VALID', () => {
    const subject = 'x'

    const structS = validate(struct.__schema, subject)
    const structP = struct.validate(subject)

    if (structS.error) {
      throw Error('Not expected')
    }

    check<string>(structS.data)
    // @ts-expect-error always
    check<never>(structS.data)

    expect(structS.data).toBe(subject)
    expect(structS.error).toBeUndefined()

    if (structP.error) {
      throw Error('Not expected')
    }

    check<string>(structP.data)
    // @ts-expect-error always
    check<never>(structP.data)

    expect(structP.data).toBe(subject)
    expect(structP.error).toBeUndefined()
  })

  it('validate INVALID_TYPE', () => {
    const invalidSubjects = [
      undefined,
      null,
      0,
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
    ]

    for (const subject of invalidSubjects) {
      const structS = validate(struct.__schema, subject)
      const structP = struct.validate(subject)

      if (structS.error === undefined) {
        throw Error('Not expected')
      }

      check<undefined>(structS.data)
      // @ts-expect-error always
      check<never>(structS.data)

      expect(structS.data).toBeUndefined()
      expect(structS.error).toStrictEqual([
        {
          code: ERROR_CODE.invalidType,
          schema: struct.__schema,
          subject: subject,
          path: [],
        },
      ])

      if (structP.error === undefined) {
        throw Error('Not expected')
      }

      check<undefined>(structP.data)
      // @ts-expect-error always
      check<never>(structP.data)

      expect(structP.data).toBeUndefined()
      expect(structP.error).toStrictEqual([
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
