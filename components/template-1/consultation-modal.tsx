"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  type Template1HeroData,
  type Template1LeadFormValues,
  defaultTemplate1HeroData,
} from "./default-data"
import {
  type Template1LeadFormErrors,
  sanitizePhoneInput,
  validateLeadForm,
  validateLeadFormField,
} from "./form-validation"
import { submitTemplate1Lead } from "./submit-lead"

export interface Template1ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  data?: Template1HeroData
  cancelButtonText?: string
  onFormSubmit?: (values: Template1LeadFormValues) => Promise<void> | void
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.5 10.5L10.5 3.5M10.5 3.5H4.5M10.5 3.5V9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseCrossIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Template1ConsultationModal({
  isOpen,
  onClose,
  data,
  cancelButtonText: _cancelButtonText,
  onFormSubmit,
}: Template1ConsultationModalProps) {
  const content = {
    ...defaultTemplate1HeroData,
    ...data,
  }

  const [formValues, setFormValues] = useState<Template1LeadFormValues>({
    fullName: "",
    businessEmail: "",
    phoneNumber: "",
    message: "",
  })
  const [errors, setErrors] = useState<Template1LeadFormErrors>({})
  const [touched, setTouched] = useState<
    Partial<Record<keyof Template1LeadFormValues, boolean>>
  >({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (!isSubmitted) return
    const timer = setTimeout(() => {
      handleClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [isSubmitted])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleClose = () => {
    setIsSubmitted(false)
    setErrors({})
    setTouched({})
    onClose()
  }

  const handleFieldChange = (
    field: keyof Template1LeadFormValues,
    rawValue: string
  ) => {
    const value =
      field === "phoneNumber" ? sanitizePhoneInput(rawValue) : rawValue

    setFormValues((prev) => ({ ...prev, [field]: value }))

    if (touched[field] || errors[field]) {
      const fieldError = validateLeadFormField(field, value)
      setErrors((prev) => ({ ...prev, [field]: fieldError }))
    }
  }

  const handleFieldBlur = (field: keyof Template1LeadFormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const fieldError = validateLeadFormField(field, formValues[field])
    setErrors((prev) => ({ ...prev, [field]: fieldError }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationErrors = validateLeadForm(formValues)
    setErrors(validationErrors)
    setTouched({
      fullName: true,
      businessEmail: true,
      phoneNumber: true,
    })

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    try {
      if (onFormSubmit) {
        await onFormSubmit({
          fullName: formValues.fullName.trim(),
          businessEmail: formValues.businessEmail.trim(),
          phoneNumber: formValues.phoneNumber.trim(),
          message: formValues.message.trim(),
        })
      } else {
        await submitTemplate1Lead(
          {
            fullName: formValues.fullName.trim(),
            businessEmail: formValues.businessEmail.trim(),
            phoneNumber: formValues.phoneNumber.trim(),
            message: formValues.message.trim(),
          },
          "website_popup",
        )
      }
      setIsSubmitted(true)
      setFormValues({
        fullName: "",
        businessEmail: "",
        phoneNumber: "",
        message: "",
      })
      setErrors({})
      setTouched({})
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-4 md:p-6 backdrop-blur-[2px] animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="template1-modal-title"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[440px] sm:max-w-[460px] md:max-w-[480px] max-h-[92vh] overflow-y-auto rounded-[8px] bg-white p-5 sm:p-7 md:p-8 text-[#161617] shadow-[0_20px_50px_rgba(0,0,0,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Cross Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 inline-flex h-8 w-8 items-center justify-center rounded-[4px] text-[#161617]/55 transition-colors hover:bg-black/5 hover:text-[#161617]"
        >
          <CloseCrossIcon />
        </button>

        {/* Header */}
        <p className="pr-8 text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-[#161617]/55 mb-1 sm:mb-1.5">
          {content.formOverline}
        </p>
        <h2
          id="template1-modal-title"
          className="pr-8 text-[19px] sm:text-[21px] md:text-[22px] font-semibold tracking-[-0.01em] text-[#161617] mb-5 sm:mb-6"
        >
          {content.formTitle}
        </h2>

        {isSubmitted ? (
          <div className="rounded-[6px] border border-black/10 bg-[#F7F6F2] p-5 sm:p-6 text-center">
            <p className="text-[15px] sm:text-[16px] font-semibold text-[#161617] mb-1">
              Thank you for reaching out!
            </p>
            <p className="text-[12.5px] sm:text-[13px] text-[#161617]/70 mb-4 sm:mb-5">
              Our team will get back to you shortly to discuss your growth goals.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="rounded-[4px] border border-black/15 bg-white px-3.5 sm:px-4 py-2 text-[12px] font-medium text-[#161617] hover:bg-black/5 transition-colors"
              >
                Submit another enquiry
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-[4px] bg-[#161617] px-4 py-2 text-[12px] font-medium text-white hover:bg-[#2a2a2c] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-3.5 sm:space-y-4">
            {/* Full Name */}
            <div className="group">
              <label className="block text-[11px] sm:text-[11.5px] font-medium text-[#161617]/80 group-focus-within:text-[#161617] group-focus-within:font-semibold mb-1 sm:mb-1.5 transition-colors">
                {content.fullNameLabel} <span className="text-[#D92D20]">*</span>
              </label>
              <input
                type="text"
                required
                value={formValues.fullName}
                onChange={(e) =>
                  handleFieldChange("fullName", e.target.value)
                }
                onBlur={() => handleFieldBlur("fullName")}
                aria-invalid={Boolean(errors.fullName)}
                placeholder={content.fullNamePlaceholder}
                className={`w-full rounded-[4px] border px-3.5 py-2.5 sm:py-3 text-[13px] sm:text-[14px] text-[#161617] placeholder:text-[#161617]/35 focus:outline-none transition-all duration-150 ${
                  errors.fullName
                    ? "border-[#D92D20] bg-white focus:border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]/25"
                    : formValues.fullName.trim().length > 0
                    ? "border-[#161617]/40 bg-[#FFFDF7] focus:border-[#161617] focus:ring-2 focus:ring-[#FCC50E] focus:bg-[#FFFDF5]"
                    : "border-black/12 bg-white focus:border-[#161617] focus:ring-2 focus:ring-[#FCC50E] focus:bg-[#FFFDF5]"
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-[11px] text-[#D92D20]">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Business Email */}
            <div className="group">
              <label className="block text-[11px] sm:text-[11.5px] font-medium text-[#161617]/80 group-focus-within:text-[#161617] group-focus-within:font-semibold mb-1 sm:mb-1.5 transition-colors">
                {content.emailLabel} <span className="text-[#D92D20]">*</span>
              </label>
              <input
                type="email"
                inputMode="email"
                required
                value={formValues.businessEmail}
                onChange={(e) =>
                  handleFieldChange("businessEmail", e.target.value)
                }
                onBlur={() => handleFieldBlur("businessEmail")}
                aria-invalid={Boolean(errors.businessEmail)}
                placeholder={content.emailPlaceholder}
                className={`w-full rounded-[4px] border px-3.5 py-2.5 sm:py-3 text-[13px] sm:text-[14px] text-[#161617] placeholder:text-[#161617]/35 focus:outline-none transition-all duration-150 ${
                  errors.businessEmail
                    ? "border-[#D92D20] bg-white focus:border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]/25"
                    : formValues.businessEmail.trim().length > 0
                    ? "border-[#161617]/40 bg-[#FFFDF7] focus:border-[#161617] focus:ring-2 focus:ring-[#FCC50E] focus:bg-[#FFFDF5]"
                    : "border-black/12 bg-white focus:border-[#161617] focus:ring-2 focus:ring-[#FCC50E] focus:bg-[#FFFDF5]"
                }`}
              />
              {errors.businessEmail && (
                <p className="mt-1 text-[11px] text-[#D92D20]">
                  {errors.businessEmail}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="group">
              <label className="block text-[11px] sm:text-[11.5px] font-medium text-[#161617]/80 group-focus-within:text-[#161617] group-focus-within:font-semibold mb-1 sm:mb-1.5 transition-colors">
                {content.phoneLabel} <span className="text-[#D92D20]">*</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                required
                maxLength={10}
                value={formValues.phoneNumber}
                onChange={(e) =>
                  handleFieldChange("phoneNumber", e.target.value)
                }
                onBlur={() => handleFieldBlur("phoneNumber")}
                aria-invalid={Boolean(errors.phoneNumber)}
                placeholder={content.phonePlaceholder}
                className={`w-full rounded-[4px] border px-3.5 py-2.5 sm:py-3 text-[13px] sm:text-[14px] text-[#161617] placeholder:text-[#161617]/35 focus:outline-none transition-all duration-150 ${
                  errors.phoneNumber
                    ? "border-[#D92D20] bg-white focus:border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]/25"
                    : formValues.phoneNumber.trim().length > 0
                    ? "border-[#161617]/40 bg-[#FFFDF7] focus:border-[#161617] focus:ring-2 focus:ring-[#FCC50E] focus:bg-[#FFFDF5]"
                    : "border-black/12 bg-white focus:border-[#161617] focus:ring-2 focus:ring-[#FCC50E] focus:bg-[#FFFDF5]"
                }`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-[11px] text-[#D92D20]">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="group">
              <label className="block text-[11px] sm:text-[11.5px] font-medium text-[#161617]/80 group-focus-within:text-[#161617] group-focus-within:font-semibold mb-1 sm:mb-1.5 transition-colors">
                {content.messageLabel}
              </label>
              <textarea
                rows={3}
                value={formValues.message}
                onChange={(e) =>
                  handleFieldChange("message", e.target.value)
                }
                onBlur={() => handleFieldBlur("message")}
                aria-invalid={Boolean(errors.message)}
                placeholder={content.messagePlaceholder}
                className={`w-full resize-none rounded-[4px] border px-3.5 py-2.5 sm:py-3 text-[13px] sm:text-[14px] text-[#161617] placeholder:text-[#161617]/35 focus:outline-none transition-all duration-150 ${
                  errors.message
                    ? "border-[#D92D20] bg-white focus:border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]/25"
                    : formValues.message.trim().length > 0
                    ? "border-[#161617]/40 bg-[#FFFDF7] focus:border-[#161617] focus:ring-2 focus:ring-[#FCC50E] focus:bg-[#FFFDF5]"
                    : "border-black/12 bg-white focus:border-[#161617] focus:ring-2 focus:ring-[#FCC50E] focus:bg-[#FFFDF5]"
                }`}
              />
              {errors.message && (
                <p className="mt-1 text-[11px] text-[#D92D20]">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-[4px] bg-[#161617] px-5 py-3 sm:py-3.5 text-[13px] sm:text-[14px] font-medium text-[#FCC50E] transition-colors hover:bg-[#2a2a2c] disabled:opacity-60 cursor-pointer"
            >
              <span className="text-[#FCC50E]">
                {isSubmitting ? "Submitting..." : content.submitButtonText}
              </span>
              <ArrowUpRightIcon className="text-[#FCC50E]" />
            </button>

            {/* Privacy Footnote */}
            <p className="pt-1 text-center text-[10px] sm:text-[10.5px] leading-[1.45] text-[#161617]/55">
              {content.privacyText}{" "}
              <Link
                href={content.privacyLinkHref}
                className="underline hover:text-[#161617]"
                onClick={handleClose}
              >
                {content.privacyLinkText}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
