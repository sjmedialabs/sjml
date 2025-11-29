"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "./image-upload"

interface HeroData {
  title: string
  description: string
  primaryButtonText: string
  primaryButtonUrl: string
  secondaryButtonText: string
  secondaryButtonUrl: string
  rotatingWords: string[]
  backgroundImage?: string
}

interface StatItem {
  id: string
  value: string
  label: string
}

interface CaseStudyItem {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  stat1Label: string
  stat1Value: string
  stat2Label: string
  stat2Value: string
}

interface ServiceItem {
  id: string
  title: string
  description: string
  icon: string
  image: string
  link: string
}

interface IndustryItem {
  id: string
  title: string
  description: string
  image: string
}

interface PlaybookData {
  title: string
  description: string
  buttonText: string
  buttonUrl: string
  image: string
}

interface PartnerItem {
  id: string
  name: string
  logo: string
}

interface TestimonialItem {
  id: string
  quote: string
  author: string
  company: string
  image: string
  rating: number
}

interface InsightItem {
  id: string
  title: string
  description: string
  image: string
  date: string
  category: string
  readTime: string
}

interface HomeContent {
  hero: HeroData
  stats: StatItem[]
  caseStudies: CaseStudyItem[]
  services: ServiceItem[]
  industries: IndustryItem[]
  playbook: PlaybookData
  partners: PartnerItem[]
  testimonials?: TestimonialItem[]
  insights?: InsightItem[]
  // Background images for each section
  statsBackgroundImage?: string
  servicesBackgroundImage?: string
  industriesBackgroundImage?: string
  caseStudiesBackgroundImage?: string
  testimonialsBackgroundImage?: string
  insightsBackgroundImage?: string
  trustedByBackgroundImage?: string
  playbookBackgroundImage?: string
}

export function HomePageManager() {
  const [activeTab, setActiveTab] = useState("hero")
  const [heroData, setHeroData] = useState<HeroData>({
    title: "",
    description: "",
    primaryButtonText: "",
    primaryButtonUrl: "",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
    rotatingWords: [],
  })
  const [statsData, setStatsData] = useState<StatItem[]>([])
  const [caseStudiesData, setCaseStudiesData] = useState<CaseStudyItem[]>([])
  const [servicesData, setServicesData] = useState<ServiceItem[]>([])
  const [industriesData, setIndustriesData] = useState<IndustryItem[]>([])
  const [playbookData, setPlaybookData] = useState<PlaybookData>({
    title: "",
    description: "",
    buttonText: "",
    buttonUrl: "",
    image: "",
  })
  const [partnersData, setPartnersData] = useState<PartnerItem[]>([])
  const [testimonialsData, setTestimonialsData] = useState<TestimonialItem[]>([])
  const [insightsData, setInsightsData] = useState<InsightItem[]>([])

  const [statsBackgroundImage, setStatsBackgroundImage] = useState("")
  const [servicesBackgroundImage, setServicesBackgroundImage] = useState("")
  const [industriesBackgroundImage, setIndustriesBackgroundImage] = useState("")
  const [caseStudiesBackgroundImage, setCaseStudiesBackgroundImage] = useState("")
  const [testimonialsBackgroundImage, setTestimonialsBackgroundImage] = useState("")
  const [insightsBackgroundImage, setInsightsBackgroundImage] = useState("")
  const [trustedByBackgroundImage, setTrustedByBackgroundImage] = useState("")
  const [playbookBackgroundImage, setPlaybookBackgroundImage] = useState("")

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content/home")
      if (response.ok) {
        const data: HomeContent = await response.json()
        if (data.hero) setHeroData(data.hero)
        if (data.stats) setStatsData(data.stats)
        if (data.caseStudies) setCaseStudiesData(data.caseStudies)
        if (data.services) setServicesData(data.services)
        if (data.industries) setIndustriesData(data.industries)
        if (data.playbook) setPlaybookData(data.playbook)
        if (data.partners) setPartnersData(data.partners)
        if (data.testimonials) setTestimonialsData(data.testimonials)
        if (data.insights) setInsightsData(data.insights)
        if (data.statsBackgroundImage) setStatsBackgroundImage(data.statsBackgroundImage)
        if (data.servicesBackgroundImage) setServicesBackgroundImage(data.servicesBackgroundImage)
        if (data.industriesBackgroundImage) setIndustriesBackgroundImage(data.industriesBackgroundImage)
        if (data.caseStudiesBackgroundImage) setCaseStudiesBackgroundImage(data.caseStudiesBackgroundImage)
        if (data.testimonialsBackgroundImage) setTestimonialsBackgroundImage(data.testimonialsBackgroundImage)
        if (data.insightsBackgroundImage) setInsightsBackgroundImage(data.insightsBackgroundImage)
        if (data.trustedByBackgroundImage) setTrustedByBackgroundImage(data.trustedByBackgroundImage)
        if (data.playbookBackgroundImage) setPlaybookBackgroundImage(data.playbookBackgroundImage)
      }
    } catch (error) {
      console.error("Error fetching content:", error)
    }
  }

  const saveContent = async () => {
    setSaving(true)
    setMessage("")
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/content/home", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          hero: heroData,
          stats: statsData,
          caseStudies: caseStudiesData,
          services: servicesData,
          industries: industriesData,
          playbook: playbookData,
          partners: partnersData,
          testimonials: testimonialsData,
          insights: insightsData,
          statsBackgroundImage,
          servicesBackgroundImage,
          industriesBackgroundImage,
          caseStudiesBackgroundImage,
          testimonialsBackgroundImage,
          insightsBackgroundImage,
          trustedByBackgroundImage,
          playbookBackgroundImage,
        }),
      })
      if (response.ok) {
        setMessage("Content saved successfully!")
      } else {
        setMessage("Error saving content")
      }
    } catch (error) {
      setMessage("Error saving content")
    }
    setSaving(false)
  }

  const tabs = [
    { id: "hero", label: "Hero Section" },
    { id: "stats", label: "Statistics" },
    { id: "section-settings", label: "Section Settings" },
    { id: "industries", label: "Industries" },
    { id: "testimonials", label: "Testimonials" },
    { id: "insights", label: "Insights" },
    { id: "playbook", label: "Brand Playbook" },
    { id: "partners", label: "Trusted By" },
  ]

  const addStat = () => {
    const newStat: StatItem = {
      id: Date.now().toString(),
      value: "0",
      label: "New Stat",
    }
    setStatsData([...statsData, newStat])
  }

  const updateStat = (id: string, field: keyof StatItem, value: string) => {
    setStatsData(statsData.map((stat) => (stat.id === id ? { ...stat, [field]: value } : stat)))
  }

  const removeStat = (id: string) => {
    setStatsData(statsData.filter((stat) => stat.id !== id))
  }

  const addCaseStudy = () => {
    const newCaseStudy: CaseStudyItem = {
      id: Date.now().toString(),
      title: "New Case Study",
      description: "Description here",
      image: "",
      tags: ["Tag"],
      stat1Label: "Metric 1",
      stat1Value: "0%",
      stat2Label: "Metric 2",
      stat2Value: "0%",
    }
    setCaseStudiesData([...caseStudiesData, newCaseStudy])
  }

  const updateCaseStudy = (id: string, field: keyof CaseStudyItem, value: string | string[]) => {
    setCaseStudiesData(caseStudiesData.map((cs) => (cs.id === id ? { ...cs, [field]: value } : cs)))
  }

  const removeCaseStudy = (id: string) => {
    setCaseStudiesData(caseStudiesData.filter((cs) => cs.id !== id))
  }

  const addService = () => {
    const newService: ServiceItem = {
      id: Date.now().toString(),
      title: "New Service",
      description: "Service description",
      icon: "",
      image: "",
      link: "#",
    }
    setServicesData([...servicesData, newService])
  }

  const updateService = (id: string, field: keyof ServiceItem, value: string) => {
    setServicesData(servicesData.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const removeService = (id: string) => {
    setServicesData(servicesData.filter((s) => s.id !== id))
  }

  const addIndustry = () => {
    const newIndustry: IndustryItem = {
      id: Date.now().toString(),
      title: "New Industry",
      description: "Industry description",
      image: "",
    }
    setIndustriesData([...industriesData, newIndustry])
  }

  const updateIndustry = (id: string, field: keyof IndustryItem, value: string) => {
    setIndustriesData(industriesData.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  const removeIndustry = (id: string) => {
    setIndustriesData(industriesData.filter((i) => i.id !== id))
  }

  const addPartner = () => {
    const newPartner: PartnerItem = {
      id: Date.now().toString(),
      name: "New Partner",
      logo: "",
    }
    setPartnersData([...partnersData, newPartner])
  }

  const updatePartner = (id: string, field: keyof PartnerItem, value: string) => {
    setPartnersData(partnersData.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const removePartner = (id: string) => {
    setPartnersData(partnersData.filter((p) => p.id !== id))
  }

  const addTestimonial = () => {
    const newTestimonial: TestimonialItem = {
      id: Date.now().toString(),
      quote: "New testimonial quote",
      author: "Client Name",
      company: "Company Name",
      image: "",
      rating: 5,
    }
    setTestimonialsData([...testimonialsData, newTestimonial])
  }

  const updateTestimonial = (id: string, field: keyof TestimonialItem, value: string | number) => {
    setTestimonialsData(testimonialsData.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const removeTestimonial = (id: string) => {
    setTestimonialsData(testimonialsData.filter((item) => item.id !== id))
  }

  const addInsight = () => {
    const newInsight: InsightItem = {
      id: Date.now().toString(),
      title: "New Insight",
      description: "Insight description",
      image: "",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      category: "Branding",
      readTime: "5 min read",
    }
    setInsightsData([...insightsData, newInsight])
  }

  const updateInsight = (id: string, field: keyof InsightItem, value: string) => {
    setInsightsData(insightsData.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const removeInsight = (id: string) => {
    setInsightsData(insightsData.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Home Page Content</h2>
        <button
          onClick={saveContent}
          disabled={saving}
          className="px-6 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#E63946]/80 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${message.includes("success") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
        >
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#222] pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id ? "bg-[#E63946] text-white" : "bg-[#1a1a1a] text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      {activeTab === "hero" && (
        <div className="space-y-6 bg-[#141414] p-6 rounded-xl border border-[#222]">
          <h3 className="text-xl font-semibold text-white">Hero Section</h3>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Background Image</label>
            <ImageUpload
              value={heroData.backgroundImage || ""}
              onChange={(url) => setHeroData({ ...heroData, backgroundImage: url })}
              label="Upload Background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
            <input
              type="text"
              value={heroData.title}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea
              value={heroData.description}
              onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Rotating Words (comma separated)</label>
            <input
              type="text"
              value={heroData.rotatingWords?.join(", ") || ""}
              onChange={(e) =>
                setHeroData({ ...heroData, rotatingWords: e.target.value.split(",").map((w) => w.trim()) })
              }
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Primary Button Text</label>
              <input
                type="text"
                value={heroData.primaryButtonText}
                onChange={(e) => setHeroData({ ...heroData, primaryButtonText: e.target.value })}
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Primary Button URL</label>
              <input
                type="text"
                value={heroData.primaryButtonUrl}
                onChange={(e) => setHeroData({ ...heroData, primaryButtonUrl: e.target.value })}
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Secondary Button Text</label>
              <input
                type="text"
                value={heroData.secondaryButtonText}
                onChange={(e) => setHeroData({ ...heroData, secondaryButtonText: e.target.value })}
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Secondary Button URL</label>
              <input
                type="text"
                value={heroData.secondaryButtonUrl}
                onChange={(e) => setHeroData({ ...heroData, secondaryButtonUrl: e.target.value })}
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Stats Section - Added background image upload */}
      {activeTab === "stats" && (
        <div className="space-y-6 bg-[#141414] p-6 rounded-xl border border-[#222]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Statistics</h3>
            <button onClick={addStat} className="px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#E63946]/80">
              Add Stat
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Section Background Image</label>
            <ImageUpload
              value={statsBackgroundImage}
              onChange={(url) => setStatsBackgroundImage(url)}
              label="Upload Background"
            />
          </div>

          {statsData.map((stat) => (
            <div key={stat.id} className="p-4 bg-[#0a0a0a] rounded-lg border border-[#333]">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(stat.id, "value", e.target.value)}
                    className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(stat.id, "label", e.target.value)}
                    className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white"
                  />
                </div>
              </div>
              <button onClick={() => removeStat(stat.id)} className="text-red-400 hover:text-red-300 text-sm">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Section Settings - Background Images Only */}
      {activeTab === "section-settings" && (
        <div className="space-y-6 bg-[#141414] p-6 rounded-xl border border-[#222]">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Section Background Images</h3>
            <p className="text-gray-400 text-sm mb-6">Control background images for different sections. Manage actual content (Works, Services, Case Studies) in their respective pages.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Case Studies Section Background</label>
              <ImageUpload
                value={caseStudiesBackgroundImage}
                onChange={(url) => setCaseStudiesBackgroundImage(url)}
                label="Upload Background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Services Section Background</label>
              <ImageUpload
                value={servicesBackgroundImage}
                onChange={(url) => setServicesBackgroundImage(url)}
                label="Upload Background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Stats Section Background</label>
              <ImageUpload
                value={statsBackgroundImage}
                onChange={(url) => setStatsBackgroundImage(url)}
                label="Upload Background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Industries Section Background</label>
              <ImageUpload
                value={industriesBackgroundImage}
                onChange={(url) => setIndustriesBackgroundImage(url)}
                label="Upload Background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Testimonials Section Background</label>
              <ImageUpload
                value={testimonialsBackgroundImage}
                onChange={(url) => setTestimonialsBackgroundImage(url)}
                label="Upload Background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Insights Section Background</label>
              <ImageUpload
                value={insightsBackgroundImage}
                onChange={(url) => setInsightsBackgroundImage(url)}
                label="Upload Background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Trusted By Section Background</label>
              <ImageUpload
                value={trustedByBackgroundImage}
                onChange={(url) => setTrustedByBackgroundImage(url)}
                label="Upload Background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Brand Playbook Section Background</label>
              <ImageUpload
                value={playbookBackgroundImage}
                onChange={(url) => setPlaybookBackgroundImage(url)}
                label="Upload Background"
              />
            </div>
          </div>
        </div>
      )}


      {/* Industries Section - Added background image upload */}
      {activeTab === "industries" && (
        <div className="space-y-6 bg-[#141414] p-6 rounded-xl border border-[#222]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Industries</h3>
            <button
              onClick={addIndustry}
              className="px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#E63946]/80"
            >
              Add Industry
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Section Background Image</label>
            <ImageUpload
              value={industriesBackgroundImage}
              onChange={(url) => setIndustriesBackgroundImage(url)}
              label="Upload Background"
            />
          </div>

          {industriesData.map((industry) => (
            <div key={industry.id} className="p-4 bg-[#0a0a0a] rounded-lg border border-[#333] space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={industry.title}
                  onChange={(e) => updateIndustry(industry.id, "title", e.target.value)}
                  className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={industry.description}
                  onChange={(e) => updateIndustry(industry.id, "description", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Image</label>
                <ImageUpload
                  value={industry.image}
                  onChange={(url) => updateIndustry(industry.id, "image", url)}
                  label="Upload Image"
                />
              </div>
              <button onClick={() => removeIndustry(industry.id)} className="text-red-400 hover:text-red-300 text-sm">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Testimonials Section - Added background image upload */}
      {activeTab === "testimonials" && (
        <div className="space-y-6 bg-[#141414] p-6 rounded-xl border border-[#222]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Testimonials</h3>
            <button
              onClick={addTestimonial}
              className="px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#E63946]/80"
            >
              Add Testimonial
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Section Background Image</label>
            <ImageUpload
              value={testimonialsBackgroundImage}
              onChange={(url) => setTestimonialsBackgroundImage(url)}
              label="Upload Background"
            />
          </div>

          {testimonialsData.map((testimonial) => (
            <div key={testimonial.id} className="p-4 bg-[#0a0a0a] rounded-lg border border-[#333] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Author</label>
                  <input
                    type="text"
                    value={testimonial.author}
                    onChange={(e) => updateTestimonial(testimonial.id, "author", e.target.value)}
                    className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
                  <input
                    type="text"
                    value={testimonial.company}
                    onChange={(e) => updateTestimonial(testimonial.id, "company", e.target.value)}
                    className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Quote</label>
                <textarea
                  value={testimonial.quote}
                  onChange={(e) => updateTestimonial(testimonial.id, "quote", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Profile Image</label>
                  <ImageUpload
                    value={testimonial.image}
                    onChange={(url) => updateTestimonial(testimonial.id, "image", url)}
                    label="Upload Image"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={testimonial.rating}
                    onChange={(e) => updateTestimonial(testimonial.id, "rating", Number.parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white"
                  />
                </div>
              </div>
              <button
                onClick={() => removeTestimonial(testimonial.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "insights" && (
        <div className="space-y-6 bg-[#141414] p-6 rounded-xl border border-[#222]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Insights / Blog Posts</h3>
            <button onClick={addInsight} className="px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#E63946]/80">
              Add Insight
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Section Background Image</label>
            <ImageUpload
              value={insightsBackgroundImage}
              onChange={(url) => setInsightsBackgroundImage(url)}
              label="Upload Background"
            />
          </div>

          {insightsData.map((insight) => (
            <div key={insight.id} className="p-4 bg-[#0a0a0a] rounded-lg border border-[#333] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={insight.title}
                    onChange={(e) => updateInsight(insight.id, "title", e.target.value)}
                    className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                  <input
                    type="text"
                    value={insight.category}
                    onChange={(e) => updateInsight(insight.id, "category", e.target.value)}
                    className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={insight.description}
                  onChange={(e) => updateInsight(insight.id, "description", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                  <input
                    type="text"
                    value={insight.date}
                    onChange={(e) => updateInsight(insight.id, "date", e.target.value)}
                    className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Read Time</label>
                  <input
                    type="text"
                    value={insight.readTime}
                    onChange={(e) => updateInsight(insight.id, "readTime", e.target.value)}
                    className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Image</label>
                  <ImageUpload
                    value={insight.image}
                    onChange={(url) => updateInsight(insight.id, "image", url)}
                    label="Upload Image"
                  />
                </div>
              </div>
              <button onClick={() => removeInsight(insight.id)} className="text-red-400 hover:text-red-300 text-sm">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Playbook Section - Added background image upload */}
      {activeTab === "playbook" && (
        <div className="space-y-6 bg-[#141414] p-6 rounded-xl border border-[#222]">
          <h3 className="text-xl font-semibold text-white">Brand Playbook</h3>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Section Background Image</label>
            <ImageUpload
              value={playbookBackgroundImage}
              onChange={(url) => setPlaybookBackgroundImage(url)}
              label="Upload Background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
            <input
              type="text"
              value={playbookData.title}
              onChange={(e) => setPlaybookData({ ...playbookData, title: e.target.value })}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea
              value={playbookData.description}
              onChange={(e) => setPlaybookData({ ...playbookData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Button Text</label>
              <input
                type="text"
                value={playbookData.buttonText}
                onChange={(e) => setPlaybookData({ ...playbookData, buttonText: e.target.value })}
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Button URL</label>
              <input
                type="text"
                value={playbookData.buttonUrl}
                onChange={(e) => setPlaybookData({ ...playbookData, buttonUrl: e.target.value })}
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Partners Section - Added background image upload */}
      {activeTab === "partners" && (
        <div className="space-y-6 bg-[#141414] p-6 rounded-xl border border-[#222]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Trusted By (Partners)</h3>
            <button onClick={addPartner} className="px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#E63946]/80">
              Add Partner
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Section Background Image</label>
            <ImageUpload
              value={trustedByBackgroundImage}
              onChange={(url) => setTrustedByBackgroundImage(url)}
              label="Upload Background"
            />
          </div>

          {partnersData.map((partner) => (
            <div key={partner.id} className="p-4 bg-[#0a0a0a] rounded-lg border border-[#333] space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={partner.name}
                  onChange={(e) => updatePartner(partner.id, "name", e.target.value)}
                  className="w-full px-4 py-2 bg-[#141414] border border-[#333] rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Logo</label>
                <ImageUpload
                  value={partner.logo}
                  onChange={(url) => updatePartner(partner.id, "logo", url)}
                  label="Upload Logo"
                />
              </div>
              <button onClick={() => removePartner(partner.id)} className="text-red-400 hover:text-red-300 text-sm">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
