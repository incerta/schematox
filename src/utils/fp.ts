export type Error<T> = {
  left: T
  right?: never
}

export type Data<U> = {
  left?: never
  right: U
}

export type EitherError<T, U> = NonNullable<Error<T> | Data<U>>

export const left = <T>(value: T): Error<T> => ({ left: value })
export const right = <U>(value: U): Data<U> => ({ right: value })
