"use client"

import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { X, ChevronLeft, ChevronRight } from "@/components/flat-lucide"
import { Play } from "lucide-react"
import {
  resolveWorkGalleryVideoSource,
  type WorkDetailTemplate,
} from "@/lib/work-detail-template"

export function WorkDetailGallery({ template }: { template: WorkDetailTemplate }) {
  const typo = template.typography
  const imageMedia = template.galleryImages.filter(Boolean).map((src) => ({ kind: "image" as const, src }))
  const videoMedia = template.galleryVideos.flatMap((video) => {
    const source = resolveWorkGalleryVideoSource(video.url)
    return source ? [{ kind: "video" as const, ...video, source }] : []
  })
  const orderedMedia =
    template.galleryMediaPriority === "videos"
      ? [...videoMedia, ...imageMedia]
      : [...imageMedia, ...videoMedia]
  const latestMedia = template.galleryLatestMedia
  const latestMediaIndex = latestMedia
    ? orderedMedia.findIndex(
        (item) =>
          item.kind === latestMedia.kind &&
          (item.kind === "image" ? item.src : item.url) === latestMedia.url,
      )
    : -1
  const media =
    latestMediaIndex >= 0
      ? [...orderedMedia.filter((_, index) => index !== latestMediaIndex), orderedMedia[latestMediaIndex]]
      : orderedMedia
  const len = media.length

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  })

  // Sync active slide index
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
    }, 1500)
    return () => clearInterval(timer)
  }, [emblaApi, len, isHovered, lightboxIndex])

  // Navigation handlers
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((idx: number) => emblaApi?.scrollTo(idx), [emblaApi])

  // Lightbox keyboard controls
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const lightboxPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : i === 0 ? len - 1 : i - 1))
  }, [len])
  const lightboxNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : i === len - 1 ? 0 : i + 1))
  }, [len])
  const activeMedia = lightboxIndex === null ? null : media[lightboxIndex]

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") lightboxPrev()
      if (e.key === "ArrowRight") lightboxNext()
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [lightboxIndex, closeLightbox, lightboxPrev, lightboxNext])

  if (!media.length) return null

  return (
    <section className="work-detail-gallery py-12 md:py-16">
      <div className="site-container">
        {template.galleryLabel && (
          <p
            className="work-detail-gallery-label mb-6 font-bold uppercase tracking-wider text-foreground"
            style={{ fontSize: `${typo.sectionLabelFontSize}px` }}
          >
            {template.galleryLabel}
          </p>
        )}

        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Smooth Sliding Carousel Track */}
          <div className="overflow-hidden rounded-xl" ref={emblaRef}>
            <div className="flex -ml-4">
              {media.map((item, index) => (
                <div
                  key={`${item.kind}-${item.kind === "image" ? item.src : item.url}-${index}`}
                  className="pl-4 min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2"
                >
                  <button
                    type="button"
                    className="relative block w-full aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group/item bg-muted dark:bg-zinc-900 border border-border shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={() => setLightboxIndex(index)}
                    aria-label={
                      item.kind === "video"
                        ? `Play ${item.title || `gallery video ${index + 1}`}`
                        : `View gallery image ${index + 1}`
                    }
                  >
                    {item.kind === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.src}
                        alt={`Work gallery image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                      />
                    ) : item.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnail}
                        alt={item.title || `Work gallery video ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-black" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/25 transition-colors flex items-center justify-center">
                      {item.kind === "video" ? (
                        <span className="rounded-full bg-black/75 text-white p-3">
                          <Play className="w-6 h-6 fill-current" />
                        </span>
                      ) : (
                        <span className="opacity-0 group-hover/item:opacity-100 transition-opacity bg-black/75 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                          Click to view
                        </span>
                      )}
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
              {media.map((_, i) => (
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
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && activeMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-3 text-white hover:text-[#E63946] transition-colors z-50 rounded-full bg-black/40 hover:bg-black/70"
            onClick={closeLightbox}
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
            {activeMedia.kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeMedia.src}
                alt={`Gallery detail ${lightboxIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            ) : activeMedia.source.kind === "embed" ? (
              <iframe
                src={activeMedia.source.src}
                title={activeMedia.title || `Gallery video ${lightboxIndex + 1}`}
                className="w-full aspect-video rounded-lg"
                allow="autoplay; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <video
                src={activeMedia.source.src}
                poster={activeMedia.thumbnail || undefined}
                title={activeMedia.title || `Gallery video ${lightboxIndex + 1}`}
                className="max-w-full max-h-[85vh] w-full rounded-lg"
                controls
                autoPlay
                playsInline
              />
            )}
          </div>
        </div>
      )}
    </section>
  )
}
