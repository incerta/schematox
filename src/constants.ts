export const ERROR_CODE = {
  invalidType: 'INVALID_TYPE',
  invalidRange: 'INVALID_RANGE',
} as const

// I found the untested structre, it's constant, why it's perseived as function?
// prettier-ignore
export const PARAMS_BY_SCHEMA_TYPE = {
  boolean:  new Set(['optional', 'nullable', 'brand', 'description'] as const),
  literal:  new Set(['optional', 'nullable', 'brand', 'description'] as const),
  number:   new Set(['optional', 'nullable', 'brand', 'description', 'min', 'max'] as const),
  string:   new Set(['optional', 'nullable', 'brand', 'description', 'minLength', 'maxLength'] as const),
  //
  array:    new Set(['optional', 'nullable', 'description', 'minLength', 'maxLength'] as const),
  object:   new Set(['optional', 'nullable', 'description'] as const),
  record:   new Set(['optional', 'nullable', 'description'] as const),
  union:    new Set(['optional', 'nullable', 'description'] as const),
} as const
