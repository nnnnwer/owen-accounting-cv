import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { portfolioProjects } from '../data/portfolio.js'
import { DEMO_COMPANY, DEMO_MAPPING, DEMO_ROWS } from '../data/demoData.js'
import { computeAnalytics } from '../features/reports/analytics.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { Icon } from '../components/ui/Icon.jsx'
import { Alert, Badge, PageHeader } from '../components/ui/Primitives.jsx'
import { formatCompact, formatPercent } from '../utils/format.js'
import { usePageMeta } from '../utils/usePageMeta.js'

const CATEGORY_ICON = { dashboard: 'chart', report: 'resume', analysis: 'target', spreadsheet: 'sheet' }

function MiniTable({ head, rows, caption }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-xs sm:text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            {head.map((h, i) => (
              <th key={h} scope="col" className={`px-3 py-2 font-semibold whitespace-nowrap ${i ? 'text-right' : 'text-left'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-slate-100">
              {r.map((c, i) => (
                <td key={i} className={`px-3 py-1.5 ${i ? 'text-right whitespace-nowrap tabular-nums' : 'font-medium text-slate-700'}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Live mini-reports computed from the fictional demo dataset. */
function Preview({ kind, analytics }) {
  const { t, lang } = useLanguage()
  const money = (v) => formatCompact(v, lang)

  if (kind === 'incomeStatement') {
    const quarters = [0, 1, 2, 3].map((q) => {
      const months = analytics.monthly.slice(q * 3, q * 3 + 3)
      const income = months.reduce((s, m) => s + m.income, 0)
      const expense = months.reduce((s, m) => s + m.expense, 0)
      return [`Q${q + 1}`, money(income), money(expense), money(income - expense), formatPercent(income ? (income - expense) / income : null)]
    })
    return (
      <MiniTable
        caption={t('pf.incomeStatementCaption')}
        head={[t('pf.quarter'), t('pf.colIncome'), t('pf.colExpense'), t('pf.colProfit'), t('pf.colMargin')]}
        rows={quarters}
      />
    )
  }

  if (kind === 'budgetVariance') {
    const rows = analytics.budgetByCategory.slice(0, 5).map((c) => [
      c.name,
      money(c.budget),
      money(c.actual),
      `${c.variance > 0 ? '+' : ''}${money(c.variance)} (${c.variance > 0 ? '+' : c.variance < 0 ? '−' : ''}${formatPercent(c.budget ? Math.abs(c.variance / c.budget) : null)})`,
    ])
    return (
      <MiniTable
        caption={t('pf.budgetCaption')}
        head={[t('role.category'), t('kpi.budget'), t('role.actual'), t('pf.colVariance')]}
        rows={rows}
      />
    )
  }

  if (kind === 'expenseMix') {
    const total = analytics.totals.expense || 1
    return (
      <ul className="space-y-2.5" aria-label={t('pf.expenseCaption')}>
        {analytics.expenseByCategory.map((c) => {
          const share = c.value / total
          return (
            <li key={c.name} className="text-sm">
              <div className="mb-1 flex justify-between gap-2">
                <span className="truncate text-slate-700">{c.name}</span>
                <span className="font-semibold text-navy-900 tabular-nums">{formatPercent(share)}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-series-2" style={{ width: `${Math.max(2, share * 100)}%` }} />
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
  return null
}

export default function PortfolioPage() {
  const { t, pick } = useLanguage()
  usePageMeta(t('nav.portfolio'), t('pf.metaDescription'))
  const analytics = useMemo(() => computeAnalytics(DEMO_ROWS, DEMO_MAPPING), [])

  return (
    <>
      <PageHeader eyebrow={t('pf.eyebrow')} title={t('nav.portfolio')} description={t('pf.intro')} />

      <Alert tone="warning" title={t('pf.sampleNoticeTitle')}>
        {t('pf.sampleNoticeBody', { company: DEMO_COMPANY })}
      </Alert>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {portfolioProjects.map((p) => (
          <article key={p.id} className="card flex min-w-0 flex-col p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-white">
                <Icon name={CATEGORY_ICON[p.category] ?? 'portfolio'} />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="blue">{t(`pf.cat.${p.category}`)}</Badge>
                  {p.isSample ? <Badge tone="amber">{t('pf.sampleBadge')}</Badge> : <Badge tone="green">{t('pf.liveBadge')}</Badge>}
                </div>
                <h2 className="mt-2 text-lg font-semibold text-navy-900">{pick(p.title)}</h2>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">{pick(p.summary)}</p>

            {p.preview && (
              <div className="mt-4">
                <Preview kind={p.preview} analytics={analytics} />
              </div>
            )}

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
              <ul className="flex flex-wrap gap-1.5">
                {p.skills.map((s) => (
                  <li key={s} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {s}
                  </li>
                ))}
              </ul>
              {p.link &&
                (p.link.startsWith('/') ? (
                  <Link to={p.link} className="btn-secondary min-h-10">
                    {t('pf.open')}
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </Link>
                ) : (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-secondary min-h-10">
                    {t('pf.open')}
                    <Icon name="external" className="h-4 w-4" />
                  </a>
                ))}
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
