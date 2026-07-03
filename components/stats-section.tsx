"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { HomeStat } from "@/lib/home-content"
import { isValidWorkImage } from "@/lib/work-detail"
import { STAT_ICON_PRESETS, isStatIconPreset } from "@/components/stats-icons"

function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true)
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const match = value.match(/^(\D*)([\d,.]+)(\D*)$/)
    if (!match) {
      setDisplay(value)
      return
    }
    const [, prefix, numStr, suffix] = match
    const target = parseFloat(numStr.replace(/,/g, ""))
    if (Number.isNaN(target)) {
      setDisplay(value)
      return
    }
    const duration = 1200
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(target * eased)
      setDisplay(`${prefix}${current.toLocaleString()}${suffix}`)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, value])

  return (
    <span ref={ref} className="home-stat-value block text-[1.35rem] md:text-[1.65rem] lg:text-[1.75rem] font-bold uppercase leading-none tracking-tight">
      {display}
    </span>
  )
}

interface StatsSectionProps {
  data: HomeStat[]
}

function StatIconDisplay({ icon }: { icon: string }) {
  if (isStatIconPreset(icon)) {
    const Icon = STAT_ICON_PRESETS[icon]
    return <Icon />
  }
  if (isValidWorkImage(icon)) {
    return (
      <Image
        src={icon}
        alt=""
        width={38}
        height={38}
        className="object-contain w-[34px] h-[34px] md:w-[38px] md:h-[38px]"
      />
    )
  }
  return <STAT_ICON_PRESETS.users />
}

export function StatsSection({ data }: StatsSectionProps) {
  if (!data?.length) return null

  return (
    <section className="home-stats-bar w-full" aria-label="Company statistics">
      <div className="site-container">
        <div className="home-stats-grid flex flex-wrap lg:flex-nowrap items-stretch">
          {data.map((stat, index) => (
              <div key={stat.id} className="home-stat-cell flex flex-1 min-w-[50%] lg:min-w-0 items-center">
                {index > 0 && <div className="home-stats-divider hidden lg:block" aria-hidden="true" />}
                <div className="home-stat-item flex flex-1 items-center justify-center lg:justify-start gap-3 md:gap-4 px-4 md:px-6 lg:px-8 py-7 md:py-8 lg:py-9">
                  <div className="shrink-0 home-stat-icon">
                    <StatIconDisplay icon={stat.icon} />
                  </div>
                  <div className="min-w-0">
                    <AnimatedValue value={stat.value} />
                    <p className="home-stat-label site-paragraph uppercase tracking-[0.14em] mt-2 leading-none">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
