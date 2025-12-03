"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface PlaybookDownloadModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
}

export function PlaybookDownloadModal({ isOpen, onClose, pdfUrl }: PlaybookDownloadModalProps) {
  const [step, setStep] = useState<"form" | "otp">("form")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [devOtp, setDevOtp] = useState("") // For development mode

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

      // In development, store the OTP for display
      if (data.otp) {
        setDevOtp(data.otp)
      }

      setStep("otp")
    } catch (err: any) {
      setError(err.message || "Failed to send OTP")
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

      // OTP verified, trigger download
      if (pdfUrl) {
        const link = document.createElement("a")
        link.href = pdfUrl
        link.download = "Brand-Strategy-Playbook.pdf"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      // Close modal after successful download
      setTimeout(() => {
        handleClose()
      }, 1000)
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP")
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-[#0f0f0f] rounded-2xl p-8 max-w-md w-full mx-4 border border-[#E63946]/30">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2">Download Playbook</h2>
        <p className="text-gray-400 mb-6">
          {step === "form"
            ? "Enter your details to receive the playbook"
            : "Enter the OTP sent to your phone"}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {devOtp && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
            Development Mode - OTP: <strong>{devOtp}</strong>
          </div>
        )}

        {step === "form" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:border-[#E63946] focus:outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number (WhatsApp) *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:border-[#E63946] focus:outline-none"
                placeholder="+1234567890"
              />
              <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +1 for US). You'll receive OTP on WhatsApp.</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E63946] hover:bg-[#d32f3d] text-white rounded-lg py-6 text-lg font-medium"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Enter OTP *</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                maxLength={6}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:border-[#E63946] focus:outline-none text-center text-2xl tracking-widest"
                placeholder="000000"
              />
              <p className="text-xs text-gray-500 mt-1">
                OTP sent to your WhatsApp: {phone}{" "}
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="text-[#E63946] hover:underline"
                >
                  Change
                </button>
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#E63946] hover:bg-[#d32f3d] text-white rounded-lg py-6 text-lg font-medium disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Download"}
            </Button>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full text-sm text-gray-400 hover:text-white transition-colors"
            >
              Didn't receive OTP? Resend
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
