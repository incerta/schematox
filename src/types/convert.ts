export type ConvertFn = (subject: unknown) => unknown

/**
 * A path segment locates a converter's position in the *schema* tree, not
 * the runtime subject. `object` uses the property name as-is; `tuple`/
 * `union` member schemas are positional (index). `array`/`record` have
 * exactly one child schema (`of`) applied uniformly to every element/entry
 * regardless of index/key, so there's no concrete position to express —
 * a dedicated sentinel value (`CONVERT_PATH_ITEM`, in `convert.ts`) is used
 * for that position instead. The sentinel also disambiguates "convert every
 * item" from "convert the array's own subject" (`path: []`), which would
 * otherwise collide if array/record simply passed a child's path through
 * unprefixed.
 **/
export type ConvertPathSegment = string | number | symbol

export type ConvertPath = ReadonlyArray<ConvertPathSegment>

export type ConvertPathEntry = {
  path: ConvertPath
  fn: ConvertFn
}
