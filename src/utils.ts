import type { ParseError, ParseSuccess, InvalidSubject } from './types/utils.ts'

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

/**
 * `target[key] = value` invokes Object.prototype's `__proto__` accessor
 * for that one key name, corrupting or silently dropping the assignment.
 * defineProperty always creates a plain own data property instead.
 **/
export const assignOwnProperty = (
  target: Record<string, unknown>,
  key: string,
  value: unknown
): void => {
  Object.defineProperty(target, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  })
}
