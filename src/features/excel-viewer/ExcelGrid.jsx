import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { Icon } from '../../components/ui/Icon.jsx'

/** Visual constants matching Microsoft Excel's default look. */
const EXCEL_GREEN = '#217346'
const GRID_LINE = '#e1e1e1'
const HEADER_BG = '#f3f3f3'
const HEADER_ACTIVE_BG = '#d2d2d2'
const DEFAULT_COL_PX = 64
const DEFAULT_ROW_PX = 20
const ROW_HEADER_PX = 44
const MIN_ROWS = 30 // a small sheet still looks like a full Excel window
const MIN_COLS = 15
const ROW_PAGE = 200 // rows added to the page at a time (keeps phones fast)
const ZOOMS = [0.75, 0.9, 1, 1.1, 1.25, 1.5]
const BASE_FONT_PX = 13

/** 0 → A, 25 → Z, 26 → AA */
export function columnLetter(index) {
  let n = index + 1
  let s = ''
  while (n > 0) {
    const r = (n - 1) % 26
    s = String.fromCharCode(65 + r) + s
    n = Math.floor((n - 1) / 26)
  }
  return s
}

const alignFor = (t) => (t === 'n' || t === 'd' ? 'right' : t === 'b' || t === 'e' ? 'center' : 'left')

/**
 * Read-only spreadsheet view that looks and behaves like Excel: formula bar,
 * column letters, row numbers, gridlines, merged cells, column widths,
 * text overflowing into empty neighbours, sheet tabs and zoom.
 */
export function ExcelGrid({ grid, sheets, activeSheet, onSelectSheet, busy }) {
  const { t } = useLanguage()
  const [selected, setSelected] = useState({ r: 0, c: 0 })
  const [zoom, setZoom] = useState(1)
  const [rowLimit, setRowLimit] = useState(ROW_PAGE)
  const scrollRef = useRef(null)

  // Reset selection and scroll when another sheet/file is shown.
  useEffect(() => {
    setSelected({ r: 0, c: 0 })
    setRowLimit(ROW_PAGE)
    scrollRef.current?.scrollTo(0, 0)
  }, [grid])

  const layout = useMemo(() => {
    const rowCount = Math.max(grid?.rowCount ?? 0, MIN_ROWS)
    const colCount = Math.max(grid?.colCount ?? 0, MIN_COLS)
    const colWidths = Array.from({ length: colCount }, (_, c) => grid?.colWidths?.[c] ?? DEFAULT_COL_PX)
    const rowHeights = Array.from({ length: rowCount }, (_, r) => grid?.rowHeights?.[r] ?? DEFAULT_ROW_PX)
    const visibleCols = colWidths.map((w, c) => (w > 0 ? c : -1)).filter((c) => c >= 0)
    const visibleRows = rowHeights.map((h, r) => (h > 0 ? r : -1)).filter((r) => r >= 0)

    // Merged cells: the top-left cell spans the others, which are not drawn.
    const anchors = new Map()
    const coveredBy = new Map()
    for (const m of grid?.merges ?? []) {
      if (colWidths[m.s.c] === 0 || rowHeights[m.s.r] === 0) continue
      let rowSpan = 0
      let colSpan = 0
      let width = 0
      for (let r = m.s.r; r <= m.e.r; r++) if (rowHeights[r] > 0) rowSpan++
      for (let c = m.s.c; c <= m.e.c; c++) if (colWidths[c] > 0) {
        colSpan++
        width += colWidths[c]
      }
      anchors.set(`${m.s.r},${m.s.c}`, { rowSpan, colSpan, width })
      for (let r = m.s.r; r <= m.e.r; r++)
        for (let c = m.s.c; c <= m.e.c; c++) if (r !== m.s.r || c !== m.s.c) coveredBy.set(`${r},${c}`, { r: m.s.r, c: m.s.c })
    }
    return { rowCount, colCount, colWidths, rowHeights, visibleCols, visibleRows, anchors, coveredBy }
  }, [grid])

  const cellAt = (r, c) => grid?.cells?.[r]?.[c] ?? null
  const isEmpty = (r, c) => {
    const cell = cellAt(r, c)
    return !cell || cell.w === ''
  }

  /** Width a left-aligned text cell may spill into, like Excel (stops at the next non-empty cell). */
  const spillWidth = (r, c) => {
    let width = layout.colWidths[c]
    for (let next = c + 1; next < layout.colCount && next < c + 30; next++) {
      if (!isEmpty(r, next) || layout.coveredBy.has(`${r},${next}`) || layout.anchors.has(`${r},${next}`)) break
      width += layout.colWidths[next]
    }
    return width
  }

  const select = (r, c) => {
    const anchor = layout.coveredBy.get(`${r},${c}`)
    setSelected(anchor ?? { r, c })
  }

  const onKeyDown = (e) => {
    const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }
    const move = moves[e.key]
    if (!move) return
    e.preventDefault()
    const { visibleRows, visibleCols } = layout
    let ri = visibleRows.indexOf(selected.r)
    let ci = visibleCols.indexOf(selected.c)
    const span = layout.anchors.get(`${selected.r},${selected.c}`)
    if (move[0] > 0 && span) ri += span.rowSpan - 1
    if (move[1] > 0 && span) ci += span.colSpan - 1
    ri = Math.max(0, Math.min(visibleRows.length - 1, ri + move[0]))
    ci = Math.max(0, Math.min(visibleCols.length - 1, ci + move[1]))
    if (visibleRows[ri] >= rowLimit) setRowLimit((n) => n + ROW_PAGE)
    const target = layout.coveredBy.get(`${visibleRows[ri]},${visibleCols[ci]}`) ?? { r: visibleRows[ri], c: visibleCols[ci] }
    setSelected(target)
    requestAnimationFrame(() =>
      scrollRef.current?.querySelector(`[data-cell="${target.r}-${target.c}"]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' }),
    )
  }

  const selectedCell = cellAt(selected.r, selected.c)
  const address = `${columnLetter(selected.c)}${selected.r + 1}`
  const formulaText = selectedCell ? (selectedCell.f ? `=${selectedCell.f}` : selectedCell.w) : ''
  const selectedSpan = layout.anchors.get(`${selected.r},${selected.c}`)
  const inSelectedCols = (c) => c >= selected.c && c < selected.c + (selectedSpan?.colSpan ?? 1)
  const inSelectedRows = (r) => r >= selected.r && r < selected.r + (selectedSpan?.rowSpan ?? 1)

  const shownRows = layout.visibleRows.filter((r) => r < rowLimit)
  const moreRows = layout.visibleRows.length - shownRows.length
  const px = (n) => Math.round(n * zoom)
  const tableWidth = ROW_HEADER_PX + layout.visibleCols.reduce((s, c) => s + px(layout.colWidths[c]), 0)

  return (
    <div className="excel-frame overflow-hidden rounded-xl border border-[#c8c8c8] bg-white shadow-card" style={{ fontFamily: 'Aptos, Calibri, "Segoe UI", "Noto Sans Lao", Arial, sans-serif' }}>
      {/* Formula bar */}
      <div className="flex items-stretch border-b border-[#d4d4d4] bg-white text-[13px]">
        <div className="flex w-20 shrink-0 items-center border-r border-[#d4d4d4] px-2 font-medium text-slate-700 sm:w-24" aria-label={t('xl.nameBox')}>
          {address}
        </div>
        <div className="flex shrink-0 items-center border-r border-[#d4d4d4] px-2 text-slate-400 italic select-none" aria-hidden="true">
          fx
        </div>
        <output className="block min-h-8 min-w-0 flex-1 truncate px-2 py-1.5 text-slate-800" aria-label={t('xl.formulaBar')} title={formulaText}>
          {formulaText}
        </output>
      </div>

      {/* Grid */}
      <div
        ref={scrollRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="region"
        aria-label={t('xl.gridLabel', { sheet: activeSheet ?? '' })}
        className={`relative max-h-[70vh] min-h-[320px] overflow-auto focus:outline-none ${busy ? 'opacity-50' : ''}`}
        style={{ fontSize: px(BASE_FONT_PX) }}
      >
        <table className="border-separate border-spacing-0" style={{ tableLayout: 'fixed', width: tableWidth }}>
          <colgroup>
            <col style={{ width: ROW_HEADER_PX }} />
            {layout.visibleCols.map((c) => (
              <col key={c} style={{ width: px(layout.colWidths[c]) }} />
            ))}
          </colgroup>
          <thead>
            <tr style={{ height: px(DEFAULT_ROW_PX) }}>
              <th
                className="sticky top-0 left-0 z-30 border-r border-b"
                style={{ background: HEADER_BG, borderColor: '#c8c8c8' }}
                aria-label={t('xl.corner')}
              />
              {layout.visibleCols.map((c) => {
                const active = inSelectedCols(c)
                return (
                  <th
                    key={c}
                    scope="col"
                    className="sticky top-0 z-20 border-r border-b text-center font-normal"
                    style={{
                      background: active ? HEADER_ACTIVE_BG : HEADER_BG,
                      color: active ? EXCEL_GREEN : '#444',
                      fontWeight: active ? 600 : 400,
                      borderColor: '#d4d4d4',
                      borderBottomColor: active ? EXCEL_GREEN : '#c8c8c8',
                      borderBottomWidth: active ? 2 : 1,
                    }}
                  >
                    {columnLetter(c)}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {shownRows.map((r) => {
              const rowActive = inSelectedRows(r)
              return (
                <tr key={r} style={{ height: px(layout.rowHeights[r]) }}>
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-r border-b px-1 text-center font-normal"
                    style={{
                      background: rowActive ? HEADER_ACTIVE_BG : HEADER_BG,
                      color: rowActive ? EXCEL_GREEN : '#444',
                      fontWeight: rowActive ? 600 : 400,
                      borderColor: '#d4d4d4',
                      borderRightColor: rowActive ? EXCEL_GREEN : '#c8c8c8',
                      borderRightWidth: rowActive ? 2 : 1,
                    }}
                  >
                    {r + 1}
                  </th>
                  {layout.visibleCols.map((c) => {
                    const key = `${r},${c}`
                    if (layout.coveredBy.has(key)) return null
                    const cell = cellAt(r, c)
                    const span = layout.anchors.get(key)
                    const isSelected = selected.r === r && selected.c === c
                    const align = alignFor(cell?.t)
                    const canSpill = !span && cell && align === 'left' && cell.w
                    const width = span ? span.width : canSpill ? spillWidth(r, c) : layout.colWidths[c]
                    return (
                      <td
                        key={c}
                        data-cell={`${r}-${c}`}
                        rowSpan={span?.rowSpan}
                        colSpan={span?.colSpan}
                        onMouseDown={() => select(r, c)}
                        className="relative border-r border-b p-0 align-bottom"
                        style={{
                          borderColor: GRID_LINE,
                          boxShadow: isSelected ? `inset 0 0 0 2px ${EXCEL_GREEN}` : undefined,
                          overflow: canSpill ? 'visible' : 'hidden',
                          zIndex: isSelected ? 1 : undefined,
                        }}
                      >
                        {cell?.w ? (
                          <div
                            className="overflow-hidden px-1 whitespace-pre text-slate-900"
                            style={{ width: px(width) - 1, textAlign: align, lineHeight: `${Math.max(px(layout.rowHeights[r]) - 2, 12)}px` }}
                          >
                            {cell.w}
                          </div>
                        ) : null}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        {moreRows > 0 && (
          <div className="sticky left-0 p-3">
            <button type="button" className="btn-secondary min-h-9 py-1 text-xs" onClick={() => setRowLimit((n) => n + ROW_PAGE)}>
              {t('xl.moreRows', { n: Math.min(moreRows, ROW_PAGE) })}
            </button>
          </div>
        )}
      </div>

      {/* Sheet tabs */}
      <div className="flex items-stretch border-t border-[#c8c8c8] bg-[#f3f3f3]">
        <nav className="flex min-w-0 flex-1 overflow-x-auto" aria-label={t('xl.sheets')}>
          {sheets.map((s) => {
            const active = s.name === activeSheet
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => !active && onSelectSheet(s.name)}
                aria-current={active ? 'page' : undefined}
                className="shrink-0 border-r border-[#d4d4d4] px-4 py-2 text-[13px] whitespace-nowrap"
                style={
                  active
                    ? { background: '#fff', color: EXCEL_GREEN, fontWeight: 600, boxShadow: `inset 0 -3px 0 ${EXCEL_GREEN}` }
                    : { color: '#444' }
                }
              >
                {s.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between gap-3 px-3 py-1 text-xs text-white" style={{ background: EXCEL_GREEN }}>
        <span>{busy ? t('xl.loading') : t('xl.ready')}</span>
        <div className="flex items-center gap-1" role="group" aria-label={t('xl.zoom')}>
          <button
            type="button"
            className="grid h-7 w-7 place-items-center rounded hover:bg-white/15 disabled:opacity-40"
            onClick={() => setZoom(ZOOMS[Math.max(0, ZOOMS.indexOf(zoom) - 1)])}
            disabled={zoom === ZOOMS[0]}
            aria-label={t('xl.zoomOut')}
          >
            −
          </button>
          <span className="w-11 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="grid h-7 w-7 place-items-center rounded hover:bg-white/15 disabled:opacity-40"
            onClick={() => setZoom(ZOOMS[Math.min(ZOOMS.length - 1, ZOOMS.indexOf(zoom) + 1)])}
            disabled={zoom === ZOOMS[ZOOMS.length - 1]}
            aria-label={t('xl.zoomIn')}
          >
            +
          </button>
        </div>
      </div>

      {(grid?.truncatedRows || grid?.truncatedCols) && (
        <p className="flex items-center gap-2 border-t border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <Icon name="info" className="h-4 w-4" />
          {t('xl.truncated', { rows: Math.min(grid.totalRows, 1000), cols: columnLetter(Math.min(grid.totalCols, 100) - 1) })}
        </p>
      )}
    </div>
  )
}
