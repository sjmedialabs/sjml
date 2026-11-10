import React from "react"
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

        {/* 4-Column Steps Grid: 1 col on mobile, 2 col on sm & md, 4 col on lg & up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 md:gap-8 lg:gap-8 xl:gap-10">
          {content.steps.map((step) => (
            <div
              key={step.id}
              style={{ borderTopColor: "rgba(255, 255, 255, 0.14)" }}
              className="border-t pt-4 sm:pt-5 flex flex-col"
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
          ))}
        </div>
      </div>
    </section>
  )
}
