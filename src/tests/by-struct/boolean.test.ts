import * as x from '../../'
import * as fixture from '../fixtures'

describe('Type inference and parse by schema/construct/struct (foldA)', () => {
  it('required', () => {
    const schema = { type: 'boolean' } as const satisfies x.Schema
    const struct = x.boolean()

    type ExpectedSubj = boolean
    type ExpectedSubjects = [ExpectedSubj, ...ExpectedSubj[]]

    const subjects: ExpectedSubjects = [true, false]

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
      type: 'boolean',
      optional: true,
    } as const satisfies x.Schema
    const struct = x.boolean().optional()

    type ExpectedSubj = boolean | undefined
    type ExpectedSubjects = [ExpectedSubj, ...ExpectedSubj[]]

    const subjects: ExpectedSubjects = [true, false, undefined]

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
      type: 'boolean',
      nullable: true,
    } as const satisfies x.Schema
    const struct = x.boolean().nullable()

    type ExpectedSubj = boolean | null
    type ExpectedSubjects = [ExpectedSubj, ...ExpectedSubj[]]

    const subjects: ExpectedSubjects = [true, false, null]

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
      type: 'boolean',
      optional: true,
      nullable: true,
    } as const satisfies x.Schema
    const struct = x.boolean().optional().nullable()

    type ExpectedSubj = boolean | undefined | null
    type ExpectedSubjects = [ExpectedSubj, ...ExpectedSubj[]]

    const subjects: ExpectedSubjects = [true, false, null, undefined]

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
      type: 'boolean',
      optional: true,
    } as const satisfies x.Schema

    const prevStruct = x.boolean()
    const struct = prevStruct.optional()

    type ExpectedKeys =
      | 'brand'
      | 'nullable'
      | 'description'
      | '__schema'
      | 'parse'

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
      type: 'boolean',
      optional: true,
      nullable: true,
    } as const satisfies x.Schema

    const prevStruct = x.boolean().optional()
    const struct = prevStruct.nullable()

    type ExpectedKeys = 'brand' | 'description' | '__schema' | 'parse'

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

  it('optional + nullable + brand', () => {
    const schema = {
      type: 'boolean',
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
    } as const satisfies x.Schema

    const prevStruct = x.boolean().optional().nullable()
    const struct = prevStruct.brand('x', 'y')

    type ExpectedKeys = 'description' | '__schema' | 'parse'

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

  it('optional + nullable + brand + description', () => {
    const schema = {
      type: 'boolean',
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
      description: 'x',
    } as const satisfies x.Schema

    const prevStruct = x.boolean().optional().nullable().brand('x', 'y')
    const struct = prevStruct.description('x')

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

  it('description + brand + nullable + optional', () => {
    const schema = {
      type: 'boolean',
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
      description: 'x',
    } as const satisfies x.Schema

    const prevStruct = x.boolean().description('x').brand('x', 'y').nullable()
    const struct = prevStruct.optional()

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

describe('ERROR_CODE.invalidType (foldC)', () => {
  it('iterate over fixture.DATA_TYPE', () => {
    const schema = { type: 'boolean' } satisfies x.Schema
    const struct = x.boolean()

    foldC: {
      const construct = x.makeStruct(schema)

      for (const [kind, types] of fixture.DATA_TYPE) {
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
})
