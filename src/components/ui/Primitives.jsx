import { Icon } from './Icon.jsx'

/** Page title block used at the top of every page. */
export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 tabIndex={-1} className="text-2xl font-bold text-navy-900 focus:outline-none sm:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-2 text-slate-600">{description}</p>}
      </div>
      {actions && <div className="no-print flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

export function SectionCard({ icon, title, children, className = '', aside }) {
  return (
    <section className={`card p-5 sm:p-6 ${className}`} aria-label={typeof title === 'string' ? title : undefined}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 text-lg font-semibold text-navy-900">
          {icon && (
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
              <Icon name={icon} />
            </span>
          )}
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

const BADGE_TONES = {
  blue: 'bg-brand-50 text-brand-700 ring-brand-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  green: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
}

export function Badge({ tone = 'blue', children, icon }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${BADGE_TONES[tone]}`}
    >
      {icon && <Icon name={icon} className="h-3.5 w-3.5" />}
      {children}
    </span>
  )
}

/** Friendly placeholder for sections that have no data yet (e.g. no certificates). */
export function EmptyState({ icon = 'info', title, children }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-5 text-sm text-slate-600">
      <p className="flex items-center gap-2 font-semibold text-slate-700">
        <Icon name={icon} className="h-4 w-4 text-brand-600" />
        {title}
      </p>
      {children && <div className="mt-1.5">{children}</div>}
    </div>
  )
}

const ALERT_TONES = {
  info: { box: 'border-brand-200 bg-brand-50 text-navy-800', icon: 'info', iconColor: 'text-brand-600' },
  success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-900', icon: 'check', iconColor: 'text-emerald-700' },
  warning: { box: 'border-amber-200 bg-amber-50 text-amber-900', icon: 'alert', iconColor: 'text-amber-700' },
  error: { box: 'border-red-200 bg-red-50 text-red-900', icon: 'alert', iconColor: 'text-red-700' },
}

export function Alert({ tone = 'info', title, children, onClose, closeLabel = 'Close' }) {
  const style = ALERT_TONES[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex gap-3 rounded-xl border p-4 text-sm ${style.box}`}
    >
      <Icon name={style.icon} className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconColor}`} />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? 'mt-1' : ''}>{children}</div>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="-m-1 h-8 w-8 shrink-0 rounded-lg p-1.5 hover:bg-black/5" aria-label={closeLabel}>
          <Icon name="close" className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
