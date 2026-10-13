import { useState } from 'react'
import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { ContactList } from '../components/ContactList.jsx'
import { Icon } from '../components/ui/Icon.jsx'
import { EmptyState, PageHeader } from '../components/ui/Primitives.jsx'
import { usePageMeta } from '../utils/usePageMeta.js'

/**
 * No backend: the message form opens the visitor's own email app (mailto:) with the
 * text pre-filled. It only appears when an email address is set in profile.js.
 */
function MailForm({ email }) {
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    const subject = t('contact.mailSubject', { name: name.trim() || '—' })
    const body = `${message.trim()}\n\n— ${name.trim()}`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-navy-900">{t('contact.formTitle')}</h2>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">{t('contact.yourName')}</span>
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} autoComplete="name" required />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">{t('contact.message')}</span>
        <textarea className="field min-h-32" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} required />
      </label>
      <p className="text-xs text-slate-500">{t('contact.formNote')}</p>
      <button type="submit" className="btn-primary">
        <Icon name="mail" className="h-4 w-4" />
        {t('contact.send')}
      </button>
    </form>
  )
}

export default function ContactPage() {
  const { t, pick } = useLanguage()
  usePageMeta(t('nav.contact'), t('contact.metaDescription'))
  const email = profile.contacts.email?.trim()

  return (
    <>
      <PageHeader eyebrow={t('contact.eyebrow')} title={t('nav.contact')} description={t('contact.intro')} />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <ContactList
            variant="cards"
            emptyFallback={
              <EmptyState icon="mail" title={t('contact.emptyTitle')}>
                {t('contact.emptyBody')}
                {import.meta.env.DEV && (
                  <p className="mt-2 font-mono text-xs text-amber-700">DEV: add your details in src/data/profile.js → contacts</p>
                )}
              </EmptyState>
            }
          />
          <div className="card flex items-start gap-4 p-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name="pin" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm text-slate-500">{t('home.location')}</p>
              <p className="font-semibold text-navy-900">{pick(profile.location)}</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          {email ? (
            <MailForm email={email} />
          ) : (
            <div className="card p-5 text-sm text-slate-600 sm:p-6">
              <h2 className="mb-2 text-lg font-semibold text-navy-900">{t('contact.availability')}</h2>
              {t('contact.availabilityBody')}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
