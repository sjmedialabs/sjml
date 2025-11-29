"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  className?: string
  maxSizeMB?: number
  maxWidth?: number
  maxHeight?: number
}

export function ImageUpload({
  value,
  onChange,
  label,
  className = "",
  maxSizeMB = 2,
  maxWidth = 1920,
  maxHeight = 1080,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const validateImageDimensions = (file: File): Promise<{ valid: boolean; width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = document.createElement("img")
      img.onload = () => {
        URL.revokeObjectURL(img.src)
        resolve({
          valid: img.width <= maxWidth && img.height <= maxHeight,
          width: img.width,
          height: img.height,
        })
      }
      img.onerror = () => resolve({ valid: false, width: 0, height: 0 })
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file")
        return
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Image must be less than ${maxSizeMB}MB`)
        return
      }

      const dimensions = await validateImageDimensions(file)
      if (!dimensions.valid) {
        setError(
          `Image resolution must be ${maxWidth}x${maxHeight} or smaller. Current: ${dimensions.width}x${dimensions.height}`,
        )
        return
      }

      setError("")
      setUploading(true)

      try {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          onChange(data.url)
        } else {
          setError("Upload failed. Please try again.")
        }
      } catch {
        setError("Upload failed. Please try again.")
      }

      setUploading(false)
    },
    [onChange, maxSizeMB, maxWidth, maxHeight],
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

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0])
      }
    },
    [handleFile],
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
      {label && <label className="block text-sm text-[#888] mb-2">{label}</label>}

      <div className="flex items-start gap-4">
        {/* Thumbnail preview */}
        {value && (
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-[#333] group">
            <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={handleRemove} className="p-1 bg-red-500 rounded-full hover:bg-red-600" title="Remove">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Upload area */}
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            flex-1 relative border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${dragActive ? "border-[#E63946] bg-[#E63946]/10" : "border-[#333] hover:border-[#555]"}
            ${uploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />

          <div className="p-4 text-center">
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
                <span className="text-[#888] text-sm">Uploading...</span>
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
                  <p className="text-[#888] text-sm">
                    <span className="text-[#E63946]">{value ? "Change image" : "Click to upload"}</span> or drag and
                    drop
                  </p>
                  <p className="text-[#555] text-xs">
                    PNG, JPG, GIF up to {maxSizeMB}MB (max {maxWidth}x{maxHeight}px)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      {/* URL Input Fallback */}
      <div className="mt-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL..."
          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-[#E63946]"
        />
      </div>
    </div>
  )
}
