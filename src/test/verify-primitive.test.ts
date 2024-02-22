import { ERROR_CODE } from '../error'
import { verifyPrimitive } from '../verify-primitive'

import type { Schema } from '../types/compound-schema-types'

describe('Verify valid/invalid subject of "string" schema', () => {
  it('verifyPrimitive: valid subject by required schema', () => {
    const schema = { type: 'string' } as const satisfies Schema

    expect(verifyPrimitive(schema, '')).toBe(true)
    expect(verifyPrimitive(schema, 'x')).toBe(true)
  })

  it('verifyPrimitive: valid subject by optional schema', () => {
    const schema = { type: 'string', optional: true } as const satisfies Schema

    expect(verifyPrimitive(schema, undefined)).toBe(true)
    expect(verifyPrimitive(schema, 'x')).toBe(true)
  })

  it('verifyPrimitive: valid subject by nullable schema', () => {
    const schema = { type: 'string', nullable: true } as const satisfies Schema

    expect(verifyPrimitive(schema, null)).toBe(true)
    expect(verifyPrimitive(schema, 'x')).toBe(true)
  })

  it('verifyPrimitive: valid subject by optional & nullable schema', () => {
    const schema = {
      type: 'string',
      nullable: true,
      optional: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, undefined)).toBe(true)
    expect(verifyPrimitive(schema, null)).toBe(true)
    expect(verifyPrimitive(schema, 'x')).toBe(true)
  })

  it('verifyPrimitive: invalid subject required', () => {
    const schema = { type: 'string' } as const satisfies Schema

    expect(verifyPrimitive(schema, 0)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, null)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, undefined)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject optional', () => {
    const schema = { type: 'string', optional: true } as const satisfies Schema

    expect(verifyPrimitive(schema, 0)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, null)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject nullable', () => {
    const schema = { type: 'string', nullable: true } as const satisfies Schema

    expect(verifyPrimitive(schema, 0)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, undefined)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject optional & nullable', () => {
    const schema = {
      type: 'string',
      optional: true,
      nullable: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, 0)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject of "INVALID_RANGE" error code', () => {
    const schema = {
      type: 'string',
      minLength: 1,
      maxLength: 2,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, '')).toBe(ERROR_CODE.invalidRange)
    expect(verifyPrimitive(schema, 'x')).toBe(true)
    expect(verifyPrimitive(schema, 'xx')).toBe(true)
    expect(verifyPrimitive(schema, 'xxx')).toBe(ERROR_CODE.invalidRange)
  })
})

describe('Verify valid/invalid subject of "number" schema', () => {
  it('verifyPrimitive: valid subject by required schema', () => {
    const schema = { type: 'number' } as const satisfies Schema

    expect(verifyPrimitive(schema, -10_000_000_000_000)).toBe(true)
    expect(verifyPrimitive(schema, 0)).toBe(true)
    expect(verifyPrimitive(schema, 10_000_000_000_000)).toBe(true)
  })

  it('verifyPrimitive: valid subject by optional schema', () => {
    const schema = { type: 'number', optional: true } as const satisfies Schema

    expect(verifyPrimitive(schema, undefined)).toBe(true)
    expect(verifyPrimitive(schema, 0)).toBe(true)
  })

  it('verifyPrimitive: valid subject by nullable schema', () => {
    const schema = { type: 'number', nullable: true } as const satisfies Schema

    expect(verifyPrimitive(schema, null)).toBe(true)
    expect(verifyPrimitive(schema, 0)).toBe(true)
  })

  it('verifyPrimitive: valid subject by optional & nullable schema', () => {
    const schema = {
      type: 'number',
      nullable: true,
      optional: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, undefined)).toBe(true)
    expect(verifyPrimitive(schema, null)).toBe(true)
    expect(verifyPrimitive(schema, 0)).toBe(true)
  })

  it('verifyPrimitive: invalid subject required', () => {
    const schema = { type: 'number' } as const satisfies Schema

    expect(verifyPrimitive(schema, null)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, undefined)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, -Infinity)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Infinity)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, NaN)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, 'x')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject optional', () => {
    const schema = { type: 'number', optional: true } as const satisfies Schema

    expect(verifyPrimitive(schema, null)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, -Infinity)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Infinity)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, NaN)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, 'x')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject nullable', () => {
    const schema = { type: 'number', nullable: true } as const satisfies Schema

    expect(verifyPrimitive(schema, undefined)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, -Infinity)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Infinity)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, NaN)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, 'x')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject optional & nullable', () => {
    const schema = {
      type: 'number',
      optional: true,
      nullable: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, -Infinity)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Infinity)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, NaN)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, 'x')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject of "INVALID_RANGE" error code', () => {
    const schema = {
      type: 'number',
      min: -1,
      max: 1,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, -2)).toBe(ERROR_CODE.invalidRange)
    expect(verifyPrimitive(schema, -1)).toBe(true)
    expect(verifyPrimitive(schema, 0)).toBe(true)
    expect(verifyPrimitive(schema, 1)).toBe(true)
    expect(verifyPrimitive(schema, 2)).toBe(ERROR_CODE.invalidRange)
  })
})

describe('Verify valid/invalid subject of "boolean" schema', () => {
  it('verifyPrimitive: valid subject by required schema', () => {
    const schema = { type: 'boolean' } as const satisfies Schema

    expect(verifyPrimitive(schema, true)).toBe(true)
    expect(verifyPrimitive(schema, false)).toBe(true)
  })

  it('verifyPrimitive: valid subject by optional schema', () => {
    const schema = { type: 'boolean', optional: true } as const satisfies Schema

    expect(verifyPrimitive(schema, undefined)).toBe(true)
    expect(verifyPrimitive(schema, true)).toBe(true)
    expect(verifyPrimitive(schema, false)).toBe(true)
  })

  it('verifyPrimitive: valid subject by nullable schema', () => {
    const schema = { type: 'boolean', nullable: true } as const satisfies Schema

    expect(verifyPrimitive(schema, null)).toBe(true)
    expect(verifyPrimitive(schema, true)).toBe(true)
    expect(verifyPrimitive(schema, false)).toBe(true)
  })

  it('verifyPrimitive: valid subject by optional & nullable schema', () => {
    const schema = {
      type: 'boolean',
      nullable: true,
      optional: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, undefined)).toBe(true)
    expect(verifyPrimitive(schema, null)).toBe(true)
    expect(verifyPrimitive(schema, true)).toBe(true)
    expect(verifyPrimitive(schema, false)).toBe(true)
  })

  it('verifyPrimitive: invalid subject required', () => {
    const schema = { type: 'boolean' } as const satisfies Schema

    expect(verifyPrimitive(schema, null)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, undefined)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, 'x')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, 0)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject optional', () => {
    const schema = { type: 'boolean', optional: true } as const satisfies Schema

    expect(verifyPrimitive(schema, null)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, 'x')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, 0)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject nullable', () => {
    const schema = { type: 'boolean', nullable: true } as const satisfies Schema

    expect(verifyPrimitive(schema, undefined)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, 'x')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, 0)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject optional & nullable', () => {
    const schema = {
      type: 'boolean',
      optional: true,
      nullable: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, 'x')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, 0)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })
})

describe('Verify valid/invalid subject of string "literal" schema', () => {
  it('verifyPrimitive: valid subject by required schema', () => {
    const schema = { type: 'literal', of: 'x' } as const satisfies Schema

    expect(verifyPrimitive(schema, 'x')).toBe(true)
  })

  it('verifyPrimitive: valid subject by optional schema', () => {
    const schema = {
      type: 'literal',
      of: 'x',
      optional: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, undefined)).toBe(true)
    expect(verifyPrimitive(schema, 'x')).toBe(true)
  })

  it('verifyPrimitive: valid subject by nullable schema', () => {
    const schema = {
      type: 'literal',
      of: 'x',
      nullable: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, null)).toBe(true)
    expect(verifyPrimitive(schema, 'x')).toBe(true)
  })

  it('verifyPrimitive: valid subject by optional & nullable schema', () => {
    const schema = {
      type: 'literal',
      of: 'x',
      nullable: true,
      optional: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, undefined)).toBe(true)
    expect(verifyPrimitive(schema, null)).toBe(true)
    expect(verifyPrimitive(schema, 'x')).toBe(true)
  })

  it('verifyPrimitive: invalid subject required', () => {
    const schema = { type: 'literal', of: 'x' } as const satisfies Schema

    expect(verifyPrimitive(schema, null)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, undefined)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, 'y')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, 0)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject optional', () => {
    const schema = {
      type: 'literal',
      of: 'x',
      optional: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, null)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, 'y')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, 0)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject nullable', () => {
    const schema = {
      type: 'literal',
      of: 'x',
      nullable: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, undefined)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, 'y')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, 0)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject optional & nullable', () => {
    const schema = {
      type: 'literal',
      of: 'x',
      optional: true,
      nullable: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, 'y')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, 0)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })
})

describe('Verify valid/invalid subject of number "literal" schema', () => {
  it('verifyPrimitive: valid subject by required schema', () => {
    const schema = { type: 'literal', of: 0 } as const satisfies Schema

    expect(verifyPrimitive(schema, 0)).toBe(true)
  })

  it('verifyPrimitive: valid subject by optional schema', () => {
    const schema = {
      type: 'literal',
      of: 0,
      optional: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, undefined)).toBe(true)
    expect(verifyPrimitive(schema, 0)).toBe(true)
  })

  it('verifyPrimitive: valid subject by nullable schema', () => {
    const schema = {
      type: 'literal',
      of: 0,
      nullable: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, null)).toBe(true)
    expect(verifyPrimitive(schema, 0)).toBe(true)
  })

  it('verifyPrimitive: valid subject by optional & nullable schema', () => {
    const schema = {
      type: 'literal',
      of: 0,
      nullable: true,
      optional: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, undefined)).toBe(true)
    expect(verifyPrimitive(schema, null)).toBe(true)
    expect(verifyPrimitive(schema, 0)).toBe(true)
  })

  it('verifyPrimitive: invalid subject required', () => {
    const schema = { type: 'literal', of: 0 } as const satisfies Schema

    expect(verifyPrimitive(schema, null)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, undefined)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, 'y')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, 1)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject optional', () => {
    const schema = {
      type: 'literal',
      of: 0,
      optional: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, null)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, 'y')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, 1)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject nullable', () => {
    const schema = {
      type: 'literal',
      of: 0,
      nullable: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, undefined)).toBe(ERROR_CODE.invalidType)

    expect(verifyPrimitive(schema, 'y')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, 1)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })

  it('verifyPrimitive: invalid subject optional & nullable', () => {
    const schema = {
      type: 'literal',
      of: 0,
      optional: true,
      nullable: true,
    } as const satisfies Schema

    expect(verifyPrimitive(schema, 1)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, 'y')).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, true)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, false)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, /^x/)).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, {})).toBe(ERROR_CODE.invalidType)
    expect(verifyPrimitive(schema, Object)).toBe(ERROR_CODE.invalidType)
  })
})
