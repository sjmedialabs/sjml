import React from "react"
import {
  type Template1ExperienceData,
  type Template1StatItem,
  defaultTemplate1ExperienceData,
} from "./default-data"

export type { Template1ExperienceData, Template1StatItem }

export interface Template1ExperienceSectionProps {
  data?: Template1ExperienceData
  className?: string
}

export function Template1ExperienceSection({
  data,
  className = "",
}: Template1ExperienceSectionProps) {
  const content = {
    ...defaultTemplate1ExperienceData,
    ...data,
    stats: data?.stats ?? defaultTemplate1ExperienceData.stats,
  }

  const headlineLines = content.headline.split("\n")

  return (
    <section
      className={`w-full bg-[#F7F6F2] text-[#161617] py-12 ${className}`}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Overline & Heading */}
          <div className="lg:col-span-6">
            {content.overline && (
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#161617]/55 mb-2.5">
                {content.overline}
              </p>
            )}
            <h2 className="text-[28px] sm:text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#161617]">
              {headlineLines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>

          {/* Right Stats */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-8 sm:gap-12">
            {content.stats.map((stat) => (
              <div key={stat.id} className="flex flex-col">
                <span className="text-[40px] sm:text-[48px] font-semibold leading-none tracking-[-0.02em] text-[#161617]">
                  {stat.value}
                </span>
                <span className="mt-2.5 text-[12px] font-normal text-[#161617]/60">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
