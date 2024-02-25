type ExtWith_Undefined_SubjT<T, U> = T extends { optional: true }
  ? U | undefined
  : U

type ExtWith_Null_SubjT<T, U> = T extends {
  nullable: true
}
  ? U | null
  : U

type ExtWith_Brand_SubjT<T, U> = T extends {
  brand: Readonly<[infer V, infer W]>
}
  ? V extends string
    ? { [k in `__${V}`]: W } & U
    : never
  : U

// Intersections should be applied at the very beginning
// otherwise `&` will clear incompatible union types like "null" or "undefined"
export type ExtWith_SchemaParams_SubjT<
  T,
  U,
  V = ExtWith_Brand_SubjT<T, U>,
  W = ExtWith_Undefined_SubjT<T, V>,
  X = ExtWith_Null_SubjT<T, W>,
> = X
