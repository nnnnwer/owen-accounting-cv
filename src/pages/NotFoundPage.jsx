import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { Icon } from '../components/ui/Icon.jsx'
import { usePageMeta } from '../utils/usePageMeta.js'

export default function NotFoundPage() {
  const { t } = useLanguage()
  usePageMeta(t('notFound.title'))
  return (
    <div className="card mx-auto max-w-lg p-8 text-center">
      <p className="text-5xl font-bold text-brand-600">404</p>
      <h1 tabIndex={-1} className="mt-3 text-xl font-semibold text-navy-900 focus:outline-none">
        {t('notFound.title')}
      </h1>
      <p className="mt-2 text-slate-600">{t('notFound.body')}</p>
      <Link to="/" className="btn-primary mt-6">
        <Icon name="home" className="h-4 w-4" />
        {t('notFound.home')}
      </Link>
    </div>
  )
}
