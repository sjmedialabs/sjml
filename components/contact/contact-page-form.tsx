"use client"

import { useState } from "react"
import Link from "next/link"
import type { ContactFormBlock, ContactPageTypography } from "@/lib/contact-page-content"

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.privacy) return
    setSubmitting(true)
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
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
          <h3>Message sent!</h3>
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

      <form onSubmit={handleSubmit} className="contact-page-form">
        <div className="contact-form-row">
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={data.namePlaceholder}
            className="contact-form-input"
            style={{ fontSize: `${typography.formLabelFontSize}px` }}
          />
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={data.emailPlaceholder}
            className="contact-form-input"
            style={{ fontSize: `${typography.formLabelFontSize}px` }}
          />
        </div>
        <div className="contact-form-row">
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder={data.phonePlaceholder}
            className="contact-form-input"
            style={{ fontSize: `${typography.formLabelFontSize}px` }}
          />
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder={data.companyPlaceholder}
            className="contact-form-input"
            style={{ fontSize: `${typography.formLabelFontSize}px` }}
          />
        </div>
        <select
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
        <textarea
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder={data.messagePlaceholder}
          className="contact-form-textarea"
          style={{ fontSize: `${typography.formLabelFontSize}px` }}
        />
        <label className="contact-form-privacy">
          <input
            type="checkbox"
            checked={formData.privacy}
            onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })}
            required
          />
          <span style={{ fontSize: `${typography.formLabelFontSize}px` }}>
            I agree to the{" "}
            <Link href={data.privacyUrl} className="contact-form-privacy-link">
              Privacy Policy
            </Link>
          </span>
        </label>
        <button
          type="submit"
          disabled={submitting || !formData.privacy}
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
