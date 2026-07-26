import { parse } from '../../../dist/index.js'

const schema = {
  type: 'object',
  of: {
    name: { type: 'string' },
    age: { type: 'number' },
    active: { type: 'boolean' },
  },
} as const

export const result = parse(schema, { name: 'John', age: 30, active: true })
