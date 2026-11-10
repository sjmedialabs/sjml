"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
              </div>
            </div>
          </div>

          {/* Secondary Projects Grid */}
          {content.projects.length > 0 && (
            <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 sm:gap-8 md:gap-8 lg:gap-10">
              {content.projects.map((project) => (
                <div key={project.id} className="flex flex-col">
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

                  {project.statusNote && (
                    <p className="text-[10.5px] sm:text-[11px] text-[#161617]/45 mb-1">
                      {project.statusNote}
                    </p>
                  )}
                  <p className="text-[12px] sm:text-[12.5px] md:text-[13px] leading-[1.55] text-[#161617]/75">
                    <span className="font-medium text-[#161617]/85">
                      Challenge:
                    </span>{" "}
                    {project.challenge}
                  </p>
                  <p className="text-[12px] sm:text-[12.5px] md:text-[13px] leading-[1.55] text-[#161617]/75 mt-0.5">
                    <span className="font-medium text-[#161617]/85">
                      Approach:
                    </span>{" "}
                    {project.approach}
                  </p>
                </div>
              ))}
            </div>
          )}

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
