import { error, data } from '../utils/fp'

it('error: creates error object', () => {
  expect(error('x')).toEqual({ error: 'x' })
})

it('data: creates data object', () => {
  expect(data('x')).toEqual({ data: 'x' })
})
