# Changelog

## [1.0.1](https://github.com/incerta/schematox/compare/v1.0.1...v1.1.0)

- [Standard schema support #46](https://github.com/incerta/schematox/pull/46)

## [1.0.1](https://github.com/incerta/schematox/compare/v1.0.0...v1.0.1)

- [FIX: struct brand assignment second argument type restriction #44](https://github.com/incerta/schematox/pull/44)

## [1.0.0](https://github.com/incerta/schematox/compare/v0.4.0...v1.0.0)

The module went through major refactoring so it could be ready for production usage:

- [RecordSchema support #34](https://github.com/incerta/schematox/pull/34)
- [Drop validate/guard feature support #36](https://github.com/incerta/schematox/pull/36)
- [Pre major release testing architecture and file structure refactoring #38](https://github.com/incerta/schematox/pull/38)
- [Break down parse logic into smaller functions #39](https://github.com/incerta/schematox/pull/39)
- [Support unrestricted object schema depth #42](https://github.com/incerta/schematox/pull/42)
- [Support tuple schema #43](https://github.com/incerta/schematox/pull/43)

## [0.4.0](https://github.com/incerta/schematox/compare/v0.3.1...v0.4.0)

- [`aa0d95e`](https://github.com/incerta/schematox/commit/aa0d95e30b7784c0ce29317ae808e4ba7950abab) Extend compound structure nesting limit to 12 layers of depth

## [0.3.1](https://github.com/incerta/schematox/compare/v0.3.0...v0.3.1)

### Bugfix

- [`e3527df`](https://github.com/incerta/schematox/commit/e3527dfb46b73a4b6579e3d2aea58f3301aded9a) [#24](https://github.com/incerta/schematox/pull/25) Parser should preserve object optional key only if it is specified in source

### Chore

- [`7d98a81`](https://github.com/incerta/schematox/commit/7d98a81c2bc18280299365da32f8346d5b145560) Use "es2015" tsconfig target instead of outdated "es5"

### Features

- [`8bc2082`](https://github.com/incerta/schematox/commit/8bc208211457901f4f7246f00694f112d56f8d56) [#22](https://github.com/incerta/schematox/issues/22) Ensure optional properties in schemas reflect as optional in object context (@incerta)

## [0.3.0](https://github.com/incerta/schematox/compare/v0.2.0...v0.3.0)

### Features

- [`8bc2082`](https://github.com/incerta/schematox/commit/8bc208211457901f4f7246f00694f112d56f8d56) [#22](https://github.com/incerta/schematox/issues/22) Ensure optional properties in schemas reflect as optional in object context (@incerta)
