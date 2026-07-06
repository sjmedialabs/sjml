"use client"

import { useState, type FormEvent } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "")
  return digits.length >= 10
}

interface InsightLeadPopupProps {
  isOpen: boolean
  onClose: () => void
  insightSlug: string
  onSuccess: () => void
}

const inputClass = "site-modal-input w-full rounded-lg"

export function InsightLeadPopup({ isOpen, onClose, insightSlug, onSuccess }: InsightLeadPopupProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email?.trim()) {
      setError("Email is required.")
      return
    }
    if (phone && !validatePhone(phone)) {
      setError("Please enter a valid phone number (at least 10 digits).")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          phone: phone.trim() || undefined,
          company: company.trim() || undefined,
          source: "insight",
          page: "/insights/" + insightSlug,
        }),
      })
      if (!res.ok) {
        setError("Something went wrong. Please try again.")
        setSubmitting(false)
        return
      }
      onSuccess()
    } catch {
      setError("Something went wrong. Please try again.")
    }
    setSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 site-modal-backdrop" onClick={onClose} />
      <div className="relative site-modal-panel rounded-2xl w-full max-w-lg mx-4 p-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/45 hover:text-black transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center mb-6">
          <span className="text-home-primary text-sm font-semibold uppercase tracking-wide">Read full article</span>
          <h2 className="text-xl font-bold text-black mt-2">Enter your details to continue</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Name *" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
          <Input type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
          <Input placeholder="Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} required />
          <Input placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} />
          {error && <p className="text-sm admin-alert-error px-3 py-2 rounded-lg">{error}</p>}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-home-primary hover:bg-home-primary-hover text-black font-semibold"
          >
            {submitting ? "Submitting…" : "Continue to article"}
          </Button>
        </form>
      </div>
    </div>
  )
}
