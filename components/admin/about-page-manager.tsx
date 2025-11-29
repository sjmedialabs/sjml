"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"

interface AboutData {
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroImage: string
  heroBackgroundImage: string
  aboutSection: {
    badge: string
    title: string
    highlightedTitle: string
    description: string
    image: string
  }
  mission: string
  vision: string
  values: Array<{ title: string; description: string; icon: string }>
  story: {
    title: string
    content: string
    image: string
  }
  team: Array<{
    id: string
    name: string
    role: string
    image: string
    bio: string
    linkedin: string
  }>
  stats: Array<{ value: string; label: string }>
  achievements: Array<{ year: string; title: string; description: string }>
  visionSection: {
    badge: string
    title: string
    highlightedTitle: string
    description: string
    image: string
  }
  missionSection: {
    badge: string
    title: string
    highlightedTitle: string
    description: string
    image: string
  }
  teamSection: {
    badge: string
    title: string
    highlightedTitle: string
    buttonText: string
    buttonUrl: string
  }
  achievementsSection: {
    badge: string
    title: string
    highlightedTitle: string
    description: string
    buttonText: string
    buttonUrl: string
  }
}

const defaultAboutData: AboutData = {
  heroTitle: "We are Creative Thinkers, Problem Solvers & Exceptional Communicators",
  heroSubtitle: "",
  heroDescription: "",
  heroImage: "",
  heroBackgroundImage: "",
  aboutSection: {
    badge: "About Us",
    title: "A team of",
    highlightedTitle: "creative thinkers",
    description:
      "We're a full-service design agency specializing in branding, web design, and creative strategies that elevate businesses.",
    image: "/placeholder.svg?height=400&width=500",
  },
  mission:
    "We're a full-service design agency specializing in branding, web design, and creative strategies that elevate businesses.",
  vision:
    "We're a full-service design agency specializing in branding, web design, and creative strategies that elevate businesses.",
  values: [
    { title: "Creativity and Innovation", description: "", icon: "" },
    { title: "Client-Centricity", description: "", icon: "" },
    { title: "Integrity and Transparency", description: "", icon: "" },
    { title: "Excellence and Quality", description: "", icon: "" },
  ],
  story: {
    title: "Our Story",
    content: "",
    image: "",
  },
  team: [],
  stats: [
    { value: "1000+", label: "Project Completed" },
    { value: "15+", label: "Years Of Experience" },
    { value: "100+", label: "Client Satisfaction" },
  ],
  achievements: [],
  visionSection: {
    badge: "Our Vision",
    title: "Driving the Future of",
    highlightedTitle: "Creativity",
    description: "",
    image: "/placeholder.svg?height=400&width=500",
  },
  missionSection: {
    badge: "Our Mission",
    title: "Bringing ideas to life through",
    highlightedTitle: "creativity",
    description: "",
    image: "/placeholder.svg?height=400&width=500",
  },
  teamSection: {
    badge: "Our Team",
    title: "The minds behind the",
    highlightedTitle: "magic",
    buttonText: "All Team Members",
    buttonUrl: "/team",
  },
  achievementsSection: {
    badge: "Our Achievements",
    title: "proud moments",
    highlightedTitle: "& milestones",
    description:
      "We're a full-service design agency specializing in branding, web design, and creative strategies that elevate businesses.",
    buttonText: "Let's discuss",
    buttonUrl: "/contact",
  },
}

export function AboutPageManager() {
  const [activeTab, setActiveTab] = useState("hero")
  const [data, setData] = useState<AboutData>(defaultAboutData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/content/about")
      if (res.ok) {
        const fetchedData = await res.json()
        setData({ ...defaultAboutData, ...fetchedData })
      }
    } catch (error) {
      console.error("Failed to fetch about data")
    }
  }

  const saveData = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setMessage("About page saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch {
      setMessage("Failed to save")
    }
    setSaving(false)
  }

  const tabs = [
    { id: "hero", label: "Hero" },
    { id: "about", label: "About Section" },
    { id: "stats", label: "Stats" },
    { id: "achievements", label: "Achievements" },
    { id: "vision", label: "Vision" },
    { id: "mission", label: "Mission" },
    { id: "team", label: "Team" },
    { id: "values", label: "Values" },
  ]

  const addTeamMember = () => {
    setData({
      ...data,
      team: [...data.team, { id: Date.now().toString(), name: "", role: "", image: "", bio: "", linkedin: "" }],
    })
  }

  const removeTeamMember = (id: string) => {
    setData({ ...data, team: data.team.filter((m) => m.id !== id) })
  }

  const addAchievement = () => {
    setData({
      ...data,
      achievements: [...data.achievements, { year: "", title: "", description: "" }],
    })
  }

  const removeAchievement = (index: number) => {
    setData({ ...data, achievements: data.achievements.filter((_, i) => i !== index) })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">About Page</h1>
        <p className="text-[#888]">Manage all sections of your About page</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === tab.id ? "bg-[#E63946] text-white" : "bg-[#1a1a1a] text-[#888] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[#111] border border-[#222] rounded-xl p-6">
        {activeTab === "hero" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Hero Section</h2>
            <div>
              <label className="block text-sm text-[#888] mb-2">Title (use pipe | for line breaks)</label>
              <textarea
                value={data.heroTitle}
                onChange={(e) => setData({ ...data, heroTitle: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                placeholder="We are Creative Thinkers, | Problem Solvers & Exceptional | Communicators"
              />
            </div>
            <ImageUpload
              label="Hero Background Image"
              value={data.heroBackgroundImage}
              onChange={(url) => setData({ ...data, heroBackgroundImage: url })}
            />
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">About Section</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#888] mb-2">Badge</label>
                <input
                  type="text"
                  value={data.aboutSection.badge}
                  onChange={(e) => setData({ ...data, aboutSection: { ...data.aboutSection, badge: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#888] mb-2">Title</label>
                <input
                  type="text"
                  value={data.aboutSection.title}
                  onChange={(e) => setData({ ...data, aboutSection: { ...data.aboutSection, title: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#888] mb-2">Highlighted Title (red text)</label>
              <input
                type="text"
                value={data.aboutSection.highlightedTitle}
                onChange={(e) =>
                  setData({ ...data, aboutSection: { ...data.aboutSection, highlightedTitle: e.target.value } })
                }
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#888] mb-2">Description</label>
              <textarea
                value={data.aboutSection.description}
                onChange={(e) =>
                  setData({ ...data, aboutSection: { ...data.aboutSection, description: e.target.value } })
                }
                rows={4}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <ImageUpload
              label="About Section Image"
              value={data.aboutSection.image}
              onChange={(url) => setData({ ...data, aboutSection: { ...data.aboutSection, image: url } })}
            />
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Statistics</h2>
            {data.stats.map((stat, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 p-4 bg-[#0a0a0a] rounded-lg">
                <div>
                  <label className="block text-sm text-[#888] mb-2">Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...data.stats]
                      newStats[index].value = e.target.value
                      setData({ ...data, stats: newStats })
                    }}
                    className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#888] mb-2">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...data.stats]
                      newStats[index].label = e.target.value
                      setData({ ...data, stats: newStats })
                    }}
                    className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Achievements</h2>
              <button
                onClick={addAchievement}
                className="px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#d62839] text-sm"
              >
                + Add Achievement
              </button>
            </div>

            {/* Section Settings */}
            <div className="p-4 bg-[#0a0a0a] rounded-lg space-y-3 mb-4">
              <h3 className="text-white font-medium">Section Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#666] mb-1">Badge</label>
                  <input
                    type="text"
                    value={data.achievementsSection.badge}
                    onChange={(e) =>
                      setData({ ...data, achievementsSection: { ...data.achievementsSection, badge: e.target.value } })
                    }
                    className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#666] mb-1">Button Text</label>
                  <input
                    type="text"
                    value={data.achievementsSection.buttonText}
                    onChange={(e) =>
                      setData({
                        ...data,
                        achievementsSection: { ...data.achievementsSection, buttonText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {data.achievements.map((achievement, index) => (
              <div key={index} className="p-4 bg-[#0a0a0a] rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[#888] text-sm">Achievement #{index + 1}</span>
                  <button onClick={() => removeAchievement(index)} className="text-red-500 hover:text-red-400 text-sm">
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[#666] mb-1">Year</label>
                    <input
                      type="text"
                      value={achievement.year}
                      onChange={(e) => {
                        const newAchievements = [...data.achievements]
                        newAchievements[index].year = e.target.value
                        setData({ ...data, achievements: newAchievements })
                      }}
                      placeholder="2015 - 2016"
                      className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-[#666] mb-1">Title</label>
                    <input
                      type="text"
                      value={achievement.title}
                      onChange={(e) => {
                        const newAchievements = [...data.achievements]
                        newAchievements[index].title = e.target.value
                        setData({ ...data, achievements: newAchievements })
                      }}
                      className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#666] mb-1">Description</label>
                  <input
                    type="text"
                    value={achievement.description}
                    onChange={(e) => {
                      const newAchievements = [...data.achievements]
                      newAchievements[index].description = e.target.value
                      setData({ ...data, achievements: newAchievements })
                    }}
                    className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "vision" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Vision Section</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#888] mb-2">Badge</label>
                <input
                  type="text"
                  value={data.visionSection.badge}
                  onChange={(e) =>
                    setData({ ...data, visionSection: { ...data.visionSection, badge: e.target.value } })
                  }
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#888] mb-2">Title</label>
                <input
                  type="text"
                  value={data.visionSection.title}
                  onChange={(e) =>
                    setData({ ...data, visionSection: { ...data.visionSection, title: e.target.value } })
                  }
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#888] mb-2">Highlighted Title</label>
              <input
                type="text"
                value={data.visionSection.highlightedTitle}
                onChange={(e) =>
                  setData({ ...data, visionSection: { ...data.visionSection, highlightedTitle: e.target.value } })
                }
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#888] mb-2">Description</label>
              <textarea
                value={data.vision}
                onChange={(e) => setData({ ...data, vision: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <ImageUpload
              label="Vision Section Image"
              value={data.visionSection.image}
              onChange={(url) => setData({ ...data, visionSection: { ...data.visionSection, image: url } })}
            />
          </div>
        )}

        {activeTab === "mission" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Mission Section</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#888] mb-2">Badge</label>
                <input
                  type="text"
                  value={data.missionSection.badge}
                  onChange={(e) =>
                    setData({ ...data, missionSection: { ...data.missionSection, badge: e.target.value } })
                  }
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#888] mb-2">Title</label>
                <input
                  type="text"
                  value={data.missionSection.title}
                  onChange={(e) =>
                    setData({ ...data, missionSection: { ...data.missionSection, title: e.target.value } })
                  }
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#888] mb-2">Highlighted Title</label>
              <input
                type="text"
                value={data.missionSection.highlightedTitle}
                onChange={(e) =>
                  setData({ ...data, missionSection: { ...data.missionSection, highlightedTitle: e.target.value } })
                }
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#888] mb-2">Description</label>
              <textarea
                value={data.mission}
                onChange={(e) => setData({ ...data, mission: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <ImageUpload
              label="Mission Section Image"
              value={data.missionSection.image}
              onChange={(url) => setData({ ...data, missionSection: { ...data.missionSection, image: url } })}
            />
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Team Members</h2>
              <button
                onClick={addTeamMember}
                className="px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#d62839] text-sm"
              >
                + Add Member
              </button>
            </div>

            {/* Section Settings */}
            <div className="p-4 bg-[#0a0a0a] rounded-lg space-y-3 mb-4">
              <h3 className="text-white font-medium">Section Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#666] mb-1">Badge</label>
                  <input
                    type="text"
                    value={data.teamSection.badge}
                    onChange={(e) => setData({ ...data, teamSection: { ...data.teamSection, badge: e.target.value } })}
                    className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#666] mb-1">Button Text</label>
                  <input
                    type="text"
                    value={data.teamSection.buttonText}
                    onChange={(e) =>
                      setData({ ...data, teamSection: { ...data.teamSection, buttonText: e.target.value } })
                    }
                    className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {data.team.map((member, index) => (
              <div key={member.id} className="p-4 bg-[#0a0a0a] rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[#888] text-sm">Team Member #{index + 1}</span>
                  <button
                    onClick={() => removeTeamMember(member.id)}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#666] mb-1">Name</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        const newTeam = [...data.team]
                        newTeam[index].name = e.target.value
                        setData({ ...data, team: newTeam })
                      }}
                      className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#666] mb-1">Role</label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => {
                        const newTeam = [...data.team]
                        newTeam[index].role = e.target.value
                        setData({ ...data, team: newTeam })
                      }}
                      className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                    />
                  </div>
                </div>
                <ImageUpload
                  label="Profile Image"
                  value={member.image}
                  onChange={(url) => {
                    const newTeam = [...data.team]
                    newTeam[index].image = url
                    setData({ ...data, team: newTeam })
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "values" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Company Values</h2>
            {data.values.map((value, index) => (
              <div key={index} className="p-4 bg-[#0a0a0a] rounded-lg">
                <div>
                  <label className="block text-sm text-[#888] mb-2">Value Title</label>
                  <input
                    type="text"
                    value={value.title}
                    onChange={(e) => {
                      const newValues = [...data.values]
                      newValues[index].title = e.target.value
                      setData({ ...data, values: newValues })
                    }}
                    className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-[#222]">
          <button
            onClick={saveData}
            disabled={saving}
            className="px-6 py-3 bg-[#E63946] text-white rounded-lg hover:bg-[#d62839] disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
