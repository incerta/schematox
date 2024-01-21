import { parse } from '../general-schema-parser'
import { union } from '../programmatic-schema'
import { check, unknownX } from './test-utils'

it('union: must have at least one argument', () => {
  expect(() => union()).toThrow()
})

it('union: stringUnion', () => {
  const schema = union('x', 'y')()

  check<Array<'x' | 'y'>>(unknownX as typeof schema.of)
  expect(schema).toStrictEqual({
    type: 'stringUnion',
    of: ['x', 'y'],
  })
})

it('union: stringUnion with options', () => {
  // @ts-expect-error '"z"' is not assignable to type '"x" | "y" | undefined'
  expect(() => union('x', 'y')({ optional: true, default: 'z' })).not.toThrow()

  const schema = union(
    'x',
    'y'
  )({
    optional: true,
    default: 'y',
    description: 'descriptionValue',
    // TODO: the necessity of usage `as const` statement
    //       puts under the question the whole method of
    //       programmatic schema definition
    brand: ['key', 'value'] as const,
  })

  // @ts-expect-error Cannot assign to 'optional' because it is a read-only property
  schema.optional = true

  check<{
    type: 'stringUnion'
    of: Array<'x' | 'y'>
    optional: true
    default: 'y'
    brand: ['key', 'value']
  }>(unknownX as typeof schema)

  expect(schema).toStrictEqual({
    type: 'stringUnion',
    of: ['x', 'y'],
    optional: true,
    default: 'y',
    description: 'descriptionValue',
    brand: ['key', 'value'],
  })

  const parsed = parse(schema, 'x')

  if (parsed.error) {
    throw Error('Not expected')
  }

  check<('x' | 'y') & { __key: 'value' }>(unknownX as typeof parsed.data)

  expect(parsed.data).toBe('x')
  expect(parsed.error).toBe(undefined)
})

it('union: numberUnion', () => {
  // @ts-expect-error Type '2' is not assignable to type '0 | 1 | undefined'
  expect(() => union(0, 1)({ optional: true, default: 2 })).not.toThrow()

  const schema = union(
    0,
    1
  )({
    optional: true,
    default: 1,
    description: 'descriptionValue',
    // TODO: the necessity of usage `as const` statement
    //       puts under the question the whole method of
    //       programmatic schema definition
    brand: ['key', 'value'] as const,
  })

  // @ts-expect-error Cannot assign to 'optional' because it is a read-only property
  schema.optional = true

  check<{
    type: 'numberUnion'
    of: Array<0 | 1>
    optional: true
    default: 1
    brand: ['key', 'value']
  }>(unknownX as typeof schema)

  expect(schema).toStrictEqual({
    type: 'numberUnion',
    of: [0, 1],
    optional: true,
    default: 1,
    description: 'descriptionValue',
    brand: ['key', 'value'],
  })

  const parsed = parse(schema, 1)

  if (parsed.error) {
    throw Error('Not expected')
  }

  check<(0 | 1) & { __key: 'value' }>(unknownX as typeof parsed.data)

  expect(parsed.data).toBe(1)
  expect(parsed.error).toBe(undefined)
})
