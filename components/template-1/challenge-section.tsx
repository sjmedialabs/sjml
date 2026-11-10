import React from "react"
import {
  type Template1ChallengeData,
  type Template1ChallengeItem,
  defaultTemplate1ChallengeData,
} from "./default-data"

export type { Template1ChallengeData, Template1ChallengeItem }

export interface Template1ChallengeSectionProps {
  data?: Template1ChallengeData
  className?: string
}

export function Template1ChallengeSection({
  data,
  className = "",
}: Template1ChallengeSectionProps) {
  const content = {
    ...defaultTemplate1ChallengeData,
    ...data,
    items: data?.items ?? defaultTemplate1ChallengeData.items,
  }

  const headlineLines = content.headline.split("\n")
  const highlightLines = content.highlightText.split("\n")

  return (
    <section
      className={`w-full bg-[#141415] text-white py-12 ${className}`}
    >
      <div className="mx-auto w-full max-w-[1200px] xl:max-w-[1320px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Overline */}
        {content.overline && (
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#FCC50E] mb-4 sm:mb-5">
            {content.overline}
          </p>
        )}

        {/* Top Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-10 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column */}
          <div className="md:col-span-6 lg:col-span-6 xl:col-span-6">
            <h2 className="text-[30px] sm:text-[38px] md:text-[42px] lg:text-[48px] xl:text-[54px] 2xl:text-[60px] font-medium leading-[1.12] tracking-[-0.02em] text-white mb-5 sm:mb-7">
              {headlineLines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h2>
            {content.highlightText && (
              <p className="text-[14px] sm:text-[15px] md:text-[15.5px] lg:text-[16px] xl:text-[17px] font-normal leading-[1.6] text-[#FCC50E]">
                {highlightLines.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </p>
            )}
          </div>

          {/* Right Column: Challenge List */}
          <div className="md:col-span-6 lg:col-span-6 xl:col-span-6">
            {content.items.map((item) => (
              <div
                key={item.id}
                style={{ borderTopColor: "rgba(255, 255, 255, 0.14)" }}
                className="border-t py-5 sm:py-6 first:pt-4 sm:first:pt-5 last:pb-2 flex items-start gap-3.5 sm:gap-4 md:gap-5"
              >
                <span className="text-[10.5px] sm:text-[11px] font-semibold tracking-[0.08em] text-[#FCC50E] pt-1 shrink-0">
                  {item.number}
                </span>
                <div>
                  <h3 className="text-[17px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-medium leading-[1.3] text-white mb-1 sm:mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-[13px] sm:text-[13.5px] md:text-[14px] leading-[1.55] text-white/65">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Statement Row */}
        {(content.bottomLabel || content.bottomStatement) && (
          <div
            style={{ borderTopColor: "rgba(255, 255, 255, 0.14)" }}
            className="mt-8 sm:mt-10 md:mt-12 border-t pt-6 sm:pt-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start"
          >
            <div className="md:col-span-3 lg:col-span-3 pt-1">
              {content.bottomLabel && (
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-[#FCC50E]">
                  {content.bottomLabel}
                </span>
              )}
            </div>
            <div className="md:col-span-9 lg:col-span-9">
              {content.bottomStatement && (
                <p className="text-[18px] sm:text-[21px] md:text-[23px] lg:text-[25px] xl:text-[28px] font-normal leading-[1.42] tracking-[-0.01em] text-white/95">
                  {content.bottomStatement}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
