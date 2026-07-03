"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { WorkGalleryItem } from "@/lib/work-sections"

interface ProjectGalleryProps {
  items: WorkGalleryItem[]
}

export function ProjectGallery({ items }: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const close = useCallback(() => setLightboxIndex(null), [])
  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : i === 0 ? items.length - 1 : i - 1))
  }, [items.length])
  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : i === items.length - 1 ? 0 : i + 1))
  }, [items.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [lightboxIndex, close, goPrev, goNext])

  if (items.length === 0) return null

  const primary = items[0]
  const secondary = items[1]
  const tertiary = items.slice(2, 4)
  const extra = items.slice(4)

  return (
    <>
      <div className="work-gallery-grid">
        {primary && (
          <button
            type="button"
            className="work-gallery-cell work-gallery-tall relative rounded-xl overflow-hidden bg-muted dark:bg-zinc-900"
            onClick={() => setLightboxIndex(0)}
            aria-label={primary.altText || primary.title || "Open gallery image 1"}
          >
            <Image
              src={primary.image}
              alt={primary.altText || primary.title || "Gallery image 1"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
            />
          </button>
        )}
        <div className="work-gallery-side flex flex-col gap-4">
          {secondary && (
            <button
              type="button"
              className="work-gallery-cell work-gallery-wide relative rounded-xl overflow-hidden bg-muted dark:bg-zinc-900 flex-1 min-h-[140px]"
              onClick={() => setLightboxIndex(1)}
              aria-label={secondary.altText || secondary.title || "Open gallery image 2"}
            >
              <Image
                src={secondary.image}
                alt={secondary.altText || secondary.title || "Gallery image 2"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </button>
          )}
          {tertiary.length > 0 && (
            <div className="grid grid-cols-2 gap-4 flex-1">
              {tertiary.map((item, i) => {
                const idx = i + 2
                return (
                  <button
                    key={idx}
                    type="button"
                    className="work-gallery-cell relative aspect-square rounded-xl overflow-hidden bg-muted dark:bg-zinc-900"
                    onClick={() => setLightboxIndex(idx)}
                    aria-label={item.altText || item.title || `Open gallery image ${idx + 1}`}
                  >
                    <Image
                      src={item.image}
                      alt={item.altText || item.title || `Gallery image ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                      loading="lazy"
                    />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {extra.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {extra.map((item, i) => {
            const idx = i + 4
            return (
              <button
                key={idx}
                type="button"
                className="work-gallery-cell relative aspect-[4/3] rounded-xl overflow-hidden bg-muted dark:bg-zinc-900"
                onClick={() => setLightboxIndex(idx)}
                aria-label={item.altText || item.title || `Open gallery image ${idx + 1}`}
              >
                <Image
                  src={item.image}
                  alt={item.altText || item.title || `Gallery image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="25vw"
                  loading="lazy"
                />
              </button>
            )
          })}
        </div>
      )}

      {lightboxIndex !== null && items[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-2 text-white hover:text-[#E63946] transition-colors"
            onClick={close}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          {items.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-[#E63946]"
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-[#E63946]"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
                aria-label="Next image"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={items[lightboxIndex].image}
              alt={items[lightboxIndex].altText || items[lightboxIndex].title || "Gallery"}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}
