"use client"

import { useState, useEffect, useCallback, type CSSProperties } from "react"
import { FlatSvg } from "@/components/flat-svg"
import Link from "next/link"
import type { HomeHero, HeroSlide } from "@/lib/home-content"
import { HOME_HERO_DEFAULT_COLORS } from "@/lib/home-content"
import { heroBackgroundStyle } from "@/components/inner-page-hero-background"

const HOME_HERO_OVERLAY =
  "linear-gradient(90deg, rgb(22 22 23 / 0.88) 0%, rgb(22 22 23 / 0.55) 55%, rgb(22 22 23 / 0.35) 100%)"

interface HeroSectionProps {
  data: HomeHero
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function ScrollMouseIcon({ className }: { className?: string }) {
  return (
    <FlatSvg className={className} width="22" height="32" viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="2" width="16" height="26" rx="8" />
      <line x1="12" y1="8" x2="12" y2="14" />
    </FlatSvg>
  )
}

function SlideContent({
  slide,
  titleFontSize,
  colors,
}: {
  slide: HeroSlide
  titleFontSize: number
  colors: {
    overTitle: string
    headline: string
    highlight: string
    description: string
  }
}) {
  return (
    <div className="home-hero-content max-w-xl lg:max-w-2xl">
      {slide.overTitle && (
        <p
          className="site-subtitle text-sm uppercase tracking-[0.2em] mb-3"
          style={{ color: colors.overTitle }}
        >
          {slide.overTitle}
        </p>
      )}
      <h1
        className="font-bold uppercase leading-[1.1] tracking-tight mb-3 md:mb-4"
        style={{ fontSize: `clamp(2.15rem, 5vw, ${titleFontSize}px)`, color: colors.headline }}
      >
        {slide.headline && <span className="block">{slide.headline}</span>}
        {slide.headlineLine2 && <span className="block">{slide.headlineLine2}</span>}
        {slide.highlightText && (
          <span className="home-hero-highlight block" style={{ color: colors.highlight }}>
            {slide.highlightText}
          </span>
        )}
      </h1>
      {slide.description && (
        <p className="site-paragraph max-w-md mb-5" style={{ color: colors.description }}>
          {slide.description}
        </p>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <Link
          href={slide.primaryButtonUrl || "/services"}
          className="home-hero-cta-primary inline-flex items-center gap-2 px-4 font-semibold text-sm uppercase tracking-wide transition-colors"
        >
          {slide.primaryButtonText || "OUR SERVICES"}
          <ArrowIcon />
        </Link>
        <Link
          href={slide.secondaryButtonUrl || "/work"}
          className="home-hero-cta-secondary inline-flex items-center text-sm uppercase tracking-wide font-medium border-b-2 border-home-primary pb-0.5 text-white transition-colors hover:text-home-primary"
        >
          {slide.secondaryButtonText || "VIEW OUR WORK"}
        </Link>
      </div>
    </div>
  )
}

export function HeroSection({ data }: HeroSectionProps) {
  const slides = data.slides.filter((s) => s.enabled)
  const [activeIndex, setActiveIndex] = useState(0)
  const [fade, setFade] = useState(true)

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex || slides.length === 0) return
      setFade(false)
      setTimeout(() => {
        setActiveIndex(index)
        setFade(true)
      }, 200)
    },
    [activeIndex, slides.length],
  )

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      goTo((activeIndex + 1) % slides.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [activeIndex, slides.length, goTo])

  if (!data.enabled || slides.length === 0) return null

  const activeSlide = slides[activeIndex] ?? slides[0]
  const titleFontSize = data.titleFontSize ?? 42
  const maxHeight = data.maxHeight ?? 500
  const colors = {
    overTitle: data.overTitleColor ?? HOME_HERO_DEFAULT_COLORS.overTitle,
    headline: data.headlineColor ?? HOME_HERO_DEFAULT_COLORS.headline,
    highlight: data.highlightColor ?? HOME_HERO_DEFAULT_COLORS.highlight,
    description: data.descriptionColor ?? HOME_HERO_DEFAULT_COLORS.description,
  }

  return (
    <section className="home-hero-section bg-white">
        <div
          className="home-hero-carousel relative isolate w-full mx-auto bg-home-secondary"
          style={{
            "--home-hero-max-height": `${maxHeight}px`,
            ...heroBackgroundStyle(activeSlide.backgroundImage, HOME_HERO_OVERLAY),
            opacity: fade ? 1 : 0.92,
            transition: "opacity 0.2s ease",
          } as CSSProperties}
        >
          {activeSlide.backgroundVideo?.trim() ? (
            <video
              className="absolute inset-0 z-0 h-full w-full object-cover"
              src={activeSlide.backgroundVideo.trim()}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : null}

          <div className="relative z-[2] flex h-full items-center">
            {slides.length > 1 && (
              <div className="hidden md:flex shrink-0 flex-col gap-3 pl-6">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goTo(index)}
                    className="home-hero-slide-btn group flex h-11 items-center gap-2 text-left"
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                  >
                    <span
                      className={`block w-0.5 transition-all duration-300 ${
                        index === activeIndex ? "h-10 bg-home-primary" : "h-5 bg-white/40 group-hover:bg-white/70"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium tracking-widest ${
                        index === activeIndex ? "text-home-primary" : "text-white/50 group-hover:text-white/80"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex min-w-0 flex-1 items-center pl-6 md:pl-10 pr-6 md:pr-10">
              <SlideContent slide={activeSlide} titleFontSize={titleFontSize} colors={colors} />
            </div>
          </div>

          {data.showScrollIndicator && (
            <div className="home-hero-scroll-indicator absolute bottom-5 right-5 md:right-6 z-[3] flex flex-col items-center gap-1.5 text-white">
              <ScrollMouseIcon />
              <span className="text-sm uppercase tracking-widest">{data.scrollIndicatorText || "SCROLL DOWN"}</span>
            </div>
          )}
        </div>
    </section>
  )
}
