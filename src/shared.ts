export type SharedSchema = {
  description?: string
  size?: number /* <= bytes */
}

export type InferOptionality<T extends { optional?: boolean }, U> = T extends {
  optional: true
}
  ? U | undefined
  : U
