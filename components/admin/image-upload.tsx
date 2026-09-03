"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { uploadImageAction } from "@/app/actions/upload"
import {
  formatImageSpecLine,
  resolveImageSpec,
  type ImageUploadPreset,
  type ImageUploadSpec,
} from "@/lib/admin-media-specs"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onMultipleChange?: (urls: string[]) => void
  multiple?: boolean
  label?: string
  className?: string
  /** Applies recommended size, limits, and helper copy for common admin use cases. */
  preset?: ImageUploadPreset
  maxSizeMB?: number
  maxWidth?: number
  maxHeight?: number
  recommendedWidth?: number
  recommendedHeight?: number
  hint?: string
}

export function ImageUpload({
  value,
  onChange,
  onMultipleChange,
  multiple = false,
  label,
  className = "",
  preset,
  maxSizeMB,
  maxWidth,
  maxHeight,
  recommendedWidth,
  recommendedHeight,
  hint,
}: ImageUploadProps) {
  const spec: ImageUploadSpec = resolveImageSpec(preset, {
    ...(maxSizeMB != null ? { maxSizeMB } : {}),
    ...(maxWidth != null ? { maxWidth } : {}),
    ...(maxHeight != null ? { maxHeight } : {}),
    ...(recommendedWidth != null ? { recommendedWidth } : {}),
    ...(recommendedHeight != null ? { recommendedHeight } : {}),
    ...(hint != null ? { hint } : {}),
  })

  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith("image/")) return null
    if (file.size > spec.maxSizeMB * 1024 * 1024) return null

    const formData = new FormData()
    formData.append("file", file)

    try {
      const result = await uploadImageAction(formData)
      if (result.url) return result.url
      const fallbackForm = new FormData()
      fallbackForm.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fallbackForm })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.url) return data.url
    } catch {
      try {
        const fallbackForm = new FormData()
        fallbackForm.append("file", file)
        const res = await fetch("/api/upload", { method: "POST", body: fallbackForm })
        const data = await res.json().catch(() => ({}))
        if (res.ok && data.url) return data.url
      } catch {
        return null
      }
    }
    return null
  }

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"))
      if (files.length === 0) {
        setError("Please upload image file(s)")
        return
      }

      setError("")
      setUploading(true)

      const uploadedUrls: string[] = []
      for (const file of files) {
        if (file.size <= spec.maxSizeMB * 1024 * 1024) {
          const url = await uploadSingleFile(file)
          if (url) uploadedUrls.push(url)
        }
      }

      if (uploadedUrls.length > 0) {
        if (multiple && onMultipleChange) {
          onMultipleChange(uploadedUrls)
        } else {
          onChange(uploadedUrls[0])
        }
      } else {
        setError("Failed to upload image(s). Check size limit.")
      }

      setUploading(false)
    },
    [onChange, onMultipleChange, multiple, spec.maxSizeMB],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles],
  )

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
  }

  return (
    <div className={className}>
      {label && <label className="block text-sm admin-text-secondary mb-1">{label}</label>}
      <p className="text-xs admin-text-muted mb-2 leading-snug">{formatImageSpecLine(spec)}</p>
      {spec.hint && <p className="text-xs admin-text-muted mb-2 leading-snug">{spec.hint}</p>}

      <div className="flex items-start gap-4">
        {value && !multiple && (
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border admin-border-light group">
            <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={handleRemove} className="p-1 bg-red-500 rounded-full hover:bg-red-600" title="Remove">
                <svg className="w-4 h-4 admin-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            flex-1 relative border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${dragActive ? "border-primary bg-primary/10" : "admin-border-light hover:border-[#555]"}
            ${uploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleChange}
            className="hidden"
          />

          <div className="p-4 text-center">
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="admin-text-secondary text-sm">Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6 text-[#555]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div className="text-left">
                  <p className="admin-text-secondary text-sm">
                    <span className="text-primary">{value ? "Change image" : "Click to upload"}</span> or drag and drop
                  </p>
                  <p className="text-[#555] text-xs">
                    Max file size {spec.maxSizeMB}MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  )
}
