import { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { Icon } from '../components/ui/Icon.jsx'
import { Alert, Badge, PageHeader } from '../components/ui/Primitives.jsx'
import { usePageMeta } from '../utils/usePageMeta.js'
import { excelShowcase } from '../data/excelShowcase.js'
import { useExcelViewer } from '../features/excel-viewer/useExcelViewer.js'
import { ExcelGrid } from '../features/excel-viewer/ExcelGrid.jsx'

/**
 * Excel work page: shows only your own Excel files (put them in public/excel/ and
 * list them in src/data/excelShowcase.js) in a Microsoft-Excel-style viewer.
 * Visitors can view (and optionally download) them, but cannot upload anything.
 */
export default function DashboardPage() {
  const { t, pick } = useLanguage()
  usePageMeta(t('nav.dashboard'), t('xl.metaDescription'))
  const viewer = useExcelViewer()
  const { source, busy, error } = viewer

  // Open the first showcase file automatically.
  useEffect(() => {
    if (excelShowcase.length > 0) viewer.openShowcase(excelShowcase[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeItem = source?.kind === 'showcase' ? source.item : null

  return (
    <>
      <PageHeader eyebrow={t('xl.eyebrow')} title={t('nav.dashboard')} description={t('xl.intro')} />

      <div className="space-y-4">
        {/* Choose which of my files to show (only when there is more than one) */}
        {excelShowcase.length > 1 && (
          <nav aria-label={t('xl.myFiles')} className="flex gap-2 overflow-x-auto pb-1">
            {excelShowcase.map((item) => {
              const active = activeItem?.id === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => viewer.openShowcase(item)}
                  aria-current={active ? 'true' : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${
                    active ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-300 bg-white text-slate-700 hover:border-brand-500'
                  }`}
                >
                  <Icon name="sheet" className="h-4 w-4" />
                  {pick(item.title)}
                </button>
              )
            })}
          </nav>
        )}

        {/* About the file being shown + actions */}
        <section className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5" aria-live="polite">
          <div className="min-w-0">
            {activeItem && (
              <>
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-navy-900">{pick(activeItem.title)}</span>
                  {activeItem.isSample ? <Badge tone="amber">{t('pf.sampleBadge')}</Badge> : <Badge tone="green">{t('xl.myWork')}</Badge>}
                </p>
                {activeItem.description && <p className="mt-1 text-sm text-slate-600">{pick(activeItem.description)}</p>}
              </>
            )}
            {!source && !busy && <p className="text-sm text-slate-600">{t('xl.nothingYet')}</p>}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {activeItem?.allowDownload && (
              <a href={activeItem.file} download className="btn-secondary">
                <Icon name="download" className="h-4 w-4" />
                {t('xl.download')}
              </a>
            )}
          </div>
        </section>

        {error && (
          <Alert tone="error" title={t('err.title')} onClose={viewer.dismissError} closeLabel={t('common.close')}>
            {t(`err.${error}`)}
          </Alert>
        )}

        {/* Excel window */}
        <div className="relative rounded-xl">
          <ExcelGrid
            grid={viewer.grid}
            sheets={viewer.sheets}
            activeSheet={viewer.activeSheet}
            onSelectSheet={viewer.selectSheet}
            busy={busy}
          />
          {busy && (
            <div role="status" className="absolute inset-0 grid place-items-center rounded-xl bg-white/40">
              <span className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-card">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
                {t('xl.loading')}
              </span>
            </div>
          )}
        </div>

        <p className="flex items-start gap-2 text-sm text-slate-500">
          <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          {t('xl.privacy')}
        </p>
      </div>
    </>
  )
}
