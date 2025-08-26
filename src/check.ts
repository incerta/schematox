// Check if U extends T or the argument extends T
export const tCh = <T, U extends T = T>(...x: T[]): U[] => x as U[]
