# How To Contribute

Currently, it's a small, not well-known project so we don't need any strict contribution policy. Simply make a fork and create a PR if you think that something is off. Alternatively, create an [issue](https://github.com/incerta/schematox/issues) if you find a bug or have an idea/question.

# Glossary

- `schema` - JSON-compatible representation of JS runtime `primitive/object` entities
- `struct` - programmatically defined schema with extra API
- `construct` - struct created by direct `makeStruct` function call
- `primitive schema` - the most basic unit of a schema `string/number/boolean/literal`
- `compound schema` - higher-order structure that contains any other schema as its child
- `subject` - the JS runtime primitive or object that is intended to be tested against the schema
- `subject type` - the TypeScript type of the schema subject
- `brand` - intersection which makes primitive type nominal
- `schema depth` - the number of nested levels a compound schema carries
- `nested schema` - a schema embedded within a compound schema
- `schema range parameter` - schema type dependent parameter used as value size restriction
- `fold label` - code parts in tests that are not supposed to be copy pasted from test to test `foldA`, `foldB` etc.

## Primitive Schema

Primitive schema represented by js object that always has a required `type`, `of` (for `literal`) property and some [optional properties](#detailed-schemas-optional-properties). Complete list of the base detailed schema types:

- `StringSchema` - result in `string` subject type. Has range parameters:
  - `minLength?: number` - schema subject `.length` should be >= specified value to pass validate/parse successfully
  - `maxLength?: number` - schema subject `.length` should be <= specified value to pass validate/parse successfully
- `NumberSchema` - result in `number` or `number | undefined` schema subject type. Has extra properties:
  - `min?: number` - schema subject value should be >= specified value to pass validate/parse successfully
  - `max?: number` - schema subject value should be <= specified value to pass validate/parse successfully
- `BooleanSchema` - result in `boolean` or `boolean | undefined` schema subject type
- `LiteralSchema` - result in either `string` or `number` schema subject literal type

All those types is gathered under `PrimitiveSchema` union

## Compound schema

- `ObjectSchema` - result in object subject type with defined keys and value types
- `ArraySchema` - result in `Array<T>` subject type. Has range parameters:
  - `minLength?: number` - schema subject `.length` should be >= specified value to pass validate/parse successfully
  - `maxLength?: number` - schema subject `.length` should be <= specified value to pass validate/parse successfully
- `UnionSchema` - result in any available schema type union

All those types is gathered under `CompooundSchema` union

## Construct type generic. "Con\_" prefix

Generic that constructs type based on other type(s) in the manner which can not be strictly described as extenstion or reduction (narrowing, inference, extraction).

## Extension type generic. "ExtWith\_" prefix

The `ExtWith_${extension}<T, U>` used for extension of type `T` with some `U`. It might be intersection (brand) or just unionization with another type (optional, nullable).

# Testing strategy

Our tests are located at `src/tests/*`. Learn more about the testing structure and strategy at [tests/README.md](https://github.com/incerta/schematox/blob/main/src/tests/README.md).

# Type testing

For type testing we are using simple technique:

```typescript
import * as x from 'schematox'

it('type equivalence check example', () => {
  type Expected = string
  type Actual = string

  x.tCh<Actual, Expected>()
  x.tCh<Expected, Actual>()
})
```

The `tCh` function will raise static type error if the second generic argument type is not extends the first one. In order to make sure that types are structurally identical we must always have two casts: `<Actual, Expected>` and `<Expected, Actual>`.

# Development routine

- Create an issue (optional)
- Create feature branch
- Make a PR against `main` branch
- Review diff
- Rebase PR commits into `main` branch
- Update `CHANGELOG.md` with `chore: release $VERSION` commit
- Patch version by semver
  - `npm run version:patch`
  - `npm run version:minor`
  - `npm run version:major`
- Run `npm publish` to release

## Checks before publish

We using `package.json` > `prepublishOnly` script to ensure that following conditions are satisfied.

- No formatting errors
- No type errors
- No lint errors
- No unit test errors
- Test coverage: branches 100%, functions 100%, lines 100%, statements 100%
- Current branch is `main` branch
- The `main` branch is in sync with github remote repo
