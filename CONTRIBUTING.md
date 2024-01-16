# General glossary

- `schema` – a JSON-compatible representation of JS runtime `primitive/object/array/Buffer` entities
- `schematoX` – the library closure which is wraps `schema` and used for parsing/validating schema subjects
- `base schema` – the most basic unit of a schema
- `compound schema` – higher-order structure that connects base or other compound schemas
- `short schema` – shortened form of the base or compound schema
- `detailed schema` – detailed version of the base or compound schema
- `schema subject` – the JS runtime primitive or object that is intended to be tested against the schema
- `schema subject type` – the TypeScript type of the schema subject
- `schema validated subject type` – the resultant TypeScript type of the entity validated by the Schematox library
- `schema parsed subject type` – the resultant TypeScript type of the entity parsed by the Schematox library
- `schema brand` – the method used to distinguish two identical JS entities from the runtime type standpoint using type intersection
- `schema brand definition` – the definition format of the schema brand
- `schema brand subject type` – the intersection of the brand part of the schema validated/parsed subject type
- `schema depth` – the number of nested levels a compound schema carries

# SchematoX types

In our project, we have many plain and generic types. These represent the most sophisticated part of the `schematoX` library. In the early stages of development, it became obvious that we needed to shorten some names, like `ConstructPrimitiveSchemaSubjectTypeValidated`, because they were too long and noisy. However, we still needed a clear understanding of what these types are doing.

So, the solution lies in adhering to naming conventions. The reason why our type identifiers were too long in the first place is because we want to test each layer of schema subject construction separately. Otherwise we will have tremendous tree of `T extends U`. Not only such tree will be incomprehensible by any human there would be no way of creating coherent [type testing strategy](type_testing_strategy).

We also want to keep our type source code clean from the comments so we explain why each type exists in the following documentation.

## Base short schema. "BS\_" prefix, "\_Req" & "\_Opt" suffixes

`BS_` is shortened `BaseShort`. Base short short schema represented by string literal. The `_Req` identifier suffix signifies that schema subject type should be required and `_Opt` is optional.

Required subject base schema short types:

- `BS_String_Req` – result in `string` schema subject type
- `BS_Number_Req` – result in `number` schema subject type
- `BS_Boolean_Req` – result in `boolean` schema subject type
- `BS_Buffer_Req` – result in `Buffer` schema subject type

Optional subject base schema short types:

- `BS_String_Opt` – result in `string | undefined` schema subject type
- `BS_Number_Opt` – result in `number | undefined` schema subject type
- `BS_Boolean_Opt` – result in `boolean | undefined` schema subject type
- `BS_Buffer_Opt` – result in `Buffer | undefined` schema subject type

Those types gathered in unions by the following type identifiers:

```typescript
type BS_Schema_Req =
  | BS_String_Req
  | BS_Number_Req
  | BS_Boolean_Req
  | BS_Buffer_Req

type BS_Schema_Opt =
  | BS_String_Opt
  | BS_Number_Opt
  | BS_Boolean_Opt
  | BS_Buffer_Opt

type BS_Schema = BS_Schema_Req | BS_Schema_Opt
```

## Base detailed schema. "BD_Schema". "BD\_" prefix

`BD_` is shortened `BaseDetailedSchema`. Base detailed schema represented by js object that always has a required `type`, `of` (for unions) property and some [optional properties](#detailed-schemas-optional-properties). Complete list of the base detailed schema types:

- `BD_String` – result in `string` or `string | undefined` schema subject type. Has extra properties:
  - `minLength?: number` – schema subject `.length` should be >= specified value to pass validate/parse successfully
  - `maxLength?: number` – schema subject `.length` should be <= specified value to pass validate/parse successfully
- `BD_Number` – result in `number` or `number | undefined` schema subject type. Has extra properties:
  - `min?: number` – schema subject value should be >= specified value to pass validate/parse successfully
  - `max?: number` – schema subject value should be <= specified value to pass validate/parse successfully
- `BD_Boolean` – result in `boolean` or `boolean | undefined` schema subject type. Has extra properties:
- `BD_Buffer` – result in `Buffer` or `Buffer | undefined` schema subject type
  - `minLength?: number` – schema subject `.length` should be >= specified value to pass validate/parse successfully
  - `maxLength?: number` – schema subject `.length` should be <= specified value to pass validate/parse successfully
- `BD_StringUnion` – result in union of the string literals schema subject type
- `BD_NumberUnion` – result in union of the number literals schema subject type

In future we might support `BD_Union`, but it is up to debate if we do really need it or current constraints will suits our goals better than library general flexibility.

All those types is gathered under one identifier as union `BD_Schema`

```typescript
type BD_Schema =
  | BD_String
  | BD_Number
  | BD_Boolean
  | BD_Buffer
  | BD_StringUnion
  | BD_NumberUnion
```

## Base schema "Base_Schema"

Resolution of `BS_` and `BD_` prefixes:

```typescript
type Base_Schema = BS_Schema | BD_Schema
```

## Compound short schema. "CS\_" prefix

`CS_` is shortened `CompoundShortSchema`. Compound short schema represented by js object which can contain any other schema including itself in simplified syntax manner. Complete list of the compound short schema types:

- `CS_Array<T = U>` – result in:
  - `Array<Con_SubjT_V<T>>` schema subject type for validate schematox flow
  - `Array<NonNullable<Con_SubjT_P<T>>>` schema subject type for parse schematox flow

We want to emphasize that in parse schematox flow all optional values reduced to `undefined` therefor we using `NonNullable` generic to clear them up.

- `CS_Object<T = U>` – result in:
  - `{ [k in keyof T]: Con_SubjT_V<T[k]> }` schema subject type for validate schematox flow
  - `{ [k in keyof T]: Con_SubjT_P<T[k]> }` schema subject type for parse schematox flow

In future we might support `CS_Record`, `CS_ArrayUnion`, `CS_ObjectUnion`, `CS_Intersection` and `CS_Union` – but it is up to debate if we do really need them or current constraints will suits our goals better than library general flexibility.

## Compound detailed schema. "CD\_" prefix

`CD_` is shortened `CompoundDetailedSchema`. Compound short schema represented by js object which can contain any other schema including itself. The object has required `of` property from which we infer nested schema types. We need detailed syntax in order to detect if schema is optional in the context of parent schema structure, here is an example:

```typescript
import { Schema } from 'schematox'

const userSchema = {
  id: { type: 'string', brand: ['idFor', 'User'] },
  firstName: 'string',
  surName: 'string',
  email: { type: 'string', brand: ['format', 'email'] },
  contacts: {
    type: 'object',
    optional: true,
    of: {
      phoneNumber: { type: 'string', brand: ['format', 'E.164'] },
    },
  },
} as const satisfies Schema
```

The schema subject type of the `userSchema` will be:

```typescript
type UserSchemaSubjectType = {
  id: string & { __idFor: 'User' }
  firstName: string
  surName: string
  email: string & { __format: 'email' }
  contacts: { phoneNumber: string & { __format: 'E.164' } } | undefined
}
```

We want ability to specify that `contacts` key value is optional. Because our schema MUST be JSON compatible we don't really have any other choice other than that. Each compound detailed schema can also have `description?` property and extra props depending on its specific type.

Complete list of the compound detailed schema types:

- `CD_Array<T = U> = T extends { of: infer V }` – result in:
  - `Array<Con_SubjT_V<V>>` schema subject type for validate schematox flow
  - `Array<NonNullable<Con_SubjT_P<V>>>` schema subject type for parse schematox flow
- Compound array detailed schema has extra props:
  - `minLength?: number` – schema subject `.length` should be >= specified value to pass validate/parse successfully
  - `maxLength?: number` – schema subject `.length` should be <= specified value to pass validate/parse successfully

We want to emphasize that in parse schematox flow all optional values reduced to `undefined` therefor we using `NonNullable` generic to clear them up.

- `CD_Object<T = U> = T extends { of: infer V }` – result in:
  - `{ [k in keyof T]: Con_SubjT_V<T[k]> }` schema subject type for validate schematox flow
  - `{ [k in keyof T]: Con_SubjT_P<T[k]> }` schema subject type for parse schematox flow

In future we might support `CD_Record`, `CD_Tuple`, `CD_ArrayUnion`, `CD_ObjectUnion`, `CD_Intersection` and `CD_Union` – but it is up to debate if we do really need them or current constraints will suits our goals better than library general flexibility.

## Compound schema "Compound_Schema"

Resolution of `CS_` and `CD_` prefixes:

```typescript
type CompoundSchema = CS_Schema | CD_Schema
```

## Schema

The type representing each schema that can be wrapped by `schematoX` closure for parsing/validating:

```typescript
type Schema = BaseSchema | CompoundSchema
```

## Detailed schema optional properties

- `optional?: boolean` – affects schema validated/parsed subject type and parse/validate `schematoX` logic
- `default?: T` – default value that should be populated on `schematoX` parse and ignored on validate flows. Exists for all base detailed schemas with an exception of `Buffer` because buffer default value is not JSON compatible
- `description?: string` – description of the particular schema property which can be used to provide more detailed information for the user/developer on `schematoX` validation/parse error
- `brand?: [__key: string, __keyFor: string]` – schema brand definition resulting in brand subject type which will be intersection part of the schema subject type. Currently we support branding only for the base detailed schema, the necessity of branding for the compound schema types is currently up to debate.

TODO: add `minLength/maxLength/min/max` description

## Construct type generic. "Con\_" prefix

`Con_` is a shortened form of `Construct`, which means something generic that constructs one type from another type. We don't want to use `Extract` because it implies that we are extracting something that is already there. We also don't want to use `Infer`, as it has a specific meaning within the TypeScript language itself.

## Extension type generic. "Extend\_" prefix

TODO: explain what they are

## Parse and validated schematoX flows. "SubjT_V" and "SubjT_P" suffixes

`SubjT_V` is shortened `SubjectTypeValidated`. `SubjT_P` is shortened `SujbectTypeParsed`. Used in conjunction with `Con_` prefix. Both suffixes representing schema subject type depending on the schema subject check method: parse or validate. We support two flows of type inference for two main reasons:

- Validate flow returns reference to original object without any mutations on success validation so we can't omit `undefined` values from the `Array` of validation flow if user specified optional schema as the array schema child.
- Parse flow returns deep copy of parsed object. IMPORTANT exception is `Buffer` base schema value which will be passed by reference due to performance concerns. The implications:
  - The parse flow can populate absent object key values with `default` specified in the corresponding property value schema
  - The runtime parser just ignores non specified optional values but the type generic is not aware of it. So each generic that can

The third reason is in future we could support extra flows like `parseStrict/parseWeak` which might have the same implications of the schema subject type. So already existed separation might be very handy.

Because `default` value can be specified on base detailed schema ground level (`BD_Schema`) all type constructors for all base detailed and compound schema subject type will be split accordingly. Check out [type-testing-strategy](type-testing-strategy) to know how those split works within type unit testing context.

## List of all generic construct types:

TODO: explain why each generic type exists specifically

- `Con_BS_Schema_Req_SubjT`
- `Con_BS_Schema_Opt_SubjT`
- `Con_Brand_SubjT`
- `Con_BS_Schema_SubjT`

- `Con_BD_Schema_SubjT_V`
- `Con_BD_Schema_SubjT_P`

- `Con_BaseSchema_SubjT_V`
- `Con_BaseSchema_SubjT_P`

- `Con_CS_Array_SubjT_V`
- `Con_CS_Array_SubjT_P`

- `Con_CD_Array_SubjT_V`
- `Con_CD_Array_SubjT_P`

- `Con_ArraySchema_SubjT_V`
- `Con_ArraySchema_SubjT_P`

- `Con_CS_Object_SubjT_V`
- `Con_CS_Object_SubjT_P`

- `Con_CD_Object_SubjT_V`
- `Con_CD_Object_SubjT_P`

- `Con_ObjectSchema_SubjT_V`
- `Con_ObjectSchema_SubjT_P`

- `Con_Schema_SubjT_V`
- `Con_Schema_SubjT_P`

# Type testing strategy

TODO: ...
