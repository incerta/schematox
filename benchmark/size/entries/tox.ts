import { object, string, number, boolean } from '../../../dist/index.js'

const schema = object({ name: string(), age: number(), active: boolean() })
export const result = schema.parse({ name: 'John', age: 30, active: true })
