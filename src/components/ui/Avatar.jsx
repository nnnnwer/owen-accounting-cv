import { useState } from 'react'
import { profile } from '../../data/profile.js'

const SIZES = {
  sm: 'h-12 w-12 text-base',
  md: 'h-20 w-20 text-2xl',
  lg: 'h-32 w-32 text-4xl sm:h-40 sm:w-40 sm:text-5xl',
}

/** Profile photo with an initials fallback (used when no photo is set or it fails to load). */
export function Avatar({ size = 'md', className = '' }) {
  const [failed, setFailed] = useState(false)
  const showPhoto = profile.photo && !failed
  const base = `${SIZES[size]} shrink-0 overflow-hidden rounded-full ring-4 ring-white/15 ${className}`

  if (showPhoto) {
    return (
      <img
        src={profile.photo}
        alt={profile.name}
        width="320"
        height="320"
        loading={size === 'lg' ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className={`${base} object-cover`}
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={profile.name}
      className={`${base} grid place-items-center bg-gradient-to-br from-brand-500 to-navy-700 font-bold tracking-wide text-white`}
    >
      {profile.initials}
    </div>
  )
}
