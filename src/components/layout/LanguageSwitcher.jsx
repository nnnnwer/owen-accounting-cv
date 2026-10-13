import { LANGUAGES, useLanguage } from '../../i18n/LanguageContext.jsx'
import { Icon } from '../ui/Icon.jsx'

export function LanguageSwitcher({ className = '' }) {
  const { lang, setLang, t } = useLanguage()
  return (
    <div className={`flex items-center gap-2 ${className}`} role="group" aria-label={t('lang.label')}>
      <Icon name="globe" className="h-4 w-4 text-brand-200" />
      <div className="flex rounded-lg bg-white/10 p-0.5">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            lang={l.htmlLang}
            aria-pressed={lang === l.code}
            onClick={() => setLang(l.code)}
            className={`min-h-9 min-w-12 rounded-md px-3 text-sm font-semibold transition-colors ${
              lang === l.code ? 'bg-white text-navy-900' : 'text-slate-300 hover:text-white'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  )
}
