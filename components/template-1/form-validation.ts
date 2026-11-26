import type { Template1LeadFormValues } from "./default-data"
import {
  hasValidEnquiryWordCount,
  isValidEnquiryName,
  isValidIndianMobile,
  limitEnquiryWords,
  sanitizeEnquiryName,
  sanitizeIndianMobile,
} from "@/lib/enquiry-validation"

export type Template1LeadFormErrors = Partial<
  Record<keyof Template1LeadFormValues, string>
>

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
/** Keeps a valid Indian mobile-number prefix, digits, and a maximum of 10 digits. */
export function sanitizePhoneInput(raw: string): string {
  return sanitizeIndianMobile(raw)
}

/**
 * Validates a display phone number requiring a country code (+1 to +999)
 * followed by a 10-digit phone number (empty string is allowed for optional overrides).
 */
export function validatePhoneTextWithCountryCode(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  if (!trimmed.startsWith("+")) {
    return "Include a country code followed by a 10-digit number (e.g. +91 9876543210)."
  }

  const separatorMatch = trimmed.match(/^\+([1-9]\d{0,2})[\s()-]+(.+)$/)
  if (separatorMatch) {
    const localDigits = separatorMatch[2].replace(/\D/g, "")
    if (localDigits.length !== 10) {
      return "Enter a valid country code followed by a 10-digit phone number (e.g. +91 9876543210)."
    }
    return null
  }

  const digitsOnly = trimmed.slice(1).replace(/\D/g, "")
  if (digitsOnly.startsWith("91")) {
    if (digitsOnly.length !== 12) {
      return "Enter a valid country code followed by a 10-digit phone number (e.g. +91 9876543210)."
    }
    return null
  }
  if (!/^[1-9]\d{10,12}$/.test(digitsOnly)) {
    return "Enter a valid country code followed by a 10-digit phone number (e.g. +91 9876543210)."
  }

  return null
}

export function validateLeadFormField(
  field: keyof Template1LeadFormValues,
  value: string
): string | undefined {
  const trimmed = value.trim()

  switch (field) {
    case "fullName": {
      if (!trimmed) return "Full name is required."
      if (!isValidEnquiryName(trimmed)) {
        return "Use letters and spaces only."
      }
      return undefined
    }
    case "businessEmail": {
      if (!trimmed) return "Email address is required."
      if (!EMAIL_REGEX.test(trimmed)) {
        return "Please enter a valid email address (e.g. you@company.com)."
      }
      return undefined
    }
    case "phoneNumber": {
      if (!trimmed) return "Phone number is required."
      if (!isValidIndianMobile(trimmed)) {
        return "Enter a 10-digit mobile number starting with 6, 7, 8, or 9."
      }
      return undefined
    }
    case "message": {
      if (!hasValidEnquiryWordCount(value)) return "Message must be 500 words or fewer."
      return undefined
    }
    default:
      return undefined
  }
}

export function sanitizeLeadFormValue(
  field: keyof Template1LeadFormValues,
  value: string,
): string {
  if (field === "fullName") return sanitizeEnquiryName(value)
  if (field === "phoneNumber") return sanitizePhoneInput(value)
  if (field === "message") return limitEnquiryWords(value)
  return value
}

export function validateLeadForm(
  values: Template1LeadFormValues
): Template1LeadFormErrors {
  const errors: Template1LeadFormErrors = {}

  ;(Object.keys(values) as Array<keyof Template1LeadFormValues>).forEach(
    (key) => {
      const error = validateLeadFormField(key, values[key])
      if (error) {
        errors[key] = error
      }
    }
  )

  return errors
}
