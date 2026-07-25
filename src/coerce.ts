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

function coerceNumber(subject: unknown): unknown {
  if (typeof subject === 'boolean') {
    return subject ? 1 : 0
  }

  if (typeof subject === 'bigint') {
    return Number(subject)
  }

  if (typeof subject !== 'string' || subject.trim() === '') {
    return subject
  }

  const coerced = Number(subject)

  return Number.isNaN(coerced) ? subject : coerced
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
