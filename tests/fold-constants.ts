/* FOLDS must be in sync with `src/tests/README.md` */

const FOLD_A = `{
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
}`

const FOLD_B = `{
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
}`

const FOLD_C = `{
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
}`

const FOLD_D = `{
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
}`

const FOLD_E = `{
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
}`

export const FOLDS: Array<[label: string, content: string]> = [
  ['foldA', FOLD_A],
  ['foldB', FOLD_B],
  ['foldC', FOLD_C],
  ['foldD', FOLD_D],
  ['foldE', FOLD_E],
]
