/**
 * Excel reader — runs in a Web Worker (separate thread), entirely in the browser.
 *
 * SECURITY: spreadsheet contents are treated as untrusted data.
 *  - Formulas are read as TEXT only (to show in the formula bar). They are never evaluated;
 *    the values shown are the results Excel saved in the file.
 *  - VBA macros are never loaded (bookVBA: false) and nothing in the file is executed.
 *  - Rich text / HTML is ignored (cellHTML: false); every value becomes plain text.
 *  - Nothing is sent over the network.
 */
import { read, utils } from 'xlsx'

const { decode_range, encode_cell } = utils

const READ_ROW_LIMIT = 5000 // rows read per sheet (protects memory on huge files)
const VIEW_ROW_LIMIT = 1000 // rows rendered in the grid
const VIEW_COL_LIMIT = 100 // columns rendered in the grid (A … CV)
const MAX_TEXT = 2000

const DEFAULT_COL_PX = 64 // Excel default column width (8.43 characters)
const DEFAULT_ROW_PX = 20 // Excel default row height (15 pt)

let workbook = null

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g
const clean = (text) => String(text).replace(CONTROL_CHARS, '').slice(0, MAX_TEXT)

function hasValidSignature(bytes) {
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04 // .xlsx
  const isCfb = bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0 // .xls
  return isZip || isCfb
}

function fail(code, message = code) {
  return Object.assign(new Error(message), { code })
}

function classifyError(err) {
  const message = String(err?.message || err).toLowerCase()
  if (message.includes('password') || message.includes('encrypt')) return 'password'
  if (message.includes('unsupported')) return 'unsupported'
  return 'corrupt'
}

function parseWorkbook(buffer) {
  const bytes = new Uint8Array(buffer)
  if (bytes.length < 8 || !hasValidSignature(bytes)) throw fail('signature')
  workbook = read(bytes, {
    type: 'array',
    cellFormula: true, // formula text for the formula bar (never evaluated)
    cellText: true, // formatted text exactly as Excel displays it (w)
    cellDates: false,
    cellHTML: false,
    cellNF: false,
    cellStyles: true, // column widths, row heights, hidden rows/columns
    bookVBA: false,
    bookDeps: false,
    bookFiles: false,
    sheetRows: READ_ROW_LIMIT,
  })
  const meta = workbook.Workbook?.Sheets || []
  const sheets = workbook.SheetNames.map((name, i) => ({ name, hidden: Boolean(meta[i]?.Hidden) }))
  if (sheets.length === 0) throw fail('empty')
  return { sheets }
}

function columnWidthPx(col) {
  if (!col) return DEFAULT_COL_PX
  if (col.hidden) return 0
  if (col.wpx) return Math.round(col.wpx)
  if (col.wch) return Math.round(col.wch * 7 + 5)
  if (col.width) return Math.round(col.width * 7)
  return DEFAULT_COL_PX
}

function rowHeightPx(row) {
  if (!row) return DEFAULT_ROW_PX
  if (row.hidden) return 0
  if (row.hpx) return Math.round(row.hpx)
  if (row.hpt) return Math.round((row.hpt * 96) / 72)
  return DEFAULT_ROW_PX
}

/** Everything the grid needs to draw one worksheet, starting at A1 like Excel. */
function readGrid(name) {
  if (!workbook) throw fail('corrupt', 'No workbook loaded')
  const ws = workbook.Sheets[name]
  if (!ws) throw fail('empty', 'Sheet not found')
  if (!ws['!ref']) return { name, rowCount: 0, colCount: 0, cells: [], colWidths: [], rowHeights: [], merges: [], truncatedRows: false, truncatedCols: false, totalRows: 0, totalCols: 0 }

  const range = decode_range(ws['!ref'])
  const full = ws['!fullref'] ? decode_range(ws['!fullref']) : range
  const lastRow = Math.min(range.e.r, VIEW_ROW_LIMIT - 1)
  const lastCol = Math.min(range.e.c, VIEW_COL_LIMIT - 1)

  const cells = []
  for (let r = 0; r <= lastRow; r++) {
    const row = []
    for (let c = 0; c <= lastCol; c++) {
      const cell = ws[encode_cell({ r, c })]
      if (!cell || (cell.t === 'z' && !cell.f)) {
        row.push(null)
        continue
      }
      let text = cell.w
      if (text == null) text = cell.v == null ? '' : typeof cell.v === 'boolean' ? (cell.v ? 'TRUE' : 'FALSE') : String(cell.v)
      const entry = { w: clean(text), t: cell.t }
      if (cell.f) entry.f = clean(cell.f)
      row.push(entry)
    }
    cells.push(row)
  }

  const cols = ws['!cols'] || []
  const rows = ws['!rows'] || []
  const merges = (ws['!merges'] || [])
    .filter((m) => m.s.r <= lastRow && m.s.c <= lastCol)
    .map((m) => ({ s: { r: m.s.r, c: m.s.c }, e: { r: Math.min(m.e.r, lastRow), c: Math.min(m.e.c, lastCol) } }))

  return {
    name,
    rowCount: lastRow + 1,
    colCount: lastCol + 1,
    cells,
    colWidths: Array.from({ length: lastCol + 1 }, (_, c) => columnWidthPx(cols[c])),
    rowHeights: Array.from({ length: lastRow + 1 }, (_, r) => rowHeightPx(rows[r])),
    merges,
    truncatedRows: full.e.r > lastRow,
    truncatedCols: full.e.c > lastCol,
    totalRows: full.e.r + 1,
    totalCols: full.e.c + 1,
  }
}

self.onmessage = (event) => {
  const { id, type, payload } = event.data || {}
  try {
    if (type === 'parse') self.postMessage({ id, ok: true, result: parseWorkbook(payload.buffer) })
    else if (type === 'grid') self.postMessage({ id, ok: true, result: readGrid(payload.name) })
    else self.postMessage({ id, ok: false, error: 'unsupported' })
  } catch (err) {
    self.postMessage({ id, ok: false, error: err?.code || classifyError(err) })
  }
}
