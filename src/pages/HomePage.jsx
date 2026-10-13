import { Link } from 'react-router-dom'
import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { Avatar } from '../components/ui/Avatar.jsx'
import { Icon } from '../components/ui/Icon.jsx'
import { ContactList } from '../components/ContactList.jsx'
import { calculateAge } from '../utils/age.js'
import { usePageMeta } from '../utils/usePageMeta.js'

function QuickFact({ icon, label, value }) {
  return (
    <div className="card flex items-start gap-3 p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
        <Icon name={icon} />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="font-semibold text-navy-900">{value}</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { t, pick } = useLanguage()
  usePageMeta(null, pick(profile.summary))
  const age = calculateAge(profile.dateOfBirth)
  const education = profile.education[0]

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="card overflow-hidden">
        <div className="bg-gradient-to-r from-navy-900 to-navy-700 px-6 pt-8 pb-20 sm:px-10">
          <p className="eyebrow text-brand-200">{t('home.eyebrow')}</p>
        </div>
        <div className="-mt-16 flex flex-col gap-6 px-6 pb-8 sm:flex-row sm:items-end sm:px-10">
          <Avatar size="lg" className="ring-white" />
          <div className="min-w-0 sm:pb-2">
            <h1 tabIndex={-1} className="text-3xl font-bold text-navy-900 focus:outline-none sm:text-4xl">
              {profile.name}
            </h1>
            <p className="mt-1 text-lg font-medium text-brand-700">{pick(profile.headline)}</p>
          </div>
        </div>
        <div className="space-y-6 border-t border-slate-100 px-6 py-6 sm:px-10">
          <p className="max-w-3xl text-slate-700">{pick(profile.summary)}</p>
          <div className="flex flex-wrap gap-2">
            <Link to="/resume" className="btn-primary">
              <Icon name="resume" className="h-4 w-4" />
              {t('home.viewResume')}
            </Link>
            <Link to="/dashboard" className="btn-secondary">
              <Icon name="chart" className="h-4 w-4" />
              {t('home.tryDashboard')}
            </Link>
          </div>
          <ContactList variant="buttons" />
        </div>
      </section>

      {/* Quick facts */}
      <section aria-label={t('home.quickFacts')} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <QuickFact icon="calendar" label={t('home.age')} value={age != null ? t('home.years', { n: age }) : '–'} />
        <QuickFact icon="pin" label={t('home.location')} value={pick(profile.location)} />
        {education && <QuickFact icon="cap" label={t('home.education')} value={`${pick(education.school)} · ${education.period}`} />}
        <QuickFact icon="target" label={t('home.focus')} value={t('home.focusValue')} />
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Career objective */}
        <section className="card p-6 lg:col-span-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
            <Icon name="target" className="h-5 w-5 text-brand-600" />
            {t('section.objective')}
          </h2>
          <p className="mt-3 text-slate-700">{pick(profile.careerObjective)}</p>
          <p className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-navy-800">{t('home.transitionNote')}</p>
        </section>

        {/* Key skills */}
        <section className="card p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
            <Icon name="sparkle" className="h-5 w-5 text-brand-600" />
            {t('section.keySkills')}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <li key={s.name.en} className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-navy-800">
                {pick(s.name)}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Dashboard teaser */}
      <section className="card flex flex-col gap-4 bg-gradient-to-r from-white to-brand-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-900 text-white">
            <Icon name="chart" className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-navy-900">{t('home.dashTitle')}</h2>
            <p className="mt-1 text-slate-600">{t('home.dashBody')}</p>
          </div>
        </div>
        <Link to="/dashboard" className="btn-primary shrink-0">
          {t('home.dashCta')}
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}
