/**
 * Calculates a person's age in whole years from an ISO date (YYYY-MM-DD).
 * Recomputed on every visit, so the website never shows an outdated age.
 */
export function calculateAge(isoDateOfBirth, today = new Date()) {
  const [year, month, day] = isoDateOfBirth.split('-').map(Number)
  if (!year || !month || !day) return null
  let age = today.getFullYear() - year
  const hasHadBirthdayThisYear =
    today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day)
  if (!hasHadBirthdayThisYear) age -= 1
  return age
}
