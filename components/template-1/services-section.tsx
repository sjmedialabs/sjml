"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
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

function ServiceRow({ service }: { service: Template1ServiceItem }) {
  const titleLines = service.title.split("\n")
  return (
    <div
      key={service.id}
      className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:gap-6 lg:gap-8 py-5 sm:py-6 md:py-7 lg:py-8 items-start"
    >
      {/* Number */}
      <div className="md:col-span-1">
        <span className="text-[22px] sm:text-[28px] md:text-[34px] lg:text-[40px] font-medium leading-none text-[#161617]/40">
          {service.number}
        </span>
      </div>

      {/* Title & Tags */}
      <div className="md:col-span-5 lg:col-span-5">
        <h3 className="text-[18px] sm:text-[20px] md:text-[21px] lg:text-[22px] xl:text-[24px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#161617]">
          {titleLines.map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </h3>
        {service.tags && (
          <p className="mt-2 sm:mt-2.5 text-[9.5px] sm:text-[10px] md:text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#161617]/45">
            {service.tags}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="md:col-span-6 lg:col-span-6">
        <p className="text-[13px] sm:text-[13.5px] md:text-[14px] lg:text-[14.5px] leading-[1.6] text-[#161617]/70 max-w-[520px]">
          {service.description}
        </p>
      </div>
    </div>
  )
}

export function Template1ServicesSection({
  data,
  onCtaClick,
  onModalSubmit,
  className = "",
}: Template1ServicesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const content = {
    ...defaultTemplate1ServicesData,
    ...data,
    services: data?.services ?? defaultTemplate1ServicesData.services,
  }

  const headlineLines = content.headline.split("\n")
  const allServices = content.services
  const initialServices = allServices.slice(0, 4)
  const extraServices = allServices.slice(4)
  const hasMore = extraServices.length > 0

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
          {/* Section Header */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            {content.overline && (
              <p className="text-[10px] sm:text-[10.5px] md:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#161617]/55 mb-2 sm:mb-2.5">
                {content.overline}
              </p>
            )}
            <h2 className="text-[28px] sm:text-[34px] md:text-[38px] lg:text-[44px] xl:text-[50px] 2xl:text-[54px] font-semibold leading-[1.14] tracking-[-0.02em] text-[#161617] mb-2.5 sm:mb-3">
              {headlineLines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h2>
            {content.subtitle && (
              <p className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[15.5px] text-[#161617]/65 max-w-[680px]">
                {content.subtitle}
              </p>
            )}
          </div>

          {/* First 4 Services Rows */}
          <div className="divide-y divide-black/12 border-t border-b border-black/12">
            {initialServices.map((service) => (
              <ServiceRow key={service.id} service={service} />
            ))}
          </div>

          {/* Accordion for Additional Services (> 4) */}
          {hasMore && (
            <>
              <div
                id="additional-services-accordion"
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                  isExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0 pointer-events-none"
                }`}
                aria-hidden={!isExpanded}
              >
                <div className="overflow-hidden">
                  <div className="divide-y divide-black/12 border-b border-black/12">
                    {extraServices.map((service) => (
                      <ServiceRow key={service.id} service={service} />
                    ))}
                  </div>
                </div>
              </div>

              {/* See More / See Less Toggle Button */}
              <div className="mt-6 sm:mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  aria-expanded={isExpanded}
                  aria-controls="additional-services-accordion"
                  className="group inline-flex items-center gap-2 rounded-[4px] border border-black/15 bg-white px-5 sm:px-6 py-3 text-[13px] font-medium text-[#161617] transition-colors hover:bg-[#161617] hover:text-[#FCC50E] hover:border-[#161617] cursor-pointer"
                >
                  <span>{isExpanded ? "See Less" : "See More"}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      isExpanded
                        ? "rotate-180 text-inherit"
                        : "text-[#161617]/60 group-hover:text-[#FCC50E]"
                    }`}
                  />
                </button>
              </div>
            </>
          )}

          {/* Bottom CTA Button */}
          {content.ctaText && (
            <div className="mt-8 sm:mt-10 md:mt-12 w-full sm:w-auto">
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
      </section>

      <Template1ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFormSubmit={onModalSubmit}
      />
    </>
  )
}
