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

describe('ERROR_CODE.invalidType (foldC)', () => {
  it.todo('iterate over fixture.DATA_TYPE')
})

describe('ERROR_CODE.invalidRange (foldD)', () => {
  it.todo('min')
  it.todo('max')
  it.todo('min + max')
})

describe('Schema specifics (foldA)', () => {
  // depends on schema type
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

        expect(parsedSchema.left).toStrictEqual(expectedError)
        expect(parsedConstruct.left).toStrictEqual(expectedError)
        expect(parsedStruct.left).toStrictEqual(expectedError)
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

      expect(parsedSchema.left).toStrictEqual(expectedError)
      expect(parsedConstruct.left).toStrictEqual(expectedError)
      expect(parsedStruct.left).toStrictEqual(expectedError)
    }
  }
})
```
