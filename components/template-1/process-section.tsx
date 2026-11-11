"use client"

import React, { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  type Template1ProcessData,
  type Template1ProcessStep,
  defaultTemplate1ProcessData,
} from "./default-data"

export type { Template1ProcessData, Template1ProcessStep }

export interface Template1ProcessSectionProps {
  data?: Template1ProcessData
  className?: string
}

function ProcessStepCard({ step }: { step: Template1ProcessStep }) {
  return (
    <div
      style={{ borderTopColor: "rgba(255, 255, 255, 0.14)" }}
      className="border-t pt-4 sm:pt-5 flex flex-col h-full"
    >
      <span className="text-[24px] sm:text-[28px] md:text-[30px] lg:text-[32px] font-semibold leading-none tracking-[-0.02em] text-[#FCC50E] mb-2 sm:mb-3">
        {step.number}
      </span>
      <h3 className="text-[16px] sm:text-[17px] md:text-[18px] font-semibold text-white mb-1.5 sm:mb-2">
        {step.title}
      </h3>
      <p className="text-[12.5px] sm:text-[13px] md:text-[13.5px] leading-[1.55] text-white/60">
        {step.description}
      </p>
    </div>
  )
}

function ProcessCarousel({ steps }: { steps: Template1ProcessStep[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  })

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
    },
    [emblaApi]
  )

  const onSelect = useCallback((api: NonNullable<typeof emblaApi>) => {
    setSelectedIndex(api.selectedScrollSnap())
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on("select", () => onSelect(emblaApi))
    emblaApi.on("reInit", () => {
      onSelect(emblaApi)
      setScrollSnaps(emblaApi.scrollSnapList())
    })
  }, [emblaApi, onSelect])

  return (
    <div className="relative">
      {/* Left Navigation Arrow */}
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous step"
        className="absolute left-1 sm:-left-5 md:-left-6 lg:-left-6 xl:-left-13 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/20 bg-[#1c1c1e] text-white shadow-md hover:bg-[#FCC50E] hover:text-[#161617] hover:border-[#FCC50E] hover:scale-105 disabled:opacity-20 disabled:pointer-events-none transition-all flex items-center justify-center cursor-pointer active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        type="button"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next step"
        className="absolute right-1 sm:-right-5 md:-right-6 lg:-right-6 xl:-right-13 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/20 bg-[#1c1c1e] text-white shadow-md hover:bg-[#FCC50E] hover:text-[#161617] hover:border-[#FCC50E] hover:scale-105 disabled:opacity-20 disabled:pointer-events-none transition-all flex items-center justify-center cursor-pointer active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Embla Viewport */}
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
        ref={emblaRef}
      >
        <div className="flex -ml-6 sm:-ml-7 md:-ml-8 lg:-ml-8 xl:-ml-10">
          {steps.map((step) => (
            <div
              key={step.id}
              className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/4 pl-6 sm:pl-7 md:pl-8 lg:pl-8 xl:pl-10"
            >
              <ProcessStepCard step={step} />
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Bottom Dots */}
      {scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-8 sm:mt-10">
          {scrollSnaps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollTo(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === selectedIndex
                  ? "w-7 bg-[#FCC50E]"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to step group ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Template1ProcessSection({
  data,
  className = "",
}: Template1ProcessSectionProps) {
  const content = {
    ...defaultTemplate1ProcessData,
    ...data,
    steps: data?.steps ?? defaultTemplate1ProcessData.steps,
  }

  const headlineLines = content.headline.split("\n")

  return (
    <section
      className={`w-full bg-[#141415] text-white py-12 ${className}`}
    >
      <div className="mx-auto w-full max-w-[1200px] xl:max-w-[1320px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          {content.overline && (
            <p className="text-[10px] sm:text-[10.5px] md:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#FCC50E] mb-2 sm:mb-3">
              {content.overline}
            </p>
          )}
          <h2 className="text-[28px] sm:text-[34px] md:text-[38px] lg:text-[44px] xl:text-[50px] font-semibold leading-[1.14] tracking-[-0.02em] text-white">
            {headlineLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        {/* If more than 4 steps, render dynamic carousel; otherwise render static 4-column grid */}
        {content.steps.length > 4 ? (
          <ProcessCarousel steps={content.steps} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 md:gap-8 lg:gap-8 xl:gap-10">
            {content.steps.map((step) => (
              <ProcessStepCard key={step.id} step={step} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
