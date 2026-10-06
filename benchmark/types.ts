import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Compile-time cost of type inference: every (library × scenario × size) case
// is generated as an isolated mini project and checked with
// `tsc --extendedDiagnostics`. schematox is consumed through its built
// `dist/*.d.ts`, exactly like competitors are consumed from node_modules — so
// nobody's implementation source is type-checked, only their public types.
//
// Each case forces full resolution of the inferred type: it must not be `any`
// and must be mutually assignable with a hand-written expected type. A case
// that fails this is reported as `type mismatch` instead of a number, so the
// comparison is always like for like.
//
// Instantiations and types are deterministic, check time and memory aren't —
// those are a median of RUNS (default 5) runs. ONLY=zod,tox narrows libraries.

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const TMP = join(HERE, '.types-tmp')
const TSC = join(HERE, 'node_modules/typescript/bin/tsc')
const RUNS = Number(process.env.RUNS ?? 5)

type Lib = 'tox' | 'toxStatic' | 'zod' | 'val' | 'sup' | 'yup'

const LABELS: Record<Lib, string> = {
  tox: 'schematox (struct)',
  toxStatic: 'schematox (static)',
  zod: 'zod',
  val: 'valibot',
  sup: 'superstruct',
  yup: 'yup',
}

const LIBS = (Object.keys(LABELS) as Lib[]).filter(
  (lib) => !process.env.ONLY || process.env.ONLY.split(',').includes(lib)
)

// --- Schema description, rendered per library ---------------------------------

type Node =
  | { kind: 'string' | 'number' | 'boolean' }
  | { kind: 'literal'; value: string }
  | { kind: 'array'; of: Node }
  | { kind: 'object'; of: Record<string, Node> }
  | { kind: 'tagged'; key: string; of: Node[] }

type Render = (node: Node) => string

const PRIMITIVE_CYCLE = ['string', 'number', 'boolean'] as const

const renderers: Record<Lib, Render | undefined> = {
  tox: function r(n: Node): string {
    switch (n.kind) {
      case 'literal':
        return `tox.literal('${n.value}')`
      case 'array':
        return `tox.array(${r(n.of)})`
      case 'object':
        return `tox.object(${props(n.of, r)})`
      case 'tagged':
        return `tox.union([${n.of.map(r).join(', ')}]).discriminant('${n.key}')`
      default:
        return `tox.${n.kind}()`
    }
  },
  toxStatic: function r(n: Node): string {
    switch (n.kind) {
      case 'literal':
        return `{ type: 'literal', of: '${n.value}' }`
      case 'array':
        return `{ type: 'array', of: ${r(n.of)} }`
      case 'object':
        return `{ type: 'object', of: ${props(n.of, r)} }`
      case 'tagged':
        return `{ type: 'union', of: [${n.of.map(r).join(', ')}], discriminant: '${n.key}' }`
      default:
        return `{ type: '${n.kind}' }`
    }
  },
  zod: function r(n: Node): string {
    switch (n.kind) {
      case 'literal':
        return `z.literal('${n.value}')`
      case 'array':
        return `z.array(${r(n.of)})`
      case 'object':
        return `z.object(${props(n.of, r)})`
      case 'tagged':
        return `z.discriminatedUnion('${n.key}', [${n.of.map(r).join(', ')}])`
      default:
        return `z.${n.kind}()`
    }
  },
  val: function r(n: Node): string {
    switch (n.kind) {
      case 'literal':
        return `v.literal('${n.value}')`
      case 'array':
        return `v.array(${r(n.of)})`
      case 'object':
        return `v.object(${props(n.of, r)})`
      case 'tagged':
        return `v.variant('${n.key}', [${n.of.map(r).join(', ')}])`
      default:
        return `v.${n.kind}()`
    }
  },
  // superstruct has no discriminated-union API; a plain union is its answer
  sup: function r(n: Node): string {
    switch (n.kind) {
      case 'literal':
        return `sup.literal('${n.value}')`
      case 'array':
        return `sup.array(${r(n.of)})`
      case 'object':
        return `sup.object(${props(n.of, r)})`
      case 'tagged':
        return `sup.union([${n.of.map(r).join(', ')}])`
      default:
        return `sup.${n.kind}()`
    }
  },
  // yup has no union types at all, so `tagged` cases are skipped for it
  yup: function r(n: Node): string {
    switch (n.kind) {
      case 'literal':
        return `yup.string().oneOf(['${n.value}'] as const).required()`
      case 'array':
        return `yup.array(${r(n.of)}).required()`
      case 'object':
        return `yup.object(${props(n.of, r)}).required()`
      case 'tagged':
        throw new Error('yup has no union')
      default:
        return `yup.${n.kind}().required()`
    }
  },
}

const props = (of: Record<string, Node>, r: Render) =>
  `{ ${Object.entries(of)
    .map(([k, n]) => `${k}: ${r(n)}`)
    .join(', ')} }`

const expectedType = (n: Node): string => {
  switch (n.kind) {
    case 'literal':
      return `'${n.value}'`
    case 'array':
      return `Array<${expectedType(n.of)}>`
    case 'object':
      return `{ ${Object.entries(n.of)
        .map(([k, c]) => `${k}: ${expectedType(c)}`)
        .join('; ')} }`
    case 'tagged':
      return n.of.map(expectedType).join(' | ')
    default:
      return n.kind
  }
}

const hasTagged = (n: Node): boolean =>
  n.kind === 'tagged' ||
  (n.kind === 'array' && hasTagged(n.of)) ||
  (n.kind === 'object' && Object.values(n.of).some(hasTagged))

// --- Per-library file scaffolding ---------------------------------------------

const toxImport = (dir: string) =>
  relative(dir, join(ROOT, 'dist/index.js')).replaceAll('\\', '/')

const header: Record<Lib, (dir: string) => string> = {
  tox: (dir) =>
    `import * as tox from '${toxImport(dir)}'\nimport type { Infer } from '${toxImport(dir)}'`,
  toxStatic: (dir) => `import type { Infer, Schema } from '${toxImport(dir)}'`,
  zod: () => `import { z } from 'zod'`,
  val: () => `import * as v from 'valibot'`,
  sup: () => `import * as sup from 'superstruct'`,
  yup: () => `import * as yup from 'yup'`,
}

const declare: Record<Lib, (name: string, code: string) => string> = {
  tox: (name, code) =>
    `const ${name} = ${code}\ntype ${name}T = Infer<typeof ${name}>`,
  toxStatic: (name, code) =>
    `const ${name} = ${code} as const satisfies Schema\ntype ${name}T = Infer<typeof ${name}>`,
  zod: (name, code) =>
    `const ${name} = ${code}\ntype ${name}T = z.infer<typeof ${name}>`,
  val: (name, code) =>
    `const ${name} = ${code}\ntype ${name}T = v.InferOutput<typeof ${name}>`,
  sup: (name, code) =>
    `const ${name} = ${code}\ntype ${name}T = sup.Infer<typeof ${name}>`,
  yup: (name, code) =>
    `const ${name} = ${code}\ntype ${name}T = yup.InferType<typeof ${name}>`,
}

const usage = (
  name: string,
  node: Node
) => `type ${name}E = ${expectedType(node)}
export const ${name}NotAny: IsAny<${name}T> = false
export const ${name}A: ${name}E = null as unknown as ${name}T
export const ${name}B: ${name}T = null as unknown as ${name}E
export { ${name} }`

const PRELUDE = `type IsAny<X> = 0 extends 1 & X ? true : false`

// --- Scenarios ----------------------------------------------------------------

type Scenario = {
  key: string
  title: string
  sizes: number[]
  // one or more named schemas making up the case
  build: (n: number) => Node[]
}

const flat = (keys: number): Node => ({
  kind: 'object',
  of: Object.fromEntries(
    Array.from({ length: keys }, (_, i) => [
      `k${i}`,
      { kind: PRIMITIVE_CYCLE[i % 3] },
    ])
  ),
})

const deep = (depth: number): Node =>
  depth === 1
    ? { kind: 'object', of: { v: { kind: 'string' } } }
    : { kind: 'object', of: { v: { kind: 'string' }, child: deep(depth - 1) } }

const tagged = (variants: number): Node => ({
  kind: 'tagged',
  key: 'type',
  of: Array.from({ length: variants }, (_, i) => ({
    kind: 'object',
    of: { type: { kind: 'literal', value: `v${i}` }, a: { kind: 'number' } },
  })),
})

// { id: string, count: number, meta: { active: boolean, tags: string[] } }
const medium: Node = {
  kind: 'object',
  of: {
    id: { kind: 'string' },
    count: { kind: 'number' },
    meta: {
      kind: 'object',
      of: {
        active: { kind: 'boolean' },
        tags: { kind: 'array', of: { kind: 'string' } },
      },
    },
  },
}

// Library load cost: the import plus a single string schema
const BASELINE: Scenario = {
  key: 'baseline',
  title: 'Baseline: import + one string schema',
  sizes: [1],
  build: () => [{ kind: 'string' }],
}

const SCENARIOS: Scenario[] = [
  {
    key: 'wide',
    title: 'Wide object (keys)',
    sizes: [10, 100, 500],
    build: (n) => [flat(n)],
  },
  {
    key: 'deep',
    title: 'Deeply nested object (depth)',
    sizes: [5, 20, 50],
    build: (n) => [deep(n)],
  },
  {
    key: 'union',
    title: 'Discriminated union (variants)',
    sizes: [10, 100, 500],
    build: (n) => [tagged(n)],
  },
  {
    key: 'many',
    title: 'Many independent schemas (count)',
    sizes: [10, 100, 500],
    build: (n) => Array.from({ length: n }, () => medium),
  },
]

// --- Running tsc --------------------------------------------------------------

type Measure = {
  instantiations: number
  types: number
  checkMs: number
  memoryMb: number
}

type Outcome =
  { ok: true; measure: Measure } | { ok: false; reason: string; errors: string }

const TSCONFIG = JSON.stringify(
  {
    compilerOptions: {
      target: 'es2020',
      lib: ['es2020'],
      module: 'esnext',
      moduleResolution: 'bundler',
      strict: true,
      skipLibCheck: true,
      noEmit: true,
      types: [],
    },
    files: ['index.ts'],
  },
  null,
  2
)

function writeCase(lib: Lib, scenario: Scenario, n: number) {
  const dir = join(TMP, lib, `${scenario.key}-${n}`)
  mkdirSync(dir, { recursive: true })

  const render = renderers[lib]!
  const body = scenario
    .build(n)
    .map((node, i) =>
      [declare[lib](`s${i}`, render(node)), usage(`s${i}`, node)].join('\n')
    )

  writeFileSync(
    join(dir, 'index.ts'),
    [header[lib](dir), PRELUDE, ...body].join('\n\n') + '\n'
  )
  writeFileSync(join(dir, 'tsconfig.json'), TSCONFIG)
  return dir
}

function parseDiagnostics(out: string): Measure {
  const num = (label: string) => {
    const match = out.match(new RegExp(`^${label}:\\s+([\\d.]+)`, 'm'))
    if (!match) throw new Error(`no "${label}" in tsc output:\n${out}`)
    return Number(match[1])
  }
  return {
    instantiations: num('Instantiations'),
    types: num('Types'),
    checkMs: num('Check time') * 1000,
    memoryMb: num('Memory used') / 1024,
  }
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]!
}

function runCase(dir: string, times = RUNS): Outcome {
  const runs: Measure[] = []

  for (let i = 0; i < times; i++) {
    const res = spawnSync(
      process.execPath,
      [TSC, '-p', dir, '--extendedDiagnostics', '--pretty', 'false'],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
    )
    const out = res.stdout + res.stderr

    if (res.status !== 0) {
      const errors = out
        .split('\n')
        .filter((line) => line.includes('error TS'))
        .slice(0, 5)
        .join('\n')
      const tooDeep = errors.match(/TS(2589|2590|2321)/)
      const reason = tooDeep ? `too deep (TS${tooDeep[1]})` : 'type mismatch'
      return { ok: false, reason, errors }
    }

    runs.push(parseDiagnostics(out))
  }

  return {
    ok: true,
    measure: {
      instantiations: runs[0]!.instantiations,
      types: runs[0]!.types,
      checkMs: median(runs.map((m) => m.checkMs)),
      memoryMb: median(runs.map((m) => m.memoryMb)),
    },
  }
}

// --- Formatting ---------------------------------------------------------------

const count = (n: number) =>
  n >= 1e6
    ? `${(n / 1e6).toFixed(2)}M`
    : n >= 1e3
      ? `${(n / 1e3).toFixed(1)}K`
      : String(Math.round(n))

const ms = (n: number) => `${Math.round(n)}ms`

function table(head: string[], rows: string[][]) {
  const widths = head.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => r[i]!.length))
  )
  const line = (cells: string[]) =>
    `| ${cells.map((c, i) => c.padEnd(widths[i]!)).join(' | ')} |`
  return [
    line(head),
    line(widths.map((w) => '-'.repeat(w))),
    ...rows.map(line),
  ].join('\n')
}

// --- Main ---------------------------------------------------------------------

console.log('Building schematox declarations...')
execFileSync('npm', ['run', 'build'], { cwd: ROOT, stdio: 'ignore' })
rmSync(TMP, { recursive: true, force: true })

const tsVersion = execFileSync(process.execPath, [TSC, '--version'], {
  encoding: 'utf8',
}).trim()
console.log(`${tsVersion}, ${RUNS} run(s) per case\n`)

const baselines = new Map<Lib, Measure>()
const failures: string[] = []

const baselineRows: string[][] = []
for (const lib of LIBS) {
  const outcome = runCase(writeCase(lib, BASELINE, 1))
  if (!outcome.ok) {
    failures.push(`${LABELS[lib]} / baseline: ${outcome.errors}`)
    baselineRows.push([LABELS[lib], outcome.reason, '', '', ''])
    continue
  }
  const m = outcome.measure
  baselines.set(lib, m)
  baselineRows.push([
    LABELS[lib],
    count(m.instantiations),
    count(m.types),
    ms(m.checkMs),
    `${Math.round(m.memoryMb)}MB`,
  ])
}

console.log(`## ${BASELINE.title}\n`)
console.log(
  table(
    ['library', 'instantiations', 'types', 'check time', 'memory'],
    baselineRows
  )
)

for (const scenario of SCENARIOS) {
  const instRows: string[][] = []
  const timeRows: string[][] = []

  for (const lib of LIBS) {
    const base = baselines.get(lib)
    const instRow = [LABELS[lib]]
    const timeRow = [LABELS[lib]]

    for (const n of scenario.sizes) {
      const nodes = scenario.build(n)
      if (lib === 'yup' && nodes.some(hasTagged)) {
        instRow.push('n/a')
        timeRow.push('n/a')
        continue
      }

      process.stderr.write(`  ${LABELS[lib]} ${scenario.key}-${n}\r`)
      const outcome = runCase(writeCase(lib, scenario, n))
      process.stderr.write(' '.repeat(60) + '\r')

      if (!outcome.ok || !base) {
        const reason = outcome.ok ? 'no baseline' : outcome.reason
        if (!outcome.ok) {
          failures.push(
            `${LABELS[lib]} / ${scenario.key}-${n}:\n${outcome.errors}`
          )
        }
        instRow.push(reason)
        timeRow.push(reason)
        continue
      }

      const m = outcome.measure
      instRow.push(count(m.instantiations - base.instantiations))
      timeRow.push(ms(Math.max(0, m.checkMs - base.checkMs)))
    }

    instRows.push(instRow)
    timeRows.push(timeRow)
  }

  const head = ['library', ...scenario.sizes.map(String)]
  console.log(`\n## ${scenario.title}\n`)
  console.log('Instantiations above baseline (lower is better)\n')
  console.log(table(head, instRows))
  console.log('\nCheck time above baseline (lower is better)\n')
  console.log(table(head, timeRows))
}

// Largest nesting depth each library still infers, bisected up to MAX_DEPTH.
// The cap is TypeScript's own: comparing the inferred type against the
// expected one fails with TS2321 past 100 levels, whatever the library.
const MAX_DEPTH = 100
const DEEP = SCENARIOS.find((s) => s.key === 'deep')!
const limitRows: string[][] = []

for (const lib of LIBS) {
  process.stderr.write(`  ${LABELS[lib]} depth limit\r`)
  const passes = (depth: number) => runCase(writeCase(lib, DEEP, depth), 1)

  let limit: string
  const top = passes(MAX_DEPTH)
  if (top.ok) {
    limit = `≥ ${MAX_DEPTH}`
  } else {
    let lo = 1
    let hi = MAX_DEPTH
    let reason = top.reason
    while (hi - lo > 1) {
      const mid = Math.floor((lo + hi) / 2)
      const outcome = passes(mid)
      if (outcome.ok) lo = mid
      else [hi, reason] = [mid, outcome.reason]
    }
    limit = `${lo} — ${reason} at ${hi}`
  }
  process.stderr.write(' '.repeat(60) + '\r')
  limitRows.push([LABELS[lib], limit])
}

console.log(`\n## Maximum nesting depth (up to ${MAX_DEPTH})\n`)
console.log(table(['library', 'deepest object that infers'], limitRows))

if (failures.length) {
  console.log('\n## Failures\n')
  for (const failure of failures) console.log(`- ${failure}\n`)
}
