const NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?: +\p{L}[\p{L}\p{M}]*)*$/u
const INDIAN_MOBILE_PATTERN = /^[6-9]\d{9}$/
const MAX_ENQUIRY_WORDS = 500

export function sanitizeEnquiryName(value: string): string {
  return value.replace(/[^\p{L}\p{M} ]/gu, "")
}

export function sanitizeIndianMobile(value: string): string {
  const trimmed = value.trim()
  const withoutCountryCode = trimmed.startsWith("+91")
    ? trimmed.slice(3)
    : trimmed.startsWith("0091")
      ? trimmed.slice(4)
      : value
  const digits = withoutCountryCode.replace(/\D/g, "").slice(0, 10)
  return digits && !/^[6-9]/.test(digits) ? "" : digits
}

export function isValidEnquiryName(value: string): boolean {
  return NAME_PATTERN.test(value.trim())
}

export function isValidIndianMobile(value: string): boolean {
  return INDIAN_MOBILE_PATTERN.test(value)
}

export function countWords(value: string): number {
  return value.match(/\S+/g)?.length ?? 0
}

export function limitEnquiryWords(value: string): string {
  const words = [...value.matchAll(/\S+/g)]
  if (words.length <= MAX_ENQUIRY_WORDS) return value

  const lastAllowedWord = words[MAX_ENQUIRY_WORDS - 1]
  return value.slice(0, (lastAllowedWord.index ?? 0) + lastAllowedWord[0].length)
}

export function hasValidEnquiryWordCount(value: string): boolean {
  return countWords(value) <= MAX_ENQUIRY_WORDS
}

export { MAX_ENQUIRY_WORDS }
