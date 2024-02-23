import { validate, guard } from '../general-schema-validator'
import { ERROR_CODE } from '../error'
import { check, unknownX } from './test-utils'

import type { Schema } from '../types/compounds'

describe('Validate BASE schema with VALID subject', () => {
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

  it('validate: `{ type: "literal" }` schema', () => {
    const schema = { type: 'literal', of: 'x' } as const satisfies Schema
    const subject = 'x'

    expect(validate(schema, subject).data).toBe(subject)
    expect(validate(schema, subject).error).toBe(undefined)
  })
})

describe('Validate BASE schema with INVALID subject', () => {
  it('validate: base detailed schema', () => {
    const detailedReqStrSchema = { type: 'string' } satisfies Schema
    const undefinedSubj = undefined

    expect(validate(detailedReqStrSchema, undefinedSubj).data).toBe(undefined)
    expect(validate(detailedReqStrSchema, undefinedSubj).error).toStrictEqual([
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

    expect(validate(detailedOptStrSchema, numberSubj).data).toBe(undefined)
    expect(validate(detailedOptStrSchema, numberSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
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
        a: { type: 'string' },
        b: { type: 'string', optional: true },
        undefinedB: { type: 'string', optional: true },
        c: { type: 'number' },
        d: { type: 'number', optional: true },
        undefinedD: { type: 'number', optional: true },
        e: { type: 'boolean' },
        f: { type: 'boolean', optional: true },
        undefinedF: { type: 'boolean', optional: true },
      },
    } as const satisfies Schema

    const subject = {
      a: 'x',
      b: 'y',
      c: 0,
      d: 1,
      e: true,
      f: false,
      undefinedB: undefined,
      undefinedD: undefined,
      undefinedF: undefined,
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
        i: { type: 'literal', of: 'x' },
        j: { type: 'literal', of: 'x', optional: true },
      },
    } as const satisfies Schema

    const subject = {
      a: 'x',
      b: 'y',
      c: 0,
      d: 1,
      e: true,
      f: false,
      i: 'x',
      j: 'x',
      undefinedB: undefined,
      undefinedD: undefined,
      undefinedF: undefined,
      undefinedJ: undefined,
      extraKeyWhichShouldBeKept: 'x',
    } as const

    expect(validate(schema, subject).data).toStrictEqual(subject)
    expect(validate(schema, subject).error).toStrictEqual(undefined)
  })

  it('validate: nested array schema subject', () => {
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

    expect(validate(schema, subject).data).toStrictEqual(subject)
    expect(validate(schema, subject).error).toStrictEqual(undefined)
  })

  it('validate: can be optional by itself', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'string' } },
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
      of: { x: { type: 'string' } },
    } as const satisfies Schema

    const undefinedSubj = undefined

    expect(validate(schema, undefinedSubj).data).toBe(undefined)
    expect(validate(schema, undefinedSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(validate(schema, nullSubj).data).toBe(undefined)
    expect(validate(schema, nullSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const regExpSubj = /^x/

    expect(validate(schema, regExpSubj).data).toBe(undefined)
    expect(validate(schema, regExpSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: regExpSubj,
        schema,
        path: [],
      },
    ])

    const arraySubj = [] as unknown

    expect(validate(schema, arraySubj).data).toBe(undefined)
    expect(validate(schema, arraySubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: arraySubj,
        schema,
        path: [],
      },
    ])

    const mapSubj = new Map()

    expect(validate(schema, mapSubj).data).toBe(undefined)
    expect(validate(schema, mapSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: mapSubj,
        schema,
        path: [],
      },
    ])

    const setSubj = new Set()

    expect(validate(schema, setSubj).data).toBe(undefined)
    expect(validate(schema, setSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: setSubj,
        schema,
        path: [],
      },
    ])
  })

  it('validate: required obejct with two invalid subjects', () => {
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

    expect(validate(schema, subject).data).toBe(undefined)
    expect(validate(schema, subject).error).toStrictEqual([
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
    } as const

    expect(validate(schema, subject).data).toBe(undefined)
    expect(validate(schema, subject).error).toStrictEqual([
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

  it('validate: required obejct with nested array invalid subject', () => {
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

    expect(validate(schema, subject).data).toBe(undefined)
    expect(validate(schema, subject).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
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
      of: { type: 'string' },
    } as const satisfies Schema

    const stringSubj = ['x', 'y']

    expect(validate(stringArrSchema, stringSubj).data).toStrictEqual(stringSubj)
    expect(validate(stringArrSchema, stringSubj).error).toBe(undefined)

    const numberArrSchema = {
      type: 'array',
      of: { type: 'number' },
    } as const satisfies Schema

    const numberSubj = [0, 1]

    expect(validate(numberArrSchema, numberSubj).data).toStrictEqual(numberSubj)
    expect(validate(numberArrSchema, numberSubj).error).toBe(undefined)

    const booleanArrSchema = {
      type: 'array',
      of: { type: 'boolean' },
    } as const satisfies Schema

    const booleanSubj = [true, false]

    expect(validate(booleanArrSchema, booleanSubj).data).toStrictEqual(
      booleanSubj
    )
    expect(validate(booleanArrSchema, booleanSubj).error).toBe(undefined)
  })

  it('validate: optional base short schema subject', () => {
    const arrWithUnd = [undefined, undefined]

    const optStrSchema = {
      type: 'array',
      of: { type: 'string', optional: true },
    } as const satisfies Schema

    const strSubject = ['x', 'y']

    expect(validate(optStrSchema, strSubject).data).toStrictEqual(strSubject)
    expect(validate(optStrSchema, strSubject).error).toBe(undefined)
    expect(validate(optStrSchema, arrWithUnd).data).toStrictEqual(arrWithUnd)
    expect(validate(optStrSchema, arrWithUnd).error).toBe(undefined)

    const optNumSchema = {
      type: 'array',
      of: { type: 'number', optional: true },
    } as const satisfies Schema

    const numSubject = [0, 1, 2, 3, 4]

    expect(validate(optNumSchema, numSubject).data).toStrictEqual(numSubject)
    expect(validate(optNumSchema, numSubject).error).toBe(undefined)
    expect(validate(optNumSchema, arrWithUnd).data).toStrictEqual(arrWithUnd)
    expect(validate(optNumSchema, arrWithUnd).error).toBe(undefined)

    const optBoolSchema = {
      type: 'array',
      of: { type: 'boolean', optional: true },
    } as const satisfies Schema

    const boolSubject = [true, true, false, true]

    expect(validate(optBoolSchema, boolSubject).data).toStrictEqual(boolSubject)
    expect(validate(optBoolSchema, boolSubject).error).toBe(undefined)
    expect(validate(optBoolSchema, arrWithUnd).data).toStrictEqual(arrWithUnd)
    expect(validate(optBoolSchema, arrWithUnd).error).toBe(undefined)
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

    const strLiteralSchema = {
      type: 'array',
      of: { type: 'literal', of: 'x' },
    } as const satisfies Schema

    const strLiteralSubj = ['x', 'x']

    expect(validate(strLiteralSchema, strLiteralSubj).data).toStrictEqual(
      strLiteralSubj
    )
    expect(validate(strLiteralSchema, strLiteralSubj).error).toBe(undefined)

    const numLiteralSchema = {
      type: 'array',
      of: { type: 'literal', of: 0 },
    } as const satisfies Schema

    const numLiteralSubj = [0, 0]

    expect(validate(numLiteralSchema, numLiteralSubj).data).toStrictEqual(
      numLiteralSubj
    )
    expect(validate(numLiteralSchema, numLiteralSubj).error).toBe(undefined)
  })

  it('validate: optional base detailed schema subject', () => {
    const arrWithUndef = [undefined, undefined]

    const strSchema = {
      type: 'array',
      of: { type: 'string', optional: true },
    } as const satisfies Schema

    const strSubj = ['x', 'y', 'x', 'y']

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

    const strLiteralSchema = {
      type: 'array',
      of: {
        type: 'literal',
        of: 'x',
        optional: true,
      },
    } as const satisfies Schema

    const strLiteralSubj = ['x', 'x']

    expect(validate(strLiteralSchema, strLiteralSubj).data).toStrictEqual(
      strLiteralSubj
    )
    expect(validate(strLiteralSchema, strLiteralSubj).error).toBe(undefined)
    expect(validate(strLiteralSchema, arrWithUndef).data).toStrictEqual(
      arrWithUndef
    )
    expect(validate(strLiteralSchema, arrWithUndef).error).toBe(undefined)

    const numLiteralSchema = {
      type: 'array',
      of: {
        type: 'literal',
        of: 0,
        optional: true,
      },
    } as const satisfies Schema

    const numLiteralSubj = [0, 0]

    expect(validate(numLiteralSchema, numLiteralSubj).data).toStrictEqual(
      numLiteralSubj
    )
    expect(validate(numLiteralSchema, numLiteralSubj).error).toBe(undefined)
    expect(validate(numLiteralSchema, arrWithUndef).data).toStrictEqual(
      arrWithUndef
    )
    expect(validate(numLiteralSchema, arrWithUndef).error).toBe(undefined)
  })

  it('validate: can be optional by itself', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
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
      of: { type: 'string' },
    } as const satisfies Schema

    const undefinedSubj = undefined

    expect(validate(schema, undefinedSubj).data).toBe(undefined)
    expect(validate(schema, undefinedSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(validate(schema, nullSubj).data).toBe(undefined)
    expect(validate(schema, nullSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const stringSubj = 'x'

    expect(validate(schema, stringSubj).data).toBe(undefined)
    expect(validate(schema, stringSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: stringSubj,
        schema,
        path: [],
      },
    ])
  })

  it('validate: optional array with invalid direct subject', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
      optional: true,
    } as const satisfies Schema

    const strSubject = 'x'

    expect(validate(schema, strSubject).data).toBe(undefined)
    expect(validate(schema, strSubject).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: strSubject,
        schema,
        path: [],
      },
    ])
  })

  it('validate: minLength INVALID_RANGE error', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
      minLength: 2,
    } as const satisfies Schema

    const subject = ['x']

    const validated = validate(schema, subject)

    expect(validated.data).toBe(undefined)
    expect(validated.error).toStrictEqual([
      {
        code: ERROR_CODE.invalidRange,
        path: [],
        schema,
        subject,
      },
    ])
  })

  it('validate: maxLength INVALID_RANGE error', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
      maxLength: 1,
    } as const satisfies Schema

    const subject = ['x', 'y']

    const validated = validate(schema, subject)

    expect(validated.data).toBe(undefined)
    expect(validated.error).toStrictEqual([
      {
        code: ERROR_CODE.invalidRange,
        path: [],
        schema,
        subject,
      },
    ])
  })

  it('validate: required array with two invalid subject arr elements', () => {
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

    expect(validate(schema, subject).data).toBe(undefined)
    expect(validate(schema, subject).error).toStrictEqual([
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

    expect(validate(schema, subject).data).toBe(undefined)
    expect(validate(schema, subject).error).toStrictEqual([
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

describe('VALIDATE flow returns schema subject reference', () => {
  it('validate: object -> array -> object -> number', () => {
    const schema = {
      type: 'object',
      of: {
        x: {
          type: 'array',
          of: {
            type: 'object',
            of: {
              x: { type: 'number' },
              y: { type: 'number' },
            },
          },
        },
      },
    } as const satisfies Schema

    const subject = {
      x: [
        {
          x: 0,
          y: 1,
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

  it('validate: array -> object -> number', () => {
    const schema = {
      type: 'array',
      of: {
        type: 'object',
        of: {
          x: { type: 'number' },
          y: { type: 'number' },
        },
      },
    } as const satisfies Schema

    const subject = [
      {
        x: 0,
        y: 1,
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

describe('Validate UNION schema with VALID subject', () => {
  it('validate: required mixed base schema union', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    } as const satisfies Schema

    const strSubj = 'x'

    expect(validate(schema, strSubj).data).toBe(strSubj)
    expect(validate(schema, strSubj).error).toBeUndefined()

    const numSubj = 0

    expect(validate(schema, numSubj).data).toBe(numSubj)
    expect(validate(schema, numSubj).error).toBeUndefined()

    const boolSubj = false

    expect(validate(schema, boolSubj).data).toBe(boolSubj)
    expect(validate(schema, boolSubj).error).toBeUndefined()
  })

  it('validate: optional mixed base schema union', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
      optional: true,
    } as const satisfies Schema

    const strSubj = 'x'

    expect(validate(schema, strSubj).data).toBe(strSubj)
    expect(validate(schema, strSubj).error).toBeUndefined()

    const numSubj = 0

    expect(validate(schema, numSubj).data).toBe(numSubj)
    expect(validate(schema, numSubj).error).toBeUndefined()

    const boolSubj = false

    expect(validate(schema, boolSubj).data).toBe(boolSubj)
    expect(validate(schema, boolSubj).error).toBeUndefined()

    const undefSubj = undefined

    expect(validate(schema, undefSubj).data).toBe(undefSubj)
    expect(validate(schema, undefSubj).error).toBeUndefined()
  })

  it('validate: LiteralSchema union', () => {
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

    expect(validate(schema, subj0).data).toStrictEqual(subj0)
    expect(validate(schema, subj0).error).toBeUndefined()

    const subj1 = 0

    expect(validate(schema, subj1).data).toStrictEqual(subj1)
    expect(validate(schema, subj1).error).toBeUndefined()

    const subjX = 'x'

    expect(validate(schema, subjX).data).toStrictEqual(subjX)
    expect(validate(schema, subjX).error).toBeUndefined()

    const subjY = 'y'

    expect(validate(schema, subjY).data).toStrictEqual(subjY)
    expect(validate(schema, subjY).error).toBeUndefined()
  })

  it('validate: ObjectSchema union', () => {
    const schema = {
      type: 'union',
      of: [
        { type: 'object', of: { x: { type: 'string' } } },
        { type: 'object', of: { y: { type: 'number' } } },
        { type: 'object', of: { z: { type: 'boolean' } } },
      ],
    } as const satisfies Schema

    const xSubj = { x: 'x' }

    expect(validate(schema, xSubj).data).toStrictEqual(xSubj)
    expect(validate(schema, xSubj).error).toBeUndefined()

    const ySubj = { y: 0 }

    expect(validate(schema, ySubj).data).toStrictEqual(ySubj)
    expect(validate(schema, ySubj).error).toBeUndefined()

    const zSubj = { z: false }

    expect(validate(schema, zSubj).data).toStrictEqual(zSubj)
    expect(validate(schema, zSubj).error).toBeUndefined()
  })

  it('validate: ArraySchema union', () => {
    const schema = {
      type: 'union',
      of: [
        { type: 'array', of: { type: 'string' } },
        { type: 'array', of: { type: 'number' } },
        { type: 'array', of: { type: 'boolean' } },
      ],
    } as const satisfies Schema

    const xSubj = ['x', 'y']

    expect(validate(schema, xSubj).data).toStrictEqual(xSubj)
    expect(validate(schema, xSubj).error).toBeUndefined()

    const ySubj = [0, 1]

    expect(validate(schema, ySubj).data).toStrictEqual(ySubj)
    expect(validate(schema, ySubj).error).toBeUndefined()

    const zSubj = [true, false]

    expect(validate(schema, zSubj).data).toStrictEqual(zSubj)
    expect(validate(schema, zSubj).error).toBeUndefined()
  })

  it('validate: union of all types', () => {
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

    expect(validate(schema, strSubj).data).toStrictEqual(strSubj)
    expect(validate(schema, strSubj).error).toBeUndefined()

    const numSubj = 3

    expect(validate(schema, numSubj).data).toStrictEqual(numSubj)
    expect(validate(schema, numSubj).error).toBeUndefined()

    const boolSubj = false

    expect(validate(schema, boolSubj).data).toStrictEqual(boolSubj)
    expect(validate(schema, boolSubj).error).toBeUndefined()

    const litZ = 'z'

    expect(validate(schema, litZ).data).toStrictEqual(litZ)
    expect(validate(schema, litZ).error).toBeUndefined()

    const lit2 = 2

    expect(validate(schema, lit2).data).toStrictEqual(lit2)
    expect(validate(schema, lit2).error).toBeUndefined()

    const objSubj = { x: 'x' }

    expect(validate(schema, objSubj).data).toStrictEqual(objSubj)
    expect(validate(schema, objSubj).error).toBeUndefined()

    const arrSubj = [0, 1]

    expect(validate(schema, arrSubj).data).toStrictEqual(arrSubj)
    expect(validate(schema, arrSubj).error).toBeUndefined()
  })
})

describe('Validate UNION schema with INVALID subject', () => {
  it('validate: required mixed base schema union', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    } as const satisfies Schema

    const undefSubj = undefined

    expect(validate(schema, undefSubj).data).toBeUndefined()
    expect(validate(schema, undefSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: undefSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(validate(schema, nullSubj).data).toBeUndefined()
    expect(validate(schema, nullSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const objSubj = {}

    expect(validate(schema, objSubj).data).toBeUndefined()
    expect(validate(schema, objSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: objSubj,
        schema,
        path: [],
      },
    ])
  })

  it('validate: optional mixed base schema union', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
      optional: true,
    } as const satisfies Schema

    const objSubj = {}

    expect(validate(schema, objSubj).data).toBeUndefined()
    expect(validate(schema, objSubj).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: objSubj,
        schema,
        path: [],
      },
    ])
  })

  it('validate: LiteralSchema union', () => {
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

    expect(validate(schema, subjY).data).toStrictEqual(subjY)
    expect(validate(schema, subjY).error).toBeUndefined()
  })

  it('validate: ObjectSchema union', () => {
    const schema = {
      type: 'union',
      of: [
        { type: 'object', of: { x: { type: 'string' } } },
        { type: 'object', of: { y: { type: 'number' } } },
        { type: 'object', of: { z: { type: 'boolean' } } },
      ],
    } as const satisfies Schema

    const subjZ = { z: 'x' }

    expect(validate(schema, subjZ).data).toBeUndefined()
    expect(validate(schema, subjZ).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: subjZ,
        schema,
        path: [],
      },
    ])
  })

  it('validate: ArraySchema union', () => {
    const schema = {
      type: 'union',
      of: [
        { type: 'array', of: { type: 'string' } },
        { type: 'array', of: { type: 'number' } },
        { type: 'array', of: { type: 'boolean' } },
      ],
    } as const satisfies Schema

    const subjZ = { z: 'x' }

    expect(validate(schema, subjZ).data).toBeUndefined()
    expect(validate(schema, subjZ).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: subjZ,
        schema,
        path: [],
      },
    ])
  })

  it('validate: union of all types', () => {
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

    expect(validate(schema, subjZ).data).toBeUndefined()
    expect(validate(schema, subjZ).error).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: subjZ,
        schema,
        path: [],
      },
    ])
  })
})

describe('Check validate subject type constraints', () => {
  it('validate: base detailed schema', () => {
    expect(() => validate({ type: 'string' }, undefined)).not.toThrow()
    expect(() => validate({ type: 'string' }, 0)).not.toThrow()
    expect(() =>
      validate({ type: 'string', optional: true }, undefined)
    ).not.toThrow()

    expect(() => validate({ type: 'number' }, undefined)).not.toThrow()
    expect(() => validate({ type: 'number' }, true)).not.toThrow()
    expect(() =>
      validate({ type: 'number', optional: true }, undefined)
    ).not.toThrow()

    expect(() => validate({ type: 'boolean' }, undefined)).not.toThrow()
    expect(() => validate({ type: 'boolean' }, 'x')).not.toThrow()
    expect(() =>
      validate({ type: 'boolean', optional: true }, undefined)
    ).not.toThrow()
  })

  it('validate: object schema', () => {
    expect(() =>
      validate(
        { type: 'object', of: { x: { type: 'string' } } } as const,
        undefined
      )
    ).not.toThrow()

    expect(() =>
      validate({ type: 'object', of: { x: { type: 'string' } } } as const, {
        y: 'x',
      })
    ).not.toThrow()

    expect(() =>
      validate(
        {
          type: 'object',
          of: { x: { type: 'string' } },
          optional: true,
        } as const,
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
      validate(
        { type: 'array', of: { type: 'string' }, optional: true },
        undefined
      )
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

describe('Extra validators guard/assert', () => {
  it('guard: should narrow subject type and return boolean', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'string' }, y: { type: 'number' } },
    } as const satisfies Schema

    const subject = { x: 'x', y: 0 } as unknown

    const guarded = guard(schema, subject)

    expect(guarded).toBe(true)
    expect(guard(schema, {})).toBe(false)

    if (guarded) {
      check<{ x: string; y: number }>(subject)
      // @ts-expect-error '{ x: string; y: number; }' is not '{ x: string; y: number; z: boolean; }'
      check<{ x: string; y: number; z: boolean }>(subject)
    }
  })
})
