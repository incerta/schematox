import { left, right } from '../utils/fp'

it('error: creates error object', () => {
  expect(left('x')).toEqual({ left: 'x' })
})

it('data: creates data object', () => {
  expect(right('x')).toEqual({ right: 'x' })
})
