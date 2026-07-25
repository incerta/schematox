export type PreprocessFn = (subject: unknown) => unknown

/**
 * A path segment locates a preprocessor's position in the *schema* tree,
 * not the runtime subject. `object` uses the property name as-is; `tuple`/
 * `union` member schemas are positional (index). `array`/`record` have
 * exactly one child schema (`of`) applied uniformly to every element/entry
 * regardless of index/key, so there's no concrete position to express —
 * a dedicated sentinel value (`PREPROCESS_PATH_ITEM`, in `preprocess.ts`) is
 * used for that position instead. The sentinel also disambiguates
 * "preprocess every item" from "preprocess the array's own subject"
 * (`path: []`), which would otherwise collide if array/record simply
 * passed a child's path through unprefixed.
 **/
export type PreprocessPathSegment = string | number | symbol

export type PreprocessPath = ReadonlyArray<PreprocessPathSegment>

export type PreprocessPathEntry = {
  path: PreprocessPath
  fn: PreprocessFn
}
