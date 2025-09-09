import * as x from '../../'
import * as fixture from '../fixtures'

describe('Type inference and parse by schema/construct/struct (foldA)', () => {
  it('required', () => {
    const schema = { type: 'string' } as const satisfies x.Schema
    const struct = x.string()

    type ExpectedSubj = string

    const subjects: Array<ExpectedSubj> = fixture.DATA_VARIANTS_BY_TYPE.string

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

      type ExpectedParsed = x.Either<x.InvalidSubject[], ExpectedSubj>

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
      type: 'string',
      optional: true,
    } as const satisfies x.Schema

    const struct = x.string().optional()

    type ExpectedSubj = string | undefined

    const subjects: Array<ExpectedSubj> = [
      ...fixture.DATA_VARIANTS_BY_TYPE.string,
      undefined,
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

      type ExpectedParsed = x.Either<x.InvalidSubject[], ExpectedSubj>

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
      type: 'string',
      nullable: true,
    } as const satisfies x.Schema

    const struct = x.string().nullable()

    type ExpectedSubj = string | null

    const subjects: Array<ExpectedSubj> = [
      ...fixture.DATA_VARIANTS_BY_TYPE.string,
      null,
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

      type ExpectedParsed = x.Either<x.InvalidSubject[], ExpectedSubj>

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

  it('minLength', () => {
    const schema = {
      type: 'string',
      minLength: 2,
    } as const satisfies x.Schema

    const struct = x.string().minLength(schema.minLength)

    type ExpectedSubj = string

    const subjects: Array<ExpectedSubj> = ['xx', 'xxx', 'xxxx']

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

      type ExpectedParsed = x.Either<x.InvalidSubject[], ExpectedSubj>

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

  it('maxLength', () => {
    const schema = {
      type: 'string',
      maxLength: 2,
    } as const satisfies x.Schema

    const struct = x.string().maxLength(schema.maxLength)

    type ExpectedSubj = string

    const subjects: Array<ExpectedSubj> = ['', 'x', 'xx']

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

      type ExpectedParsed = x.Either<x.InvalidSubject[], ExpectedSubj>

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

  it('optional + nullable + minLength + maxLength', () => {
    const schema = {
      type: 'string',
      optional: true,
      nullable: true,
      minLength: 0,
      maxLength: 1,
    } as const satisfies x.Schema

    const struct = x
      .string()
      .optional()
      .nullable()
      .minLength(schema.minLength)
      .maxLength(schema.maxLength)

    type ExpectedSubj = string | undefined | null

    const subjects: Array<ExpectedSubj> = ['', 'x', null, undefined]

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

      type ExpectedParsed = x.Either<x.InvalidSubject[], ExpectedSubj>

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
      type: 'string',
      optional: true,
    } as const satisfies x.Schema

    const prevStruct = x.string()
    const struct = prevStruct.optional()

    type ExpectedKeys =
      | '__schema'
      | 'brand'
      | 'description'
      | 'maxLength'
      | 'minLength'
      | 'nullable'
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
      type: 'string',
      optional: true,
      nullable: true,
    } as const satisfies x.Schema

    const prevStruct = x.string().optional()
    const struct = prevStruct.nullable()

    type ExpectedKeys =
      | '__schema'
      | 'brand'
      | 'description'
      | 'maxLength'
      | 'minLength'
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

  it('optional + nullable + brand', () => {
    const schema = {
      type: 'string',
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
    } as const satisfies x.Schema

    const prevStruct = x.string().optional().nullable()
    const struct = prevStruct.brand('x', 'y')

    type ExpectedKeys =
      | 'description'
      | '__schema'
      | 'parse'
      | 'minLength'
      | 'maxLength'

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

  it('optional + nullable + brand + minLength', () => {
    const schema = {
      type: 'string',
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
      minLength: 0,
    } as const satisfies x.Schema

    const prevStruct = x
      .string()
      .optional()
      .nullable()
      .minLength(schema.minLength)

    const struct = prevStruct.brand('x', 'y')

    type ExpectedKeys = 'description' | '__schema' | 'parse' | 'maxLength'

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

  it('optional + nullable + brand + minLength + maxLength', () => {
    const schema = {
      type: 'string',
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
      minLength: 0,
      maxLength: 0,
    } as const satisfies x.Schema

    const prevStruct = x
      .string()
      .optional()
      .nullable()
      .minLength(schema.minLength)
      .maxLength(schema.maxLength)

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

  it('optional + nullable + brand + minLength + maxLength + description', () => {
    const schema = {
      type: 'string',
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
      minLength: 0,
      maxLength: 0,
      description: 'x',
    } as const satisfies x.Schema

    const prevStruct = x
      .string()
      .optional()
      .nullable()
      .minLength(0)
      .maxLength(0)
      .description('x')

    const struct = prevStruct.brand('x', 'y')

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

  it('description + maxLength + minLength + brand + nullable + optional', () => {
    const schema = {
      type: 'string',
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
      description: 'x',
      minLength: 0,
      maxLength: 0,
    } as const satisfies x.Schema

    const prevStruct = x
      .string()
      .description('x')
      .maxLength(schema.maxLength)
      .minLength(schema.minLength)
      .brand('x', 'y')
      .nullable()

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
    const schema = { type: 'string' } satisfies x.Schema
    const struct = x.string()
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
})

describe('ERROR_CODE.INVALID_RANGE (foldD)', () => {
  it('minLength', () => {
    const schema = { type: 'string', minLength: 2 } satisfies x.Schema
    const struct = x.string().minLength(schema.minLength)
    const subjects = ['', 'x']

    foldD: {
      const construct = x.makeStruct(schema)

      for (const subject of subjects) {
        const expectedError = [
          {
            code: x.ERROR_CODE.invalidRange,
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
  })

  it('maxLength', () => {
    const schema = { type: 'string', maxLength: 2 } satisfies x.Schema
    const struct = x.string().maxLength(schema.maxLength)
    const subjects = ['xxx', 'xxxx', 'xxxxx']

    foldD: {
      const construct = x.makeStruct(schema)

      for (const subject of subjects) {
        const expectedError = [
          {
            code: x.ERROR_CODE.invalidRange,
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
  })

  it('minLength + maxLength', () => {
    const schema = {
      type: 'string',
      minLength: 1,
      maxLength: 2,
    } satisfies x.Schema

    const struct = x
      .string()
      .minLength(schema.minLength)
      .maxLength(schema.maxLength)

    const subjects = ['', 'xxx']

    foldD: {
      const construct = x.makeStruct(schema)

      for (const subject of subjects) {
        const expectedError = [
          {
            code: x.ERROR_CODE.invalidRange,
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
  })
})
