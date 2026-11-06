"use client"

import React, { useState } from "react"
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
import { Template1ConsultationModal } from "./consultation-modal"

export type { Template1HeroData, Template1LeadFormValues }

export interface Template1HeroSectionProps {
  data?: Template1HeroData
  onCtaClick?: () => void
  onFormSubmit?: (values: Template1LeadFormValues) => Promise<void> | void
  className?: string
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

export function Template1HeroSection({
  data,
  onCtaClick,
  onFormSubmit,
  className = "",
}: Template1HeroSectionProps) {
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
  const [isModalOpen, setIsModalOpen] = useState(false)

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
      message: true,
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

  const handleCtaButtonClick = () => {
    if (onCtaClick) {
      onCtaClick()
      return
    }
    setIsModalOpen(true)
  }

  const headlineLines = content.headline.split("\n")

  return (
    <>
      <section
        className={`w-full bg-[#FCC50E] text-[#161617] py-12 ${className}`}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 flex flex-col justify-between pt-2">
              <div>
                {/* Badge */}
                <div className="mb-5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#161617]/85">
                    {content.badgeText}
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-[38px] sm:text-[48px] lg:text-[54px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#161617] mb-6">
                  {headlineLines.map((line, index) => (
                    <span key={index} className="block">
                      {line}
                    </span>
                  ))}
                </h1>

                {/* Description */}
                <p className="max-w-[540px] text-[15px] sm:text-[16px] leading-[1.6] text-[#161617]/85 mb-8">
                  {content.description}
                </p>

                {/* CTA Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleCtaButtonClick}
                    className="inline-flex items-center gap-3 rounded-[4px] bg-[#161617] px-6 py-3.5 text-[13px] font-medium text-[#FCC50E] transition-colors hover:bg-[#2a2a2c]"
                  >
                    <span className="text-[#FCC50E]">{content.ctaText}</span>
                    <ArrowUpRightIcon className="text-[#FCC50E]" />
                  </button>
                </div>
              </div>

              {/* Trust Line */}
              {content.trustText && (
                <div className="mt-8 max-w-[360px]">
                  <p className="text-[12px] font-medium text-[#161617]/80">
                    {content.trustText}
                  </p>
                </div>
              )}
            </div>

            {/* Right Form Card */}
            <div
              id="consultation-form"
              className="lg:col-span-5 w-full max-w-[440px] lg:ml-auto rounded-[8px] bg-white p-6 sm:p-8 shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#161617]/55 mb-1.5">
                {content.formOverline}
              </p>
              <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.01em] text-[#161617] mb-6">
                {content.formTitle}
              </h2>

              {isSubmitted ? (
                <div className="rounded-[6px] border border-black/10 bg-[#F7F6F2] p-6 text-center">
                  <p className="text-[16px] font-semibold text-[#161617] mb-1">
                    Thank you for reaching out!
                  </p>
                  <p className="text-[13px] text-[#161617]/70 mb-4">
                    Our team will get back to you shortly to discuss your growth goals.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-[12px] font-medium underline text-[#161617]"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#161617]/80 mb-1.5">
                      {content.fullNameLabel}
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
                      className={`w-full rounded-[4px] border bg-white px-3.5 py-2.5 text-[13px] text-[#161617] placeholder:text-[#161617]/35 focus:outline-none transition-colors ${
                        errors.fullName
                          ? "border-[#D92D20] focus:border-[#D92D20]"
                          : "border-black/12 focus:border-[#161617]"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-[11px] text-[#D92D20]">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Business Email */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#161617]/80 mb-1.5">
                      {content.emailLabel}
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
                      className={`w-full rounded-[4px] border bg-white px-3.5 py-2.5 text-[13px] text-[#161617] placeholder:text-[#161617]/35 focus:outline-none transition-colors ${
                        errors.businessEmail
                          ? "border-[#D92D20] focus:border-[#D92D20]"
                          : "border-black/12 focus:border-[#161617]"
                      }`}
                    />
                    {errors.businessEmail && (
                      <p className="mt-1 text-[11px] text-[#D92D20]">
                        {errors.businessEmail}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#161617]/80 mb-1.5">
                      {content.phoneLabel}
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
                      className={`w-full rounded-[4px] border bg-white px-3.5 py-2.5 text-[13px] text-[#161617] placeholder:text-[#161617]/35 focus:outline-none transition-colors ${
                        errors.phoneNumber
                          ? "border-[#D92D20] focus:border-[#D92D20]"
                          : "border-black/12 focus:border-[#161617]"
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-[11px] text-[#D92D20]">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#161617]/80 mb-1.5">
                      {content.messageLabel}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formValues.message}
                      onChange={(e) =>
                        handleFieldChange("message", e.target.value)
                      }
                      onBlur={() => handleFieldBlur("message")}
                      aria-invalid={Boolean(errors.message)}
                      placeholder={content.messagePlaceholder}
                      className={`w-full resize-none rounded-[4px] border bg-white px-3.5 py-2.5 text-[13px] text-[#161617] placeholder:text-[#161617]/35 focus:outline-none transition-colors ${
                        errors.message
                          ? "border-[#D92D20] focus:border-[#D92D20]"
                          : "border-black/12 focus:border-[#161617]"
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
                    className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-[4px] bg-[#161617] px-5 py-3.5 text-[13px] font-medium text-[#FCC50E] transition-colors hover:bg-[#2a2a2c] disabled:opacity-60"
                  >
                    <span className="text-[#FCC50E]">
                      {isSubmitting ? "Submitting..." : content.submitButtonText}
                    </span>
                    <ArrowUpRightIcon className="text-[#FCC50E]" />
                  </button>

                  {/* Privacy Footnote */}
                  <p className="pt-1 text-center text-[10.5px] leading-[1.45] text-[#161617]/55">
                    {content.privacyText}{" "}
                    <Link
                      href={content.privacyLinkHref}
                      className="underline hover:text-[#161617]"
                    >
                      {content.privacyLinkText}
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Template1ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
        onFormSubmit={onFormSubmit}
      />
    </>
  )
}
