# How To Contribute

Simply make a fork and create a PR if you think that something is off. Every PR that changes the library's behavior, API, performance or docs should add its own entry to `CHANGELOG.md` (see [Changelog](#changelog)). Alternatively, create an [issue](https://github.com/incerta/schematox/issues) if you find a bug or have an idea/question.

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
- Create feature branch from the latest `main`
- Add an entry for your change under `## Unreleased` in `CHANGELOG.md` (see [Changelog](#changelog))
- Make a PR against `main` branch
- Review diff
- Publish alpha version using `npm run publish:alpha` script
- Rebase PR commits into `main` branch
- Rename `## Unreleased` in `CHANGELOG.md` to the new version header, e.g. `## [2.5.0](https://github.com/incerta/schematox/compare/v2.4.0...v2.5.0)`, but don't commit changes
- Run `npm run release`
  - Release script going to extract new version from the `CHANGELOG.md` file
  - Release branch going to be created and pushed automatically
  - Wait for CI checks to pass and rebase changes to the main branch
  - NPM publish and GitHub Release should be applied automatically
  - If release is not triggered automatically, go to [release action page](https://github.com/incerta/schematox/actions/workflows/release.yml)
    and trigger it by clicking `Run workflow` button

## Changelog

Changelog entries are written as part of the PR, not at release time, so `main` always describes what the next release contains. The top of `CHANGELOG.md` holds an `## Unreleased` section; add it if the previous release removed it:

```markdown
# Changelog

## Unreleased

- FEAT: what changed and why it matters to users ([#100](https://github.com/incerta/schematox/pull/100))

## [2.4.0](https://github.com/incerta/schematox/compare/v2.3.0...v2.4.0)
```

- One line per change, starting with `FEAT:`, `FIX:`, `PERF:`, `DOCS:`, or `CHORE:`; use `BREAKING:` instead when existing code stops compiling or behaves differently
- Describe the effect on users, not the implementation, and link the PR
- For `PERF`, state the measured change (e.g. from `npm run bench:self` in `benchmark/`)
- Purely internal changes (tests, CI, refactors without user-visible effect) need no entry

At release, `## Unreleased` is renamed to the version header; that rename is the only change `npm run release` accepts.

## Checks before publish

- No formatting errors
- No type errors
- No unit test errors
- Test coverage: branches 100%, functions 100%, lines 100%, statements 100%
