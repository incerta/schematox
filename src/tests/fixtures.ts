export const DATA_TYPE = [
  ['boolean', [true, false]],
  ['literal', []], // added to be consistent with `foldC`
  ['number', [-1, -0.001, 0, 0.001, 1]],
  ['bigint', [BigInt(12)]],
  ['string', ['', 'x', 'xy', 'xyz']],
  [
    'binary',
    [
      new Blob(),
      new File([''], 'filename'),
      new ArrayBuffer(0),
      new DataView(new ArrayBuffer(0)),
      new Int8Array(),
      new Uint8Array(),
      new Uint8ClampedArray(),
      new Int16Array(),
      new Uint16Array(),
      new Int32Array(),
      new Uint32Array(),
      new Float32Array(),
      new Float64Array(),
    ],
  ],
  //
  ['null', [null]],
  ['NaN', [NaN]],
  ['undefined', [undefined]],
  ['infinity', [Infinity, -Infinity]],
  ['symbol', [Symbol('x'), Symbol('y')]],
  //
  ['array', [[], ['x', 'y']]],
  ['object', [{}, { x: 'y' }]],
  ['set', [new Set(), new WeakSet()]],
  ['map', [new Map(), new WeakMap()]],
  ['error', [new Error()]],
] as const satisfies Array<[type: string, variants: unknown[]]>

export const DATA_VARIANTS_BY_TYPE = DATA_TYPE.reduce<
  Record<string, unknown[]>
>((acc, [type, variants]) => {
  acc[type] = variants
  return acc
}, {}) as {
  [K in (typeof DATA_TYPE)[number][0]]: Extract<
    (typeof DATA_TYPE)[number],
    [K, unknown]
  >[1]
}
