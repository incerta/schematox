import { validate } from '../general-schema-validator'
import { VALIDATE_ERROR_CODE } from '../error'
import { check, unknownX } from './test-utils'

import type { Schema } from '../types/compound-schema-types'

describe('Validate BASE schema with VALID subject', () => {
  it('validate: `"string"` schema', () => {
    const schema = 'string' satisfies Schema
    const subject = 'x'

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })

  it('validate: `"string?"` schema', () => {
    const schema = 'string?' satisfies Schema
    const subject = 'x'

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })

  it('validate: `"number"` schema', () => {
    const schema = 'number' satisfies Schema
    const subject = 0

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })

  it('validate: `"number?"` schema', () => {
    const schema = 'number?' satisfies Schema
    const subject = 0

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })

  it('validate: `"boolean"` schema', () => {
    const schema = 'boolean' satisfies Schema
    const subject = true

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })

  it('validate: `"boolean?"` schema', () => {
    const schema = 'boolean?' satisfies Schema
    const subject = false

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })

  it('validate: `"buffer"` schema', () => {
    const schema = 'buffer' satisfies Schema
    const subject = Buffer.from('x')

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })

  it('validate: `"buffer?"` schema', () => {
    const schema = 'buffer?' satisfies Schema
    const subject = Buffer.from('x')

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })

  it('validate: `{ type: "string" }` schema', () => {
    const schema = { type: 'string' } satisfies Schema
    const subject = 'x'

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })

  it('validate: `{ type: "number" }` schema', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = 0

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })

  it('validate: `{ type: "boolean" }` schema', () => {
    const schema = { type: 'boolean' } satisfies Schema
    const subject = false

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })

  it('validate: `{ type: "buffer" }` schema', () => {
    const schema = { type: 'buffer' } satisfies Schema
    const subject = Buffer.from('x')

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })

  it('validate: `{ type: "stringUnion" }` schema', () => {
    const schema = { type: 'stringUnion', of: ['x', 'y'] } satisfies Schema
    const subject = 'y'

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })

  it('validate: `{ type: "numberUnion" }` schema', () => {
    const schema = { type: 'numberUnion', of: [0, 1] } satisfies Schema
    const subject = 1

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })
})

describe('Validate BASE schema with INVALID subject', () => {
  it('validate: short base schema', () => {
    const shortReqStrSchema = 'string' satisfies Schema
    const undefinedSubj = undefined

    // @ts-expect-error for the sake of testing
    expect(validate(shortReqStrSchema, undefinedSubj).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(shortReqStrSchema, undefinedSubj).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema: shortReqStrSchema,
        path: [],
      },
    ])

    const shortOptStrSchema = 'string?' satisfies Schema
    const numberSubj = 0

    // @ts-expect-error for the sake of testing
    expect(validate(shortOptStrSchema, numberSubj).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(shortOptStrSchema, numberSubj).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: numberSubj,
        schema: shortOptStrSchema,
        path: [],
      },
    ])
  })

  it('validate: base detailed schema', () => {
    const detailedReqStrSchema = { type: 'string' } satisfies Schema
    const undefinedSubj = undefined

    // @ts-expect-error for the sake of testing
    expect(validate(detailedReqStrSchema, undefinedSubj).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(detailedReqStrSchema, undefinedSubj).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema: detailedReqStrSchema,
        path: [],
      },
    ])

    const detailedOptStrSchema = {
      type: 'string',
      optional: true,
    } satisfies Schema

    const numberSubj = 0

    // @ts-expect-error for the sake of testing
    expect(validate(detailedOptStrSchema, numberSubj).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(detailedOptStrSchema, numberSubj).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: numberSubj,
        schema: detailedOptStrSchema,
        path: [],
      },
    ])
  })
})

describe('Validate OBJECT schema with VALID subject', () => {
  it('validate: nested base short schema subject', () => {
    const schema = {
      type: 'object',
      of: {
        a: 'string',
        b: 'string?',
        undefinedB: 'string?',
        c: 'number',
        d: 'number?',
        undefinedD: 'number?',
        e: 'boolean',
        f: 'boolean?',
        undefinedF: 'boolean?',
        g: 'buffer',
        h: 'buffer?',
        undefinedH: 'buffer?',
      },
    } as const satisfies Schema

    const subject = {
      a: 'x',
      b: 'y',
      c: 0,
      d: 1,
      e: true,
      f: false,
      g: Buffer.from('x'),
      h: Buffer.from('y'),
      undefinedB: undefined,
      undefinedD: undefined,
      undefinedF: undefined,
      undefinedH: undefined,
      extraKeyThatShouldBeKept: 'x',
    }

    expect(validate(schema, subject).data).toStrictEqual(subject)
    expect(validate(schema, subject).error).toStrictEqual(undefined)
  })

  it('validate: nested base deailed schema subject', () => {
    const schema = {
      type: 'object',
      of: {
        a: { type: 'string' },
        b: { type: 'string', optional: true },
        undefinedB: { type: 'string', optional: true },
        c: { type: 'number' },
        d: { type: 'number', optional: true },
        undefinedD: { type: 'number', optional: true },
        e: { type: 'boolean' },
        f: { type: 'boolean', optional: true },
        undefinedF: { type: 'boolean', optional: true },
        g: { type: 'buffer' },
        h: { type: 'buffer', optional: true },
        undefinedH: { type: 'buffer', optional: true },
        i: { type: 'stringUnion', of: ['x', 'y'] },
        j: { type: 'stringUnion', of: ['x', 'y'], optional: true },
        undefinedJ: { type: 'stringUnion', of: ['x', 'y'], optional: true },
        k: { type: 'numberUnion', of: [0, 1] },
        l: { type: 'numberUnion', of: [0, 1], optional: true },
        undefinedL: { type: 'numberUnion', of: [0, 1], optional: true },
      },
    } as const satisfies Schema

    const subject = {
      a: 'x',
      b: 'y',
      c: 0,
      d: 1,
      e: true,
      f: false,
      g: Buffer.from('x'),
      h: Buffer.from('y'),
      i: 'x',
      j: 'y',
      k: 0,
      l: 1,
      undefinedB: undefined,
      undefinedD: undefined,
      undefinedF: undefined,
      undefinedH: undefined,
      undefinedJ: undefined,
      undefinedL: undefined,
      extraKeyWhichShouldBeKept: 'x',
    } as const

    expect(validate(schema, subject).data).toStrictEqual(subject)
    expect(validate(schema, subject).error).toStrictEqual(undefined)
  })

  it('validate: nested array schema subject', () => {
    const schema = {
      type: 'object',
      of: {
        strArrReq: { type: 'array', of: 'string' },
        strArrOpt: { type: 'array', of: 'string', optional: true },
      },
    } as const satisfies Schema

    const subject = {
      strArrReq: ['x', 'y'],
      strArrOpt: undefined,
    }

    expect(validate(schema, subject).data).toStrictEqual(subject)
    expect(validate(schema, subject).error).toStrictEqual(undefined)
  })

  it('validate: can be optional by itself', () => {
    const schema = {
      type: 'object',
      of: { x: 'string' },
      optional: true,
    } as const satisfies Schema

    expect(validate(schema, undefined).data).toBe(undefined)
    expect(validate(schema, undefined).error).toBe(undefined)
  })
})

describe('Validate OBJECT schema with INVALID subject', () => {
  it('validate: required object with invalid direct subject', () => {
    const schema = {
      type: 'object',
      of: { x: 'string' },
    } as const satisfies Schema

    const undefinedSubj = undefined

    // @ts-expect-error for the sake of testing
    expect(validate(schema, undefinedSubj).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(schema, undefinedSubj).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    // @ts-expect-error for the sake of testing
    expect(validate(schema, nullSubj).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(schema, nullSubj).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const regExpSubj = /^x/

    // @ts-expect-error for the sake of testing
    expect(validate(schema, regExpSubj).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(schema, regExpSubj).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: regExpSubj,
        schema,
        path: [],
      },
    ])

    const arraySubj = [] as unknown

    // @ts-expect-error for the sake of testing
    expect(validate(schema, arraySubj).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(schema, arraySubj).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: arraySubj,
        schema,
        path: [],
      },
    ])

    const mapSubj = new Map()

    // @ts-expect-error for the sake of testing
    expect(validate(schema, mapSubj).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(schema, mapSubj).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: mapSubj,
        schema,
        path: [],
      },
    ])

    const setSubj = new Set()

    // @ts-expect-error for the sake of testing
    expect(validate(schema, setSubj).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(schema, setSubj).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: setSubj,
        schema,
        path: [],
      },
    ])
  })

  it('validate: required obejct with two invalid subjects', () => {
    const schema = {
      type: 'object',
      of: { x: 'string', y: 'string', z: 'string' },
    } as const satisfies Schema

    const firstInvalidSubjKey = 'y'
    const secondInvalidSubjKey = 'z'

    const subject = {
      x: 'xValue',
      [firstInvalidSubjKey]: undefined,
      [secondInvalidSubjKey]: undefined,
    }

    // @ts-expect-error for the sake of testing
    expect(validate(schema, subject).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(schema, subject).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: subject[firstInvalidSubjKey],
        schema: schema.of[firstInvalidSubjKey],
        path: [firstInvalidSubjKey],
      },
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: subject[secondInvalidSubjKey],
        schema: schema.of[secondInvalidSubjKey],
        path: [secondInvalidSubjKey],
      },
    ])
  })

  it('validate: required obejct with deeply nested invalid subjects', () => {
    const schema = {
      type: 'object',
      of: {
        a: {
          type: 'object',
          of: {
            b: {
              type: 'object',
              of: {
                cArr: {
                  type: 'array',
                  of: {
                    type: 'object',
                    of: {
                      dArrObj: 'string',
                    },
                  },
                },
                c: {
                  type: 'object',
                  of: {
                    d: {
                      type: 'object',
                      of: {
                        e: {
                          type: 'object',
                          of: {
                            f: {
                              type: 'object',
                              of: {
                                g: 'string',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    } as const satisfies Schema

    const invalidSubject = 0
    const subject = {
      a: {
        b: {
          cArr: [
            { dArrObj: 'x' },
            { dArrObj: 'y' },
            { dArrObj: invalidSubject },
          ],
          c: { d: { e: { f: { g: invalidSubject } } } },
        },
      },
    } as const

    // @ts-expect-error for the sake of testing
    expect(validate(schema, subject).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(schema, subject).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: 'string',
        path: ['a', 'b', 'cArr', 2, 'dArrObj'],
      },
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: 'string',
        path: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      },
    ])
  })

  it('validate: required obejct with nested array invalid subject', () => {
    const schema = {
      type: 'object',
      of: {
        x: {
          type: 'array',
          of: 'string',
        },
      },
    } as const satisfies Schema

    const invalidSubject = 0
    const subject = {
      x: ['valid', invalidSubject],
    }

    // @ts-expect-error for the sake of testing
    expect(validate(schema, subject).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(schema, subject).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: schema.of.x.of,
        path: ['x', 1],
      },
    ])
  })
})

describe('Validate ARRAY schema with VALID subject', () => {
  it('validate: required base short schema subject', () => {
    const stringArrSchema = {
      type: 'array',
      of: 'string',
    } as const satisfies Schema

    const stringSubj = ['x', 'y']

    expect(validate(stringArrSchema, stringSubj).data).toStrictEqual(stringSubj)
    expect(validate(stringArrSchema, stringSubj).error).toBe(undefined)

    const numberArrSchema = {
      type: 'array',
      of: 'number',
    } as const satisfies Schema

    const numberSubj = [0, 1]

    expect(validate(numberArrSchema, numberSubj).data).toStrictEqual(numberSubj)
    expect(validate(numberArrSchema, numberSubj).error).toBe(undefined)

    const booleanArrSchema = {
      type: 'array',
      of: 'boolean',
    } as const satisfies Schema

    const booleanSubj = [true, false]

    expect(validate(booleanArrSchema, booleanSubj).data).toStrictEqual(
      booleanSubj
    )
    expect(validate(booleanArrSchema, booleanSubj).error).toBe(undefined)

    const bufferArrSchema = {
      type: 'array',
      of: 'buffer',
    } as const satisfies Schema

    const bufferSubj = [Buffer.from('x'), Buffer.from('y')]

    expect(validate(bufferArrSchema, bufferSubj).data).toStrictEqual(bufferSubj)
    expect(validate(bufferArrSchema, bufferSubj).error).toBe(undefined)
  })

  it('validate: optional base short schema subject', () => {
    const arrWithUnd = [undefined, undefined]

    const optStrSchema = {
      type: 'array',
      of: 'string?',
    } as const satisfies Schema

    const strSubject = ['x', 'y']

    expect(validate(optStrSchema, strSubject).data).toStrictEqual(strSubject)
    expect(validate(optStrSchema, strSubject).error).toBe(undefined)
    expect(validate(optStrSchema, arrWithUnd).data).toStrictEqual(arrWithUnd)
    expect(validate(optStrSchema, arrWithUnd).error).toBe(undefined)

    const optNumSchema = {
      type: 'array',
      of: 'number?',
    } as const satisfies Schema

    const numSubject = [0, 1, 2, 3, 4]

    expect(validate(optNumSchema, numSubject).data).toStrictEqual(numSubject)
    expect(validate(optNumSchema, numSubject).error).toBe(undefined)
    expect(validate(optNumSchema, arrWithUnd).data).toStrictEqual(arrWithUnd)
    expect(validate(optNumSchema, arrWithUnd).error).toBe(undefined)

    const optBoolSchema = {
      type: 'array',
      of: 'boolean?',
    } as const satisfies Schema

    const boolSubject = [true, true, false, true]

    expect(validate(optBoolSchema, boolSubject).data).toStrictEqual(boolSubject)
    expect(validate(optBoolSchema, boolSubject).error).toBe(undefined)
    expect(validate(optBoolSchema, arrWithUnd).data).toStrictEqual(arrWithUnd)
    expect(validate(optBoolSchema, arrWithUnd).error).toBe(undefined)

    const optBuffSchema = {
      type: 'array',
      of: 'buffer?',
    } as const satisfies Schema

    const buffSubject = [Buffer.from('x'), Buffer.from('y')]

    expect(validate(optBuffSchema, buffSubject).data).toStrictEqual(buffSubject)
    expect(validate(optBuffSchema, buffSubject).error).toBe(undefined)
    expect(validate(optBuffSchema, arrWithUnd).data).toStrictEqual(arrWithUnd)
    expect(validate(optBuffSchema, arrWithUnd).error).toBe(undefined)
  })

  it('validate: required base detailed schema subject', () => {
    const strSchema = {
      type: 'array',
      of: { type: 'string' },
    } as const satisfies Schema

    const strSubj = ['x', 'y', 'x', 'y']

    expect(validate(strSchema, strSubj).data).toStrictEqual(strSubj)
    expect(validate(strSchema, strSubj).error).toBe(undefined)

    const numSchema = {
      type: 'array',
      of: { type: 'number' },
    } as const satisfies Schema

    const numSubj = [0, 1, 2, 3, 4]

    expect(validate(numSchema, numSubj).data).toStrictEqual(numSubj)
    expect(validate(numSchema, numSubj).error).toBe(undefined)

    const boolSchema = {
      type: 'array',
      of: { type: 'boolean' },
    } as const satisfies Schema

    const boolSubj = [true, true, false, true]

    expect(validate(boolSchema, boolSubj).data).toStrictEqual(boolSubj)
    expect(validate(boolSchema, boolSubj).error).toBe(undefined)

    const buffSchema = {
      type: 'array',
      of: { type: 'buffer' },
    } as const satisfies Schema

    const buffSubj = [Buffer.from('x'), Buffer.from('y')]

    expect(validate(buffSchema, buffSubj).data).toStrictEqual(buffSubj)
    expect(validate(buffSchema, buffSubj).error).toBe(undefined)

    const strUnionSchema = {
      type: 'array',
      of: {
        type: 'stringUnion',
        of: ['x', 'y'],
      },
    } as const satisfies Schema

    // TODO: describe this `as` caveat in README.md
    const strUnionSubj = ['x', 'y', 'x', 'y'] as Array<'x' | 'y'>

    expect(validate(strUnionSchema, strUnionSubj).data).toStrictEqual(
      strUnionSubj
    )
    expect(validate(strUnionSchema, strUnionSubj).error).toBe(undefined)

    const numUnionSchema = {
      type: 'array',
      of: {
        type: 'numberUnion',
        of: [0, 1],
      },
    } as const satisfies Schema

    // TODO: describe this `as` caveat in README.md
    const numUnionSubj = [0, 1, 0, 1] as Array<0 | 1>

    expect(validate(numUnionSchema, numUnionSubj).data).toStrictEqual(
      numUnionSubj
    )
    expect(validate(numUnionSchema, numUnionSubj).error).toBe(undefined)
  })

  it('validate: optional base detailed schema subject', () => {
    const arrWithUndef = [undefined, undefined]

    const strSchema = {
      type: 'array',
      of: { type: 'string', optional: true },
    } as const satisfies Schema

    const strSubj = ['x', 'y', 'x', 'y'] as Array<'x' | 'y'>

    expect(validate(strSchema, strSubj).data).toStrictEqual(strSubj)
    expect(validate(strSchema, strSubj).error).toBe(undefined)
    expect(validate(strSchema, arrWithUndef).data).toStrictEqual(arrWithUndef)
    expect(validate(strSchema, arrWithUndef).error).toBe(undefined)

    const numSchema = {
      type: 'array',
      of: { type: 'number', optional: true },
    } as const satisfies Schema

    const numSubj = [0, 1, 2, 3, 4]

    expect(validate(numSchema, numSubj).data).toStrictEqual(numSubj)
    expect(validate(numSchema, numSubj).error).toBe(undefined)
    expect(validate(numSchema, arrWithUndef).data).toStrictEqual(arrWithUndef)
    expect(validate(numSchema, arrWithUndef).error).toBe(undefined)

    const boolSchema = {
      type: 'array',
      of: { type: 'boolean', optional: true },
    } as const satisfies Schema

    const boolSubj = [true, true, false, true]

    expect(validate(boolSchema, boolSubj).data).toStrictEqual(boolSubj)
    expect(validate(boolSchema, boolSubj).error).toBe(undefined)
    expect(validate(boolSchema, arrWithUndef).data).toStrictEqual(arrWithUndef)
    expect(validate(boolSchema, arrWithUndef).error).toBe(undefined)

    const buffSchema = {
      type: 'array',
      of: { type: 'buffer', optional: true },
    } as const satisfies Schema

    const buffSubj = [Buffer.from('x'), Buffer.from('y')]

    expect(validate(buffSchema, buffSubj).data).toStrictEqual(buffSubj)
    expect(validate(buffSchema, buffSubj).error).toBe(undefined)
    expect(validate(buffSchema, arrWithUndef).data).toStrictEqual(arrWithUndef)
    expect(validate(buffSchema, arrWithUndef).error).toBe(undefined)

    const strUnionSchema = {
      type: 'array',
      of: {
        type: 'stringUnion',
        of: ['x', 'y'],
        optional: true,
      },
    } as const satisfies Schema

    const strUnionSubj = ['x', 'y', 'x', 'y'] as Array<'x' | 'y'>

    expect(validate(strUnionSchema, strUnionSubj).data).toStrictEqual(
      strUnionSubj
    )
    expect(validate(strUnionSchema, strUnionSubj).error).toBe(undefined)
    expect(validate(strUnionSchema, arrWithUndef).data).toStrictEqual(
      arrWithUndef
    )
    expect(validate(strUnionSchema, arrWithUndef).error).toBe(undefined)

    const numUnionSchema = {
      type: 'array',
      of: {
        type: 'numberUnion',
        of: [0, 1],
        optional: true,
      },
    } as const satisfies Schema

    const numUnionSubj = [0, 1, 0, 1] as Array<0 | 1>

    expect(validate(numUnionSchema, numUnionSubj).data).toStrictEqual(
      numUnionSubj
    )
    expect(validate(numUnionSchema, numUnionSubj).error).toBe(undefined)
    expect(validate(numUnionSchema, arrWithUndef).data).toStrictEqual(
      arrWithUndef
    )
    expect(validate(numUnionSchema, arrWithUndef).error).toBe(undefined)
  })

  it('validate: can be optional by itself', () => {
    const schema = {
      type: 'array',
      of: 'string',
      optional: true,
    } as const satisfies Schema

    expect(validate(schema, undefined).data).toBe(undefined)
    expect(validate(schema, undefined).error).toBe(undefined)
  })
})

describe('Validate ARRAY schema with INVALID subject', () => {
  it('validate: required array with invalid direct subject', () => {
    const schema = {
      type: 'array',
      of: 'string',
    } as const satisfies Schema

    const undefinedSubj = undefined

    // @ts-expect-error for the sake of testing
    expect(validate(schema, undefinedSubj).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(schema, undefinedSubj).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    // @ts-expect-error for the sake of testing
    expect(validate(schema, nullSubj).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(schema, nullSubj).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const stringSubj = 'x'

    // @ts-expect-error for the sake of testing
    expect(validate(schema, stringSubj).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(schema, stringSubj).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: stringSubj,
        schema,
        path: [],
      },
    ])
  })

  it('validate: optional array with invalid direct subject', () => {
    const schema = {
      type: 'array',
      of: 'string',
      optional: true,
    } as const satisfies Schema

    const strSubject = 'x'

    // @ts-expect-error for the sake of testing
    expect(validate(schema, strSubject).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(schema, strSubject).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: strSubject,
        schema,
        path: [],
      },
    ])
  })

  it('validate: required array with two invalid subject arr elements', () => {
    const schema = {
      type: 'array',
      of: 'string',
    } as const satisfies Schema

    const subject = [
      'one',
      'will-be-repleced',
      'three',
      'will-be-repleced',
      'four',
    ]

    const invalidSubject = undefined as unknown as string
    const firstInvalidIndex = 1
    const secondInvalidIndex = 3

    subject[firstInvalidIndex] = invalidSubject
    subject[secondInvalidIndex] = invalidSubject

    expect(validate(schema, subject).data).toBe(undefined)
    expect(validate(schema, subject).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: schema.of,
        path: [firstInvalidIndex],
      },
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: schema.of,
        path: [secondInvalidIndex],
      },
    ])
  })

  it('validate: required array with deeply nested invalid subjects', () => {
    const schema = {
      // 0
      type: 'array',
      of: {
        // 1
        type: 'array',
        of: {
          // 2
          type: 'array',
          of: {
            // 3
            type: 'array',
            of: {
              type: 'object',
              of: {
                x: 'string',
                y: 'boolean',
                z: {
                  type: 'array',
                  of: {
                    type: 'object',
                    of: {
                      x: 'number',
                    },
                  },
                },
              },
            },
          },
        },
      },
    } as const satisfies Schema

    const invalidSubjForStr = 1
    const invalidSubjForBool = 0
    const invalidSubjForNumb = 'x'

    const subject = [
      [
        [
          [
            {
              x: invalidSubjForStr,
              y: invalidSubjForBool,
              z: [
                { x: 0 },
                { x: invalidSubjForNumb },
                { x: 1 },
                { x: invalidSubjForNumb },
              ],
            },
          ],
        ],
      ],
    ]

    // @ts-expect-error for the sake of testing
    expect(validate(schema, subject).data).toBe(undefined)
    // @ts-expect-error for the sake of testing
    expect(validate(schema, subject).error).toStrictEqual([
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: invalidSubjForStr,
        schema: schema.of.of.of.of.of.x,
        path: [0, 0, 0, 0, 'x'],
      },
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: invalidSubjForBool,
        schema: schema.of.of.of.of.of.y,
        path: [0, 0, 0, 0, 'y'],
      },
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: invalidSubjForNumb,
        schema: schema.of.of.of.of.of.z.of.of.x,
        path: [0, 0, 0, 0, 'z', 1, 'x'],
      },
      {
        code: VALIDATE_ERROR_CODE.invalidType,
        subject: invalidSubjForNumb,
        schema: schema.of.of.of.of.of.z.of.of.x,
        path: [0, 0, 0, 0, 'z', 3, 'x'],
      },
    ])
  })
})

describe('VALIDATE flow returns schema subject reference', () => {
  it('validate: object -> array -> object -> buffer', () => {
    const schema = {
      type: 'object',
      of: {
        x: {
          type: 'array',
          of: {
            type: 'object',
            of: {
              x: 'buffer',
              y: 'buffer',
            },
          },
        },
      },
    } as const satisfies Schema

    const subject = {
      x: [
        {
          x: Buffer.from('x'),
          y: Buffer.from('y'),
        },
      ],
    }

    const { data } = validate(schema, subject)

    if (!data) {
      throw Error('Not expected')
    }

    expect(data.x === subject.x).toBe(true)
    expect(data.x[0] === subject.x[0]).toBe(true)
    expect(data.x[0]?.x === subject.x[0]?.x).toBe(true)
    expect(data.x[0]?.y === subject.x[0]?.y).toBe(true)
  })

  it('validate: array -> object -> buffer', () => {
    const schema = {
      type: 'array',
      of: {
        type: 'object',
        of: {
          x: 'buffer',
          y: 'buffer',
        },
      },
    } as const satisfies Schema

    const subject = [
      {
        x: Buffer.from('x'),
        y: Buffer.from('y'),
      },
    ]

    const { data } = validate(schema, subject)

    if (!data) {
      throw Error('Not expected')
    }

    expect(data[0] === subject[0]).toBe(true)
    expect(data[0]?.x === subject[0]?.x).toBe(true)
    expect(data[0]?.y === subject[0]?.y).toBe(true)
  })
})

describe('Check validate subject type constraints', () => {
  it('validate: base short schema', () => {
    // @ts-expect-error 'undefined' is not assignable to parameter of type 'string'
    expect(() => validate('string', undefined)).not.toThrow()
    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(() => validate('string', 0)).not.toThrow()

    expect(() => validate('string?', undefined)).not.toThrow()
    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(() => validate('string?', 0)).not.toThrow()

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'number'
    expect(() => validate('number', undefined)).not.toThrow()
    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(() => validate('number', true)).not.toThrow()

    expect(() => validate('number?', undefined)).not.toThrow()
    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(() => validate('number?', true)).not.toThrow()

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'boolean'
    expect(() => validate('boolean', undefined)).not.toThrow()
    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean'
    expect(() => validate('boolean', Buffer.from('x'))).not.toThrow()

    expect(() => validate('boolean?', undefined)).not.toThrow()
    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean'
    expect(() => validate('boolean?', Buffer.from('x'))).not.toThrow()

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'Buffer'
    expect(() => validate('buffer', undefined)).not.toThrow()
    // @ts-expect-error 'string' is not assignable to parameter of type 'Buffer'
    expect(() => validate('buffer', 'x')).not.toThrow()

    expect(() => validate('buffer?', undefined)).not.toThrow()
    // @ts-expect-error 'string' is not assignable to parameter of type 'Buffer'
    expect(() => validate('buffer?', 'x')).not.toThrow()
  })

  it('validate: base detailed schema', () => {
    // @ts-expect-error 'undefined' is not assignable to parameter of type 'string'
    expect(() => validate({ type: 'string' }, undefined)).not.toThrow()
    // @ts-expect-error 'number' is not assignable to parameter of type 'string'
    expect(() => validate({ type: 'string' }, 0)).not.toThrow()
    expect(() =>
      validate({ type: 'string', optional: true }, undefined)
    ).not.toThrow()

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'number'
    expect(() => validate({ type: 'number' }, undefined)).not.toThrow()
    // @ts-expect-error 'boolean' is not assignable to parameter of type 'number'
    expect(() => validate({ type: 'number' }, true)).not.toThrow()
    expect(() =>
      validate({ type: 'number', optional: true }, undefined)
    ).not.toThrow()

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'boolean'
    expect(() => validate({ type: 'boolean' }, undefined)).not.toThrow()
    // @ts-expect-error 'Buffer' is not assignable to parameter of type 'boolean'
    expect(() => validate({ type: 'boolean' }, Buffer.from('x'))).not.toThrow()
    expect(() =>
      validate({ type: 'boolean', optional: true }, undefined)
    ).not.toThrow()

    // @ts-expect-error 'undefined' is not assignable to parameter of type 'Buffer'
    expect(() => validate({ type: 'buffer' }, undefined)).not.toThrow()
    // @ts-expect-error 'string' is not assignable to parameter of type 'Buffer'
    expect(() => validate({ type: 'buffer' }, 'x')).not.toThrow()
    expect(() =>
      validate({ type: 'buffer', optional: true }, undefined)
    ).not.toThrow()

    expect(() =>
      // @ts-expect-error 'undefined' is not assignable to parameter of type '"x" | "y"'
      validate({ type: 'stringUnion', of: ['x', 'y'] } as const, undefined)
    ).not.toThrow()
    expect(() =>
      // @ts-expect-error '"z"' is not assignable to parameter of type '"x" | "y"'
      validate({ type: 'stringUnion', of: ['x', 'y'] } as const, 'z')
    ).not.toThrow()
    expect(() =>
      validate(
        { type: 'stringUnion', of: ['x', 'y'], optional: true } as const,
        undefined
      )
    ).not.toThrow()

    expect(() =>
      // @ts-expect-error 'undefined' is not assignable to parameter of type '0 | 1'
      validate({ type: 'numberUnion', of: [0, 1] } as const, undefined)
    ).not.toThrow()
    expect(() =>
      // @ts-expect-error '2' is not assignable to parameter of type '0 | 1'
      validate({ type: 'numberUnion', of: [0, 1] } as const, 2)
    ).not.toThrow()
    expect(() =>
      validate(
        { type: 'numberUnion', of: [0, 1], optional: true } as const,
        undefined
      )
    ).not.toThrow()
  })

  it('validate: object schema', () => {
    expect(() =>
      // @ts-expect-error 'undefined' is not '{ readonly x: string; }'
      validate({ type: 'object', of: { x: 'string' } } as const, undefined)
    ).not.toThrow()

    expect(() =>
      // @ts-expect-error 'y' does not exist in type '{ readonly x: string; }'
      validate({ type: 'object', of: { x: 'string' } } as const, { y: 'x' })
    ).not.toThrow()

    expect(() =>
      validate(
        { type: 'object', of: { x: 'string' }, optional: true } as const,
        undefined
      )
    ).not.toThrow()
  })

  it('validate: array schema', () => {
    expect(() =>
      // @ts-expect-error 'undefined' is not assignable to parameter of type 'string[]'
      validate({ type: 'array', of: 'string' }, undefined)
    ).not.toThrow()

    expect(() =>
      // @ts-expect-error 'number' is not assignable to parameter of type 'string[]'
      validate({ type: 'array', of: 'string' }, 0)
    ).not.toThrow()

    expect(() =>
      validate({ type: 'array', of: 'string', optional: true }, undefined)
    ).not.toThrow()
  })

  it('validate: object schema nested branded types', () => {
    const schema = {
      type: 'object',
      of: {
        x: { type: 'string', brand: ['key', 'value'] },
      },
    } as const satisfies Schema

    const parsed = validate(schema, { x: 'y' as string & { __key: 'value' } })

    if (parsed.error) {
      throw Error('Not expected')
    }

    check<string & { __key: 'value' }>(unknownX as typeof parsed.data.x)
  })
})
