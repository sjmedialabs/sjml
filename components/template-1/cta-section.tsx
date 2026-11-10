"use client"

import React, { useState } from "react"
import {
  type Template1CtaData,
  type Template1LeadFormValues,
  defaultTemplate1CtaData,
} from "./default-data"
import { Template1ConsultationModal } from "./consultation-modal"

export type { Template1CtaData }

export interface Template1CtaSectionProps {
  data?: Template1CtaData
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

export function Template1CtaSection({
  data,
  onCtaClick,
  onModalSubmit,
  className = "",
}: Template1CtaSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const content = {
    ...defaultTemplate1CtaData,
    ...data,
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
        className={`w-full bg-[#FCC50E] text-[#161617] py-12 ${className}`}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          {/* Overline */}
          {content.overline && (
            <div className="mb-5">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#161617]/80">
                {content.overline}
              </span>
            </div>
          )}

          {/* Headline */}
          <h2 className="text-[38px] sm:text-[48px] lg:text-[58px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#161617]">
            {headlineLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h2>

          {/* Bottom Subtitle & CTA Row */}
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {content.subtitle && (
              <p className="text-[14px] sm:text-[15px] leading-[1.6] text-[#161617]/80 max-w-[560px]">
                {content.subtitle}
              </p>
            )}

            {content.ctaText && (
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={handleCtaButtonClick}
                  className="inline-flex items-center gap-3 rounded-[4px] bg-[#161617] px-6 py-3.5 text-[13px] font-medium text-[#FCC50E] transition-colors hover:bg-[#2a2a2c]"
                >
                  <span className="text-[#FCC50E]">{content.ctaText}</span>
                  <ArrowUpRightIcon className="text-[#FCC50E]" />
                </button>
              </div>
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
