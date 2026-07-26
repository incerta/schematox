import { gzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import * as esbuild from 'esbuild'

// Measures the real bundle weight of using each library the way its own
// docs recommend — a flat 3-field object schema built once and parsed once
// (the same shape as the "flat object" benchmark) — not the package's full
// unpacked size, which includes code paths a given usage never touches.
// Each entry is bundled and minified with esbuild for the browser platform,
// then gzipped, so the numbers reflect what actually ships to a client.
//
// schematox appears twice: once authored with the `struct` builder (`object()`,
// `string()`, ...), once with a static schema object passed straight to
// `parse()`. The two produce identical runtime behavior, but only one of them
// is "schema is plain data" — this checks whether that authoring choice also
// has a bundle-size consequence, not just a portability one.

const __dirname = dirname(fileURLToPath(import.meta.url))

const LIB_LABELS = {
  tox: 'schematox (struct)',
  'tox-static': 'schematox (static schema)',
  zod: 'zod',
  sup: 'superstruct',
  val: 'valibot',
  ajv: 'ajv',
  yup: 'yup',
} as const

type LibKey = keyof typeof LIB_LABELS

const LIB_KEYS = Object.keys(LIB_LABELS) as LibKey[]

async function measure(key: LibKey) {
  const entryPoint = join(__dirname, 'entries', `${key}.ts`)

  const result = await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    minify: true,
    treeShaking: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2020',
    write: false,
  })

  const code = result.outputFiles[0].text
  const minified = Buffer.byteLength(code, 'utf8')
  const gzipped = gzipSync(Buffer.from(code, 'utf8')).length

  return { key, minified, gzipped }
}

async function main() {
  const results = []

  for (const key of LIB_KEYS) {
    results.push(await measure(key))
  }

  results.sort((a, b) => a.gzipped - b.gzipped)
  const smallestGzip = results[0].gzipped

  console.log('\nBundle size — flat object schema, built once, parsed once\n')
  console.table(
    results.map(({ key, minified, gzipped }) => ({
      library: LIB_LABELS[key],
      minified: `${(minified / 1024).toFixed(2)} kB`,
      'minified + gzip': `${(gzipped / 1024).toFixed(2)} kB`,
      'vs smallest':
        gzipped === smallestGzip
          ? 'smallest'
          : `${(gzipped / smallestGzip).toFixed(2)}x larger`,
    }))
  )
}

main()
