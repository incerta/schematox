import { isError, isData, error, data, assertUnreachable } from '../utils/fp'
import type { EitherError } from '../utils/fp'

it('isError: positive/negative cases', () => {
  const eitherError: EitherError<'error', 'data'> = { error: 'error' }
  const eitherData: EitherError<'error', 'data'> = { data: 'data' }

  expect(isError(eitherError)).toBe(true)
  expect(isError(eitherData)).toBe(false)
})

it('isData: positive/negative cases', () => {
  const eitherError: EitherError<'error', 'data'> = { error: 'error' }
  const eitherData: EitherError<'error', 'data'> = { data: 'data' }

  expect(isData(eitherError)).toBe(false)
  expect(isData(eitherData)).toBe(true)
})

it('error: creates error object', () => {
  expect(error('x')).toEqual({ error: 'x' })
})

it('data: creates data object', () => {
  expect(data('x')).toEqual({ data: 'x' })
})

it('assertUnreachable: should throw', () => {
  // @ts-expect-error should never been called in reality
  expect(() => assertUnreachable('x')).toThrow()
})
