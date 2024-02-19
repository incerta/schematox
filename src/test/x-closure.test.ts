import { check, unknownX } from './test-utils'
import { ERROR_CODE } from '../error'

import { array } from '../programmatic-schema/array'
import { object } from '../programmatic-schema/object'

import { string } from '../programmatic-schema/string'
import { number } from '../programmatic-schema/number'
import { boolean } from '../programmatic-schema/boolean'
import { stringUnion } from '../programmatic-schema/string-union'
import { numberUnion } from '../programmatic-schema/number-union'

import { x } from '../x-closure'

import { Schema } from '../types/compound-schema-types'

describe('X closure statically defined schema VALID', () => {
  it('x: base detailed string schema required/optional/default parse/validate', () => {
    const str = x({ type: 'string' })
    const subj = 'x'

    expect(str.parse(subj).data).toBe(subj)
    expect(str.parse(subj).error).toBe(undefined)

    expect(str.validate(subj).data).toBe(subj)
    expect(str.validate(subj).error).toBe(undefined)

    const strOpt = x({ type: 'string', optional: true })

    expect(strOpt.parse(subj).data).toBe(subj)
    expect(strOpt.parse(subj).error).toBe(undefined)

    expect(strOpt.parse(undefined).data).toBe(undefined)
    expect(strOpt.parse(undefined).error).toBe(undefined)
    expect(strOpt.parse(null).data).toBe(undefined)
    expect(strOpt.parse(null).error).toBe(undefined)

    expect(strOpt.validate(subj).data).toBe(subj)
    expect(strOpt.validate(subj).error).toBe(undefined)

    expect(strOpt.validate(undefined).data).toBe(undefined)
    expect(strOpt.validate(undefined).error).toBe(undefined)

    const subjDef = 'y'
    const strDef = x({ type: 'string', optional: true, default: subjDef })

    expect(strDef.parse(subj).data).toBe(subj)
    expect(strDef.parse(subj).error).toBe(undefined)
  })

  it('x: base detailed number schema required/optional/default parse/validate', () => {
    const num = x({ type: 'number' })
    const subj = 0

    expect(num.parse(subj).data).toBe(subj)
    expect(num.parse(subj).error).toBe(undefined)

    expect(num.validate(subj).data).toBe(subj)
    expect(num.validate(subj).error).toBe(undefined)

    const numOpt = x({ type: 'number', optional: true })

    expect(numOpt.parse(subj).data).toBe(subj)
    expect(numOpt.parse(subj).error).toBe(undefined)

    expect(numOpt.parse(undefined).data).toBe(undefined)
    expect(numOpt.parse(undefined).error).toBe(undefined)
    expect(numOpt.parse(null).data).toBe(undefined)
    expect(numOpt.parse(null).error).toBe(undefined)

    expect(numOpt.validate(subj).data).toBe(subj)
    expect(numOpt.validate(subj).error).toBe(undefined)

    expect(numOpt.validate(undefined).data).toBe(undefined)
    expect(numOpt.validate(undefined).error).toBe(undefined)
  })

  it('x: base detailed boolean schema required/optional/default parse/validate', () => {
    const bool = x({ type: 'boolean' })
    const subj = true

    expect(bool.parse(subj).data).toBe(subj)
    expect(bool.parse(subj).error).toBe(undefined)

    expect(bool.validate(subj).data).toBe(subj)
    expect(bool.validate(subj).error).toBe(undefined)

    const boolOpt = x({ type: 'boolean', optional: true })

    expect(boolOpt.parse(subj).data).toBe(subj)
    expect(boolOpt.parse(subj).error).toBe(undefined)

    expect(boolOpt.parse(undefined).data).toBe(undefined)
    expect(boolOpt.parse(undefined).error).toBe(undefined)
    expect(boolOpt.parse(null).data).toBe(undefined)
    expect(boolOpt.parse(null).error).toBe(undefined)

    expect(boolOpt.validate(subj).data).toBe(subj)
    expect(boolOpt.validate(subj).error).toBe(undefined)

    expect(boolOpt.validate(undefined).data).toBe(undefined)
    expect(boolOpt.validate(undefined).error).toBe(undefined)
  })

  it('x: base detailed stringUnion schema required/optional/default parse/validate', () => {
    const unOf = ['x', 'y', 'z'] as const
    const strUn = x({ type: 'stringUnion', of: unOf })
    const subj = 'y'

    expect(strUn.parse(subj).data).toBe(subj)
    expect(strUn.parse(subj).error).toBe(undefined)

    expect(strUn.validate(subj).data).toBe(subj)
    expect(strUn.validate(subj).error).toBe(undefined)

    const strUnOpt = x({ type: 'stringUnion', of: unOf, optional: true })

    expect(strUnOpt.parse(subj).data).toBe(subj)
    expect(strUnOpt.parse(subj).error).toBe(undefined)

    expect(strUnOpt.parse(undefined).data).toBe(undefined)
    expect(strUnOpt.parse(undefined).error).toBe(undefined)
    expect(strUnOpt.parse(null).data).toBe(undefined)
    expect(strUnOpt.parse(null).error).toBe(undefined)

    expect(strUnOpt.validate(subj).data).toBe(subj)
    expect(strUnOpt.validate(subj).error).toBe(undefined)

    expect(strUnOpt.validate(undefined).data).toBe(undefined)
    expect(strUnOpt.validate(undefined).error).toBe(undefined)
  })

  it('x: base detailed numberUnion schema required/optional/default parse/validate', () => {
    const unOf = [0, 1, 2] as const
    const numUn = x({ type: 'numberUnion', of: unOf })
    const subj = 1

    expect(numUn.parse(subj).data).toBe(subj)
    expect(numUn.parse(subj).error).toBe(undefined)

    expect(numUn.validate(subj).data).toBe(subj)
    expect(numUn.validate(subj).error).toBe(undefined)

    const numUnOpt = x({ type: 'numberUnion', of: unOf, optional: true })

    expect(numUnOpt.parse(subj).data).toBe(subj)
    expect(numUnOpt.parse(subj).error).toBe(undefined)

    expect(numUnOpt.parse(undefined).data).toBe(undefined)
    expect(numUnOpt.parse(undefined).error).toBe(undefined)
    expect(numUnOpt.parse(null).data).toBe(undefined)
    expect(numUnOpt.parse(null).error).toBe(undefined)

    expect(numUnOpt.validate(subj).data).toBe(subj)
    expect(numUnOpt.validate(subj).error).toBe(undefined)

    expect(numUnOpt.validate(undefined).data).toBe(undefined)
    expect(numUnOpt.validate(undefined).error).toBe(undefined)
  })

  it('x: compound array schema required/optional parse/validate', () => {
    const str = x({ type: 'array', of: { type: 'string' } })
    const subj = ['x']

    expect(str.parse(subj).data).toStrictEqual(subj)
    expect(str.parse(subj).error).toBe(undefined)

    expect(str.validate(subj).data).toStrictEqual(subj)
    expect(str.validate(subj).error).toBe(undefined)

    const strOpt = x({ type: 'array', of: { type: 'string' }, optional: true })

    expect(strOpt.parse(subj).data).toStrictEqual(subj)
    expect(strOpt.parse(subj).error).toBe(undefined)

    expect(strOpt.parse(undefined).data).toBe(undefined)
    expect(strOpt.parse(undefined).error).toBe(undefined)
    expect(strOpt.parse(null).data).toBe(undefined)
    expect(strOpt.parse(null).error).toBe(undefined)

    expect(strOpt.validate(subj).data).toStrictEqual(subj)
    expect(strOpt.validate(subj).error).toBe(undefined)

    expect(strOpt.validate(undefined).data).toBe(undefined)
    expect(strOpt.validate(undefined).error).toBe(undefined)
  })

  it('x: compound array required schema inner optional parse/validate', () => {
    const str = x({ type: 'array', of: { type: 'string', optional: true } })
    const subj = [undefined, 'x', undefined]

    expect(str.parse(subj).data).toStrictEqual(subj)
    expect(str.parse(subj).error).toBe(undefined)

    expect(str.validate(subj).data).toStrictEqual(subj)
    expect(str.validate(subj).error).toBe(undefined)
  })

  it('x: compound object schema required/optional parse/validate', () => {
    const str = x({ type: 'object', of: { x: { type: 'string' } } })
    const subj = { x: 'x' }

    expect(str.parse(subj).data).toStrictEqual(subj)
    expect(str.parse(subj).error).toBe(undefined)

    expect(str.validate(subj).data).toStrictEqual(subj)
    expect(str.validate(subj).error).toBe(undefined)

    const strOpt = x({
      type: 'object',
      of: { x: { type: 'string' } },
      optional: true,
    })

    expect(strOpt.parse(subj).data).toStrictEqual(subj)
    expect(strOpt.parse(subj).error).toBe(undefined)

    expect(strOpt.parse(undefined).data).toBe(undefined)
    expect(strOpt.parse(undefined).error).toBe(undefined)
    expect(strOpt.parse(null).data).toBe(undefined)
    expect(strOpt.parse(null).error).toBe(undefined)

    expect(strOpt.validate(subj).data).toStrictEqual(subj)
    expect(strOpt.validate(subj).error).toBe(undefined)

    expect(strOpt.validate(undefined).data).toBe(undefined)
    expect(strOpt.validate(undefined).error).toBe(undefined)
  })
})

describe('X closure statically defined schema INVALID', () => {
  // TODO: reduce to `errP` and `errV` to `err`
  /* Strict invalid subject/schema error shapes is tested in direct parser/validator tests */
  const errP = [{ code: ERROR_CODE.invalidType }]
  const errV = [{ code: ERROR_CODE.invalidType }]

  it('x: base detailed string optional/required schema parse/validate', () => {
    const strInvSubj = 0
    const strReq = x({ type: 'string' })

    expect(strReq.parse(undefined).data).toBe(undefined)
    expect(strReq.parse(undefined).error).toMatchObject(errP)

    expect(strReq.parse(null).data).toBe(undefined)
    expect(strReq.parse(null).error).toMatchObject(errP)

    expect(strReq.parse(strInvSubj).data).toBe(undefined)
    expect(strReq.parse(strInvSubj).error).toMatchObject(errP)

    expect(strReq.validate(undefined).data).toBe(undefined)
    expect(strReq.validate(undefined).error).toMatchObject(errV)

    expect(strReq.validate(strInvSubj).data).toBe(undefined)
    expect(strReq.validate(strInvSubj).error).toMatchObject(errV)

    const strOpt = x({ type: 'string', optional: true })

    expect(strOpt.parse(strInvSubj).data).toBe(undefined)
    expect(strOpt.parse(strInvSubj).error).toMatchObject(errP)

    expect(strOpt.validate(strInvSubj).data).toBe(undefined)
    expect(strOpt.validate(strInvSubj).error).toMatchObject(errV)

    expect(strOpt.validate(null).data).toBe(undefined)
    expect(strOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: base detailed number optional/required schema parse/validate', () => {
    const numInvSubj = true
    const numReq = x({ type: 'number' })

    expect(numReq.parse(undefined).data).toBe(undefined)
    expect(numReq.parse(undefined).error).toMatchObject(errP)

    expect(numReq.parse(null).data).toBe(undefined)
    expect(numReq.parse(null).error).toMatchObject(errP)

    expect(numReq.parse(numInvSubj).data).toBe(undefined)
    expect(numReq.parse(numInvSubj).error).toMatchObject(errP)

    expect(numReq.validate(undefined).data).toBe(undefined)
    expect(numReq.validate(undefined).error).toMatchObject(errV)

    expect(numReq.validate(numInvSubj).data).toBe(undefined)
    expect(numReq.validate(numInvSubj).error).toMatchObject(errV)

    const numOpt = x({ type: 'number', optional: true })

    expect(numOpt.parse(numInvSubj).data).toBe(undefined)
    expect(numOpt.parse(numInvSubj).error).toMatchObject(errP)

    expect(numOpt.validate(numInvSubj).data).toBe(undefined)
    expect(numOpt.validate(numInvSubj).error).toMatchObject(errV)

    expect(numOpt.validate(null).data).toBe(undefined)
    expect(numOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: base detailed boolean optional/required schema parse/validate', () => {
    const boolInvSubj = 'x'
    const boolReq = x({ type: 'boolean' })

    expect(boolReq.parse(undefined).data).toBe(undefined)
    expect(boolReq.parse(undefined).error).toMatchObject(errP)

    expect(boolReq.parse(null).data).toBe(undefined)
    expect(boolReq.parse(null).error).toMatchObject(errP)

    expect(boolReq.parse(boolInvSubj).data).toBe(undefined)
    expect(boolReq.parse(boolInvSubj).error).toMatchObject(errP)

    expect(boolReq.validate(undefined).data).toBe(undefined)
    expect(boolReq.validate(undefined).error).toMatchObject(errV)

    expect(boolReq.validate(boolInvSubj).data).toBe(undefined)
    expect(boolReq.validate(boolInvSubj).error).toMatchObject(errV)

    const boolOpt = x({ type: 'boolean', optional: true })

    expect(boolOpt.parse(boolInvSubj).data).toBe(undefined)
    expect(boolOpt.parse(boolInvSubj).error).toMatchObject(errP)

    expect(boolOpt.validate(boolInvSubj).data).toBe(undefined)
    expect(boolOpt.validate(boolInvSubj).error).toMatchObject(errV)

    expect(boolOpt.validate(null).data).toBe(undefined)
    expect(boolOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: base detailed stringUnion optional/required schema parse/validate', () => {
    const strUnInvSubj = 0

    const unOf = ['x', 'y'] as const
    const strUnReq = x({ type: 'stringUnion', of: unOf })

    expect(strUnReq.parse(undefined).data).toBe(undefined)
    expect(strUnReq.parse(undefined).error).toMatchObject(errP)

    expect(strUnReq.parse(null).data).toBe(undefined)
    expect(strUnReq.parse(null).error).toMatchObject(errP)

    expect(strUnReq.parse(strUnInvSubj).data).toBe(undefined)
    expect(strUnReq.parse(strUnInvSubj).error).toMatchObject(errP)

    expect(strUnReq.validate(undefined).data).toBe(undefined)
    expect(strUnReq.validate(undefined).error).toMatchObject(errV)

    expect(strUnReq.validate(strUnInvSubj).data).toBe(undefined)
    expect(strUnReq.validate(strUnInvSubj).error).toMatchObject(errV)

    const strUnOpt = x({ type: 'stringUnion', of: unOf, optional: true })

    expect(strUnOpt.parse(strUnInvSubj).data).toBe(undefined)
    expect(strUnOpt.parse(strUnInvSubj).error).toMatchObject(errP)

    expect(strUnOpt.validate(strUnInvSubj).data).toBe(undefined)
    expect(strUnOpt.validate(strUnInvSubj).error).toMatchObject(errV)

    expect(strUnOpt.validate(null).data).toBe(undefined)
    expect(strUnOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: base detailed numberUnion optional/required schema parse/validate', () => {
    const numUnInvSubj = 'x'

    const unOf = [0, 1] as const
    const numUnReq = x({ type: 'numberUnion', of: unOf })

    expect(numUnReq.parse(undefined).data).toBe(undefined)
    expect(numUnReq.parse(undefined).error).toMatchObject(errP)

    expect(numUnReq.parse(null).data).toBe(undefined)
    expect(numUnReq.parse(null).error).toMatchObject(errP)

    expect(numUnReq.parse(numUnInvSubj).data).toBe(undefined)
    expect(numUnReq.parse(numUnInvSubj).error).toMatchObject(errP)

    expect(numUnReq.validate(undefined).data).toBe(undefined)
    expect(numUnReq.validate(undefined).error).toMatchObject(errV)

    expect(numUnReq.validate(numUnInvSubj).data).toBe(undefined)
    expect(numUnReq.validate(numUnInvSubj).error).toMatchObject(errV)

    const numUnOpt = x({ type: 'numberUnion', of: unOf, optional: true })

    expect(numUnOpt.parse(numUnInvSubj).data).toBe(undefined)
    expect(numUnOpt.parse(numUnInvSubj).error).toMatchObject(errP)

    expect(numUnOpt.validate(numUnInvSubj).data).toBe(undefined)
    expect(numUnOpt.validate(numUnInvSubj).error).toMatchObject(errV)

    expect(numUnOpt.validate(null).data).toBe(undefined)
    expect(numUnOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: compound array optional/required schema parse/validate', () => {
    const arrInvSubj = 'x'
    const arrReq = x({ type: 'array', of: { type: 'string' } })

    expect(arrReq.parse(undefined).data).toBe(undefined)
    expect(arrReq.parse(undefined).error).toMatchObject(errP)

    expect(arrReq.parse(null).data).toBe(undefined)
    expect(arrReq.parse(null).error).toMatchObject(errP)

    expect(arrReq.parse(arrInvSubj).data).toBe(undefined)
    expect(arrReq.parse(arrInvSubj).error).toMatchObject(errP)

    expect(arrReq.validate(undefined).data).toBe(undefined)
    expect(arrReq.validate(undefined).error).toMatchObject(errV)

    expect(arrReq.validate(arrInvSubj).data).toBe(undefined)
    expect(arrReq.validate(arrInvSubj).error).toMatchObject(errV)

    const arrOpt = x({
      type: 'array',
      of: { type: 'string', optional: true },
      optional: true,
    })

    expect(arrOpt.parse(arrInvSubj).data).toBe(undefined)
    expect(arrOpt.parse(arrInvSubj).error).toMatchObject(errP)

    expect(arrOpt.validate(arrInvSubj).data).toBe(undefined)
    expect(arrOpt.validate(arrInvSubj).error).toMatchObject(errV)

    expect(arrOpt.validate(null).data).toBe(undefined)
    expect(arrOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: compound object optional/required schema parse/validate', () => {
    const objInvSubj = 'x'
    const objReq = x({ type: 'object', of: { x: { type: 'string' } } })

    expect(objReq.parse(undefined).data).toBe(undefined)
    expect(objReq.parse(undefined).error).toMatchObject(errP)

    expect(objReq.parse(null).data).toBe(undefined)
    expect(objReq.parse(null).error).toMatchObject(errP)

    expect(objReq.parse(objInvSubj).data).toBe(undefined)
    expect(objReq.parse(objInvSubj).error).toMatchObject(errP)

    expect(objReq.validate(undefined).data).toBe(undefined)
    expect(objReq.validate(undefined).error).toMatchObject(errV)

    expect(objReq.validate(objInvSubj).data).toBe(undefined)
    expect(objReq.validate(objInvSubj).error).toMatchObject(errV)

    const objOpt = x({
      type: 'object',
      of: { x: { type: 'string' } },
      optional: true,
    })

    expect(objOpt.parse(objInvSubj).data).toBe(undefined)
    expect(objOpt.parse(objInvSubj).error).toMatchObject(errP)

    expect(objOpt.validate(objInvSubj).data).toBe(undefined)
    expect(objOpt.validate(objInvSubj).error).toMatchObject(errV)

    expect(objOpt.validate(null).data).toBe(undefined)
    expect(objOpt.validate(null).error).toMatchObject(errV)
  })
})

describe('X closure programmatically defined schema VALID', () => {
  it('x: base string schema required/optional/default parse/validate', () => {
    const str = x(string())
    const subj = 'x'

    expect(str.parse(subj).data).toBe(subj)
    expect(str.parse(subj).error).toBe(undefined)

    expect(str.validate(subj).data).toBe(subj)
    expect(str.validate(subj).error).toBe(undefined)

    const strOpt = x(string().optional())

    expect(strOpt.parse(subj).data).toBe(subj)
    expect(strOpt.parse(subj).error).toBe(undefined)

    expect(strOpt.parse(undefined).data).toBe(undefined)
    expect(strOpt.parse(undefined).error).toBe(undefined)
    expect(strOpt.parse(null).data).toBe(undefined)
    expect(strOpt.parse(null).error).toBe(undefined)

    expect(strOpt.validate(subj).data).toBe(subj)
    expect(strOpt.validate(subj).error).toBe(undefined)

    expect(strOpt.validate(undefined).data).toBe(undefined)
    expect(strOpt.validate(undefined).error).toBe(undefined)
  })

  it('x: base number schema required/optional/default parse/validate', () => {
    const num = x(number())
    const subj = 0

    expect(num.parse(subj).data).toBe(subj)
    expect(num.parse(subj).error).toBe(undefined)

    expect(num.validate(subj).data).toBe(subj)
    expect(num.validate(subj).error).toBe(undefined)

    const numOpt = x(number().optional())

    expect(numOpt.parse(subj).data).toBe(subj)
    expect(numOpt.parse(subj).error).toBe(undefined)

    expect(numOpt.parse(undefined).data).toBe(undefined)
    expect(numOpt.parse(undefined).error).toBe(undefined)
    expect(numOpt.parse(null).data).toBe(undefined)
    expect(numOpt.parse(null).error).toBe(undefined)

    expect(numOpt.validate(subj).data).toBe(subj)
    expect(numOpt.validate(subj).error).toBe(undefined)

    expect(numOpt.validate(undefined).data).toBe(undefined)
    expect(numOpt.validate(undefined).error).toBe(undefined)
  })

  it('x: base boolean schema required/optional/default parse/validate', () => {
    const bool = x(boolean())
    const subj = true

    expect(bool.parse(subj).data).toBe(subj)
    expect(bool.parse(subj).error).toBe(undefined)

    expect(bool.validate(subj).data).toBe(subj)
    expect(bool.validate(subj).error).toBe(undefined)

    const boolOpt = x(boolean().optional())

    expect(boolOpt.parse(subj).data).toBe(subj)
    expect(boolOpt.parse(subj).error).toBe(undefined)

    expect(boolOpt.parse(undefined).data).toBe(undefined)
    expect(boolOpt.parse(undefined).error).toBe(undefined)
    expect(boolOpt.parse(null).data).toBe(undefined)
    expect(boolOpt.parse(null).error).toBe(undefined)

    expect(boolOpt.validate(subj).data).toBe(subj)
    expect(boolOpt.validate(subj).error).toBe(undefined)

    expect(boolOpt.validate(undefined).data).toBe(undefined)
    expect(boolOpt.validate(undefined).error).toBe(undefined)
  })

  it('x: base stringUnion schema required/optional/default parse/validate', () => {
    const unOf = ['x', 'y', 'z'] as const
    const strUn = x(stringUnion(...unOf))
    const subj = 'y'

    expect(strUn.parse(subj).data).toBe(subj)
    expect(strUn.parse(subj).error).toBe(undefined)

    expect(strUn.validate(subj).data).toBe(subj)
    expect(strUn.validate(subj).error).toBe(undefined)

    const strUnOpt = x(stringUnion(...unOf).optional())

    expect(strUnOpt.parse(subj).data).toBe(subj)
    expect(strUnOpt.parse(subj).error).toBe(undefined)

    expect(strUnOpt.parse(undefined).data).toBe(undefined)
    expect(strUnOpt.parse(undefined).error).toBe(undefined)
    expect(strUnOpt.parse(null).data).toBe(undefined)
    expect(strUnOpt.parse(null).error).toBe(undefined)

    expect(strUnOpt.validate(subj).data).toBe(subj)
    expect(strUnOpt.validate(subj).error).toBe(undefined)

    expect(strUnOpt.validate(undefined).data).toBe(undefined)
    expect(strUnOpt.validate(undefined).error).toBe(undefined)
  })

  it('x: base numberUnion schema required/optional/default parse/validate', () => {
    const unOf = [0, 1, 2] as const
    const numUn = x(numberUnion(...unOf))
    const subj = 1

    expect(numUn.parse(subj).data).toBe(subj)
    expect(numUn.parse(subj).error).toBe(undefined)

    expect(numUn.validate(subj).data).toBe(subj)
    expect(numUn.validate(subj).error).toBe(undefined)

    const numUnOpt = x(numberUnion(...unOf).optional())

    expect(numUnOpt.parse(subj).data).toBe(subj)
    expect(numUnOpt.parse(subj).error).toBe(undefined)

    expect(numUnOpt.parse(undefined).data).toBe(undefined)
    expect(numUnOpt.parse(undefined).error).toBe(undefined)
    expect(numUnOpt.parse(null).data).toBe(undefined)
    expect(numUnOpt.parse(null).error).toBe(undefined)

    expect(numUnOpt.validate(subj).data).toBe(subj)
    expect(numUnOpt.validate(subj).error).toBe(undefined)

    expect(numUnOpt.validate(undefined).data).toBe(undefined)
    expect(numUnOpt.validate(undefined).error).toBe(undefined)
  })

  it('x: compound array schema required/optional parse/validate', () => {
    const str = x(array(string()))
    const subj = ['x']

    expect(str.parse(subj).data).toStrictEqual(subj)
    expect(str.parse(subj).error).toBe(undefined)

    expect(str.validate(subj).data).toStrictEqual(subj)
    expect(str.validate(subj).error).toBe(undefined)

    const strOpt = x(array(string()).optional())

    expect(strOpt.parse(subj).data).toStrictEqual(subj)
    expect(strOpt.parse(subj).error).toBe(undefined)

    expect(strOpt.parse(undefined).data).toBe(undefined)
    expect(strOpt.parse(undefined).error).toBe(undefined)
    expect(strOpt.parse(null).data).toBe(undefined)
    expect(strOpt.parse(null).error).toBe(undefined)

    expect(strOpt.validate(subj).data).toStrictEqual(subj)
    expect(strOpt.validate(subj).error).toBe(undefined)

    expect(strOpt.validate(undefined).data).toBe(undefined)
    expect(strOpt.validate(undefined).error).toBe(undefined)
  })

  it('x: compound object schema required/optional parse/validate', () => {
    const str = x(object({ x: string() }))
    const subj = { x: 'x' }

    expect(str.parse(subj).data).toStrictEqual(subj)
    expect(str.parse(subj).error).toBe(undefined)

    expect(str.validate(subj).data).toStrictEqual(subj)
    expect(str.validate(subj).error).toBe(undefined)

    const strOpt = x(object({ x: string() }).optional())

    expect(strOpt.parse(subj).data).toStrictEqual(subj)
    expect(strOpt.parse(subj).error).toBe(undefined)

    expect(strOpt.parse(undefined).data).toBe(undefined)
    expect(strOpt.parse(undefined).error).toBe(undefined)
    expect(strOpt.parse(null).data).toBe(undefined)
    expect(strOpt.parse(null).error).toBe(undefined)

    expect(strOpt.validate(subj).data).toStrictEqual(subj)
    expect(strOpt.validate(subj).error).toBe(undefined)

    expect(strOpt.validate(undefined).data).toBe(undefined)
    expect(strOpt.validate(undefined).error).toBe(undefined)
  })
})

describe('X closure programmatically defined schema INVALID', () => {
  /* Strict invalid subject/schema error shapes is tested in direct parser/validator tests */
  const errP = [{ code: ERROR_CODE.invalidType }]
  const errV = [{ code: ERROR_CODE.invalidType }]

  it('x: base string optional/required schema parse/validate', () => {
    const strInvSubj = 0
    const strReq = x(string())

    expect(strReq.parse(undefined).data).toBe(undefined)
    expect(strReq.parse(undefined).error).toMatchObject(errP)

    expect(strReq.parse(null).data).toBe(undefined)
    expect(strReq.parse(null).error).toMatchObject(errP)

    expect(strReq.parse(strInvSubj).data).toBe(undefined)
    expect(strReq.parse(strInvSubj).error).toMatchObject(errP)

    expect(strReq.validate(undefined).data).toBe(undefined)
    expect(strReq.validate(undefined).error).toMatchObject(errV)

    expect(strReq.validate(strInvSubj).data).toBe(undefined)
    expect(strReq.validate(strInvSubj).error).toMatchObject(errV)

    const strOpt = x(string().optional())

    expect(strOpt.parse(strInvSubj).data).toBe(undefined)
    expect(strOpt.parse(strInvSubj).error).toMatchObject(errP)

    expect(strOpt.validate(strInvSubj).data).toBe(undefined)
    expect(strOpt.validate(strInvSubj).error).toMatchObject(errV)

    expect(strOpt.validate(null).data).toBe(undefined)
    expect(strOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: base number optional/required schema parse/validate', () => {
    const numInvSubj = true
    const numReq = x(number())

    expect(numReq.parse(undefined).data).toBe(undefined)
    expect(numReq.parse(undefined).error).toMatchObject(errP)

    expect(numReq.parse(null).data).toBe(undefined)
    expect(numReq.parse(null).error).toMatchObject(errP)

    expect(numReq.parse(numInvSubj).data).toBe(undefined)
    expect(numReq.parse(numInvSubj).error).toMatchObject(errP)

    expect(numReq.validate(undefined).data).toBe(undefined)
    expect(numReq.validate(undefined).error).toMatchObject(errV)

    expect(numReq.validate(numInvSubj).data).toBe(undefined)
    expect(numReq.validate(numInvSubj).error).toMatchObject(errV)

    const numOpt = x(number().optional())

    expect(numOpt.parse(numInvSubj).data).toBe(undefined)
    expect(numOpt.parse(numInvSubj).error).toMatchObject(errP)

    expect(numOpt.validate(numInvSubj).data).toBe(undefined)
    expect(numOpt.validate(numInvSubj).error).toMatchObject(errV)

    expect(numOpt.validate(null).data).toBe(undefined)
    expect(numOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: base boolean optional/required schema parse/validate', () => {
    const boolInvSubj = 'x'
    const boolReq = x(boolean())

    expect(boolReq.parse(undefined).data).toBe(undefined)
    expect(boolReq.parse(undefined).error).toMatchObject(errP)

    expect(boolReq.parse(null).data).toBe(undefined)
    expect(boolReq.parse(null).error).toMatchObject(errP)

    expect(boolReq.parse(boolInvSubj).data).toBe(undefined)
    expect(boolReq.parse(boolInvSubj).error).toMatchObject(errP)

    expect(boolReq.validate(undefined).data).toBe(undefined)
    expect(boolReq.validate(undefined).error).toMatchObject(errV)

    expect(boolReq.validate(boolInvSubj).data).toBe(undefined)
    expect(boolReq.validate(boolInvSubj).error).toMatchObject(errV)

    const boolOpt = x(boolean().optional())

    expect(boolOpt.parse(boolInvSubj).data).toBe(undefined)
    expect(boolOpt.parse(boolInvSubj).error).toMatchObject(errP)

    expect(boolOpt.validate(boolInvSubj).data).toBe(undefined)
    expect(boolOpt.validate(boolInvSubj).error).toMatchObject(errV)

    expect(boolOpt.validate(null).data).toBe(undefined)
    expect(boolOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: base stringUnion optional/required schema parse/validate', () => {
    const strUnInvSubj = 0

    const unOf = ['x', 'y'] as const
    const strUnReq = x(stringUnion(...unOf))

    expect(strUnReq.parse(undefined).data).toBe(undefined)
    expect(strUnReq.parse(undefined).error).toMatchObject(errP)

    expect(strUnReq.parse(null).data).toBe(undefined)
    expect(strUnReq.parse(null).error).toMatchObject(errP)

    expect(strUnReq.parse(strUnInvSubj).data).toBe(undefined)
    expect(strUnReq.parse(strUnInvSubj).error).toMatchObject(errP)

    expect(strUnReq.validate(undefined).data).toBe(undefined)
    expect(strUnReq.validate(undefined).error).toMatchObject(errV)

    expect(strUnReq.validate(strUnInvSubj).data).toBe(undefined)
    expect(strUnReq.validate(strUnInvSubj).error).toMatchObject(errV)

    const strUnOpt = x({ type: 'stringUnion', of: unOf, optional: true })

    expect(strUnOpt.parse(strUnInvSubj).data).toBe(undefined)
    expect(strUnOpt.parse(strUnInvSubj).error).toMatchObject(errP)

    expect(strUnOpt.validate(strUnInvSubj).data).toBe(undefined)
    expect(strUnOpt.validate(strUnInvSubj).error).toMatchObject(errV)

    expect(strUnOpt.validate(null).data).toBe(undefined)
    expect(strUnOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: base numberUnion optional/required schema parse/validate', () => {
    const numUnInvSubj = 'x'

    const unOf = [0, 1] as const
    const numUnReq = x(numberUnion(...unOf))

    expect(numUnReq.parse(undefined).data).toBe(undefined)
    expect(numUnReq.parse(undefined).error).toMatchObject(errP)

    expect(numUnReq.parse(null).data).toBe(undefined)
    expect(numUnReq.parse(null).error).toMatchObject(errP)

    expect(numUnReq.parse(numUnInvSubj).data).toBe(undefined)
    expect(numUnReq.parse(numUnInvSubj).error).toMatchObject(errP)

    expect(numUnReq.validate(undefined).data).toBe(undefined)
    expect(numUnReq.validate(undefined).error).toMatchObject(errV)

    expect(numUnReq.validate(numUnInvSubj).data).toBe(undefined)
    expect(numUnReq.validate(numUnInvSubj).error).toMatchObject(errV)

    const numUnOpt = x(numberUnion(...unOf).optional())

    expect(numUnOpt.parse(numUnInvSubj).data).toBe(undefined)
    expect(numUnOpt.parse(numUnInvSubj).error).toMatchObject(errP)

    expect(numUnOpt.validate(numUnInvSubj).data).toBe(undefined)
    expect(numUnOpt.validate(numUnInvSubj).error).toMatchObject(errV)

    expect(numUnOpt.validate(null).data).toBe(undefined)
    expect(numUnOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: compound array optional/required schema parse/validate', () => {
    const arrInvSubj = 'x'
    const arrReq = x(array(string()))

    expect(arrReq.parse(undefined).data).toBe(undefined)
    expect(arrReq.parse(undefined).error).toMatchObject(errP)

    expect(arrReq.parse(null).data).toBe(undefined)
    expect(arrReq.parse(null).error).toMatchObject(errP)

    expect(arrReq.parse(arrInvSubj).data).toBe(undefined)
    expect(arrReq.parse(arrInvSubj).error).toMatchObject(errP)

    expect(arrReq.validate(undefined).data).toBe(undefined)
    expect(arrReq.validate(undefined).error).toMatchObject(errV)

    expect(arrReq.validate(arrInvSubj).data).toBe(undefined)
    expect(arrReq.validate(arrInvSubj).error).toMatchObject(errV)

    const arrOpt = x(array(string()).optional())

    expect(arrOpt.parse(arrInvSubj).data).toBe(undefined)
    expect(arrOpt.parse(arrInvSubj).error).toMatchObject(errP)

    expect(arrOpt.validate(arrInvSubj).data).toBe(undefined)
    expect(arrOpt.validate(arrInvSubj).error).toMatchObject(errV)

    expect(arrOpt.validate(null).data).toBe(undefined)
    expect(arrOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: compound object optional/required schema parse/validate', () => {
    const objInvSubj = 'x'
    const objReq = x(object({ x: string() }))

    expect(objReq.parse(undefined).data).toBe(undefined)
    expect(objReq.parse(undefined).error).toMatchObject(errP)

    expect(objReq.parse(null).data).toBe(undefined)
    expect(objReq.parse(null).error).toMatchObject(errP)

    expect(objReq.parse(objInvSubj).data).toBe(undefined)
    expect(objReq.parse(objInvSubj).error).toMatchObject(errP)

    expect(objReq.validate(undefined).data).toBe(undefined)
    expect(objReq.validate(undefined).error).toMatchObject(errV)

    expect(objReq.validate(objInvSubj).data).toBe(undefined)
    expect(objReq.validate(objInvSubj).error).toMatchObject(errV)

    const objOpt = x(object({ x: string() }).optional())

    expect(objOpt.parse(objInvSubj).data).toBe(undefined)
    expect(objOpt.parse(objInvSubj).error).toMatchObject(errP)

    expect(objOpt.validate(objInvSubj).data).toBe(undefined)
    expect(objOpt.validate(objInvSubj).error).toMatchObject(errV)

    expect(objOpt.validate(null).data).toBe(undefined)
    expect(objOpt.validate(null).error).toMatchObject(errV)
  })
})

describe('X closure type statically defined schema subject type inference check', () => {
  it('x: ObjectSchema parse', () => {
    const objSchReq = {
      type: 'object',
      of: {
        x: { type: 'string' },
        y: { type: 'number' },
        z: { type: 'boolean' },
      },
    } as const satisfies Schema

    const objXReq = x(objSchReq).parse('x')
    if (objXReq.error) return
    check<{ x: string; y: number; z: boolean }>(unknownX as typeof objXReq.data)

    const objSchOpt = {
      type: 'object',
      of: {
        x: { type: 'string' },
        y: { type: 'number' },
        z: { type: 'boolean' },
      },
      optional: true,
    } as const satisfies Schema

    const objXOpt = x(objSchOpt).parse('x')
    if (objXOpt.error) return
    check<{ x: string; y: number; z: boolean } | undefined>(
      unknownX as typeof objXOpt.data
    )
    // @ts-expect-error "undefined" is not assignable to ...
    check<{ x: string; y: number; z: boolean }>(unknownX as typeof objXOpt.data)
  })
})

describe('The parsed/validated subject type should be mutable', () => {
  it('x: statically defined ObjectSchema', () => {
    const schemaX = x({
      type: 'object',
      of: { x: { type: 'string' }, y: { type: 'number' } },
    } as const)
    const subject = { x: 'x', y: 0 }

    const parsed = schemaX.parse(subject)

    if (parsed.error) {
      throw Error('Not expected')
    }

    parsed.data.x = 'y'
    expect(parsed.data.x).toBe('y')

    const validated = schemaX.validate(subject)

    if (validated.error) {
      throw Error('Not expected')
    }

    validated.data.x = 'y'
    expect(validated.data.x).toBe('y')
  })

  it('x: programmatically defined ObjectSchema', () => {
    const schemaX = x(object({ x: string(), y: number() }))
    const subject = { x: 'x', y: 0 }

    const parsed = schemaX.parse(subject)

    if (parsed.error) {
      throw Error('Not expected')
    }

    parsed.data.x = 'y'
    expect(parsed.data.x).toBe('y')

    const validated = schemaX.validate(subject)

    if (validated.error) {
      throw Error('Not expected')
    }

    validated.data.x = 'y'
    expect(validated.data.x).toBe('y')
  })
})

describe('X closure "gurard" method', () => {
  it('x: base static required string valid', () => {
    const struct = x({ type: 'string' })
    const subject = 'x' as unknown
    const guard = struct.guard(subject)

    expect(guard).toBe(true)

    if (guard) {
      check<string>(subject)
      // @ts-expect-error 'string' is not assignable to parameter of type 'number'
      check<number>(subject)
    }
  })

  it('x: base static optional string valid', () => {
    const struct = x({ type: 'string', optional: true })
    const subject = 'x' as unknown
    const guard = struct.guard(subject)

    expect(guard).toBe(true)

    if (guard) {
      check<string | undefined>(subject)
      // @ts-expect-error 'string | undefined' is not assignable to parameter of type 'string'
      check<string>(subject)
    }
  })

  it('x: base programattic required string valid', () => {
    const struct = x(string())
    const subject = 'x' as unknown
    const guard = struct.guard(subject)

    expect(guard).toBe(true)

    if (guard) {
      check<string>(subject)
      // @ts-expect-error 'string' is not assignable to parameter of type 'number'
      check<number>(subject)
    }
  })

  it('x: base programmatic optional string valid', () => {
    const struct = x(string().optional())
    const subject = 'x' as unknown
    const guard = struct.guard(subject)

    expect(guard).toBe(true)

    if (guard) {
      check<string | undefined>(subject)
      // @ts-expect-error 'string | undefined' is not assignable to parameter of type 'string'
      check<string>(subject)
    }
  })

  it('x: string invalid', () => {
    expect(x({ type: 'string' }).guard(undefined)).toBe(false)
    expect(x({ type: 'string' }).guard(null)).toBe(false)
    expect(x({ type: 'string', optional: true }).guard(0)).toBe(false)
    expect(x(string()).guard(undefined)).toBe(false)
    expect(x(string()).guard(null)).toBe(false)
    expect(x(string().optional()).guard(0)).toBe(false)
  })

  it('x: base static required number valid', () => {
    const struct = x({ type: 'number' })
    const subject = 0 as unknown
    const guard = struct.guard(subject)

    expect(guard).toBe(true)

    if (guard) {
      check<number>(subject)
      // @ts-expect-error 'number' is not assignable to parameter of type 'boolean'
      check<boolean>(subject)
    }
  })

  it('x: base static optional number valid', () => {
    const struct = x({ type: 'number', optional: true })
    const subject = 0 as unknown
    const guard = struct.guard(subject)

    expect(guard).toBe(true)

    if (guard) {
      check<number | undefined>(subject)
      // @ts-expect-error 'number | undefined' is not assignable to parameter of type 'number'
      check<number>(subject)
    }
  })

  it('x: base programmatic required number valid', () => {
    const struct = x(number())
    const subject = 0 as unknown
    const guard = struct.guard(subject)

    expect(guard).toBe(true)

    if (guard) {
      check<number>(subject)
      // @ts-expect-error 'number' is not assignable to parameter of type 'boolean'
      check<boolean>(subject)
    }
  })

  it('x: base static optional number valid', () => {
    const struct = x(number().optional())
    const subject = 0 as unknown
    const guard = struct.guard(subject)

    expect(guard).toBe(true)

    if (guard) {
      check<number | undefined>(subject)
      // @ts-expect-error 'number | undefined' is not assignable to parameter of type 'number'
      check<number>(subject)
    }
  })

  it('x: number invalid', () => {
    expect(x({ type: 'number' }).guard(undefined)).toBe(false)
    expect(x({ type: 'number' }).guard(null)).toBe(false)
    expect(x({ type: 'number', optional: true }).guard(true)).toBe(false)
    expect(x(number()).guard(undefined)).toBe(false)
    expect(x(number()).guard(null)).toBe(false)
    expect(x(number().optional()).guard('x')).toBe(false)
  })

  it('x: ArraySchema static valid', () => {
    const struct = x({ type: 'array', of: { type: 'string' } })
    const subject = ['x', 'y'] as unknown
    const guard = struct.guard(subject)

    expect(guard).toBe(true)

    if (guard) {
      check<string[]>(subject)
      // @ts-expect-error 'string[]' is not assignable to parameter of type 'number[]'
      check<number[]>(subject)
    }
  })

  it('x: ArraySchema programmatic valid', () => {
    const struct = x(array(string()))
    const subject = ['x', 'y'] as unknown
    const guard = struct.guard(subject)

    expect(guard).toBe(true)

    if (guard) {
      check<string[]>(subject)
      // @ts-expect-error 'string[]' is not assignable to parameter of type 'number[]'
      check<number[]>(subject)
    }
  })

  it('x: ArraySchema invalid', () => {
    expect(x({ type: 'array', of: { type: 'string' } }).guard([0])).toBe(false)
    expect(x(array(string())).guard([0])).toBe(false)
  })

  it('x: ObjectSchema static valid', () => {
    const struct = x({
      type: 'object',
      of: { x: { type: 'string' }, y: { type: 'number' } },
    })

    const subject = { x: 'x', y: 0 } as unknown
    const guard = struct.guard(subject)

    expect(guard).toBe(true)

    if (guard) {
      check<{ x: string; y: number }>(subject)
      // @ts-expect-error '{ x: string; y: number; }' is not '{ x: string; y: number; z: boolean; }'
      check<{ x: string; y: number; z: boolean }>(subject)
    }
  })

  it('x: ObjectSchema programmatic valid', () => {
    const struct = x(
      object({
        x: string(),
        y: number(),
      })
    )

    const subject = { x: 'x', y: 0 } as unknown
    const guard = struct.guard(subject)

    expect(guard).toBe(true)

    if (guard) {
      check<{ x: string; y: number }>(subject)
      // @ts-expect-error '{ x: string; y: number; }' is not '{ x: string; y: number; z: boolean; }'
      check<{ x: string; y: number; z: boolean }>(subject)
    }
  })

  it('x: ObjectSchema invalid', () => {
    expect(
      x({ type: 'object', of: { x: { type: 'string' } } }).guard({ y: 0 })
    ).toBe(false)
    expect(x(object({ x: string() })).guard({ y: 0 })).toBe(false)
  })
})
