/**
 * This index file is where the public API of the "SchematoX" library is defined.
 * All export members will not change their interface without a MAJOR library version update.
 * Export member interfaces can only be extended on a MINOR library version update.
 *
 * Currently, we are on MAJOR version 0, so definitions/interfaces of this public API might change,
 * but only with a MINOR version update.
 **/

import type {
  Schema,
  Con_Schema_SubjT_P,
  Con_Schema_SubjT_V,
} from './types/compound-schema-types'

/* Programmatically base schema definition */

export { string } from './programmatic-schema/string'
export { number } from './programmatic-schema/number'
export { boolean } from './programmatic-schema/boolean'
export { stringUnion } from './programmatic-schema/string-union'
export { numberUnion } from './programmatic-schema/number-union'

/* Programmatically compound schema definition */

export { array } from './programmatic-schema/array'
export { object } from './programmatic-schema/object'

/* Parser/validator/x-closure */

export { parse } from './general-schema-parser'
export { validate } from './general-schema-validator'
export { x } from './x-closure'

/* Typings */

export type { BaseSchema, Schema } from './types/compound-schema-types'

/* Utils */

export type { EitherError } from './utils/fp'
export { isError, isData, error, data } from './utils/fp'

/* XParsed infers set optional default schema value as always present */
export type XParsed<T extends { __schema: Schema } | Schema> = T extends {
  __schema: Schema
}
  ? Con_Schema_SubjT_P<T['__schema']>
  : T extends Schema
    ? Con_Schema_SubjT_P<T>
    : never

/* XValidated ignores schema default values */
export type XValidated<T extends { __schema: Schema } | Schema> = T extends {
  __schema: Schema
}
  ? Con_Schema_SubjT_V<T['__schema']>
  : T extends Schema
    ? Con_Schema_SubjT_V<T>
    : never
