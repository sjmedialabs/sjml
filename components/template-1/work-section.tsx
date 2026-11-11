"use client"

import React, { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  type Template1WorkData,
  type Template1FeaturedWork,
  type Template1SecondaryWorkItem,
  type Template1LeadFormValues,
  defaultTemplate1WorkData,
} from "./default-data"
import { Template1ConsultationModal } from "./consultation-modal"

export type {
  Template1WorkData,
  Template1FeaturedWork,
  Template1SecondaryWorkItem,
}

export interface Template1WorkSectionProps {
  data?: Template1WorkData
  onCtaClick?: () => void
  onModalSubmit?: (values: Template1LeadFormValues) => Promise<void> | void
  className?: string
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.5 10.5L10.5 3.5M10.5 3.5H4.5M10.5 3.5V9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProjectCard({ project }: { project: Template1SecondaryWorkItem }) {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#F3F2EE] p-3.5 sm:p-5 md:p-6 rounded-[4px] mb-3.5 sm:mb-4">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-white shadow-sm">
          <Image
            src={project.image}
            alt={project.imageAlt || project.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] font-semibold text-[#161617]">
          {project.href ? (
            <Link
              href={project.href}
              className="hover:underline inline-flex items-center gap-1.5"
            >
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>
        <ArrowUpRightIcon className="text-[#161617]/60 shrink-0" />
      </div>

      <p className="text-[11px] sm:text-[11.5px] text-[#161617]/50 mt-0.5">
        {project.category}
      </p>

      <div className="my-3 sm:my-3.5 border-t border-black/12" />

      {project.narrativeHtml ? (
        <div
          className="work-project-narrative text-[12px] sm:text-[12.5px] md:text-[13px] leading-[1.55] text-[#161617]/75 space-y-1 [&_strong]:font-medium [&_strong]:text-[#161617]/85 [&_p]:mb-1 last:[&_p]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_a]:text-primary [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: project.narrativeHtml }}
        />
      ) : (
        <>
          {project.statusNote && (
            <p className="text-[10.5px] sm:text-[11px] text-[#161617]/45 mb-1">
              {project.statusNote}
            </p>
          )}
          {project.challenge && (
            <p className="text-[12px] sm:text-[12.5px] md:text-[13px] leading-[1.55] text-[#161617]/75">
              <span className="font-medium text-[#161617]/85">
                Challenge:
              </span>{" "}
              {project.challenge}
            </p>
          )}
          {project.approach && (
            <p className="text-[12px] sm:text-[12.5px] md:text-[13px] leading-[1.55] text-[#161617]/75 mt-0.5">
              <span className="font-medium text-[#161617]/85">
                Approach:
              </span>{" "}
              {project.approach}
            </p>
          )}
        </>
      )}
    </div>
  )
}

function ProjectsCarousel({
  projects,
}: {
  projects: Template1SecondaryWorkItem[]
}) {
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
    <div className="relative pt-6 sm:pt-8">
      {/* Desktop Left Navigation Arrow */}
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous projects"
        className="hidden sm:flex absolute -left-5 md:-left-6 lg:-left-6 xl:-left-13 top-[38%] -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-black/10 bg-white/95 text-[#161617] shadow-md hover:bg-[#161617] hover:text-[#FCC50E] hover:border-[#161617] hover:scale-105 disabled:opacity-20 disabled:pointer-events-none transition-all items-center justify-center cursor-pointer active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Desktop Right Navigation Arrow */}
      <button
        type="button"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next projects"
        className="hidden sm:flex absolute -right-5 md:-right-6 lg:-right-6 xl:-right-13 top-[38%] -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-black/10 bg-white/95 text-[#161617] shadow-md hover:bg-[#161617] hover:text-[#FCC50E] hover:border-[#161617] hover:scale-105 disabled:opacity-20 disabled:pointer-events-none transition-all items-center justify-center cursor-pointer active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Embla Viewport */}
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
        ref={emblaRef}
      >
        <div className="flex -ml-6 sm:-ml-8 md:-ml-8 lg:-ml-10">
          {projects.map((project) => (
            <div
              key={project.id}
              className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 pl-6 sm:pl-8 md:pl-8 lg:pl-10"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Bottom Dots & Mobile Navigation */}
      {scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-3 sm:gap-1.5 mt-6 sm:mt-8">
          {/* Mobile Left Navigation Arrow */}
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous projects"
            className="flex sm:hidden w-8 h-8 rounded-full border border-black/10 bg-white text-[#161617] shadow-sm hover:bg-[#161617] hover:text-[#FCC50E] active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {scrollSnaps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollTo(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === selectedIndex
                    ? "w-7 bg-[#161617]"
                    : "w-2 bg-black/20 hover:bg-black/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Mobile Right Navigation Arrow */}
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next projects"
            className="flex sm:hidden w-8 h-8 rounded-full border border-black/10 bg-white text-[#161617] shadow-sm hover:bg-[#161617] hover:text-[#FCC50E] active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export function Template1WorkSection({
  data,
  onCtaClick,
  onModalSubmit,
  className = "",
}: Template1WorkSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const content = {
    ...defaultTemplate1WorkData,
    ...data,
    featured: {
      ...defaultTemplate1WorkData.featured,
      ...(data?.featured ?? {}),
    },
    projects: data?.projects ?? defaultTemplate1WorkData.projects,
  }

  const headlineLines = content.headline.split("\n")
  const narrativeHeadlineLines =
    content.featured.narrativeHeadline.split("\n")

  const handleCtaButtonClick = () => {
    if (onCtaClick) {
      onCtaClick()
      return
    }
    setIsModalOpen(true)
  }

  return (
    <>
      <section className={`w-full bg-white text-[#161617] py-12 ${className}`}>
        <div className="mx-auto w-full max-w-[1200px] xl:max-w-[1320px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          {/* Section Header */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            {content.overline && (
              <p className="text-[10px] sm:text-[10.5px] md:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#161617]/55 mb-2 sm:mb-2.5">
                {content.overline}
              </p>
            )}
            <h2 className="text-[28px] sm:text-[34px] md:text-[38px] lg:text-[44px] xl:text-[50px] 2xl:text-[54px] font-semibold leading-[1.14] tracking-[-0.02em] text-[#161617]">
              {headlineLines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>

          {/* Featured Project Row */}
          <div className="pt-2 sm:pt-4 pb-8 sm:pb-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-8 lg:gap-10 xl:gap-12 items-start">
              {/* Featured Image Box */}
              <div className="md:col-span-6 lg:col-span-7 bg-[#F3F2EE] p-4 sm:p-6 md:p-6 lg:p-8 rounded-[4px]">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] bg-white shadow-sm">
                  <Image
                    src={content.featured.image}
                    alt={content.featured.imageAlt || content.featured.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Featured Narrative Details */}
              <div className="md:col-span-6 lg:col-span-5">
                <p className="text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-[#161617]/45">
                  {content.featured.badge}
                </p>
                <h3 className="mt-1 sm:mt-1.5 text-[22px] sm:text-[24px] md:text-[25px] lg:text-[27px] font-semibold tracking-[-0.01em] text-[#161617]">
                  {content.featured.title}
                </h3>
                <div className="mt-1 text-[11.5px] sm:text-[12px] leading-[1.45] text-[#161617]/55">
                  <p>{content.featured.industry}</p>
                  <p>{content.featured.serviceType}</p>
                </div>

                <div className="my-4 sm:my-5 border-t border-black/12" />

                <p className="text-[9px] sm:text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#161617]/45">
                  {content.featured.narrativeLabel}
                </p>
                <h4 className="mt-1 sm:mt-1.5 mb-4 sm:mb-5 text-[18px] sm:text-[20px] md:text-[21px] lg:text-[22px] xl:text-[24px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#161617]">
                  {narrativeHeadlineLines.map((line, idx) => (
                    <span key={idx} className="block">
                      {line}
                    </span>
                  ))}
                </h4>

                {content.featured.narrativeHtml ? (
                  <div
                    className="featured-work-narrative text-[12.5px] sm:text-[13px] md:text-[13.5px] leading-[1.55] text-[#161617]/80 space-y-2 [&_strong]:font-medium [&_strong]:text-[#161617] [&_p]:mb-1.5 last:[&_p]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_a]:text-[#FCC50E] [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: content.featured.narrativeHtml }}
                  />
                ) : (
                  <div className="space-y-3.5 sm:space-y-4">
                    <div>
                      <p className="text-[10.5px] sm:text-[11px] font-medium text-[#161617]/45 mb-0.5">
                        {content.featured.challengeLabel || "Challenge"}
                      </p>
                      <p className="text-[12.5px] sm:text-[13px] md:text-[13.5px] leading-[1.55] text-[#161617]/80">
                        {content.featured.challengeText}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10.5px] sm:text-[11px] font-medium text-[#161617]/45 mb-0.5">
                        {content.featured.approachLabel || "Approach"}
                      </p>
                      <p className="text-[12.5px] sm:text-[13px] md:text-[13.5px] leading-[1.55] text-[#161617]/80">
                        {content.featured.approachText}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10.5px] sm:text-[11px] font-medium text-[#161617]/45 mb-0.5">
                        {content.featured.evidenceLabel || "Evidence"}
                      </p>
                      <p className="text-[12px] sm:text-[12.5px] md:text-[13px] leading-[1.55] text-[#161617]/60">
                        {content.featured.evidenceText}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Projects: Dynamic carousel if > 2, otherwise 2-column grid */}
          {content.projects.length > 0 &&
            (content.projects.length > 2 ? (
              <ProjectsCarousel projects={content.projects} />
            ) : (
              <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 sm:gap-8 md:gap-8 lg:gap-10">
                {content.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ))}

          {/* Bottom CTA & Disclaimer */}
          <div className="mt-8 sm:mt-10 md:mt-12">
            {content.ctaText && (
              <div className="w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCtaButtonClick}
                  className="w-full sm:w-auto flex sm:inline-flex items-center justify-center gap-2.5 sm:gap-3 rounded-[4px] bg-[#161617] px-5 sm:px-6 py-3.5 sm:py-3.5 text-[13px] sm:text-[13px] font-medium text-[#FCC50E] transition-colors hover:bg-[#2a2a2c]"
                >
                  <span className="text-[#FCC50E]">{content.ctaText}</span>
                  <ArrowUpRightIcon className="text-[#FCC50E]" />
                </button>
              </div>
            )}

            {content.disclaimer && (
              <p className="mt-4 sm:mt-5 text-[10.5px] sm:text-[11px] leading-[1.5] text-[#161617]/45 max-w-[620px]">
                {content.disclaimer}
              </p>
            )}
          </div>
        </div>
      </section>

      <Template1ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFormSubmit={onModalSubmit}
      />
    </>
  )
}
