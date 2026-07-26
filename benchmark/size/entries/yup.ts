import { object, string, number, boolean } from 'yup'

const schema = object({
  name: string().required(),
  age: number().required(),
  active: boolean().required(),
})
export const result = schema.validateSync({
  name: 'John',
  age: 30,
  active: true,
})
