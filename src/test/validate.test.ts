import { validate, guard } from '../validate'
import { ERROR_CODE } from '../error'
import { check, unknownX } from './test-utils'

import type { Schema } from '../types/compounds'

describe('Validate BASE schema with VALID subject', () => {
  it('validate: `{ type: "string" }` schema', () => {
    const schema = { type: 'string' } satisfies Schema
    const subject = 'x'

    expect(validate(schema, subject).right).toBe(subject)
    expect(validate(schema, subject).left).toBe(undefined)
  })

  it('validate: `{ type: "number" }` schema', () => {
    const schema = { type: 'number' } satisfies Schema
    const subject = 0

    expect(validate(schema, subject).right).toBe(subject)
    expect(validate(schema, subject).left).toBe(undefined)
  })

  it('validate: `{ type: "boolean" }` schema', () => {
    const schema = { type: 'boolean' } satisfies Schema
    const subject = false

    expect(validate(schema, subject).right).toBe(subject)
    expect(validate(schema, subject).left).toBe(undefined)
  })

  it('validate: `{ type: "literal" }` schema', () => {
    const schema = { type: 'literal', of: 'x' } as const satisfies Schema
    const subject = 'x'

    expect(validate(schema, subject).right).toBe(subject)
    expect(validate(schema, subject).left).toBe(undefined)
  })
})

describe('Validate BASE schema with INVALID subject', () => {
  it('validate: base detailed schema', () => {
    const detailedReqStrSchema = { type: 'string' } satisfies Schema
    const undefinedSubj = undefined

    expect(validate(detailedReqStrSchema, undefinedSubj).right).toBe(undefined)
    expect(validate(detailedReqStrSchema, undefinedSubj).left).toStrictEqual([
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

    expect(validate(detailedOptStrSchema, numberSubj).right).toBe(undefined)
    expect(validate(detailedOptStrSchema, numberSubj).left).toStrictEqual([
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
    }

    expect(validate(schema, subject).right).toStrictEqual(subject)
    expect(validate(schema, subject).left).toStrictEqual(undefined)
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
        undefinedJ: { type: 'literal', of: 'x', optional: true },
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
    } as const

    expect(validate(schema, subject).right).toStrictEqual(subject)
    expect(validate(schema, subject).left).toStrictEqual(undefined)
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

    expect(validate(schema, subject).right).toStrictEqual(subject)
    expect(validate(schema, subject).left).toStrictEqual(undefined)
  })

  it('validate: can be optional by itself', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'string' } },
      optional: true,
    } as const satisfies Schema

    expect(validate(schema, undefined).right).toBe(undefined)
    expect(validate(schema, undefined).left).toBe(undefined)
  })
})

describe('Validate OBJECT schema with INVALID subject', () => {
  it('validate: required object with invalid direct subject', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'string' } },
    } as const satisfies Schema

    const undefinedSubj = undefined

    expect(validate(schema, undefinedSubj).right).toBe(undefined)
    expect(validate(schema, undefinedSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(validate(schema, nullSubj).right).toBe(undefined)
    expect(validate(schema, nullSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const regExpSubj = /^x/

    expect(validate(schema, regExpSubj).right).toBe(undefined)
    expect(validate(schema, regExpSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: regExpSubj,
        schema,
        path: [],
      },
    ])

    const arraySubj = [] as unknown

    expect(validate(schema, arraySubj).right).toBe(undefined)
    expect(validate(schema, arraySubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: arraySubj,
        schema,
        path: [],
      },
    ])

    const mapSubj = new Map()

    expect(validate(schema, mapSubj).right).toBe(undefined)
    expect(validate(schema, mapSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: mapSubj,
        schema,
        path: [],
      },
    ])

    const setSubj = new Set()

    expect(validate(schema, setSubj).right).toBe(undefined)
    expect(validate(schema, setSubj).left).toStrictEqual([
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

    expect(validate(schema, subject).right).toBe(undefined)
    expect(validate(schema, subject).left).toStrictEqual([
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

    expect(validate(schema, subject).right).toBe(undefined)
    expect(validate(schema, subject).left).toStrictEqual([
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

    expect(validate(schema, subject).right).toBe(undefined)
    expect(validate(schema, subject).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: invalidSubject,
        schema: schema.of.x.of,
        path: ['x', 1],
      },
    ])
  })

  it('validate: subject with keys that are not specified in schema', () => {
    const schema = {
      type: 'object',
      of: {
        x: {
          type: 'object',
          of: {
            a: { type: 'string' },
          },
        },
      },
    } as const satisfies Schema

    const subject = {
      x: {
        a: 'string',
        b: 'unexpectedKey',
      },
    }

    const expected = [
      {
        code: ERROR_CODE.invalidType,
        schema: schema.of.x,
        subject: subject.x,
        path: ['x'],
      },
    ]

    const actual = validate(schema, subject).left

    expect(actual).toStrictEqual(expected)
  })
})

describe('Validate ARRAY schema with VALID subject', () => {
  it('validate: required base short schema subject', () => {
    const stringArrSchema = {
      type: 'array',
      of: { type: 'string' },
    } as const satisfies Schema

    const stringSubj = ['x', 'y']

    expect(validate(stringArrSchema, stringSubj).right).toStrictEqual(
      stringSubj
    )
    expect(validate(stringArrSchema, stringSubj).left).toBe(undefined)

    const numberArrSchema = {
      type: 'array',
      of: { type: 'number' },
    } as const satisfies Schema

    const numberSubj = [0, 1]

    expect(validate(numberArrSchema, numberSubj).right).toStrictEqual(
      numberSubj
    )
    expect(validate(numberArrSchema, numberSubj).left).toBe(undefined)

    const booleanArrSchema = {
      type: 'array',
      of: { type: 'boolean' },
    } as const satisfies Schema

    const booleanSubj = [true, false]

    expect(validate(booleanArrSchema, booleanSubj).right).toStrictEqual(
      booleanSubj
    )
    expect(validate(booleanArrSchema, booleanSubj).left).toBe(undefined)
  })

  it('validate: optional base short schema subject', () => {
    const arrWithUnd = [undefined, undefined]

    const optStrSchema = {
      type: 'array',
      of: { type: 'string', optional: true },
    } as const satisfies Schema

    const strSubject = ['x', 'y']

    expect(validate(optStrSchema, strSubject).right).toStrictEqual(strSubject)
    expect(validate(optStrSchema, strSubject).left).toBe(undefined)
    expect(validate(optStrSchema, arrWithUnd).right).toStrictEqual(arrWithUnd)
    expect(validate(optStrSchema, arrWithUnd).left).toBe(undefined)

    const optNumSchema = {
      type: 'array',
      of: { type: 'number', optional: true },
    } as const satisfies Schema

    const numSubject = [0, 1, 2, 3, 4]

    expect(validate(optNumSchema, numSubject).right).toStrictEqual(numSubject)
    expect(validate(optNumSchema, numSubject).left).toBe(undefined)
    expect(validate(optNumSchema, arrWithUnd).right).toStrictEqual(arrWithUnd)
    expect(validate(optNumSchema, arrWithUnd).left).toBe(undefined)

    const optBoolSchema = {
      type: 'array',
      of: { type: 'boolean', optional: true },
    } as const satisfies Schema

    const boolSubject = [true, true, false, true]

    expect(validate(optBoolSchema, boolSubject).right).toStrictEqual(
      boolSubject
    )
    expect(validate(optBoolSchema, boolSubject).left).toBe(undefined)
    expect(validate(optBoolSchema, arrWithUnd).right).toStrictEqual(arrWithUnd)
    expect(validate(optBoolSchema, arrWithUnd).left).toBe(undefined)
  })

  it('validate: required base detailed schema subject', () => {
    const strSchema = {
      type: 'array',
      of: { type: 'string' },
    } as const satisfies Schema

    const strSubj = ['x', 'y', 'x', 'y']

    expect(validate(strSchema, strSubj).right).toStrictEqual(strSubj)
    expect(validate(strSchema, strSubj).left).toBe(undefined)

    const numSchema = {
      type: 'array',
      of: { type: 'number' },
    } as const satisfies Schema

    const numSubj = [0, 1, 2, 3, 4]

    expect(validate(numSchema, numSubj).right).toStrictEqual(numSubj)
    expect(validate(numSchema, numSubj).left).toBe(undefined)

    const boolSchema = {
      type: 'array',
      of: { type: 'boolean' },
    } as const satisfies Schema

    const boolSubj = [true, true, false, true]

    expect(validate(boolSchema, boolSubj).right).toStrictEqual(boolSubj)
    expect(validate(boolSchema, boolSubj).left).toBe(undefined)

    const strLiteralSchema = {
      type: 'array',
      of: { type: 'literal', of: 'x' },
    } as const satisfies Schema

    const strLiteralSubj = ['x', 'x']

    expect(validate(strLiteralSchema, strLiteralSubj).right).toStrictEqual(
      strLiteralSubj
    )
    expect(validate(strLiteralSchema, strLiteralSubj).left).toBe(undefined)

    const numLiteralSchema = {
      type: 'array',
      of: { type: 'literal', of: 0 },
    } as const satisfies Schema

    const numLiteralSubj = [0, 0]

    expect(validate(numLiteralSchema, numLiteralSubj).right).toStrictEqual(
      numLiteralSubj
    )
    expect(validate(numLiteralSchema, numLiteralSubj).left).toBe(undefined)
  })

  it('validate: optional base detailed schema subject', () => {
    const arrWithUndef = [undefined, undefined]

    const strSchema = {
      type: 'array',
      of: { type: 'string', optional: true },
    } as const satisfies Schema

    const strSubj = ['x', 'y', 'x', 'y']

    expect(validate(strSchema, strSubj).right).toStrictEqual(strSubj)
    expect(validate(strSchema, strSubj).left).toBe(undefined)
    expect(validate(strSchema, arrWithUndef).right).toStrictEqual(arrWithUndef)
    expect(validate(strSchema, arrWithUndef).left).toBe(undefined)

    const numSchema = {
      type: 'array',
      of: { type: 'number', optional: true },
    } as const satisfies Schema

    const numSubj = [0, 1, 2, 3, 4]

    expect(validate(numSchema, numSubj).right).toStrictEqual(numSubj)
    expect(validate(numSchema, numSubj).left).toBe(undefined)
    expect(validate(numSchema, arrWithUndef).right).toStrictEqual(arrWithUndef)
    expect(validate(numSchema, arrWithUndef).left).toBe(undefined)

    const boolSchema = {
      type: 'array',
      of: { type: 'boolean', optional: true },
    } as const satisfies Schema

    const boolSubj = [true, true, false, true]

    expect(validate(boolSchema, boolSubj).right).toStrictEqual(boolSubj)
    expect(validate(boolSchema, boolSubj).left).toBe(undefined)
    expect(validate(boolSchema, arrWithUndef).right).toStrictEqual(arrWithUndef)
    expect(validate(boolSchema, arrWithUndef).left).toBe(undefined)

    const strLiteralSchema = {
      type: 'array',
      of: {
        type: 'literal',
        of: 'x',
        optional: true,
      },
    } as const satisfies Schema

    const strLiteralSubj = ['x', 'x']

    expect(validate(strLiteralSchema, strLiteralSubj).right).toStrictEqual(
      strLiteralSubj
    )
    expect(validate(strLiteralSchema, strLiteralSubj).left).toBe(undefined)
    expect(validate(strLiteralSchema, arrWithUndef).right).toStrictEqual(
      arrWithUndef
    )
    expect(validate(strLiteralSchema, arrWithUndef).left).toBe(undefined)

    const numLiteralSchema = {
      type: 'array',
      of: {
        type: 'literal',
        of: 0,
        optional: true,
      },
    } as const satisfies Schema

    const numLiteralSubj = [0, 0]

    expect(validate(numLiteralSchema, numLiteralSubj).right).toStrictEqual(
      numLiteralSubj
    )
    expect(validate(numLiteralSchema, numLiteralSubj).left).toBe(undefined)
    expect(validate(numLiteralSchema, arrWithUndef).right).toStrictEqual(
      arrWithUndef
    )
    expect(validate(numLiteralSchema, arrWithUndef).left).toBe(undefined)
  })

  it('validate: can be optional by itself', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
      optional: true,
    } as const satisfies Schema

    expect(validate(schema, undefined).right).toBe(undefined)
    expect(validate(schema, undefined).left).toBe(undefined)
  })
})

describe('Validate ARRAY schema with INVALID subject', () => {
  it('validate: required array with invalid direct subject', () => {
    const schema = {
      type: 'array',
      of: { type: 'string' },
    } as const satisfies Schema

    const undefinedSubj = undefined

    expect(validate(schema, undefinedSubj).right).toBe(undefined)
    expect(validate(schema, undefinedSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: undefinedSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(validate(schema, nullSubj).right).toBe(undefined)
    expect(validate(schema, nullSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const stringSubj = 'x'

    expect(validate(schema, stringSubj).right).toBe(undefined)
    expect(validate(schema, stringSubj).left).toStrictEqual([
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

    expect(validate(schema, strSubject).right).toBe(undefined)
    expect(validate(schema, strSubject).left).toStrictEqual([
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

    expect(validated.right).toBe(undefined)
    expect(validated.left).toStrictEqual([
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

    expect(validated.right).toBe(undefined)
    expect(validated.left).toStrictEqual([
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

    expect(validate(schema, subject).right).toBe(undefined)
    expect(validate(schema, subject).left).toStrictEqual([
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

    expect(validate(schema, subject).right).toBe(undefined)
    expect(validate(schema, subject).left).toStrictEqual([
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

    const { right } = validate(schema, subject)

    if (!right) {
      throw Error('Not expected')
    }

    expect(right.x === subject.x).toBe(true)
    expect(right.x[0] === subject.x[0]).toBe(true)
    expect(right.x[0]?.x === subject.x[0]?.x).toBe(true)
    expect(right.x[0]?.y === subject.x[0]?.y).toBe(true)
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

    const { right } = validate(schema, subject)

    if (!right) {
      throw Error('Not expected')
    }

    expect(right[0] === subject[0]).toBe(true)
    expect(right[0]?.x === subject[0]?.x).toBe(true)
    expect(right[0]?.y === subject[0]?.y).toBe(true)
  })
})

describe('Validate UNION schema with VALID subject', () => {
  it('validate: required mixed base schema union', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    } as const satisfies Schema

    const strSubj = 'x'

    expect(validate(schema, strSubj).right).toBe(strSubj)
    expect(validate(schema, strSubj).left).toBeUndefined()

    const numSubj = 0

    expect(validate(schema, numSubj).right).toBe(numSubj)
    expect(validate(schema, numSubj).left).toBeUndefined()

    const boolSubj = false

    expect(validate(schema, boolSubj).right).toBe(boolSubj)
    expect(validate(schema, boolSubj).left).toBeUndefined()
  })

  it('validate: optional mixed base schema union', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
      optional: true,
    } as const satisfies Schema

    const strSubj = 'x'

    expect(validate(schema, strSubj).right).toBe(strSubj)
    expect(validate(schema, strSubj).left).toBeUndefined()

    const numSubj = 0

    expect(validate(schema, numSubj).right).toBe(numSubj)
    expect(validate(schema, numSubj).left).toBeUndefined()

    const boolSubj = false

    expect(validate(schema, boolSubj).right).toBe(boolSubj)
    expect(validate(schema, boolSubj).left).toBeUndefined()

    const undefSubj = undefined

    expect(validate(schema, undefSubj).right).toBe(undefSubj)
    expect(validate(schema, undefSubj).left).toBeUndefined()
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

    expect(validate(schema, subj0).right).toStrictEqual(subj0)
    expect(validate(schema, subj0).left).toBeUndefined()

    const subj1 = 0

    expect(validate(schema, subj1).right).toStrictEqual(subj1)
    expect(validate(schema, subj1).left).toBeUndefined()

    const subjX = 'x'

    expect(validate(schema, subjX).right).toStrictEqual(subjX)
    expect(validate(schema, subjX).left).toBeUndefined()

    const subjY = 'y'

    expect(validate(schema, subjY).right).toStrictEqual(subjY)
    expect(validate(schema, subjY).left).toBeUndefined()
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

    expect(validate(schema, xSubj).right).toStrictEqual(xSubj)
    expect(validate(schema, xSubj).left).toBeUndefined()

    const ySubj = { y: 0 }

    expect(validate(schema, ySubj).right).toStrictEqual(ySubj)
    expect(validate(schema, ySubj).left).toBeUndefined()

    const zSubj = { z: false }

    expect(validate(schema, zSubj).right).toStrictEqual(zSubj)
    expect(validate(schema, zSubj).left).toBeUndefined()
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

    expect(validate(schema, xSubj).right).toStrictEqual(xSubj)
    expect(validate(schema, xSubj).left).toBeUndefined()

    const ySubj = [0, 1]

    expect(validate(schema, ySubj).right).toStrictEqual(ySubj)
    expect(validate(schema, ySubj).left).toBeUndefined()

    const zSubj = [true, false]

    expect(validate(schema, zSubj).right).toStrictEqual(zSubj)
    expect(validate(schema, zSubj).left).toBeUndefined()
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

    expect(validate(schema, strSubj).right).toStrictEqual(strSubj)
    expect(validate(schema, strSubj).left).toBeUndefined()

    const numSubj = 3

    expect(validate(schema, numSubj).right).toStrictEqual(numSubj)
    expect(validate(schema, numSubj).left).toBeUndefined()

    const boolSubj = false

    expect(validate(schema, boolSubj).right).toStrictEqual(boolSubj)
    expect(validate(schema, boolSubj).left).toBeUndefined()

    const litZ = 'z'

    expect(validate(schema, litZ).right).toStrictEqual(litZ)
    expect(validate(schema, litZ).left).toBeUndefined()

    const lit2 = 2

    expect(validate(schema, lit2).right).toStrictEqual(lit2)
    expect(validate(schema, lit2).left).toBeUndefined()

    const objSubj = { x: 'x' }

    expect(validate(schema, objSubj).right).toStrictEqual(objSubj)
    expect(validate(schema, objSubj).left).toBeUndefined()

    const arrSubj = [0, 1]

    expect(validate(schema, arrSubj).right).toStrictEqual(arrSubj)
    expect(validate(schema, arrSubj).left).toBeUndefined()
  })
})

describe('Validate UNION schema with INVALID subject', () => {
  it('validate: required mixed base schema union', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    } as const satisfies Schema

    const undefSubj = undefined

    expect(validate(schema, undefSubj).right).toBeUndefined()
    expect(validate(schema, undefSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: undefSubj,
        schema,
        path: [],
      },
    ])

    const nullSubj = null

    expect(validate(schema, nullSubj).right).toBeUndefined()
    expect(validate(schema, nullSubj).left).toStrictEqual([
      {
        code: ERROR_CODE.invalidType,
        subject: nullSubj,
        schema,
        path: [],
      },
    ])

    const objSubj = {}

    expect(validate(schema, objSubj).right).toBeUndefined()
    expect(validate(schema, objSubj).left).toStrictEqual([
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

    expect(validate(schema, objSubj).right).toBeUndefined()
    expect(validate(schema, objSubj).left).toStrictEqual([
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

    expect(validate(schema, subjY).right).toStrictEqual(subjY)
    expect(validate(schema, subjY).left).toBeUndefined()
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

    expect(validate(schema, subjZ).right).toBeUndefined()
    expect(validate(schema, subjZ).left).toStrictEqual([
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

    expect(validate(schema, subjZ).right).toBeUndefined()
    expect(validate(schema, subjZ).left).toStrictEqual([
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

    expect(validate(schema, subjZ).right).toBeUndefined()
    expect(validate(schema, subjZ).left).toStrictEqual([
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

    if (parsed.left) {
      throw Error('Not expected')
    }

    check<string & { __key: 'value' }>(unknownX as typeof parsed.right.x)
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
