"use client"

import { useState, type FormEvent } from "react"
import { X, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "")
  return digits.length >= 10
}

interface CaseStudyDownloadModalProps {
  isOpen: boolean
  onClose: () => void
  caseStudyTitle: string
  pdfUrl?: string
}

const inputClass = "site-modal-input w-full rounded-lg"

export function CaseStudyDownloadModal({
  isOpen,
  onClose,
  caseStudyTitle,
  pdfUrl,
}: CaseStudyDownloadModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [industry, setIndustry] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Name is required.")
      return
    }
    if (!email.trim()) {
      setError("Email is required.")
      return
    }
    if (!phone.trim() || !validatePhone(phone)) {
      setError("Please enter a valid phone number (at least 10 digits).")
      return
    }
    if (!industry.trim()) {
      setError("Industry is required.")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company: industry.trim(),
          industry: industry.trim(),
          source: "case-study-download",
          page: "/case-studies",
          notes: `Downloaded Case Study: ${caseStudyTitle}`,
        }),
      })

      if (!res.ok) {
        setError("Something went wrong. Please try again.")
        setSubmitting(false)
        return
      }

      setSubmitted(true)
      setSubmitting(false)

      // Open PDF document directly in a new tab for native inline viewer
      if (pdfUrl && pdfUrl.trim()) {
        window.open(pdfUrl, "_blank")
      }
    } catch {
      setError("Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 site-modal-backdrop" onClick={onClose} />
      <div className="relative site-modal-panel rounded-2xl w-full max-w-lg p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/45 hover:text-black transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-black mt-2 leading-tight">
                Enter your details to get instant access to
              </h2>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{caseStudyTitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                <Input
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                <Input
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Industry *</label>
                <Input
                  placeholder="e.g. E-commerce, Healthcare, Real Estate"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              {error && <p className="text-sm admin-alert-error px-3 py-2 rounded-lg">{error}</p>}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#E63946] hover:bg-[#d62839] text-white font-semibold py-3 rounded-lg shadow-md mt-2"
              >
                {submitting ? "Submitting…" : "Download Now"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h3>
            <p className="text-sm text-gray-600 mb-6">
              Your details have been submitted. {pdfUrl ? "Opening case study PDF..." : "Our team will reach out to you shortly."}
            </p>

            <div className="flex flex-col gap-3">
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#E63946] hover:bg-[#d62839] text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-colors text-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open PDF Document</span>
                </a>
              )}
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
