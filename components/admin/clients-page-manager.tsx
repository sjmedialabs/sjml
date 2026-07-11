"use client"

import { AdminToast } from "./admin-toast"
import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"

interface Client {
  id: string
  name: string
  logo: string
  industry: string
  website: string
  featured: boolean
}

interface ClientsData {
  heroTitle: string
  heroSubtitle: string
  heroImage?: string
  hero?: { title: string; subtitle?: string; description?: string; image?: string }
  stats: Array<{ value: string; label: string }>
  cta: { title: string; description: string; buttonText: string; buttonUrl: string }
  clients: Client[]
}

const defaultData: ClientsData = {
  heroTitle: "Our Clients",
  heroSubtitle: "Trusted by industry leaders worldwide to deliver exceptional results.",
  heroImage: "",
  stats: [],
  cta: { title: "", description: "", buttonText: "", buttonUrl: "" },
  clients: [],
}

export function ClientsPageManager() {
  const [data, setData] = useState<ClientsData>(defaultData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/content/clients-page")
      if (res.ok) {
        const fetchedData = await res.json()
        setData({
          ...defaultData,
          heroTitle: fetchedData.heroTitle ?? defaultData.heroTitle,
          heroSubtitle: fetchedData.heroSubtitle ?? defaultData.heroSubtitle,
          heroImage: fetchedData.heroImage ?? "",
          stats: Array.isArray(fetchedData.stats) ? fetchedData.stats : [],
          cta: fetchedData.cta ?? defaultData.cta,
          clients: Array.isArray(fetchedData.clients) ? fetchedData.clients : [],
        })
      }
    } catch (error) {
      console.error("Failed to fetch clients data")
    }
  }

  const saveData = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("adminToken")
      const payload = {
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroImage: data.heroImage ?? "",
        stats: data.stats,
        cta: data.cta,
        clients: data.clients,
      }
      const res = await fetch("/api/content/clients-page", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const saved = await res.json()
        setMessage("Clients saved successfully!")
        setTimeout(() => setMessage(""), 3000)
        // Reload from server so admin and website show the same data
        setData({
          ...data,
          heroTitle: saved.heroTitle ?? data.heroTitle,
          heroSubtitle: saved.heroSubtitle ?? data.heroSubtitle,
          heroImage: saved.heroImage ?? data.heroImage,
          stats: Array.isArray(saved.stats) ? saved.stats : data.stats,
          cta: saved.cta ?? data.cta,
          clients: Array.isArray(saved.clients) ? saved.clients : data.clients,
        })
      }
    } catch {
      setMessage("Failed to save")
    }
    setSaving(false)
  }

  const addClient = () => {
    const newClient: Client = {
      id: Date.now().toString(),
      name: "New Client",
      logo: "/placeholder.svg?height=100&width=200",
      industry: "",
      website: "",
      featured: false,
    }
    setData({ ...data, clients: [...data.clients, newClient] })
  }

  const deleteClient = (id: string) => {
    setData({ ...data, clients: data.clients.filter((c) => c.id !== id) })
  }

  const updateClient = (id: string, updates: Partial<Client>) => {
    setData({ ...data, clients: data.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)) })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold admin-text-primary mb-2">Clients</h1>
        <p className="admin-text-secondary">Manage your client logos and information</p>
      </div>

      <AdminToast message={message} onClose={() => setMessage("")} />

      {/* Hero Section */}
      <div className="admin-card border admin-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold admin-text-primary mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm admin-text-secondary mb-2">Title</label>
            <input
              type="text"
              value={data.heroTitle}
              onChange={(e) => setData({ ...data, heroTitle: e.target.value })}
              className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm admin-text-secondary mb-2">Description</label>
            <textarea
              value={data.heroSubtitle}
              onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <ImageUpload
            label="Hero Background Image"
            value={data.heroImage ?? ""}
            onChange={(url) => setData({ ...data, heroImage: url })}
          />
        </div>
      </div>

      <div className="admin-card border admin-border rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold admin-text-primary">Stats bar</h2>
          <button
            type="button"
            onClick={() => setData({ ...data, stats: [...data.stats, { value: "", label: "" }] })}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-[4px] hover:bg-primary/90 text-sm"
          >
            + Add stat
          </button>
        </div>
        <p className="text-sm admin-text-muted mb-4">Shown below the client grid on /clients.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {data.stats.map((stat, index) => (
            <div key={index} className="p-4 admin-bg-tertiary rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-xs admin-text-muted">Stat {index + 1}</span>
                <button
                  type="button"
                  onClick={() => setData({ ...data, stats: data.stats.filter((_, i) => i !== index) })}
                  className="text-red-500 text-xs"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => {
                    const stats = [...data.stats]
                    stats[index] = { ...stats[index], value: e.target.value }
                    setData({ ...data, stats })
                  }}
                  placeholder="Value"
                  className="w-full px-3 py-2 admin-card border admin-border-light rounded admin-text-primary text-sm"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => {
                    const stats = [...data.stats]
                    stats[index] = { ...stats[index], label: e.target.value }
                    setData({ ...data, stats })
                  }}
                  placeholder="Label"
                  className="w-full px-3 py-2 admin-card border admin-border-light rounded admin-text-primary text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card border admin-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold admin-text-primary mb-4">Bottom CTA</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={data.cta.title}
            onChange={(e) => setData({ ...data, cta: { ...data.cta, title: e.target.value } })}
            placeholder="CTA title"
            className="w-full px-4 py-3 admin-input rounded-lg"
          />
          <textarea
            value={data.cta.description}
            onChange={(e) => setData({ ...data, cta: { ...data.cta, description: e.target.value } })}
            rows={2}
            placeholder="CTA description"
            className="w-full px-4 py-3 admin-input rounded-lg"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={data.cta.buttonText}
              onChange={(e) => setData({ ...data, cta: { ...data.cta, buttonText: e.target.value } })}
              placeholder="Button text"
              className="w-full px-4 py-3 admin-input rounded-lg"
            />
            <input
              type="text"
              value={data.cta.buttonUrl}
              onChange={(e) => setData({ ...data, cta: { ...data.cta, buttonUrl: e.target.value } })}
              placeholder="Button URL"
              className="w-full px-4 py-3 admin-input rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="admin-card border admin-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold admin-text-primary">Clients ({data.clients.length})</h2>
          <button
            onClick={addClient}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-[4px] hover:bg-primary/90 text-sm"
          >
            + Add Client
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {data.clients.map((client) => (
            <div key={client.id} className="p-4 admin-bg-tertiary rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <span className="admin-text-primary font-medium">{client.name}</span>
                <button onClick={() => deleteClient(client.id)} className="text-red-500 hover:text-red-400 text-sm">
                  Delete
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs admin-text-muted mb-1">Name</label>
                  <input
                    type="text"
                    value={client.name}
                    onChange={(e) => updateClient(client.id, { name: e.target.value })}
                    className="w-full px-3 py-2 admin-card border admin-border-light rounded admin-text-primary text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <ImageUpload
                  label="Client Logo"
                  value={client.logo}
                  onChange={(url) => updateClient(client.id, { logo: url })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs admin-text-muted mb-1">Industry</label>
                    <input
                      type="text"
                      value={client.industry}
                      onChange={(e) => updateClient(client.id, { industry: e.target.value })}
                      className="w-full px-3 py-2 admin-card border admin-border-light rounded admin-text-primary text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs admin-text-muted mb-1">Website</label>
                    <input
                      type="text"
                      value={client.website}
                      onChange={(e) => updateClient(client.id, { website: e.target.value })}
                      className="w-full px-3 py-2 admin-card border admin-border-light rounded admin-text-primary text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs admin-text-secondary">
                  <input
                    type="checkbox"
                    checked={client.featured}
                    onChange={(e) => updateClient(client.id, { featured: e.target.checked })}
                    className="w-3 h-3 accent-primary"
                  />
                  Featured (show on homepage)
                </label>
              </div>
            </div>
          ))}
        </div>

        {data.clients.length === 0 && (
          <p className="admin-text-muted text-center py-8">No clients added yet. Click "Add Client" to get started.</p>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={saveData}
          disabled={saving}
          className="h-9 px-4 bg-primary text-primary-foreground rounded-[4px] hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  )
}
