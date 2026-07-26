import { object, string, number, boolean, validate } from 'superstruct'

const schema = object({ name: string(), age: number(), active: boolean() })
export const result = validate({ name: 'John', age: 30, active: true }, schema)
