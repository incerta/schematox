import * as sup from 'superstruct'
import * as v from 'valibot'

export type LibKey = 'tox' | 'zod' | 'sup' | 'val' | 'ajv' | 'yup'

// Normalizes each library's validate/parse call to a single boolean, so the
// benchmark runner can treat every library uniformly. Each adapter uses that
// library's own non-throwing API where one exists (schematox/zod/superstruct/
// valibot/ajv all have one) — yup doesn't, so its adapter wraps the
// throwing validateSync() in a try/catch, which is a real, fair difference
// in cost between libraries, not something to hide by picking an unusual API.
export const adapters: Record<
  LibKey,
  (schema: any, subject: unknown) => boolean
> = {
  tox: (schema, subject) => schema.parse(subject).success,
  zod: (schema, subject) => schema.safeParse(subject).success,
  sup: (schema, subject) => sup.validate(subject, schema)[0] === undefined,
  val: (schema, subject) => v.safeParse(schema, subject).success,
  ajv: (schema, subject) => schema(subject) === true,
  yup: (schema, subject) => {
    try {
      schema.validateSync(subject)
      return true
    } catch {
      return false
    }
  },
}

export const LIB_LABELS: Record<LibKey, string> = {
  tox: 'schematox',
  zod: 'zod',
  sup: 'superstruct',
  val: 'valibot',
  ajv: 'ajv',
  yup: 'yup',
}
