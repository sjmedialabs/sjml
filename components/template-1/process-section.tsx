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
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10">
          {content.overline && (
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#FCC50E] mb-3">
              {content.overline}
            </p>
          )}
          <h2 className="text-[30px] sm:text-[38px] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
            {headlineLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        {/* 4-Column Steps Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {content.steps.map((step) => (
            <div
              key={step.id}
              style={{ borderTopColor: "rgba(255, 255, 255, 0.14)" }}
              className="border-t pt-5 flex flex-col"
            >
              <span className="text-[28px] sm:text-[32px] font-semibold leading-none tracking-[-0.02em] text-[#FCC50E] mb-3">
                {step.number}
              </span>
              <h3 className="text-[17px] sm:text-[18px] font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-[13px] leading-[1.55] text-white/60">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
