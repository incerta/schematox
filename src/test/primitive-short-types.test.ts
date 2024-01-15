import { check, unknownX } from './test-utils'
import type {
  ConstructSchemaOptionalSubjectType,
  ConstructSchemaRequiredSubjectType,
  ConstructSchemaSubjectType,
  Schema,
} from '../primitive-short-types'

it('ConstructSchemaRequiredSubjectType<T>: check "string/number/boolean/buffer"', () => {
  check<string>(unknownX as ConstructSchemaRequiredSubjectType<'string'>)
  // @ts-expect-error 'number' is not assignable to 'string'
  check<string>(unknownX as ConstructSchemaRequiredSubjectType<'number'>)

  check<number>(unknownX as ConstructSchemaRequiredSubjectType<'number'>)
  // @ts-expect-error 'boolean' is not assignable to 'number'
  check<number>(unknownX as ConstructSchemaRequiredSubjectType<'boolean'>)

  check<boolean>(unknownX as ConstructSchemaRequiredSubjectType<'boolean'>)
  // @ts-expect-error 'Buffer' is not assignable to 'boolean'
  check<boolean>(unknownX as ConstructSchemaRequiredSubjectType<'buffer'>)

  check<Buffer>(unknownX as ConstructSchemaRequiredSubjectType<'buffer'>)
  // @ts-expect-error 'string' is not assignable to 'Buffer'
  check<Buffer>(unknownX as ConstructSchemaRequiredSubjectType<'string'>)
})

it('ConstructSchemaOptionalSubjectType<T>: check "string/number/boolean/buffer"', () => {
  check<string | undefined>(
    unknownX as ConstructSchemaOptionalSubjectType<'string?'>
  )
  // @ts-expect-error 'number | undefined' is not assignable to 'string'
  check<string>(unknownX as ConstructSchemaOptionalSubjectType<'number?'>)

  check<number | undefined>(
    unknownX as ConstructSchemaOptionalSubjectType<'number?'>
  )
  // @ts-expect-error 'boolean | undefined' is not assignable to 'number'
  check<number>(unknownX as ConstructSchemaOptionalSubjectType<'boolean?'>)

  check<boolean | undefined>(
    unknownX as ConstructSchemaOptionalSubjectType<'boolean?'>
  )
  // @ts-expect-error 'Buffer | undefined' is not assignable to 'boolean'
  check<boolean>(unknownX as ConstructSchemaOptionalSubjectType<'buffer?'>)

  check<Buffer | undefined>(
    unknownX as ConstructSchemaOptionalSubjectType<'buffer?'>
  )
  // @ts-expect-error 'string | undefined' is not assignable to 'Buffer'
  check<Buffer>(unknownX as ConstructSchemaOptionalSubjectType<'string?'>)
})

it('ConstructSchemaSubjectType<T>: check "string" optional & required cases', () => {
  const stringSchemaRequired = 'string' satisfies Schema

  check<string>(
    unknownX as ConstructSchemaSubjectType<typeof stringSchemaRequired>
  )

  const stringSchemaOptional = 'string?' satisfies Schema

  check<string>(
    // @ts-expect-error 'string | undefined' is not assignable to 'string'
    unknownX as ConstructSchemaSubjectType<typeof stringSchemaOptional>
  )
})
