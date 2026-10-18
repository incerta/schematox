// Fails when README.md would need horizontal scrolling on its npmjs.com
// package page. The numbers below are measured from `npm run readme:preview`,
// which mirrors npm's layout: a ~730px readme column with 16px monospace code
// that never wraps inline.
//
// Only README.md is checked: the docs/*.md pages are read on GitHub, whose
// column is wider.

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const COLUMN_PX = 730
const CODE_CHAR_PX = 10

// A code block has 16px of padding on each side
const MAX_CODE_LINE = Math.floor((COLUMN_PX - 2 * 16) / CODE_CHAR_PX)

// A table column is as wide as its widest code span (prose wraps), plus cell
// padding, border, and the code span's own padding
const TABLE_CELL_PX = 33

const file = resolve(import.meta.dirname, '../README.md')
const lines = readFileSync(file, 'utf8').split('\n')

const errors = []
let fence = null
let table = null

const codeWidth = (cell) =>
  Math.max(
    0,
    ...(cell.match(/`[^`]*`/g) ?? []).map(
      (span) => span.slice(1, -1).replace(/\\\|/g, '|').length
    )
  )

const endTable = () => {
  if (table === null) return
  const px = table.columns.reduce(
    (sum, chars) => sum + chars * CODE_CHAR_PX + TABLE_CELL_PX,
    0
  )
  if (px > COLUMN_PX) {
    errors.push(
      `README.md:${table.line}: table is ~${px}px wide (max ${COLUMN_PX}px), shorten the code in its widest columns`
    )
  }
  table = null
}

lines.forEach((line, i) => {
  const marker = /^\s*(```+|~~~+)/.exec(line)?.[1]

  if (fence) {
    if (marker && marker[0] === fence[0] && marker.length >= fence.length) {
      fence = null
    } else if (line.length > MAX_CODE_LINE) {
      errors.push(
        `README.md:${i + 1}: code line is ${line.length} characters (max ${MAX_CODE_LINE})`
      )
    }
    return
  }

  if (marker) {
    endTable()
    fence = marker
    return
  }

  if (!line.trimStart().startsWith('|')) {
    endTable()
    return
  }

  table ??= { line: i + 1, columns: [] }
  line
    .trim()
    .replace(/^\||\|$/g, '')
    .split(/(?<!\\)\|/)
    .forEach((cell, col) => {
      table.columns[col] = Math.max(table.columns[col] ?? 0, codeWidth(cell))
    })
})
endTable()

if (errors.length > 0) {
  console.error(errors.join('\n'))
  console.error(
    '\nREADME WIDTH ERROR: npm would scroll these horizontally (check with `npm run readme:preview`)'
  )
  process.exit(1)
}
