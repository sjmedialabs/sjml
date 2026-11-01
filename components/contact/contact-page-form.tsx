"use client"

import { useState } from "react"
import Link from "next/link"
import type { ContactFormBlock, ContactPageTypography } from "@/lib/contact-page-content"

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export function ContactPageForm({
  data,
  typography,
}: {
  data: ContactFormBlock
  typography: ContactPageTypography
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
    privacy: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [privacyError, setPrivacyError] = useState("")

  const emailIsValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailValue = (e.currentTarget as HTMLFormElement).querySelector<HTMLInputElement>("#contact-email")?.value ?? formData.email
    if (!emailIsValid(emailValue)) {
      setEmailError("Enter a valid email address, such as name@company.com.")
      return
    }
    setEmailError("")
    if (!formData.privacy) {
      setPrivacyError("Check the privacy box before sending your message.")
      return
    }
    setPrivacyError("")
    setSubmitting(true)
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: emailValue,
          phone: formData.phone,
          company: formData.company,
          subject: formData.service,
          message: formData.message,
          source: "contact_form",
        }),
      })
      setSubmitted(true)
      setFormData({ name: "", email: "", phone: "", company: "", service: "", message: "", privacy: false })
    } catch {
      console.error("Failed to submit contact form")
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="contact-form-block">
        <div className="contact-form-success">
          <h2>Message sent!</h2>
          <p>Thank you for reaching out. We&apos;ll get back to you shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="contact-form-block">
      <p className="contact-section-label" style={{ fontSize: `${typography.sectionLabelFontSize}px` }}>
        {data.label}
      </p>
      <h2 className="contact-section-heading" style={{ fontSize: `${typography.sectionHeadingFontSize}px` }}>
        {data.heading}
      </h2>

      <form onSubmit={handleSubmit} className="contact-page-form" noValidate>
        <div className="contact-form-row">
          <div>
            <label htmlFor="contact-name" className="sr-only">Name</label>
            <input
              id="contact-name"
              type="text"
              required
              aria-label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={data.namePlaceholder}
              className="contact-form-input"
              style={{ fontSize: `${typography.formLabelFontSize}px` }}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="sr-only">Email</label>
            <input
              id="contact-email"
              type="email"
              required
              aria-label="Email"
              aria-invalid={emailError ? true : undefined}
              aria-describedby="contact-email-error"
              value={formData.email}
              onChange={(e) => {
                const next = e.target.value
                setFormData({ ...formData, email: next })
                if (emailError) setEmailError("")
              }}
              onBlur={(e) => {
                const value = e.currentTarget.value
                if (value.trim() && !emailIsValid(value)) {
                  setEmailError("Enter a valid email address, such as name@company.com.")
                }
              }}
              onInvalid={(e) => {
                e.preventDefault()
                setEmailError("Enter a valid email address, such as name@company.com.")
              }}
              placeholder={data.emailPlaceholder}
              className="contact-form-input"
              style={{ fontSize: `${typography.formLabelFontSize}px` }}
            />
          </div>
        </div>
        <p id="contact-email-error" role="alert" className={`contact-email-error${emailError ? " is-visible" : ""}`}>
          Enter a valid email address, such as name@company.com.
        </p>
        <div className="contact-form-row">
          <div>
            <label htmlFor="contact-phone" className="sr-only">Phone</label>
            <input
              id="contact-phone"
              type="tel"
              required
              aria-label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={data.phonePlaceholder}
              className="contact-form-input"
              style={{ fontSize: `${typography.formLabelFontSize}px` }}
            />
          </div>
          <div>
            <label htmlFor="contact-company" className="sr-only">Company</label>
            <input
              id="contact-company"
              type="text"
              aria-label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder={data.companyPlaceholder}
              className="contact-form-input"
              style={{ fontSize: `${typography.formLabelFontSize}px` }}
            />
          </div>
        </div>
        <div>
          <label htmlFor="contact-service" className="sr-only">Service</label>
          <select
            id="contact-service"
            aria-label="Service"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="contact-form-select"
            style={{ fontSize: `${typography.formLabelFontSize}px` }}
          >
            <option value="">{data.servicePlaceholder}</option>
            {data.serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="contact-message" className="sr-only">Message</label>
          <textarea
            id="contact-message"
            required
            rows={5}
            aria-label="Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={data.messagePlaceholder}
            className="contact-form-textarea"
            style={{ fontSize: `${typography.formLabelFontSize}px` }}
          />
        </div>
        <label className="contact-form-privacy">
          <input
            type="checkbox"
            checked={formData.privacy}
            onChange={(e) => {
              setFormData({ ...formData, privacy: e.target.checked })
              if (e.target.checked) setPrivacyError("")
            }}
            required
          />
          <span style={{ fontSize: `${typography.formLabelFontSize}px` }}>
            I agree to the{" "}
            <Link href={data.privacyUrl} className="contact-form-privacy-link">
              Privacy Policy
            </Link>
          </span>
        </label>
        {privacyError ? (
          <p role="alert" className="text-sm text-red-600">
            {privacyError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="contact-form-submit"
          style={{ fontSize: `${typography.formLabelFontSize}px` }}
        >
          {submitting ? "Sending..." : data.buttonText}
          <ArrowIcon />
        </button>
      </form>
    </div>
  )
}
