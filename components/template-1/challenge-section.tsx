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
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Overline */}
        {content.overline && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#FCC50E] mb-5">
            {content.overline}
          </p>
        )}

        {/* Top Two-Column Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-6">
            <h2 className="text-[36px] sm:text-[44px] lg:text-[48px] font-medium leading-[1.12] tracking-[-0.02em] text-white mb-7">
              {headlineLines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h2>
            {content.highlightText && (
              <p className="text-[14px] sm:text-[15px] font-normal leading-[1.6] text-[#FCC50E]">
                {highlightLines.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </p>
            )}
          </div>

          {/* Right Column: Challenge List */}
          <div className="lg:col-span-6">
            {content.items.map((item) => (
              <div
                key={item.id}
                style={{ borderTopColor: "rgba(255, 255, 255, 0.14)" }}
                className="border-t py-6 first:pt-5 last:pb-2 flex items-start gap-4 sm:gap-5"
              >
                <span className="text-[11px] font-semibold tracking-[0.08em] text-[#FCC50E] pt-1 shrink-0">
                  {item.number}
                </span>
                <div>
                  <h3 className="text-[18px] sm:text-[19px] font-medium leading-[1.3] text-white mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-[13.5px] sm:text-[14px] leading-[1.55] text-white/65">
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
            className="mt-10 border-t pt-8 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8 items-start"
          >
            <div className="lg:col-span-3 pt-1.5">
              {content.bottomLabel && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#FCC50E]">
                  {content.bottomLabel}
                </span>
              )}
            </div>
            <div className="lg:col-span-9">
              {content.bottomStatement && (
                <p className="text-[20px] sm:text-[23px] lg:text-[25px] font-normal leading-[1.42] tracking-[-0.01em] text-white/95">
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
