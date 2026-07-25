import type { Schema } from './types/schema.js'
import type {
  CoercerPathEntry,
  CoercerPathSegment,
  CustomCoercer,
} from './types/coerce.js'

/**
 * Only scalar primitives with an unambiguous target representation are
 * coercible. `literal`, `unknown`, and every compound type are deliberately
 * absent: a `literal`'s target type depends on the runtime type of `of`
 * rather than `schema.type` alone, `unknown` accepts anything already, and
 * compounds (array/object/record/tuple/union) have no single scalar
 * representation to convert from.
 **/
type CoercibleSchemaKind = 'bigint' | 'boolean' | 'number' | 'string'

export const COERCE_FN_BY_SCHEMA_KIND: Record<
  CoercibleSchemaKind,
  (subject: unknown) => unknown
> = {
  bigint: coerceBigInt,
  boolean: coerceBoolean,
  number: coerceNumber,
  string: coerceString,
}

export function getCoerceFn(schemaType: Schema['type']) {
  return COERCE_FN_BY_SCHEMA_KIND[schemaType as CoercibleSchemaKind]
}

/**
 * Every coerce function follows the same contract: given a subject that
 * doesn't already match the target's native `typeof`, try to produce one
 * that does. If the conversion is lossy, ambiguous, or throws, the
 * original subject is returned unchanged and normal type validation
 * reports the standard INVALID_TYPE error — coercion never throws and
 * never manufactures its own error.
 **/

function coerceBigInt(subject: unknown): unknown {
  if (
    typeof subject !== 'string' &&
    typeof subject !== 'number' &&
    typeof subject !== 'boolean'
  ) {
    return subject
  }

  try {
    return BigInt(subject)
  } catch {
    return subject
  }
}

function coerceBoolean(subject: unknown): unknown {
  if (subject === 'true' || subject === 1 || subject === 1n) {
    return true
  }

  if (subject === 'false' || subject === 0 || subject === 0n) {
    return false
  }

  return subject
}

/**
 * `number` can't exactly represent every integer a `bigint` or a numeric
 * string can — beyond this magnitude, `Number(x)` silently rounds to the
 * nearest representable double instead of throwing. That would make
 * coercion produce a *wrong* value rather than an unambiguous one, which
 * breaks the "lossy → left unchanged" contract above, so both bigint- and
 * string-sourced conversions are rejected once the result lands outside
 * the safe integer range.
 **/
function coerceNumber(subject: unknown): unknown {
  if (typeof subject === 'boolean') {
    return subject ? 1 : 0
  }

  if (typeof subject === 'bigint') {
    const coerced = Number(subject)

    return Number.isSafeInteger(coerced) ? coerced : subject
  }

  if (typeof subject !== 'string' || subject.trim() === '') {
    return subject
  }

  const coerced = Number(subject)

  if (Number.isNaN(coerced)) {
    return subject
  }

  if (Number.isInteger(coerced) && !Number.isSafeInteger(coerced)) {
    return subject
  }

  return coerced
}

function coerceString(subject: unknown): unknown {
  if (typeof subject === 'number' || typeof subject === 'boolean') {
    return String(subject)
  }

  if (typeof subject === 'bigint') {
    return subject.toString()
  }

  return subject
}

/**
 * Sentinel `CoercerPathSegment` standing in for "the singular child schema
 * of an array/record" — see `CoercerPathSegment`'s doc comment in
 * `types/coerce.ts` for why a plain index/key can't be used here.
 **/
export const COERCER_PATH_ITEM: symbol = Symbol('schematox.coercer.item')

export type CoercerTreeNode = {
  self?: CustomCoercer
  children?: Map<CoercerPathSegment, CoercerTreeNode>
}

/**
 * Converts the flat, struct-composition-friendly `{ path, fn }[]` list into
 * a tree that mirrors the schema's own shape, so a lookup during parsing is
 * a single `Map.get` per level instead of re-scanning the whole list at
 * every recursion depth.
 **/
export function buildCoercerTree(
  entries: ReadonlyArray<CoercerPathEntry> | undefined
): CoercerTreeNode | undefined {
  if (entries === undefined || entries.length === 0) {
    return undefined
  }

  const root: CoercerTreeNode = {}

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

export function getCoercerTreeChild(
  node: CoercerTreeNode | undefined,
  segment: CoercerPathSegment
): CoercerTreeNode | undefined {
  return node?.children?.get(segment)
}

export function getSelfCoercer(
  node: CoercerTreeNode | undefined
): CustomCoercer | undefined {
  return node?.self
}
