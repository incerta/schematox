import { check, unknownX } from '../test-utils'
import type {
  BS_Schema,
  Con_BS_Schema_Opt_SubjT,
  Con_BS_Schema_Req_SubjT,
  Con_BS_Schema_SubjT,
} from '../../types/base-short-schema-types'

it('Con_BS_Schema_Req_SubjT<T>: check "string/number/boolean/buffer"', () => {
  check<string>(unknownX as Con_BS_Schema_Req_SubjT<'string'>)
  // @ts-expect-error 'number' is not assignable to 'string'
  check<string>(unknownX as Con_BS_Schema_Req_SubjT<'number'>)

  check<number>(unknownX as Con_BS_Schema_Req_SubjT<'number'>)
  // @ts-expect-error 'boolean' is not assignable to 'number'
  check<number>(unknownX as Con_BS_Schema_Req_SubjT<'boolean'>)

  check<boolean>(unknownX as Con_BS_Schema_Req_SubjT<'boolean'>)
  // @ts-expect-error 'Buffer' is not assignable to 'boolean'
  check<boolean>(unknownX as Con_BS_Schema_Req_SubjT<'buffer'>)

  check<Buffer>(unknownX as Con_BS_Schema_Req_SubjT<'buffer'>)
  // @ts-expect-error 'string' is not assignable to 'Buffer'
  check<Buffer>(unknownX as Con_BS_Schema_Req_SubjT<'string'>)
})

it('Con_BS_Schema_Opt_SubjT<T>: check "string/number/boolean/buffer"', () => {
  check<string | undefined>(unknownX as Con_BS_Schema_Opt_SubjT<'string?'>)
  // @ts-expect-error 'number | undefined' is not assignable to 'string'
  check<string>(unknownX as Con_BS_Schema_Opt_SubjT<'number?'>)

  check<number | undefined>(unknownX as Con_BS_Schema_Opt_SubjT<'number?'>)
  // @ts-expect-error 'boolean | undefined' is not assignable to 'number'
  check<number>(unknownX as Con_BS_Schema_Opt_SubjT<'boolean?'>)

  check<boolean | undefined>(unknownX as Con_BS_Schema_Opt_SubjT<'boolean?'>)
  // @ts-expect-error 'Buffer | undefined' is not assignable to 'boolean'
  check<boolean>(unknownX as Con_BS_Schema_Opt_SubjT<'buffer?'>)

  check<Buffer | undefined>(unknownX as Con_BS_Schema_Opt_SubjT<'buffer?'>)
  // @ts-expect-error 'string | undefined' is not assignable to 'Buffer'
  check<Buffer>(unknownX as Con_BS_Schema_Opt_SubjT<'string?'>)
})

it('Con_BS_Schema_SubjT<T>: check "string" optional & required cases', () => {
  const stringSchemaRequired = 'string' satisfies BS_Schema

  check<string>(unknownX as Con_BS_Schema_SubjT<typeof stringSchemaRequired>)

  const stringSchemaOptional = 'string?' satisfies BS_Schema

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as Con_BS_Schema_SubjT<typeof stringSchemaOptional>
  )
})
