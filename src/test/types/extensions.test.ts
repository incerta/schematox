import { check } from '../test-utils'
import {
  ExtWith_Undefined_SubjT,
  ExtWith_Null_SubjT,
  ExtWith_Brand_SubjT,
  ExtWith_SchemaParams_SubjT,
} from '../../types/extensions'

describe('U is primitive', () => {
  type U = string

  it('ExtWith_Undefined_SubjT<T, U>: extend U with `undefined` based on schema T', () => {
    type NotExt = ExtWith_Undefined_SubjT<null, U>

    check<U, NotExt>()
    // @ts-expect-error always
    check<never, NotExt>()

    type Ext = ExtWith_Undefined_SubjT<{ optional: true }, U>

    check<U | undefined, Ext>()
    // @ts-expect-error U != U | undefined
    check<U, Ext>()
  })

  it('ExtWith_Null_SubjT<T, U>: extend U with `null` based on schema T', () => {
    type NotExt = ExtWith_Null_SubjT<null, U>

    check<U, NotExt>
    // @ts-expect-error always
    check<never, NotExt>

    type Ext = ExtWith_Null_SubjT<{ nullable: true }, U>

    check<U | null, Ext>
    // @ts-expect-error U != U | null
    check<U, Ext>
  })

  it('ExtWith_Brand_SubjT<T, U>: extend U with brand based on schema T', () => {
    type NotExt = ExtWith_Brand_SubjT<null, U>

    check<U, NotExt>
    // @ts-expect-error always
    check<never, NotExt>

    type Ext = ExtWith_Brand_SubjT<{ brand: Readonly<['x', 'y']> }, U>

    check<U & { __x: 'y' }, Ext>
    // @ts-expect-error always
    check<never, Ext>
  })

  describe('ExtWith_SchemaParams_SubjT<T, U>', () => {
    it('ExtWith_SchemaParams_SubjT<T, U>: undefined -> null -> brand', () => {
      type NotExt = ExtWith_SchemaParams_SubjT<null, U>

      check<U, NotExt>
      // @ts-expect-error always
      check<never, NotExt>

      type ExtUnd = ExtWith_SchemaParams_SubjT<{ optional: true }, U>

      check<U | undefined, ExtUnd>
      // @ts-expect-error U != U | undefined
      check<U, ExtUnd>

      type ExtUndNull = ExtWith_SchemaParams_SubjT<
        { optional: true; nullable: true },
        U
      >

      check<U | undefined | null, ExtUndNull>
      // @ts-expect-error U | undefined != U | undefined | null
      check<U | undefined, ExtUndNull>

      type ExtUndNullBrand = ExtWith_SchemaParams_SubjT<
        { optional: true; nullable: true; brand: Readonly<['x', 'y']> },
        U
      >

      check<undefined | null | (U & { __x: 'y' }), ExtUndNullBrand>
      // @ts-expect-error undefined | null != undefined | null | (U & { __x: 'y' }
      check<undefined | null, ExtUndNullBrand>
    })

    it('ExtWith_SchemaParams_SubjT<T, U>: brand -> null -> undefined', () => {
      type NotExt = ExtWith_SchemaParams_SubjT<null, U>

      check<U, NotExt>
      // @ts-expect-error always
      check<never, NotExt>

      type ExtBrand = ExtWith_SchemaParams_SubjT<
        { brand: Readonly<['x', 'y']> },
        U
      >

      check<U & { __x: 'y' }, ExtBrand>
      // @ts-expect-error always
      check<never, ExtBrand>

      type ExtBrandNull = ExtWith_SchemaParams_SubjT<
        { brand: Readonly<['x', 'y']>; nullable: true },
        U
      >

      check<(U & { __x: 'y' }) | null, ExtBrandNull>
      // @ts-expect-error U & { __x: 'y' } != U & { __x: 'y' }) | null
      check<U & { __x: 'y' }, ExtBrandNull>

      type ExtBrandNullUndef = ExtWith_SchemaParams_SubjT<
        { brand: Readonly<['x', 'y']>; nullable: true; optional: true },
        U
      >

      check<(U & { __x: 'y' }) | null | undefined, ExtBrandNullUndef>
      // @ts-expect-error U & { __x: 'y' } | null != U & { __x: 'y' }) | null | undefined
      check<(U & { __x: 'y' }) | null, ExtBrandNullUndef>
    })
  })
})

describe('U is object', () => {
  type U = { x: number; y: string }

  it('ExtWith_Undefined_SubjT<T, U>: extend U with `undefined` based on schema T', () => {
    type NotExt = ExtWith_Undefined_SubjT<null, U>

    check<U, NotExt>()
    // @ts-expect-error always
    check<never, NotExt>()

    type Ext = ExtWith_Undefined_SubjT<{ optional: true }, U>

    check<U | undefined, Ext>()
    // @ts-expect-error U != U | undefined
    check<U, Ext>()
  })

  it('ExtWith_Null_SubjT<T, U>: extend U with `null` based on schema T', () => {
    type NotExt = ExtWith_Null_SubjT<null, U>

    check<U, NotExt>
    // @ts-expect-error always
    check<never, NotExt>

    type Ext = ExtWith_Null_SubjT<{ nullable: true }, U>

    check<U | null, Ext>
    // @ts-expect-error U != U | null
    check<U, Ext>
  })

  it('ExtWith_Brand_SubjT<T, U>: extend U with brand based on schema T', () => {
    type NotExt = ExtWith_Brand_SubjT<null, U>

    check<U, NotExt>
    // @ts-expect-error always
    check<never, NotExt>

    type Ext = ExtWith_Brand_SubjT<{ brand: Readonly<['x', 'y']> }, U>

    check<U & { __x: 'y' }, Ext>
    // @ts-expect-error always
    check<never, Ext>
  })

  describe('ExtWith_SchemaParams_SubjT<T, U>', () => {
    it('ExtWith_SchemaParams_SubjT<T, U>: undefined -> null -> brand', () => {
      type NotExt = ExtWith_SchemaParams_SubjT<null, U>

      check<U, NotExt>
      // @ts-expect-error always
      check<never, NotExt>

      type ExtUnd = ExtWith_SchemaParams_SubjT<{ optional: true }, U>

      check<U | undefined, ExtUnd>
      // @ts-expect-error U != U | undefined
      check<U, ExtUnd>

      type ExtUndNull = ExtWith_SchemaParams_SubjT<
        { optional: true; nullable: true },
        U
      >

      check<U | undefined | null, ExtUndNull>
      // @ts-expect-error U | undefined != U | undefined | null
      check<U | undefined, ExtUndNull>

      type ExtUndNullBrand = ExtWith_SchemaParams_SubjT<
        { optional: true; nullable: true; brand: Readonly<['x', 'y']> },
        U
      >

      check<undefined | null | (U & { __x: 'y' }), ExtUndNullBrand>
      // @ts-expect-error undefined | null != undefined | null | (U & { __x: 'y' }
      check<undefined | null, ExtUndNullBrand>
    })

    it('ExtWith_SchemaParams_SubjT<T, U>: brand -> null -> undefined', () => {
      type NotExt = ExtWith_SchemaParams_SubjT<null, U>

      check<U, NotExt>
      // @ts-expect-error always
      check<never, NotExt>

      type ExtBrand = ExtWith_SchemaParams_SubjT<
        { brand: Readonly<['x', 'y']> },
        U
      >

      check<U & { __x: 'y' }, ExtBrand>
      // @ts-expect-error always
      check<never, ExtBrand>

      type ExtBrandNull = ExtWith_SchemaParams_SubjT<
        { brand: Readonly<['x', 'y']>; nullable: true },
        U
      >

      check<(U & { __x: 'y' }) | null, ExtBrandNull>
      // @ts-expect-error U & { __x: 'y' } != U & { __x: 'y' }) | null
      check<U & { __x: 'y' }, ExtBrandNull>

      type ExtBrandNullUndef = ExtWith_SchemaParams_SubjT<
        { brand: Readonly<['x', 'y']>; nullable: true; optional: true },
        U
      >

      check<(U & { __x: 'y' }) | null | undefined, ExtBrandNullUndef>
      // @ts-expect-error U & { __x: 'y' } | null != U & { __x: 'y' }) | null | undefined
      check<(U & { __x: 'y' }) | null, ExtBrandNullUndef>
    })
  })
})
