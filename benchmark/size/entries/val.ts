import { object, string, number, boolean, safeParse } from 'valibot'

const schema = object({ name: string(), age: number(), active: boolean() })
export const result = safeParse(schema, { name: 'John', age: 30, active: true })
