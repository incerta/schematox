// Renders README.md into an approximation of its npmjs.com package page,
// so README changes can be reviewed before publishing.
//
// Mirrors what npm does to a README: GitHub-flavored markdown, relative
// links resolved against the `repository` field, GitHub-style heading slugs.
// It is not npm's actual renderer — use `npm run publish:alpha` for that.

import { execSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { marked } from 'marked'

const root = resolve(import.meta.dirname, '..')
const outFile = resolve(root, 'tmp/readme-preview.html')

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const readme = readFileSync(resolve(root, 'README.md'), 'utf8')

const repo = pkg.repository.url
  .replace(/^git\+/, '')
  .replace(/^git@github\.com:/, 'https://github.com/')
  .replace(/\.git$/, '')
const blobBase = `${repo}/blob/HEAD/`
const rawBase =
  repo.replace('github.com', 'raw.githubusercontent.com') + '/HEAD/'

const isRelative = (href) => !/^([a-z]+:|#|\/\/)/i.test(href)
const resolveHref = (href, base) =>
  isRelative(href) ? new URL(href.replace(/^\.\//, ''), base).href : href

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Same algorithm as github-slugger, which npm also follows
const slugCounts = new Map()
const slug = (text) => {
  const base = text
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-')
  const count = slugCounts.get(base) ?? 0
  slugCounts.set(base, count + 1)
  return count === 0 ? base : `${base}-${count}`
}

marked.use({
  gfm: true,
  renderer: {
    heading(text, level, raw) {
      return `<h${level} id="${slug(raw)}">${text}</h${level}>\n`
    },
    link(href, title, text) {
      const t = title ? ` title="${escapeHtml(title)}"` : ''
      return `<a href="${resolveHref(href, blobBase)}"${t}>${text}</a>`
    },
    image(href, title, text) {
      const t = title ? ` title="${escapeHtml(title)}"` : ''
      return `<img src="${resolveHref(href, rawBase)}" alt="${escapeHtml(text)}"${t}>`
    },
  },
})

const body = marked.parse(readme)

const packInfo = JSON.parse(
  execSync('npm pack --dry-run --json', { cwd: root, encoding: 'utf8' })
)[0]
const kB = (bytes) => `${(bytes / 1000).toFixed(1)} kB`

const sidebar = [
  ['Install', `<code class="install">npm i ${pkg.name}</code>`],
  ['Repository', `<a href="${repo}">${repo.replace('https://', '')}</a>`],
  ['Version', pkg.version],
  ['License', pkg.license],
  ['Unpacked Size', kB(packInfo.unpackedSize)],
  ['Total Files', packInfo.entryCount],
]
  .map(([k, v]) => `<div class="side-item"><h3>${k}</h3><p>${v}</p></div>`)
  .join('\n')

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${pkg.name} - npm (preview)</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5/github-markdown-light.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css">
<style>
  body { margin: 0; background: #fff; color: #111; font-family: system-ui, -apple-system, sans-serif; }
  .bar { height: 10px; background: linear-gradient(90deg, #ff6f61, #c12127); }
  .top { border-bottom: 1px solid #eee; padding: 14px 32px; font-weight: 700; font-size: 20px; }
  .top span { color: #c12127; }
  header.pkg { max-width: 1150px; margin: 0 auto; padding: 24px 32px 0; }
  header.pkg h1 { margin: 0; font-size: 26px; }
  header.pkg p { margin: 6px 0 0; color: #666; font-size: 14px; }
  .tabs { max-width: 1150px; margin: 16px auto 0; padding: 0 32px; display: flex; gap: 0; }
  .tabs div { flex: 1; text-align: center; padding: 10px 0; border-bottom: 2px solid #eee; font-size: 14px; color: #666; }
  .tabs div.active { border-bottom-color: #ffcd3a; color: #111; font-weight: 600; }
  main { max-width: 1150px; margin: 0 auto; padding: 24px 32px 64px; display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 40px; }
  .markdown-body { font-size: 16px; }
  aside .side-item { border-bottom: 1px solid #eee; padding: 10px 0; }
  aside h3 { margin: 0 0 4px; font-size: 13px; color: #666; font-weight: 600; }
  aside p { margin: 0; font-size: 15px; word-break: break-all; }
  aside code.install { display: block; padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
  @media (max-width: 800px) {
    main { grid-template-columns: 1fr; padding: 16px; }
    header.pkg, .tabs, .top { padding-left: 16px; padding-right: 16px; }
  }
</style>
</head>
<body>
<div class="bar"></div>
<div class="top"><span>npm</span> · README preview</div>
<header class="pkg">
  <h1>${pkg.name}</h1>
  <p>${pkg.version} · Public · Preview generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</p>
</header>
<nav class="tabs"><div class="active">Readme</div><div>Code</div><div>Dependencies</div><div>Dependents</div><div>Versions</div></nav>
<main>
  <article class="markdown-body">${body}</article>
  <aside>${sidebar}</aside>
</main>
<script src="https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11/highlight.min.js"></script>
<script>hljs.highlightAll()</script>
</body>
</html>
`

mkdirSync(resolve(root, 'tmp'), { recursive: true })
writeFileSync(outFile, html)
console.log(`README preview written to ${outFile}`)
