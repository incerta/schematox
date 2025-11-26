export const ERROR_CODE = {
  invalidType: 'INVALID_TYPE',
  invalidRange: 'INVALID_RANGE',
} as const

// prettier-ignore
export const PARAMS_BY_SCHEMA_TYPE = {
  boolean:  new Set(['optional', 'nullable', 'brand', 'description'] as const),
  literal:  new Set(['optional', 'nullable', 'brand', 'description'] as const),
  number:   new Set(['optional', 'nullable', 'brand', 'description', 'min', 'max'] as const),
  string:   new Set(['optional', 'nullable', 'brand', 'description', 'minLength', 'maxLength'] as const),
  //
  array:    new Set(['optional', 'nullable', 'description', 'minLength', 'maxLength'] as const),
  object:   new Set(['optional', 'nullable', 'description'] as const),
  record:   new Set(['optional', 'nullable', 'description', 'minLength', 'maxLength'] as const),
  tuple:    new Set(['optional', 'nullable', 'description'] as const),
  union:    new Set(['optional', 'nullable', 'description'] as const),
} as const

export const STANDARD_SCHEMA = {
  version: 1,
  vendor: 'schematox',
} as const
