/**
 * DEMO DATA — FICTIONAL.
 * "Demo Telecom Co." and every number below are invented for demonstration only.
 * They are NOT real company results and NOT Owen's personal performance figures.
 *
 * The data is generated deterministically (same numbers on every visit) in the
 * same shape an uploaded worksheet has: a header row followed by data rows.
 */

export const DEMO_COMPANY = 'Demo Telecom Co. (fictional)'
export const DEMO_SHEET_NAME = 'FY2025 (demo)'
export const DEMO_FILE_NAME = 'demo-financial-performance.xlsx'
export const DEMO_UNIT = 'LAK'

/**
 * Budget figures exist for expense lines only (a typical cost-control budget),
 * so "Actual expenses" is used both as the expense column and as the "actual"
 * column in the budget-vs-actual comparison.
 */
export const DEMO_HEADER = ['Date', 'Category', 'Type', 'Income (LAK)', 'Actual expenses (LAK)', 'Expense budget (LAK)']

const LINES = [
  { category: 'Mobile service revenue', type: 'Income', base: 620e6, growth: 0.012 },
  { category: 'Internet service revenue', type: 'Income', base: 410e6, growth: 0.018 },
  { category: 'Device sales', type: 'Income', base: 150e6, growth: 0.004 },
  { category: 'Salaries & wages', type: 'Expense', base: 380e6, growth: 0.004 },
  { category: 'Network maintenance', type: 'Expense', base: 210e6, growth: 0.006 },
  { category: 'Rent & utilities', type: 'Expense', base: 95e6, growth: 0.002 },
  { category: 'Marketing', type: 'Expense', base: 70e6, growth: 0.01 },
  { category: 'Office & administration', type: 'Expense', base: 35e6, growth: 0.003 },
]

/** Small seeded pseudo-random generator so the demo is identical on every load. */
function seededRandom(seed) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function buildRows() {
  const random = seededRandom(20250101)
  const rows = []
  for (let month = 0; month < 12; month++) {
    const date = `2025-${String(month + 1).padStart(2, '0')}-01`
    // Mild seasonality: stronger mid-year and at year end.
    const season = 1 + 0.07 * Math.sin(((month - 2) / 12) * 2 * Math.PI) + (month === 11 ? 0.05 : 0)
    for (const line of LINES) {
      const plan = line.base * (1 + line.growth * month)
      const budget = Math.round(plan / 1e6) * 1e6
      let factor = season * (0.95 + random() * 0.1)
      if (line.category === 'Marketing' && (month === 3 || month === 10)) factor *= 1.6 // campaign months
      const actual = Math.round((plan * factor) / 1e5) * 1e5
      const isIncome = line.type === 'Income'
      rows.push([date, line.category, line.type, isIncome ? actual : null, isIncome ? null : actual, isIncome ? null : budget])
    }
  }
  return rows
}

export const DEMO_ROWS = buildRows()

/** Column mapping used for the demo (indexes into DEMO_HEADER). */
export const DEMO_MAPPING = {
  date: 0,
  category: 1,
  income: 3,
  expense: 4,
  budget: 5,
  actual: 4,
}
