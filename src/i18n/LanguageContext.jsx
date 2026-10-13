import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations.js'

export const LANGUAGES = [
  { code: 'lo', label: 'ລາວ', htmlLang: 'lo' },
  { code: 'en', label: 'EN', htmlLang: 'en' },
]
const DEFAULT_LANG = 'lo'
const STORAGE_KEY = 'owen-cv-lang'

const LanguageContext = createContext(null)

function readStoredLang() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return LANGUAGES.some((l) => l.code === value) ? value : DEFAULT_LANG
  } catch {
    return DEFAULT_LANG
  }
}

/** Replace {name} placeholders in a translated string. */
function interpolate(text, vars) {
  if (!vars) return text
  return text.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match))
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((code) => {
    setLangState(code)
    try {
      window.localStorage.setItem(STORAGE_KEY, code)
    } catch {
      /* private mode: language just won't be remembered */
    }
  }, [])

  const value = useMemo(() => {
    const dict = translations[lang]
    const fallback = translations.en
    /** t('nav.home') → UI string in the current language (falls back to English). */
    const t = (key, vars) => interpolate(dict[key] ?? fallback[key] ?? key, vars)
    /** pick({ en, lo }) → the value for the current language. Plain strings pass through. */
    const pick = (field) => {
      if (field == null) return ''
      if (typeof field === 'string') return field
      return field[lang] ?? field.en ?? ''
    }
    return { lang, setLang, t, pick }
  }, [lang, setLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
