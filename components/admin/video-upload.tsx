"use client"

import { useState, useRef, useCallback } from "react"
import { uploadVideoAction } from "@/app/actions/upload"
import { Film, Upload, X } from "lucide-react"

interface VideoUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  className?: string
  maxSizeMB?: number
}

export function VideoUpload({
  value,
  onChange,
  label = "Background video",
  className = "",
  maxSizeMB = 10,
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a video file (MP4, WebM, etc.)")
        return
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Video must be less than ${maxSizeMB}MB`)
        return
      }

      setError("")
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)

      try {
        const result = await uploadVideoAction(formData)
        if (result.url) {
          onChange(result.url)
        } else {
          setError(result.error ?? "Upload failed")
        }
      } catch {
        setError("Upload failed")
      } finally {
        setUploading(false)
      }
    },
    [maxSizeMB, onChange],
  )

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) void handleFile(file)
  }

  return (
    <div className={className}>
      {label && <label className="block text-sm admin-text-secondary mb-2">{label}</label>}

      {value ? (
        <div className="relative rounded-lg border admin-border-light overflow-hidden admin-bg-tertiary">
          <video src={value} className="w-full max-h-40 object-cover bg-black" muted playsInline controls />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label="Remove video"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onClick={() => inputRef.current?.click()}
          onDragEnter={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setDragActive(false)
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "admin-border-light hover:admin-border"
          }`}
        >
          <Film className="w-8 h-8 mx-auto mb-2 admin-text-secondary" />
          <p className="text-sm admin-text-primary mb-1">
            {uploading ? "Uploading…" : "Drag & drop a video or click to browse"}
          </p>
          <p className="text-xs admin-text-secondary">MP4, WebM — max {maxSizeMB}MB</p>
          <Upload className="w-4 h-4 mx-auto mt-2 admin-text-secondary" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
          e.target.value = ""
        }}
      />

      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
    </div>
  )
}
