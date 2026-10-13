import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { profile } from '../../data/profile.js'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { Icon } from '../ui/Icon.jsx'
import { SidebarContent } from './Sidebar.jsx'

/** Top bar + slide-in navigation drawer for phones and tablets (< 1024px). */
export function MobileHeader() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const menuButtonRef = useRef(null)
  const closeButtonRef = useRef(null)

  // Close the drawer whenever the page changes.
  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    if (!open) return
    closeButtonRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => {
    setOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <>
      <header className="no-print sticky top-0 z-30 flex h-16 items-center justify-between bg-navy-900 px-4 text-white shadow-md lg:hidden">
        <Link to="/" className="flex min-h-11 items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-sm">{profile.initials}</span>
          {profile.name}
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          aria-label={t('nav.openMenu')}
          className="grid h-11 w-11 place-items-center rounded-xl hover:bg-white/10"
        >
          <Icon name="menu" className="h-6 w-6" />
        </button>
      </header>

      {open && (
        <div className="no-print fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy-950/60"
            aria-label={t('nav.closeMenu')}
            tabIndex={-1}
            onClick={close}
          />
          <div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.main')}
            className="absolute inset-y-0 right-0 w-[min(20rem,88vw)] bg-navy-900 shadow-2xl"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label={t('nav.closeMenu')}
              className="absolute top-3 right-3 z-10 grid h-11 w-11 place-items-center rounded-xl text-white hover:bg-white/10"
            >
              <Icon name="close" className="h-6 w-6" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
