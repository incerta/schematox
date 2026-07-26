import type { StandardSchemaV1 } from './standard-schema.ts'

export interface StandardJSONSchemaV1<Input = unknown, Output = Input> {
  /** Source: https://github.com/standard-schema/standard-schema/blob/main/packages/spec/src/index.ts */
  readonly '~standard': StandardJSONSchemaV1.Props<Input, Output>
}

export declare namespace StandardJSONSchemaV1 {
  export interface Props<Input = unknown, Output = Input> {
    readonly version: 1
    readonly vendor: string
    readonly types?: StandardSchemaV1.Types<Input, Output> | undefined
    readonly jsonSchema: Converter
  }

  export interface Converter {
    readonly input: (options: Options) => Record<string, unknown>
    readonly output: (options: Options) => Record<string, unknown>
  }

  /**
   * `"draft-2020-12"` and `"draft-07"` are the two targets the spec
   * strongly recommends implementing; anything else is rejected (see
   * `../json-schema.ts`) rather than silently best-effort mapped.
   **/
  export type Target =
    'draft-2020-12' | 'draft-07' | 'openapi-3.0' | ({} & string)

  export interface Options {
    readonly target: Target
    readonly libraryOptions?: Record<string, unknown> | undefined
  }
}
