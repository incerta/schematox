import type { Schema } from './types/schema.js'
import type { StandardJSONSchemaV1 } from './types/standard-json-schema.js'

type SupportedTarget = 'draft-2020-12' | 'draft-07'

const SUPPORTED_TARGETS = new Set<string>(['draft-2020-12', 'draft-07'])

/**
 * `input`/`output` on `~standard.jsonSchema` (see `struct.ts`) both call
 * this directly: schematox's static `Schema` has no separate
 * transform-pipeline step the way e.g. a Zod `.transform()` would, so
 * there's nothing for the two to diverge on — the JSON Schema for what a
 * struct accepts and what it produces is the same shape.
 **/
export function toJsonSchema(
  schema: Schema,
  target: StandardJSONSchemaV1.Target
): Record<string, unknown> {
  if (!SUPPORTED_TARGETS.has(target)) {
    throw new Error(
      `toJsonSchema: unsupported target "${target}" — only "draft-2020-12" and "draft-07" are supported`
    )
  }

  return convert(schema, target as SupportedTarget)
}

function convert(
  schema: Schema,
  target: SupportedTarget
): Record<string, unknown> {
  let node = convertCore(schema, target)

  if (schema.nullable === true) {
    node = nullify(node)
  }

  if (schema.description !== undefined) {
    node = { ...node, description: schema.description }
  }

  return node
}

function convertCore(
  schema: Schema,
  target: SupportedTarget
): Record<string, unknown> {
  switch (schema.type) {
    case 'boolean':
      return { type: 'boolean' }

    case 'unknown':
      return {}

    case 'literal':
      return { const: schema.of }

    case 'bigint':
      // No JSON value can represent a `bigint` (`JSON.stringify` itself
      // throws on one) — there's no lossy-but-honest mapping to fall back
      // to, so this is a hard unsupported case rather than a best effort.
      throw new Error(
        'toJsonSchema: "bigint" schemas cannot be represented in JSON Schema'
      )

    case 'number': {
      const node: Record<string, unknown> = { type: 'number' }

      if (schema.min !== undefined) {
        node.minimum = schema.min
      }

      if (schema.max !== undefined) {
        node.maximum = schema.max
      }

      return node
    }

    case 'string': {
      const node: Record<string, unknown> = { type: 'string' }

      if (schema.minLength !== undefined) {
        node.minLength = schema.minLength
      }

      if (schema.maxLength !== undefined) {
        node.maxLength = schema.maxLength
      }

      return node
    }

    case 'array': {
      const node: Record<string, unknown> = {
        type: 'array',
        items: convert(schema.of, target),
      }

      if (schema.minLength !== undefined) {
        node.minItems = schema.minLength
      }

      if (schema.maxLength !== undefined) {
        node.maxItems = schema.maxLength
      }

      return node
    }

    case 'object': {
      const properties: Record<string, unknown> = {}
      const required: string[] = []

      for (const key in schema.of) {
        const child = schema.of[key] as Schema

        properties[key] = convert(child, target)

        if (child.optional !== true) {
          required.push(key)
        }
      }

      const node: Record<string, unknown> = { type: 'object', properties }

      if (required.length > 0) {
        node.required = required
      }

      return node
    }

    case 'record': {
      const node: Record<string, unknown> = {
        type: 'object',
        additionalProperties: convert(schema.of, target),
      }

      if (schema.key !== undefined) {
        node.propertyNames = convert(schema.key, target)
      }

      if (schema.minLength !== undefined) {
        node.minProperties = schema.minLength
      }

      if (schema.maxLength !== undefined) {
        node.maxProperties = schema.maxLength
      }

      return node
    }

    case 'tuple': {
      const items = schema.of.map((member) => convert(member, target))

      if (target === 'draft-2020-12') {
        return {
          type: 'array',
          prefixItems: items,
          items: false,
          minItems: items.length,
          maxItems: items.length,
        }
      }

      return {
        type: 'array',
        items,
        additionalItems: false,
        minItems: items.length,
        maxItems: items.length,
      }
    }

    case 'union':
      return { anyOf: schema.of.map((member) => convert(member, target)) }
  }
}

// `null` is folded in alongside the schema's own shape rather than left as
// a bare sibling keyword, since `nullable` means "T | null", not "any of T
// AND separately null" — the two read the same to a validator, but only
// this form stays a single coherent type when a caller re-reads the node.
function nullify(node: Record<string, unknown>): Record<string, unknown> {
  if (typeof node.type === 'string') {
    return { ...node, type: [node.type, 'null'] }
  }

  if (Array.isArray(node.anyOf)) {
    return { ...node, anyOf: [...node.anyOf, { type: 'null' }] }
  }

  if (Object.keys(node).length === 0) {
    // `unknown` (`{}`) already accepts `null`
    return node
  }

  return { anyOf: [node, { type: 'null' }] }
}
