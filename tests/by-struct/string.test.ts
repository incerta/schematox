import * as x from '../../src'
import * as fixture from '../fixtures'

import type { StructSharedKeys } from '../type'

describe('Type inference and parse by schema/construct/struct (foldA)', () => {
  it('required', () => {
    const schema = { type: 'string' } as const satisfies x.Schema
    const struct = x.string()

    type ExpectedSubj = string

    const subjects: Array<ExpectedSubj> = fixture.DATA_VARIANTS_BY_TYPE.string

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
      type: 'string',
      optional: true,
    } as const satisfies x.Schema

    const prevStruct = x.string()
    const struct = prevStruct.optional()

    type ExpectedKeys =
      | StructSharedKeys
      | 'brand'
      | 'description'
      | 'maxLength'
      | 'minLength'
      | 'nullable'

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
      | StructSharedKeys
      | 'brand'
      | 'description'
      | 'maxLength'
      | 'minLength'

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
      | StructSharedKeys
      | 'description'
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

    type ExpectedKeys = StructSharedKeys | 'description' | 'maxLength'

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

describe('ERROR_CODE.invalidType (foldC)', () => {
  it('iterate over fixture.DATA_TYPE', () => {
    const schema = { type: 'string' } satisfies x.Schema
    const struct = x.string()
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
})

describe('ERROR_CODE.invalidRange (foldD)', () => {
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

        expect(parsedSchema.error).toStrictEqual(expectedError)
        expect(parsedConstruct.error).toStrictEqual(expectedError)
        expect(parsedStruct.error).toStrictEqual(expectedError)

        const parsedStandard = struct['~standard'].validate(subject)

        if (parsedStandard instanceof Promise) {
          throw Error('Not expected')
        }

        expect(parsedStandard.issues).toStrictEqual([
          { message: x.ERROR_CODE.invalidRange, path: [] },
        ])
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

        expect(parsedSchema.error).toStrictEqual(expectedError)
        expect(parsedConstruct.error).toStrictEqual(expectedError)
        expect(parsedStruct.error).toStrictEqual(expectedError)

        const parsedStandard = struct['~standard'].validate(subject)

        if (parsedStandard instanceof Promise) {
          throw Error('Not expected')
        }

        expect(parsedStandard.issues).toStrictEqual([
          { message: x.ERROR_CODE.invalidRange, path: [] },
        ])
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

        expect(parsedSchema.error).toStrictEqual(expectedError)
        expect(parsedConstruct.error).toStrictEqual(expectedError)
        expect(parsedStruct.error).toStrictEqual(expectedError)

        const parsedStandard = struct['~standard'].validate(subject)

        if (parsedStandard instanceof Promise) {
          throw Error('Not expected')
        }

        expect(parsedStandard.issues).toStrictEqual([
          { message: x.ERROR_CODE.invalidRange, path: [] },
        ])
      }
    }
  })
})
