import type { Template1LeadFormValues } from "./default-data"

export type Template1LeadFormErrors = Partial<
  Record<keyof Template1LeadFormValues, string>
>

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PHONE_10_DIGIT_REGEX = /^\d{10}$/

/**
 * Strips any non-digit characters and limits phone input to 10 digits.
 */
export function sanitizePhoneInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 10)
}

export function validateLeadFormField(
  field: keyof Template1LeadFormValues,
  value: string
): string | undefined {
  const trimmed = value.trim()

  switch (field) {
    case "fullName": {
      if (!trimmed) return "Full name is required."
      if (trimmed.length < 2) return "Please enter at least 2 characters."
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
      if (!PHONE_10_DIGIT_REGEX.test(trimmed)) {
        return "Please enter a valid 10-digit phone number."
      }
      return undefined
    }
    case "message": {
      // Optional field
      return undefined
    }
    default:
      return undefined
  }
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
