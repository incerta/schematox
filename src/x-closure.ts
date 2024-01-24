import { parse } from './general-schema-parser'
import { validate } from './general-schema-validator'

import type { Schema, Con_Schema_SubjT_V } from './types/compound-schema-types'

export function x<T extends Schema>(schemaDefinition: T | { __schema: T }) {
  const schema =
    typeof schemaDefinition === 'object' && '__schema' in schemaDefinition
      ? schemaDefinition.__schema
      : schemaDefinition

  return {
    __schema: schema,
    validate: (subject: Con_Schema_SubjT_V<typeof schema>) =>
      validate(schema, subject),
    parse: <T = unknown>(subject: T) => parse(schema, subject),
  }
}
