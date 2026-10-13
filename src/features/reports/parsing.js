/**
 * Helpers that turn untrusted spreadsheet cell values into numbers and months.
 * Nothing here evaluates code — values are only read as plain text/numbers.
 */

const LAO_DIGIT_ZERO = 0x0ed0 // ໐
const THAI_DIGIT_ZERO = 0x0e50 // ๐

function normalizeDigits(text) {
  return text.replace(/[໐-໙๐-๙]/g, (ch) => {
    const code = ch.charCodeAt(0)
    const zero = code >= LAO_DIGIT_ZERO ? LAO_DIGIT_ZERO : THAI_DIGIT_ZERO
    return String(code - zero)
  })
}

export function isBlank(value) {
  return value == null || (typeof value === 'string' && value.trim() === '')
}

/**
 * Parses accounting-style numbers:
 *   1234.5 · "1,234,567" · "1.234.567" (Lao style) · "₭ 2,500,000" · "(1,200)" · "-350" · "350-" · "໑໒໓"
 * Returns null when the value is not a number.
 */
export function parseNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'boolean' || value == null) return null
  let s = normalizeDigits(String(value)).trim()
  if (!s || s.length > 40) return null

  let negative = false
  if (/^\(.*\)$/.test(s)) {
    negative = true
    s = s.slice(1, -1)
  }
  s = s.replace(/[\s ]/g, '').replace(/(LAK|USD|THB|KIP|₭|\$|฿|ກີບ|บาท)/gi, '')
  if (s.endsWith('-')) {
    negative = !negative
    s = s.slice(0, -1)
  }
  if (s.startsWith('-') || s.startsWith('−')) {
    negative = !negative
    s = s.slice(1)
  } else if (s.startsWith('+')) {
    s = s.slice(1)
  }
  if (!/^[\d.,]+$/.test(s)) return null

  const dots = (s.match(/\./g) || []).length
  const commas = (s.match(/,/g) || []).length
  if (dots && commas) {
    // Whichever separator comes last is the decimal mark.
    s = s.lastIndexOf(',') > s.lastIndexOf('.') ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '')
  } else if (commas) {
    // "1,234,567" → thousands; "12,5" → decimal comma.
    s = commas > 1 || /,\d{3}$/.test(s) ? s.replace(/,/g, '') : s.replace(',', '.')
  } else if (dots > 1) {
    // "1.234.567" → Lao/European thousands grouping. A single dot stays a decimal point.
    s = s.replace(/\./g, '')
  }
  const n = Number(s)
  if (!Number.isFinite(n)) return null
  return negative ? -n : n
}

const MONTH_NAMES = [
  ['jan', 'january', 'ມັງກອນ', 'มกราคม', 'ม.ค.'],
  ['feb', 'february', 'ກຸມພາ', 'กุมภาพันธ์', 'ก.พ.'],
  ['mar', 'march', 'ມີນາ', 'มีนาคม', 'มี.ค.'],
  ['apr', 'april', 'ເມສາ', 'เมษายน', 'เม.ย.'],
  ['may', 'ພຶດສະພາ', 'พฤษภาคม', 'พ.ค.'],
  ['jun', 'june', 'ມິຖຸນາ', 'มิถุนายน', 'มิ.ย.'],
  ['jul', 'july', 'ກໍລະກົດ', 'กรกฎาคม', 'ก.ค.'],
  ['aug', 'august', 'ສິງຫາ', 'สิงหาคม', 'ส.ค.'],
  ['sep', 'sept', 'september', 'ກັນຍາ', 'กันยายน', 'ก.ย.'],
  ['oct', 'october', 'ຕຸລາ', 'ตุลาคม', 'ต.ค.'],
  ['nov', 'november', 'ພະຈິກ', 'พฤศจิกายน', 'พ.ย.'],
  ['dec', 'december', 'ທັນວາ', 'ธันวาคม', 'ธ.ค.'],
]

function monthFromName(text) {
  const lower = text.toLowerCase()
  for (let i = 0; i < MONTH_NAMES.length; i++) {
    for (const name of MONTH_NAMES[i]) {
      if (/^[a-z]+$/.test(name)) {
        if (new RegExp(`(^|[^a-z])${name}([^a-z]|$)`).test(lower)) return i + 1
      } else if (lower.includes(name)) {
        return i + 1
      }
    }
  }
  return null
}

function normalizeYear(y) {
  if (y < 100) return 2000 + y
  if (y > 2400) return y - 543 // Thai/Lao Buddhist Era → Gregorian
  return y
}

const EXCEL_EPOCH_UTC = Date.UTC(1899, 11, 30)

/**
 * Converts a cell into a calendar month { key: 'YYYY-MM', year, month } or null.
 * Accepts ISO strings (what the parser produces for real Excel dates), Excel serial
 * numbers, "DD/MM/YYYY" (day-first, as used in Laos), and month names.
 */
export function parseMonth(value) {
  if (isBlank(value) || typeof value === 'boolean') return null
  let year = null
  let month = null

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    year = value.getFullYear()
    month = value.getMonth() + 1
  } else if (typeof value === 'number') {
    if (value < 20000 || value > 80000) return null // ≈ 1954 … 2119 as Excel serial days
    const d = new Date(EXCEL_EPOCH_UTC + Math.round(value) * 86400000)
    year = d.getUTCFullYear()
    month = d.getUTCMonth() + 1
  } else {
    const s = normalizeDigits(String(value)).trim()
    let m
    if ((m = s.match(/^(\d{4})[-/.](\d{1,2})(?:[-/.](\d{1,2}))?(?:[T\s].*)?$/))) {
      year = Number(m[1])
      month = Number(m[2])
    } else if ((m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})(?:\s.*)?$/))) {
      let first = Number(m[1])
      let second = Number(m[2])
      // Day-first by default; switch only when the second part cannot be a month.
      month = second > 12 && first <= 12 ? first : second
      year = Number(m[3])
    } else if ((m = s.match(/^(\d{1,2})[-/.](\d{4})$/))) {
      month = Number(m[1])
      year = Number(m[2])
    } else {
      month = monthFromName(s)
      if (!month) return null
      const y = s.match(/(\d{4}|\b\d{2}\b)/)
      year = y ? Number(y[1]) : null
    }
  }

  if (!month || month < 1 || month > 12) return null
  if (year != null) {
    year = normalizeYear(year)
    if (year < 1950 || year > 2150) return null
  }
  const mm = String(month).padStart(2, '0')
  return { key: year != null ? `${year}-${mm}` : `0000-${mm}`, year, month }
}

const labelCache = new Map()

/** 'YYYY-MM' → localized short label, e.g. "Jan 25" / "ມ.ກ. 25". */
export function monthLabel(key, lang = 'en') {
  const cacheKey = `${lang}|${key}`
  if (labelCache.has(cacheKey)) return labelCache.get(cacheKey)
  const [y, m] = key.split('-').map(Number)
  const hasYear = y > 0
  let label
  try {
    const fmt = new Intl.DateTimeFormat(lang === 'lo' ? 'lo-LA' : 'en-US', {
      month: 'short',
      ...(hasYear ? { year: '2-digit' } : {}),
      timeZone: 'UTC',
    })
    label = fmt.format(new Date(Date.UTC(hasYear ? y : 2000, m - 1, 1)))
  } catch {
    label = hasYear ? `${String(m).padStart(2, '0')}/${y}` : String(m).padStart(2, '0')
  }
  labelCache.set(cacheKey, label)
  return label
}

/** Display text for any cell value. */
export function cellToText(value) {
  if (value == null) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value)
}
