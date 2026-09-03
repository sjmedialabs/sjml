"use client"

import Image from "next/image"
import Link from "next/link"

export interface FeaturedClientItem {
  id: string
  name: string
  logo: string
  industry?: string
  website?: string
}

export function FeaturedClientsSection({ clients }: { clients: FeaturedClientItem[] }) {
  if (!clients || clients.length === 0) return null

  // Duplicate list to create a seamless infinite marquee loop
  const marqueeClients = [...clients, ...clients, ...clients, ...clients]

  return (
    <section className="py-10 md:py-14 bg-[#fafafa] border-y border-black/5 overflow-hidden">
      {/* Infinite Horizontal Logo Marquee */}
      <div className="relative w-full overflow-hidden flex select-none mb-8">
        {/* Left & Right gradient fades for premium look */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none" />

        <div className="flex shrink-0 animate-marquee items-center gap-6 md:gap-10">
          {marqueeClients.map((client, idx) => (
            <div
              key={`${client.id}-${idx}`}
              className="bg-white border border-black/10 rounded-xl px-6 py-4 flex items-center justify-center min-w-[170px] md:min-w-[200px] h-24 hover:border-home-primary/50 hover:shadow-md transition-all group shrink-0"
            >
              <div className="relative h-14 w-full flex items-center justify-center">
                <Image
                  src={client.logo || "/placeholder.svg"}
                  alt={client.name}
                  fill
                  className="object-contain filter grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Button at the bottom */}
      <div className="flex justify-center">
        <Link
          href="/clients"
          className="home-hero-cta-primary inline-flex items-center gap-2 h-10 px-6 font-bold uppercase tracking-wide transition-all shadow-sm"
        >
          View All Clients
          <span className="inline-block font-mono">→</span>
        </Link>
      </div>
    </section>
  )
}
