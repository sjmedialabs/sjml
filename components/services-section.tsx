"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Megaphone, PenTool, Monitor, Code2, type LucideIcon } from "lucide-react"
import type { HomeServicesSection } from "@/lib/home-content"
import { isValidWorkImage } from "@/lib/work-detail"

const SERVICE_ICONS: LucideIcon[] = [PenTool, Megaphone, Monitor, Code2]

interface ServicesSectionProps {
  data: HomeServicesSection
}

function ServiceIcon({ icon, index, size }: { icon: string; index: number; size: number }) {
  const Fallback = SERVICE_ICONS[index % SERVICE_ICONS.length]
  if (isValidWorkImage(icon)) {
    return (
      <Image
        src={icon}
        alt=""
        width={size}
        height={size}
        className="object-contain text-home-primary"
        style={{ width: size, height: size }}
      />
    )
  }
  return <Fallback className="text-home-primary" style={{ width: size, height: size }} strokeWidth={1.5} />
}

export function ServicesSection({ data }: ServicesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const items = data.items.filter((i) => i.enabled && i.title)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const labelSize = data.labelFontSize ?? 11
  const sectionTitleSize = data.sectionTitleFontSize ?? 38
  const sectionDescriptionSize = data.sectionDescriptionFontSize ?? 15
  const cardWidth = data.cardWidth ?? 190
  const cardHeight = data.cardHeight ?? 220
  const cardTitleSize = data.cardTitleFontSize ?? 13
  const cardDescriptionSize = data.cardDescriptionFontSize ?? 11
  const iconSize = Math.min(40, Math.round(cardHeight * 0.18))

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  useEffect(() => {
    updateScrollState()
    window.addEventListener("resize", updateScrollState)
    return () => window.removeEventListener("resize", updateScrollState)
  }, [updateScrollState, items.length, cardWidth])

  if (!data.enabled || items.length === 0) return null

  const scrollStep = cardWidth + 20

  const scrollBy = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -scrollStep : scrollStep, behavior: "smooth" })
  }

  const showScrollButtons = items.length > 2

  return (
    <section className="home-services-section bg-white py-14 md:py-16 lg:py-20">
      <div className="site-container">
        <div className="grid lg:grid-cols-[minmax(0,340px)_1fr] gap-10 lg:gap-12 items-start">
          <div>
            {data.label && (
              <p
                className="site-subtitle uppercase tracking-[0.22em] text-home-primary font-bold mb-5"
                style={{ fontSize: `${labelSize}px` }}
              >
                {data.label}
              </p>
            )}
            <h2
              className="site-title font-bold text-black leading-[1.2] mb-5"
              style={{ fontSize: `clamp(1.75rem, 4vw, ${sectionTitleSize}px)` }}
            >
              {data.title}
            </h2>
            {data.description && (
              <p
                className="site-paragraph leading-[1.65] text-[#757575] mb-8 max-w-[300px]"
                style={{ fontSize: `${sectionDescriptionSize}px` }}
              >
                {data.description}
              </p>
            )}
            <Link
              href={data.exploreLinkUrl || "/services"}
              className="hidden md:inline-flex home-hero-cta-primary items-center gap-2 h-10 px-5 font-semibold text-xs uppercase tracking-wide shrink-0"
            >
              {data.exploreLinkText || "EXPLORE ALL SERVICES"}
              <ChevronRight className="w-4 h-4 shrink-0" strokeWidth={2.5} />
            </Link>
          </div>

          <div className="relative min-w-0 flex flex-col items-center md:block">
            <div
              ref={scrollRef}
              onScroll={updateScrollState}
              className="flex flex-col md:flex-row w-full md:w-auto items-center md:items-stretch gap-5 md:overflow-x-auto pb-4 md:snap-x md:snap-mandatory scrollbar-hide scroll-smooth"
            >
              {items.map((service, index) => (
                <Link
                  key={service.id}
                  href={service.link || "/services"}
                  className="snap-start shrink-0 rounded-lg border border-black/[0.06] bg-white px-5 py-6 shadow-[0_4px_24px_rgba(0,0,0,0.07)] flex flex-col items-center text-center w-full max-w-[340px] md:w-auto"
                  style={{
                    height: cardHeight,
                    minHeight: cardHeight,
                    ["--card-width" as any]: `${cardWidth}px`,
                  }}
                >
                  <div className="mb-3 flex items-center justify-center shrink-0">
                    <ServiceIcon icon={service.icon} index={index} size={iconSize} />
                  </div>
                  <h3
                    className="site-subtitle font-bold uppercase tracking-wide text-black mb-2 shrink-0"
                    style={{ fontSize: `${cardTitleSize}px` }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="site-paragraph leading-[1.5] text-[#757575] line-clamp-3 flex-1"
                    style={{ fontSize: `${cardDescriptionSize}px` }}
                  >
                    {service.description}
                  </p>
                </Link>
              ))}
            </div>

            {/* Explore button visible at bottom only on mobile */}
            <div className="mt-6 md:hidden w-full flex justify-center">
              <Link
                href={data.exploreLinkUrl || "/services"}
                className="home-hero-cta-primary inline-flex items-center justify-center gap-2 h-10 px-6 font-semibold text-xs uppercase tracking-wide shrink-0"
              >
                {data.exploreLinkText || "EXPLORE ALL SERVICES"}
                <ChevronRight className="w-4 h-4 shrink-0" strokeWidth={2.5} />
              </Link>
            </div>

            {showScrollButtons && canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollBy("left")}
                className="hidden md:flex absolute -left-1 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-home-secondary text-white items-center justify-center shadow-lg hover:bg-black transition-colors z-10"
                aria-label="Scroll services left"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={2} />
              </button>
            )}

            {showScrollButtons && canScrollRight && (
              <button
                type="button"
                onClick={() => scrollBy("right")}
                className="hidden md:flex absolute -right-1 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-home-secondary text-white items-center justify-center shadow-lg hover:bg-black transition-colors z-10"
                aria-label="Scroll services right"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
