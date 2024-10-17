export type Left<T> = {
  left: T
  right?: never
}

export type Right<U> = {
  left?: never
  right: U
}

export type Either<T, U> = NonNullable<Left<T> | Right<U>>

export const left = <T>(value: T): Left<T> => ({ left: value })
export const right = <U>(value: U): Right<U> => ({ right: value })
