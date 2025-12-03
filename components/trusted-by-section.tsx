"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

interface Partner {
  id: string
  name: string
  logo: string
}

interface TrustedBySectionProps {
  data: Partner[]
  backgroundImage?: string
}

export function TrustedBySection({ data, backgroundImage }: TrustedBySectionProps) {
  if (!data || data.length === 0) {
    return null
  }

  const partners = data
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Duplicate partners for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners, ...partners]

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5

    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed
        // Reset position when we've scrolled through one set of partners
        const singleSetWidth = scrollContainer.scrollWidth / 3
        if (scrollPosition >= singleSetWidth) {
          scrollPosition = 0
        }
        scrollContainer.scrollLeft = scrollPosition
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [isPaused])

  return (
    <section className="relative py-16 bg-[#0a0a0a]">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Trusted by Industry Leaders</h2>
          <p className="text-gray-400">Partnering with forward-thinking brands worldwide</p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

          {/* Scrolling Container */}
          <div
            ref={scrollRef}
            className="flex gap-12 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center min-w-[150px]"
              >
                {partner.logo ? (
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={120}
                    height={40}
                    className="object-contain opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                  />
                ) : (
                  <span className="text-xl font-bold text-gray-500 hover:text-white transition-colors whitespace-nowrap">
                    {partner.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
