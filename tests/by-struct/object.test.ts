import * as x from '../../src'
import * as fixture from '../fixtures'

import type { StructSharedKeys } from '../type'

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
      type: 'object',
      of: { x: { type: 'boolean' } },
      optional: true,
    } as const satisfies x.Schema

    const struct = x.object({ x: x.boolean() }).optional()

    type ExpectedSubj = { x: boolean } | undefined

    const subjects: Array<ExpectedSubj> = [{ x: true }, undefined]

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
      type: 'object',
      of: { x: { type: 'boolean' } },
      nullable: true,
    } as const satisfies x.Schema

    const struct = x.object({ x: x.boolean() }).nullable()

    type ExpectedSubj = { x: boolean } | null

    const subjects: Array<ExpectedSubj> = [{ x: true }, null]

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
      type: 'object',
      of: { x: { type: 'boolean' } },
      optional: true,
    } as const satisfies x.Schema

    const prevStruct = x.object({ x: x.boolean() })
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
      type: 'object',
      of: { x: { type: 'boolean' } },
      optional: true,
      nullable: true,
    } as const satisfies x.Schema

    const prevStruct = x.object({ x: x.boolean() }).optional()
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
      type: 'object',
      of: { x: { type: 'boolean' } },
      optional: true,
      nullable: true,
      description: 'x',
    } as const satisfies x.Schema

    const prevStruct = x.object({ x: x.boolean() }).optional().nullable()

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
      type: 'object',
      of: { x: { type: 'boolean' } },
    } as const satisfies x.Schema

    const struct = x.object({ x: x.boolean() })
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

    const struct = x.object({ x: x.array(x.object({ y: x.literal('_') })) })

    // prettier-ignore
    const samples: Array<[
        subj: unknown,
        invalidSubj: unknown,
        invalidSubjSchema: x.Schema,
        errorPath: x.ErrorPath,
      ]
    > = [
      [null, null, schema, []],
      [{}, undefined, schema.of.x, ['x']],
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

  it('multiple errors', () => {
    const schema = {
      type: 'object',
      of: {
        x: { type: 'boolean' },
        y: { type: 'literal', of: true },
        z: { type: 'literal', of: 0 },
      },
    } as const satisfies x.Schema

    const struct = x.object({
      x: x.boolean(),
      y: x.literal(true),
      z: x.literal(0),
    })

    const construct = x.makeStruct(schema)

    const subject = { y: null, z: 0 }

    const expectedError: x.InvalidSubject[] = [
      {
        code: x.ERROR_CODE.invalidType,
        path: ['x'],
        schema: schema.of.x,
        subject: undefined,
      },
      {
        code: x.ERROR_CODE.invalidType,
        path: ['y'],
        schema: schema.of.y,
        subject: null,
      },
    ]

    const parsedSchema = x.parse(schema, subject)
    const parsedStruct = struct.parse(subject)
    const parsedConstruct = construct.parse(subject)

    expect(parsedSchema.error).toStrictEqual(expectedError)
    expect(parsedStruct.error).toStrictEqual(expectedError)
    expect(parsedConstruct.error).toStrictEqual(expectedError)
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
      {},
      { x: [] },
      { x: undefined },
      { x: null },
      { x: [] },
      { x: [true] },
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

  it('max static schema definition depth using "satisfies x.Schema": 47', () => {
    // prettier-ignore
    const schema = {
      type:'object', of: { 1: { type: 'object', of: { 2: { type: 'object', of: { 3: { type: 'object', of: { 4: { type: 'object', of: {
        5: { type: 'object', of: { 6: { type: 'object', of: { 7: { type: 'object', of: { 8: { type: 'object', of: {
        9: { type: 'object', of: { 10: { type: 'object', of: { 11: { type: 'object', of: { 12: {type: 'object', of: {
        11: { type: 'object', of: { 12: { type: 'object', of: { 13: { type: 'object', of: { 14: {type: 'object', of: {
        15: { type: 'object', of: { 16: { type: 'object', of: { 17: { type: 'object', of: { 18: {type: 'object', of: {
        19: { type: 'object', of: { 20: { type: 'object', of: { 21: { type: 'object', of: { 22: {type: 'object', of: {
        23: { type: 'object', of: { 24: { type: 'object', of: { 25: { type: 'object', of: { 26: {type: 'object', of: {
        27: { type: 'object', of: { 28: { type: 'object', of: { 29: { type: 'object', of: { 30: {type: 'object', of: {
        31: { type: 'object', of: { 32: { type: 'object', of: { 33: { type: 'object', of: { 34: {type: 'object', of: {
        35: { type: 'object', of: { 36: { type: 'object', of: { 37: { type: 'object', of: { 38: {type: 'object', of: {
        39: { type: 'object', of: { 40: { type: 'object', of: { 41: { type: 'object', of: { 42: {type: 'object', of: {
        43: { type: 'object', of: { 44: { type: 'object', of: { 45: { type: 'object', of: { 46: {type: 'object', of: {
        47: { type: 'object', of: {} },
      }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
    } as const satisfies x.Schema

    expect(typeof schema).toBe('object')
  })

  it('max static schema definition depth using "satisfies x.Schema" available to direct parse: 22', () => {
    // prettier-ignore
    const schema = {
      type:'object', of: { 1: { type: 'object', of: { 2: { type: 'object', of: { 3: { type: 'object', of: { 4: { type: 'object', of: {
        5: { type: 'object', of: { 6: { type: 'object', of: { 7: { type: 'object', of: { 8: { type: 'object', of: {
        9: { type: 'object', of: { 10: { type: 'object', of: { 11: { type: 'object', of: { 12: {type: 'object', of: {
        11: { type: 'object', of: { 12: { type: 'object', of: { 13: { type: 'object', of: { 14: {type: 'object', of: {
        15: { type: 'object', of: { 16: { type: 'object', of: { 17: { type: 'object', of: { 18: {type: 'object', of: {
        19: { type: 'object', of: { 20: { type: 'object', of: { 21: { type: 'object', of: { 22: {type: 'object', of: {
        }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
    } as const satisfies x.Schema

    expect(x.parse(schema, {}).error).toBeTruthy()
  })

  it('extreme depth: 100', () => {
    const o = x.object

    // prettier-ignore
    const struct = o({
      1: o({ 2: o({ 3: o({ 4: o({ 5: o({ 6: o({ 7: o({ 8: o({ 9: o({ 10: o({
      11: o({ 12: o({ 13: o({ 14: o({ 15: o({ 16: o({ 17: o({ 18: o({ 19: o({ 20: o({
      21: o({ 22: o({ 23: o({ 24: o({ 25: o({ 26: o({ 27: o({ 28: o({ 29: o({ 30: o({
      31: o({ 32: o({ 33: o({ 34: o({ 35: o({ 36: o({ 37: o({ 38: o({ 39: o({ 40: o({
      41: o({ 42: o({ 43: o({ 44: o({ 45: o({ 46: o({ 47: o({ 48: o({ 49: o({ 50: o({
      1: o({ 2: o({ 3: o({ 4: o({ 5: o({ 6: o({ 7: o({ 8: o({ 9: o({ 10: o({
      11: o({ 12: o({ 13: o({ 14: o({ 15: o({ 16: o({ 17: o({ 18: o({ 19: o({ 20: o({
      21: o({ 22: o({ 23: o({ 24: o({ 25: o({ 26: o({ 27: o({ 28: o({ 29: o({ 30: o({
      31: o({ 32: o({ 33: o({ 34: o({ 35: o({ 36: o({ 37: o({ 38: o({ 39: o({ 40: o({
      41: o({ 42: o({ 43: o({ 44: o({ 45: o({ 46: o({ 47: o({ 48: o({ 49: o({ 50: o({
        x: x.string()
      }),
      }),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),
      }),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),
      }),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),
      }),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),})

    // prettier-ignore
    // @ts-ignore
    const validSubject = {
      1:{2:{3:{4:{5:{6:{7:{8:{9:{10:{
      11:{12:{13:{14:{15:{16:{17:{18:{19:{20:{
      21:{22:{23:{24:{25:{26:{27:{28:{29:{30:{
      31:{32:{33:{34:{35:{36:{37:{38:{39:{40:{
      41:{42:{43:{44:{45:{46:{47:{48:{49:{50:{
      1:{2:{3:{4:{5:{6:{7:{8:{9:{10:{
      11:{12:{13:{14:{15:{16:{17:{18:{19:{20:{
      21:{22:{23:{24:{25:{26:{27:{28:{29:{30:{
      31:{32:{33:{34:{35:{36:{37:{38:{39:{40:{
      41:{42:{43:{44:{45:{46:{47:{48:{49:{50:{
        x: 'x-value'
      }
    }
    }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
    }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}

    const parsed = struct.parse(validSubject)

    if (parsed.success) {
      // prettier-ignore
      const tail =
        parsed.data
          [1][2][3][4][5][6][7][8][9][10][11][12][13][14][15][16][17][18][19][20][21][22][23][24][25]
          [26][27][28][29][30][31][32][33][34][35][36][37][38][39][40][41][42][43][44][45][46][47][48][49][50]
          [1][2][3][4][5][6][7][8][9][10][11][12][13][14][15][16][17][18][19][20][21][22][23][24][25]
          [26][27][28][29][30][31][32][33][34][35][36][37][38][39][40][41][42][43][44][45][46][47][48][49][50]

      type Actual = typeof tail
      type Expected = { x: string }

      x.tCh<Expected, Actual>()
      x.tCh<Actual, Expected>()
    }

    expect(parsed.data).toStrictEqual(validSubject)

    // prettier-ignore
    // @ts-ignore
    const invalidSubject = {
      1:{2:{3:{4:{5:{6:{7:{8:{9:{10:{
      11:{12:{13:{14:{15:{16:{17:{18:{19:{20:{
      21:{22:{23:{24:{25:{26:{27:{28:{29:{30:{
      31:{32:{33:{34:{35:{36:{37:{38:{39:{40:{
      41:{42:{43:{44:{45:{46:{47:{48:{49:{50:{
      1:{2:{3:{4:{5:{6:{7:{8:{9:{10:{
      11:{12:{13:{14:{15:{16:{17:{18:{19:{20:{
      21:{22:{23:{24:{25:{26:{27:{28:{29:{30:{
      31:{32:{33:{34:{35:{36:{37:{38:{39:{40:{
      41:{42:{43:{44:{45:{46:{47:{48:{49:{50:{
        x: 0
      }
    }
    }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
    }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}

    const expectedError: x.InvalidSubject[] = [
      {
        code: x.ERROR_CODE.invalidType,
        schema: { type: 'string' },
        // prettier-ignore
        path: [
         '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20',
         '21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37',
         '38','39','40','41','42','43','44','45','46','47','48','49','50',
         '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20',
         '21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37',
         '38','39','40','41','42','43','44','45','46','47','48','49','50',
         'x'
        ],
        subject: 0,
      },
    ]

    expect(struct.parse(invalidSubject).error).toStrictEqual(expectedError)
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
