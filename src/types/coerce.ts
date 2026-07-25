export type CustomCoercer = (subject: unknown) => unknown

/**
 * A path segment locates a custom coercer's position in the *schema* tree,
 * not the runtime subject. `object` uses the property name as-is; `tuple`/
 * `union` member schemas are positional (index). `array`/`record` have
 * exactly one child schema (`of`) applied uniformly to every element/entry
 * regardless of index/key, so there's no concrete position to express —
 * a dedicated sentinel value (`COERCER_PATH_ITEM`, in `coerce.ts`) is used
 * for that position instead. The sentinel also disambiguates "coerce every
 * item" from "coerce the array's own subject" (`path: []`), which would
 * otherwise collide if array/record simply passed a child's path through
 * unprefixed.
 **/
export type CoercerPathSegment = string | number | symbol

export type CoercerPath = ReadonlyArray<CoercerPathSegment>

export type CoercerPathEntry = {
  path: CoercerPath
  fn: CustomCoercer
}
