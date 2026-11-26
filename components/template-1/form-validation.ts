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
