# By struct scaffold

```typescript
import * as x from '../../'
import * as fixture from '../fixtures'

describe('Type inference and parse by schema/construct/struct (foldA)', () => {
  it.todo('required')
  it.todo('optional')
  it.todo('nullable')
  it.todo('min')
  it.todo('max')
  it.todo('optional + nullable + minLength + maxLength')
})

describe('Struct parameter keys reduction and schema immutability (foldB)', () => {
  it.todo('optional')
  it.todo('optional + nullable')
  it.todo('optional + nullable + brand')
  it.todo('optional + nullable + brand + min')
  it.todo('optional + nullable + brand + min')
  it.todo('optional + nullable + brand + min + max')
  it.todo('optional + nullable + brand + min + max + description')
  it.todo('description + max + min + brand + nullable + optional')
})

describe('ERROR_CODE.invalidType (foldC, foldE)', () => {
  it.todo('iterate over fixture.DATA_TYPE')
  it.todo('InvalidSubject error of nested schema should have correct path/schema/subject')
})

describe('ERROR_CODE.invalidRange (foldD)', () => {
  it.todo('min')
  it.todo('max')
  it.todo('min + max')
})

describe('Compound schema specifics (foldA)', () => {
  it.todo('nested primitive schema: optional + nullable + brand')
  it.todo('nested compound schema: optional + nullable')
  it.todo('nested by itself (schema depth: 4)')
})
```

# Fold A

```typescript
it('required', () => {
  const schema = { type: 'boolean' } as const satisfies x.Schema
  const struct = x.boolean()

  type ExpectedSubj = boolean

  const subjects: Array<ExpectedSubj> = [true, false]

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

    type ExpectedParsed = x.Either<x.Errors, ExpectedSubj>

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

      const structParsed = construct.parse(subj)

      expect(structParsed.error).toBe(undefined)
      expect(structParsed.data).toStrictEqual(subj)
    }
  }
})
```

# Fold B

```typescript
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
```

# Fold C

```typescript
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

        expect(parsedSchema.error).toStrictEqual(expectedError)
        expect(parsedConstruct.error).toStrictEqual(expectedError)
        expect(parsedStruct.error).toStrictEqual(expectedError)
      }
    }
  }
})
```

# Fold D

```typescript
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
```

# Fold E

```typescript
it('InvalidSubject error of nested schema should have correct path/schema/subject', () => {
  const schema = {
    type: 'array',
    of: { type: 'array', of: { type: 'boolean' } },
  } as const satisfies x.Schema

  const struct = x.array(x.array(x.boolean()))
  const samples: Array<
    [
      subj: unknown[],
      invalidSubj: unknown,
      invalidSubjSchema: x.Schema,
      errorPath: x.ErrorPath,
    ]
  > = [
    [[[null, false, true]], null, schema.of.of, [0, 0]],
    [[[], [null, false, true]], null, schema.of.of, [1, 0]],
    [[[], [], [null, false, true]], null, schema.of.of, [2, 0]],
    [[[true, 'str', true]], 'str', schema.of.of, [0, 1]],
    [[[], [true, 'str', true]], 'str', schema.of.of, [1, 1]],
    [[[], [], [true, 'str', true]], 'str', schema.of.of, [2, 1]],
    [[[true, false, 69]], 69, schema.of.of, [0, 2]],
    [[[], [true, false, 69]], 69, schema.of.of, [1, 2]],
    [[[], [], [true, false, 69]], 69, schema.of.of, [2, 2]],
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
    }
  }
})
```
