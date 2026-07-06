"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AlertCircle, CheckCircle2, X } from "lucide-react"

function getToastVariant(message: string): "success" | "error" {
  const lower = message.toLowerCase()
  if (
    message.includes("❌") ||
    lower.includes("fail") ||
    lower.includes("error") ||
    lower.includes("could not")
  ) {
    return "error"
  }
  return "success"
}

export function AdminToast({
  message,
  onClose,
  duration = 4500,
}: {
  message: string
  onClose?: () => void
  duration?: number
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!message || !onClose) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [message, onClose, duration])

  if (!mounted || !message) return null

  const variant = getToastVariant(message)
  const isSuccess = variant === "success"

  return createPortal(
    <div
      className="fixed top-5 right-5 z-[10000] w-[min(100vw-2rem,22rem)] pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.18)] animate-in slide-in-from-top-2 fade-in duration-300 ${
          isSuccess
            ? "border-emerald-300 bg-emerald-600 text-white"
            : "border-red-300 bg-red-600 text-white"
        }`}
      >
        <span className="mt-0.5 shrink-0" aria-hidden="true">
          {isSuccess ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-100" strokeWidth={2.25} />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-100" strokeWidth={2.25} />
          )}
        </span>
        <p className="flex-1 text-sm font-semibold leading-snug tracking-tight">{message}</p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md p-0.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>,
    document.body,
  )
}
