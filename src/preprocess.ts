import type {
  PreprocessFn,
  PreprocessPathEntry,
  PreprocessPathSegment,
} from './types/preprocess.js'

/**
 * Sentinel `PreprocessPathSegment` standing in for "the singular child
 * schema of an array/record" — see `PreprocessPathSegment`'s doc comment in
 * `types/preprocess.ts` for why a plain index/key can't be used here.
 **/
export const PREPROCESS_PATH_ITEM: symbol = Symbol('schematox.preprocess.item')

export type PreprocessTreeNode = {
  self?: PreprocessFn
  children?: Map<PreprocessPathSegment, PreprocessTreeNode>
}

/**
 * Converts the flat, struct-composition-friendly `{ path, fn }[]` list into
 * a tree that mirrors the schema's own shape, so a lookup during parsing is
 * a single `Map.get` per level instead of re-scanning the whole list at
 * every recursion depth.
 **/
export function buildPreprocessTree(
  entries: ReadonlyArray<PreprocessPathEntry> | undefined
): PreprocessTreeNode | undefined {
  if (entries === undefined || entries.length === 0) {
    return undefined
  }

  const root: PreprocessTreeNode = {}

  for (const { path, fn } of entries) {
    let node = root

    for (const segment of path) {
      node.children = node.children ?? new Map()

      let next = node.children.get(segment)

      if (next === undefined) {
        next = {}
        node.children.set(segment, next)
      }

      node = next
    }

    // Last entry for a given path wins, same as any other spread-applied
    // struct param (e.g. calling `.description()` twice).
    node.self = fn
  }

  return root
}

export function getPreprocessTreeChild(
  node: PreprocessTreeNode | undefined,
  segment: PreprocessPathSegment
): PreprocessTreeNode | undefined {
  return node?.children?.get(segment)
}

export function getSelfPreprocess(
  node: PreprocessTreeNode | undefined
): PreprocessFn | undefined {
  return node?.self
}
