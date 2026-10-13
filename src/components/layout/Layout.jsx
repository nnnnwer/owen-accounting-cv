import { Suspense, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { profile } from '../../data/profile.js'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { MobileHeader } from './MobileHeader.jsx'
import { Sidebar } from './Sidebar.jsx'
import { NAV_ITEMS } from './navItems.js'

function PageLoading() {
  const { t } = useLanguage()
  return (
    <div className="grid min-h-[40vh] place-items-center" role="status">
      <div className="flex items-center gap-3 text-slate-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        {t('common.loading')}
      </div>
    </div>
  )
}

export function Layout({ children }) {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const firstRender = useRef(true)

  // On page change: scroll to top and move focus to the new page heading (screen-reader friendly).
  useEffect(() => {
    window.scrollTo(0, 0)
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    mainRef.current?.querySelector('h1')?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-white px-4 py-2 font-semibold text-navy-900 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t('nav.skip')}
      </a>
      <Sidebar />
      <MobileHeader />
      <div className="lg:pl-72">
        <main id="main" ref={mainRef} className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
          <Suspense fallback={<PageLoading />}>{children}</Suspense>
        </main>
        <footer className="no-print border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
            <p>
              © {new Date().getFullYear()} {profile.name}
            </p>
            <nav aria-label={t('nav.footer')}>
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="hover:text-brand-700">
                      {t(item.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  )
}
