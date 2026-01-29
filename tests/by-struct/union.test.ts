import * as x from '../../src'
import * as fixture from '../fixtures'

import type { StructSharedKeys } from '../type'

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

    type ExpectedKeys = StructSharedKeys | 'description' | 'nullable'

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

    type ExpectedKeys = StructSharedKeys | 'description'

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

    type ExpectedKeys = StructSharedKeys

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

    type ExpectedKeys = StructSharedKeys

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

describe('ERROR_CODE.invalidType (foldC, foldE)', () => {
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
              code: x.ERROR_CODE.invalidType,
              schema: schema,
              subject: subject,
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
            { message: x.ERROR_CODE.invalidType, path: [] },
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

      for (const [subject, invalidSubj, invalidSubjSchema, path] of samples) {
        const expectedError = [
          {
            path,
            code: x.ERROR_CODE.invalidType,
            schema: invalidSubjSchema,
            subject: invalidSubj,
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
          { path, message: x.ERROR_CODE.invalidType },
        ])
      }
    }
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
