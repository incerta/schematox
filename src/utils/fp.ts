export type Error<T> = {
  error: T
  data?: never
}

export type Data<U> = {
  error?: never
  data: U
}

export type EitherError<T, U> = NonNullable<Error<T> | Data<U>>

export const isError = <T, U>(e: EitherError<T, U>): e is Error<T> => {
  return e.error !== undefined
}

export const isData = <T, U>(e: EitherError<T, U>): e is Data<U> => {
  return e.data !== undefined
}

// TODO: rename to `errors`
export const error = <T>(value: T): Error<T> => ({ error: value })
export const data = <U>(value: U): Data<U> => ({ data: value })

export const assertUnreachable = (x: never): never => {
  throw new Error(`Didn't expect to reach this code: ${x}`)
}
