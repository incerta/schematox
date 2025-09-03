import * as x from '../../'
import * as fixture from '../fixtures'

describe('Type inference and parse by schema/construct/struct (foldA)', () => {
  it('required', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'boolean' } },
    } as const satisfies x.Schema

    const struct = x.object({ x: x.boolean() })

    type ExpectedSubj = { x: boolean }

    const subjects: Array<ExpectedSubj> = [{ x: true }, { x: false }]

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.Either<x.ParsingError, ExpectedSubj>

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

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.left).toBe(undefined)
        expect(schemaParsed.right).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.left).toBe(undefined)
        expect(constructParsed.right).toStrictEqual(subj)

        const structParsed = construct.parse(subj)

        expect(structParsed.left).toBe(undefined)
        expect(structParsed.right).toStrictEqual(subj)
      }
    }
  })

  it('optional', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'boolean' } },
      optional: true,
    } as const satisfies x.Schema

    const struct = x.object({ x: x.boolean() }).optional()

    type ExpectedSubj = { x: boolean } | undefined

    const subjects: Array<ExpectedSubj> = [{ x: true }, undefined]

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.Either<x.ParsingError, ExpectedSubj>

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

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.left).toBe(undefined)
        expect(schemaParsed.right).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.left).toBe(undefined)
        expect(constructParsed.right).toStrictEqual(subj)

        const structParsed = construct.parse(subj)

        expect(structParsed.left).toBe(undefined)
        expect(structParsed.right).toStrictEqual(subj)
      }
    }
  })

  it('nullable', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'boolean' } },
      nullable: true,
    } as const satisfies x.Schema

    const struct = x.object({ x: x.boolean() }).nullable()

    type ExpectedSubj = { x: boolean } | null

    const subjects: Array<ExpectedSubj> = [{ x: true }, null]

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.Either<x.ParsingError, ExpectedSubj>

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

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.left).toBe(undefined)
        expect(schemaParsed.right).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.left).toBe(undefined)
        expect(constructParsed.right).toStrictEqual(subj)

        const structParsed = construct.parse(subj)

        expect(structParsed.left).toBe(undefined)
        expect(structParsed.right).toStrictEqual(subj)
      }
    }
  })

  it('optional + nullable', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'boolean' } },
      optional: true,
      nullable: true,
    } as const satisfies x.Schema

    const struct = x.object({ x: x.boolean() }).optional().nullable()

    type ExpectedSubj = { x: boolean } | undefined | null

    const subjects: Array<ExpectedSubj> = [{ x: true }, undefined, null]

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.Either<x.ParsingError, ExpectedSubj>

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

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.left).toBe(undefined)
        expect(schemaParsed.right).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.left).toBe(undefined)
        expect(constructParsed.right).toStrictEqual(subj)

        const structParsed = construct.parse(subj)

        expect(structParsed.left).toBe(undefined)
        expect(structParsed.right).toStrictEqual(subj)
      }
    }
  })
})

describe('Struct parameter keys reduction and schema immutability (foldB)', () => {
  it('optional', () => {
    const schema = {
      type: 'object',
      of: { x: { type: 'boolean' } },
      optional: true,
    } as const satisfies x.Schema

    const prevStruct = x.object({ x: x.boolean() })
    const struct = prevStruct.optional()

    type ExpectedKeys = '__schema' | 'description' | 'nullable' | 'parse'

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
      type: 'object',
      of: { x: { type: 'boolean' } },
      optional: true,
      nullable: true,
    } as const satisfies x.Schema

    const prevStruct = x.object({ x: x.boolean() }).optional()
    const struct = prevStruct.nullable()

    type ExpectedKeys = '__schema' | 'description' | 'parse'

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
      type: 'object',
      of: { x: { type: 'boolean' } },
      optional: true,
      nullable: true,
      description: 'x',
    } as const satisfies x.Schema

    const prevStruct = x.object({ x: x.boolean() }).optional().nullable()

    const struct = prevStruct.description(schema.description)

    type ExpectedKeys = '__schema' | 'parse'

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
      type: 'object',
      of: { x: { type: 'boolean' } },
      optional: true,
      nullable: true,
      description: 'x',
    } as const satisfies x.Schema

    const prevStruct = x
      .object({ x: x.boolean() })
      .description(schema.description)

    const struct = prevStruct.nullable().optional()

    type ExpectedKeys = '__schema' | 'parse'

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
      type: 'object',
      of: { x: { type: 'boolean' } },
    } as const satisfies x.Schema

    const struct = x.object({ x: x.boolean() })
    const subjects = fixture.DATA_TYPE

    foldC: {
      const construct = x.makeStruct(schema)

      for (const [kind, types] of subjects) {
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

          expect(parsedSchema.left).toStrictEqual(expectedError)
          expect(parsedConstruct.left).toStrictEqual(expectedError)
          expect(parsedStruct.left).toStrictEqual(expectedError)
        }
      }
    }
  })

  it('InvalidSubject error of nested schema should have correct path/schema/subject', () => {
    const schema = {
      type: 'object',
      of: {
        x: {
          type: 'array',
          of: {
            type: 'object',
            of: {
              y: { type: 'literal', of: '_' },
            },
          },
        },
      },
    } as const satisfies x.Schema

    const struct = x.object({
      x: x.array(x.object({ y: x.literal('_') })),
    })

    // prettier-ignore
    const samples: Array<[
        subj: { x: Array<{ y: unknown }> },
        invalidSubj: unknown,
        invalidSubjSchema: x.Schema,
        errorPath: x.ErrorPath,
      ]
    > = [
      [{ x: [{ y: '+' }, { y: '_' }, { y: '_' }] }, '+', schema.of.x.of.of.y, ['x', 0, 'y']],
      [{ x: [{ y: '_' }, { y: '+' }, { y: '_' }] }, '+', schema.of.x.of.of.y, ['x', 1, 'y']],
      [{ x: [{ y: '_' }, { y: '_' }, { y: '+' }] }, '+', schema.of.x.of.of.y, ['x', 2, 'y']],
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

        expect(parsedSchema.left).toStrictEqual(expectedError)
        expect(parsedConstruct.left).toStrictEqual(expectedError)
        expect(parsedStruct.left).toStrictEqual(expectedError)
      }
    }
  })
})

describe('Compound schema specifics (foldA)', () => {
  it('nested primitive schema: optional + nullable + brand', () => {
    const schema = {
      type: 'object',
      of: {
        x: {
          type: 'boolean',
          optional: true,
          nullable: true,
          brand: ['x', 'y'],
        },
      },
    } as const satisfies x.Schema

    const struct = x.object({
      x: x
        .boolean()
        .optional()
        .nullable()
        .brand(...schema.of.x.brand),
    })

    type Branded = boolean & { __x: 'y' }
    type ExpectedSubj = { x?: Branded | undefined | null }

    const subjects = [
      {},
      { x: undefined },
      { x: null },
      { x: true as Branded },
      { x: false as Branded },
    ] as const satisfies Array<ExpectedSubj>

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.Either<x.ParsingError, ExpectedSubj>

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

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.left).toBe(undefined)
        expect(schemaParsed.right).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.left).toBe(undefined)
        expect(constructParsed.right).toStrictEqual(subj)

        const structParsed = construct.parse(subj)

        expect(structParsed.left).toBe(undefined)
        expect(structParsed.right).toStrictEqual(subj)
      }
    }
  })

  it('nested compound schema: optional + nullable', () => {
    const schema = {
      type: 'object',
      of: {
        x: {
          type: 'array',
          of: { type: 'boolean' },
          optional: true,
          nullable: true,
        },
      },
    } as const satisfies x.Schema

    const struct = x.object({ x: x.array(x.boolean()).optional().nullable() })

    type ExpectedSubj = { x?: Array<boolean> | undefined | null }

    const subjects = [
      { x: [] },
      { x: undefined },
      { x: null },
      { x: [] },
      { x: [true] },
    ] as const satisfies Array<ExpectedSubj>

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.Either<x.ParsingError, ExpectedSubj>

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

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.left).toBe(undefined)
        expect(schemaParsed.right).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.left).toBe(undefined)
        expect(constructParsed.right).toStrictEqual(subj)

        const structParsed = construct.parse(subj)

        expect(structParsed.left).toBe(undefined)
        expect(structParsed.right).toStrictEqual(subj)
      }
    }
  })

  it('nested by itself (schema depth: 4)', () => {
    const schema = {
      type: 'object',
      of: {
        x: {
          type: 'object',
          of: {
            y: {
              type: 'object',
              of: {
                z: { type: 'boolean' },
              },
            },
          },
        },
      },
    } as const satisfies x.Schema

    const struct = x.object({
      x: x.object({ y: x.object({ z: x.boolean() }) }),
    })

    type ExpectedSubj = { x: { y: { z: boolean } } }

    const subjects = [
      { x: { y: { z: true } } },
      { x: { y: { z: false } } },
    ] as const satisfies Array<ExpectedSubj>

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.Either<x.ParsingError, ExpectedSubj>

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

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.left).toBe(undefined)
        expect(schemaParsed.right).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.left).toBe(undefined)
        expect(constructParsed.right).toStrictEqual(subj)

        const structParsed = construct.parse(subj)

        expect(structParsed.left).toBe(undefined)
        expect(structParsed.right).toStrictEqual(subj)
      }
    }
  })

  it('each schema type as nested schema', () => {
    const schema = {
      type: 'object',
      of: {
        boolean: { type: 'boolean' },
        literalBoolean: { type: 'literal', of: true },
        literalNumber: { type: 'literal', of: 0 },
        number: { type: 'number' },
        string: { type: 'string' },
        //
        array: { type: 'array', of: { type: 'boolean' } },
        object: { type: 'object', of: { x: { type: 'boolean' } } },
        record: { type: 'record', of: { type: 'boolean' } },
        union: { type: 'union', of: [{ type: 'boolean' }] },
      },
    } as const satisfies x.Schema

    const struct = x.object({
      boolean: x.boolean(),
      literalBoolean: x.literal(true),
      literalNumber: x.literal(0),
      number: x.number(),
      string: x.string(),
      //
      array: x.array(x.boolean()),
      object: x.object({ x: x.boolean() }),
      record: x.record(x.boolean()),
      union: x.union([x.boolean()]),
    })

    type ExpectedSubj = {
      boolean: boolean
      literalBoolean: true
      literalNumber: 0
      number: number
      string: string
      //
      array: boolean[]
      object: { x: boolean }
      record: Record<string, boolean>
      union: boolean
    }

    const subjects: Array<ExpectedSubj> = [
      {
        boolean: true,
        literalBoolean: true,
        literalNumber: 0,
        number: 69,
        string: 'x',
        //
        array: [true, false],
        object: { x: true },
        record: { x: true },
        union: false,
      },
    ]

    foldA: {
      const construct = x.makeStruct(schema)

      /* ensure that schema/construct/struct subject types are identical */

      type ConstructSchemaSubj = x.Infer<typeof construct.__schema>

      x.tCh<ConstructSchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, ConstructSchemaSubj>()

      type SchemaSubj = x.Infer<typeof schema>

      x.tCh<SchemaSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, SchemaSubj>()

      type StructSubj = x.Infer<typeof struct.__schema>

      x.tCh<StructSubj, ExpectedSubj>()
      x.tCh<ExpectedSubj, StructSubj>()

      /* parsed either type check */

      type ExpectedParsed = x.Either<x.ParsingError, ExpectedSubj>

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

      /* runtime schema check */

      expect(struct.__schema).toStrictEqual(schema)
      expect(construct.__schema).toStrictEqual(schema)
      expect(construct.__schema === schema).toBe(false)

      /* parse result check */

      for (const subj of subjects) {
        const schemaParsed = x.parse(schema, subj)

        expect(schemaParsed.left).toBe(undefined)
        expect(schemaParsed.right).toStrictEqual(subj)

        const constructParsed = construct.parse(subj)

        expect(constructParsed.left).toBe(undefined)
        expect(constructParsed.right).toStrictEqual(subj)

        const structParsed = construct.parse(subj)

        expect(structParsed.left).toBe(undefined)
        expect(structParsed.right).toStrictEqual(subj)
      }
    }
  })
})
