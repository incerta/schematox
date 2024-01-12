export const check = <T>(x: T): T => x
export const checkFn = <T>(x: () => T): T => x as T
export const unknownX: unknown = undefined
