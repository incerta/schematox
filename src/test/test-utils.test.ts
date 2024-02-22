import { check, unknownX } from './test-utils'

it('check: type compatibility', () => {
  type A = string
  type B = string

  check<A, B>
  // @ts-expect-error always
  check<never, B>

  // We require `never` cast for the cases when B might infer `never`
  // `never` is the type that can be extended by itself only
  check<never, never>

  type C = string
  type D = number

  // @ts-expect-error C != D
  check<C, D>
})

it('check: type of declared indentifier', () => {
  const x = 'x'

  check<string>(x)
  // @ts-expect-error always
  check<never>(x)

  const y = 0

  check<number>(y)
  // @ts-expect-error always
  check<never>(y)
})

it('check: should return given value', () => {
  expect(check('x')).toStrictEqual(['x'])
  expect(check('y')).toStrictEqual(['y'])
})

it('unknownX: value has undefined type', () => {
  expect(unknownX).toBe(undefined)
})
