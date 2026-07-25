import type {
  ConvertFn,
  ConvertPathEntry,
  ConvertPathSegment,
} from './types/convert.js'

/**
 * Sentinel `ConvertPathSegment` standing in for "the singular child schema
 * of an array/record" — see `ConvertPathSegment`'s doc comment in
 * `types/convert.ts` for why a plain index/key can't be used here.
 **/
export const CONVERT_PATH_ITEM: symbol = Symbol('schematox.convert.item')

export type ConvertTreeNode = {
  self?: ConvertFn
  children?: Map<ConvertPathSegment, ConvertTreeNode>
}

/**
 * Converts the flat, struct-composition-friendly `{ path, fn }[]` list into
 * a tree that mirrors the schema's own shape, so a lookup during parsing is
 * a single `Map.get` per level instead of re-scanning the whole list at
 * every recursion depth.
 **/
export function buildConvertTree(
  entries: ReadonlyArray<ConvertPathEntry> | undefined
): ConvertTreeNode | undefined {
  if (entries === undefined || entries.length === 0) {
    return undefined
  }

  const root: ConvertTreeNode = {}

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

export function getConvertTreeChild(
  node: ConvertTreeNode | undefined,
  segment: ConvertPathSegment
): ConvertTreeNode | undefined {
  return node?.children?.get(segment)
}

export function getSelfConvert(
  node: ConvertTreeNode | undefined
): ConvertFn | undefined {
  return node?.self
}
