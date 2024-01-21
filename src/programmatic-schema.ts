/* This just PoC, the design of programmatically defined schema is yet to be discussed */

import type {
  BD_StringUnion,
  BD_NumberUnion,
} from './base-detailed-schema-types'

type StringUnionOptions<T extends string> = Omit<
  BD_StringUnion,
  'type' | 'of' | 'default'
> & { default?: T }

type NumberUnionOptions<T extends number> = Omit<
  BD_NumberUnion,
  'type' | 'of' | 'default'
> & { default?: T }

export function union<T extends string>(
  ...of: T[]
): <U extends StringUnionOptions<T>>(
  options?: U
) => U extends undefined
  ? Readonly<{ type: 'stringUnion'; of: T[] }>
  : Readonly<{ type: 'stringUnion'; of: T[] } & U>

export function union<T extends number>(
  ...of: T[]
): <U extends NumberUnionOptions<T>>(
  options?: U
) => U extends undefined
  ? Readonly<{ type: 'numberUnion'; of: T[] }>
  : Readonly<{ type: 'numberUnion'; of: T[] } & U>

export function union(
  ...of: string[] | number[]
):
  | ((options?: StringUnionOptions<string>) => BD_StringUnion)
  | ((options?: NumberUnionOptions<number>) => BD_NumberUnion) {
  if (of[0] === undefined) {
    throw Error('Union must have at least one argument')
  }

  if (typeof of[0] === 'string') {
    // @ts-expect-error quick hack while its just a PoC
    return (options: StringUnionOptions<string>) => ({
      type: 'stringUnion',
      of: of as string[],
      ...options,
    })
  }

  // @ts-expect-error quick hack while its just a PoC
  return (options: NumberUnionOptions<number>) => ({
    type: 'numberUnion',
    of: of as number[],
    ...options,
  })
}
