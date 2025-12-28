"use client"

import { useState } from "react"
import { CheckCircle } from "lucide-react"

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        <h3 className="text-white font-semibold mb-2">Application Submitted!</h3>
        <p className="text-[#888] text-sm">We'll be in touch soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-[#888] mb-2">Full Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
        />
      </div>
      <div>
        <label className="block text-sm text-[#888] mb-2">Email *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
        />
      </div>
      <div>
        <label className="block text-sm text-[#888] mb-2">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
        />
      </div>
      <div>
        <label className="block text-sm text-[#888] mb-2">Resume/LinkedIn URL *</label>
        <input
          type="url"
          required
          value={formData.resume}
          onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
          placeholder="https://"
          className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
        />
      </div>
      <div>
        <label className="block text-sm text-[#888] mb-2">Cover Letter</label>
        <textarea
          rows={4}
          value={formData.coverLetter}
          onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
          placeholder="Tell us why you're interested..."
          className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946] resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-[#E63946] text-white rounded-lg hover:bg-[#d62839] transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  )
}