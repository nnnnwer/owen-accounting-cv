import { profile } from '../data/profile.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { Icon } from '../components/ui/Icon.jsx'
import { Badge, EmptyState, PageHeader, SectionCard } from '../components/ui/Primitives.jsx'
import { calculateAge } from '../utils/age.js'
import { usePageMeta } from '../utils/usePageMeta.js'

function TimelineItem({ title, subtitle, period, children }) {
  return (
    <li className="relative border-l-2 border-brand-200 pb-6 pl-6 last:pb-0">
      <span className="absolute top-1.5 -left-[7px] h-3 w-3 rounded-full bg-brand-600 ring-4 ring-white" aria-hidden="true" />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-semibold text-navy-900">{title}</h3>
        {period && <span className="text-sm font-medium text-brand-700">{period}</span>}
      </div>
      {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
      {children && <div className="mt-2 text-sm text-slate-700">{children}</div>}
    </li>
  )
}

export default function ResumePage() {
  const { t, pick } = useLanguage()
  usePageMeta(t('nav.resume'), t('resume.metaDescription'))
  const age = calculateAge(profile.dateOfBirth)

  return (
    <>
      <PageHeader
        eyebrow={t('resume.eyebrow')}
        title={t('nav.resume')}
        // description={t('resume.intro')}
        actions={
          <button type="button" className="btn-secondary" onClick={() => window.print()}>
            <Icon name="printer" className="h-4 w-4" />
            {t('resume.print')}
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard icon="target" title={t('section.objective')}>
            <p className="text-slate-700">{pick(profile.careerObjective)}</p>
          </SectionCard>

          <SectionCard icon="cap" title={t('section.education')}>
            <ol>
              {profile.education.map((e) => (
                <TimelineItem key={e.degree.en} title={pick(e.degree)} subtitle={pick(e.school)} period={e.period}>
                  {pick(e.details)}
                </TimelineItem>
              ))}
            </ol>
          </SectionCard>

          <SectionCard icon="portfolio" title={t('section.experience')}>
            {profile.experience.length > 0 ? (
              <ol>
                {profile.experience.map((x, i) => (
                  <TimelineItem key={i} title={pick(x.role)} subtitle={pick(x.organization)} period={x.period}>
                    {x.points?.length > 0 && (
                      <ul className="list-disc space-y-1 pl-5">
                        {x.points.map((p, j) => (
                          <li key={j}>{pick(p)}</li>
                        ))}
                      </ul>
                    )}
                  </TimelineItem>
                ))}
              </ol>
            ) : (
              <EmptyState icon="info" title={t('resume.noExperienceTitle')}>
                {t('resume.noExperienceBody')}
              </EmptyState>
            )}
          </SectionCard>

          <SectionCard icon="sparkle" title={t('section.skills')}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {profile.skills.map((s) => (
                <li key={s.name.en} className="rounded-xl border border-slate-200 p-4">
                  <p className="flex items-center gap-2 font-semibold text-navy-900">
                    <Icon name="check" className="h-4 w-4 text-brand-600" />
                    {pick(s.name)}
                  </p>
                  {s.note && <p className="mt-1 text-sm text-slate-600">{pick(s.note)}</p>}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard icon="user" title={t('resume.personal')}>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">{t('resume.fullName')}</dt>
                <dd className="font-semibold text-navy-900">{profile.name}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{t('home.age')}</dt>
                <dd className="font-semibold text-navy-900">{age != null ? t('home.years', { n: age }) : '–'}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{t('home.location')}</dt>
                <dd className="font-semibold text-navy-900">{pick(profile.location)}</dd>
              </div>
              {profile.languages.length > 0 && (
                <div>
                  <dt className="text-slate-500">{t('resume.languages')}</dt>
                  <dd className="font-semibold text-navy-900">{profile.languages.map(pick).join(', ')}</dd>
                </div>
              )}
            </dl>
          </SectionCard>

          <SectionCard icon="award" title={t('section.certificates')}>
            {profile.certificates.length > 0 ? (
              <ul className="space-y-3">
                {profile.certificates.map((c, i) => (
                  <li key={i} className="text-sm">
                    <p className="font-semibold text-navy-900">{pick(c.name)}</p>
                    <p className="text-slate-600">
                      {[c.issuer, c.year].filter(Boolean).join(' · ')}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon="award" title={t('resume.noCertTitle')}>
                {t('resume.noCertBody')}
              </EmptyState>
            )}
          </SectionCard>

          <SectionCard icon="book" title={t('resume.learningTitle')}>
            <p className="mb-3">
              <Badge tone="slate">{t('resume.goalBadge')}</Badge>
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              {profile.learningGoals.map((g) => (
                <li key={g.en} className="flex gap-2">
                  <Icon name="arrowRight" className="mt-1 h-4 w-4 shrink-0 text-brand-600" />
                  {pick(g)}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </>
  )
}
