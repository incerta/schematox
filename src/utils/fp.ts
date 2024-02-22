export type Error<T> = {
  error: T
  data?: never
}

export type Data<U> = {
  error?: never
  data: U
}

export type EitherError<T, U> = NonNullable<Error<T> | Data<U>>

export const error = <T>(value: T): Error<T> => ({ error: value })
export const data = <U>(value: U): Data<U> => ({ data: value })
