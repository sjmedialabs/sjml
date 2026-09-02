"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { WorkGalleryItem } from "@/lib/work-sections"

interface ProjectGalleryProps {
  items: WorkGalleryItem[]
}

export function ProjectGallery({ items }: ProjectGalleryProps) {
  const len = items.length

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  })

  // Sync scroll snap index
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  // Smooth Auto-slide every 2 seconds
  useEffect(() => {
    if (!emblaApi || len <= 1 || isHovered || lightboxIndex !== null) return
    const timer = setInterval(() => {
      emblaApi.scrollNext()
    }, 2000)
    return () => clearInterval(timer)
  }, [emblaApi, len, isHovered, lightboxIndex])

  // Carousel Navigation
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((idx: number) => emblaApi?.scrollTo(idx), [emblaApi])

  // Lightbox controls
  const close = useCallback(() => setLightboxIndex(null), [])
  const lightboxPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : i === 0 ? len - 1 : i - 1))
  }, [len])
  const lightboxNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : i === len - 1 ? 0 : i + 1))
  }, [len])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") lightboxPrev()
      if (e.key === "ArrowRight") lightboxNext()
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [lightboxIndex, close, lightboxPrev, lightboxNext])

  if (len === 0) return null

  return (
    <>
      <div
        className="relative group my-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Smooth Sliding Track */}
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex -ml-4">
            {items.map((item, index) => (
              <div
                key={`${item.image}-${index}`}
                className="pl-4 min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2"
              >
                <button
                  type="button"
                  className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-muted dark:bg-zinc-900 border border-border group/item shadow-sm hover:shadow-md transition-all duration-300 text-left"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={item.altText || item.title || `Open gallery image ${index + 1}`}
                >
                  <Image
                    src={item.image}
                    alt={item.altText || item.title || `Gallery image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/25 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover/item:opacity-100 transition-opacity bg-black/75 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      Click to view
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {len > 2 && (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-[#E63946] transition-colors shadow-lg z-10"
              onClick={(e) => {
                e.stopPropagation()
                scrollPrev()
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-[#E63946] transition-colors shadow-lg z-10"
              onClick={(e) => {
                e.stopPropagation()
                scrollNext()
              }}
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Pagination Indicators */}
        {len > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-6 bg-[#E63946]" : "w-2 bg-foreground/30 hover:bg-foreground/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && items[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-3 text-white hover:text-[#E63946] transition-colors z-50 rounded-full bg-black/40 hover:bg-black/70"
            onClick={close}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          {len > 1 && (
            <>
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-[#E63946] transition-colors z-50 rounded-full bg-black/40 hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation()
                  lightboxPrev()
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-[#E63946] transition-colors z-50 rounded-full bg-black/40 hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation()
                  lightboxNext()
                }}
                aria-label="Next image"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
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
