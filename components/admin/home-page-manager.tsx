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
  pdfUrl?: string
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

interface SectionMeta {
  title: string
  description: string
  backgroundImage: string
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
  statsBackgroundImage?: string
  servicesBackgroundImage?: string
  industriesBackgroundImage?: string
  caseStudiesBackgroundImage?: string
  testimonialsBackgroundImage?: string
  insightsBackgroundImage?: string
  trustedByBackgroundImage?: string
  playbookBackgroundImage?: string
  statsSection?: SectionMeta
  caseStudiesSection?: SectionMeta
  servicesSection?: SectionMeta
  industriesSection?: SectionMeta
  testimonialsSection?: SectionMeta
  insightsSection?: SectionMeta
  playbookSection?: SectionMeta
  trustedBySection?: SectionMeta
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

  const defaultSection = (): SectionMeta => ({ title: "", description: "", backgroundImage: "" })
  const [statsSection, setStatsSection] = useState<SectionMeta>(defaultSection)
  const [caseStudiesSection, setCaseStudiesSection] = useState<SectionMeta>(defaultSection)
  const [servicesSection, setServicesSection] = useState<SectionMeta>(defaultSection)
  const [industriesSection, setIndustriesSection] = useState<SectionMeta>(defaultSection)
  const [testimonialsSection, setTestimonialsSection] = useState<SectionMeta>(defaultSection)
  const [insightsSection, setInsightsSection] = useState<SectionMeta>(defaultSection)
  const [playbookSection, setPlaybookSection] = useState<SectionMeta>(defaultSection)
  const [trustedBySection, setTrustedBySection] = useState<SectionMeta>(defaultSection)

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [rotatingWordsInput, setRotatingWordsInput] = useState("")

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content/home")
      if (response.ok) {
        const data: HomeContent = await response.json()
        if (data.hero) {
          setHeroData(data.hero)
          setRotatingWordsInput(data.hero.rotatingWords?.join(", ") || "")
        }
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
        const withBg = (s?: SectionMeta, flat?: string) => ({ title: s?.title ?? "", description: s?.description ?? "", backgroundImage: s?.backgroundImage ?? flat ?? "" })
        if (data.statsSection || data.statsBackgroundImage) setStatsSection(withBg(data.statsSection, data.statsBackgroundImage))
        if (data.caseStudiesSection || data.caseStudiesBackgroundImage) setCaseStudiesSection(withBg(data.caseStudiesSection, data.caseStudiesBackgroundImage))
        if (data.servicesSection || data.servicesBackgroundImage) setServicesSection(withBg(data.servicesSection, data.servicesBackgroundImage))
        if (data.industriesSection || data.industriesBackgroundImage) setIndustriesSection(withBg(data.industriesSection, data.industriesBackgroundImage))
        if (data.testimonialsSection || data.testimonialsBackgroundImage) setTestimonialsSection(withBg(data.testimonialsSection, data.testimonialsBackgroundImage))
        if (data.insightsSection || data.insightsBackgroundImage) setInsightsSection(withBg(data.insightsSection, data.insightsBackgroundImage))
        if (data.playbookSection || data.playbookBackgroundImage) setPlaybookSection(withBg(data.playbookSection, data.playbookBackgroundImage))
        if (data.trustedBySection || data.trustedByBackgroundImage) setTrustedBySection(withBg(data.trustedBySection, data.trustedByBackgroundImage))
      }
    } catch (error) {
      console.error("Error fetching content:", error)
    }
  }

  const saveContent = async () => {
    setSaving(true)
    setMessage("")
    try {
      // Parse the rotating words input before saving
      const rotatingWords = rotatingWordsInput.split(",").map((w) => w.trim()).filter(w => w.length > 0)
      const updatedHeroData = { ...heroData, rotatingWords }
      
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/content/home", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          hero: updatedHeroData,
          stats: statsData,
          caseStudies: caseStudiesData,
          services: servicesData,
          industries: industriesData,
          playbook: playbookData,
          partners: [], // Trusted by section uses clients from Pages → Clients
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
          statsSection,
          caseStudiesSection,
          servicesSection,
          industriesSection,
          testimonialsSection,
          insightsSection,
          playbookSection,
          trustedBySection,
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
    { id: "case-studies", label: "Case Studies" },
    { id: "services", label: "Our Services" },
    { id: "industries", label: "Industries We Serve" },
    { id: "testimonials", label: "What Our Clients Say" },
    { id: "insights", label: "Latest Insights" },
    { id: "playbook", label: "Get Our Brand Strategy Playbook" },
    { id: "partners", label: "Trusted by Industry Leaders" },
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
        <h2 className="text-2xl font-bold admin-text-primary">Home Page Content</h2>
        <button
          onClick={saveContent}
          disabled={saving}
          className="px-6 py-2 bg-[#E63946] admin-text-primary rounded-lg hover:bg-[#E63946]/80 disabled:opacity-50"
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
      <div className="flex flex-wrap gap-2 border-b admin-border pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id ? "bg-[#E63946] admin-text-primary" : "admin-bg-secondary admin-text-secondary hover:admin-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      {activeTab === "hero" && (
        <div className="space-y-6 admin-card p-6 rounded-xl border admin-border">
          <h3 className="text-xl font-semibold admin-text-primary">Hero Section</h3>

          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">Background Image</label>
            <ImageUpload
              value={heroData.backgroundImage || ""}
              onChange={(url) => setHeroData({ ...heroData, backgroundImage: url })}
              label="Upload Background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">Title</label>
            <input
              type="text"
              value={heroData.title}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              className="w-full px-4 py-2 admin-input rounded-lg "
            />
          </div>

          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">Description</label>
            <textarea
              value={heroData.description}
              onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 admin-input rounded-lg "
            />
          </div>

          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">Rotating Words (comma separated)</label>
            <input
              type="text"
              value={rotatingWordsInput}
              onChange={(e) => setRotatingWordsInput(e.target.value)}
              placeholder="Success Story, Digital Experience, Market Leader"
              className="w-full px-4 py-2 admin-input rounded-lg "
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Primary Button Text</label>
              <input
                type="text"
                value={heroData.primaryButtonText}
                onChange={(e) => setHeroData({ ...heroData, primaryButtonText: e.target.value })}
                className="w-full px-4 py-2 admin-input rounded-lg "
              />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Primary Button URL</label>
              <input
                type="text"
                value={heroData.primaryButtonUrl}
                onChange={(e) => setHeroData({ ...heroData, primaryButtonUrl: e.target.value })}
                className="w-full px-4 py-2 admin-input rounded-lg "
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Secondary Button Text</label>
              <input
                type="text"
                value={heroData.secondaryButtonText}
                onChange={(e) => setHeroData({ ...heroData, secondaryButtonText: e.target.value })}
                className="w-full px-4 py-2 admin-input rounded-lg "
              />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Secondary Button URL</label>
              <input
                type="text"
                value={heroData.secondaryButtonUrl}
                onChange={(e) => setHeroData({ ...heroData, secondaryButtonUrl: e.target.value })}
                className="w-full px-4 py-2 admin-input rounded-lg "
              />
            </div>
          </div>
        </div>
      )}

      {/* Stats Section - Added background image upload */}
      {activeTab === "stats" && (
        <div className="space-y-6 admin-card p-6 rounded-xl border admin-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold admin-text-primary">Statistics</h3>
            <button onClick={addStat} className="px-4 py-2 bg-[#E63946] admin-text-primary rounded-lg hover:bg-[#E63946]/80">
              Add Stat
            </button>
          </div>

          <div className="p-4 admin-bg-tertiary rounded-lg border admin-border-light space-y-4">
            <h4 className="admin-text-primary font-medium">Section header (optional)</h4>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Title</label>
              <input type="text" value={statsSection.title} onChange={(e) => setStatsSection({ ...statsSection, title: e.target.value })} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="e.g. By the numbers" />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Description</label>
              <textarea value={statsSection.description} onChange={(e) => setStatsSection({ ...statsSection, description: e.target.value })} rows={2} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="Optional subtitle" />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Background Image</label>
              <ImageUpload value={statsSection.backgroundImage} onChange={(url) => setStatsSection({ ...statsSection, backgroundImage: url })} label="Upload Background" />
            </div>
          </div>

          {statsData.map((stat) => (
            <div key={stat.id} className="p-4 admin-bg-tertiary rounded-lg border admin-border-light">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(stat.id, "value", e.target.value)}
                    className="w-full px-4 py-2 admin-card border admin-border-light rounded-lg admin-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(stat.id, "label", e.target.value)}
                    className="w-full px-4 py-2 admin-card border admin-border-light rounded-lg admin-text-primary"
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

      {/* Case Studies Section - section header + background only; items from Case Studies page/collection */}
      {activeTab === "case-studies" && (
        <div className="space-y-6 admin-card p-6 rounded-xl border admin-border">
          <h3 className="text-xl font-semibold admin-text-primary">Case Studies</h3>
          <p className="admin-text-secondary text-sm">Section title, description and background. Case study items are managed on the Case Studies page.</p>
          <div className="p-4 admin-bg-tertiary rounded-lg border admin-border-light space-y-4">
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Title</label>
              <input type="text" value={caseStudiesSection.title} onChange={(e) => setCaseStudiesSection({ ...caseStudiesSection, title: e.target.value })} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="Case Studies" />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Description</label>
              <textarea value={caseStudiesSection.description} onChange={(e) => setCaseStudiesSection({ ...caseStudiesSection, description: e.target.value })} rows={2} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="Explore our portfolio of successful brand transformations." />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Background Image</label>
              <ImageUpload value={caseStudiesSection.backgroundImage} onChange={(url) => setCaseStudiesSection({ ...caseStudiesSection, backgroundImage: url })} label="Upload Background" />
            </div>
          </div>
        </div>
      )}

      {/* Our Services Section - section header + background only; items from Services collection */}
      {activeTab === "services" && (
        <div className="space-y-6 admin-card p-6 rounded-xl border admin-border">
          <h3 className="text-xl font-semibold admin-text-primary">Our Services</h3>
          <p className="admin-text-secondary text-sm">Section title, description and background. Service items are managed on the Services page.</p>
          <div className="p-4 admin-bg-tertiary rounded-lg border admin-border-light space-y-4">
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Title</label>
              <input type="text" value={servicesSection.title} onChange={(e) => setServicesSection({ ...servicesSection, title: e.target.value })} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="Our Services" />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Description</label>
              <textarea value={servicesSection.description} onChange={(e) => setServicesSection({ ...servicesSection, description: e.target.value })} rows={2} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="Comprehensive solutions to elevate your brand." />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Background Image</label>
              <ImageUpload value={servicesSection.backgroundImage} onChange={(url) => setServicesSection({ ...servicesSection, backgroundImage: url })} label="Upload Background" />
            </div>
          </div>
        </div>
      )}

      {/* Industries Section */}
      {activeTab === "industries" && (
        <div className="space-y-6 admin-card p-6 rounded-xl border admin-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold admin-text-primary">Industries We Serve</h3>
            <button
              onClick={addIndustry}
              className="px-4 py-2 bg-[#E63946] admin-text-primary rounded-lg hover:bg-[#E63946]/80"
            >
              Add Industry
            </button>
          </div>

          <div className="p-4 admin-bg-tertiary rounded-lg border admin-border-light space-y-4">
            <h4 className="admin-text-primary font-medium">Section header</h4>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Title</label>
              <input type="text" value={industriesSection.title} onChange={(e) => setIndustriesSection({ ...industriesSection, title: e.target.value })} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="Industries We Serve" />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Description</label>
              <textarea value={industriesSection.description} onChange={(e) => setIndustriesSection({ ...industriesSection, description: e.target.value })} rows={2} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="Deep industry expertise delivering tailored solutions." />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Background Image</label>
              <ImageUpload value={industriesSection.backgroundImage} onChange={(url) => setIndustriesSection({ ...industriesSection, backgroundImage: url })} label="Upload Background" />
            </div>
          </div>

          {industriesData.map((industry) => (
            <div key={industry.id} className="p-4 admin-bg-tertiary rounded-lg border admin-border-light space-y-4">
              <div>
                <label className="block text-sm font-medium admin-text-secondary mb-2">Title</label>
                <input
                  type="text"
                  value={industry.title}
                  onChange={(e) => updateIndustry(industry.id, "title", e.target.value)}
                  className="w-full px-4 py-2 admin-card border admin-border-light rounded-lg admin-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium admin-text-secondary mb-2">Description</label>
                <textarea
                  value={industry.description}
                  onChange={(e) => updateIndustry(industry.id, "description", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 admin-card border admin-border-light rounded-lg admin-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium admin-text-secondary mb-2">Image</label>
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

      {/* Testimonials Section */}
      {activeTab === "testimonials" && (
        <div className="space-y-6 admin-card p-6 rounded-xl border admin-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold admin-text-primary">What Our Clients Say</h3>
            <button
              onClick={addTestimonial}
              className="px-4 py-2 bg-[#E63946] admin-text-primary rounded-lg hover:bg-[#E63946]/80"
            >
              Add Testimonial
            </button>
          </div>

          <div className="p-4 admin-bg-tertiary rounded-lg border admin-border-light space-y-4">
            <h4 className="admin-text-primary font-medium">Section header</h4>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Title</label>
              <input type="text" value={testimonialsSection.title} onChange={(e) => setTestimonialsSection({ ...testimonialsSection, title: e.target.value })} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="What Our Clients Say" />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Description</label>
              <textarea value={testimonialsSection.description} onChange={(e) => setTestimonialsSection({ ...testimonialsSection, description: e.target.value })} rows={2} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="Hear from the brands we've helped transform." />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Background Image</label>
              <ImageUpload value={testimonialsSection.backgroundImage} onChange={(url) => setTestimonialsSection({ ...testimonialsSection, backgroundImage: url })} label="Upload Background" />
            </div>
          </div>

          {testimonialsData.map((testimonial) => (
            <div key={testimonial.id} className="p-4 admin-bg-tertiary rounded-lg border admin-border-light space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">Author</label>
                  <input
                    type="text"
                    value={testimonial.author}
                    onChange={(e) => updateTestimonial(testimonial.id, "author", e.target.value)}
                    className="w-full px-4 py-2 admin-card border admin-border-light rounded-lg admin-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">Company</label>
                  <input
                    type="text"
                    value={testimonial.company}
                    onChange={(e) => updateTestimonial(testimonial.id, "company", e.target.value)}
                    className="w-full px-4 py-2 admin-card border admin-border-light rounded-lg admin-text-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium admin-text-secondary mb-2">Quote</label>
                <textarea
                  value={testimonial.quote}
                  onChange={(e) => updateTestimonial(testimonial.id, "quote", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 admin-card border admin-border-light rounded-lg admin-text-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">Profile Image</label>
                  <ImageUpload
                    value={testimonial.image}
                    onChange={(url) => updateTestimonial(testimonial.id, "image", url)}
                    label="Upload Image"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={testimonial.rating}
                    onChange={(e) => updateTestimonial(testimonial.id, "rating", Number.parseInt(e.target.value))}
                    className="w-full px-4 py-2 admin-card border admin-border-light rounded-lg admin-text-primary"
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
        <div className="space-y-6 admin-card p-6 rounded-xl border admin-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold admin-text-primary">Latest Insights</h3>
            <button onClick={addInsight} className="px-4 py-2 bg-[#E63946] admin-text-primary rounded-lg hover:bg-[#E63946]/80">
              Add Insight
            </button>
          </div>

          <div className="p-4 admin-bg-tertiary rounded-lg border admin-border-light space-y-4">
            <h4 className="admin-text-primary font-medium">Section header</h4>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Title</label>
              <input type="text" value={insightsSection.title} onChange={(e) => setInsightsSection({ ...insightsSection, title: e.target.value })} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="Latest Insights" />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Description</label>
              <textarea value={insightsSection.description} onChange={(e) => setInsightsSection({ ...insightsSection, description: e.target.value })} rows={2} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="Expert perspectives on branding and digital transformation." />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Background Image</label>
              <ImageUpload value={insightsSection.backgroundImage} onChange={(url) => setInsightsSection({ ...insightsSection, backgroundImage: url })} label="Upload Background" />
            </div>
          </div>

          {insightsData.map((insight) => (
            <div key={insight.id} className="p-4 admin-bg-tertiary rounded-lg border admin-border-light space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">Title</label>
                  <input
                    type="text"
                    value={insight.title}
                    onChange={(e) => updateInsight(insight.id, "title", e.target.value)}
                    className="w-full px-4 py-2 admin-card border admin-border-light rounded-lg admin-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">Category</label>
                  <input
                    type="text"
                    value={insight.category}
                    onChange={(e) => updateInsight(insight.id, "category", e.target.value)}
                    className="w-full px-4 py-2 admin-card border admin-border-light rounded-lg admin-text-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium admin-text-secondary mb-2">Description</label>
                <textarea
                  value={insight.description}
                  onChange={(e) => updateInsight(insight.id, "description", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 admin-card border admin-border-light rounded-lg admin-text-primary"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">Date</label>
                  <input
                    type="text"
                    value={insight.date}
                    onChange={(e) => updateInsight(insight.id, "date", e.target.value)}
                    className="w-full px-4 py-2 admin-card border admin-border-light rounded-lg admin-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">Read Time</label>
                  <input
                    type="text"
                    value={insight.readTime}
                    onChange={(e) => updateInsight(insight.id, "readTime", e.target.value)}
                    className="w-full px-4 py-2 admin-card border admin-border-light rounded-lg admin-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium admin-text-secondary mb-2">Image</label>
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

      {/* Playbook Section */}
      {activeTab === "playbook" && (
        <div className="space-y-6 admin-card p-6 rounded-xl border admin-border">
          <h3 className="text-xl font-semibold admin-text-primary">Get Our Brand Strategy Playbook</h3>

          <div className="p-4 admin-bg-tertiary rounded-lg border admin-border-light space-y-4">
            <h4 className="admin-text-primary font-medium">Section header (shown above the CTA)</h4>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Title</label>
              <input type="text" value={playbookSection.title} onChange={(e) => setPlaybookSection({ ...playbookSection, title: e.target.value })} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="e.g. Get Our Brand Strategy Playbook" />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Description</label>
              <textarea value={playbookSection.description} onChange={(e) => setPlaybookSection({ ...playbookSection, description: e.target.value })} rows={2} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="Optional section subtitle" />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Background Image</label>
              <ImageUpload value={playbookSection.backgroundImage} onChange={(url) => setPlaybookSection({ ...playbookSection, backgroundImage: url })} label="Upload Background" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">CTA Title</label>
            <input
              type="text"
              value={playbookData.title}
              onChange={(e) => setPlaybookData({ ...playbookData, title: e.target.value })}
              className="w-full px-4 py-2 admin-input rounded-lg "
            />
          </div>

          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">Description</label>
            <textarea
              value={playbookData.description}
              onChange={(e) => setPlaybookData({ ...playbookData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 admin-input rounded-lg "
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Button Text</label>
              <input
                type="text"
                value={playbookData.buttonText}
                onChange={(e) => setPlaybookData({ ...playbookData, buttonText: e.target.value })}
                className="w-full px-4 py-2 admin-input rounded-lg "
              />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Button URL</label>
              <input
                type="text"
                value={playbookData.buttonUrl}
                onChange={(e) => setPlaybookData({ ...playbookData, buttonUrl: e.target.value })}
                className="w-full px-4 py-2 admin-input rounded-lg "
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">PDF Download URL</label>
            <ImageUpload
              value={playbookData.pdfUrl || ""}
              onChange={(url) => setPlaybookData({ ...playbookData, pdfUrl: url })}
              label="Upload PDF"
            />
            <p className="text-xs text-gray-500 mt-1">Upload the playbook PDF file that users will download after OTP verification</p>
          </div>
        </div>
      )}

      {/* Trusted by Section – uses same clients as Clients page; no separate upload */}
      {activeTab === "partners" && (
        <div className="space-y-6 admin-card p-6 rounded-xl border admin-border">
          <h3 className="text-xl font-semibold admin-text-primary">Trusted by Industry Leaders</h3>
          <p className="text-sm admin-text-muted">
            This section shows the same clients as the <strong>Clients</strong> page. Manage client logos and names under <strong>Pages → Clients</strong>. No need to upload here.
          </p>

          <div className="p-4 admin-bg-tertiary rounded-lg border admin-border-light space-y-4">
            <h4 className="admin-text-primary font-medium">Section header</h4>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Title</label>
              <input type="text" value={trustedBySection.title} onChange={(e) => setTrustedBySection({ ...trustedBySection, title: e.target.value })} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="Trusted by Industry Leaders" />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Description</label>
              <textarea value={trustedBySection.description} onChange={(e) => setTrustedBySection({ ...trustedBySection, description: e.target.value })} rows={2} className="w-full px-4 py-2 admin-input rounded-lg" placeholder="Partnering with forward-thinking brands worldwide" />
            </div>
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">Section Background Image</label>
              <ImageUpload value={trustedBySection.backgroundImage} onChange={(url) => setTrustedBySection({ ...trustedBySection, backgroundImage: url })} label="Upload Background" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
