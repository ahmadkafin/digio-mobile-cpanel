export const groupByRole = (rows) => {
  const norm = (s) =>
    (s ?? '')
      .toString()
      .replace(/\u00A0/g, ' ')
      .trim()
      .replace(/\s+/g, ' ')
  const map = new Map()
  for (const r of rows) {
    const role = norm(r.role)
    const name = norm(r.groupNames)
    if (!role) continue // skip kalau role kosong
    if (!map.has(role)) map.set(role, new Set())
    if (name) map.get(role).add(name) // dedup nama group
  }
  return Array.from(map, ([role, names]) => ({
    role,
    groupNames: Array.from(names).sort(),
    count: names.size,
  }))
}
