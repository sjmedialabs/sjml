"use client"

import { useState } from "react"
import { CheckCircle } from "@/components/flat-lucide"
import {
  countWords,
  hasValidEnquiryWordCount,
  isValidEnquiryName,
  isValidIndianMobile,
  limitEnquiryWords,
  sanitizeEnquiryName,
  sanitizeIndianMobile,
} from "@/lib/enquiry-validation"

export function JobApplicationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
    coverLetter: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEnquiryName(formData.name)) {
      setError("Enter a name using letters and spaces only.")
      return
    }
    if (formData.phone && !isValidIndianMobile(formData.phone)) {
      setError("Enter a 10-digit mobile number starting with 6, 7, 8, or 9.")
      return
    }
    if (!hasValidEnquiryWordCount(formData.coverLetter)) {
      setError("Cover letter must be 500 words or fewer.")
      return
    }
    setError("")
    setSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-foreground font-semibold mb-2">Application Submitted!</h3>
        <p className="text-muted-foreground text-sm">We'll be in touch soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-muted-foreground mb-2">Full Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: sanitizeEnquiryName(e.target.value) })}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-[#E63946]"
        />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-2">Email *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-[#E63946]"
        />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-2">Phone</label>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={10}
          pattern="[6-9][0-9]{9}"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: sanitizeIndianMobile(e.target.value) })}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-[#E63946]"
        />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-2">Resume/LinkedIn URL *</label>
        <input
          type="url"
          required
          value={formData.resume}
          onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
          placeholder="https://"
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-[#E63946]"
        />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-2">Cover Letter</label>
        <textarea
          rows={4}
          value={formData.coverLetter}
          onChange={(e) => setFormData({ ...formData, coverLetter: limitEnquiryWords(e.target.value) })}
          placeholder="Tell us why you're interested..."
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-[#E63946] resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">{countWords(formData.coverLetter)}/500 words</p>
      </div>
      {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-[#E63946] text-foreground rounded-lg hover:bg-[#d62839] transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  )
}