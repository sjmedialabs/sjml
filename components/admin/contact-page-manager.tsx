"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"

interface ContactData {
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  form: {
    badge: string
    title: string
    highlightedWords: string[]
    buttonText: string
  }
  offices: Array<{
    country: string
    flag: string
    address: string
  }>
  contact: {
    title: string
    phone: string
    email: string
  }
}

const defaultData: ContactData = {
  hero: {
    title: "Empowering Your Vision, Driving Transformation",
    subtitle: "",
    backgroundImage: "/placeholder.svg?height=500&width=1920",
  },
  form: {
    badge: "Our Achievements",
    title: "Feel free to get in touch with agency",
    highlightedWords: ["touch", "with agency"],
    buttonText: "Let's Get Started !",
  },
  offices: [
    {
      country: "India",
      flag: "🇮🇳",
      address: "E-307, 3rd Floor, guttalabegempet, kavuri hills, madhapur, hyderabad, Telangana, -500033",
    },
    {
      country: "Singapore",
      flag: "🇸🇬",
      address: "160 Robinson Road, #14-04 Singapore Business Federation Centre, Singapore, 068914",
    },
    {
      country: "USA",
      flag: "🇺🇸",
      address: "1021 E Lincolnway 7542 Cheyenne, WY 82001",
    },
  ],
  contact: {
    title: "Reach out to us",
    phone: "+91 89299 96900",
    email: "info@sjmedialabs.com",
  },
}

export function ContactPageManager() {
  const [data, setData] = useState<ContactData>(defaultData)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("hero")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/content/contact")
      if (res.ok) {
        const fetchedData = await res.json()
        setData({ ...defaultData, ...fetchedData })
      }
    } catch (error) {
      console.error("Failed to fetch contact data")
    }
  }

  const saveData = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/content/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setMessage("Contact page saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch {
      setMessage("Failed to save")
    }
    setSaving(false)
  }

  const addOffice = () => {
    setData({
      ...data,
      offices: [...data.offices, { country: "", flag: "", address: "" }],
    })
  }

  const removeOffice = (index: number) => {
    setData({
      ...data,
      offices: data.offices.filter((_, i) => i !== index),
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Contact Page</h1>
        <p className="text-[#888]">Manage contact page content, offices, and form settings</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{message}</div>
      )}

      <div className="flex gap-2 mb-6">
        {["hero", "form", "offices", "contact"].map((tab) => (
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

      <div className="bg-[#111] border border-[#222] rounded-xl p-6">
        {activeTab === "hero" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Hero Section</h2>
            <div>
              <label className="block text-sm text-[#888] mb-2">Title</label>
              <input
                type="text"
                value={data.hero.title}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#888] mb-2">Subtitle</label>
              <textarea
                value={data.hero.subtitle}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
                rows={3}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <ImageUpload
              label="Background Image"
              value={data.hero.backgroundImage}
              onChange={(url) => setData({ ...data, hero: { ...data.hero, backgroundImage: url } })}
            />
          </div>
        )}

        {activeTab === "form" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Form Section</h2>
            <div>
              <label className="block text-sm text-[#888] mb-2">Badge Text</label>
              <input
                type="text"
                value={data.form.badge}
                onChange={(e) => setData({ ...data, form: { ...data.form, badge: e.target.value } })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#888] mb-2">Title</label>
              <input
                type="text"
                value={data.form.title}
                onChange={(e) => setData({ ...data, form: { ...data.form, title: e.target.value } })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#888] mb-2">Highlighted Words (comma separated)</label>
              <input
                type="text"
                value={data.form.highlightedWords.join(", ")}
                onChange={(e) =>
                  setData({
                    ...data,
                    form: {
                      ...data.form,
                      highlightedWords: e.target.value
                        .split(",")
                        .map((w) => w.trim())
                        .filter(Boolean),
                    },
                  })
                }
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                placeholder="touch, with agency"
              />
            </div>
            <div>
              <label className="block text-sm text-[#888] mb-2">Button Text</label>
              <input
                type="text"
                value={data.form.buttonText}
                onChange={(e) => setData({ ...data, form: { ...data.form, buttonText: e.target.value } })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
          </div>
        )}

        {activeTab === "offices" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Office Locations</h2>
              <button
                onClick={addOffice}
                className="px-3 py-1.5 bg-[#E63946] text-white rounded-lg hover:bg-[#d62839] text-sm"
              >
                + Add Office
              </button>
            </div>
            {data.offices.map((office, index) => (
              <div key={index} className="p-4 bg-[#0a0a0a] rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[#888] text-sm">Office #{index + 1}</span>
                  <button onClick={() => removeOffice(index)} className="text-red-500 hover:text-red-400 text-sm">
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#666] mb-1">Country</label>
                    <input
                      type="text"
                      value={office.country}
                      onChange={(e) => {
                        const newOffices = [...data.offices]
                        newOffices[index].country = e.target.value
                        setData({ ...data, offices: newOffices })
                      }}
                      className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#666] mb-1">Flag Emoji</label>
                    <input
                      type="text"
                      value={office.flag}
                      onChange={(e) => {
                        const newOffices = [...data.offices]
                        newOffices[index].flag = e.target.value
                        setData({ ...data, offices: newOffices })
                      }}
                      className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                      placeholder="🇮🇳"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#666] mb-1">Full Address</label>
                  <textarea
                    value={office.address}
                    onChange={(e) => {
                      const newOffices = [...data.offices]
                      newOffices[index].address = e.target.value
                      setData({ ...data, offices: newOffices })
                    }}
                    rows={2}
                    className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-white text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
            <div>
              <label className="block text-sm text-[#888] mb-2">Section Title</label>
              <input
                type="text"
                value={data.contact.title}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, title: e.target.value } })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#888] mb-2">Phone Number</label>
                <input
                  type="text"
                  value={data.contact.phone}
                  onChange={(e) => setData({ ...data, contact: { ...data.contact, phone: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#888] mb-2">Email Address</label>
                <input
                  type="email"
                  value={data.contact.email}
                  onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                />
              </div>
            </div>
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
