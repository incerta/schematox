# schematox documentation

The [project README](../README.md) is the overview. These pages go into depth:

- [Schema types](./schema-types.md): every type, with static and struct examples and its edge cases
- [Branding](./branding.md): nominal types, and why brands are `{ __category: subCategory }`
- [Errors](./errors.md): error shape, codes, and when there are multiple entries
- [Coercion and preprocessors](./coercion-and-preprocess.md): the `{ coerce: true }` conversion table and `.preprocess()`
- [Custom metadata](./metadata.md): attaching your own data with `meta`
- [Narrowing the schema type](./narrowing.md): compile-time contracts for a subset of `Schema`
- [Schema as data](./schema-as-data.md): why `Infer` works on any schema, compared with TypeBox and ajv
- [Benchmarks](../benchmark/README.md)
