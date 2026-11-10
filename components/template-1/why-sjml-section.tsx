"use client"

import React, { useState } from "react"
import Image from "next/image"
import {
  type Template1WhySjmlData,
  type Template1WhySjmlPoint,
  type Template1LeadFormValues,
  defaultTemplate1WhySjmlData,
} from "./default-data"
import { Template1ConsultationModal } from "./consultation-modal"

export type { Template1WhySjmlData, Template1WhySjmlPoint }

export interface Template1WhySjmlSectionProps {
  data?: Template1WhySjmlData
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

export function Template1WhySjmlSection({
  data,
  onCtaClick,
  onModalSubmit,
  className = "",
}: Template1WhySjmlSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const content = {
    ...defaultTemplate1WhySjmlData,
    ...data,
    points: data?.points ?? defaultTemplate1WhySjmlData.points,
  }

  const headlineLines = content.headline.split("\n")

  const handleCtaButtonClick = () => {
    if (onCtaClick) {
      onCtaClick()
      return
    }
    setIsModalOpen(true)
  }

  return (
    <>
      <section
        className={`w-full bg-[#F7F6F2] text-[#161617] py-12 ${className}`}
      >
        <div className="mx-auto w-full max-w-[1200px] xl:max-w-[1320px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-10 lg:gap-12 xl:gap-16 items-start">
            {/* Left Column: Heading, Image, Caption, CTA */}
            <div className="md:col-span-5 lg:col-span-5">
              {content.overline && (
                <p className="text-[10px] sm:text-[10.5px] md:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#161617]/55 mb-2 sm:mb-2.5">
                  {content.overline}
                </p>
              )}
              <h2 className="text-[28px] sm:text-[34px] md:text-[38px] lg:text-[44px] xl:text-[50px] font-semibold leading-[1.14] tracking-[-0.02em] text-[#161617] mb-5 sm:mb-6">
                {headlineLines.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </h2>

              {content.image && (
                <div className="p-3 sm:p-4 rounded-[4px] mb-2 sm:mb-3">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px]">
                    <Image
                      src={content.image}
                      alt={content.imageAlt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {content.imageCaption && (
                <p className="text-[9px] sm:text-[9.5px] md:text-[10px] font-semibold uppercase tracking-[0.14em] text-[#161617]/45 mb-5 sm:mb-6">
                  {content.imageCaption}
                </p>
              )}

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
            </div>

            {/* Right Column: Numbered Points */}
            <div className="md:col-span-7 lg:col-span-7 divide-y divide-black/12 border-t border-black/12 md:mt-2 lg:mt-4">
              {content.points.map((point) => (
                <div key={point.id} className="py-5 sm:py-6 first:pt-4 sm:first:pt-5 last:pb-2">
                  <span className="block text-[9.5px] sm:text-[10px] font-semibold tracking-[0.12em] text-[#161617]/40 mb-1 sm:mb-1.5">
                    {point.number}
                  </span>
                  <h3 className="text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] font-semibold text-[#161617] mb-1 sm:mb-1.5">
                    {point.title}
                  </h3>
                  <p className="text-[13px] sm:text-[13.5px] md:text-[14px] leading-[1.55] text-[#161617]/65">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
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
