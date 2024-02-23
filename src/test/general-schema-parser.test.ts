import { parse } from '../general-schema-parser'
import { ERROR_CODE } from '../error'
import { check, unknownX } from './test-utils'

import type { Schema } from '../types/compounds'

describe('Parse BASE schema with VALID subject', () => {
  it('parse: `{ type: "string" }` schema', () => {
    const schema = { type: 'string' } satisfies Schema
    const subject = 'x'

    expect(parse(schema, subject).data).toBe(subject)
    expect(parse(schema, subject).error).toBe(undefined)
  })

  it('parse: `{ type: "number" }` schema', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = 0

    expect(parse(schema, subject).data).toBe(subject)
    expect(parse(schema, subject).error).toBe(undefined)
  })

  it('parse: `{ type: "boolean" }` schema', () => {
    const schema = { type: 'boolean' } satisfies Schema
    const subject = false

    expect(parse(schema, subject).data).toBe(subject)
    expect(parse(schema, subject).error).toBe(undefined)
  })

  it('parse: `{ type: "literal" }` schema', () => {
    const schema = { type: 'literal', of: 'x' } satisfies Schema
    const subject = 'x'

    expect(parse(schema, subject).data).toBe(subject)
    expect(parse(schema, subject).error).toBe(undefined)
  })
})

describe('Parse BASE schema with INVALID subject', () => {
  it('parse: base detailed schema', () => {
    const detailedReqStrSchema = { type: 'string' } satisfies Schema
    const undefinedSubj = undefined

    expect(parse(detailedReqStrSchema, undefinedSubj).data).toBe(undefined)
    expect(parse(detailedReqStrSchema, undefinedSubj).error).toStrictEqual([
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

    expect(parse(detailedOptStrSchema, numberSubj).data).toBe(undefined)
    expect(parse(detailedOptStrSchema, numberSubj).error).toStrictEqual([
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

    expect(parse(schema, subject).data).toStrictEqual(expectedSubject)
    expect(parse(schema, subject).error).toStrictEqual(undefined)
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

    expect(parse(schema, subject).data).toStrictEqual(expectedSubject)
    expect(parse(schema, subject).error).toStrictEqual(undefined)
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

    expect(parse(schema, subject).data).toStrictEqual({
      strArrReq: subject.strArrReq,
      strArrOpt: undefined,
    })
    expect(parse(schema, subject).error).toStrictEqual(undefined)
  })

  it('parse: can be optional by itself', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'string' } },
      optional: true,
    } as const satisfies Schema

    expect(parse(schema, undefined).data).toBe(undefined)
    expect(parse(schema, undefined).error).toBe(undefined)
  })

  it('parse: can be nullable by itself', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'string' } },
      nullable: true,
    } as const satisfies Schema

    expect(parse(schema, null).data).toBe(null)
    expect(parse(schema, null).error).toBe(undefined)
  })
})

describe('Parse OBJECT schema with INVALID subject', () => {
  it('parse: required object with invalid direct subject', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'string' } },
    } as const satisfies Schema

    const undefinedSubj = undefined

    expect(parse(schema, undefinedSubj).data).toBe(undefined)
    expect(parse(schema, undefinedSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(parse(schema, nullSubj).data).toBe(undefined)
    expect(parse(schema, nullSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const regExpSubj = /^x/

    expect(parse(schema, regExpSubj).data).toBe(undefined)
    expect(parse(schema, regExpSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: regExpSubj,
        schema,
        path: [],
      },
    ])

    const arraySubj = [] as unknown

    expect(parse(schema, arraySubj).data).toBe(undefined)
    expect(parse(schema, arraySubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: arraySubj,
        schema,
        path: [],
      },
    ])

    const mapSubj = new Map()

    expect(parse(schema, mapSubj).data).toBe(undefined)
    expect(parse(schema, mapSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: mapSubj,
        schema,
        path: [],
      },
    ])

    const setSubj = new Set()

    expect(parse(schema, setSubj).data).toBe(undefined)
    expect(parse(schema, setSubj).error).toStrictEqual([
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

    expect(parse(schema, subject).data).toBe(undefined)
    expect(parse(schema, subject).error).toStrictEqual([
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

    expect(parse(schema, subject).data).toBe(undefined)
    expect(parse(schema, subject).error).toStrictEqual([
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

    expect(parse(schema, subject).data).toBe(undefined)
    expect(parse(schema, subject).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: schema.of.x.of,
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

    expect(parse(stringArrSchema, stringSubj).data).toStrictEqual(stringSubj)
    expect(parse(stringArrSchema, stringSubj).error).toBe(undefined)

    const numberArrSchema = {
      type: 'array',
      of: { type: 'number' },
    } as const satisfies Schema

    const numberSubj = [0, 1]

    expect(parse(numberArrSchema, numberSubj).data).toStrictEqual(numberSubj)
    expect(parse(numberArrSchema, numberSubj).error).toBe(undefined)

    const booleanArrSchema = {
      type: 'array',
      of: { type: 'boolean' },
    } as const satisfies Schema

    const booleanSubj = [true, false]

    expect(parse(booleanArrSchema, booleanSubj).data).toStrictEqual(booleanSubj)
    expect(parse(booleanArrSchema, booleanSubj).error).toBe(undefined)
  })

  it('parse: optional base short schema subject', () => {
    const optStrSchema = {
      type: 'array',
      of: { type: 'string', optional: true },
    } as const satisfies Schema

    const strSubject = ['x', 'y']

    expect(parse(optStrSchema, strSubject).data).toStrictEqual(strSubject)
    expect(parse(optStrSchema, strSubject).error).toBe(undefined)

    const optNumSchema = {
      type: 'array',
      of: { type: 'number', optional: true },
    } as const satisfies Schema

    const numSubject = [0, 1, 2, 3, 4]

    expect(parse(optNumSchema, numSubject).data).toStrictEqual(numSubject)
    expect(parse(optNumSchema, numSubject).error).toBe(undefined)

    const optBoolSchema = {
      type: 'array',
      of: { type: 'boolean', optional: true },
    } as const satisfies Schema

    const boolSubject = [true, true, false, true]

    expect(parse(optBoolSchema, boolSubject).data).toStrictEqual(boolSubject)
    expect(parse(optBoolSchema, boolSubject).error).toBe(undefined)
  })

  it('parse: required base detailed schema subject', () => {
    const strSchema = {
      type: 'array',
      of: { type: 'string' },
    } as const satisfies Schema

    const strSubj = ['x', 'y', 'x', 'y']

    expect(parse(strSchema, strSubj).data).toStrictEqual(strSubj)
    expect(parse(strSchema, strSubj).error).toBe(undefined)

    const numSchema = {
      type: 'array',
      of: { type: 'number' },
    } as const satisfies Schema

    const numSubj = [0, 1, 2, 3, 4]

    expect(parse(numSchema, numSubj).data).toStrictEqual(numSubj)
    expect(parse(numSchema, numSubj).error).toBe(undefined)

    const boolSchema = {
      type: 'array',
      of: { type: 'boolean' },
    } as const satisfies Schema

    const boolSubj = [true, true, false, true]

    expect(parse(boolSchema, boolSubj).data).toStrictEqual(boolSubj)
    expect(parse(boolSchema, boolSubj).error).toBe(undefined)

    const strLiteralSchema = {
      type: 'array',
      of: { type: 'literal', of: 'x' },
    } as const satisfies Schema

    const strLiteralSubj = ['x', 'x']

    expect(parse(strLiteralSchema, strLiteralSubj).data).toStrictEqual(
      strLiteralSubj
    )
    expect(parse(strLiteralSchema, strLiteralSubj).error).toBe(undefined)

    const numLiteralSchema = {
      type: 'array',
      of: { type: 'literal', of: 0 },
    } as const satisfies Schema

    const numLiteralSubj = [0, 0]

    expect(parse(numLiteralSchema, numLiteralSubj).data).toStrictEqual(
      numLiteralSubj
    )
    expect(parse(numLiteralSchema, numLiteralSubj).error).toBe(undefined)
  })

  it('parse: optional base detailed schema subject', () => {
    const strSchema = {
      type: 'array',
      of: { type: 'string', optional: true },
    } as const satisfies Schema

    const strSubj = ['x', 'y', 'x', 'y']

    expect(parse(strSchema, strSubj).data).toStrictEqual(strSubj)
    expect(parse(strSchema, strSubj).error).toBe(undefined)

    const numSchema = {
      type: 'array',
      of: { type: 'number', optional: true },
    } as const satisfies Schema

    const numSubj = [0, 1, 2, 3, 4]

    expect(parse(numSchema, numSubj).data).toStrictEqual(numSubj)
    expect(parse(numSchema, numSubj).error).toBe(undefined)

    const boolSchema = {
      type: 'array',
      of: { type: 'boolean', optional: true },
    } as const satisfies Schema

    const boolSubj = [true, true, false, true]

    expect(parse(boolSchema, boolSubj).data).toStrictEqual(boolSubj)
    expect(parse(boolSchema, boolSubj).error).toBe(undefined)

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

    expect(parse(strLiteralSchema, strLiteralSubj).data).toStrictEqual(
      strLiteralSubj
    )
    expect(parse(strLiteralSchema, strLiteralSubj).error).toBe(undefined)
    expect(parse(strLiteralSchema, arrWithUndef).data).toStrictEqual(
      arrWithUndef
    )
    expect(parse(strLiteralSchema, arrWithUndef).error).toBe(undefined)

    const numLiteralSchema = {
      type: 'array',
      of: {
        type: 'literal',
        of: 0,
        optional: true,
      },
    } as const satisfies Schema

    const numLiteralSubj = [0, 0]

    expect(parse(numLiteralSchema, numLiteralSubj).data).toStrictEqual(
      numLiteralSubj
    )
    expect(parse(numLiteralSchema, numLiteralSubj).error).toBe(undefined)
    expect(parse(numLiteralSchema, arrWithUndef).data).toStrictEqual(
      arrWithUndef
    )
    expect(parse(numLiteralSchema, arrWithUndef).error).toBe(undefined)
  })

  it('parse: can be optional by itself', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
      optional: true,
    } as const satisfies Schema

    expect(parse(schema, undefined).data).toBe(undefined)
    expect(parse(schema, undefined).error).toBe(undefined)
  })

  it('parse: can be nullable by itself', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
      nullable: true,
    } as const satisfies Schema

    expect(parse(schema, null).data).toBe(null)
    expect(parse(schema, null).error).toBeUndefined()
  })
})

describe('Parse ARRAY schema with INVALID subject', () => {
  it('parse: required array with invalid direct subject', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
    } as const satisfies Schema

    const undefinedSubj = undefined

    expect(parse(schema, undefinedSubj).data).toBe(undefined)
    expect(parse(schema, undefinedSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(parse(schema, nullSubj).data).toBe(undefined)
    expect(parse(schema, nullSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const stringSubj = 'x'

    expect(parse(schema, stringSubj).data).toBe(undefined)
    expect(parse(schema, stringSubj).error).toStrictEqual([
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

    expect(parsed.data).toBe(undefined)
    expect(parsed.error).toStrictEqual([
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

    expect(parsed.data).toBe(undefined)
    expect(parsed.error).toStrictEqual([
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

    expect(parse(schema, strSubject).data).toBe(undefined)
    expect(parse(schema, strSubject).error).toStrictEqual([
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

    expect(parse(schema, subject).data).toBe(undefined)
    expect(parse(schema, subject).error).toStrictEqual([
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

    expect(parse(schema, subject).data).toBe(undefined)
    expect(parse(schema, subject).error).toStrictEqual([
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

    expect(parse(schema, strSubj).data).toBe(strSubj)
    expect(parse(schema, strSubj).error).toBeUndefined()

    const numSubj = 0

    expect(parse(schema, numSubj).data).toBe(numSubj)
    expect(parse(schema, numSubj).error).toBeUndefined()

    const boolSubj = false

    expect(parse(schema, boolSubj).data).toBe(boolSubj)
    expect(parse(schema, boolSubj).error).toBeUndefined()
  })

  it('parse: optional mixed base schema union', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
      optional: true,
    } as const satisfies Schema

    const strSubj = 'x'

    expect(parse(schema, strSubj).data).toBe(strSubj)
    expect(parse(schema, strSubj).error).toBeUndefined()

    const numSubj = 0

    expect(parse(schema, numSubj).data).toBe(numSubj)
    expect(parse(schema, numSubj).error).toBeUndefined()

    const boolSubj = false

    expect(parse(schema, boolSubj).data).toBe(boolSubj)
    expect(parse(schema, boolSubj).error).toBeUndefined()

    const undefSubj = undefined

    expect(parse(schema, undefSubj).data).toBe(undefSubj)
    expect(parse(schema, undefSubj).error).toBeUndefined()
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

    expect(parse(schema, subj0).data).toStrictEqual(subj0)
    expect(parse(schema, subj0).error).toBeUndefined()

    const subj1 = 0

    expect(parse(schema, subj1).data).toStrictEqual(subj1)
    expect(parse(schema, subj1).error).toBeUndefined()

    const subjX = 'x'

    expect(parse(schema, subjX).data).toStrictEqual(subjX)
    expect(parse(schema, subjX).error).toBeUndefined()

    const subjY = 'y'

    expect(parse(schema, subjY).data).toStrictEqual(subjY)
    expect(parse(schema, subjY).error).toBeUndefined()
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

    expect(parse(schema, xSubj).data).toStrictEqual(xSubj)
    expect(parse(schema, xSubj).error).toBeUndefined()

    const ySubj = { y: 0 }

    expect(parse(schema, ySubj).data).toStrictEqual(ySubj)
    expect(parse(schema, ySubj).error).toBeUndefined()

    const zSubj = { z: false }

    expect(parse(schema, zSubj).data).toStrictEqual(zSubj)
    expect(parse(schema, zSubj).error).toBeUndefined()
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

    expect(parse(schema, xSubj).data).toStrictEqual(xSubj)
    expect(parse(schema, xSubj).error).toBeUndefined()

    const ySubj = [0, 1]

    expect(parse(schema, ySubj).data).toStrictEqual(ySubj)
    expect(parse(schema, ySubj).error).toBeUndefined()

    const zSubj = [true, false]

    expect(parse(schema, zSubj).data).toStrictEqual(zSubj)
    expect(parse(schema, zSubj).error).toBeUndefined()
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

    expect(parse(schema, strSubj).data).toStrictEqual(strSubj)
    expect(parse(schema, strSubj).error).toBeUndefined()

    const numSubj = 3

    expect(parse(schema, numSubj).data).toStrictEqual(numSubj)
    expect(parse(schema, numSubj).error).toBeUndefined()

    const boolSubj = false

    expect(parse(schema, boolSubj).data).toStrictEqual(boolSubj)
    expect(parse(schema, boolSubj).error).toBeUndefined()

    const litZ = 'z'

    expect(parse(schema, litZ).data).toStrictEqual(litZ)
    expect(parse(schema, litZ).error).toBeUndefined()

    const lit2 = 2

    expect(parse(schema, lit2).data).toStrictEqual(lit2)
    expect(parse(schema, lit2).error).toBeUndefined()

    const objSubj = { x: 'x' }

    expect(parse(schema, objSubj).data).toStrictEqual(objSubj)
    expect(parse(schema, objSubj).error).toBeUndefined()

    const arrSubj = [0, 1]

    expect(parse(schema, arrSubj).data).toStrictEqual(arrSubj)
    expect(parse(schema, arrSubj).error).toBeUndefined()
  })
})

describe('Parse UNION schema with INVALID subject', () => {
  it('parse: required mixed base schema union', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    } as const satisfies Schema

    const undefSubj = undefined

    expect(parse(schema, undefSubj).data).toBeUndefined()
    expect(parse(schema, undefSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: undefSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(parse(schema, nullSubj).data).toBeUndefined()
    expect(parse(schema, nullSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const objSubj = {}

    expect(parse(schema, objSubj).data).toBeUndefined()
    expect(parse(schema, objSubj).error).toStrictEqual([
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

    expect(parse(schema, objSubj).data).toBeUndefined()
    expect(parse(schema, objSubj).error).toStrictEqual([
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

    expect(parse(schema, subjY).data).toStrictEqual(subjY)
    expect(parse(schema, subjY).error).toBeUndefined()
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

    expect(parse(schema, subjZ).data).toBeUndefined()
    expect(parse(schema, subjZ).error).toStrictEqual([
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

    expect(parse(schema, subjZ).data).toBeUndefined()
    expect(parse(schema, subjZ).error).toStrictEqual([
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

    expect(parse(schema, subjZ).data).toBeUndefined()
    expect(parse(schema, subjZ).error).toStrictEqual([
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

    if (parsed.error) {
      throw Error('Not expected')
    }

    check<string & { __key: 'value' }>(unknownX as typeof parsed.data.x)
  })
})
