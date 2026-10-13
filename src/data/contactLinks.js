import { profile } from './profile.js'

/** Allows only http(s) links so a typo in profile.js can never create a javascript: link. */
function safeUrl(url) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : ''
  } catch {
    return ''
  }
}

/**
 * Turns profile.contacts into display-ready links.
 * Empty fields are skipped, so nothing invented ever appears on the site.
 */
export function getContactLinks() {
  const c = profile.contacts
  const links = []
  if (c.email?.trim()) {
    links.push({ key: 'email', icon: 'mail', labelKey: 'contact.email', value: c.email.trim(), href: `mailto:${c.email.trim()}` })
  }
  if (c.phone?.trim()) {
    links.push({ key: 'phone', icon: 'phone', labelKey: 'contact.phone', value: c.phone.trim(), href: `tel:${c.phone.replace(/[^\d+]/g, '')}` })
  }
  if (c.whatsapp?.trim()) {
    const digits = c.whatsapp.replace(/\D/g, '')
    links.push({ key: 'whatsapp', icon: 'message', labelKey: 'contact.whatsapp', value: `+${digits}`, href: `https://wa.me/${digits}`, external: true })
  }
  for (const key of ['linkedin', 'facebook']) {
    const href = c[key]?.trim() ? safeUrl(c[key].trim()) : ''
    if (href) {
      links.push({ key, icon: 'link', labelKey: `contact.${key}`, value: href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), href, external: true })
    }
  }
  return links
}
