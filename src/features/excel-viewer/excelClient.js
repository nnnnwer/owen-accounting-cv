/**
 * Main-thread side of the Excel worker. The worker (and SheetJS inside it) is created
 * only when a file is opened, so it never slows down the other pages.
 */

const TIMEOUT_MS = 120000

let worker = null
let nextId = 1
const pending = new Map()

function rejectAll(code) {
  for (const { reject, timer } of pending.values()) {
    clearTimeout(timer)
    reject(Object.assign(new Error(code), { code }))
  }
  pending.clear()
}

function getWorker() {
  if (worker) return worker
  worker = new Worker(new URL('./excelWorker.js', import.meta.url), { type: 'module' })
  worker.onmessage = (event) => {
    const { id, ok, result, error } = event.data || {}
    const entry = pending.get(id)
    if (!entry) return
    pending.delete(id)
    clearTimeout(entry.timer)
    if (ok) entry.resolve(result)
    else entry.reject(Object.assign(new Error(error), { code: error }))
  }
  worker.onerror = (event) => {
    event.preventDefault?.()
    rejectAll('worker')
    worker?.terminate()
    worker = null
  }
  return worker
}

function call(type, payload, transfer = []) {
  const w = getWorker()
  const id = nextId++
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id)
      reject(Object.assign(new Error('timeout'), { code: 'timeout' }))
      resetExcelWorker()
    }, TIMEOUT_MS)
    pending.set(id, { resolve, reject, timer })
    w.postMessage({ id, type, payload }, transfer)
  })
}

/** Stops the worker and frees the memory used by the open workbook. */
export function resetExcelWorker() {
  rejectAll('cancelled')
  worker?.terminate()
  worker = null
}

/** Parses a workbook from an ArrayBuffer (a file shipped with the website). */
export function parseWorkbook(buffer) {
  return call('parse', { buffer }, [buffer])
}

export function readGrid(sheetName) {
  return call('grid', { name: sheetName })
}
