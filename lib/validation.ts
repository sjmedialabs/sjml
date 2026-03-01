/**
 * Client-safe validation helpers for admin forms.
 * Use on blur or on submit to show inline errors.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[+]?[\d\s\-().]{10,20}$/
const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i

export function isValidEmail(value: string): boolean {
  if (!value || typeof value !== "string") return true
  const trimmed = value.trim()
  if (trimmed === "") return true
  return EMAIL_REGEX.test(trimmed)
}

export function isValidPhone(value: string): boolean {
  if (!value || typeof value !== "string") return true
  const trimmed = value.trim()
  if (trimmed === "") return true
  const digitsOnly = trimmed.replace(/\D/g, "")
  return digitsOnly.length >= 10 && PHONE_REGEX.test(trimmed)
}

export function isValidUrl(value: string): boolean {
  if (!value || typeof value !== "string") return true
  const trimmed = value.trim()
  if (trimmed === "") return true
  try {
    new URL(trimmed)
    return URL_REGEX.test(trimmed)
  } catch {
    return false
  }
}

export function getEmailError(value: string): string {
  if (!value?.trim()) return ""
  return isValidEmail(value) ? "" : "Enter a valid email address."
}

export function getPhoneError(value: string): string {
  if (!value?.trim()) return ""
  return isValidPhone(value) ? "" : "Enter a valid phone number (at least 10 digits)."
}

export function getUrlError(value: string): string {
  if (!value?.trim()) return ""
  return isValidUrl(value) ? "" : "Enter a valid URL (e.g. https://...)."
}
