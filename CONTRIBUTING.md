# General glossary

- `schema` – a JSON-compatible representation of JS runtime `primitive/object/array` entities
- `base schema` – the most basic unit of a schema
- `compound schema` – higher-order structure that contains base or other compound schemas
- `schema subject` – the JS runtime primitive or object that is intended to be tested against the schema
- `schema subject type` – the TypeScript type of the schema subject
- `schema validated subject type` – the resultant TypeScript type of the entity validated by `x`
- `schema parsed subject type` – the resultant TypeScript type of the entity parsed by `x`
- `schema brand` – the method used to distinguish two identical JS entities from the runtime type standpoint using type intersection
- `schema brand definition` – the definition format of the schema brand
- `schema brand subject type` – the intersection of the brand part of the schema validated/parsed subject type
- `schema depth` – the number of nested levels a compound schema carries

// TODO: should be renamed to `BaseSchema`

## Base detailed schema. "BD_Schema". "BD\_" prefix

`BD_` is shortened `BaseDetailedSchema`. Base detailed schema represented by js object that always has a required `type`, `of` (for unions) property and some [optional properties](#detailed-schemas-optional-properties). Complete list of the base detailed schema types:

- `BD_String` – result in `string` or `string | undefined` schema subject type. Has extra properties:
  - `minLength?: number` – schema subject `.length` should be >= specified value to pass validate/parse successfully
  - `maxLength?: number` – schema subject `.length` should be <= specified value to pass validate/parse successfully
- `BD_Number` – result in `number` or `number | undefined` schema subject type. Has extra properties:
  - `min?: number` – schema subject value should be >= specified value to pass validate/parse successfully
  - `max?: number` – schema subject value should be <= specified value to pass validate/parse successfully
- `BD_Boolean` – result in `boolean` or `boolean | undefined` schema subject type. Has extra properties:
- `BD_StringUnion` – result in union of the string literals schema subject type
- `BD_NumberUnion` – result in union of the number literals schema subject type

All those types is gathered under one identifier as union `BD_Schema`

## Detailed schema optional properties

- `optional?: boolean` – affects schema validated/parsed subject type and parse/validate `schematoX` logic
- `description?: string` – description of the particular schema property which can be used to provide more detailed information for the user/developer on `schematoX` validation/parse error
- `brand?: [__key: string, __keyFor: string]` – schema brand definition resulting in brand subject type which will be intersection part of the schema subject type. Currently we support branding only for the base detailed schema, the necessity of branding for the compound schema types is currently up to debate.
- `minLength/maxLength/min/max` – is used as limiting characteristic for schema value

## Construct type generic. "Con\_" prefix

`Con_` is a shortened form of `Construct`, which means something generic that constructs one type from another type. We don't want to use `Extract` because it implies that we are extracting something that is already there. We also don't want to use `Infer`, as it has a specific meaning within the TypeScript language itself.

## Extension type generic. "ExtWith\_" prefix

The `ExtWith_${extentionName}<T, U>` used for extension of type `T` with some `U`. For example:

```typescript
export type ExtWith_BrandSchema_SubjT<T extends BD_Schema, U> = T extends {
  brand: infer V
}
  ? V extends BrandSchema
    ? Con_BrandSchema_SubjT<V> & U
    : never
  : U
```

# Type testing

For type testing we are using simple technique:

```typescript
export const check = <T>(x: T): T => x
export const unknownX: unknown = undefined

type Optional<T> = T | undefined

it('Optional<T>: check', () => {
  check<string | undefined>(unknownX as Optional<string>)
  // @ts-expect-error 'string' is not assignable to type 'number'
  check<number | undefined>(unknownX as Optional<string>)
})
```

The main drawback of this method is that we need double each check with invalid pair. Otherwise if `Optional` will infer `never` for some reason there will not be an error:

```typescript
check<string>(unknownX as never)
```

This statement will not cause an error.
