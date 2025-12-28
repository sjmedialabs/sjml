"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface Client {
  id: string
  name: string
  logo: string
  industry: string
}

interface ClientsListProps {
  initialClients: Client[]
}

export function ClientsList({ initialClients }: ClientsListProps) {
  const [filteredClients, setFilteredClients] = useState(initialClients)
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries")
  const [industries, setIndustries] = useState<string[]>([])

  useEffect(() => {
    const industriesSet = new Set<string>(["All Industries"])
    initialClients.forEach((c) => {
      if (c.industry) industriesSet.add(c.industry)
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
    <>
      {/* Filters */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className={`px-6 py-2 rounded-full text-sm transition-colors ${
                  industry === selectedIndustry
                    ? "bg-[#E63946] text-white"
                    : "bg-[#1a1a1a] text-[#888] hover:text-white border border-[#333]"
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredClients.map((client, index) => (
              <div
                key={client.id || index}
                className="bg-[#111] border border-[#222] rounded-2xl p-8 flex flex-col items-center justify-center hover:border-[#E63946]/50 transition-colors"
              >
                <div className="relative h-12 w-full mb-4">
                  <Image
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    fill
                    className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
                <p className="text-white font-medium text-center">{client.name}</p>
                <p className="text-[#666] text-sm text-center">{client.industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}