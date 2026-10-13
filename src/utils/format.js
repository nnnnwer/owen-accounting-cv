const fullFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const oneDecimal = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

const COMPACT_UNITS = {
  en: [
    [1e12, 'T'],
    [1e9, 'B'],
    [1e6, 'M'],
    [1e3, 'K'],
  ],
  lo: [
    [1e12, ' ລ້ານລ້ານ'],
    [1e9, ' ຕື້'],
    [1e6, ' ລ້ານ'],
    [1e3, ' ພັນ'],
  ],
}

/** 1234567.891 → "1,234,567.89" */
export function formatNumber(value) {
  if (value == null || Number.isNaN(value)) return '–'
  return fullFormatter.format(value)
}

/** 1250000 → "1.3M" (en) or "1.3 ລ້ານ" (lo). */
export function formatCompact(value, lang = 'en') {
  if (value == null || Number.isNaN(value)) return '–'
  const abs = Math.abs(value)
  for (const [size, suffix] of COMPACT_UNITS[lang] ?? COMPACT_UNITS.en) {
    if (abs >= size) return `${value < 0 ? '−' : ''}${oneDecimal.format(abs / size)}${suffix}`
  }
  return `${value < 0 ? '−' : ''}${oneDecimal.format(abs)}`
}

/** 0.1234 → "12.3%" */
export function formatPercent(ratio) {
  if (ratio == null || !Number.isFinite(ratio)) return '–'
  return `${oneDecimal.format(ratio * 100)}%`
}

/** Adds the selected currency/unit label, e.g. "1.3M LAK". */
export function withUnit(text, unit) {
  return unit ? `${text} ${unit}` : text
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${oneDecimal.format(bytes / 1024)} KB`
  return `${oneDecimal.format(bytes / 1024 / 1024)} MB`
}
