import type { Schema } from './types/schema.js'

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

export function coerceBigInt(subject: unknown): unknown {
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

export function coerceBoolean(subject: unknown): unknown {
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
export function coerceNumber(subject: unknown): unknown {
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

export function coerceString(subject: unknown): unknown {
  if (typeof subject === 'number' || typeof subject === 'boolean') {
    return String(subject)
  }

  if (typeof subject === 'bigint') {
    return subject.toString()
  }

  return subject
}
