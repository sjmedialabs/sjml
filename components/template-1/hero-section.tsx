"use client"

import React, { useState, useEffect, useRef } from "react"
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
import { landingTitleStyle } from "./title-size"
import { submitTemplate1Lead } from "./submit-lead"
import { executeInvisibleCaptcha } from "./invisible-captcha"

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
  const [captchaError, setCaptchaError] = useState("")
  const captchaRef = useRef<HTMLDivElement>(null)
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  useEffect(() => {
    if (!isSubmitted) return
    const timer = setTimeout(() => {
      setIsSubmitted(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [isSubmitted])
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
    })

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setCaptchaError("")
    try {
      let captchaToken: string | undefined
      if (recaptchaSiteKey) {
        if (!captchaRef.current) {
          throw new Error("Captcha failed to load")
        }
        captchaToken = await executeInvisibleCaptcha(captchaRef.current, recaptchaSiteKey)
      }

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
          "website",
          captchaToken,
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
    } catch (error) {
      const message = error instanceof Error ? error.message : ""
      setCaptchaError(
        message.includes("enquiry") ? message : "Verification failed. Please try again.",
      )
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
        <div className="mx-auto w-full max-w-[1200px] xl:max-w-[1320px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="grid grid-cols-1 items-start gap-8 sm:gap-10 lg:grid-cols-12 lg:items-stretch -translate-y-7 lg:gap-10 xl:gap-14 2xl:gap-16">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 relative flex flex-col pt-2">
              <div className="flex flex-1 flex-col justify-center">
                {/* Badge */}
                <div className="mb-4 sm:mb-5">
                  <span className="text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#161617]/85">
                    {content.badgeText}
                  </span>
                </div>

                {/* Headline */}
                <h1
                  className="text-[length:calc(32px*var(--landing-title-scale))] sm:text-[length:calc(42px*var(--landing-title-scale))] md:text-[length:calc(48px*var(--landing-title-scale))] lg:text-[length:calc(52px*var(--landing-title-scale))] xl:text-[length:calc(60px*var(--landing-title-scale))] 2xl:text-[length:calc(66px*var(--landing-title-scale))] font-semibold leading-[1.08] tracking-[-0.02em] text-[#161617] mb-5 sm:mb-6"
                  style={landingTitleStyle(66, content.headlineFontSize)}
                >
                  {headlineLines.map((line, index) => (
                    <span key={index} className="block">
                      {line}
                    </span>
                  ))}
                </h1>

                {/* Description */}
                <p className="max-w-[540px] md:max-w-full lg:max-w-[540px] xl:max-w-[620px] text-[14px] sm:text-[15px] md:text-[16px] xl:text-[17px] leading-[1.6] text-[#161617]/85 mb-7 sm:mb-8">
                  {content.description}
                </p>

                {/* CTA Button */}
                <div className="w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCtaButtonClick}
                    className="group cursor-pointer w-full sm:w-auto flex sm:inline-flex items-center justify-center gap-3 rounded-[4px] bg-[#161617] px-5 sm:px-6 py-3.5 sm:py-3.5 text-[13px] sm:text-[13px] xl:text-[14px] font-medium text-[#FCC50E] transition-all duration-200 hover:bg-[#2a2a2c] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
                  >
                    <span className="text-[#FCC50E]">{content.ctaText}</span>
                    <ArrowUpRightIcon className="text-[#FCC50E] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>

              <div className="mt-7 sm:mt-8 flex items-end justify-between gap-4 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0">
                {/* Trust Line */}
                {content.trustText && (
                  <div className="max-w-[360px] md:max-w-full xl:max-w-[400px]">
                    <p className="text-[11.5px] sm:text-[12px] xl:text-[13px] font-medium text-[#161617]/80">
                      {content.trustText}
                    </p>
                  </div>
                )}
                {content.showScrollIndicator && (
                  <div className="ml-auto hidden lg:flex shrink-0 -translate-y-4 flex-col items-center gap-1 font-bold text-black">
                    <svg
                      aria-hidden="true"
                      className="animate-bounce"
                      fill="none"
                      height="32"
                      viewBox="0 0 24 36"
                      width="22"
                    >
                      <rect
                        height="26"
                        rx="8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        width="16"
                        x="4"
                        y="2"
                      />
                      <line
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        x1="12"
                        x2="12"
                        y1="8"
                        y2="14"
                      />
                    </svg>
                    <span className="text-sm font-bold uppercase tracking-widest">
                      Scroll Down
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Form Card: Edge to edge on mobile & tablet, constrained to 5 cols on lg+ */}
            <div className="lg:col-span-5 w-full max-w-full sm:max-w-none md:max-w-none lg:max-w-[440px] xl:max-w-[480px] 2xl:max-w-[500px] lg:ml-auto">
              <div
                id="consultation-form"
                className="w-full rounded-[8px] bg-white p-5 sm:p-7 md:p-8 shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
              >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#161617]/55 mb-1.5">
                {content.formOverline}
              </p>
              <h2
                className="text-[length:calc(20px*var(--landing-title-scale))] sm:text-[length:calc(22px*var(--landing-title-scale))] md:text-[length:calc(23px*var(--landing-title-scale))] font-semibold tracking-[-0.01em] text-[#161617] mb-3 sm:mb-4"
                style={landingTitleStyle(23, content.formTitleFontSize)}
              >
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
                    className="cursor-pointer text-[12px] font-medium underline text-[#161617] transition-opacity hover:opacity-70"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-3.5">
                  {/* Full Name */}
                  <div className="group">
                    <label className="block text-[11px] sm:text-[11.5px] font-medium text-[#161617]/80 group-focus-within:text-[#161617] group-focus-within:font-semibold mb-1 transition-colors">
                      {content.fullNameLabel} *
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
                      className={`w-full rounded-[4px] border px-3.5 py-2 sm:py-2.5 text-[13px] sm:text-[13.5px] text-[#161617] placeholder:text-[#161617]/35 focus:outline-none transition-all duration-150 ${
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
                    <label className="block text-[11px] sm:text-[11.5px] font-medium text-[#161617]/80 group-focus-within:text-[#161617] group-focus-within:font-semibold mb-1 transition-colors">
                      {content.emailLabel} *
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
                      className={`w-full rounded-[4px] border px-3.5 py-2 sm:py-2.5 text-[13px] sm:text-[13.5px] text-[#161617] placeholder:text-[#161617]/35 focus:outline-none transition-all duration-150 ${
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
                    <label className="block text-[11px] sm:text-[11.5px] font-medium text-[#161617]/80 group-focus-within:text-[#161617] group-focus-within:font-semibold mb-1 transition-colors">
                      {content.phoneLabel} *
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
                      className={`w-full rounded-[4px] border px-3.5 py-2 sm:py-2.5 text-[13px] sm:text-[13.5px] text-[#161617] placeholder:text-[#161617]/35 focus:outline-none transition-all duration-150 ${
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
                    <label className="block text-[11px] sm:text-[11.5px] font-medium text-[#161617]/80 group-focus-within:text-[#161617] group-focus-within:font-semibold mb-1 transition-colors">
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
                      className={`w-full resize-none rounded-[4px] border px-3.5 py-2 sm:py-2.5 text-[13px] sm:text-[13.5px] text-[#161617] placeholder:text-[#161617]/35 focus:outline-none transition-all duration-150 ${
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

                  <div ref={captchaRef} className="h-0 w-0 overflow-visible" />

                  {captchaError && (
                    <p className="text-[11px] text-[#D92D20]">{captchaError}</p>
                  )}

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group mt-2 flex w-full items-center justify-center gap-2.5 rounded-[4px] bg-[#161617] px-5 py-3.5 text-[13px] sm:text-[13.5px] font-medium text-[#FCC50E] transition-all duration-200 hover:bg-[#2a2a2c] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
                  >
                    <span className="text-[#FCC50E]">
                      {isSubmitting ? "Submitting..." : content.submitButtonText}
                    </span>
                    <ArrowUpRightIcon className="text-[#FCC50E] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
