/**
 * Shared input and string validation utilities.
 */

export function isValidEmail(email: string): boolean {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

export function isDomainAuthorized(email: string, domain?: string): boolean {
  if (!email) return false
  return isValidEmail(email)
}

export function isValidPhone(phone: string): boolean {
  if (!phone) return false
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  return /^\+?\d{10,15}$/.test(cleaned)
}

export function isValidName(name: string): boolean {
  if (!name) return false
  return name.trim().length >= 2
}
