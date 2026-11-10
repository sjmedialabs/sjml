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
      <div className="flex h-12 w-24 flex-col items-center justify-center rounded-[2px] bg-[#1D2545] px-2 text-center shadow-xs">
        <span className="text-[7.5px] font-bold tracking-[0.08em] text-[#FCC50E]">
          {client.name}
        </span>
        {client.subtext && (
          <span className="mt-0.5 text-[5.5px] tracking-[0.06em] text-white/80">
            {client.subtext}
          </span>
        )}
      </div>
    )
  }

  if (client.variant === "badge-light") {
    return (
      <div className="flex h-12 w-24 flex-col items-center justify-center rounded-[2px] bg-white px-2 text-center shadow-xs border border-black/5">
        <span className="h-2.5 w-2.5 rotate-45 bg-[#E63946]/85 mb-1" />
        <span className="text-[6.5px] font-bold tracking-[0.08em] text-[#161617]/80">
          {client.name}
        </span>
      </div>
    )
  }

  if (client.variant === "badge-gar") {
    return (
      <div className="flex h-12 w-20 flex-col items-center justify-center rounded-[2px] bg-white px-2 text-center shadow-xs border border-black/5">
        <div className="flex items-end gap-0.5 mb-0.5">
          <span className="h-2.5 w-1 bg-[#1D3557]" />
          <span className="h-3.5 w-1 bg-[#457B9D]" />
          <span className="h-2 w-1 bg-[#1D3557]" />
        </div>
        <span className="text-[10px] font-extrabold tracking-[0.06em] text-[#1D3557] leading-none">
          {client.name}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start">
      <span className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.03em] text-[#161617] leading-none">
        {client.name}
      </span>
      {client.subtext && (
        <span className="mt-1 text-[7px] font-semibold uppercase tracking-[0.28em] text-[#161617]/55 pl-0.5">
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
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Top Header & Stat Row */}
        <div className="grid grid-cols-1 items-end gap-8 pb-8 border-b border-black/12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            {content.overline && (
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#161617]/55 mb-2.5">
                {content.overline}
              </p>
            )}
            <h2 className="text-[28px] sm:text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#161617]">
              {content.headline}
            </h2>
          </div>

          <div className="lg:col-span-4 flex flex-col">
            <span className="text-[40px] sm:text-[48px] font-semibold leading-none tracking-[-0.02em] text-[#161617]">
              {content.statValue}
            </span>
            <span className="mt-2.5 text-[12px] text-[#161617]/60">
              {content.statLabel}
            </span>
          </div>
        </div>

        {/* Bottom Client Logos Row: static 4-column grid if <= 4, automatic marquee if > 4 */}
        {isMarquee ? (
          <div className="pt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div
              className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]"
              style={{ animationDuration: `${durationSeconds}s` }}
            >
              {marqueeItems.map((client, index) => (
                <div
                  key={`${client.id}-${index}`}
                  className="flex shrink-0 items-center justify-center px-6 sm:px-10 md:px-12"
                >
                  {client.logoUrl ? (
                    <Image
                      src={client.logoUrl}
                      alt={client.name}
                      width={150}
                      height={52}
                      className="max-h-12 w-auto object-contain select-none"
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
          <div className="pt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8 items-center">
            {content.clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-start sm:justify-center first:justify-start"
              >
                {client.logoUrl ? (
                  <Image
                    src={client.logoUrl}
                    alt={client.name}
                    width={150}
                    height={52}
                    className="max-h-12 w-auto object-contain"
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
