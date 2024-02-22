// Check if U extends T or the argument extends T
export const check = <T, U extends T = T>(...x: T[]): U[] => x as U[]

// FIXME: replace all `unknownX` casts with `check<T, U>` statements
export const unknownX: unknown = undefined
