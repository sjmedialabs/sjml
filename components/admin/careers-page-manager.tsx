"use client"

import { useState, useEffect } from "react"

interface JobPosting {
  id: string
  title: string
  department: string
  location: string
  type: string // Full-time, Part-time, Contract, Remote
  description: string
  requirements: string[]
  benefits: string[]
  salary: string
  published: boolean
}

interface CareersData {
  heroTitle: string
  heroSubtitle: string
  culture: {
    title: string
    description: string
    values: Array<{ title: string; description: string }>
  }
  benefits: Array<{ icon: string; title: string; description: string }>
  jobs: JobPosting[]
}

const defaultData: CareersData = {
  heroTitle: "Join Our Team",
  heroSubtitle:
    "Build your career with a team of passionate innovators dedicated to creating extraordinary digital experiences.",
  culture: {
    title: "Our Culture",
    description: "We believe in fostering a creative environment where innovation thrives.",
    values: [],
  },
  benefits: [],
  jobs: [],
}

export function CareersPageManager() {
  const [data, setData] = useState<CareersData>(defaultData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("jobs")
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/content/careers")
      if (res.ok) {
        const fetchedData = await res.json()
        setData({ ...defaultData, ...fetchedData })
      }
    } catch (error) {
      console.error("Failed to fetch careers data")
    }
  }

  const saveData = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/careers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setMessage("Careers page saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch {
      setMessage("Failed to save")
    }
    setSaving(false)
  }

  const addJob = () => {
    const newJob: JobPosting = {
      id: Date.now().toString(),
      title: "New Position",
      department: "",
      location: "",
      type: "Full-time",
      description: "",
      requirements: [],
      benefits: [],
      salary: "",
      published: false,
    }
    setData({ ...data, jobs: [...data.jobs, newJob] })
    setEditingJob(newJob)
  }

  const deleteJob = (id: string) => {
    setData({ ...data, jobs: data.jobs.filter((j) => j.id !== id) })
    setEditingJob(null)
  }

  const updateJob = (updated: JobPosting) => {
    setData({ ...data, jobs: data.jobs.map((j) => (j.id === updated.id ? updated : j)) })
    setEditingJob(updated)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Careers Page</h1>
        <p className="text-[#888]">Manage job postings and career page content</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["jobs", "hero", "culture", "benefits"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
              activeTab === tab ? "bg-[#E63946] text-white" : "bg-[#1a1a1a] text-[#888] hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "hero" && (
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#888] mb-2">Title</label>
              <input
                type="text"
                value={data.heroTitle}
                onChange={(e) => setData({ ...data, heroTitle: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#888] mb-2">Subtitle</label>
              <textarea
                value={data.heroSubtitle}
                onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "jobs" && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 bg-[#111] border border-[#222] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Job Postings</h2>
              <button
                onClick={addJob}
                className="px-3 py-1.5 bg-[#E63946] text-white rounded-lg hover:bg-[#d62839] text-sm"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {data.jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setEditingJob(job)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    editingJob?.id === job.id
                      ? "bg-[#E63946] text-white"
                      : "bg-[#0a0a0a] text-[#888] hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  <div className="font-medium truncate">{job.title}</div>
                  <div className="text-xs opacity-70 flex items-center gap-2">
                    <span>{job.department || "No dept"}</span>
                    {job.published && <span className="text-green-400">Live</span>}
                  </div>
                </button>
              ))}
              {data.jobs.length === 0 && <p className="text-[#666] text-sm text-center py-4">No job postings yet</p>}
            </div>
          </div>

          <div className="col-span-2 bg-[#111] border border-[#222] rounded-xl p-6">
            {editingJob ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white">Edit Job Posting</h2>
                  <button onClick={() => deleteJob(editingJob.id)} className="text-red-500 hover:text-red-400 text-sm">
                    Delete
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#888] mb-2">Job Title</label>
                    <input
                      type="text"
                      value={editingJob.title}
                      onChange={(e) => updateJob({ ...editingJob, title: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#888] mb-2">Department</label>
                    <input
                      type="text"
                      value={editingJob.department}
                      onChange={(e) => updateJob({ ...editingJob, department: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-[#888] mb-2">Location</label>
                    <input
                      type="text"
                      value={editingJob.location}
                      onChange={(e) => updateJob({ ...editingJob, location: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#888] mb-2">Type</label>
                    <select
                      value={editingJob.type}
                      onChange={(e) => updateJob({ ...editingJob, type: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#888] mb-2">Salary Range</label>
                    <input
                      type="text"
                      value={editingJob.salary}
                      onChange={(e) => updateJob({ ...editingJob, salary: e.target.value })}
                      placeholder="e.g. $80k - $120k"
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#888] mb-2">Description</label>
                  <textarea
                    value={editingJob.description}
                    onChange={(e) => updateJob({ ...editingJob, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#888] mb-2">Requirements (comma separated)</label>
                  <textarea
                    value={editingJob.requirements.join(", ")}
                    onChange={(e) =>
                      updateJob({
                        ...editingJob,
                        requirements: e.target.value
                          .split(",")
                          .map((r) => r.trim())
                          .filter(Boolean),
                      })
                    }
                    rows={2}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-[#888]">
                  <input
                    type="checkbox"
                    checked={editingJob.published}
                    onChange={(e) => updateJob({ ...editingJob, published: e.target.checked })}
                    className="w-4 h-4 accent-[#E63946]"
                  />
                  Published (visible on website)
                </label>
              </div>
            ) : (
              <div className="text-center text-[#666] py-12">Select a job posting to edit or add a new one</div>
            )}
          </div>
        </div>
      )}

      {activeTab === "culture" && (
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Company Culture</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#888] mb-2">Section Title</label>
              <input
                type="text"
                value={data.culture.title}
                onChange={(e) => setData({ ...data, culture: { ...data.culture, title: e.target.value } })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#888] mb-2">Description</label>
              <textarea
                value={data.culture.description}
                onChange={(e) => setData({ ...data, culture: { ...data.culture, description: e.target.value } })}
                rows={4}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "benefits" && (
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Employee Benefits</h2>
            <button
              onClick={() =>
                setData({ ...data, benefits: [...data.benefits, { icon: "Star", title: "", description: "" }] })
              }
              className="px-3 py-1.5 bg-[#E63946] text-white rounded-lg hover:bg-[#d62839] text-sm"
            >
              + Add Benefit
            </button>
          </div>
          <div className="space-y-4">
            {data.benefits.map((benefit, index) => (
              <div key={index} className="p-4 bg-[#0a0a0a] rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[#888] text-sm">Benefit #{index + 1}</span>
                  <button
                    onClick={() => setData({ ...data, benefits: data.benefits.filter((_, i) => i !== index) })}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[#666] mb-1">Icon</label>
                    <input
                      type="text"
                      value={benefit.icon}
                      onChange={(e) => {
                        const newBenefits = [...data.benefits]
                        newBenefits[index].icon = e.target.value
                        setData({ ...data, benefits: newBenefits })
                      }}
                      className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-[#666] mb-1">Title</label>
                    <input
                      type="text"
                      value={benefit.title}
                      onChange={(e) => {
                        const newBenefits = [...data.benefits]
                        newBenefits[index].title = e.target.value
                        setData({ ...data, benefits: newBenefits })
                      }}
                      className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-[#666] mb-1">Description</label>
                  <input
                    type="text"
                    value={benefit.description}
                    onChange={(e) => {
                      const newBenefits = [...data.benefits]
                      newBenefits[index].description = e.target.value
                      setData({ ...data, benefits: newBenefits })
                    }}
                    className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                  />
                </div>
              </div>
            ))}
            {data.benefits.length === 0 && <p className="text-[#666] text-center py-4">No benefits added yet</p>}
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={saveData}
          disabled={saving}
          className="px-6 py-3 bg-[#E63946] text-white rounded-lg hover:bg-[#d62839] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  )
}
