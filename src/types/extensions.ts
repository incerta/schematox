import type { BrandSchema } from './schema'
import type { InferBrand } from './infer'

// Intersections must be applied at the very beginning
// otherwise `&` will clear incompatible union types like "null" or "undefined"
export type ExtendParams<
  Schema,
  Subject,
  T0 = ExtendBrand<Schema, Subject>,
  T1 = ExtendOptional<Schema, T0>,
  T2 = ExtendNullable<Schema, T1>,
> = T2

export type ExtendBrand<Schema, Subject> = Schema extends {
  brand: infer T
}
  ? T extends BrandSchema
    ? InferBrand<T> & Subject
    : never
  : Subject

export type ExtendOptional<Schema, Subject> = Schema extends {
  optional: true
}
  ? Subject | undefined
  : Subject

export type ExtendNullable<Schema, Subject> = Schema extends {
  nullable: true
}
  ? Subject | null
  : Subject
