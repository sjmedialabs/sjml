"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"

interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  company: string
  image: string
  rating: number
  featured: boolean
}

interface TestimonialsData {
  heroTitle: string
  heroSubtitle: string
  heroImage?: string
  hero?: { title: string; subtitle?: string; description?: string; image?: string }
  testimonials: Testimonial[]
}

const defaultData: TestimonialsData = {
  heroTitle: "What Our Clients Say",
  heroSubtitle: "Don't just take our word for it. Hear from the brands we've helped transform.",
  heroImage: "",
  testimonials: [],
}

export function TestimonialsPageManager() {
  const [data, setData] = useState<TestimonialsData>(defaultData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/content/testimonials-page")
      if (res.ok) {
        const fetchedData = await res.json()
        setData({
          ...defaultData,
          heroTitle: fetchedData.heroTitle ?? defaultData.heroTitle,
          heroSubtitle: fetchedData.heroSubtitle ?? defaultData.heroSubtitle,
          heroImage: fetchedData.heroImage ?? "",
          testimonials: Array.isArray(fetchedData.testimonials) ? fetchedData.testimonials : [],
        })
      }
    } catch (error) {
      console.error("Failed to fetch testimonials data")
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
        testimonials: data.testimonials,
      }
      const res = await fetch("/api/content/testimonials-page", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setMessage("Testimonials saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch {
      setMessage("Failed to save")
    }
    setSaving(false)
  }

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      quote: "",
      author: "",
      role: "",
      company: "",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      featured: false,
    }
    setData({ ...data, testimonials: [...data.testimonials, newTestimonial] })
  }

  const deleteTestimonial = (id: string) => {
    setData({ ...data, testimonials: data.testimonials.filter((t) => t.id !== id) })
  }

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setData({ ...data, testimonials: data.testimonials.map((t) => (t.id === id ? { ...t, ...updates } : t)) })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold admin-text-primary mb-2">Testimonials</h1>
        <p className="admin-text-secondary">Manage client testimonials and reviews</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
      )}

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
              className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-[#E63946]"
            />
          </div>
          <div>
            <label className="block text-sm admin-text-secondary mb-2">Description</label>
            <textarea
              value={data.heroSubtitle}
              onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 admin-input rounded-lg focus:outline-none focus:border-[#E63946]"
            />
          </div>
          <ImageUpload
            label="Hero Background Image"
            value={data.heroImage ?? ""}
            onChange={(url) => setData({ ...data, heroImage: url })}
          />
        </div>
      </div>

      {/* Testimonials List */}
      <div className="admin-card border admin-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold admin-text-primary">Testimonials ({data.testimonials.length})</h2>
          <button
            onClick={addTestimonial}
            className="px-4 py-2 bg-[#E63946] admin-text-primary rounded-lg hover:bg-[#d62839] text-sm"
          >
            + Add Testimonial
          </button>
        </div>

        <div className="space-y-4">
          {data.testimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-4 admin-bg-tertiary rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <span className="admin-text-primary font-medium">{testimonial.author || "New Testimonial"}</span>
                <button
                  onClick={() => deleteTestimonial(testimonial.id)}
                  className="text-red-500 hover:text-red-400 text-sm"
                >
                  Delete
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs admin-text-muted mb-1">Quote</label>
                  <textarea
                    value={testimonial.quote}
                    onChange={(e) => updateTestimonial(testimonial.id, { quote: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 admin-card border admin-border-light rounded admin-text-primary text-sm focus:outline-none focus:border-[#E63946]"
                  />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs admin-text-muted mb-1">Author</label>
                    <input
                      type="text"
                      value={testimonial.author}
                      onChange={(e) => updateTestimonial(testimonial.id, { author: e.target.value })}
                      className="w-full px-3 py-2 admin-card border admin-border-light rounded admin-text-primary text-sm focus:outline-none focus:border-[#E63946]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs admin-text-muted mb-1">Role</label>
                    <input
                      type="text"
                      value={testimonial.role}
                      onChange={(e) => updateTestimonial(testimonial.id, { role: e.target.value })}
                      className="w-full px-3 py-2 admin-card border admin-border-light rounded admin-text-primary text-sm focus:outline-none focus:border-[#E63946]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs admin-text-muted mb-1">Company</label>
                    <input
                      type="text"
                      value={testimonial.company}
                      onChange={(e) => updateTestimonial(testimonial.id, { company: e.target.value })}
                      className="w-full px-3 py-2 admin-card border admin-border-light rounded admin-text-primary text-sm focus:outline-none focus:border-[#E63946]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs admin-text-muted mb-1">Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating}
                      onChange={(e) =>
                        updateTestimonial(testimonial.id, { rating: Number.parseInt(e.target.value) || 5 })
                      }
                      className="w-full px-3 py-2 admin-card border admin-border-light rounded admin-text-primary text-sm focus:outline-none focus:border-[#E63946]"
                    />
                  </div>
                </div>
                <ImageUpload
                  label="Author Image"
                  value={testimonial.image}
                  onChange={(url) => updateTestimonial(testimonial.id, { image: url })}
                />
                <label className="flex items-center gap-2 text-xs admin-text-secondary">
                  <input
                    type="checkbox"
                    checked={testimonial.featured}
                    onChange={(e) => updateTestimonial(testimonial.id, { featured: e.target.checked })}
                    className="w-3 h-3 accent-[#E63946]"
                  />
                  Featured (show on homepage)
                </label>
              </div>
            </div>
          ))}
        </div>

        {data.testimonials.length === 0 && (
          <p className="admin-text-muted text-center py-8">
            No testimonials added yet. Click "Add Testimonial" to get started.
          </p>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={saveData}
          disabled={saving}
          className="px-6 py-3 bg-[#E63946] admin-text-primary rounded-lg hover:bg-[#d62839] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  )
}
