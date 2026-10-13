import { isBlank, parseMonth, parseNumber } from './parsing.js'

const MAX_CATEGORIES = 8

function isMapped(index) {
  return index !== null && index !== undefined && index !== ''
}

/**
 * Aggregates worksheet rows according to the user's column mapping.
 * Pure function — easy to test and safe to run on any data.
 *
 * @param {Array<Array<unknown>>} rows    data rows (header excluded)
 * @param {Record<string, number|null>} mapping  role → column index
 */
export function computeAnalytics(rows, mapping) {
  const has = {
    date: isMapped(mapping.date),
    category: isMapped(mapping.category),
    income: isMapped(mapping.income),
    expense: isMapped(mapping.expense),
    budget: isMapped(mapping.budget),
    actual: isMapped(mapping.actual),
  }
  const numericRoles = ['income', 'expense', 'budget', 'actual'].filter((r) => has[r])

  const totals = { income: 0, expense: 0, budget: 0, actual: 0 }
  const monthly = new Map()
  const categories = new Map()
  let rowsUsed = 0
  let invalidCells = 0
  let undatedRows = 0

  for (const row of rows) {
    const values = {}
    let any = false
    for (const role of numericRoles) {
      const raw = row[mapping[role]]
      if (isBlank(raw)) continue
      const n = parseNumber(raw)
      if (n === null) {
        invalidCells++
        continue
      }
      values[role] = n
      any = true
    }
    if (!any) continue
    rowsUsed++

    for (const role in values) totals[role] += values[role]

    if (has.date) {
      const m = parseMonth(row[mapping.date])
      if (m) {
        let bucket = monthly.get(m.key)
        if (!bucket) {
          bucket = { key: m.key, income: 0, expense: 0, budget: 0, actual: 0, hasBudget: false, hasActual: false }
          monthly.set(m.key, bucket)
        }
        for (const role in values) bucket[role] += values[role]
        if ('budget' in values) bucket.hasBudget = true
        if ('actual' in values) bucket.hasActual = true
      } else {
        undatedRows++
      }
    }

    if (has.category) {
      const raw = row[mapping.category]
      const name = isBlank(raw) ? '—' : String(raw).trim().slice(0, 60)
      let bucket = categories.get(name)
      if (!bucket) {
        bucket = { name, income: 0, expense: 0, budget: 0, actual: 0, hasBudget: false, hasActual: false }
        categories.set(name, bucket)
      }
      for (const role in values) bucket[role] += values[role]
      if ('budget' in values) bucket.hasBudget = true
      if ('actual' in values) bucket.hasActual = true
    }
  }

  const profit = totals.income - totals.expense
  const variance = totals.actual - totals.budget

  const monthlyList = [...monthly.values()]
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((m) => ({ ...m, profit: m.income - m.expense, variance: m.actual - m.budget }))

  const allCategories = [...categories.values()].map((c) => ({
    ...c,
    profit: c.income - c.expense,
    variance: c.actual - c.budget,
  }))

  return {
    has,
    totals: {
      ...totals,
      profit,
      margin: totals.income ? profit / totals.income : null,
      variance,
      variancePct: totals.budget ? variance / Math.abs(totals.budget) : null,
    },
    monthly: monthlyList,
    categories: allCategories,
    expenseByCategory: has.expense ? topN(allCategories, 'expense') : [],
    incomeByCategory: has.income ? topN(allCategories, 'income') : [],
    budgetByCategory:
      has.budget && has.actual
        ? allCategories
            .filter((c) => c.hasBudget || c.hasActual)
            .sort((a, b) => Math.abs(b.budget) + Math.abs(b.actual) - (Math.abs(a.budget) + Math.abs(a.actual)))
            .slice(0, MAX_CATEGORIES)
        : [],
    stats: { rowsUsed, invalidCells, undatedRows, totalRows: rows.length },
  }
}

/** Top categories by one measure; the rest is folded into a single "Other" bar. */
function topN(categories, measure) {
  const sorted = categories.filter((c) => c[measure] !== 0).sort((a, b) => b[measure] - a[measure])
  if (sorted.length <= MAX_CATEGORIES) return sorted.map((c) => ({ name: c.name, value: c[measure] }))
  const head = sorted.slice(0, MAX_CATEGORIES - 1).map((c) => ({ name: c.name, value: c[measure] }))
  const rest = sorted.slice(MAX_CATEGORIES - 1).reduce((sum, c) => sum + c[measure], 0)
  return [...head, { name: '__other__', value: rest, count: sorted.length - (MAX_CATEGORIES - 1) }]
}
