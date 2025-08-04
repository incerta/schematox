import { ExtWith_SchemaParams_SubjT } from '../types/extensions'

/* UTILITY TYPE */

type Left<T> = { left: T; right?: never }
type Right<U> = { left?: never; right: U }
type Either<T, U> = NonNullable<Left<T> | Right<U>>

type PrettifyRecord<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K]
} & {}

/* SCHEMA */

type ObjectSchema<T = Record<string, unknown>> = {
  type: 'object'
  of: T
  optional?: boolean
}

type StringSchema = { type: 'string'; optional?: boolean }

/* SCHEMA UNION */

type PrimitiveSchema = StringSchema
type CompoundSchema = ObjectSchema

/* CONSTRUCTORS */

type Con_PrimitiveSchema_SubjT<T> = T extends StringSchema ? string : never

type Con_ObjectSchema_SubjT<T> =
  T extends ObjectSchema<infer U>
    ? PrettifyRecord<
        {
          [K in keyof U as U[K] extends { optional: true }
            ? K
            : never]?: Con_Schema_SubjT<U[K]>
        } & {
          [K in keyof U as U[K] extends { optional: true }
            ? never
            : K]: Con_Schema_SubjT<U[K]>
        }
      >
    : never

type Con_CompoundSchema_SubjT<T> = Con_ObjectSchema_SubjT<T>

type Con_Schema_SubjT<T> = ExtWith_SchemaParams_SubjT<
  T,
  T extends PrimitiveSchema
    ? Con_PrimitiveSchema_SubjT<T>
    : T extends CompoundSchema
      ? Con_CompoundSchema_SubjT<T>
      : never
>

/* ERROR TYPE */

type ErrorPath = Array<string /* object key */ | number /* array index */>

type InvalidSubject = {
  code: unknown // inferred from constant
  subject: unknown
  path: ErrorPath
}

type ParsingError = InvalidSubject[]

/* STRUCT SCHEMA */

type Struct<T> = {
  __schema: T
  optional: () => Struct<T & { optional: true }>
  parse: (s: unknown) => Either<ParsingError, Con_Schema_SubjT<T>>
}

declare function string(): Struct<StringSchema>

declare function object<T, U extends Record<string, { __schema: T }>>(
  schema: U
): Struct<{
  type: 'object'
  of: { [K in keyof U]: U[K]['__schema'] }
}>

// prettier-ignore
const struct = object({
  0: object({
  1: object({
  2: object({
  3: object({
  4: object({
  5: object({
  6: object({
  7: object({
  8: object({
  9: object({
  10: object({
  11: object({
  12: object({
  13: object({
  14: object({
  15: object({
  16: object({
  17: object({
  18: object({
  19: object({
  20: object({
  21: object({
  22: object({
  23: object({
  24: object({
  25: object({
  26: object({
  27: object({
  28: object({
  29: object({
  30: object({
  31: object({
  32: object({
  33: object({
  34: object({
    x: string().optional(),
    y: string(),
  }),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),}),
})

const parsed = struct.parse({})

// prettier-ignore
const right = parsed.right![0][1][2][3][4][5][6][7][8][9][10][11][12][13][14][15][16][17][18][19][20][21][22][23][24][25][26][27][28][29][30][31][32][33][34]

const check = <T, U extends T = T>(...x: T[]): U[] => x as U[]

type Expected = { x?: string | undefined; y: string }
type Actual = typeof right

check<Expected, Actual>()
check<Actual, Expected>()
