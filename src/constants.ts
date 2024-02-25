export const PARAMS_BY_SCHEMA_TYPE = {
  string: new Set([
    'optional',
    'nullable',
    'brand',
    'description',
    'minLength',
    'maxLength',
  ] as const),
  number: new Set([
    'optional',
    'nullable',
    'brand',
    'description',
    'min',
    'max',
  ] as const),
  boolean: new Set(['optional', 'nullable', 'brand', 'description'] as const),
  literal: new Set(['optional', 'nullable', 'brand', 'description'] as const),
  object: new Set(['optional', 'nullable', 'description'] as const),
  array: new Set([
    'optional',
    'nullable',
    'description',
    'minLength',
    'maxLength',
  ] as const),
  union: new Set(['optional', 'nullable', 'description']),
} as const
