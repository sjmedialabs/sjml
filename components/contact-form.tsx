"use client"

import { useState } from "react"

interface ContactFormProps {
  buttonText: string
}

export function ContactForm({ buttonText }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          source: "contact_form",
        }),
      })
      setSubmitted(true)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    } catch (error) {
      console.error("Failed to submit form")
    }

    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="text-center py-12 bg-[#111] border border-[#222] rounded-2xl">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
        <p className="text-[#888]">{"We'll get back to you within 24 hours."}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-transparent border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#E63946]"
          placeholder="Full Name/Company Name*"
        />
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 bg-transparent border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#E63946]"
          placeholder="Email address*"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 bg-transparent border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#E63946]"
          placeholder="Phone number"
        />
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-4 py-3 bg-transparent border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#E63946]"
          placeholder="Select Service*"
        />
      </div>
      <textarea
        required
        rows={5}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="w-full px-4 py-3 bg-transparent border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#E63946] resize-none"
        placeholder="Drop your Message or question here..."
      />
      <div className="text-center">
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 bg-[#E63946] text-white rounded-full font-medium hover:bg-[#d62839] disabled:opacity-50 transition-colors inline-flex items-center gap-2"
        >
          {submitting ? "Sending..." : buttonText} <span>→</span>
        </button>
      </div>
    </form>
  )
}