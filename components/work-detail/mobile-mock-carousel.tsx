"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface MobileMockCarouselProps {
  images: string[]
  caption?: string
}

function wrapIndex(i: number, len: number): number {
  if (len === 0) return 0
  return ((i % len) + len) % len
}

function SideSquare({ src }: { src: string }) {
  return (
    <div className="relative w-[130px] h-[130px] sm:w-[160px] sm:h-[160px] md:w-[190px] md:h-[190px] lg:w-[210px] lg:h-[210px] shrink-0 rounded-sm overflow-hidden bg-muted dark:bg-zinc-900 border border-border">
      <Image src={src} alt="" fill className="object-cover" sizes="210px" />
    </div>
  )
}

function InstagramPhoneScreen({
  currentSrc,
  nextSrc,
  isTransitioning,
}: {
  currentSrc: string
  nextSrc?: string | null
  isTransitioning: boolean
}) {
  return (
    <div className="flex flex-col h-full bg-white text-black text-[10px]">
      {/* Status / header */}
      <div className="flex items-center justify-between px-3 pt-7 pb-2 shrink-0">
        <span className="font-semibold text-[13px] tracking-tight" style={{ fontFamily: "system-ui" }}>
          Instagram
        </span>
        <div className="flex items-center gap-2.5 opacity-90">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
      </div>

      {/* Stories */}
      <div className="flex gap-2 px-3 pb-2 overflow-hidden shrink-0">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="w-11 h-11 rounded-full border-2 border-zinc-300 bg-zinc-100 shrink-0" />
        ))}
      </div>

      {/* Post — carousel image */}
      <div className="px-3 pb-2 shrink-0">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-100">
          <Image
            src={currentSrc}
            alt=""
            fill
            className={`object-cover transition-transform duration-500 ${isTransitioning ? "scale-[1.02]" : "scale-100"}`}
            sizes="(max-width: 640px) 180px, 240px"
            priority
          />
          {nextSrc ? (
            <Image
              src={nextSrc}
              alt=""
              fill
              className={`object-cover transition-opacity duration-500 ${isTransitioning ? "opacity-100" : "opacity-0"}`}
              sizes="(max-width: 640px) 180px, 240px"
            />
          ) : null}
        </div>
      </div>

      {/* Post actions */}
      <div className="flex items-center gap-3 px-3 py-2 shrink-0 border-t border-zinc-200">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
        <div className="flex-1" />
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-around px-4 py-3 border-t border-zinc-200 shrink-0 pb-6">
        <div className="w-6 h-6 rounded-sm bg-black/10" />
        <div className="w-6 h-6 rounded-full border border-black/30" />
        <div className="w-6 h-6 rounded-sm bg-black/10" />
        <div className="w-6 h-6 rounded-sm bg-black/10" />
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
          <div className="w-full h-full rounded-full bg-white" />
        </div>
      </div>
    </div>
  )
}

export function MobileMockCarousel({ images, caption }: MobileMockCarouselProps) {
  const [index, setIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const len = images.length

  useEffect(() => {
    if (len <= 1) return
    const timer = setInterval(() => setIndex((i) => wrapIndex(i + 1, len)), 3500)
    return () => clearInterval(timer)
  }, [len])

  if (len === 0) return null

  useEffect(() => {
    if (len === 0) return
    if (index === displayIndex) return
    setNextIndex(index)
    setIsTransitioning(true)
    const t = setTimeout(() => {
      setDisplayIndex(index)
      setIsTransitioning(false)
      setNextIndex(null)
    }, 520)
    return () => clearTimeout(t)
  }, [displayIndex, index, len])

  const centerSrc = images[wrapIndex(displayIndex, len)]
  const incomingSrc = nextIndex != null ? images[wrapIndex(nextIndex, len)] : null
  const showSides = len >= 2
  const leftFar = showSides ? images[wrapIndex(displayIndex - 2, len)] : null
  const leftNear = showSides ? images[wrapIndex(displayIndex - 1, len)] : null
  const rightNear = showSides ? images[wrapIndex(displayIndex + 1, len)] : null
  const rightFar = showSides ? images[wrapIndex(displayIndex + 2, len)] : null

  return (
    <section className="relative bg-muted dark:bg-zinc-950 py-16 md:py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 w-full">
            {/* Left squares */}
            {showSides && (
              <div className="hidden md:flex items-center gap-3 md:gap-4 shrink-0">
                {leftFar && <SideSquare src={leftFar} />}
                {leftNear && <SideSquare src={leftNear} />}
              </div>
            )}

            {/* Phone */}
            <div className="relative shrink-0 w-[235px] sm:w-[265px] md:w-[295px] lg:w-[325px]">
              <div
                className="relative rounded-[2.2rem] border border-zinc-300 dark:border-[#3b4bff]/40 bg-zinc-800/90 dark:bg-zinc-950/80 p-2 shadow-xl dark:shadow-[0_0_0_1px_rgba(120,140,255,0.35),0_0_28px_rgba(120,140,255,0.14),0_30px_60px_-15px_rgba(0,0,0,0.9)]"
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[78px] h-[20px] bg-zinc-900 dark:bg-black rounded-full z-20" />
                <div className="relative rounded-[1.85rem] overflow-hidden bg-zinc-900 dark:bg-black aspect-[9/19.5]">
                  <InstagramPhoneScreen currentSrc={centerSrc} nextSrc={incomingSrc} isTransitioning={isTransitioning} />
                </div>
              </div>
            </div>

            {/* Right squares */}
            {showSides && (
              <div className="hidden md:flex items-center gap-3 md:gap-4 shrink-0">
                {rightNear && <SideSquare src={rightNear} />}
                {rightFar && <SideSquare src={rightFar} />}
              </div>
            )}
          </div>

          {/* Mobile: show 2 side squares below phone in a row */}
          {showSides && (
            <div className="flex sm:hidden items-center justify-center gap-3 mt-6">
              {leftNear && <SideSquare src={leftNear} />}
              {rightNear && <SideSquare src={rightNear} />}
            </div>
          )}

          {caption && (
            <p className="mt-10 md:mt-12 text-foreground text-lg md:text-xl font-semibold max-w-md text-center sm:text-left sm:self-start leading-snug">
              {caption}
            </p>
          )}

          {len > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === index ? "bg-[#E63946]" : "bg-foreground/25 dark:bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
