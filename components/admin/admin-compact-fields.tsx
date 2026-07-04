"use client"

import type { ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function clampSize(value: number, min: number, max: number, fallback: number) {
  if (Number.isNaN(value)) return fallback
  return Math.max(min, Math.min(max, value))
}

interface FontSizePillProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

/** Compact pill control for font/icon sizes in admin. */
export function FontSizePill({ label, value, onChange, min = 8, max = 72 }: FontSizePillProps) {
  return (
    <label className="admin-font-pill inline-flex items-center gap-1 rounded-full border admin-border admin-bg-tertiary px-2 py-0.5 text-[11px] admin-text-secondary">
      <span className="whitespace-nowrap">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(clampSize(Number(e.target.value), min, max, value))}
        className="w-9 bg-transparent text-center admin-text-primary text-[11px] font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <span className="text-[10px] opacity-50">px</span>
    </label>
  )
}

interface CompactFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function CompactField({ label, value, onChange, placeholder, className }: CompactFieldProps) {
  return (
    <div className={className}>
      <Label className="admin-compact-label">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="admin-compact-input h-8 text-xs px-2.5"
      />
    </div>
  )
}

interface CompactTextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
}

export function CompactTextarea({ label, value, onChange, placeholder, rows = 2, className }: CompactTextareaProps) {
  return (
    <div className={className}>
      <Label className="admin-compact-label">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="admin-compact-input text-xs px-2.5 py-2 min-h-0"
      />
    </div>
  )
}

interface CompactSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
}

export function CompactSelect({ label, value, onChange, options, className }: CompactSelectProps) {
  return (
    <div className={className}>
      <Label className="admin-compact-label">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="admin-compact-input w-full h-8 rounded-md border admin-border admin-bg-tertiary admin-text-primary text-xs px-2"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function AdminFieldGrid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const colClass =
    cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
  return <div className={`grid grid-cols-1 ${colClass} gap-2.5`}>{children}</div>
}

export function AdminCompactCard({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="admin-card border admin-border rounded-lg p-3 space-y-2.5">
      {title && <p className="text-xs font-semibold admin-text-primary">{title}</p>}
      {children}
    </div>
  )
}

export function TypographyPillRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-1.5">{children}</div>
}

interface ColorPillProps {
  label: string
  value: string
  onChange: (value: string) => void
}

/** Compact color picker for admin typography controls. */
export function ColorPill({ label, value, onChange }: ColorPillProps) {
  const pickerValue = /^#[0-9A-Fa-f]{6}$/i.test(value) ? value : "#ffffff"

  return (
    <div className="admin-font-pill inline-flex items-center gap-1.5 rounded-full border admin-border admin-bg-tertiary px-2 py-0.5 text-[11px] admin-text-secondary">
      <span className="whitespace-nowrap">{label}</span>
      <label className="cursor-pointer shrink-0">
        <input
          type="color"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-5 w-5 cursor-pointer rounded border admin-border bg-transparent p-0"
          aria-label={`${label} color`}
        />
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[4.5rem] bg-transparent admin-text-primary text-[11px] font-mono outline-none uppercase"
        spellCheck={false}
        aria-label={`${label} hex value`}
      />
    </div>
  )
}
