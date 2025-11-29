"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ContactPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "website_popup",
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          onClose()
          setSubmitted(false)
          setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        }, 2000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#0d0d0d] border border-[#222] rounded-2xl w-full max-w-lg mx-4 p-8 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#E63946]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#E63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
            <p className="text-gray-400">We'll get back to you shortly.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <span className="text-[#E63946] text-sm font-medium">Start a Project</span>
              <h2 className="text-2xl font-bold text-white mt-2">
                Let's Create Something <span className="text-[#E63946]">Amazing</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Full Name*"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-gray-500 focus:border-[#E63946] rounded-lg"
                />
                <Input
                  type="email"
                  placeholder="Email Address*"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-gray-500 focus:border-[#E63946] rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-gray-500 focus:border-[#E63946] rounded-lg"
                />
                <Input
                  placeholder="Subject*"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-gray-500 focus:border-[#E63946] rounded-lg"
                />
              </div>
              <Textarea
                placeholder="Tell us about your project..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-gray-500 focus:border-[#E63946] rounded-lg resize-none"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E63946] hover:bg-[#d32f3d] text-white rounded-full py-6 text-base font-medium"
              >
                {isSubmitting ? "Sending..." : "Let's Get Started →"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
