"use client"

import React, { useState } from "react"
import {
  type Template1FaqData,
  type Template1FaqItem,
  type Template1LeadFormValues,
  defaultTemplate1FaqData,
} from "./default-data"
import { Template1ConsultationModal } from "./consultation-modal"

export type { Template1FaqData, Template1FaqItem }

export interface Template1FaqSectionProps {
  data?: Template1FaqData
  onCtaClick?: () => void
  onModalSubmit?: (values: Template1LeadFormValues) => Promise<void> | void
  defaultOpenId?: string | null
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

export function Template1FaqSection({
  data,
  onCtaClick,
  onModalSubmit,
  defaultOpenId,
  className = "",
}: Template1FaqSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const content = {
    ...defaultTemplate1FaqData,
    ...data,
    faqs: data?.faqs ?? defaultTemplate1FaqData.faqs,
  }

  const initialOpen =
    defaultOpenId !== undefined
      ? defaultOpenId
      : content.faqs[0]?.id ?? null

  const [openId, setOpenId] = useState<string | null>(initialOpen)

  const headlineLines = content.headline.split("\n")
  const subtitleLines = content.subtitle.split("\n")

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

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
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
            {/* Left Column */}
            <div className="lg:col-span-5">
              {content.overline && (
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#161617]/55 mb-2.5">
                  {content.overline}
                </p>
              )}
              <h2 className="text-[30px] sm:text-[38px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#161617] mb-4">
                {headlineLines.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              {content.subtitle && (
                <p className="text-[13.5px] leading-[1.6] text-[#161617]/65 mb-6">
                  {subtitleLines.map((line, index) => (
                    <span key={index} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              )}

              {content.ctaText && (
                <div>
                  <button
                    type="button"
                    onClick={handleCtaButtonClick}
                    className="inline-flex items-center gap-3 rounded-[4px] bg-[#161617] px-5 py-3 text-[13px] font-medium text-[#FCC50E] transition-colors hover:bg-[#2a2a2c]"
                  >
                    <span className="text-[#FCC50E]">{content.ctaText}</span>
                    <ArrowUpRightIcon className="text-[#FCC50E]" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Accordion */}
            <div className="lg:col-span-7 divide-y divide-black/12 border-t border-b border-black/12">
              {content.faqs.map((faq) => {
                const isOpen = openId === faq.id
                return (
                  <div key={faq.id} className="py-4 sm:py-5">
                    <button
                      type="button"
                      onClick={() => toggleItem(faq.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 text-left focus:outline-none group"
                    >
                      <span className="text-[14px] sm:text-[15px] font-semibold text-[#161617] group-hover:text-[#161617]/80 transition-colors">
                        {faq.question}
                      </span>
                      <span className="text-[18px] font-normal leading-none text-[#161617]/60 shrink-0 select-none">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="mt-2.5 pr-6">
                        <p className="text-[13px] leading-[1.6] text-[#161617]/65">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
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
