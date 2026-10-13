import { useEffect } from 'react'
import { profile } from '../data/profile.js'

/** Sets the browser-tab title and meta description for each page (SEO + accessibility). */
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · ${profile.name}` : `${profile.name} — Accounting CV & Portfolio`
    if (description) {
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', description)
    }
  }, [title, description])
}
