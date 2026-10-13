import { NavLink } from 'react-router-dom'
import { profile } from '../../data/profile.js'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { Avatar } from '../ui/Avatar.jsx'
import { Icon } from '../ui/Icon.jsx'
import { ContactList } from '../ContactList.jsx'
import { LanguageSwitcher } from './LanguageSwitcher.jsx'
import { NAV_ITEMS } from './navItems.js'

export function NavList({ onNavigate }) {
  const { t } = useLanguage()
  return (
    <ul className="space-y-1">
      {NAV_ITEMS.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon name={item.icon} className="h-5 w-5 shrink-0" />
            {t(item.labelKey)}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

/** Dark navy sidebar: profile summary, navigation, language switcher, quick contacts. */
export function SidebarContent({ onNavigate }) {
  const { t, pick } = useLanguage()
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-5 py-6">
      <div className="flex flex-col items-center text-center">
        <Avatar size="md" />
        <p className="mt-3 text-lg font-bold text-white">{profile.name}</p>
        <p className="mt-1 text-sm leading-snug text-brand-200">{pick(profile.headline)}</p>
      </div>

      <nav aria-label={t('nav.main')}>
        <NavList onNavigate={onNavigate} />
      </nav>

      <div className="mt-auto space-y-4 border-t border-white/10 pt-5">
        <ContactList variant="sidebar" />
        <p className="flex items-start gap-2.5 px-2 text-sm text-slate-400">
          <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" />
          <span>{pick(profile.location)}</span>
        </p>
        <LanguageSwitcher className="px-2" />
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-72 bg-navy-900 lg:block">
      <SidebarContent />
    </aside>
  )
}
