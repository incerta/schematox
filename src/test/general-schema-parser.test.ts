import { parse } from '../general-schema-parser'
import { ERROR_CODE } from '../error'
import { check, unknownX } from './test-utils'

import type { Schema } from '../types/compound-schema-types'

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

  it('parse: `{ type: "stringUnion" }` schema', () => {
    const schema = { type: 'stringUnion', of: ['x', 'y'] } satisfies Schema
    const subject = 'y'

    expect(parse(schema, subject).data).toBe(subject)
    expect(parse(schema, subject).error).toBe(undefined)
  })

  it('parse: `{ type: "numberUnion" }` schema', () => {
    const schema = { type: 'numberUnion', of: [0, 1] } satisfies Schema
    const subject = 1

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
        nullB: { type: 'string', optional: true },
        undefinedB: { type: 'string', optional: true },
        c: { type: 'number' },
        d: { type: 'number', optional: true },
        nullD: { type: 'number', optional: true },
        undefinedD: { type: 'number', optional: true },
        e: { type: 'boolean' },
        f: { type: 'boolean', optional: true },
        nullF: { type: 'boolean', optional: true },
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

      nullB: undefined,
      undefinedB: undefined,
      nullD: undefined,
      undefinedD: undefined,
      nullF: undefined,
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
        nullB: { type: 'string', optional: true },
        undefinedB: { type: 'string', optional: true },
        nullBDef: { type: 'string', optional: true, default: 'x' },
        undefinedBDef: { type: 'string', optional: true, default: 'y' },
        c: { type: 'number' },
        d: { type: 'number', optional: true },
        nullD: { type: 'number', optional: true },
        undefinedD: { type: 'number', optional: true },
        nullDDef: { type: 'number', optional: true, default: 0 },
        undefinedDDef: { type: 'number', optional: true, default: 1 },
        e: { type: 'boolean' },
        f: { type: 'boolean', optional: true },
        nullF: { type: 'boolean', optional: true },
        undefinedF: { type: 'boolean', optional: true },
        nullFDef: { type: 'boolean', optional: true, default: true },
        undefinedFDef: { type: 'boolean', optional: true, default: false },
        i: { type: 'stringUnion', of: ['x', 'y'] },
        j: { type: 'stringUnion', of: ['x', 'y'], optional: true },
        nullJ: { type: 'stringUnion', of: ['x', 'y'], optional: true },
        undefinedJ: { type: 'stringUnion', of: ['x', 'y'], optional: true },
        nullJDef: {
          type: 'stringUnion',
          of: ['x', 'y'],
          optional: true,
          default: 'x',
        },
        undefinedJDef: {
          type: 'stringUnion',
          of: ['x', 'y'],
          optional: true,
          default: 'y',
        },
        k: { type: 'numberUnion', of: [0, 1] },
        l: { type: 'numberUnion', of: [0, 1], optional: true },
        nullL: { type: 'numberUnion', of: [0, 1], optional: true },
        undefinedL: { type: 'numberUnion', of: [0, 1], optional: true },
        nullLDef: {
          type: 'numberUnion',
          of: [0, 1],
          optional: true,
          default: 0,
        },
        undefinedLDef: {
          type: 'numberUnion',
          of: [0, 1],
          optional: true,
          default: 1,
        },
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
      j: 'y',
      k: 0,
      l: 1,
      nullBDef: 'x',
      undefinedBDef: 'y',
      nullDDef: 0,
      undefinedDDef: 1,
      nullFDef: true,
      undefinedFDef: false,
      nullJDef: 'x',
      undefinedJDef: 'y',
      nullLDef: 0,
      undefinedLDef: 1,

      nullB: undefined,
      undefinedB: undefined,
      nullD: undefined,
      undefinedD: undefined,
      nullF: undefined,
      undefinedF: undefined,
      nullJ: undefined,
      undefinedJ: undefined,
      nullL: undefined,
      undefinedL: undefined,
    }

    const subject = {
      a: 'x',
      b: 'y',
      c: 0,
      d: 1,
      e: true,
      f: false,
      i: 'x',
      j: 'y',
      k: 0,
      l: 1,
      nullB: null,
      undefinedB: undefined,
      nullBDef: null,
      undefinedBDef: undefined,
      nullD: null,
      undefinedD: undefined,
      nullDDef: null,
      undefinedDDef: undefined,
      nullF: null,
      undefinedF: undefined,
      nullFDef: null,
      undefinedFDef: undefined,
      nullJ: null,
      undefinedJ: undefined,
      nullJDef: null,
      undefinedJDef: undefined,
      nullL: null,
      undefinedL: undefined,
      nullLDef: null,
      undefinedLDef: undefined,
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
      strArrOpt: null,
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

    expect(parse(schema, null).data).toBe(undefined)
    expect(parse(schema, null).error).toBe(undefined)
    expect(parse(schema, undefined).data).toBe(undefined)
    expect(parse(schema, undefined).error).toBe(undefined)
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
    const nullArr = [null, null, undefined, null] as unknown
    const nullArrExp = [undefined, undefined, undefined, undefined]

    const optStrSchema = {
      type: 'array',
      of: { type: 'string', optional: true },
    } as const satisfies Schema

    const strSubject = ['x', 'y']

    expect(parse(optStrSchema, strSubject).data).toStrictEqual(strSubject)
    expect(parse(optStrSchema, strSubject).error).toBe(undefined)
    expect(parse(optStrSchema, nullArr).data).toStrictEqual(nullArrExp)
    expect(parse(optStrSchema, nullArr).error).toBe(undefined)

    const optNumSchema = {
      type: 'array',
      of: { type: 'number', optional: true },
    } as const satisfies Schema

    const numSubject = [0, 1, 2, 3, 4]

    expect(parse(optNumSchema, numSubject).data).toStrictEqual(numSubject)
    expect(parse(optNumSchema, numSubject).error).toBe(undefined)
    expect(parse(optNumSchema, nullArr).data).toStrictEqual(nullArrExp)
    expect(parse(optNumSchema, nullArr).error).toBe(undefined)

    const optBoolSchema = {
      type: 'array',
      of: { type: 'boolean', optional: true },
    } as const satisfies Schema

    const boolSubject = [true, true, false, true]

    expect(parse(optBoolSchema, boolSubject).data).toStrictEqual(boolSubject)
    expect(parse(optBoolSchema, boolSubject).error).toBe(undefined)
    expect(parse(optBoolSchema, nullArr).data).toStrictEqual(nullArrExp)
    expect(parse(optBoolSchema, nullArr).error).toBe(undefined)
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

    const strUnionSchema = {
      type: 'array',
      of: {
        type: 'stringUnion',
        of: ['x', 'y'],
      },
    } as const satisfies Schema

    const strUnionSubj = ['x', 'y', 'x', 'y']

    expect(parse(strUnionSchema, strUnionSubj).data).toStrictEqual(strUnionSubj)
    expect(parse(strUnionSchema, strUnionSubj).error).toBe(undefined)

    const numUnionSchema = {
      type: 'array',
      of: {
        type: 'numberUnion',
        of: [0, 1],
      },
    } as const satisfies Schema

    const numUnionSubj = [0, 1, 0, 1]

    expect(parse(numUnionSchema, numUnionSubj).data).toStrictEqual(numUnionSubj)
    expect(parse(numUnionSchema, numUnionSubj).error).toBe(undefined)
  })

  it('parse: optional base detailed schema subject', () => {
    const nullArr = [null, null, undefined, null] as unknown
    const nullArrExp = [undefined, undefined, undefined, undefined]

    const strSchema = {
      type: 'array',
      of: { type: 'string', optional: true },
    } as const satisfies Schema

    const strSubj = ['x', 'y', 'x', 'y']

    expect(parse(strSchema, strSubj).data).toStrictEqual(strSubj)
    expect(parse(strSchema, strSubj).error).toBe(undefined)
    expect(parse(strSchema, nullArr).data).toStrictEqual(nullArrExp)
    expect(parse(strSchema, nullArr).error).toBe(undefined)

    const numSchema = {
      type: 'array',
      of: { type: 'number', optional: true },
    } as const satisfies Schema

    const numSubj = [0, 1, 2, 3, 4]

    expect(parse(numSchema, numSubj).data).toStrictEqual(numSubj)
    expect(parse(numSchema, numSubj).error).toBe(undefined)
    expect(parse(numSchema, nullArr).data).toStrictEqual(nullArrExp)
    expect(parse(numSchema, nullArr).error).toBe(undefined)

    const boolSchema = {
      type: 'array',
      of: { type: 'boolean', optional: true },
    } as const satisfies Schema

    const boolSubj = [true, true, false, true]

    expect(parse(boolSchema, boolSubj).data).toStrictEqual(boolSubj)
    expect(parse(boolSchema, boolSubj).error).toBe(undefined)
    expect(parse(boolSchema, nullArr).data).toStrictEqual(nullArrExp)
    expect(parse(boolSchema, nullArr).error).toBe(undefined)

    const strUnionSchema = {
      type: 'array',
      of: {
        type: 'stringUnion',
        of: ['x', 'y'],
        optional: true,
      },
    } as const satisfies Schema

    const strUnionSubj = ['x', 'y', 'x', 'y']

    expect(parse(strUnionSchema, strUnionSubj).data).toStrictEqual(strUnionSubj)
    expect(parse(strUnionSchema, strUnionSubj).error).toBe(undefined)
    expect(parse(strUnionSchema, nullArr).data).toStrictEqual(nullArrExp)
    expect(parse(strUnionSchema, nullArr).error).toBe(undefined)

    const numUnionSchema = {
      type: 'array',
      of: {
        type: 'numberUnion',
        of: [0, 1],
        optional: true,
      },
    } as const satisfies Schema

    const numUnionSubj = [0, 1, 0, 1]

    expect(parse(numUnionSchema, numUnionSubj).data).toStrictEqual(numUnionSubj)
    expect(parse(numUnionSchema, numUnionSubj).error).toBe(undefined)
    expect(parse(numUnionSchema, nullArr).data).toStrictEqual(nullArrExp)
    expect(parse(numUnionSchema, nullArr).error).toBe(undefined)
  })

  it('parse: can be optional by itself', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
      optional: true,
    } as const satisfies Schema

    expect(parse(schema, null).data).toBe(undefined)
    expect(parse(schema, null).error).toBe(undefined)
    expect(parse(schema, undefined).data).toBe(undefined)
    expect(parse(schema, undefined).error).toBe(undefined)
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
