import Ajv from 'ajv'

const schema = new Ajv().compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' },
    active: { type: 'boolean' },
  },
  required: ['name', 'age', 'active'],
})
export const result = schema({ name: 'John', age: 30, active: true })
