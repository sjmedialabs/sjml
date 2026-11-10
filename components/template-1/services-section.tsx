"use client"

import React, { useState } from "react"
import {
  type Template1ServicesData,
  type Template1ServiceItem,
  type Template1LeadFormValues,
  defaultTemplate1ServicesData,
} from "./default-data"
import { Template1ConsultationModal } from "./consultation-modal"

export type { Template1ServicesData, Template1ServiceItem }

export interface Template1ServicesSectionProps {
  data?: Template1ServicesData
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

export function Template1ServicesSection({
  data,
  onCtaClick,
  onModalSubmit,
  className = "",
}: Template1ServicesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const content = {
    ...defaultTemplate1ServicesData,
    ...data,
    services: data?.services ?? defaultTemplate1ServicesData.services,
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
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-8">
            {content.overline && (
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#161617]/55 mb-2.5">
                {content.overline}
              </p>
            )}
            <h2 className="text-[30px] sm:text-[38px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#161617] mb-3">
              {headlineLines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h2>
            {content.subtitle && (
              <p className="text-[13.5px] sm:text-[14px] text-[#161617]/65">
                {content.subtitle}
              </p>
            )}
          </div>

          {/* Services Rows */}
          <div className="divide-y divide-black/12 border-t border-b border-black/12">
            {content.services.map((service) => {
              const titleLines = service.title.split("\n")
              return (
                <div
                  key={service.id}
                  className="grid grid-cols-1 gap-4 py-6 sm:py-7 lg:grid-cols-12 lg:gap-8 items-start"
                >
                  {/* Number */}
                  <div className="lg:col-span-1">
                    <span className="text-[20px] sm:text-[40px] font-medium leading-none text-[#161617]/40">
                      {service.number}
                    </span>
                  </div>

                  {/* Title & Tags */}
                  <div className="lg:col-span-5">
                    <h3 className="text-[19px] sm:text-[21px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#161617]">
                      {titleLines.map((line, index) => (
                        <span key={index} className="block">
                          {line}
                        </span>
                      ))}
                    </h3>
                    {service.tags && (
                      <p className="mt-2.5 text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] text-[#161617]/45">
                        {service.tags}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-6">
                    <p className="text-[13.5px] sm:text-[14px] leading-[1.6] text-[#161617]/70 max-w-[480px]">
                      {service.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom CTA Button */}
          {content.ctaText && (
            <div className="mt-8">
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
      </section>

      <Template1ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFormSubmit={onModalSubmit}
      />
    </>
  )
}
