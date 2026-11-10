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
      <div className="mx-auto w-full max-w-[1200px] xl:max-w-[1320px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 md:items-end gap-8 sm:gap-10 md:gap-10 lg:gap-12 xl:gap-16">
          {/* Left Overline & Heading */}
          <div className="md:col-span-6 lg:col-span-7 xl:col-span-7">
            {content.overline && (
              <p className="text-[10px] sm:text-[10.5px] md:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#161617]/55 mb-2.5 sm:mb-3">
                {content.overline}
              </p>
            )}
            <h2 className="text-[26px] sm:text-[32px] md:text-[36px] lg:text-[42px] xl:text-[48px] 2xl:text-[54px] font-semibold leading-[1.14] tracking-[-0.02em] text-[#161617]">
              {headlineLines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>

          {/* Right Stats */}
          <div className="md:col-span-6 lg:col-span-5 xl:col-span-5 grid grid-cols-2 gap-6 sm:gap-8 md:gap-8 lg:gap-12">
            {content.stats.map((stat) => (
              <div key={stat.id} className="flex flex-col">
                <span className="text-[36px] sm:text-[44px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[70px] font-semibold leading-none tracking-[-0.02em] text-[#161617]">
                  {stat.value}
                </span>
                <span className="mt-2 sm:mt-2.5 text-[12px] sm:text-[13px] md:text-[13.5px] lg:text-[14px] font-normal text-[#161617]/60">
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
