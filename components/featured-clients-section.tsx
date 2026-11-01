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

  return (
    <section className="py-10 md:py-14 bg-[#fafafa] border-y border-black/5">
      <div className="site-container mb-8">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white border border-black/10 rounded-xl px-4 py-3 flex items-center justify-center w-[calc(50%-0.5rem)] max-w-[200px] min-w-0 h-24 hover:border-home-primary/50 hover:shadow-md transition-all group"
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
