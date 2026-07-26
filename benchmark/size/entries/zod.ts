import { z } from 'zod'

const schema = z.object({
  name: z.string(),
  age: z.number(),
  active: z.boolean(),
})
export const result = schema.safeParse({ name: 'John', age: 30, active: true })
