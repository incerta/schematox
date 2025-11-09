import * as x from '../../'
import * as fixture from '../fixtures'

describe('Type inference and parse by schema/construct/struct (foldA)', () => {
  it('required', () => {
    const schema = { type: 'number' } as const satisfies x.Schema
    const struct = x.number()

    type ExpectedSubj = number

    const subjects: Array<ExpectedSubj> = fixture.DATA_VARIANTS_BY_TYPE.number

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
      }
    }
  })

  it('optional', () => {
    const schema = {
      type: 'number',
      optional: true,
    } as const satisfies x.Schema

    const struct = x.number().optional()

    type ExpectedSubj = number | undefined

    const subjects: Array<ExpectedSubj> = [
      ...fixture.DATA_VARIANTS_BY_TYPE.number,
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
      }
    }
  })

  it('nullable', () => {
    const schema = {
      type: 'number',
      nullable: true,
    } as const satisfies x.Schema

    const struct = x.number().nullable()

    type ExpectedSubj = number | null

    const subjects: Array<ExpectedSubj> = [
      ...fixture.DATA_VARIANTS_BY_TYPE.number,
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
      }
    }
  })

  it('min', () => {
    const schema = {
      type: 'number',
      min: 0,
    } as const satisfies x.Schema

    const struct = x.number().min(schema.min)

    type ExpectedSubj = number

    const subjects: Array<ExpectedSubj> = [-0, 0, 1]

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
      }
    }
  })

  it('max', () => {
    const schema = {
      type: 'number',
      max: 0,
    } as const satisfies x.Schema

    const struct = x.number().max(schema.max)

    type ExpectedSubj = number

    const subjects: Array<ExpectedSubj> = [-1, -2]

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
      }
    }
  })

  it('optional + nullable + min + max ', () => {
    const schema = {
      type: 'number',
      optional: true,
      nullable: true,
      min: 0,
      max: 1,
    } as const satisfies x.Schema

    const struct = x
      .number()
      .optional()
      .nullable()
      .min(schema.min)
      .max(schema.max)

    type ExpectedSubj = number | undefined | null

    const subjects: Array<ExpectedSubj> = [0, 1, null, undefined]

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
      }
    }
  })
})

describe('Struct parameter keys reduction and schema immutability (foldB)', () => {
  it('optional', () => {
    const schema = {
      type: 'number',
      optional: true,
    } as const satisfies x.Schema

    const prevStruct = x.number()
    const struct = prevStruct.optional()

    type ExpectedKeys =
      | '__schema'
      | 'brand'
      | 'description'
      | 'max'
      | 'min'
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
      type: 'number',
      optional: true,
      nullable: true,
    } as const satisfies x.Schema

    const prevStruct = x.number().optional()
    const struct = prevStruct.nullable()

    type ExpectedKeys =
      | '__schema'
      | 'brand'
      | 'description'
      | 'max'
      | 'min'
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
      type: 'number',
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
    } as const satisfies x.Schema

    const prevStruct = x.number().optional().nullable()
    const struct = prevStruct.brand('x', 'y')

    type ExpectedKeys = 'description' | '__schema' | 'parse' | 'min' | 'max'

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

  it('optional + nullable + brand + min', () => {
    const schema = {
      type: 'number',
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
      min: 0,
    } as const satisfies x.Schema

    const prevStruct = x.number().optional().nullable().min(schema.min)
    const struct = prevStruct.brand('x', 'y')

    type ExpectedKeys = 'description' | '__schema' | 'parse' | 'max'

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

  it('optional + nullable + brand + min + max', () => {
    const schema = {
      type: 'number',
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
      min: 0,
      max: 0,
    } as const satisfies x.Schema

    const prevStruct = x
      .number()
      .optional()
      .nullable()
      .min(schema.min)
      .max(schema.max)

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

  it('optional + nullable + brand + min + max + description', () => {
    const schema = {
      type: 'number',
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
      min: 0,
      max: 0,
      description: 'x',
    } as const satisfies x.Schema

    const prevStruct = x
      .number()
      .optional()
      .nullable()
      .min(schema.min)
      .max(schema.max)
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

  it('description + max + min + brand + nullable + optional', () => {
    const schema = {
      type: 'number',
      optional: true,
      nullable: true,
      brand: ['x', 'y'],
      description: 'x',
      min: 0,
      max: 0,
    } as const satisfies x.Schema

    const prevStruct = x
      .number()
      .description('x')
      .max(schema.max)
      .min(schema.min)
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
    const schema = { type: 'number' } satisfies x.Schema
    const struct = x.number()
    const source = fixture.DATA_TYPE

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
        }
      }
    }
  })
})

describe('ERROR_CODE.INVALID_RANGE (foldD)', () => {
  it('min', () => {
    const schema = { type: 'number', min: 0 } satisfies x.Schema
    const struct = x.number().min(schema.min)
    const subjects = [-1, -2, -3]

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

        expect(parsedSchema.error).toStrictEqual(expectedError)
        expect(parsedConstruct.error).toStrictEqual(expectedError)
        expect(parsedStruct.error).toStrictEqual(expectedError)
      }
    }
  })

  it('max', () => {
    const schema = { type: 'number', max: 0 } satisfies x.Schema
    const struct = x.number().max(schema.max)
    const subjects = [1, 2, 3]

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

        expect(parsedSchema.error).toStrictEqual(expectedError)
        expect(parsedConstruct.error).toStrictEqual(expectedError)
        expect(parsedStruct.error).toStrictEqual(expectedError)
      }
    }
  })

  it('min + max', () => {
    const schema = { type: 'number', min: 0, max: 0 } satisfies x.Schema
    const struct = x.number().min(schema.min).max(schema.max)
    const subjects = [-1, 1]

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

        expect(parsedSchema.error).toStrictEqual(expectedError)
        expect(parsedConstruct.error).toStrictEqual(expectedError)
        expect(parsedStruct.error).toStrictEqual(expectedError)
      }
    }
  })
})
