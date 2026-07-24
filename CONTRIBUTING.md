# How To Contribute

Simply make a fork and create a PR if you think that something is off. Alternatively, create an [issue](https://github.com/incerta/schematox/issues) if you find a bug or have an idea/question.

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

# Testing strategy

Our tests are located at `tests/*`. Learn more about the testing structure and strategy at [tests/README.md](https://github.com/incerta/schematox/blob/main/tests/README.md).

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
- Publish alpha version using `npm run publish:alpha` script
- Rebase PR commits into `main` branch
- Update `CHANGELOG.md` file but don't commit changes
- Run `npm run release`
  - Release script going to extract new version from the `CHANGELOG.md` file
  - Release branch going to be created and pushed automatically
  - Wait for CI checks to pass and rebase changes to the main branch
  - NPM publish and GitHub Release should be applied automatically
  - If release is not triggered automatically, go to [release action page](https://github.com/incerta/schematox/actions/workflows/release.yml)
    and trigger it by clicking `Run workflow` button

## Checks before publish

- No formatting errors
- No type errors
- No unit test errors
- Test coverage: branches 100%, functions 100%, lines 100%, statements 100%
