import { parse } from '../parse'
import { ERROR_CODE } from '../error'
import { check, unknownX } from './test-utils'

import type { Schema } from '../types/compounds'

describe('Parse PRIMITIVE schema with VALID subject', () => {
  it('parse: `{ type: "string" }` schema', () => {
    const schema = { type: 'string' } satisfies Schema
    const subject = 'x'

    expect(parse(schema, subject).right).toBe(subject)
    expect(parse(schema, subject).left).toBe(undefined)
  })

  it('parse: `{ type: "number" }` schema', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = 0

    expect(parse(schema, subject).right).toBe(subject)
    expect(parse(schema, subject).left).toBe(undefined)
  })

  it('parse: `{ type: "boolean" }` schema', () => {
    const schema = { type: 'boolean' } satisfies Schema
    const subject = false

    expect(parse(schema, subject).right).toBe(subject)
    expect(parse(schema, subject).left).toBe(undefined)
  })

  it('parse: `{ type: "literal" }` schema', () => {
    const schema = { type: 'literal', of: 'x' } satisfies Schema
    const subject = 'x'

    expect(parse(schema, subject).right).toBe(subject)
    expect(parse(schema, subject).left).toBe(undefined)
  })
})

describe('Parse PRIMITIVE schema with INVALID subject', () => {
  it('parse: base detailed schema', () => {
    const detailedReqStrSchema = { type: 'string' } satisfies Schema
    const undefinedSubj = undefined

    expect(parse(detailedReqStrSchema, undefinedSubj).right).toBe(undefined)
    expect(parse(detailedReqStrSchema, undefinedSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
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

    expect(parse(detailedOptStrSchema, numberSubj).right).toBe(undefined)
    expect(parse(detailedOptStrSchema, numberSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: numberSubj,
        schema: detailedOptStrSchema,
        path: [],
      },
    ])
  })
})

describe('Parse OBJECT schema with VALID subject', () => {
  it('parse: nested base short schema subject', () => {
    const schema = {
      type: 'object',
      of: {
        a: { type: 'string' },
        b: { type: 'string', optional: true },
        nullB: { type: 'string', nullable: true },
        undefinedB: { type: 'string', optional: true },
        c: { type: 'number' },
        d: { type: 'number', optional: true },
        nullD: { type: 'number', nullable: true },
        undefinedD: { type: 'number', optional: true },
        e: { type: 'boolean' },
        f: { type: 'boolean', optional: true },
        nullF: { type: 'boolean', nullable: true },
        undefinedF: { type: 'boolean', optional: true },
      },
    } as const satisfies Schema

    const expectedSubject = {
      a: 'x',
      b: 'y',
      c: 0,
      d: 1,
      e: true,
      f: false,

      nullB: null,
      undefinedB: undefined,
      nullD: null,
      undefinedD: undefined,
      nullF: null,
      undefinedF: undefined,
    }

    const subject = {
      ...expectedSubject,
      nullB: null,
      undefinedB: undefined,
      nullD: null,
      undefinedD: undefined,
      nullF: null,
      undefinedF: undefined,
      extraKeyWhichShouldBeIgnored: 'x',
    }

    expect(parse(schema, subject).right).toStrictEqual(expectedSubject)
    expect(parse(schema, subject).left).toStrictEqual(undefined)
  })

  it('parse: nested base deailed schema subject', () => {
    const schema = {
      type: 'object',
      of: {
        a: { type: 'string' },
        b: { type: 'string', optional: true },
        nullB: { type: 'string', nullable: true },
        undefinedB: { type: 'string', optional: true },
        c: { type: 'number' },
        d: { type: 'number', optional: true },
        nullD: { type: 'number', nullable: true },
        undefinedD: { type: 'number', optional: true },
        e: { type: 'boolean' },
        f: { type: 'boolean', optional: true },
        nullF: { type: 'boolean', nullable: true },
        undefinedF: { type: 'boolean', optional: true },
        i: { type: 'literal', of: 'x' },
        j: { type: 'literal', of: 'x', optional: true },
        nullJ: { type: 'literal', of: 'x', nullable: true },
        undefinedJ: { type: 'literal', of: 'x', optional: true },
      },
    } as const satisfies Schema

    const expectedSubject = {
      a: 'x',
      b: 'y',
      c: 0,
      d: 1,
      e: true,
      f: false,
      i: 'x',
      j: 'x',

      nullB: null,
      undefinedB: undefined,
      nullD: null,
      undefinedD: undefined,
      nullF: null,
      undefinedF: undefined,
      nullJ: null,
      undefinedJ: undefined,
    }

    const subject = {
      a: 'x',
      b: 'y',
      c: 0,
      d: 1,
      e: true,
      f: false,
      i: 'x',
      j: 'x',
      nullB: null,
      undefinedB: undefined,
      nullD: null,
      undefinedD: undefined,
      nullF: null,
      undefinedF: undefined,
      nullJ: null,
      undefinedJ: undefined,
      extraKeyWhichShouldBeIgnored: 'x',
    }

    expect(parse(schema, subject).right).toStrictEqual(expectedSubject)
    expect(parse(schema, subject).left).toStrictEqual(undefined)
  })

  it('parse: nested array schema subject', () => {
    const schema = {
      type: 'object',
      of: {
        strArrReq: { type: 'array', of: { type: 'string' } },
        strArrOpt: { type: 'array', of: { type: 'string' }, optional: true },
      },
    } as const satisfies Schema

    const subject = {
      strArrReq: ['x', 'y'],
      strArrOpt: undefined,
    }

    expect(parse(schema, subject).right).toStrictEqual({
      strArrReq: subject.strArrReq,
      strArrOpt: undefined,
    })
    expect(parse(schema, subject).left).toStrictEqual(undefined)
  })

  it('parse: can be optional by itself', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'string' } },
      optional: true,
    } as const satisfies Schema

    expect(parse(schema, undefined).right).toBe(undefined)
    expect(parse(schema, undefined).left).toBe(undefined)
  })

  it('parse: can be nullable by itself', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'string' } },
      nullable: true,
    } as const satisfies Schema

    expect(parse(schema, null).right).toBe(null)
    expect(parse(schema, null).left).toBe(undefined)
  })

  it('parse: should preserve specified undefined keys while parsing', () => {
    const schema = {
      type: 'object',
      of: {
        a: { type: 'string', optional: true },
        b: { type: 'string', optional: true },
        c: { type: 'string' },
      },
    } as const satisfies Schema

    const sample = {
      b: undefined,
      c: 'cValue',
    }

    const expected = {
      b: undefined,
      c: 'cValue',
    }

    const either = parse(schema, sample)

    if (either.left) {
      throw Error('Not expected')
    }

    expect(either.right).toStrictEqual(expected)
  })
})

describe('Parse OBJECT schema with INVALID subject', () => {
  it('parse: required object with invalid direct subject', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'string' } },
    } as const satisfies Schema

    const undefinedSubj = undefined

    expect(parse(schema, undefinedSubj).right).toBe(undefined)
    expect(parse(schema, undefinedSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(parse(schema, nullSubj).right).toBe(undefined)
    expect(parse(schema, nullSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const regExpSubj = /^x/

    expect(parse(schema, regExpSubj).right).toBe(undefined)
    expect(parse(schema, regExpSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: regExpSubj,
        schema,
        path: [],
      },
    ])

    const arraySubj = [] as unknown

    expect(parse(schema, arraySubj).right).toBe(undefined)
    expect(parse(schema, arraySubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: arraySubj,
        schema,
        path: [],
      },
    ])

    const mapSubj = new Map()

    expect(parse(schema, mapSubj).right).toBe(undefined)
    expect(parse(schema, mapSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: mapSubj,
        schema,
        path: [],
      },
    ])

    const setSubj = new Set()

    expect(parse(schema, setSubj).right).toBe(undefined)
    expect(parse(schema, setSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: setSubj,
        schema,
        path: [],
      },
    ])
  })

  it('parse: required obejct with two invalid subjects', () => {
    const schema = {
      type: 'object',
      of: {
        x: { type: 'string' },
        y: { type: 'string' },
        z: { type: 'string' },
      },
    } as const satisfies Schema

    const firstInvalidSubjKey = 'y'
    const secondInvalidSubjKey = 'z'

    const subject = {
      x: 'xValue',
      [firstInvalidSubjKey]: undefined,
      [secondInvalidSubjKey]: undefined,
    }

    expect(parse(schema, subject).right).toBe(undefined)
    expect(parse(schema, subject).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: subject[firstInvalidSubjKey],
        schema: schema.of[firstInvalidSubjKey],
        path: [firstInvalidSubjKey],
      },
      {
        code: ERROR_CODE.invalidType,
        subject: subject[secondInvalidSubjKey],
        schema: schema.of[secondInvalidSubjKey],
        path: [secondInvalidSubjKey],
      },
    ])
  })

  it('parse: required obejct with deeply nested invalid subjects', () => {
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
                      dArrObj: { type: 'string' },
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
                                g: { type: 'string' },
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
    }

    expect(parse(schema, subject).right).toBe(undefined)
    expect(parse(schema, subject).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: { type: 'string' },
        path: ['a', 'b', 'cArr', 2, 'dArrObj'],
      },
      {
        code: ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: { type: 'string' },
        path: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      },
    ])
  })

  it('parse: required obejct with nested array invalid subject', () => {
    const schema = {
      type: 'object',
      of: {
        x: {
          type: 'array',
          of: { type: 'string' },
        },
      },
    } as const satisfies Schema

    const invalidSubject = 0
    const subject = {
      x: ['valid', invalidSubject],
    }

    expect(parse(schema, subject).right).toBe(undefined)
    expect(parse(schema, subject).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: schema.of.x.of,
        path: ['x', 1],
      },
    ])
  })
})

describe('Parse RECORD schema with VALID subject', () => {
  it('parse: nested primitive', () => {
    const schema = {
      type: 'record',
      key: { type: 'string' },
      of: { type: 'string' },
    } as const satisfies Schema

    const subject = {
      x: 'a',
      y: 'c',
      z: undefined,
    }

    const expectedSubject = {
      x: 'a',
      y: 'c',
    }

    const parsed = parse(schema, subject)

    expect(parsed.right).toStrictEqual(expectedSubject)
    expect(parsed.left).toStrictEqual(undefined)
    expect(parsed.right === subject).toBe(false)
  })

  it('parse: nested nullable and optional primitive', () => {
    const schema = {
      type: 'record',
      of: { type: 'number', optional: true, nullable: true },
    } as const satisfies Schema

    const subject = {
      x: 1,
      y: null,
      z: undefined,
    }

    const expectedSubject = {
      x: 1,
      y: null,
    }

    const parsed = parse(schema, subject)

    expect(parsed.right).toStrictEqual(expectedSubject)
    expect(parsed.left).toStrictEqual(undefined)
    expect(parsed.right === subject).toBe(false)
  })

  it('parse: nested array', () => {
    const schema = {
      type: 'record',
      of: { type: 'array', of: { type: 'string' } },
    } as const satisfies Schema

    const subject = {
      x: [],
      y: ['y'],
      z: ['y', 'z'],
    }

    const parsed = parse(schema, subject)

    expect(parsed.right).toStrictEqual(subject)
    expect(parsed.left).toStrictEqual(undefined)
    expect(parsed.right === subject).toBe(false)

    if (parsed.right) {
      expect(parsed.right.x === subject.x).toBe(false)
      expect(parsed.right.y === subject.y).toBe(false)
      expect(parsed.right.z === subject.z).toBe(false)
    }
  })

  it('parse: can be optional by itself', () => {
    const schema = {
      type: 'record',
      of: { type: 'boolean' },
      optional: true,
    } as const satisfies Schema

    const parsed = parse(schema, undefined)

    expect(parsed.right).toBe(undefined)
    expect(parsed.left).toBe(undefined)
  })

  it('parse: can be nullable by itself', () => {
    const schema = {
      type: 'record',
      of: { type: 'boolean' },
      nullable: true,
    } as const satisfies Schema

    const parsed = parse(schema, null)

    expect(parsed.right).toBe(null)
    expect(parsed.left).toBe(undefined)
  })

  it('parse: should NOT preserve keys with undefined values', () => {
    const schema = {
      type: 'record',
      of: { type: 'boolean' },
    } as const satisfies Schema

    const subject = {
      x: true,
      y: undefined,
      z: false,
    }

    const expectedSubject = {
      x: true,
      z: false,
    }

    const either = parse(schema, subject)

    if (either.left) {
      throw Error('Not expected')
    }

    expect(either.right).toStrictEqual(expectedSubject)
  })
})

describe('Parse RECORD schema with INVALID subject', () => {
  it('parse: required object with invalid direct subject', () => {
    const schema = {
      type: 'record',
      of: { type: 'string' },
    } as const satisfies Schema

    const undefinedSubj = undefined

    expect(parse(schema, undefinedSubj).right).toBe(undefined)
    expect(parse(schema, undefinedSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(parse(schema, nullSubj).right).toBe(undefined)
    expect(parse(schema, nullSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const regExpSubj = /^x/

    expect(parse(schema, regExpSubj).right).toBe(undefined)
    expect(parse(schema, regExpSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: regExpSubj,
        schema,
        path: [],
      },
    ])

    const arraySubj = [] as unknown

    expect(parse(schema, arraySubj).right).toBe(undefined)
    expect(parse(schema, arraySubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: arraySubj,
        schema,
        path: [],
      },
    ])

    const mapSubj = new Map()

    expect(parse(schema, mapSubj).right).toBe(undefined)
    expect(parse(schema, mapSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: mapSubj,
        schema,
        path: [],
      },
    ])

    const setSubj = new Set()

    expect(parse(schema, setSubj).right).toBe(undefined)
    expect(parse(schema, setSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: setSubj,
        schema,
        path: [],
      },
    ])
  })

  it('parse: required record with two invalid subjects', () => {
    const schema = {
      type: 'record',
      of: { type: 'string' },
    } as const satisfies Schema

    const invalidKeyA = 'y'
    const invalidKeyB = 'z'

    const subject = {
      x: 'x',
      [invalidKeyA]: true,
      [invalidKeyB]: 0,
    }

    expect(parse(schema, subject).right).toBe(undefined)
    expect(parse(schema, subject).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: subject[invalidKeyA],
        schema: schema.of,
        path: [invalidKeyA],
      },
      {
        code: ERROR_CODE.invalidType,
        subject: subject[invalidKeyB],
        schema: schema.of,
        path: [invalidKeyB],
      },
    ])
  })

  it('parse: required record with nested array invalid subject', () => {
    const schema = {
      type: 'record',
      of: {
        type: 'array',
        of: { type: 'string' },
      },
    } as const satisfies Schema

    const invalidSubject = 0
    const subject = {
      x: ['valid', invalidSubject],
    }

    expect(parse(schema, subject).right).toBe(undefined)
    expect(parse(schema, subject).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: schema.of.of,
        path: ['x', 1],
      },
    ])
  })
})

describe('Parse ARRAY schema with VALID subject', () => {
  it('parse: required base short schema subject', () => {
    const stringArrSchema = {
      type: 'array',
      of: { type: 'string' },
    } as const satisfies Schema

    const stringSubj = ['x', 'y']

    expect(parse(stringArrSchema, stringSubj).right).toStrictEqual(stringSubj)
    expect(parse(stringArrSchema, stringSubj).left).toBe(undefined)

    const numberArrSchema = {
      type: 'array',
      of: { type: 'number' },
    } as const satisfies Schema

    const numberSubj = [0, 1]

    expect(parse(numberArrSchema, numberSubj).right).toStrictEqual(numberSubj)
    expect(parse(numberArrSchema, numberSubj).left).toBe(undefined)

    const booleanArrSchema = {
      type: 'array',
      of: { type: 'boolean' },
    } as const satisfies Schema

    const booleanSubj = [true, false]

    expect(parse(booleanArrSchema, booleanSubj).right).toStrictEqual(
      booleanSubj
    )
    expect(parse(booleanArrSchema, booleanSubj).left).toBe(undefined)
  })

  it('parse: optional base short schema subject', () => {
    const optStrSchema = {
      type: 'array',
      of: { type: 'string', optional: true },
    } as const satisfies Schema

    const strSubject = ['x', 'y']

    expect(parse(optStrSchema, strSubject).right).toStrictEqual(strSubject)
    expect(parse(optStrSchema, strSubject).left).toBe(undefined)

    const optNumSchema = {
      type: 'array',
      of: { type: 'number', optional: true },
    } as const satisfies Schema

    const numSubject = [0, 1, 2, 3, 4]

    expect(parse(optNumSchema, numSubject).right).toStrictEqual(numSubject)
    expect(parse(optNumSchema, numSubject).left).toBe(undefined)

    const optBoolSchema = {
      type: 'array',
      of: { type: 'boolean', optional: true },
    } as const satisfies Schema

    const boolSubject = [true, true, false, true]

    expect(parse(optBoolSchema, boolSubject).right).toStrictEqual(boolSubject)
    expect(parse(optBoolSchema, boolSubject).left).toBe(undefined)
  })

  it('parse: required base detailed schema subject', () => {
    const strSchema = {
      type: 'array',
      of: { type: 'string' },
    } as const satisfies Schema

    const strSubj = ['x', 'y', 'x', 'y']

    expect(parse(strSchema, strSubj).right).toStrictEqual(strSubj)
    expect(parse(strSchema, strSubj).left).toBe(undefined)

    const numSchema = {
      type: 'array',
      of: { type: 'number' },
    } as const satisfies Schema

    const numSubj = [0, 1, 2, 3, 4]

    expect(parse(numSchema, numSubj).right).toStrictEqual(numSubj)
    expect(parse(numSchema, numSubj).left).toBe(undefined)

    const boolSchema = {
      type: 'array',
      of: { type: 'boolean' },
    } as const satisfies Schema

    const boolSubj = [true, true, false, true]

    expect(parse(boolSchema, boolSubj).right).toStrictEqual(boolSubj)
    expect(parse(boolSchema, boolSubj).left).toBe(undefined)

    const strLiteralSchema = {
      type: 'array',
      of: { type: 'literal', of: 'x' },
    } as const satisfies Schema

    const strLiteralSubj = ['x', 'x']

    expect(parse(strLiteralSchema, strLiteralSubj).right).toStrictEqual(
      strLiteralSubj
    )
    expect(parse(strLiteralSchema, strLiteralSubj).left).toBe(undefined)

    const numLiteralSchema = {
      type: 'array',
      of: { type: 'literal', of: 0 },
    } as const satisfies Schema

    const numLiteralSubj = [0, 0]

    expect(parse(numLiteralSchema, numLiteralSubj).right).toStrictEqual(
      numLiteralSubj
    )
    expect(parse(numLiteralSchema, numLiteralSubj).left).toBe(undefined)
  })

  it('parse: optional base detailed schema subject', () => {
    const strSchema = {
      type: 'array',
      of: { type: 'string', optional: true },
    } as const satisfies Schema

    const strSubj = ['x', 'y', 'x', 'y']

    expect(parse(strSchema, strSubj).right).toStrictEqual(strSubj)
    expect(parse(strSchema, strSubj).left).toBe(undefined)

    const numSchema = {
      type: 'array',
      of: { type: 'number', optional: true },
    } as const satisfies Schema

    const numSubj = [0, 1, 2, 3, 4]

    expect(parse(numSchema, numSubj).right).toStrictEqual(numSubj)
    expect(parse(numSchema, numSubj).left).toBe(undefined)

    const boolSchema = {
      type: 'array',
      of: { type: 'boolean', optional: true },
    } as const satisfies Schema

    const boolSubj = [true, true, false, true]

    expect(parse(boolSchema, boolSubj).right).toStrictEqual(boolSubj)
    expect(parse(boolSchema, boolSubj).left).toBe(undefined)

    const strLiteralSchema = {
      type: 'array',
      of: {
        type: 'literal',
        of: 'x',
        optional: true,
      },
    } as const satisfies Schema

    const strLiteralSubj = ['x', 'x']
    const arrWithUndef = [undefined, undefined, undefined]

    expect(parse(strLiteralSchema, strLiteralSubj).right).toStrictEqual(
      strLiteralSubj
    )
    expect(parse(strLiteralSchema, strLiteralSubj).left).toBe(undefined)
    expect(parse(strLiteralSchema, arrWithUndef).right).toStrictEqual(
      arrWithUndef
    )
    expect(parse(strLiteralSchema, arrWithUndef).left).toBe(undefined)

    const numLiteralSchema = {
      type: 'array',
      of: {
        type: 'literal',
        of: 0,
        optional: true,
      },
    } as const satisfies Schema

    const numLiteralSubj = [0, 0]

    expect(parse(numLiteralSchema, numLiteralSubj).right).toStrictEqual(
      numLiteralSubj
    )
    expect(parse(numLiteralSchema, numLiteralSubj).left).toBe(undefined)
    expect(parse(numLiteralSchema, arrWithUndef).right).toStrictEqual(
      arrWithUndef
    )
    expect(parse(numLiteralSchema, arrWithUndef).left).toBe(undefined)
  })

  it('parse: can be optional by itself', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
      optional: true,
    } as const satisfies Schema

    expect(parse(schema, undefined).right).toBe(undefined)
    expect(parse(schema, undefined).left).toBe(undefined)
  })

  it('parse: can be nullable by itself', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
      nullable: true,
    } as const satisfies Schema

    expect(parse(schema, null).right).toBe(null)
    expect(parse(schema, null).left).toBeUndefined()
  })
})

describe('Parse ARRAY schema with INVALID subject', () => {
  it('parse: required array with invalid direct subject', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
    } as const satisfies Schema

    const undefinedSubj = undefined

    expect(parse(schema, undefinedSubj).right).toBe(undefined)
    expect(parse(schema, undefinedSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(parse(schema, nullSubj).right).toBe(undefined)
    expect(parse(schema, nullSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const stringSubj = 'x'

    expect(parse(schema, stringSubj).right).toBe(undefined)
    expect(parse(schema, stringSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: stringSubj,
        schema,
        path: [],
      },
    ])
  })

  it('parse: minLength INVALID_RANGE error', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
      minLength: 2,
    } as const satisfies Schema

    const subject = ['x']

    const parsed = parse(schema, subject)

    expect(parsed.right).toBe(undefined)
    expect(parsed.left).toStrictEqual([
      {
        code: ERROR_CODE.invalidRange,
        path: [],
        schema,
        subject,
      },
    ])
  })

  it('parse: maxLength INVALID_RANGE error', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
      maxLength: 1,
    } as const satisfies Schema

    const subject = ['x', 'y']

    const parsed = parse(schema, subject)

    expect(parsed.right).toBe(undefined)
    expect(parsed.left).toStrictEqual([
      {
        code: ERROR_CODE.invalidRange,
        path: [],
        schema,
        subject,
      },
    ])
  })

  it('parse: optional array with invalid direct subject', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
      optional: true,
    } as const satisfies Schema

    const strSubject = 'x'

    expect(parse(schema, strSubject).right).toBe(undefined)
    expect(parse(schema, strSubject).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: strSubject,
        schema,
        path: [],
      },
    ])
  })

  it('parse: required array with two invalid subject arr elements', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
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

    expect(parse(schema, subject).right).toBe(undefined)
    expect(parse(schema, subject).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: schema.of,
        path: [firstInvalidIndex],
      },
      {
        code: ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: schema.of,
        path: [secondInvalidIndex],
      },
    ])
  })

  it('parse: required array with deeply nested invalid subjects', () => {
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
                x: { type: 'string' },
                y: { type: 'boolean' },
                z: {
                  type: 'array',
                  of: {
                    type: 'object',
                    of: {
                      x: { type: 'number' },
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

    expect(parse(schema, subject).right).toBe(undefined)
    expect(parse(schema, subject).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: invalidSubjForStr,
        schema: schema.of.of.of.of.of.x,
        path: [0, 0, 0, 0, 'x'],
      },
      {
        code: ERROR_CODE.invalidType,
        subject: invalidSubjForBool,
        schema: schema.of.of.of.of.of.y,
        path: [0, 0, 0, 0, 'y'],
      },
      {
        code: ERROR_CODE.invalidType,
        subject: invalidSubjForNumb,
        schema: schema.of.of.of.of.of.z.of.of.x,
        path: [0, 0, 0, 0, 'z', 1, 'x'],
      },
      {
        code: ERROR_CODE.invalidType,
        subject: invalidSubjForNumb,
        schema: schema.of.of.of.of.of.z.of.of.x,
        path: [0, 0, 0, 0, 'z', 3, 'x'],
      },
    ])
  })
})

describe('Parse UNION schema with VALID subject', () => {
  it('parse: required mixed base schema union', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    } as const satisfies Schema

    const strSubj = 'x'

    expect(parse(schema, strSubj).right).toBe(strSubj)
    expect(parse(schema, strSubj).left).toBeUndefined()

    const numSubj = 0

    expect(parse(schema, numSubj).right).toBe(numSubj)
    expect(parse(schema, numSubj).left).toBeUndefined()

    const boolSubj = false

    expect(parse(schema, boolSubj).right).toBe(boolSubj)
    expect(parse(schema, boolSubj).left).toBeUndefined()
  })

  it('parse: optional mixed base schema union', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
      optional: true,
    } as const satisfies Schema

    const strSubj = 'x'

    expect(parse(schema, strSubj).right).toBe(strSubj)
    expect(parse(schema, strSubj).left).toBeUndefined()

    const numSubj = 0

    expect(parse(schema, numSubj).right).toBe(numSubj)
    expect(parse(schema, numSubj).left).toBeUndefined()

    const boolSubj = false

    expect(parse(schema, boolSubj).right).toBe(boolSubj)
    expect(parse(schema, boolSubj).left).toBeUndefined()

    const undefSubj = undefined

    expect(parse(schema, undefSubj).right).toBe(undefSubj)
    expect(parse(schema, undefSubj).left).toBeUndefined()
  })

  it('parse: LiteralSchema union', () => {
    const schema = {
      type: 'union',
      of: [
        { type: 'literal', of: 0 },
        { type: 'literal', of: 1 },
        { type: 'literal', of: 'x' },
        { type: 'literal', of: 'y' },
      ],
    } as const satisfies Schema

    const subj0 = 0

    expect(parse(schema, subj0).right).toStrictEqual(subj0)
    expect(parse(schema, subj0).left).toBeUndefined()

    const subj1 = 0

    expect(parse(schema, subj1).right).toStrictEqual(subj1)
    expect(parse(schema, subj1).left).toBeUndefined()

    const subjX = 'x'

    expect(parse(schema, subjX).right).toStrictEqual(subjX)
    expect(parse(schema, subjX).left).toBeUndefined()

    const subjY = 'y'

    expect(parse(schema, subjY).right).toStrictEqual(subjY)
    expect(parse(schema, subjY).left).toBeUndefined()
  })

  it('parse: ObjectSchema union', () => {
    const schema = {
      type: 'union',
      of: [
        { type: 'object', of: { x: { type: 'string' } } },
        { type: 'object', of: { y: { type: 'number' } } },
        { type: 'object', of: { z: { type: 'boolean' } } },
      ],
    } as const satisfies Schema

    const xSubj = { x: 'x' }

    expect(parse(schema, xSubj).right).toStrictEqual(xSubj)
    expect(parse(schema, xSubj).left).toBeUndefined()

    const ySubj = { y: 0 }

    expect(parse(schema, ySubj).right).toStrictEqual(ySubj)
    expect(parse(schema, ySubj).left).toBeUndefined()

    const zSubj = { z: false }

    expect(parse(schema, zSubj).right).toStrictEqual(zSubj)
    expect(parse(schema, zSubj).left).toBeUndefined()
  })

  it('parse: ArraySchema union', () => {
    const schema = {
      type: 'union',
      of: [
        { type: 'array', of: { type: 'string' } },
        { type: 'array', of: { type: 'number' } },
        { type: 'array', of: { type: 'boolean' } },
      ],
    } as const satisfies Schema

    const xSubj = ['x', 'y']

    expect(parse(schema, xSubj).right).toStrictEqual(xSubj)
    expect(parse(schema, xSubj).left).toBeUndefined()

    const ySubj = [0, 1]

    expect(parse(schema, ySubj).right).toStrictEqual(ySubj)
    expect(parse(schema, ySubj).left).toBeUndefined()

    const zSubj = [true, false]

    expect(parse(schema, zSubj).right).toStrictEqual(zSubj)
    expect(parse(schema, zSubj).left).toBeUndefined()
  })

  it('parse: union of all types', () => {
    const schema = {
      type: 'union',
      of: [
        { type: 'string' },
        { type: 'number' },
        { type: 'boolean' },
        { type: 'literal', of: 'z' },
        { type: 'literal', of: 2 },
        { type: 'object', of: { x: { type: 'string' } } },
        { type: 'array', of: { type: 'number' } },
      ],
    } as const satisfies Schema

    const strSubj = 'xxx'

    expect(parse(schema, strSubj).right).toStrictEqual(strSubj)
    expect(parse(schema, strSubj).left).toBeUndefined()

    const numSubj = 3

    expect(parse(schema, numSubj).right).toStrictEqual(numSubj)
    expect(parse(schema, numSubj).left).toBeUndefined()

    const boolSubj = false

    expect(parse(schema, boolSubj).right).toStrictEqual(boolSubj)
    expect(parse(schema, boolSubj).left).toBeUndefined()

    const litZ = 'z'

    expect(parse(schema, litZ).right).toStrictEqual(litZ)
    expect(parse(schema, litZ).left).toBeUndefined()

    const lit2 = 2

    expect(parse(schema, lit2).right).toStrictEqual(lit2)
    expect(parse(schema, lit2).left).toBeUndefined()

    const objSubj = { x: 'x' }

    expect(parse(schema, objSubj).right).toStrictEqual(objSubj)
    expect(parse(schema, objSubj).left).toBeUndefined()

    const arrSubj = [0, 1]

    expect(parse(schema, arrSubj).right).toStrictEqual(arrSubj)
    expect(parse(schema, arrSubj).left).toBeUndefined()
  })
})

describe('Parse UNION schema with INVALID subject', () => {
  it('parse: required mixed base schema union', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    } as const satisfies Schema

    const undefSubj = undefined

    expect(parse(schema, undefSubj).right).toBeUndefined()
    expect(parse(schema, undefSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: undefSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(parse(schema, nullSubj).right).toBeUndefined()
    expect(parse(schema, nullSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const objSubj = {}

    expect(parse(schema, objSubj).right).toBeUndefined()
    expect(parse(schema, objSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: objSubj,
        schema,
        path: [],
      },
    ])
  })

  it('parse: optional mixed base schema union', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
      optional: true,
    } as const satisfies Schema

    const objSubj = {}

    expect(parse(schema, objSubj).right).toBeUndefined()
    expect(parse(schema, objSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: objSubj,
        schema,
        path: [],
      },
    ])
  })

  it('parse: LiteralSchema union', () => {
    const schema = {
      type: 'union',
      of: [
        { type: 'literal', of: 0 },
        { type: 'literal', of: 1 },
        { type: 'literal', of: 'x' },
        { type: 'literal', of: 'y' },
      ],
    } as const satisfies Schema

    const subjY = 'y'

    expect(parse(schema, subjY).right).toStrictEqual(subjY)
    expect(parse(schema, subjY).left).toBeUndefined()
  })

  it('parse: ObjectSchema union', () => {
    const schema = {
      type: 'union',
      of: [
        { type: 'object', of: { x: { type: 'string' } } },
        { type: 'object', of: { y: { type: 'number' } } },
        { type: 'object', of: { z: { type: 'boolean' } } },
      ],
    } as const satisfies Schema

    const subjZ = { z: 'x' }

    expect(parse(schema, subjZ).right).toBeUndefined()
    expect(parse(schema, subjZ).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: subjZ,
        schema,
        path: [],
      },
    ])
  })

  it('parse: ArraySchema union', () => {
    const schema = {
      type: 'union',
      of: [
        { type: 'array', of: { type: 'string' } },
        { type: 'array', of: { type: 'number' } },
        { type: 'array', of: { type: 'boolean' } },
      ],
    } as const satisfies Schema

    const subjZ = { z: 'x' }

    expect(parse(schema, subjZ).right).toBeUndefined()
    expect(parse(schema, subjZ).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: subjZ,
        schema,
        path: [],
      },
    ])
  })

  it('parse: union of all types', () => {
    const schema = {
      type: 'union',
      of: [
        { type: 'string' },
        { type: 'number' },
        { type: 'boolean' },
        { type: 'literal', of: 'z' },
        { type: 'literal', of: 2 },
        { type: 'object', of: { x: { type: 'string' } } },
        { type: 'array', of: { type: 'number' } },
      ],
    } as const satisfies Schema

    const subjZ = { z: 'x' }

    expect(parse(schema, subjZ).right).toBeUndefined()
    expect(parse(schema, subjZ).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: subjZ,
        schema,
        path: [],
      },
    ])
  })
})

describe('Subject type inference check', () => {
  it('parse: object schema nested branded types', () => {
    const schema = {
      type: 'object',
      of: {
        x: { type: 'string', brand: ['key', 'value'] },
      },
    } as const satisfies Schema

    const parsed = parse(schema, { x: 'y' })

    if (parsed.left) {
      throw Error('Not expected')
    }

    check<string & { __key: 'value' }>(unknownX as typeof parsed.right.x)
  })
})
