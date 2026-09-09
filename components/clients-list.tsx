"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface Client {
  id: string
  name: string
  logo: string
  industry: string
  website?: string
}

interface ClientsListProps {
  initialClients: Client[]
  availableIndustries?: string[]
}

export function ClientsList({ initialClients, availableIndustries = [] }: ClientsListProps) {
  const [filteredClients, setFilteredClients] = useState(initialClients)
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries")
  const [industries, setIndustries] = useState<string[]>([])

  useEffect(() => {
    const industriesSet = new Set<string>(["All Industries"])
    
    // Only include industries that have at least one client assigned
    initialClients.forEach((c) => {
      if (c.industry?.trim()) {
        industriesSet.add(c.industry.trim())
      }
    })

    setIndustries(Array.from(industriesSet))
  }, [initialClients])

  useEffect(() => {
    if (selectedIndustry === "All Industries") {
      setFilteredClients(initialClients)
    } else {
      setFilteredClients(initialClients.filter((c) => c.industry === selectedIndustry))
    }
  }, [selectedIndustry, initialClients])

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="site-container">
        {/* Industry Filters */}
        {industries.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
            {industries.map((industry) => {
              const active = industry === selectedIndustry
              return (
                <button
                  key={industry}
                  type="button"
                  onClick={() => setSelectedIndustry(industry)}
                  className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-home-primary text-white shadow-sm"
                      : "bg-[#f5f5f5] text-black/70 hover:text-black hover:bg-[#e8e8e8]"
                  }`}
                >
                  {industry}
                </button>
              )
            })}
          </div>
        )}

        {/* Clients Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {filteredClients.map((client, index) => {
            const cardContent = (
              <div className="group relative bg-white border border-black/10 hover:border-home-primary/50 rounded-xl p-3.5 md:p-4 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 min-h-[150px] cursor-pointer">
                <div className="relative h-20 md:h-24 w-full flex items-center justify-center mb-2 bg-white">
                  <Image
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    fill
                    className="object-contain no-invert bg-transparent opacity-85 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-300"
                  />
                </div>
                <p className="font-bold text-xs md:text-sm uppercase tracking-wider text-black group-hover:text-home-primary transition-colors text-center line-clamp-1">
                  {client.name}
                </p>
                {client.industry && (
                  <p className="text-[11px] md:text-xs uppercase tracking-widest text-black/50 text-center mt-0.5 line-clamp-1">
                    {client.industry}
                  </p>
                )}
              </div>
            )

            if (client.website?.trim()) {
              return (
                <a
                  key={client.id || index}
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus:outline-none"
                >
                  {cardContent}
                </a>
              )
            }

            return <div key={client.id || index}>{cardContent}</div>
          })}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-16">
            <p className="text-black/50 text-sm uppercase tracking-widest">No clients found in this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}