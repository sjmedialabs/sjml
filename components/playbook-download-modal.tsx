"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface PlaybookDownloadModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
}

const inputClass = "site-modal-input w-full px-4 py-3 rounded-lg"

export function PlaybookDownloadModal({ isOpen, onClose, pdfUrl }: PlaybookDownloadModalProps) {
  const [step, setStep] = useState<"form" | "otp">("form")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [devOtp, setDevOtp] = useState("")

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/playbook/verify-otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP")
      }

      if (data.otp) {
        setDevOtp(data.otp)
      }

      setStep("otp")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/playbook/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP")
      }

      if (pdfUrl) {
        const link = document.createElement("a")
        link.href = pdfUrl
        link.download = "Brand-Strategy-Playbook.pdf"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      setTimeout(() => {
        handleClose()
      }, 1000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep("form")
    setName("")
    setPhone("")
    setOtp("")
    setError("")
    setDevOtp("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 site-modal-backdrop" onClick={handleClose} />
      <div className="relative site-modal-panel rounded-2xl p-8 max-w-md w-full mx-4">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-black/45 hover:text-black transition-colors"
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-black mb-2">Download Playbook</h2>
        <p className="text-black/60 mb-6">
          {step === "form" ? "Enter your details to receive the playbook" : "Enter the OTP sent to your phone"}
        </p>

        {error && <div className="mb-4 p-3 admin-alert-error rounded-lg text-sm">{error}</div>}

        {devOtp && (
          <div className="mb-4 p-3 admin-alert-success rounded-lg text-sm">
            Development Mode — OTP: <strong>{devOtp}</strong>
          </div>
        )}

        {step === "form" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">Phone Number (WhatsApp) *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={inputClass}
                placeholder="+1234567890"
              />
              <p className="text-xs text-black/45 mt-1">
                Include country code (e.g., +1 for US). You'll receive OTP on WhatsApp.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-home-primary hover:bg-home-primary-hover text-black rounded-lg py-6 text-lg font-semibold"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">Enter OTP *</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                maxLength={6}
                className={`${inputClass} text-center text-2xl tracking-widest`}
                placeholder="000000"
              />
              <p className="text-xs text-black/45 mt-1">
                OTP sent to your WhatsApp: {phone}{" "}
                <button type="button" onClick={() => setStep("form")} className="text-home-primary hover:underline">
                  Change
                </button>
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-home-primary hover:bg-home-primary-hover text-black rounded-lg py-6 text-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Download"}
            </Button>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full text-sm text-black/55 hover:text-black transition-colors"
            >
              Didn't receive OTP? Resend
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
