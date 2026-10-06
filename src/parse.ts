import { ERROR_CODE } from './constants.js'
import { getCoerceFn } from './coerce.js'
import {
  getPreprocessTreeChild,
  getSelfPreprocess,
  PREPROCESS_PATH_ITEM,
} from './preprocess.js'
import { assignOwnProperty, error, success } from './utils.js'

import type { PreprocessTreeNode } from './preprocess.js'
import type { InferSchema } from './types/infer.js'
import type {
  ErrorCode,
  ErrorPath,
  InvalidSubject,
  ParseOptions,
  ParseResult,
} from './types/utils.js'

import type {
  Schema,
  //
  ArraySchema,
  ObjectSchema,
  RecordSchema,
  TupleSchema,
  UnionSchema,
  //
  BigIntSchema,
  LiteralSchema,
  NumberSchema,
  StringSchema,
} from './types/schema.js'

export function parse<T extends Schema>(
  schema: T,
  subject: unknown,
  options?: ParseOptions
): ParseResult<InferSchema<T>>

export function parse(
  schema: Schema,
  subject: unknown,
  options?: ParseOptions
): ParseResult<unknown> {
  return runPlan(getPlan(schema, options?.coerce === true), subject)
}

/**
 * Not part of the public `index.ts` surface. `struct.ts` is the only
 * caller, once per struct, with the tree built from the flat
 * `{ path, fn }[]` list a struct accumulates from its own and its composed
 * children's `.preprocess()` calls — there's no public, schema-only
 * equivalent, since a preprocessor's position is only meaningful relative
 * to a specific struct's composition.
 *
 * The struct's plans are built on its first parse and held here rather than
 * cached by schema reference: the same schema object may be composed into
 * other structs with different preprocessors, or none.
 **/
export function makeStructParser(
  schema: Schema,
  preprocessTree: PreprocessTreeNode | undefined
): (
  subject: unknown,
  options: ParseOptions | undefined
) => ParseResult<unknown> {
  let plan: Plan | undefined
  let coercePlan: Plan | undefined

  return (subject, options) => {
    if (options?.coerce === true) {
      coercePlan = coercePlan ?? getRootPlan(schema, true, preprocessTree)
      return runPlan(coercePlan, subject)
    }

    plan = plan ?? getRootPlan(schema, false, preprocessTree)
    return runPlan(plan, subject)
  }
}

function getRootPlan(
  schema: Schema,
  coerce: boolean,
  preprocessTree: PreprocessTreeNode | undefined
): Plan {
  return preprocessTree === undefined
    ? getPlan(schema, coerce)
    : buildPlan(schema, coerce, preprocessTree)
}

/**
 * A schema compiled into closures, once: per call it neither re-validates
 * the schema nor re-reads its constraints, and it allocates no result
 * wrapper per node. It returns the parsed value, or `FAIL` after pushing
 * its errors to `issues`. `path` is pushed/popped in place and copied only
 * into an error.
 **/
type Plan = (
  subject: unknown,
  path: ErrorPath,
  issues: InvalidSubject[]
) => unknown

const FAIL: unique symbol = Symbol('schematox.fail')

// Plans are cached by schema object identity, so a schema is never written
// to and its plan is collected with it. Schemas are treated as immutable:
// mutating one after its first parse isn't picked up. Coercion is part of
// a plan, so each flag value has its own cache.
const PLAN_CACHE = new WeakMap<object, Plan>()
const COERCE_PLAN_CACHE = new WeakMap<object, Plan>()

function runPlan(plan: Plan, subject: unknown): ParseResult<unknown> {
  const issues: InvalidSubject[] = []
  const parsed = plan(subject, [], issues)

  return parsed === FAIL ? error(issues) : success(parsed)
}

function getPlan(schema: unknown, coerce: boolean): Plan {
  // Schemas are plain data and may come from an untyped external source
  // (JSON, a database) that TypeScript's `satisfies Schema` never actually
  // checked. A non-object can't be a cache key; it's reported as
  // INVALID_SCHEMA like any other malformed schema, never thrown.
  if (typeof schema !== 'object' || schema === null) {
    return failPlan(ERROR_CODE.invalidSchema, schema as Schema)
  }

  const cache = coerce ? COERCE_PLAN_CACHE : PLAN_CACHE
  let plan = cache.get(schema)

  if (plan === undefined) {
    // A schema graph that references itself would otherwise rebuild its
    // own plan forever: the cycle resolves through this stub instead.
    let built: Plan | undefined
    cache.set(schema, (subject, path, issues) => built!(subject, path, issues))
    built = buildPlan(schema as Schema, coerce, undefined)
    cache.set(schema, built)
    plan = built
  }

  return plan
}

/**
 * Positions without a preprocessor share the cached plan of their schema;
 * only the path down to a preprocessor gets plans of its own.
 **/
function getChildPlan(
  schema: unknown,
  coerce: boolean,
  preprocessNode: PreprocessTreeNode | undefined
): Plan {
  // A malformed (non-object) schema is reported before any preprocessor
  // would run, so it never needs a plan of its own
  return preprocessNode === undefined ||
    typeof schema !== 'object' ||
    schema === null
    ? getPlan(schema, coerce)
    : buildPlan(schema as Schema, coerce, preprocessNode)
}

// Recursion depth follows the static schema's nesting, never the subject's
// (barring a self-referencing schema graph), so untrusted input can't
// drive stack depth.
function buildPlan(
  schema: Schema,
  coerce: boolean,
  preprocessNode: PreprocessTreeNode | undefined
): Plan {
  const typePlan = buildTypePlan(schema, coerce, preprocessNode)

  if (typePlan === undefined) {
    return failPlan(ERROR_CODE.invalidSchema, schema)
  }

  let plan = typePlan

  // Applied in this order: `optional`/`nullable` short-circuit first, then
  // the struct's own preprocessor, then the built-in coercion table. A
  // declared `.preprocess()` runs regardless of `coerce`: it's an explicit
  // per-position opt-in, like `.brand()`/`.min()`; `coerce` is a blanket,
  // call-site opt-in.
  const coerceFn = coerce ? getCoerceFn(schema.type) : undefined

  if (coerceFn !== undefined) {
    const inner = plan
    plan = (subject, path, issues) => inner(coerceFn(subject), path, issues)
  }

  const preprocessFn = getSelfPreprocess(preprocessNode)

  if (preprocessFn !== undefined) {
    const inner = plan
    plan = (subject, path, issues) => inner(preprocessFn(subject), path, issues)
  }

  const optional = schema.optional === true
  const nullable = schema.nullable === true

  if (optional || nullable) {
    const inner = plan
    plan = (subject, path, issues) => {
      if (optional && subject === undefined) {
        return undefined
      }

      if (nullable && subject === null) {
        return null
      }

      return inner(subject, path, issues)
    }
  }

  return plan
}

function buildTypePlan(
  schema: Schema,
  coerce: boolean,
  preprocessNode: PreprocessTreeNode | undefined
): Plan | undefined {
  switch (schema.type) {
    case 'bigint':
      return buildBigIntPlan(schema)
    case 'boolean':
      return (subject, path, issues) =>
        typeof subject === 'boolean'
          ? subject
          : fail(issues, ERROR_CODE.invalidType, path, schema)
    case 'literal':
      return buildLiteralPlan(schema)
    case 'number':
      return buildNumberPlan(schema)
    case 'string':
      return buildStringPlan(schema)
    case 'unknown':
      return (subject) => subject
    case 'array':
      return buildArrayPlan(schema, coerce, preprocessNode)
    case 'object':
      return buildObjectPlan(schema, coerce, preprocessNode)
    case 'record':
      return buildRecordPlan(schema, coerce, preprocessNode)
    case 'tuple':
      return buildTuplePlan(schema, coerce, preprocessNode)
    case 'union':
      return buildUnionPlan(schema, coerce, preprocessNode)
    default:
      return undefined
  }
}

function fail(
  issues: InvalidSubject[],
  code: ErrorCode,
  path: ErrorPath,
  schema: Schema
): typeof FAIL {
  issues.push({ code, path: [...path], schema })
  return FAIL
}

function failPlan(code: ErrorCode, schema: Schema): Plan {
  return (_subject, path, issues) => fail(issues, code, path, schema)
}

/**
 * A constraint the schema declares with the wrong type. It's reported as
 * INVALID_SCHEMA at the point the constraint would have been checked, so a
 * subject of the wrong type still gets INVALID_TYPE first.
 **/
const MALFORMED: unique symbol = Symbol('schematox.malformed')

type Bound<T> = T | typeof MALFORMED | undefined

function getNumberBound(value: unknown): Bound<number> {
  if (value === undefined) {
    return undefined
  }

  return typeof value === 'number' ? value : MALFORMED
}

function getBigIntBound(value: unknown): Bound<bigint> {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== 'string') {
    return MALFORMED
  }

  try {
    return BigInt(value)
  } catch {
    return MALFORMED
  }
}

/** `undefined` when in bounds, otherwise the error code to report */
function checkBounds<T extends number | bigint>(
  value: T,
  min: Bound<T>,
  max: Bound<T>
): ErrorCode | undefined {
  if (min !== undefined) {
    if (min === MALFORMED) {
      return ERROR_CODE.invalidSchema
    }

    if (value < min) {
      return ERROR_CODE.invalidRange
    }
  }

  if (max !== undefined) {
    if (max === MALFORMED) {
      return ERROR_CODE.invalidSchema
    }

    if (value > max) {
      return ERROR_CODE.invalidRange
    }
  }

  return undefined
}

function buildBigIntPlan(schema: BigIntSchema): Plan {
  const min = getBigIntBound(schema.min)
  const max = getBigIntBound(schema.max)

  return (subject, path, issues) => {
    if (typeof subject !== 'bigint') {
      return fail(issues, ERROR_CODE.invalidType, path, schema)
    }

    const code = checkBounds(subject, min, max)

    return code === undefined ? subject : fail(issues, code, path, schema)
  }
}

function buildLiteralPlan(schema: LiteralSchema): Plan {
  const of = schema.of

  return (subject, path, issues) =>
    subject === of
      ? subject
      : fail(issues, ERROR_CODE.invalidType, path, schema)
}

function buildNumberPlan(schema: NumberSchema): Plan {
  const min = getNumberBound(schema.min)
  const max = getNumberBound(schema.max)

  if (min === MALFORMED || max === MALFORMED) {
    return (subject, path, issues) => {
      if (typeof subject !== 'number' || Number.isFinite(subject) === false) {
        return fail(issues, ERROR_CODE.invalidType, path, schema)
      }

      // With a malformed bound, some error is always reached
      return fail(issues, checkBounds(subject, min, max)!, path, schema)
    }
  }

  // An absent bound can't be crossed, so the check needs no branching on it
  const lower = min ?? -Infinity
  const upper = max ?? Infinity

  return (subject, path, issues) => {
    if (typeof subject !== 'number' || Number.isFinite(subject) === false) {
      return fail(issues, ERROR_CODE.invalidType, path, schema)
    }

    if (subject < lower || subject > upper) {
      return fail(issues, ERROR_CODE.invalidRange, path, schema)
    }

    return subject
  }
}

function buildStringPlan(schema: StringSchema): Plan {
  const minLength = getNumberBound(schema.minLength)
  const maxLength = getNumberBound(schema.maxLength)

  if (minLength === MALFORMED || maxLength === MALFORMED) {
    return (subject, path, issues) => {
      if (typeof subject !== 'string') {
        return fail(issues, ERROR_CODE.invalidType, path, schema)
      }

      // With a malformed bound, some error is always reached
      return fail(
        issues,
        checkBounds(subject.length, minLength, maxLength)!,
        path,
        schema
      )
    }
  }

  const lower = minLength ?? -Infinity
  const upper = maxLength ?? Infinity

  return (subject, path, issues) => {
    if (typeof subject !== 'string') {
      return fail(issues, ERROR_CODE.invalidType, path, schema)
    }

    if (subject.length < lower || subject.length > upper) {
      return fail(issues, ERROR_CODE.invalidRange, path, schema)
    }

    return subject
  }
}

/**
 * Same verdict as `Object.prototype.toString.call(subject) ===
 * '[object Object]'`, which is the definition; the common case — a plain
 * object without `Symbol.toStringTag` — skips that slower call.
 **/
function isObjectSubject(subject: unknown): subject is Record<string, unknown> {
  if (typeof subject !== 'object' || subject === null) {
    return false
  }

  if (
    Object.getPrototypeOf(subject) === Object.prototype &&
    (subject as Record<symbol, unknown>)[Symbol.toStringTag] === undefined
  ) {
    return true
  }

  return Object.prototype.toString.call(subject) === '[object Object]'
}

function hasMalformedLengthBounds(schema: {
  minLength?: unknown
  maxLength?: unknown
}): boolean {
  return (
    getNumberBound(schema.minLength) === MALFORMED ||
    getNumberBound(schema.maxLength) === MALFORMED
  )
}

function buildArrayPlan(
  schema: ArraySchema<Schema>,
  coerce: boolean,
  preprocessNode: PreprocessTreeNode | undefined
): Plan {
  const malformed = hasMalformedLengthBounds(schema)
  const minLength = schema.minLength
  const maxLength = schema.maxLength
  const itemPlan = getChildPlan(
    schema.of,
    coerce,
    getPreprocessTreeChild(preprocessNode, PREPROCESS_PATH_ITEM)
  )

  return (subject, path, issues) => {
    if (Array.isArray(subject) === false) {
      return fail(issues, ERROR_CODE.invalidType, path, schema)
    }

    if (malformed) {
      return fail(issues, ERROR_CODE.invalidSchema, path, schema)
    }

    const result: unknown[] = []
    let failed = false

    for (let i = 0; i < subject.length; i++) {
      path.push(i)
      const parsed = itemPlan(subject[i], path, issues)
      path.pop()

      if (parsed === FAIL) {
        failed = true
        continue
      }

      result.push(parsed)

      // Once the array is already too long, further elements can't change
      // that verdict — stop instead of validating an attacker-controlled
      // tail with unbounded work. Errors collected so far are preserved.
      if (maxLength !== undefined && result.length > maxLength) {
        break
      }
    }

    if (maxLength !== undefined && result.length > maxLength) {
      failed = true
      fail(issues, ERROR_CODE.invalidRange, path, schema)
    }

    if (minLength !== undefined && result.length < minLength) {
      failed = true
      fail(issues, ERROR_CODE.invalidRange, path, schema)
    }

    return failed ? FAIL : result
  }
}

function buildObjectPlan(
  schema: ObjectSchema<Record<string, Schema>>,
  coerce: boolean,
  preprocessNode: PreprocessTreeNode | undefined
): Plan {
  const keys: string[] = []
  const plans: Plan[] = []

  // The same `for...in` the schema has always been read with, done once
  for (const key in schema.of) {
    keys.push(key)
    plans.push(
      getChildPlan(
        schema.of[key],
        coerce,
        getPreprocessTreeChild(preprocessNode, key)
      )
    )
  }

  // `assignOwnProperty`'s guard is only needed if the schema declares the
  // one dangerous key, so it's decided here rather than per assignment
  const assign = keys.includes('__proto__')
    ? assignOwnProperty
    : (target: Record<string, unknown>, key: string, value: unknown) => {
        target[key] = value
      }

  return (subject, path, issues) => {
    if (isObjectSubject(subject) === false) {
      return fail(issues, ERROR_CODE.invalidType, path, schema)
    }

    const result: Record<string, unknown> = {}
    let failed = false

    // Extra keys in the subject are ignored
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!

      path.push(key)
      const parsed = plans[i]!(subject[key], path, issues)
      path.pop()

      if (parsed === FAIL) {
        failed = true
        continue
      }

      if (Object.prototype.hasOwnProperty.call(subject, key)) {
        assign(result, key, parsed)
      }
    }

    return failed ? FAIL : result
  }
}

function buildRecordPlan(
  schema: RecordSchema<Schema>,
  coerce: boolean,
  preprocessNode: PreprocessTreeNode | undefined
): Plan {
  const malformed = hasMalformedLengthBounds(schema)
  const minLength = schema.minLength
  const maxLength = schema.maxLength
  // Record keys are always plain strings (`for...in`), and there's no fixed
  // key to attach a custom preprocessor to (unlike `object`'s named
  // properties) — key coercion stays limited to the built-in string table
  // via `coerce`.
  const keyPlan =
    schema.key === undefined ? undefined : getPlan(schema.key, coerce)
  const valuePlan = getChildPlan(
    schema.of,
    coerce,
    getPreprocessTreeChild(preprocessNode, PREPROCESS_PATH_ITEM)
  )

  return (subject, path, issues) => {
    if (isObjectSubject(subject) === false) {
      return fail(issues, ERROR_CODE.invalidType, path, schema)
    }

    if (malformed) {
      return fail(issues, ERROR_CODE.invalidSchema, path, schema)
    }

    const result: Record<string, unknown> = {}
    let failed = false
    let validEntryCounter = 0

    for (const key in subject) {
      const value = subject[key]

      if (value === undefined) {
        // Undefined entry key is not included in parsed object
        continue
      }

      path.push(key)

      let keyIsValid = true

      if (keyPlan !== undefined && keyPlan(key, path, issues) === FAIL) {
        keyIsValid = false
        failed = true
      }

      const parsed = valuePlan(value, path, issues)
      path.pop()

      if (parsed === FAIL) {
        failed = true
        continue
      }

      if (!keyIsValid) {
        continue
      }

      validEntryCounter++
      assignOwnProperty(result, key, parsed)

      // Once the record already has too many entries, further ones can't
      // change that verdict — stop instead of validating an
      // attacker-controlled tail with unbounded work. Errors collected so
      // far are preserved.
      if (maxLength !== undefined && validEntryCounter > maxLength) {
        break
      }
    }

    if (maxLength !== undefined && validEntryCounter > maxLength) {
      failed = true
      fail(issues, ERROR_CODE.invalidRange, path, schema)
    }

    if (minLength !== undefined && validEntryCounter < minLength) {
      failed = true
      fail(issues, ERROR_CODE.invalidRange, path, schema)
    }

    return failed ? FAIL : result
  }
}

function buildTuplePlan(
  schema: TupleSchema<Array<Schema>>,
  coerce: boolean,
  preprocessNode: PreprocessTreeNode | undefined
): Plan {
  if (Array.isArray(schema.of) === false) {
    return failPlan(ERROR_CODE.invalidSchema, schema)
  }

  const plans = schema.of.map((member, i) =>
    getChildPlan(member, coerce, getPreprocessTreeChild(preprocessNode, i))
  )

  return (subject, path, issues) => {
    if (Array.isArray(subject) === false) {
      return fail(issues, ERROR_CODE.invalidType, path, schema)
    }

    const result: unknown[] = []
    let failed = false

    for (let i = 0; i < plans.length; i++) {
      path.push(i)
      const parsed = plans[i]!(subject[i], path, issues)
      path.pop()

      if (parsed === FAIL) {
        failed = true
        continue
      }

      result.push(parsed)
    }

    // Trailing elements beyond the declared arity are never validated, so
    // they must not be silently accepted either — unlike object()'s
    // documented "extra keys ignored", a tuple's whole point is a fixed
    // shape.
    if (subject.length > plans.length) {
      failed = true
      fail(issues, ERROR_CODE.invalidRange, path, schema)
    }

    return failed ? FAIL : result
  }
}

function buildUnionPlan(
  schema: UnionSchema<Array<Schema>>,
  coerce: boolean,
  preprocessNode: PreprocessTreeNode | undefined
): Plan {
  if (Array.isArray(schema.of) === false) {
    return failPlan(ERROR_CODE.invalidSchema, schema)
  }

  const index = getUnionIndex(schema)

  if (index === null) {
    return failPlan(ERROR_CODE.invalidSchema, schema)
  }

  const plans = schema.of.map((member, i) =>
    getChildPlan(member, coerce, getPreprocessTreeChild(preprocessNode, i))
  )

  return (subject, path, issues) => {
    // A failed member's errors are discarded by truncating back to here
    const mark = issues.length

    if (index === undefined || isObjectSubject(subject) === false) {
      for (let i = 0; i < plans.length; i++) {
        const parsed = plans[i]!(subject, path, issues)

        if (parsed !== FAIL) {
          return parsed
        }

        issues.length = mark
      }

      return fail(issues, ERROR_CODE.invalidUnion, path, schema)
    }

    // Tag-matched members go first, then members that declare none of the
    // discriminant keys (non-objects, untagged objects) — the discriminant
    // only reorders and prunes, it never makes an untagged member
    // unreachable. Members whose tag mismatches the subject's are skipped.
    // Matched members are tried key by key in priority order, then in `of`
    // order within a key, so no per-call list of matches is assembled.
    let matchedCount = 0
    let matchedIssues: InvalidSubject[] | undefined

    for (let i = 0; i < index.keys.length; i++) {
      const members = index.membersByTag[i]!.get(subject[index.keys[i]!])

      if (members === undefined) {
        continue
      }

      for (let k = 0; k < members.length; k++) {
        const parsed = plans[members[k]!]!(subject, path, issues)

        if (parsed !== FAIL) {
          return parsed
        }

        matchedCount++
        matchedIssues = matchedCount === 1 ? issues.slice(mark) : undefined
        issues.length = mark
      }
    }

    for (let i = 0; i < index.untagged.length; i++) {
      const parsed = plans[index.untagged[i]!]!(subject, path, issues)

      if (parsed !== FAIL) {
        return parsed
      }

      issues.length = mark
    }

    // A single tag-matched member is unambiguously the intended one, so its
    // own errors explain the failure better than a blanket INVALID_UNION.
    if (matchedIssues !== undefined) {
      for (const issue of matchedIssues) {
        issues.push(issue)
      }

      return FAIL
    }

    return fail(issues, ERROR_CODE.invalidUnion, path, schema)
  }
}

type MemberTag = { key: string; values: Set<unknown> }

export type UnionIndex = {
  keys: ReadonlyArray<string>
  /** Per member: the key it's tagged by and the values it accepts there. */
  tags: ReadonlyArray<MemberTag | undefined>
  /** Aligned with `keys`: tag value → indices of the members it selects. */
  membersByTag: ReadonlyArray<Map<unknown, number[]>>
  /** Members tagged by none of the keys, tried after the matched ones. */
  untagged: ReadonlyArray<number>
}

// Built once per schema object, so selecting members costs a lookup per
// discriminant key regardless of how many members the union has. Schemas
// are treated as immutable: mutating `of`/`discriminant` after the first
// parse isn't picked up. `null` caches a malformed discriminant.
const UNION_INDEX_CACHE = new WeakMap<object, UnionIndex | null>()

/**
 * `undefined` — no discriminant declared; `null` — malformed discriminant.
 * Exported for `struct.ts`, which rejects preprocessors on tags.
 **/
export function getUnionIndex(
  schema: UnionSchema<Array<Schema>>
): UnionIndex | undefined | null {
  if (schema.discriminant === undefined) {
    return undefined
  }

  let index = UNION_INDEX_CACHE.get(schema)

  if (index === undefined) {
    index = buildUnionIndex(schema)
    UNION_INDEX_CACHE.set(schema, index)
  }

  return index
}

function buildUnionIndex(
  schema: UnionSchema<Array<Schema>>
): UnionIndex | null {
  const keys = getDiscriminantKeys(schema.discriminant)

  if (keys === null || Array.isArray(schema.of) === false) {
    return null
  }

  const tags = schema.of.map((member) => getMemberTag(member, keys))
  const membersByTag = keys.map(() => new Map<unknown, number[]>())
  const untagged: number[] = []

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]

    if (tag === undefined) {
      untagged.push(i)
      continue
    }

    const members = membersByTag[keys.indexOf(tag.key)]!

    for (const value of tag.values) {
      const indices = members.get(value)

      if (indices === undefined) {
        members.set(value, [i])
      } else {
        indices.push(i)
      }
    }
  }

  return { keys, tags, membersByTag, untagged }
}

function getDiscriminantKeys(
  discriminant: unknown
): ReadonlyArray<string> | null {
  if (typeof discriminant === 'string') {
    return [discriminant]
  }

  if (
    Array.isArray(discriminant) &&
    discriminant.length > 0 &&
    discriminant.every((x) => typeof x === 'string')
  ) {
    return discriminant
  }

  return null
}

/**
 * The first discriminant key the member declares as a literal (or a union
 * of literals) along with the values it accepts there, or `undefined` if
 * the member isn't tagged by any of the keys.
 **/
function getMemberTag(
  member: Schema,
  discriminant: ReadonlyArray<string>
): MemberTag | undefined {
  if (
    typeof member !== 'object' ||
    member === null ||
    member.type !== 'object' ||
    typeof member.of !== 'object' ||
    member.of === null
  ) {
    return undefined
  }

  for (const key of discriminant) {
    if (Object.prototype.hasOwnProperty.call(member.of, key) === false) {
      continue
    }

    const values = getTagValues(member.of[key])

    if (values !== undefined) {
      return { key, values }
    }
  }

  return undefined
}

function getTagValues(schema: Schema | undefined): Set<unknown> | undefined {
  if (typeof schema !== 'object' || schema === null) {
    return undefined
  }

  let values: Set<unknown> | undefined

  if (schema.type === 'literal') {
    values = new Set([schema.of])
  } else if (
    schema.type === 'union' &&
    Array.isArray(schema.of) &&
    schema.of.length > 0
  ) {
    values = new Set()

    for (const member of schema.of) {
      const memberValues = getTagValues(member)

      if (memberValues === undefined) {
        return undefined
      }

      for (const value of memberValues) {
        values.add(value)
      }
    }
  } else {
    return undefined
  }

  if (schema.optional === true) {
    values.add(undefined)
  }

  if (schema.nullable === true) {
    values.add(null)
  }

  return values
}
