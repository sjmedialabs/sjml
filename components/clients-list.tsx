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
      {/* Filters - extra space below hero and above grid */}
      <section className="px-4 pt-12 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className={`px-6 py-2 rounded-full text-sm transition-colors ${
                  industry === selectedIndustry
                    ? "bg-[#E63946] text-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground border border-[#333]"
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Grid - space below tabs */}
      <section className="pt-4 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredClients.map((client, index) => (
              <div
                key={client.id || index}
                className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center hover:border-[#E63946]/50 transition-colors"
              >
                <div className="relative h-12 w-full mb-4">
                  <Image
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    fill
                    className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
                <p className="text-foreground font-medium text-center">{client.name}</p>
                <p className="text-[#666] text-sm text-center">{client.industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}