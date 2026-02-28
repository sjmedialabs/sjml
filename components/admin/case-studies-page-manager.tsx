"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"

interface CaseStudy {
  id: string
  title: string
  client: string
  industry: string
  tags: string[]
  description: string
  challenge: string
  solution: string
  results: string[]
  image: string
  gallery: string[]
  stats: Array<{ label: string; value: string }>
  testimonial: { quote: string; author: string; role: string }
  featured: boolean
}

interface CaseStudiesData {
  heroTitle: string
  heroSubtitle: string
  heroImage?: string
  hero?: { title: string; subtitle?: string; description?: string; image?: string }
  section?: { title: string; description: string }
  categories: string[]
  caseStudies: CaseStudy[]
}

const defaultData: CaseStudiesData = {
  heroTitle: "Case Studies",
  heroSubtitle:
    "Discover how we've helped brands achieve extraordinary results through innovative strategies and creative execution.",
  heroImage: "",
  section: { title: "Our Case Studies", description: "Real results for real businesses." },
  categories: ["All", "Branding", "Digital Marketing", "Web Development", "Advertising"],
  caseStudies: [],
}

export function CaseStudiesPageManager() {
  const [data, setData] = useState<CaseStudiesData>(defaultData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null)
  const [activeTab, setActiveTab] = useState("basic")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/content/case-studies")
      if (res.ok) {
        const fetchedData = await res.json()
        const hero = fetchedData.hero || {}
        setData({
          ...defaultData,
          ...fetchedData,
          heroTitle: hero.title ?? fetchedData.heroTitle ?? defaultData.heroTitle,
          heroSubtitle: hero.description ?? hero.subtitle ?? fetchedData.heroSubtitle ?? defaultData.heroSubtitle,
          heroImage: hero.image ?? fetchedData.heroImage ?? "",
          section: fetchedData.section ?? defaultData.section,
        })
      }
    } catch (error) {
      console.error("Failed to fetch case studies data")
    }
  }

  const saveData = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("adminToken")
      const payload = {
        pageKey: "case-studies",
        hero: {
          title: data.heroTitle,
          description: data.heroSubtitle,
          image: data.heroImage ?? data.hero?.image ?? "",
        },
        section: data.section ?? defaultData.section,
        categories: data.categories,
        caseStudies: data.caseStudies,
      }
      const res = await fetch("/api/content/case-studies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setMessage("Case studies saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch {
      setMessage("Failed to save")
    }
    setSaving(false)
  }

  const addCaseStudy = () => {
    const newStudy: CaseStudy = {
      id: Date.now().toString(),
      title: "New Case Study",
      client: "",
      industry: "",
      tags: [],
      description: "",
      challenge: "",
      solution: "",
      results: [],
      image: "/placeholder.svg?height=400&width=600",
      gallery: [],
      stats: [{ label: "Growth", value: "250%" }],
      testimonial: { quote: "", author: "", role: "" },
      featured: false,
    }
    setData({ ...data, caseStudies: [...data.caseStudies, newStudy] })
    setEditingStudy(newStudy)
  }

  const deleteCaseStudy = (id: string) => {
    setData({ ...data, caseStudies: data.caseStudies.filter((s) => s.id !== id) })
    setEditingStudy(null)
  }

  const updateCaseStudy = (updated: CaseStudy) => {
    setData({ ...data, caseStudies: data.caseStudies.map((s) => (s.id === updated.id ? updated : s)) })
    setEditingStudy(updated)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold admin-text-primary mb-2">Case Studies</h1>
        <p className="admin-text-secondary">Manage your case studies</p>
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

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold admin-text-primary">Case Studies ({data.caseStudies.length})</h2>
          <p className="admin-text-secondary text-sm">Manage your case study portfolio</p>
        </div>
        <button
          onClick={addCaseStudy}
          className="px-4 py-2 bg-[#E63946] admin-text-primary rounded-lg hover:bg-[#d62839]"
        >
          + Add Case Study
        </button>
      </div>

      {/* Case Studies Table */}
      <div className="admin-card border admin-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b admin-border">
              <th className="text-left p-4 admin-text-secondary font-medium">Title</th>
              <th className="text-left p-4 admin-text-secondary font-medium">Client</th>
              <th className="text-left p-4 admin-text-secondary font-medium">Industry</th>
              <th className="text-left p-4 admin-text-secondary font-medium">Tags</th>
              <th className="text-left p-4 admin-text-secondary font-medium">Featured</th>
              <th className="text-right p-4 admin-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.caseStudies.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center admin-text-muted">
                  No case studies yet
                </td>
              </tr>
            ) : (
              data.caseStudies.map((study) => (
                <tr key={study.id} className="border-b admin-border hover:admin-bg-secondary">
                  <td className="p-4">
                    <div className="admin-text-primary font-medium">{study.title}</div>
                  </td>
                  <td className="p-4 admin-text-secondary">{study.client || "-"}</td>
                  <td className="p-4 admin-text-secondary">{study.industry || "-"}</td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {study.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400">
                          {tag}
                        </span>
                      ))}
                      {study.tags.length > 2 && (
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-500/20 admin-text-secondary">
                          +{study.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        study.featured ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-500/20 admin-text-secondary"
                      }`}
                    >
                      {study.featured ? "Featured" : "Standard"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingStudy(study)
                          setActiveTab("basic")
                        }}
                        className="admin-text-secondary hover:admin-text-primary px-2 py-1 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCaseStudy(study.id)}
                        className="text-red-400 hover:text-red-300 px-2 py-1 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingStudy && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="admin-card border admin-border rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold admin-text-primary">Edit Case Study</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => deleteCaseStudy(editingStudy.id)}
                  className="text-red-500 hover:text-red-400 text-sm px-3 py-1"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditingStudy(null)}
                  className="admin-text-secondary hover:admin-text-primary text-sm px-3 py-1"
                >
                  Close
                </button>
              </div>
            </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                {["basic", "content", "stats", "testimonial"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded text-sm capitalize ${
                      activeTab === tab ? "bg-[#E63946] admin-text-primary" : "admin-bg-tertiary admin-text-secondary"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {activeTab === "basic" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm admin-text-secondary mb-2">Title</label>
                        <input
                          type="text"
                          value={editingStudy.title}
                          onChange={(e) => updateCaseStudy({ ...editingStudy, title: e.target.value })}
                          className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm admin-text-secondary mb-2">Client</label>
                        <input
                          type="text"
                          value={editingStudy.client}
                          onChange={(e) => updateCaseStudy({ ...editingStudy, client: e.target.value })}
                          className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm admin-text-secondary mb-2">Industry</label>
                      <input
                        type="text"
                        value={editingStudy.industry}
                        onChange={(e) => updateCaseStudy({ ...editingStudy, industry: e.target.value })}
                        className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm admin-text-secondary mb-2">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={editingStudy.tags.join(", ")}
                        onChange={(e) =>
                          updateCaseStudy({
                            ...editingStudy,
                            tags: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                      />
                    </div>
                    <ImageUpload
                      label="Featured Image"
                      value={editingStudy.image}
                      onChange={(url) => updateCaseStudy({ ...editingStudy, image: url })}
                    />
                    <label className="flex items-center gap-2 text-sm admin-text-secondary">
                      <input
                        type="checkbox"
                        checked={editingStudy.featured}
                        onChange={(e) => updateCaseStudy({ ...editingStudy, featured: e.target.checked })}
                        className="w-4 h-4 accent-[#E63946]"
                      />
                      Featured Case Study
                    </label>
                  </>
                )}

                {activeTab === "content" && (
                  <>
                    <div>
                      <label className="block text-sm admin-text-secondary mb-2">Description</label>
                      <textarea
                        value={editingStudy.description}
                        onChange={(e) => updateCaseStudy({ ...editingStudy, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm admin-text-secondary mb-2">Challenge</label>
                      <textarea
                        value={editingStudy.challenge}
                        onChange={(e) => updateCaseStudy({ ...editingStudy, challenge: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm admin-text-secondary mb-2">Solution</label>
                      <textarea
                        value={editingStudy.solution}
                        onChange={(e) => updateCaseStudy({ ...editingStudy, solution: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm admin-text-secondary mb-2">Results (comma separated)</label>
                      <input
                        type="text"
                        value={editingStudy.results.join(", ")}
                        onChange={(e) =>
                          updateCaseStudy({
                            ...editingStudy,
                            results: e.target.value
                              .split(",")
                              .map((r) => r.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                      />
                    </div>
                  </>
                )}

                {activeTab === "stats" && (
                  <>
                    <div className="space-y-3">
                      {editingStudy.stats.map((stat, idx) => (
                        <div key={idx} className="grid grid-cols-2 gap-4 p-3 admin-bg-tertiary rounded-lg">
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...editingStudy.stats]
                              newStats[idx].label = e.target.value
                              updateCaseStudy({ ...editingStudy, stats: newStats })
                            }}
                            placeholder="Label"
                            className="px-3 py-2 admin-card border admin-border-light rounded admin-text-primary text-sm"
                          />
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...editingStudy.stats]
                              newStats[idx].value = e.target.value
                              updateCaseStudy({ ...editingStudy, stats: newStats })
                            }}
                            placeholder="Value"
                            className="px-3 py-2 admin-card border admin-border-light rounded admin-text-primary text-sm"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          updateCaseStudy({ ...editingStudy, stats: [...editingStudy.stats, { label: "", value: "" }] })
                        }
                        className="text-[#E63946] text-sm"
                      >
                        + Add Stat
                      </button>
                    </div>
                  </>
                )}

                {activeTab === "testimonial" && (
                  <>
                    <div>
                      <label className="block text-sm admin-text-secondary mb-2">Quote</label>
                      <textarea
                        value={editingStudy.testimonial.quote}
                        onChange={(e) =>
                          updateCaseStudy({
                            ...editingStudy,
                            testimonial: { ...editingStudy.testimonial, quote: e.target.value },
                          })
                        }
                        rows={3}
                        className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm admin-text-secondary mb-2">Author</label>
                        <input
                          type="text"
                          value={editingStudy.testimonial.author}
                          onChange={(e) =>
                            updateCaseStudy({
                              ...editingStudy,
                              testimonial: { ...editingStudy.testimonial, author: e.target.value },
                            })
                          }
                          className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm admin-text-secondary mb-2">Role</label>
                        <input
                          type="text"
                          value={editingStudy.testimonial.role}
                          onChange={(e) =>
                            updateCaseStudy({
                              ...editingStudy,
                              testimonial: { ...editingStudy.testimonial, role: e.target.value },
                            })
                          }
                          className="w-full px-4 py-3 admin-input rounded-lg  focus:outline-none focus:border-[#E63946]"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
          </div>
        </div>
      )}

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
