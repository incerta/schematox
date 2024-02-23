# General glossary

- `schema` – JSON-compatible representation of JS runtime `primitive/object` entities
- `struct` – programmatically defined schema with extra API
- `primitive schema` – the most basic unit of a schema `string/number/boolean/literal`
- `compound schema` – higher-order structure that contains any other schema as its child
- `schema subject` – the JS runtime primitive or object that is intended to be tested against the schema
- `schema subject type` – the TypeScript type of the schema subject
- `schema brand` – the way how we transform primitive type to nominal type
- `schema depth` – the number of nested levels a compound schema carries

## Primitive Schema

Primitive schema represented by js object that always has a required `type`, `of` (for `literal`) property and some [optional properties](#detailed-schemas-optional-properties). Complete list of the base detailed schema types:

- `StringSchema` – result in `string` or `string | undefined` schema subject type. Has extra properties:
  - `minLength?: number` – schema subject `.length` should be >= specified value to pass validate/parse successfully
  - `maxLength?: number` – schema subject `.length` should be <= specified value to pass validate/parse successfully
- `NumberSchema` – result in `number` or `number | undefined` schema subject type. Has extra properties:
  - `min?: number` – schema subject value should be >= specified value to pass validate/parse successfully
  - `max?: number` – schema subject value should be <= specified value to pass validate/parse successfully
- `BooleanSchema` – result in `boolean` or `boolean | undefined` schema subject type
- `LiteralSchema` – result in either `string` or `number` schema subject literal type

All those types is gathered under one identifier as union `PrimitiveSchema`

## Compound schema

// TODO: describe compound schema in details

## Schema parameters

- `optional?: boolean` – extends a subject type with `undefined`
- `nullable?: boolean` – extends a subject type with `null`
- `description?: string` – description of the particular schema property which can be used to provide more detailed information for the user/developer on validation/parse error
- `brand?: Readonly<[string, string]>` – schema brand definition resulting in brand subject type which will be intersection part of the schema subject type. Currently we support branding only for the base detailed schema, the necessity of branding for the compound schema types is currently up to debate.
- `minLength/maxLength/min/max` – is used as limiting characteristic for schema value depending on its type

## Construct type generic. "Con\_" prefix

`Con_` is a shortened form of `Construct`, which means something generic that constructs one type from another type. We don't want to use `Extract` because it implies that we are extracting something that is already there. We also don't want to use `Infer`, as it has a specific meaning within the TypeScript language itself.

## Extension type generic. "ExtWith\_" prefix

The `ExtWith_${extension}<T, U>` used for extension of type `T` with some `U`. For example:

# Type testing

For type testing we are using simple technique:

```typescript
it('check: type compatibility', () => {
  type A = string
  type B = string

  check<A, B>
  // @ts-expect-error always
  check<never, B>

  // We require `never` cast for the cases when B might infer `never`
  // `never` is the type that can be extended by itself only
  check<never, never>

  type C = string
  type D = number

  // @ts-expect-error C != D
  check<C, D>
})

it('check: type of declared identifier', () => {
  const x = 'x'

  check<string>(x)
  // @ts-expect-error always
  check<never>(x)

  const y = 0

  check<number>(y)
  // @ts-expect-error always
  check<never>(y)
})
```

The main drawback of this method is that we need double each check with invalid pair. Otherwise if `Optional` will infer `never` for some reason there will not be an error:

```typescript
check<string, never>
```

This statement will not cause an error.
