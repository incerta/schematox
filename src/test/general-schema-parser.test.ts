import { parse } from '../general-schema-parser'
import { PARSE_ERROR_CODE } from '../error'
import { check, unknownX } from './test-utils'

import type { Schema } from '../types/compound-schema-types'

describe('Parse BASE schema with VALID subject', () => {
  it('parse: `"string"` schema', () => {
    const schema = 'string' satisfies Schema
    const subject = 'x'

    expect(parse(schema, subject).data).toBe(subject)
    expect(parse(schema, subject).error).toBe(undefined)
  })

  it('parse: `"string?"` schema', () => {
    const schema = 'string?' satisfies Schema
    const subject = 'x'

    expect(parse(schema, subject).data).toBe(subject)
    expect(parse(schema, subject).error).toBe(undefined)
  })

  it('parse: `"number"` schema', () => {
    const schema = 'number' satisfies Schema
    const subject = 0

    expect(parse(schema, subject).data).toBe(subject)
    expect(parse(schema, subject).error).toBe(undefined)
  })

  it('parse: `"number?"` schema', () => {
    const schema = 'number?' satisfies Schema
    const subject = 0

    expect(parse(schema, subject).data).toBe(subject)
    expect(parse(schema, subject).error).toBe(undefined)
  })

  it('parse: `"boolean"` schema', () => {
    const schema = 'boolean' satisfies Schema
    const subject = true

    expect(parse(schema, subject).data).toBe(subject)
    expect(parse(schema, subject).error).toBe(undefined)
  })

  it('parse: `"boolean?"` schema', () => {
    const schema = 'boolean?' satisfies Schema
    const subject = false

    expect(parse(schema, subject).data).toBe(subject)
    expect(parse(schema, subject).error).toBe(undefined)
  })

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
  it('parse: short base schema', () => {
    const shortReqStrSchema = 'string' satisfies Schema
    const undefinedSubj = undefined

    expect(parse(shortReqStrSchema, undefinedSubj).data).toBe(undefined)
    expect(parse(shortReqStrSchema, undefinedSubj).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema: shortReqStrSchema,
        path: [],
      },
    ])

    const shortOptStrSchema = 'string?' satisfies Schema
    const numberSubj = 0

    expect(parse(shortOptStrSchema, numberSubj).data).toBe(undefined)
    expect(parse(shortOptStrSchema, numberSubj).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: numberSubj,
        schema: shortOptStrSchema,
        path: [],
      },
    ])
  })

  it('parse: base detailed schema', () => {
    const detailedReqStrSchema = { type: 'string' } satisfies Schema
    const undefinedSubj = undefined

    expect(parse(detailedReqStrSchema, undefinedSubj).data).toBe(undefined)
    expect(parse(detailedReqStrSchema, undefinedSubj).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
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
    expect(parse(detailedOptStrSchema, numberSubj).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
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
        a: 'string',
        b: 'string?',
        nullB: 'string?',
        undefinedB: 'string?',
        c: 'number',
        d: 'number?',
        nullD: 'number?',
        undefinedD: 'number?',
        e: 'boolean',
        f: 'boolean?',
        nullF: 'boolean?',
        undefinedF: 'boolean?',
      },
    } as const satisfies Schema

    const expectedSubject = {
      a: 'x',
      b: 'y',
      c: 0,
      d: 1,
      e: true,
      f: false,
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

    expect(parse(schema, subject).data).toEqual(expectedSubject)
    expect(parse(schema, subject).error).toEqual(undefined)
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

    expect(parse(schema, subject).data).toEqual(expectedSubject)
    expect(parse(schema, subject).error).toEqual(undefined)
  })

  it('parse: nested array schema subject', () => {
    const schema = {
      type: 'object',
      of: {
        strArrReq: { type: 'array', of: 'string' },
        strArrOpt: { type: 'array', of: 'string', optional: true },
      },
    } as const satisfies Schema

    const subject = {
      strArrReq: ['x', 'y'],
      strArrOpt: null,
    }

    expect(parse(schema, subject).data).toEqual({
      strArrReq: subject.strArrReq,
    })
    expect(parse(schema, subject).error).toEqual(undefined)
  })

  it('parse: can be optional by itself', () => {
    const schema = {
      type: 'object',
      of: { x: 'string' },
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
      of: { x: 'string' },
    } as const satisfies Schema

    const undefinedSubj = undefined

    expect(parse(schema, undefinedSubj).data).toBe(undefined)
    expect(parse(schema, undefinedSubj).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(parse(schema, nullSubj).data).toBe(undefined)
    expect(parse(schema, nullSubj).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const regExpSubj = /^x/

    expect(parse(schema, regExpSubj).data).toBe(undefined)
    expect(parse(schema, regExpSubj).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: regExpSubj,
        schema,
        path: [],
      },
    ])

    const arraySubj = [] as unknown

    expect(parse(schema, arraySubj).data).toBe(undefined)
    expect(parse(schema, arraySubj).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: arraySubj,
        schema,
        path: [],
      },
    ])

    const mapSubj = new Map()

    expect(parse(schema, mapSubj).data).toBe(undefined)
    expect(parse(schema, mapSubj).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: mapSubj,
        schema,
        path: [],
      },
    ])

    const setSubj = new Set()

    expect(parse(schema, setSubj).data).toBe(undefined)
    expect(parse(schema, setSubj).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: setSubj,
        schema,
        path: [],
      },
    ])
  })

  it('parse: required obejct with two invalid subjects', () => {
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

    expect(parse(schema, subject).data).toBe(undefined)
    expect(parse(schema, subject).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: subject[firstInvalidSubjKey],
        schema: schema.of[firstInvalidSubjKey],
        path: [firstInvalidSubjKey],
      },
      {
        code: PARSE_ERROR_CODE.invalidType,
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
    }

    expect(parse(schema, subject).data).toBe(undefined)
    expect(parse(schema, subject).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: 'string',
        path: ['a', 'b', 'cArr', 2, 'dArrObj'],
      },
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: 'string',
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
          of: 'string',
        },
      },
    } as const satisfies Schema

    const invalidSubject = 0
    const subject = {
      x: ['valid', invalidSubject],
    }

    expect(parse(schema, subject).data).toBe(undefined)
    expect(parse(schema, subject).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
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
      of: 'string',
    } as const satisfies Schema

    const stringSubj = ['x', 'y']

    expect(parse(stringArrSchema, stringSubj).data).toEqual(stringSubj)
    expect(parse(stringArrSchema, stringSubj).error).toBe(undefined)

    const numberArrSchema = {
      type: 'array',
      of: 'number',
    } as const satisfies Schema

    const numberSubj = [0, 1]

    expect(parse(numberArrSchema, numberSubj).data).toEqual(numberSubj)
    expect(parse(numberArrSchema, numberSubj).error).toBe(undefined)

    const booleanArrSchema = {
      type: 'array',
      of: 'boolean',
    } as const satisfies Schema

    const booleanSubj = [true, false]

    expect(parse(booleanArrSchema, booleanSubj).data).toEqual(booleanSubj)
    expect(parse(booleanArrSchema, booleanSubj).error).toBe(undefined)
  })

  it('parse: optional base short schema subject', () => {
    const arrWithNullable = [null, null, undefined, null] as unknown

    const optStrSchema = {
      type: 'array',
      of: 'string?',
    } as const satisfies Schema

    const strSubject = ['x', 'y']

    expect(parse(optStrSchema, strSubject).data).toEqual(strSubject)
    expect(parse(optStrSchema, strSubject).error).toBe(undefined)
    expect(parse(optStrSchema, arrWithNullable).data).toEqual([])
    expect(parse(optStrSchema, arrWithNullable).error).toBe(undefined)

    const optNumSchema = {
      type: 'array',
      of: 'number?',
    } as const satisfies Schema

    const numSubject = [0, 1, 2, 3, 4]

    expect(parse(optNumSchema, numSubject).data).toEqual(numSubject)
    expect(parse(optNumSchema, numSubject).error).toBe(undefined)
    expect(parse(optNumSchema, arrWithNullable).data).toEqual([])
    expect(parse(optNumSchema, arrWithNullable).error).toBe(undefined)

    const optBoolSchema = {
      type: 'array',
      of: 'boolean?',
    } as const satisfies Schema

    const boolSubject = [true, true, false, true]

    expect(parse(optBoolSchema, boolSubject).data).toEqual(boolSubject)
    expect(parse(optBoolSchema, boolSubject).error).toBe(undefined)
    expect(parse(optBoolSchema, arrWithNullable).data).toEqual([])
    expect(parse(optBoolSchema, arrWithNullable).error).toBe(undefined)
  })

  it('parse: required base detailed schema subject', () => {
    const strSchema = {
      type: 'array',
      of: { type: 'string' },
    } as const satisfies Schema

    const strSubj = ['x', 'y', 'x', 'y']

    expect(parse(strSchema, strSubj).data).toEqual(strSubj)
    expect(parse(strSchema, strSubj).error).toBe(undefined)

    const numSchema = {
      type: 'array',
      of: { type: 'number' },
    } as const satisfies Schema

    const numSubj = [0, 1, 2, 3, 4]

    expect(parse(numSchema, numSubj).data).toEqual(numSubj)
    expect(parse(numSchema, numSubj).error).toBe(undefined)

    const boolSchema = {
      type: 'array',
      of: { type: 'boolean' },
    } as const satisfies Schema

    const boolSubj = [true, true, false, true]

    expect(parse(boolSchema, boolSubj).data).toEqual(boolSubj)
    expect(parse(boolSchema, boolSubj).error).toBe(undefined)

    const strUnionSchema = {
      type: 'array',
      of: {
        type: 'stringUnion',
        of: ['x', 'y'],
      },
    } as const satisfies Schema

    const strUnionSubj = ['x', 'y', 'x', 'y']

    expect(parse(strUnionSchema, strUnionSubj).data).toEqual(strUnionSubj)
    expect(parse(strUnionSchema, strUnionSubj).error).toBe(undefined)

    const numUnionSchema = {
      type: 'array',
      of: {
        type: 'numberUnion',
        of: [0, 1],
      },
    } as const satisfies Schema

    const numUnionSubj = [0, 1, 0, 1]

    expect(parse(numUnionSchema, numUnionSubj).data).toEqual(numUnionSubj)
    expect(parse(numUnionSchema, numUnionSubj).error).toBe(undefined)
  })

  it('parse: optional base detailed schema subject', () => {
    const arrWithNullable = [null, null, undefined, null] as unknown

    const strSchema = {
      type: 'array',
      of: { type: 'string', optional: true },
    } as const satisfies Schema

    const strSubj = ['x', 'y', 'x', 'y']

    expect(parse(strSchema, strSubj).data).toEqual(strSubj)
    expect(parse(strSchema, strSubj).error).toBe(undefined)
    expect(parse(strSchema, arrWithNullable).data).toEqual([])
    expect(parse(strSchema, arrWithNullable).error).toBe(undefined)

    const numSchema = {
      type: 'array',
      of: { type: 'number', optional: true },
    } as const satisfies Schema

    const numSubj = [0, 1, 2, 3, 4]

    expect(parse(numSchema, numSubj).data).toEqual(numSubj)
    expect(parse(numSchema, numSubj).error).toBe(undefined)
    expect(parse(numSchema, arrWithNullable).data).toEqual([])
    expect(parse(numSchema, arrWithNullable).error).toBe(undefined)

    const boolSchema = {
      type: 'array',
      of: { type: 'boolean', optional: true },
    } as const satisfies Schema

    const boolSubj = [true, true, false, true]

    expect(parse(boolSchema, boolSubj).data).toEqual(boolSubj)
    expect(parse(boolSchema, boolSubj).error).toBe(undefined)
    expect(parse(boolSchema, arrWithNullable).data).toEqual([])
    expect(parse(boolSchema, arrWithNullable).error).toBe(undefined)

    const strUnionSchema = {
      type: 'array',
      of: {
        type: 'stringUnion',
        of: ['x', 'y'],
        optional: true,
      },
    } as const satisfies Schema

    const strUnionSubj = ['x', 'y', 'x', 'y']

    expect(parse(strUnionSchema, strUnionSubj).data).toEqual(strUnionSubj)
    expect(parse(strUnionSchema, strUnionSubj).error).toBe(undefined)
    expect(parse(strUnionSchema, arrWithNullable).data).toEqual([])
    expect(parse(strUnionSchema, arrWithNullable).error).toBe(undefined)

    const numUnionSchema = {
      type: 'array',
      of: {
        type: 'numberUnion',
        of: [0, 1],
        optional: true,
      },
    } as const satisfies Schema

    const numUnionSubj = [0, 1, 0, 1]

    expect(parse(numUnionSchema, numUnionSubj).data).toEqual(numUnionSubj)
    expect(parse(numUnionSchema, numUnionSubj).error).toBe(undefined)
    expect(parse(numUnionSchema, arrWithNullable).data).toEqual([])
    expect(parse(numUnionSchema, arrWithNullable).error).toBe(undefined)
  })

  it('parse: can be optional by itself', () => {
    const schema = {
      type: 'array',
      of: 'string',
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
      of: 'string',
    } as const satisfies Schema

    const undefinedSubj = undefined

    expect(parse(schema, undefinedSubj).data).toBe(undefined)
    expect(parse(schema, undefinedSubj).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(parse(schema, nullSubj).data).toBe(undefined)
    expect(parse(schema, nullSubj).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const stringSubj = 'x'

    expect(parse(schema, stringSubj).data).toBe(undefined)
    expect(parse(schema, stringSubj).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: stringSubj,
        schema,
        path: [],
      },
    ])
  })

  it('parse: optional array with invalid direct subject', () => {
    const schema = {
      type: 'array',
      of: 'string',
      optional: true,
    } as const satisfies Schema

    const strSubject = 'x'

    expect(parse(schema, strSubject).data).toBe(undefined)
    expect(parse(schema, strSubject).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: strSubject,
        schema,
        path: [],
      },
    ])
  })

  it('parse: required array with two invalid subject arr elements', () => {
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

    expect(parse(schema, subject).data).toBe(undefined)
    expect(parse(schema, subject).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: schema.of,
        path: [firstInvalidIndex],
      },
      {
        code: PARSE_ERROR_CODE.invalidType,
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

    expect(parse(schema, subject).data).toBe(undefined)
    expect(parse(schema, subject).error).toEqual([
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: invalidSubjForStr,
        schema: schema.of.of.of.of.of.x,
        path: [0, 0, 0, 0, 'x'],
      },
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: invalidSubjForBool,
        schema: schema.of.of.of.of.of.y,
        path: [0, 0, 0, 0, 'y'],
      },
      {
        code: PARSE_ERROR_CODE.invalidType,
        subject: invalidSubjForNumb,
        schema: schema.of.of.of.of.of.z.of.of.x,
        path: [0, 0, 0, 0, 'z', 1, 'x'],
      },
      {
        code: PARSE_ERROR_CODE.invalidType,
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
