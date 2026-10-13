import { getContactLinks } from '../data/contactLinks.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { Icon } from './ui/Icon.jsx'

/**
 * variant="cards"   → large tappable cards (Contact page)
 * variant="buttons" → compact pill buttons (Home page hero)
 * variant="sidebar" → icon rows on the navy sidebar
 */
export function ContactList({ variant = 'cards', emptyFallback = null }) {
  const { t } = useLanguage()
  const links = getContactLinks()
  if (links.length === 0) return emptyFallback

  if (variant === 'buttons') {
    return (
      <ul className="flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.key}>
            <a
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="btn-secondary"
            >
              <Icon name={l.icon} className="h-4 w-4" />
              {t(l.labelKey)}
            </a>
          </li>
        ))}
      </ul>
    )
  }

  if (variant === 'sidebar') {
    return (
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.key}>
            <a
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex min-h-10 items-center gap-2.5 rounded-lg px-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <Icon name={l.icon} className="h-4 w-4 shrink-0 text-brand-200" />
              <span className="truncate">{l.value}</span>
            </a>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {links.map((l) => (
        <li key={l.key}>
          <a
            href={l.href}
            {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="card group flex items-center gap-4 p-5 transition hover:border-brand-500"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white">
              <Icon name={l.icon} className="h-6 w-6" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm text-slate-500">{t(l.labelKey)}</span>
              <span className="block truncate font-semibold text-navy-900">{l.value}</span>
            </span>
            {l.external && <Icon name="external" className="ml-auto h-4 w-4 shrink-0 text-slate-400" />}
          </a>
        </li>
      ))}
    </ul>
  )
}
