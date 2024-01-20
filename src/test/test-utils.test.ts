import { check, unknownX } from './test-utils'

it('check: should return given value', () => {
  expect(check('x')).toBe('x')
  expect(check('y')).toBe('y')
})

it('unknownX: value has undefined type', () => {
  expect(unknownX).toBe(undefined)
})
