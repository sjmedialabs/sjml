import React from "react"
import Image from "next/image"
import {
  type Template1ClientsData,
  type Template1ClientItem,
  defaultTemplate1ClientsData,
} from "./default-data"

export type { Template1ClientsData, Template1ClientItem }

export interface Template1ClientsSectionProps {
  data?: Template1ClientsData
  className?: string
}

function ClientLogoFallback({ client }: { client: Template1ClientItem }) {
  if (client.variant === "badge-navy") {
    return (
      <div className="flex h-10 sm:h-12 w-20 sm:w-24 flex-col items-center justify-center rounded-[2px] bg-[#1D2545] px-2 text-center shadow-xs">
        <span className="text-[7px] sm:text-[7.5px] font-bold tracking-[0.08em] text-[#FCC50E]">
          {client.name}
        </span>
        {client.subtext && (
          <span className="mt-0.5 text-[5px] sm:text-[5.5px] tracking-[0.06em] text-white/80">
            {client.subtext}
          </span>
        )}
      </div>
    )
  }

  if (client.variant === "badge-light") {
    return (
      <div className="flex h-10 sm:h-12 w-20 sm:w-24 flex-col items-center justify-center rounded-[2px] bg-white px-2 text-center shadow-xs border border-black/5">
        <span className="h-2 sm:h-2.5 w-2 sm:w-2.5 rotate-45 bg-[#E63946]/85 mb-1" />
        <span className="text-[6px] sm:text-[6.5px] font-bold tracking-[0.08em] text-[#161617]/80">
          {client.name}
        </span>
      </div>
    )
  }

  if (client.variant === "badge-gar") {
    return (
      <div className="flex h-10 sm:h-12 w-18 sm:w-20 flex-col items-center justify-center rounded-[2px] bg-white px-2 text-center shadow-xs border border-black/5">
        <div className="flex items-end gap-0.5 mb-0.5">
          <span className="h-2 sm:h-2.5 w-1 bg-[#1D3557]" />
          <span className="h-3 sm:h-3.5 w-1 bg-[#457B9D]" />
          <span className="h-1.5 sm:h-2 w-1 bg-[#1D3557]" />
        </div>
        <span className="text-[9px] sm:text-[10px] font-extrabold tracking-[0.06em] text-[#1D3557] leading-none">
          {client.name}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start">
      <span className="text-[17px] sm:text-[20px] md:text-[22px] font-semibold tracking-[-0.03em] text-[#161617] leading-none">
        {client.name}
      </span>
      {client.subtext && (
        <span className="mt-0.5 sm:mt-1 text-[6.5px] sm:text-[7px] font-semibold uppercase tracking-[0.28em] text-[#161617]/55 pl-0.5">
          {client.subtext}
        </span>
      )}
    </div>
  )
}

export function Template1ClientsSection({
  data,
  className = "",
}: Template1ClientsSectionProps) {
  const content = {
    ...defaultTemplate1ClientsData,
    ...data,
    clients: data?.clients ?? defaultTemplate1ClientsData.clients,
  }

  const isMarquee = content.clients.length > 4

  // For automatic horizontal scrolling when > 4 brands:
  // Ensure enough items in each half of the marquee track to fill wide viewports seamlessly
  const repeatCount = Math.max(1, Math.ceil(8 / Math.max(1, content.clients.length)))
  const halfList = Array.from({ length: repeatCount }, () => content.clients).flat()
  const marqueeItems = [...halfList, ...halfList]
  const durationSeconds = Math.max(20, halfList.length * 3.5)

  return (
    <section
      className={`w-full bg-[#F7F6F2] text-[#161617] py-12 ${className}`}
    >
      <div className="mx-auto w-full max-w-[1200px] xl:max-w-[1320px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Top Header & Stat Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:items-end gap-6 sm:gap-8 md:gap-10 lg:gap-12 pb-6 sm:pb-8 border-b border-black/12">
          <div className="md:col-span-8">
            {content.overline && (
              <p className="text-[10px] sm:text-[10.5px] md:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#161617]/55 mb-2 sm:mb-2.5">
                {content.overline}
              </p>
            )}
            <h2 className="text-[26px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[42px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#161617]">
              {content.headline}
            </h2>
          </div>

          <div className="md:col-span-4 flex flex-col md:items-end">
            <div className="flex flex-col">
              <span className="text-[36px] sm:text-[44px] md:text-[48px] lg:text-[56px] xl:text-[64px] font-semibold leading-none tracking-[-0.02em] text-[#161617]">
                {content.statValue}
              </span>
              <span className="mt-2 sm:mt-2.5 text-[11.5px] sm:text-[12px] md:text-[13px] text-[#161617]/60">
                {content.statLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Client Logos Row: static grid if <= 4, automatic marquee if > 4 */}
        {isMarquee ? (
          <div className="pt-6 sm:pt-8 md:pt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div
              className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]"
              style={{ animationDuration: `${durationSeconds}s` }}
            >
              {marqueeItems.map((client, index) => (
                <div
                  key={`${client.id}-${index}`}
                  className="flex shrink-0 items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12"
                >
                  {client.logoUrl ? (
                    <Image
                      src={client.logoUrl}
                      alt={client.name}
                      width={160}
                      height={56}
                      className="max-h-9 sm:max-h-11 md:max-h-12 w-auto object-contain select-none"
                      draggable={false}
                    />
                  ) : (
                    <ClientLogoFallback client={client} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="pt-6 sm:pt-8 md:pt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 md:gap-8 items-center">
            {content.clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-center"
              >
                {client.logoUrl ? (
                  <Image
                    src={client.logoUrl}
                    alt={client.name}
                    width={160}
                    height={56}
                    className="max-h-9 sm:max-h-11 md:max-h-12 w-auto object-contain"
                  />
                ) : (
                  <ClientLogoFallback client={client} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
