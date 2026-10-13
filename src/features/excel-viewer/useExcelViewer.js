import { useCallback, useEffect, useRef, useState } from 'react'
import { parseWorkbook, readGrid, resetExcelWorker } from './excelClient.js'

/**
 * State for the Excel viewer. It only opens the files listed in src/data/excelShowcase.js.
 *
 * source: { kind: 'showcase', item } | null
 */
export function useExcelViewer() {
  const [source, setSource] = useState(null)
  const [sheets, setSheets] = useState([])
  const [activeSheet, setActiveSheet] = useState(null)
  const [grid, setGrid] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const requestRef = useRef(0)

  // Free the worker's memory when the visitor leaves the page.
  useEffect(() => () => resetExcelWorker(), [])

  const openBuffer = useCallback(async (buffer, nextSource, request) => {
    const { sheets: list } = await parseWorkbook(buffer)
    if (request !== requestRef.current) return
    const visible = list.filter((s) => !s.hidden) // Excel hides hidden sheets from the tab bar
    const first = visible[0] ?? list[0]
    const firstGrid = await readGrid(first.name)
    if (request !== requestRef.current) return
    setSource(nextSource)
    setSheets(visible.length ? visible : list)
    setActiveSheet(first.name)
    setGrid(firstGrid)
  }, [])

  const run = useCallback(async (task) => {
    const request = ++requestRef.current
    setBusy(true)
    setError(null)
    try {
      await task(request)
    } catch (err) {
      if (request === requestRef.current && err.code !== 'cancelled') setError(err.code || 'corrupt')
    } finally {
      if (request === requestRef.current) setBusy(false)
    }
  }, [])

  /** Opens a file shipped with the website (public/excel/…). */
  const openShowcase = useCallback(
    (item) =>
      run(async (request) => {
        const res = await fetch(item.file)
        if (!res.ok) throw Object.assign(new Error('notFound'), { code: 'notFound' })
        try {
          await openBuffer(await res.arrayBuffer(), { kind: 'showcase', item }, request)
        } catch (err) {
          // A missing file on Vercel/Netlify returns the website's index.html (status 200),
          // which fails the Excel signature check — report it as "file not found".
          if (err.code === 'signature') err.code = 'notFound'
          throw err
        }
      }),
    [run, openBuffer],
  )

  const selectSheet = useCallback(
    (name) =>
      run(async (request) => {
        const next = await readGrid(name)
        if (request !== requestRef.current) return
        setActiveSheet(name)
        setGrid(next)
      }),
    [run],
  )

  return { source, sheets, activeSheet, grid, busy, error, dismissError: () => setError(null), openShowcase, selectSheet }
}
