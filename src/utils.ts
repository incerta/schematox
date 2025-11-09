import type { ParseError, ParseSuccess, InvalidSubject } from './types/utils'

/**
 * Type equivalence check utility
 * @example tCh<TypeA, TypeB>(); tCh<TypeB, TypeA>()
 **/
export const tCh = <T, U extends T = T>(...x: T[]): U[] => x as U[]

export const error = (error: InvalidSubject[]): ParseError => ({
  success: false,
  error,
})

export const success = <T>(data: T): ParseSuccess<T> => ({
  success: true,
  data,
})
