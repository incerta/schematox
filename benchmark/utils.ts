export function withPerfTest(
  name: string,
  callback: () => void,
  log?: boolean
): number {
  const start = Date.now()
  callback()
  const diff = Date.now() - start

  if (log) {
    console.info(name, diff)
  }

  return diff
}

export function getPerCentHigherThanFastest(x: {
  zod: number
  tox: number
  sup: number
}) {
  const result = {} as any
  const lowest = Math.min(...Object.values(x))

  for (const [key, value] of Object.entries(x)) {
    result[key] = (((value - lowest) / lowest) * 100).toFixed(2) + '%'
  }

  return result
}
