import { PARSE_ERROR_CODE, VALIDATE_ERROR_CODE } from '../error'

import { array } from '../programmatic-schema/array'
import { object } from '../programmatic-schema/object'

import { string } from '../programmatic-schema/string'
import { number } from '../programmatic-schema/number'
import { boolean } from '../programmatic-schema/boolean'
import { buffer } from '../programmatic-schema/buffer'
import { stringUnion } from '../programmatic-schema/string-union'
import { numberUnion } from '../programmatic-schema/number-union'

import { x } from '../x-closure'

describe('X closure statically defined schema VALID', () => {
  it('x: base short schema PARSE/VALIDATE', () => {
    /* string/string? parse */

    expect(x('string').parse('x').data).toBe('x')
    expect(x('string').parse('x').error).toBe(undefined)

    expect(x('string?').parse('x').data).toBe('x')
    expect(x('string?').parse('x').error).toBe(undefined)

    expect(x('string?').parse(undefined).data).toBe(undefined)
    expect(x('string?').parse(undefined).error).toBe(undefined)

    expect(x('string?').parse(null).data).toBe(undefined)
    expect(x('string?').parse(null).error).toBe(undefined)

    /* string/string? validate */

    expect(x('string').validate('x').data).toBe('x')
    expect(x('string').validate('x').error).toBe(undefined)

    expect(x('string?').validate('x').data).toBe('x')
    expect(x('string?').validate('x').error).toBe(undefined)

    expect(x('string?').validate(undefined).data).toBe(undefined)
    expect(x('string?').validate(undefined).error).toBe(undefined)

    /* number/number? parse */

    expect(x('number').parse(0).data).toBe(0)
    expect(x('number').parse(0).error).toBe(undefined)

    expect(x('number?').parse(0).data).toBe(0)
    expect(x('number?').parse(0).error).toBe(undefined)

    expect(x('number?').parse(undefined).data).toBe(undefined)
    expect(x('number?').parse(undefined).error).toBe(undefined)

    expect(x('number?').parse(null).data).toBe(undefined)
    expect(x('number?').parse(null).error).toBe(undefined)

    /* number/number? validate */

    expect(x('number').validate(0).data).toBe(0)
    expect(x('number').validate(0).error).toBe(undefined)

    expect(x('number?').validate(0).data).toBe(0)
    expect(x('number?').validate(0).error).toBe(undefined)

    expect(x('number?').validate(undefined).data).toBe(undefined)
    expect(x('number?').validate(undefined).error).toBe(undefined)

    /* boolean/boolean? parse */

    expect(x('boolean').parse(true).data).toBe(true)
    expect(x('boolean').parse(true).error).toBe(undefined)

    expect(x('boolean?').parse(false).data).toBe(false)
    expect(x('boolean?').parse(false).error).toBe(undefined)

    expect(x('boolean?').parse(undefined).data).toBe(undefined)
    expect(x('boolean?').parse(undefined).error).toBe(undefined)

    expect(x('boolean?').parse(null).data).toBe(undefined)
    expect(x('boolean?').parse(null).error).toBe(undefined)

    /* boolean/boolean? validate */

    expect(x('boolean').validate(true).data).toBe(true)
    expect(x('boolean').validate(true).error).toBe(undefined)

    expect(x('boolean?').validate(false).data).toBe(false)
    expect(x('boolean?').validate(false).error).toBe(undefined)

    expect(x('boolean?').validate(undefined).data).toBe(undefined)
    expect(x('boolean?').validate(undefined).error).toBe(undefined)

    /* buffer/buffer? parse */

    expect(x('buffer').parse(Buffer.from('x')).data).toStrictEqual(
      Buffer.from('x')
    )
    expect(x('buffer').parse(Buffer.from('x')).error).toBe(undefined)

    expect(x('buffer?').parse(Buffer.from('x')).data).toStrictEqual(
      Buffer.from('x')
    )
    expect(x('buffer?').parse(Buffer.from('x')).error).toBe(undefined)

    expect(x('buffer?').parse(undefined).data).toBe(undefined)
    expect(x('buffer?').parse(undefined).error).toBe(undefined)

    expect(x('buffer?').parse(null).data).toBe(undefined)
    expect(x('buffer?').parse(null).error).toBe(undefined)

    /* buffer/buffer? validate */

    expect(x('buffer').validate(Buffer.from('x')).data).toStrictEqual(
      Buffer.from('x')
    )
    expect(x('buffer').validate(Buffer.from('x')).error).toBe(undefined)

    expect(x('buffer?').validate(Buffer.from('x')).data).toStrictEqual(
      Buffer.from('x')
    )
    expect(x('buffer?').validate(Buffer.from('x')).error).toBe(undefined)

    expect(x('buffer?').validate(undefined).data).toBe(undefined)
    expect(x('buffer?').validate(undefined).error).toBe(undefined)
  })

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

    expect(strDef.parse(undefined).data).toBe(subjDef)
    expect(strDef.parse(undefined).error).toBe(undefined)
    expect(strDef.parse(null).data).toBe(subjDef)
    expect(strDef.parse(null).error).toBe(undefined)

    expect(strDef.validate(subj).data).toBe(subj)
    expect(strDef.validate(subj).error).toBe(undefined)

    expect(strDef.validate(undefined).data).toBe(undefined)
    expect(strDef.validate(undefined).error).toBe(undefined)
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

    const subjDef = 1
    const numDef = x({ type: 'number', optional: true, default: subjDef })

    expect(numDef.parse(subj).data).toBe(subj)
    expect(numDef.parse(subj).error).toBe(undefined)

    expect(numDef.parse(undefined).data).toBe(subjDef)
    expect(numDef.parse(undefined).error).toBe(undefined)
    expect(numDef.parse(null).data).toBe(subjDef)
    expect(numDef.parse(null).error).toBe(undefined)

    expect(numDef.validate(subj).data).toBe(subj)
    expect(numDef.validate(subj).error).toBe(undefined)

    expect(numDef.validate(undefined).data).toBe(undefined)
    expect(numDef.validate(undefined).error).toBe(undefined)
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

    const subjDef = false
    const boolDef = x({ type: 'boolean', optional: true, default: subjDef })

    expect(boolDef.parse(subj).data).toBe(subj)
    expect(boolDef.parse(subj).error).toBe(undefined)

    expect(boolDef.parse(undefined).data).toBe(subjDef)
    expect(boolDef.parse(undefined).error).toBe(undefined)
    expect(boolDef.parse(null).data).toBe(subjDef)
    expect(boolDef.parse(null).error).toBe(undefined)

    expect(boolDef.validate(subj).data).toBe(subj)
    expect(boolDef.validate(subj).error).toBe(undefined)

    expect(boolDef.validate(undefined).data).toBe(undefined)
    expect(boolDef.validate(undefined).error).toBe(undefined)
  })

  it('x: base detailed buffer schema required/optional parse/validate', () => {
    const buff = x({ type: 'buffer' })
    const subj = Buffer.from('x')

    expect(buff.parse(subj).data).toBe(subj)
    expect(buff.parse(subj).error).toBe(undefined)

    expect(buff.validate(subj).data).toBe(subj)
    expect(buff.validate(subj).error).toBe(undefined)

    const buffOpt = x({ type: 'buffer', optional: true })

    expect(buffOpt.parse(subj).data).toBe(subj)
    expect(buffOpt.parse(subj).error).toBe(undefined)

    expect(buffOpt.parse(undefined).data).toBe(undefined)
    expect(buffOpt.parse(undefined).error).toBe(undefined)
    expect(buffOpt.parse(null).data).toBe(undefined)
    expect(buffOpt.parse(null).error).toBe(undefined)

    expect(buffOpt.validate(subj).data).toBe(subj)
    expect(buffOpt.validate(subj).error).toBe(undefined)

    expect(buffOpt.validate(undefined).data).toBe(undefined)
    expect(buffOpt.validate(undefined).error).toBe(undefined)
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

    const subjDef = 'z'
    const strUnDef = x({
      type: 'stringUnion',
      of: unOf,
      optional: true,
      default: subjDef,
    })

    expect(strUnDef.parse(subj).data).toBe(subj)
    expect(strUnDef.parse(subj).error).toBe(undefined)

    expect(strUnDef.parse(undefined).data).toBe(subjDef)
    expect(strUnDef.parse(undefined).error).toBe(undefined)
    expect(strUnDef.parse(null).data).toBe(subjDef)
    expect(strUnDef.parse(null).error).toBe(undefined)

    expect(strUnDef.validate(subj).data).toBe(subj)
    expect(strUnDef.validate(subj).error).toBe(undefined)

    expect(strUnDef.validate(undefined).data).toBe(undefined)
    expect(strUnDef.validate(undefined).error).toBe(undefined)
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

    const subjDef = 2
    const numUnDef = x({
      type: 'numberUnion',
      of: unOf,
      optional: true,
      default: subjDef,
    })

    expect(numUnDef.parse(subj).data).toBe(subj)
    expect(numUnDef.parse(subj).error).toBe(undefined)

    expect(numUnDef.parse(undefined).data).toBe(subjDef)
    expect(numUnDef.parse(undefined).error).toBe(undefined)
    expect(numUnDef.parse(null).data).toBe(subjDef)
    expect(numUnDef.parse(null).error).toBe(undefined)

    expect(numUnDef.validate(subj).data).toBe(subj)
    expect(numUnDef.validate(subj).error).toBe(undefined)

    expect(numUnDef.validate(undefined).data).toBe(undefined)
    expect(numUnDef.validate(undefined).error).toBe(undefined)
  })

  it('x: compound array schema required/optional parse/validate', () => {
    const str = x({ type: 'array', of: 'string' })
    const subj = ['x']

    expect(str.parse(subj).data).toStrictEqual(subj)
    expect(str.parse(subj).error).toBe(undefined)

    expect(str.validate(subj).data).toStrictEqual(subj)
    expect(str.validate(subj).error).toBe(undefined)

    const strOpt = x({ type: 'array', of: 'string', optional: true })

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
    const str = x({ type: 'object', of: { x: 'string' } })
    const subj = { x: 'x' }

    expect(str.parse(subj).data).toStrictEqual(subj)
    expect(str.parse(subj).error).toBe(undefined)

    expect(str.validate(subj).data).toStrictEqual(subj)
    expect(str.validate(subj).error).toBe(undefined)

    const strOpt = x({ type: 'object', of: { x: 'string' }, optional: true })

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
  /* Strict invalid subject/schema error shapes is tested in direct parser/validator tests */
  const errP = [{ code: PARSE_ERROR_CODE.invalidType }]
  const errV = [{ code: VALIDATE_ERROR_CODE.invalidType }]

  it('x: base short string optional/required schema parse/validate', () => {
    const strInvSubj = 0
    const strReq = x('string')

    expect(strReq.parse(undefined).data).toBe(undefined)
    expect(strReq.parse(undefined).error).toMatchObject(errP)

    expect(strReq.parse(null).data).toBe(undefined)
    expect(strReq.parse(null).error).toMatchObject(errP)

    expect(strReq.parse(strInvSubj).data).toBe(undefined)
    expect(strReq.parse(strInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'string'
    expect(strReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type 'string'
    expect(strReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(strReq.validate(strInvSubj).data).toBe(undefined)
    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(strReq.validate(strInvSubj).error).toMatchObject(errV)

    const strOpt = x('string?')

    expect(strOpt.parse(strInvSubj).data).toBe(undefined)
    expect(strOpt.parse(strInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(strOpt.validate(strInvSubj).data).toBe(undefined)
    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(strOpt.validate(strInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type 'string | undefined'
    expect(strOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type 'string | undefined'
    expect(strOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: base short number optional/required schema parse/validate', () => {
    const numInvSubj = true
    const numReq = x('number')

    expect(numReq.parse(undefined).data).toBe(undefined)
    expect(numReq.parse(undefined).error).toMatchObject(errP)

    expect(numReq.parse(null).data).toBe(undefined)
    expect(numReq.parse(null).error).toMatchObject(errP)

    expect(numReq.parse(numInvSubj).data).toBe(undefined)
    expect(numReq.parse(numInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'number'
    expect(numReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type 'number'
    expect(numReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(numReq.validate(numInvSubj).data).toBe(undefined)
    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(numReq.validate(numInvSubj).error).toMatchObject(errV)

    const numOpt = x('number?')

    expect(numOpt.parse(numInvSubj).data).toBe(undefined)
    expect(numOpt.parse(numInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(numOpt.validate(numInvSubj).data).toBe(undefined)
    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(numOpt.validate(numInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type 'number | undefined'
    expect(numOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type 'number | undefined'
    expect(numOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: base short boolean optional/required schema parse/validate', () => {
    const boolInvSubj = Buffer.from('x')
    const boolReq = x('boolean')

    expect(boolReq.parse(undefined).data).toBe(undefined)
    expect(boolReq.parse(undefined).error).toMatchObject(errP)

    expect(boolReq.parse(null).data).toBe(undefined)
    expect(boolReq.parse(null).error).toMatchObject(errP)

    expect(boolReq.parse(boolInvSubj).data).toBe(undefined)
    expect(boolReq.parse(boolInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'boolean'
    expect(boolReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type 'boolean'
    expect(boolReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean'
    expect(boolReq.validate(boolInvSubj).data).toBe(undefined)
    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean'
    expect(boolReq.validate(boolInvSubj).error).toMatchObject(errV)

    const boolOpt = x('boolean?')

    expect(boolOpt.parse(boolInvSubj).data).toBe(undefined)
    expect(boolOpt.parse(boolInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean'
    expect(boolOpt.validate(boolInvSubj).data).toBe(undefined)
    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean'
    expect(boolOpt.validate(boolInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type 'boolean | undefined'
    expect(boolOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type 'boolean | undefined'
    expect(boolOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: base short buffer optional/required schema parse/validate', () => {
    const bufInvSubj = 'x'
    const bufReq = x('buffer')

    expect(bufReq.parse(undefined).data).toBe(undefined)
    expect(bufReq.parse(undefined).error).toMatchObject(errP)

    expect(bufReq.parse(null).data).toBe(undefined)
    expect(bufReq.parse(null).error).toMatchObject(errP)

    expect(bufReq.parse(bufInvSubj).data).toBe(undefined)
    expect(bufReq.parse(bufInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'Buffer'
    expect(bufReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type 'Buffer'
    expect(bufReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'string' is not assignable to parameter of type 'Buffer'
    expect(bufReq.validate(bufInvSubj).data).toBe(undefined)
    // @ts-expect-error 'string' is not assignable to parameter of type 'Buffer'
    expect(bufReq.validate(bufInvSubj).error).toMatchObject(errV)

    const bufOpt = x('buffer?')

    expect(bufOpt.parse(bufInvSubj).data).toBe(undefined)
    expect(bufOpt.parse(bufInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'string' is not assignable to parameter of type 'Buffer'
    expect(bufOpt.validate(bufInvSubj).data).toBe(undefined)
    // @ts-expect-error 'string' is not assignable to parameter of type 'Buffer'
    expect(bufOpt.validate(bufInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type 'Buffer | undefined'
    expect(bufOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type 'Buffer | undefined'
    expect(bufOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: base detailed string optional/required schema parse/validate', () => {
    const strInvSubj = 0
    const strReq = x({ type: 'string' })

    expect(strReq.parse(undefined).data).toBe(undefined)
    expect(strReq.parse(undefined).error).toMatchObject(errP)

    expect(strReq.parse(null).data).toBe(undefined)
    expect(strReq.parse(null).error).toMatchObject(errP)

    expect(strReq.parse(strInvSubj).data).toBe(undefined)
    expect(strReq.parse(strInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'string'
    expect(strReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type 'string'
    expect(strReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(strReq.validate(strInvSubj).data).toBe(undefined)
    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(strReq.validate(strInvSubj).error).toMatchObject(errV)

    const strOpt = x({ type: 'string', optional: true })

    expect(strOpt.parse(strInvSubj).data).toBe(undefined)
    expect(strOpt.parse(strInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(strOpt.validate(strInvSubj).data).toBe(undefined)
    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(strOpt.validate(strInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type 'string | undefined'
    expect(strOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type 'string | undefined'
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

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'number'
    expect(numReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type 'number'
    expect(numReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(numReq.validate(numInvSubj).data).toBe(undefined)
    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(numReq.validate(numInvSubj).error).toMatchObject(errV)

    const numOpt = x({ type: 'number', optional: true })

    expect(numOpt.parse(numInvSubj).data).toBe(undefined)
    expect(numOpt.parse(numInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(numOpt.validate(numInvSubj).data).toBe(undefined)
    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(numOpt.validate(numInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type 'number | undefined'
    expect(numOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type 'number | undefined'
    expect(numOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: base detailed boolean optional/required schema parse/validate', () => {
    const boolInvSubj = Buffer.from('x')
    const boolReq = x({ type: 'boolean' })

    expect(boolReq.parse(undefined).data).toBe(undefined)
    expect(boolReq.parse(undefined).error).toMatchObject(errP)

    expect(boolReq.parse(null).data).toBe(undefined)
    expect(boolReq.parse(null).error).toMatchObject(errP)

    expect(boolReq.parse(boolInvSubj).data).toBe(undefined)
    expect(boolReq.parse(boolInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'boolean'
    expect(boolReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type 'boolean'
    expect(boolReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean'
    expect(boolReq.validate(boolInvSubj).data).toBe(undefined)
    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean'
    expect(boolReq.validate(boolInvSubj).error).toMatchObject(errV)

    const boolOpt = x({ type: 'boolean', optional: true })

    expect(boolOpt.parse(boolInvSubj).data).toBe(undefined)
    expect(boolOpt.parse(boolInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean | undefined'
    expect(boolOpt.validate(boolInvSubj).data).toBe(undefined)
    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean | undefined'
    expect(boolOpt.validate(boolInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type 'boolean | undefined'
    expect(boolOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type 'boolean | undefined'
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

    // @ts-expect-error 'undefined' is not assignable to parameter of type '"x" | "y"'
    expect(strUnReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type '"x" | "y"'
    expect(strUnReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'number' is not assignable to parameter of type '"x" | "y"'
    expect(strUnReq.validate(strUnInvSubj).data).toBe(undefined)
    // @ts-expect-error 'number' is not assignable to parameter of type '"x" | "y"'
    expect(strUnReq.validate(strUnInvSubj).error).toMatchObject(errV)

    const strUnOpt = x({ type: 'stringUnion', of: unOf, optional: true })

    expect(strUnOpt.parse(strUnInvSubj).data).toBe(undefined)
    expect(strUnOpt.parse(strUnInvSubj).error).toMatchObject(errP)

    // @ts-expect-error '0' is not assignable to parameter of type '"x" | "y" | undefined'
    expect(strUnOpt.validate(strUnInvSubj).data).toBe(undefined)
    // @ts-expect-error '0' is not assignable to parameter of type '"x" | "y" | undefined'
    expect(strUnOpt.validate(strUnInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type '"x" | "y" | undefined'
    expect(strUnOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type '"x" | "y" | undefined'
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

    // @ts-expect-error 'undefined' is not assignable to parameter of type '0 | 1'
    expect(numUnReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type '0 | 1'
    expect(numUnReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error '"x"' is not assignable to parameter of type '0 | 1'
    expect(numUnReq.validate(numUnInvSubj).data).toBe(undefined)
    // @ts-expect-error '"x"' is not assignable to parameter of type '0 | 1'
    expect(numUnReq.validate(numUnInvSubj).error).toMatchObject(errV)

    const numUnOpt = x({ type: 'numberUnion', of: unOf, optional: true })

    expect(numUnOpt.parse(numUnInvSubj).data).toBe(undefined)
    expect(numUnOpt.parse(numUnInvSubj).error).toMatchObject(errP)

    // @ts-expect-error '"x"' is not assignable to parameter of type '0 | 1 | undefined'
    expect(numUnOpt.validate(numUnInvSubj).data).toBe(undefined)
    // @ts-expect-error '"x"' is not assignable to parameter of type '0 | 1 | undefined'
    expect(numUnOpt.validate(numUnInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type '0 | 1 | undefined'
    expect(numUnOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type '0 | 1 | undefined'
    expect(numUnOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: compound array optional/required schema parse/validate', () => {
    const arrInvSubj = 'x'
    const arrReq = x({ type: 'array', of: 'string' })

    expect(arrReq.parse(undefined).data).toBe(undefined)
    expect(arrReq.parse(undefined).error).toMatchObject(errP)

    expect(arrReq.parse(null).data).toBe(undefined)
    expect(arrReq.parse(null).error).toMatchObject(errP)

    expect(arrReq.parse(arrInvSubj).data).toBe(undefined)
    expect(arrReq.parse(arrInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'string[]'
    expect(arrReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type 'string[]'
    expect(arrReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'string' is not assignable to parameter of type 'string[]'
    expect(arrReq.validate(arrInvSubj).data).toBe(undefined)
    // @ts-expect-error 'string' is not assignable to parameter of type 'string[]'
    expect(arrReq.validate(arrInvSubj).error).toMatchObject(errV)

    const arrOpt = x({ type: 'array', of: 'string', optional: true })

    expect(arrOpt.parse(arrInvSubj).data).toBe(undefined)
    expect(arrOpt.parse(arrInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'string' is not assignable to parameter of type 'string[]'
    expect(arrOpt.validate(arrInvSubj).data).toBe(undefined)
    // @ts-expect-error 'string' is not assignable to parameter of type 'string[]'
    expect(arrOpt.validate(arrInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type 'string[] | undefined'
    expect(arrOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type 'string[] | undefined'
    expect(arrOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: compound object optional/required schema parse/validate', () => {
    const objInvSubj = 'x'
    const objReq = x({ type: 'object', of: { x: 'string' } })

    expect(objReq.parse(undefined).data).toBe(undefined)
    expect(objReq.parse(undefined).error).toMatchObject(errP)

    expect(objReq.parse(null).data).toBe(undefined)
    expect(objReq.parse(null).error).toMatchObject(errP)

    expect(objReq.parse(objInvSubj).data).toBe(undefined)
    expect(objReq.parse(objInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'undefined' is not assignable to parameter of type '{ x: string }'
    expect(objReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type '{ x: string }'
    expect(objReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'string' is not assignable to parameter of type '{ x: string }'
    expect(objReq.validate(objInvSubj).data).toBe(undefined)
    // @ts-expect-error 'string' is not assignable to parameter of type '{ x: string }'
    expect(objReq.validate(objInvSubj).error).toMatchObject(errV)

    const objOpt = x({ type: 'object', of: { x: 'string' }, optional: true })

    expect(objOpt.parse(objInvSubj).data).toBe(undefined)
    expect(objOpt.parse(objInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'string' is not assignable to parameter of type '{ x: string }'
    expect(objOpt.validate(objInvSubj).data).toBe(undefined)
    // @ts-expect-error 'string' is not assignable to parameter of type '{ x: string }'
    expect(objOpt.validate(objInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type '{ x: string } | undefined'
    expect(objOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type '{ x: string } | undefined'
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

    const subjDef = 'y'
    const strDef = x(string().optional().default(subjDef))

    expect(strDef.parse(subj).data).toBe(subj)
    expect(strDef.parse(subj).error).toBe(undefined)

    expect(strDef.parse(undefined).data).toBe(subjDef)
    expect(strDef.parse(undefined).error).toBe(undefined)
    expect(strDef.parse(null).data).toBe(subjDef)
    expect(strDef.parse(null).error).toBe(undefined)

    expect(strDef.validate(subj).data).toBe(subj)
    expect(strDef.validate(subj).error).toBe(undefined)

    expect(strDef.validate(undefined).data).toBe(undefined)
    expect(strDef.validate(undefined).error).toBe(undefined)
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

    const subjDef = 1
    const numDef = x(number().optional().default(subjDef))

    expect(numDef.parse(subj).data).toBe(subj)
    expect(numDef.parse(subj).error).toBe(undefined)

    expect(numDef.parse(undefined).data).toBe(subjDef)
    expect(numDef.parse(undefined).error).toBe(undefined)
    expect(numDef.parse(null).data).toBe(subjDef)
    expect(numDef.parse(null).error).toBe(undefined)

    expect(numDef.validate(subj).data).toBe(subj)
    expect(numDef.validate(subj).error).toBe(undefined)

    expect(numDef.validate(undefined).data).toBe(undefined)
    expect(numDef.validate(undefined).error).toBe(undefined)
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

    const subjDef = false
    const boolDef = x(boolean().optional().default(subjDef))

    expect(boolDef.parse(subj).data).toBe(subj)
    expect(boolDef.parse(subj).error).toBe(undefined)

    expect(boolDef.parse(undefined).data).toBe(subjDef)
    expect(boolDef.parse(undefined).error).toBe(undefined)
    expect(boolDef.parse(null).data).toBe(subjDef)
    expect(boolDef.parse(null).error).toBe(undefined)

    expect(boolDef.validate(subj).data).toBe(subj)
    expect(boolDef.validate(subj).error).toBe(undefined)

    expect(boolDef.validate(undefined).data).toBe(undefined)
    expect(boolDef.validate(undefined).error).toBe(undefined)
  })

  it('x: base buffer schema required/optional parse/validate', () => {
    const buff = x(buffer())
    const subj = Buffer.from('x')

    expect(buff.parse(subj).data).toBe(subj)
    expect(buff.parse(subj).error).toBe(undefined)

    expect(buff.validate(subj).data).toBe(subj)
    expect(buff.validate(subj).error).toBe(undefined)

    const buffOpt = x(buffer().optional())

    expect(buffOpt.parse(subj).data).toBe(subj)
    expect(buffOpt.parse(subj).error).toBe(undefined)

    expect(buffOpt.parse(undefined).data).toBe(undefined)
    expect(buffOpt.parse(undefined).error).toBe(undefined)
    expect(buffOpt.parse(null).data).toBe(undefined)
    expect(buffOpt.parse(null).error).toBe(undefined)

    expect(buffOpt.validate(subj).data).toBe(subj)
    expect(buffOpt.validate(subj).error).toBe(undefined)

    expect(buffOpt.validate(undefined).data).toBe(undefined)
    expect(buffOpt.validate(undefined).error).toBe(undefined)
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

    const subjDef = 'z'
    const strUnDef = x(
      stringUnion(...unOf)
        .optional()
        .default(subjDef)
    )

    expect(strUnDef.parse(subj).data).toBe(subj)
    expect(strUnDef.parse(subj).error).toBe(undefined)

    expect(strUnDef.parse(undefined).data).toBe(subjDef)
    expect(strUnDef.parse(undefined).error).toBe(undefined)
    expect(strUnDef.parse(null).data).toBe(subjDef)
    expect(strUnDef.parse(null).error).toBe(undefined)

    expect(strUnDef.validate(subj).data).toBe(subj)
    expect(strUnDef.validate(subj).error).toBe(undefined)

    expect(strUnDef.validate(undefined).data).toBe(undefined)
    expect(strUnDef.validate(undefined).error).toBe(undefined)
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

    const subjDef = 2
    const numUnDef = x(
      numberUnion(...unOf)
        .optional()
        .default(subjDef)
    )

    expect(numUnDef.parse(subj).data).toBe(subj)
    expect(numUnDef.parse(subj).error).toBe(undefined)

    expect(numUnDef.parse(undefined).data).toBe(subjDef)
    expect(numUnDef.parse(undefined).error).toBe(undefined)
    expect(numUnDef.parse(null).data).toBe(subjDef)
    expect(numUnDef.parse(null).error).toBe(undefined)

    expect(numUnDef.validate(subj).data).toBe(subj)
    expect(numUnDef.validate(subj).error).toBe(undefined)

    expect(numUnDef.validate(undefined).data).toBe(undefined)
    expect(numUnDef.validate(undefined).error).toBe(undefined)
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
  const errP = [{ code: PARSE_ERROR_CODE.invalidType }]
  const errV = [{ code: VALIDATE_ERROR_CODE.invalidType }]

  it('x: base string optional/required schema parse/validate', () => {
    const strInvSubj = 0
    const strReq = x(string())

    expect(strReq.parse(undefined).data).toBe(undefined)
    expect(strReq.parse(undefined).error).toMatchObject(errP)

    expect(strReq.parse(null).data).toBe(undefined)
    expect(strReq.parse(null).error).toMatchObject(errP)

    expect(strReq.parse(strInvSubj).data).toBe(undefined)
    expect(strReq.parse(strInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'string'
    expect(strReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type 'string'
    expect(strReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(strReq.validate(strInvSubj).data).toBe(undefined)
    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(strReq.validate(strInvSubj).error).toMatchObject(errV)

    const strOpt = x(string().optional())

    expect(strOpt.parse(strInvSubj).data).toBe(undefined)
    expect(strOpt.parse(strInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(strOpt.validate(strInvSubj).data).toBe(undefined)
    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(strOpt.validate(strInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type 'string | undefined'
    expect(strOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type 'string | undefined'
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

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'number'
    expect(numReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type 'number'
    expect(numReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(numReq.validate(numInvSubj).data).toBe(undefined)
    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(numReq.validate(numInvSubj).error).toMatchObject(errV)

    const numOpt = x(number().optional())

    expect(numOpt.parse(numInvSubj).data).toBe(undefined)
    expect(numOpt.parse(numInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(numOpt.validate(numInvSubj).data).toBe(undefined)
    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(numOpt.validate(numInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type 'number | undefined'
    expect(numOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type 'number | undefined'
    expect(numOpt.validate(null).error).toMatchObject(errV)
  })

  it('x: base boolean optional/required schema parse/validate', () => {
    const boolInvSubj = Buffer.from('x')
    const boolReq = x(boolean())

    expect(boolReq.parse(undefined).data).toBe(undefined)
    expect(boolReq.parse(undefined).error).toMatchObject(errP)

    expect(boolReq.parse(null).data).toBe(undefined)
    expect(boolReq.parse(null).error).toMatchObject(errP)

    expect(boolReq.parse(boolInvSubj).data).toBe(undefined)
    expect(boolReq.parse(boolInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'boolean'
    expect(boolReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type 'boolean'
    expect(boolReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean'
    expect(boolReq.validate(boolInvSubj).data).toBe(undefined)
    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean'
    expect(boolReq.validate(boolInvSubj).error).toMatchObject(errV)

    const boolOpt = x(boolean().optional())

    expect(boolOpt.parse(boolInvSubj).data).toBe(undefined)
    expect(boolOpt.parse(boolInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean | undefined'
    expect(boolOpt.validate(boolInvSubj).data).toBe(undefined)
    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean | undefined'
    expect(boolOpt.validate(boolInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type 'boolean | undefined'
    expect(boolOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type 'boolean | undefined'
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

    // @ts-expect-error 'undefined' is not assignable to parameter of type '"x" | "y"'
    expect(strUnReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type '"x" | "y"'
    expect(strUnReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'number' is not assignable to parameter of type '"x" | "y"'
    expect(strUnReq.validate(strUnInvSubj).data).toBe(undefined)
    // @ts-expect-error 'number' is not assignable to parameter of type '"x" | "y"'
    expect(strUnReq.validate(strUnInvSubj).error).toMatchObject(errV)

    const strUnOpt = x({ type: 'stringUnion', of: unOf, optional: true })

    expect(strUnOpt.parse(strUnInvSubj).data).toBe(undefined)
    expect(strUnOpt.parse(strUnInvSubj).error).toMatchObject(errP)

    // @ts-expect-error '0' is not assignable to parameter of type '"x" | "y" | undefined'
    expect(strUnOpt.validate(strUnInvSubj).data).toBe(undefined)
    // @ts-expect-error '0' is not assignable to parameter of type '"x" | "y" | undefined'
    expect(strUnOpt.validate(strUnInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type '"x" | "y" | undefined'
    expect(strUnOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type '"x" | "y" | undefined'
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

    // @ts-expect-error 'undefined' is not assignable to parameter of type '0 | 1'
    expect(numUnReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type '0 | 1'
    expect(numUnReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error '"x"' is not assignable to parameter of type '0 | 1'
    expect(numUnReq.validate(numUnInvSubj).data).toBe(undefined)
    // @ts-expect-error '"x"' is not assignable to parameter of type '0 | 1'
    expect(numUnReq.validate(numUnInvSubj).error).toMatchObject(errV)

    const numUnOpt = x(numberUnion(...unOf).optional())

    expect(numUnOpt.parse(numUnInvSubj).data).toBe(undefined)
    expect(numUnOpt.parse(numUnInvSubj).error).toMatchObject(errP)

    // @ts-expect-error '"x"' is not assignable to parameter of type '0 | 1 | undefined'
    expect(numUnOpt.validate(numUnInvSubj).data).toBe(undefined)
    // @ts-expect-error '"x"' is not assignable to parameter of type '0 | 1 | undefined'
    expect(numUnOpt.validate(numUnInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type '0 | 1 | undefined'
    expect(numUnOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type '0 | 1 | undefined'
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

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'string[]'
    expect(arrReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type 'string[]'
    expect(arrReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'string' is not assignable to parameter of type 'string[]'
    expect(arrReq.validate(arrInvSubj).data).toBe(undefined)
    // @ts-expect-error 'string' is not assignable to parameter of type 'string[]'
    expect(arrReq.validate(arrInvSubj).error).toMatchObject(errV)

    const arrOpt = x(array(string()).optional())

    expect(arrOpt.parse(arrInvSubj).data).toBe(undefined)
    expect(arrOpt.parse(arrInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'string' is not assignable to parameter of type 'string[]'
    expect(arrOpt.validate(arrInvSubj).data).toBe(undefined)
    // @ts-expect-error 'string' is not assignable to parameter of type 'string[]'
    expect(arrOpt.validate(arrInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type 'string[] | undefined'
    expect(arrOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type 'string[] | undefined'
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

    // @ts-expect-error 'undefined' is not assignable to parameter of type '{ x: string }'
    expect(objReq.validate(undefined).data).toBe(undefined)
    // @ts-expect-error 'undefined' is not assignable to parameter of type '{ x: string }'
    expect(objReq.validate(undefined).error).toMatchObject(errV)

    // @ts-expect-error 'string' is not assignable to parameter of type '{ x: string }'
    expect(objReq.validate(objInvSubj).data).toBe(undefined)
    // @ts-expect-error 'string' is not assignable to parameter of type '{ x: string }'
    expect(objReq.validate(objInvSubj).error).toMatchObject(errV)

    const objOpt = x(object({ x: string() }).optional())

    expect(objOpt.parse(objInvSubj).data).toBe(undefined)
    expect(objOpt.parse(objInvSubj).error).toMatchObject(errP)

    // @ts-expect-error 'string' is not assignable to parameter of type '{ x: string }'
    expect(objOpt.validate(objInvSubj).data).toBe(undefined)
    // @ts-expect-error 'string' is not assignable to parameter of type '{ x: string }'
    expect(objOpt.validate(objInvSubj).error).toMatchObject(errV)

    // @ts-expect-error 'null' is not assignable to parameter of type '{ x: string } | undefined'
    expect(objOpt.validate(null).data).toBe(undefined)
    // @ts-expect-error 'null' is not assignable to parameter of type '{ x: string } | undefined'
    expect(objOpt.validate(null).error).toMatchObject(errV)
  })
})
