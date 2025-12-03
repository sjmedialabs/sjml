"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [filteredClients, setFilteredClients] = useState<any[]>([])
  const [industries, setIndustries] = useState<string[]>(["All Industries"])
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries")
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedIndustry === "All Industries") {
      setFilteredClients(clients)
    } else {
      setFilteredClients(clients.filter(c => c.industry === selectedIndustry))
    }
  }, [selectedIndustry, clients])

  const fetchData = async () => {
    try {
      // Fetch page content
      const contentRes = await fetch('/api/content/clients')
      if (!contentRes.ok) throw new Error('Failed to fetch page content')
      const contentData = await contentRes.json()
      setContent(contentData)

      // Fetch clients
      const clientsRes = await fetch('/api/clients')
      if (!clientsRes.ok) throw new Error('Failed to fetch clients')
      const clientsData = await clientsRes.json()
      
      // Extract unique industries
      const industriesSet = new Set<string>()
      clientsData.forEach((c: any) => {
        if (c.industry) industriesSet.add(c.industry)
      })
      
      setClients(clientsData)
      setFilteredClients(clientsData)
      setIndustries(["All Industries", ...Array.from(industriesSet)])
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      setError("Failed to load page content")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin" />
        </div>
      </main>
    )
  }

  if (error || !content) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Header />
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-white mb-4">Content Not Available</h1>
          <p className="text-[#888]">{error || "Page content has not been set up yet."}</p>
        </div>
      </main>
    )
  }

  const hero = content.hero
  const stats = content.stats || []
  const cta = content.cta
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="text-[#E63946]">Clients</span>
          </h1>
          <p className="text-xl text-[#888] max-w-3xl mx-auto">
            Trusted by industry leaders worldwide to deliver exceptional results.
          </p>
        </div>
      </section>

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
                key={index}
                className="bg-[#111] border border-[#222] rounded-2xl p-8 flex flex-col items-center justify-center hover:border-[#E63946]/50 transition-colors"
              >
                <img
                  src={client.logo || "/placeholder.svg"}
                  alt={client.name}
                  className="h-12 object-contain mb-4 opacity-70 hover:opacity-100 transition-opacity"
                />
                <p className="text-white font-medium">{client.name}</p>
                <p className="text-[#666] text-sm">{client.industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="py-16 px-4 bg-[#111]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold text-[#E63946] mb-2">{stat.value}</div>
                  <div className="text-[#888]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#E63946] to-[#d62839] rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{cta.title}</h2>
          <p className="text-white/80 mb-8">{cta.description}</p>
          <a
            href={cta.buttonUrl}
            className="inline-block px-8 py-4 bg-white text-[#E63946] rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            {cta.buttonText}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
