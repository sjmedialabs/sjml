/** Normalize display order for consistent sorting (missing/invalid → end of list). */
export function getDisplayOrder(value: unknown): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 9999
}

export function compareByDisplayOrder<T extends { displayOrder?: unknown }>(
  a: T,
  b: T,
  tieBreaker?: (a: T, b: T) => number,
): number {
  const diff = getDisplayOrder(a.displayOrder) - getDisplayOrder(b.displayOrder)
  if (diff !== 0) return diff
  return tieBreaker ? tieBreaker(a, b) : 0
}

export function sortByDisplayOrder<T extends { displayOrder?: unknown }>(
  items: T[],
  tieBreaker?: (a: T, b: T) => number,
): T[] {
  return [...items].sort((a, b) => compareByDisplayOrder(a, b, tieBreaker))
}
