import { describe, it, expect } from 'vitest'
import * as x from '../../src/index.js'
import * as fixture from '../fixtures.js'

import type { StructSharedKeys } from '../type.ts'

describe('Type inference and parse by schema/construct/struct (foldA)', () => {
  it('required', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'boolean' }, { type: 'literal', of: 0 }],
    } as const satisfies x.Schema

    const struct = x.union([x.boolean(), x.literal(0)])

    type ExpectedSubj = boolean | 0

    const subjects: Array<ExpectedSubj> = [false, true, 0]

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct/~standard subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      type StandardSubj = NonNullable<
        (typeof struct)['~standard']['types']
      >['output']

      x.tCh<StandardSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.ParseResult<ExpectedSubj>

      const parsed = x.parse(schema, undefined)

      type SchemaParsed = typeof parsed

      x.tCh<SchemaParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, SchemaParsed>()

      type ConstructParsed = ReturnType<typeof construct.parse>

      x.tCh<ConstructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, ConstructParsed>()

      type StructParsed = ReturnType<typeof struct.parse>

      x.tCh<StructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, StructParsed>()

      type StandardParsed = Extract<
        ReturnType<(typeof struct)['~standard']['validate']>,
        { value: unknown }
      >['value']

      x.tCh<StandardParsed, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardParsed>()

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.error).toBe(undefined)
        expect(schemaParsed.data).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.error).toBe(undefined)
        expect(constructParsed.data).toStrictEqual(subj)

        const structParsed = struct.parse(subj)

        expect(structParsed.error).toBe(undefined)
        expect(structParsed.data).toStrictEqual(subj)

        const standardParsed = struct['~standard'].validate(subj)

        if (standardParsed instanceof Promise) {
          throw Error('Not expected')
        }

        if (standardParsed.issues !== undefined) {
          throw Error('not expected')
        }

        expect(standardParsed.value).toStrictEqual(subj)
      }
    }
  })

  it('optional', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'boolean' }, { type: 'literal', of: 0 }],
      optional: true,
    } as const satisfies x.Schema

    const struct = x.union([x.boolean(), x.literal(0)]).optional()

    type ExpectedSubj = boolean | 0 | undefined

    const subjects: Array<ExpectedSubj> = [false, true, 0, undefined]

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct/~standard subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      type StandardSubj = NonNullable<
        (typeof struct)['~standard']['types']
      >['output']

      x.tCh<StandardSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.ParseResult<ExpectedSubj>

      const parsed = x.parse(schema, undefined)

      type SchemaParsed = typeof parsed

      x.tCh<SchemaParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, SchemaParsed>()

      type ConstructParsed = ReturnType<typeof construct.parse>

      x.tCh<ConstructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, ConstructParsed>()

      type StructParsed = ReturnType<typeof struct.parse>

      x.tCh<StructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, StructParsed>()

      type StandardParsed = Extract<
        ReturnType<(typeof struct)['~standard']['validate']>,
        { value: unknown }
      >['value']

      x.tCh<StandardParsed, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardParsed>()

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.error).toBe(undefined)
        expect(schemaParsed.data).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.error).toBe(undefined)
        expect(constructParsed.data).toStrictEqual(subj)

        const structParsed = struct.parse(subj)

        expect(structParsed.error).toBe(undefined)
        expect(structParsed.data).toStrictEqual(subj)

        const standardParsed = struct['~standard'].validate(subj)

        if (standardParsed instanceof Promise) {
          throw Error('Not expected')
        }

        if (standardParsed.issues !== undefined) {
          throw Error('not expected')
        }

        expect(standardParsed.value).toStrictEqual(subj)
      }
    }
  })

  it('nullable', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'boolean' }, { type: 'literal', of: 0 }],
      nullable: true,
    } as const satisfies x.Schema

    const struct = x.union([x.boolean(), x.literal(0)]).nullable()

    type ExpectedSubj = boolean | 0 | null

    const subjects: Array<ExpectedSubj> = [false, true, 0, null]

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct/~standard subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      type StandardSubj = NonNullable<
        (typeof struct)['~standard']['types']
      >['output']

      x.tCh<StandardSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.ParseResult<ExpectedSubj>

      const parsed = x.parse(schema, undefined)

      type SchemaParsed = typeof parsed

      x.tCh<SchemaParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, SchemaParsed>()

      type ConstructParsed = ReturnType<typeof construct.parse>

      x.tCh<ConstructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, ConstructParsed>()

      type StructParsed = ReturnType<typeof struct.parse>

      x.tCh<StructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, StructParsed>()

      type StandardParsed = Extract<
        ReturnType<(typeof struct)['~standard']['validate']>,
        { value: unknown }
      >['value']

      x.tCh<StandardParsed, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardParsed>()

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.error).toBe(undefined)
        expect(schemaParsed.data).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.error).toBe(undefined)
        expect(constructParsed.data).toStrictEqual(subj)

        const structParsed = struct.parse(subj)

        expect(structParsed.error).toBe(undefined)
        expect(structParsed.data).toStrictEqual(subj)

        const standardParsed = struct['~standard'].validate(subj)

        if (standardParsed instanceof Promise) {
          throw Error('Not expected')
        }

        if (standardParsed.issues !== undefined) {
          throw Error('not expected')
        }

        expect(standardParsed.value).toStrictEqual(subj)
      }
    }
  })

  it('optional + nullable', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'boolean' }, { type: 'literal', of: 0 }],
      optional: true,
      nullable: true,
    } as const satisfies x.Schema

    const struct = x
      .union([x.boolean(), x.literal(0)])
      .optional()
      .nullable()

    type ExpectedSubj = boolean | 0 | undefined | undefined | null

    const subjects: Array<ExpectedSubj> = [false, true, 0, undefined, null]

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct/~standard subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      type StandardSubj = NonNullable<
        (typeof struct)['~standard']['types']
      >['output']

      x.tCh<StandardSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.ParseResult<ExpectedSubj>

      const parsed = x.parse(schema, undefined)

      type SchemaParsed = typeof parsed

      x.tCh<SchemaParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, SchemaParsed>()

      type ConstructParsed = ReturnType<typeof construct.parse>

      x.tCh<ConstructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, ConstructParsed>()

      type StructParsed = ReturnType<typeof struct.parse>

      x.tCh<StructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, StructParsed>()

      type StandardParsed = Extract<
        ReturnType<(typeof struct)['~standard']['validate']>,
        { value: unknown }
      >['value']

      x.tCh<StandardParsed, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardParsed>()

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.error).toBe(undefined)
        expect(schemaParsed.data).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.error).toBe(undefined)
        expect(constructParsed.data).toStrictEqual(subj)

        const structParsed = struct.parse(subj)

        expect(structParsed.error).toBe(undefined)
        expect(structParsed.data).toStrictEqual(subj)

        const standardParsed = struct['~standard'].validate(subj)

        if (standardParsed instanceof Promise) {
          throw Error('Not expected')
        }

        if (standardParsed.issues !== undefined) {
          throw Error('not expected')
        }

        expect(standardParsed.value).toStrictEqual(subj)
      }
    }
  })
})

describe('Struct parameter keys reduction and schema immutability (foldB)', () => {
  it('optional', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'boolean' }],
      optional: true,
    } as const satisfies x.Schema

    const prevStruct = x.union([x.boolean()])
    const struct = prevStruct.optional()

    type ExpectedKeys =
      StructSharedKeys | 'description' | 'nullable' | 'discriminant'

    foldB: {
      const construct = x.makeStruct(schema)

      /* ensure that struct keys are reduced after application */

      type StructKeys = keyof typeof struct

      x.tCh<StructKeys, ExpectedKeys>()
      x.tCh<ExpectedKeys, StructKeys>()

      type ConstructKeys = keyof typeof construct

      x.tCh<ConstructKeys, ExpectedKeys>()
      x.tCh<ExpectedKeys, ConstructKeys>()

      /* ensure that construct/struct schema types are identical  */

      type ExpectedSchema = typeof schema
      type StructSchema = typeof struct.__schema

      x.tCh<StructSchema, ExpectedSchema>()
      x.tCh<ExpectedSchema, StructSchema>()

      type ConstructSchema = typeof struct.__schema

      x.tCh<ConstructSchema, ExpectedSchema>()
      x.tCh<ExpectedSchema, ConstructSchema>()

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* runtime schema parameter application immutability check */

      expect(prevStruct.__schema === struct.__schema).toBe(false)
    }
  })

  it('optional + nullable', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'boolean' }],
      optional: true,
      nullable: true,
    } as const satisfies x.Schema

    const prevStruct = x.union([x.boolean()]).optional()
    const struct = prevStruct.nullable()

    type ExpectedKeys = StructSharedKeys | 'description' | 'discriminant'

    foldB: {
      const construct = x.makeStruct(schema)

      /* ensure that struct keys are reduced after application */

      type StructKeys = keyof typeof struct

      x.tCh<StructKeys, ExpectedKeys>()
      x.tCh<ExpectedKeys, StructKeys>()

      type ConstructKeys = keyof typeof construct

      x.tCh<ConstructKeys, ExpectedKeys>()
      x.tCh<ExpectedKeys, ConstructKeys>()

      /* ensure that construct/struct schema types are identical  */

      type ExpectedSchema = typeof schema
      type StructSchema = typeof struct.__schema

      x.tCh<StructSchema, ExpectedSchema>()
      x.tCh<ExpectedSchema, StructSchema>()

      type ConstructSchema = typeof struct.__schema

      x.tCh<ConstructSchema, ExpectedSchema>()
      x.tCh<ExpectedSchema, ConstructSchema>()

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* runtime schema parameter application immutability check */

      expect(prevStruct.__schema === struct.__schema).toBe(false)
    }
  })

  it('optional + nullable + description', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'boolean' }],
      optional: true,
      nullable: true,
      description: 'description-value',
    } as const satisfies x.Schema

    const prevStruct = x.union([x.boolean()]).optional().nullable()
    const struct = prevStruct.description(schema.description)

    type ExpectedKeys = StructSharedKeys | 'discriminant'

    foldB: {
      const construct = x.makeStruct(schema)

      /* ensure that struct keys are reduced after application */

      type StructKeys = keyof typeof struct

      x.tCh<StructKeys, ExpectedKeys>()
      x.tCh<ExpectedKeys, StructKeys>()

      type ConstructKeys = keyof typeof construct

      x.tCh<ConstructKeys, ExpectedKeys>()
      x.tCh<ExpectedKeys, ConstructKeys>()

      /* ensure that construct/struct schema types are identical  */

      type ExpectedSchema = typeof schema
      type StructSchema = typeof struct.__schema

      x.tCh<StructSchema, ExpectedSchema>()
      x.tCh<ExpectedSchema, StructSchema>()

      type ConstructSchema = typeof struct.__schema

      x.tCh<ConstructSchema, ExpectedSchema>()
      x.tCh<ExpectedSchema, ConstructSchema>()

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* runtime schema parameter application immutability check */

      expect(prevStruct.__schema === struct.__schema).toBe(false)
    }
  })

  it('description + nullable + optional', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'boolean' }],
      optional: true,
      nullable: true,
      description: 'description-value',
    } as const satisfies x.Schema

    const prevStruct = x
      .union([x.boolean()])
      .description(schema.description)
      .nullable()

    const struct = prevStruct.optional()

    type ExpectedKeys = StructSharedKeys | 'discriminant'

    foldB: {
      const construct = x.makeStruct(schema)

      /* ensure that struct keys are reduced after application */

      type StructKeys = keyof typeof struct

      x.tCh<StructKeys, ExpectedKeys>()
      x.tCh<ExpectedKeys, StructKeys>()

      type ConstructKeys = keyof typeof construct

      x.tCh<ConstructKeys, ExpectedKeys>()
      x.tCh<ExpectedKeys, ConstructKeys>()

      /* ensure that construct/struct schema types are identical  */

      type ExpectedSchema = typeof schema
      type StructSchema = typeof struct.__schema

      x.tCh<StructSchema, ExpectedSchema>()
      x.tCh<ExpectedSchema, StructSchema>()

      type ConstructSchema = typeof struct.__schema

      x.tCh<ConstructSchema, ExpectedSchema>()
      x.tCh<ExpectedSchema, ConstructSchema>()

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* runtime schema parameter application immutability check */

      expect(prevStruct.__schema === struct.__schema).toBe(false)
    }
  })
})

describe('ERROR_CODE.invalidUnion (foldC, foldE)', () => {
  const expectedErrorCode = x.ERROR_CODE.invalidUnion

  it('iterate over fixture.DATA_TYPE', () => {
    const schema = {
      type: 'union',
      of: [{ type: 'boolean' }, { type: 'number' }],
    } as const satisfies x.Schema

    const struct = x.union([x.boolean(), x.number()])
    const source = fixture.DATA_TYPE.filter(
      ([type]) => type !== 'boolean' && type !== 'number'
    )

    foldC: {
      const construct = x.makeStruct(schema)

      for (const [kind, types] of source) {
        if (kind === schema.type) {
          continue
        }

        for (const subject of types) {
          const expectedError = [
            {
              code: expectedErrorCode,
              schema: schema,
              path: [],
            },
          ]

          const parsedSchema = x.parse(schema, subject)
          const parsedConstruct = construct.parse(subject)
          const parsedStruct = struct.parse(subject)

          expect(parsedSchema.error).toStrictEqual(expectedError)
          expect(parsedConstruct.error).toStrictEqual(expectedError)
          expect(parsedStruct.error).toStrictEqual(expectedError)

          const parsedStandard = struct['~standard'].validate(subject)

          if (parsedStandard instanceof Promise) {
            throw Error('Not expected')
          }

          expect(parsedStandard.issues).toStrictEqual([
            { message: expectedErrorCode, path: [] },
          ])
        }
      }
    }
  })

  it('InvalidSubject error of nested schema should have correct path/schema/subject', () => {
    const schema = {
      type: 'record',
      of: {
        type: 'array',
        of: {
          type: 'object',
          of: {
            y: { type: 'union', of: [{ type: 'literal', of: '_' }] },
          },
        },
      },
    } as const satisfies x.Schema

    const struct = x.record(x.array(x.object({ y: x.union([x.literal('_')]) })))

    // prettier-ignore
    const samples: Array<[
        subj: Record<string, Array<{ y: unknown }>>,
        invalidSubj: unknown,
        invalidSubjSchema: x.Schema,
        errorPath: x.ErrorPath,
      ]
    > = [
      [{ x: [{ y: '+' }, { y: '_' }, { y: '_' }] }, '+', schema.of.of.of.y, ['x', 0, 'y']],
      [{ y: [{ y: '_' }, { y: '+' }, { y: '_' }] }, '+', schema.of.of.of.y, ['y', 1, 'y']],
      [{ z: [{ y: '_' }, { y: '_' }, { y: '+' }] }, '+', schema.of.of.of.y, ['z', 2, 'y']],
    ]

    foldE: {
      const construct = x.makeStruct(schema)

      for (const [subject, , invalidSubjSchema, path] of samples) {
        const expectedError = [
          {
            path,
            code: expectedErrorCode,
            schema: invalidSubjSchema,
          },
        ]

        const parsedSchema = x.parse(schema, subject)
        const parsedConstruct = construct.parse(subject)
        const parsedStruct = struct.parse(subject)

        expect(parsedSchema.error).toStrictEqual(expectedError)
        expect(parsedConstruct.error).toStrictEqual(expectedError)
        expect(parsedStruct.error).toStrictEqual(expectedError)

        const parsedStandard = struct['~standard'].validate(subject)

        if (parsedStandard instanceof Promise) {
          throw Error('Not expected')
        }

        expect(parsedStandard.issues).toStrictEqual([
          { path, message: expectedErrorCode },
        ])
      }
    }
  })

  it('reports a single invalidUnion error, not one per failed branch, since the subject was never required to satisfy any specific branch', () => {
    const struct = x.union([x.string().minLength(5), x.number()])

    // fails minLength on branch 1 AND is the wrong type for branch 2 —
    // still exactly one error, not two
    const parsed = struct.parse('ab')

    expect(parsed.error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidUnion,
        path: [],
        schema: {
          type: 'union',
          of: [{ type: 'string', minLength: 5 }, { type: 'number' }],
        },
      },
    ])
  })
})

describe('Compound schema specifics (foldA)', () => {
  it('nested primitive schema: optional + nullable + brand', () => {
    const schema = {
      type: 'union',
      of: [
        {
          type: 'boolean',
          optional: true,
          nullable: true,
          brand: ['x', 'y'],
        },
      ],
    } as const satisfies x.Schema

    const struct = x.union([
      x
        .boolean()
        .optional()
        .nullable()
        .brand(...schema.of[0].brand),
    ])

    type Branded = boolean & { __x: 'y' }
    type ExpectedSubj = Branded | undefined | null

    const subjects = [
      true as Branded,
      false as Branded,
      undefined,
      null,
    ] as const satisfies Array<ExpectedSubj>

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct/~standard subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      type StandardSubj = NonNullable<
        (typeof struct)['~standard']['types']
      >['output']

      x.tCh<StandardSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.ParseResult<ExpectedSubj>

      const parsed = x.parse(schema, undefined)

      type SchemaParsed = typeof parsed

      x.tCh<SchemaParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, SchemaParsed>()

      type ConstructParsed = ReturnType<typeof construct.parse>

      x.tCh<ConstructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, ConstructParsed>()

      type StructParsed = ReturnType<typeof struct.parse>

      x.tCh<StructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, StructParsed>()

      type StandardParsed = Extract<
        ReturnType<(typeof struct)['~standard']['validate']>,
        { value: unknown }
      >['value']

      x.tCh<StandardParsed, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardParsed>()

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.error).toBe(undefined)
        expect(schemaParsed.data).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.error).toBe(undefined)
        expect(constructParsed.data).toStrictEqual(subj)

        const structParsed = struct.parse(subj)

        expect(structParsed.error).toBe(undefined)
        expect(structParsed.data).toStrictEqual(subj)

        const standardParsed = struct['~standard'].validate(subj)

        if (standardParsed instanceof Promise) {
          throw Error('Not expected')
        }

        if (standardParsed.issues !== undefined) {
          throw Error('not expected')
        }

        expect(standardParsed.value).toStrictEqual(subj)
      }
    }
  })

  it('nested compound schema: optional + nullable', () => {
    const schema = {
      type: 'union',
      of: [
        {
          type: 'array',
          of: { type: 'boolean' },
          optional: true,
          nullable: true,
        },
      ],
    } as const satisfies x.Schema

    const struct = x.union([x.array(x.boolean()).optional().nullable()])

    type ExpectedSubj = Array<boolean> | undefined | null

    const subjects = [[], null, [true]] as const satisfies Array<ExpectedSubj>

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct/~standard subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      type StandardSubj = NonNullable<
        (typeof struct)['~standard']['types']
      >['output']

      x.tCh<StandardSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.ParseResult<ExpectedSubj>

      const parsed = x.parse(schema, undefined)

      type SchemaParsed = typeof parsed

      x.tCh<SchemaParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, SchemaParsed>()

      type ConstructParsed = ReturnType<typeof construct.parse>

      x.tCh<ConstructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, ConstructParsed>()

      type StructParsed = ReturnType<typeof struct.parse>

      x.tCh<StructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, StructParsed>()

      type StandardParsed = Extract<
        ReturnType<(typeof struct)['~standard']['validate']>,
        { value: unknown }
      >['value']

      x.tCh<StandardParsed, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardParsed>()

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.error).toBe(undefined)
        expect(schemaParsed.data).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.error).toBe(undefined)
        expect(constructParsed.data).toStrictEqual(subj)

        const structParsed = struct.parse(subj)

        expect(structParsed.error).toBe(undefined)
        expect(structParsed.data).toStrictEqual(subj)

        const standardParsed = struct['~standard'].validate(subj)

        if (standardParsed instanceof Promise) {
          throw Error('Not expected')
        }

        if (standardParsed.issues !== undefined) {
          throw Error('not expected')
        }

        expect(standardParsed.value).toStrictEqual(subj)
      }
    }
  })

  it('nested by itself (schema depth: 4)', () => {
    const schema = {
      type: 'union',
      of: [
        {
          type: 'union',
          of: [
            {
              type: 'union',
              of: [{ type: 'boolean' }],
            },
          ],
        },
      ],
    } as const satisfies x.Schema

    const struct = x.union([x.union([x.union([x.boolean()])])])

    type ExpectedSubj = boolean

    const subjects = [true, false] as const satisfies Array<ExpectedSubj>

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct/~standard subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      type StandardSubj = NonNullable<
        (typeof struct)['~standard']['types']
      >['output']

      x.tCh<StandardSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.ParseResult<ExpectedSubj>

      const parsed = x.parse(schema, undefined)

      type SchemaParsed = typeof parsed

      x.tCh<SchemaParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, SchemaParsed>()

      type ConstructParsed = ReturnType<typeof construct.parse>

      x.tCh<ConstructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, ConstructParsed>()

      type StructParsed = ReturnType<typeof struct.parse>

      x.tCh<StructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, StructParsed>()

      type StandardParsed = Extract<
        ReturnType<(typeof struct)['~standard']['validate']>,
        { value: unknown }
      >['value']

      x.tCh<StandardParsed, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardParsed>()

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.error).toBe(undefined)
        expect(schemaParsed.data).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.error).toBe(undefined)
        expect(constructParsed.data).toStrictEqual(subj)

        const structParsed = struct.parse(subj)

        expect(structParsed.error).toBe(undefined)
        expect(structParsed.data).toStrictEqual(subj)

        const standardParsed = struct['~standard'].validate(subj)

        if (standardParsed instanceof Promise) {
          throw Error('Not expected')
        }

        if (standardParsed.issues !== undefined) {
          throw Error('not expected')
        }

        expect(standardParsed.value).toStrictEqual(subj)
      }
    }
  })

  it('each schema type as nested schema', () => {
    const schema = {
      type: 'union',
      of: [
        { type: 'boolean' },
        { type: 'literal', of: true },
        { type: 'literal', of: 0 },
        { type: 'number' },
        { type: 'string' },
        //
        { type: 'array', of: { type: 'boolean' } },
        { type: 'object', of: { x: { type: 'boolean' } } },
        { type: 'record', of: { type: 'boolean' } },
        { type: 'union', of: [{ type: 'boolean' }] },
      ],
    } as const satisfies x.Schema

    const struct = x.union([
      x.boolean(),
      x.literal(true),
      x.literal(0),
      x.number(),
      x.string(),
      //
      x.array(x.boolean()),
      x.object({ x: x.boolean() }),
      x.record(x.boolean()),
      x.union([x.boolean()]),
    ])

    type ExpectedSubj =
      | boolean
      | true
      | 0
      | number
      | string
      //
      | boolean[]
      | { x: boolean }
      | Record<string, boolean>
      | boolean

    const subjects: Array<ExpectedSubj> = [
      true,
      0,
      69,
      'x',
      //
      [true, false],
      { x: true },
      { x: true },
      false,
    ]

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct/~standard subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      type StandardSubj = NonNullable<
        (typeof struct)['~standard']['types']
      >['output']

      x.tCh<StandardSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.ParseResult<ExpectedSubj>

      const parsed = x.parse(schema, undefined)

      type SchemaParsed = typeof parsed

      x.tCh<SchemaParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, SchemaParsed>()

      type ConstructParsed = ReturnType<typeof construct.parse>

      x.tCh<ConstructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, ConstructParsed>()

      type StructParsed = ReturnType<typeof struct.parse>

      x.tCh<StructParsed, ExpectedParsed>()
      x.tCh<ExpectedParsed, StructParsed>()

      type StandardParsed = Extract<
        ReturnType<(typeof struct)['~standard']['validate']>,
        { value: unknown }
      >['value']

      x.tCh<StandardParsed, ExpectedSubj>()
      x.tCh<ExpectedSubj, StandardParsed>()

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.error).toBe(undefined)
        expect(schemaParsed.data).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.error).toBe(undefined)
        expect(constructParsed.data).toStrictEqual(subj)

        const structParsed = struct.parse(subj)

        expect(structParsed.error).toBe(undefined)
        expect(structParsed.data).toStrictEqual(subj)

        const standardParsed = struct['~standard'].validate(subj)

        if (standardParsed instanceof Promise) {
          throw Error('Not expected')
        }

        if (standardParsed.issues !== undefined) {
          throw Error('not expected')
        }

        expect(standardParsed.value).toStrictEqual(subj)
      }
    }
  })
})

describe('discriminant', () => {
  const circle = x.object({
    type: x.literal('circle'),
    radius: x.number(),
  })
  const square = x.object({
    type: x.literal('square'),
    side: x.number(),
  })

  it('parses the tag-matched member, same as without a discriminant', () => {
    const struct = x.union([circle, square]).discriminant('type')

    expect(struct.parse({ type: 'square', side: 2 })).toStrictEqual({
      success: true,
      data: { type: 'square', side: 2 },
    })
    expect(struct.parse({ type: 'circle', radius: 1 })).toStrictEqual({
      success: true,
      data: { type: 'circle', radius: 1 },
    })
  })

  it('reports the single tag-matched member own errors instead of invalidUnion', () => {
    const struct = x.union([circle, square]).discriminant('type')

    expect(struct.parse({ type: 'square', side: 'x' }).error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidType,
        path: ['side'],
        schema: { type: 'number' },
      },
    ])

    const nested = x.object({ shape: struct })

    expect(nested.parse({ shape: { type: 'circle' } }).error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidType,
        path: ['shape', 'radius'],
        schema: { type: 'number' },
      },
    ])
  })

  it('reports invalidUnion when the tag matches no member', () => {
    const struct = x.union([circle, square]).discriminant('type')

    for (const subject of [{ type: 'triangle' }, {}, { type: null }]) {
      expect(struct.parse(subject).error).toStrictEqual([
        { code: x.ERROR_CODE.invalidUnion, path: [], schema: struct.__schema },
      ])
    }
  })

  it('reports invalidUnion when several members share the matched tag', () => {
    const squareAlt = x.object({ type: x.literal('square'), size: x.number() })
    const struct = x.union([square, squareAlt]).discriminant('type')

    expect(struct.parse({ type: 'square', size: 1 }).success).toBe(true)
    expect(struct.parse({ type: 'square' }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidUnion, path: [], schema: struct.__schema },
    ])
  })

  it('falls back to untagged members, but never to mismatched ones', () => {
    const untagged = x.object({ side: x.number() })
    const struct = x
      .union([x.string(), circle, untagged, square])
      .discriminant('type')

    expect(struct.parse('str')).toStrictEqual({ success: true, data: 'str' })
    expect(struct.parse({ side: 1 })).toStrictEqual({
      success: true,
      data: { side: 1 },
    })
    // Matched `square` is tried before the earlier `untagged` member
    expect(struct.parse({ type: 'square', side: 1 })).toStrictEqual({
      success: true,
      data: { type: 'square', side: 1 },
    })
    // Unknown tag: only untagged members are tried
    expect(struct.parse({ type: 'triangle', side: 1 })).toStrictEqual({
      success: true,
      data: { side: 1 },
    })
    // Matched member fails, untagged fallback succeeds
    expect(struct.parse({ type: 'square', side: 1 }).success).toBe(true)
    expect(struct.parse({ type: 'circle', side: 1 })).toStrictEqual({
      success: true,
      data: { side: 1 },
    })
  })

  it('does not invoke mismatched members', () => {
    const calls: string[] = []
    const tracked = (name: string) =>
      x.number().preprocess((s) => {
        calls.push(name)
        return s
      })

    const struct = x
      .union([
        x.object({ type: x.literal('a'), v: tracked('a') }),
        x.object({ type: x.literal('b'), v: tracked('b') }),
      ])
      .discriminant('type')

    expect(struct.parse({ type: 'b', v: 1 }).success).toBe(true)
    expect(calls).toStrictEqual(['b'])
  })

  it('throws on a preprocessor that could rewrite a member tag', () => {
    const lower = (s: unknown) => (typeof s === 'string' ? s.toLowerCase() : s)
    const expectedMessage = /union member 1 is tagged by the "type"/

    const preprocessedTag = x.union([
      x.object({ type: x.literal('b') }),
      x.object({ type: x.literal('a').preprocess(lower) }),
    ])

    expect(() =>
      // @ts-expect-error tag is preprocessed
      preprocessedTag.discriminant('type')
    ).toThrow(expectedMessage)

    const preprocessedMember = x.union([
      x.object({ type: x.literal('b') }),
      x.object({ type: x.literal('a') }).preprocess(lower),
    ])

    expect(() =>
      // @ts-expect-error member carrying the tag is preprocessed
      preprocessedMember.discriminant('type')
    ).toThrow(expectedMessage)

    const preprocessedUnionTag = x.union([
      x.object({ type: x.literal('b') }),
      x.object({
        type: x.union([x.literal('a'), x.literal('c').preprocess(lower)]),
      }),
    ])

    expect(() =>
      // @ts-expect-error tag union member is preprocessed
      preprocessedUnionTag.discriminant('type')
    ).toThrow(expectedMessage)

    // Public `makeStruct` accepts preprocessors too, so it's checked as well
    expect(() =>
      x.makeStruct(
        {
          type: 'union',
          discriminant: 'type',
          of: [
            { type: 'object', of: { type: { type: 'literal', of: 'b' } } },
            { type: 'object', of: { type: { type: 'literal', of: 'a' } } },
          ],
        },
        [{ path: [1, 'type'], fn: lower }]
      )
    ).toThrow(expectedMessage)
  })

  it('allows preprocessors that cannot rewrite a member tag', () => {
    const lower = (s: unknown) => (typeof s === 'string' ? s.toLowerCase() : s)
    const trim = (s: unknown) => (typeof s === 'string' ? s.trim() : s)

    // On the union itself: runs before the tag is read
    const unionLevel = x
      .union([
        x.object({ type: x.literal('a') }),
        x.object({ type: x.literal('b') }),
      ])
      .discriminant('type')
      .preprocess((s) =>
        typeof s === 'object' && s !== null && 'type' in s
          ? { ...s, type: lower(s.type) }
          : s
      )

    expect(unionLevel.parse({ type: 'B' })).toStrictEqual({
      success: true,
      data: { type: 'b' },
    })

    // On a non-tag property and on an untagged member
    const elsewhere = x
      .union([
        x.object({ type: x.literal('a'), name: x.string().preprocess(trim) }),
        x.string().preprocess(trim),
      ])
      .discriminant('type')

    expect(elsewhere.parse({ type: 'a', name: ' n ' })).toStrictEqual({
      success: true,
      data: { type: 'a', name: 'n' },
    })
    expect(elsewhere.parse(' s ')).toStrictEqual({ success: true, data: 's' })

    // A preprocessed property that isn't the member's tag under the
    // priority list (`kind` wins over `type`) is allowed at runtime; the
    // type-level check is per key, so it needs a cast
    const byKind = x.union([
      x.object({
        kind: x.literal('k'),
        type: x.literal('t').preprocess(lower),
      }),
    ])

    expect(() => byKind.discriminant(['kind', 'type'] as never)).not.toThrow()
  })

  it('treats an array discriminant as a key priority list', () => {
    const byKind = x.object({ kind: x.literal('k'), n: x.number() })
    const byType = x.object({ type: x.literal('t'), s: x.string() })
    const both = x.object({
      kind: x.literal('both'),
      type: x.literal('t'),
      b: x.boolean(),
    })
    const struct = x
      .union([byKind, byType, both])
      .discriminant(['kind', 'type'])

    expect(struct.parse({ kind: 'k', n: 1 }).success).toBe(true)
    expect(struct.parse({ type: 't', s: 's' }).success).toBe(true)
    expect(struct.parse({ kind: 'both', type: 't', b: true }).success).toBe(
      true
    )
    // `both` is tagged by `kind` (first listed key it declares), so a
    // subject tagged only by `type` matches `byType` alone
    expect(struct.parse({ type: 't', s: 1 }).error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidType,
        path: ['s'],
        schema: { type: 'string' },
      },
    ])
  })

  it('tries members matched through several keys in key priority order', () => {
    const byType = x.object({ type: x.literal('t'), v: x.unknown() })
    const byKind = x.object({ kind: x.literal('k'), v: x.number() })
    const struct = x.union([byType, byKind]).discriminant(['kind', 'type'])

    // Both members accept it: `byKind` wins despite coming later in `of`
    expect(struct.parse({ kind: 'k', type: 't', v: 1 })).toStrictEqual({
      success: true,
      data: { kind: 'k', v: 1 },
    })

    // Two tag-matched members failing is ambiguous: no single member's errors
    const strict = x
      .union([x.object({ type: x.literal('t'), v: x.string() }), byKind])
      .discriminant(['kind', 'type'])

    expect(strict.parse({ kind: 'k', type: 't', v: true }).error).toStrictEqual(
      [{ code: x.ERROR_CODE.invalidUnion, path: [], schema: strict.__schema }]
    )
  })

  it('accepts a union of literals and optional/nullable literals as a tag', () => {
    const struct = x
      .union([
        x.object({
          type: x.union([x.literal('a'), x.literal('b')]),
          v: x.number(),
        }),
        x.object({ type: x.literal('c').optional(), v: x.string() }),
      ])
      .discriminant('type')

    expect(struct.parse({ type: 'b', v: 1 }).success).toBe(true)
    expect(struct.parse({ v: 's' }).success).toBe(true)
    expect(struct.parse({ type: 'a', v: 's' }).error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidType,
        path: ['v'],
        schema: { type: 'number' },
      },
    ])
  })

  it('handles `__proto__` as a discriminant key safely', () => {
    const schema = {
      type: 'union',
      discriminant: '__proto__',
      of: [{ type: 'object', of: { v: { type: 'number' } } }],
    } as const satisfies x.Schema

    const subject = JSON.parse('{"__proto__": "a", "v": 1}')

    expect(x.parse(schema, subject)).toStrictEqual({
      success: true,
      data: { v: 1 },
    })
    expect(x.parse(schema, { v: 'x' }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidUnion, path: [], schema },
    ])
  })

  it('treats members without a literal tag under the key as untagged', () => {
    const struct = x
      .union([
        x.object({ type: x.literal('a'), v: x.number() }),
        // key declared, but not as a literal / union of literals
        x.object({ type: x.string(), v: x.boolean() }),
        x.object({
          type: x.union([x.literal('b'), x.string()]),
          v: x.string(),
        }),
        x.object({ type: x.literal('c').nullable(), v: x.number() }),
      ])
      .discriminant('type')

    expect(struct.parse({ type: 'z', v: true }).success).toBe(true)
    expect(struct.parse({ type: 'b', v: 's' }).success).toBe(true)
    expect(struct.parse({ type: null, v: 1 }).success).toBe(true)

    const malformed = {
      type: 'union',
      discriminant: 'type',
      of: [null, { type: 'object', of: 'str' }, { type: 'union', of: [] }],
    } as never

    expect(x.parse(malformed, { type: 'a' }).error).toStrictEqual([
      { code: x.ERROR_CODE.invalidUnion, path: [], schema: malformed },
    ])

    const emptyUnionTag = {
      type: 'union',
      discriminant: 'type',
      of: [
        {
          type: 'object',
          of: { type: { type: 'union', of: [] }, v: { type: 'number' } },
        },
        { type: 'object', of: { type: { type: 'literal', of: 0 } } },
      ],
    } as never

    expect(x.parse(emptyUnionTag, { type: 0 }).success).toBe(true)

    const nonObjectTag = {
      type: 'union',
      discriminant: 'type',
      of: [
        { type: 'object', of: { type: null } },
        { type: 'object', of: { type: { type: 'literal', of: 'a' } } },
      ],
    } as never

    expect(x.parse(nonObjectTag, { type: 'a' }).success).toBe(true)
  })

  it('works with a plain data schema', () => {
    const schema = {
      type: 'union',
      discriminant: 'type',
      of: [
        { type: 'object', of: { type: { type: 'literal', of: 'a' } } },
        {
          type: 'object',
          of: {
            type: { type: 'literal', of: 'b' },
            v: { type: 'number' },
          },
        },
      ],
    } as const satisfies x.Schema

    type Expected = { type: 'a' } | { type: 'b'; v: number }

    x.tCh<x.Infer<typeof schema>, Expected>()
    x.tCh<Expected, x.Infer<typeof schema>>()

    expect(x.parse(schema, { type: 'b', v: 1 }).success).toBe(true)
    expect(x.parse(schema, { type: 'b' }).error).toStrictEqual([
      {
        code: x.ERROR_CODE.invalidType,
        path: ['v'],
        schema: { type: 'number' },
      },
    ])
  })

  it('struct: sets the schema field, applies once, keeps inference', () => {
    const prevStruct = x.union([circle, square])
    const struct = prevStruct.discriminant('type')

    expect(struct.__schema).toStrictEqual({
      ...prevStruct.__schema,
      discriminant: 'type',
    })
    expect(prevStruct.__schema).not.toHaveProperty('discriminant')

    type ExpectedKeys =
      StructSharedKeys | 'optional' | 'nullable' | 'description'

    x.tCh<keyof typeof struct, ExpectedKeys>()
    x.tCh<ExpectedKeys, keyof typeof struct>()

    x.tCh<x.Infer<typeof struct>, x.Infer<typeof prevStruct>>()
    x.tCh<x.Infer<typeof prevStruct>, x.Infer<typeof struct>>()

    // @ts-expect-error not a key of any object member
    prevStruct.discriminant('typo')
  })
})
