"use client"

import { useState, useEffect } from "react"

// ── Shared class names (matching existing site styling) ──────────────────
const inputCls =
  "w-full px-4 py-3 bg-transparent border border-border rounded-lg text-foreground placeholder-[#666] focus:outline-none focus:border-[#E63946] transition-colors"
const selectCls =
  "w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-[#E63946] transition-colors"
const textareaCls =
  "w-full px-4 py-3 bg-transparent border border-border rounded-lg text-foreground placeholder-[#666] focus:outline-none focus:border-[#E63946] resize-none transition-colors"
const labelCls = "block text-sm font-medium text-foreground mb-1.5"
const hintCls = "text-xs text-muted-foreground mt-1 mb-4"
const sectionCls = "bg-card border border-border rounded-2xl p-6 md:p-8 mb-8"
const sectionTitleCls = "flex items-center gap-3 mb-6 pb-3 border-b border-border"
const badgeCls = "flex items-center justify-center w-8 h-8 bg-[#E63946] text-white text-sm font-bold rounded-full shrink-0"
const headingCls = "text-lg md:text-xl font-bold text-foreground"
const checkItemCls =
  "flex items-center gap-3 p-3 bg-secondary/50 border border-border rounded-lg cursor-pointer hover:border-[#E63946]/50 transition-colors"

// ── Reusable tiny components ────────────────────────────────────────────
function SectionCard({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className={sectionCls}>
      <div className={sectionTitleCls}>
        <span className={badgeCls}>{num}</span>
        <h2 className={headingCls}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (val: string) => void
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
      {options.map((opt) => (
        <label key={opt.value} className={checkItemCls}>
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => onChange(opt.value)}
            className="w-4 h-4 accent-[#E63946] shrink-0"
          />
          <span className="text-sm text-foreground">{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="text-xs text-[#E63946] mt-1">{msg}</p>
}

// ── Initial state ───────────────────────────────────────────────────────
const initial = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  website: "",
  industry: "",
  productName: "",
  businessDesc: "",
  productStage: "",
  usp: "",
  pricingModel: "",
  goals: [] as string[],
  goalsDetails: "",
  businessType: "",
  yearsInOperation: "",
  budget: "",
  timeline: "",
  revenueTarget: "",
  userTarget: "",
  costPerLead: "",
  customerLTV: "",
  hasWebsite: "",
  socialMediaLinks: "",
  channels: "",
  campaigns: "",
  analytics: "",
  googleAnalytics: "",
  conversionTracking: "",
  googleAdsAccount: "",
  metaBusinessManager: "",
  services: [] as string[],
  targetGeography: "",
  targetCustomerType: [] as string[],
  ageGroup: "",
  genderFocus: "",
  demographics: "",
  decisionMakers: "",
  technicalLevel: "",
  painPoints: "",
  interests: "",
  competitors: "",
  compStrengths: "",
  brandVoice: "",
  hasBrandGuidelines: "",
  brandAssets: "",
  successMetrics: [] as string[],
  expectedROAS: "",
  expectedTimeline: "",
  reportingFrequency: "",
  yearlyMarketingBudget: "",
  monthlyAdSpend: "",
  promotionalBudget: "",
  budgetAllocation: [] as string[],
  budgetFlexibility: "",
  previousMarketingSpend: "",
  budgetApprovalProcess: "",
  budgetNotes: "",
  offerSoftwareDev: "",
  technologies: [] as string[],
  techStackDetails: "",
  industriesServed: [] as string[],
  minTicketSize: "",
  projectTypes: [] as string[],
  teamSize: "",
  avgProjectDuration: "",
  challenges: "",
  additionalInfo: "",
  _honeypot: "",
}

type FormData = typeof initial

// ── Main component ──────────────────────────────────────────────────────
export function DigitalMarketingForm() {
  const [fd, setFd] = useState<FormData>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState("")
  const [loadedAt, setLoadedAt] = useState(0)

  useEffect(() => { setLoadedAt(Date.now()) }, [])

  // helpers
  const set = (field: keyof FormData, value: string) =>
    setFd((p) => ({ ...p, [field]: value }))

  const toggle = (field: keyof FormData, value: string) =>
    setFd((p) => {
      const arr = p[field] as string[]
      return { ...p, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] }
    })

  // validation
  const validate = (): boolean => {
    const e: typeof errors = {}
    if (!fd.companyName.trim()) e.companyName = "Company name is required"
    if (!fd.contactPerson.trim()) e.contactPerson = "Contact person is required"
    if (!fd.email.trim()) e.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fd.email.trim())) e.email = "Enter a valid email address"
    if (!fd.phone.trim()) { e.phone = "Phone number is required" } else if (fd.phone.trim()) {
      const digits = fd.phone.replace(/\D/g, "")
      if (digits.length < 10) e.phone = "Phone must have at least 10 digits"
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // submit
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setServerError("")
    if (!validate()) {
      // scroll to first error
      const firstKey = Object.keys(errors)[0]
      if (firstKey) document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/digital-marketing-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fd, _loadedAt: loadedAt }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Submission failed")
      }
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err: any) {
      setServerError(err.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success view ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="text-center py-16 bg-card border border-border rounded-2xl">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">Thank You!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thank you for submitting your requirements. Our team will review your information and get back to you shortly.
        </p>
      </div>
    )
  }

  // ── Form ────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot — hidden from humans */}
      <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
        <label>
          Leave this blank
          <input
            type="text"
            name="_honeypot"
            value={fd._honeypot}
            onChange={(e) => set("_honeypot", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {/* ── 1. Company Information ──────────────────────────────────── */}
      <SectionCard num={1} title="Company Information">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelCls} htmlFor="companyName">Company Name *</label>
            <input id="companyName" type="text" className={inputCls} placeholder="e.g. Acme Corp" required value={fd.companyName} onChange={(e) => set("companyName", e.target.value)} />
            <FieldError msg={errors.companyName} />
          </div>
          <div>
            <label className={labelCls} htmlFor="contactPerson">Contact Person *</label>
            <input id="contactPerson" type="text" className={inputCls} placeholder="Full Name" required value={fd.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} />
            <FieldError msg={errors.contactPerson} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelCls} htmlFor="email">Email Address *</label>
            <input id="email" type="email" className={inputCls} placeholder="name@company.com" required value={fd.email} onChange={(e) => set("email", e.target.value)} />
            <FieldError msg={errors.email} />
          </div>
          <div>
            <label className={labelCls} htmlFor="phone">Phone Number *</label>
            <input id="phone" type="tel" className={inputCls} placeholder="+1 (555) 000-0000" value={fd.phone} onChange={(e) => set("phone", e.target.value)} />
            <FieldError msg={errors.phone} />
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor="website">Current Website URL</label>
          <input id="website" type="url" className={inputCls} placeholder="https://www.yourcompany.com" value={fd.website} onChange={(e) => set("website", e.target.value)} />
        </div>
      </SectionCard>

      {/* ── 2. Project Overview ─────────────────────────────────────── */}
      <SectionCard num={2} title="Project Overview">
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="industry">Industry / Business Type</label>
            <select id="industry" className={selectCls} value={fd.industry} onChange={(e) => set("industry", e.target.value)}>
              <option value="">Select industry</option>
              <option value="SaaS">SaaS (Software as a Service)</option>
              <option value="Enterprise Software">Enterprise Software</option>
              <option value="Mobile Apps">Mobile Applications</option>
              <option value="Cloud Services">Cloud Services</option>
              <option value="AI/ML Products">AI/ML Products</option>
              <option value="Cybersecurity">Cybersecurity Solutions</option>
              <option value="DevOps Tools">DevOps Tools</option>
              <option value="Fintech">Fintech Products</option>
              <option value="EdTech">EdTech Products</option>
              <option value="HealthTech">HealthTech Products</option>
              <option value="IoT Solutions">IoT Solutions</option>
              <option value="Custom Software Development">Custom Software Development</option>
              <option value="Other IT Product">Other IT Product</option>
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="productName">Product Name(s)</label>
            <input id="productName" type="text" className={inputCls} placeholder="e.g., CloudSync Pro, DataGuard AI" value={fd.productName} onChange={(e) => set("productName", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="businessDesc">Product Description</label>
            <textarea id="businessDesc" className={textareaCls} rows={3} placeholder="What does your product do? What problem does it solve? What features make it stand out?" value={fd.businessDesc} onChange={(e) => set("businessDesc", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="productStage">Product Development Stage</label>
            <select id="productStage" className={selectCls} value={fd.productStage} onChange={(e) => set("productStage", e.target.value)}>
              <option value="">Select stage</option>
              <option value="Idea/Concept">Idea/Concept Stage</option>
              <option value="MVP">MVP (Minimum Viable Product)</option>
              <option value="Beta">Beta Testing</option>
              <option value="Launched">Launched (Early Stage)</option>
              <option value="Growth">Growth Stage</option>
              <option value="Maturity">Maturity Stage</option>
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="usp">Unique Selling Proposition (USP)</label>
            <input id="usp" type="text" className={inputCls} placeholder="What makes your product unique? (e.g., AI-powered, 10x faster)" value={fd.usp} onChange={(e) => set("usp", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="pricingModel">Pricing Model</label>
            <select id="pricingModel" className={selectCls} value={fd.pricingModel} onChange={(e) => set("pricingModel", e.target.value)}>
              <option value="">Select pricing model</option>
              <option value="Freemium">Freemium</option>
              <option value="Subscription">Subscription (Monthly/Yearly)</option>
              <option value="One-time">One-time Purchase</option>
              <option value="Usage-based">Usage-based/Pay-as-you-go</option>
              <option value="Enterprise">Enterprise Licensing</option>
              <option value="Tiered">Tiered Pricing</option>
              <option value="Custom">Custom Pricing</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Primary Business Goals</label>
            <CheckboxGroup
              options={[
                { value: "User Acquisition", label: "User Acquisition" },
                { value: "Product Launch", label: "Product Launch" },
                { value: "Free Trial Signups", label: "Free Trial/Demo Signups" },
                { value: "Paid Conversions", label: "Paid Conversions" },
                { value: "Increase MRR", label: "Increase MRR/ARR" },
                { value: "App Downloads", label: "App Downloads" },
              ]}
              selected={fd.goals}
              onChange={(v) => toggle("goals", v)}
            />
            <textarea id="goalsDetails" className={textareaCls} rows={2} placeholder="Specify targets: e.g., 500 signups/month, $10K MRR, 10K app downloads" value={fd.goalsDetails} onChange={(e) => set("goalsDetails", e.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="businessType">Business Model</label>
              <select id="businessType" className={selectCls} value={fd.businessType} onChange={(e) => set("businessType", e.target.value)}>
                <option value="">Select type</option>
                <option value="B2B">B2B (Business to Business)</option>
                <option value="B2C">B2C (Business to Consumer)</option>
                <option value="Both">Both B2B &amp; B2C</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="yearsInOperation">Years in Operation</label>
              <select id="yearsInOperation" className={selectCls} value={fd.yearsInOperation} onChange={(e) => set("yearsInOperation", e.target.value)}>
                <option value="">Select range</option>
                <option value="less_than_1">Less than 1 year</option>
                <option value="1_3">1-3 years</option>
                <option value="3_5">3-5 years</option>
                <option value="5_10">5-10 years</option>
                <option value="10_plus">10+ years</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="budget">Monthly Budget Range</label>
              <select id="budget" className={selectCls} value={fd.budget} onChange={(e) => set("budget", e.target.value)}>
                <option value="">Select a range</option>
                <option value="under_1k">Under $1,000</option>
                <option value="1k_3k">$1,000 - $3,000</option>
                <option value="3k_5k">$3,000 - $5,000</option>
                <option value="5k_10k">$5,000 - $10,000</option>
                <option value="10k_plus">$10,000+</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="timeline">Expected Timeline/Start Date</label>
              <input id="timeline" type="text" className={inputCls} placeholder="e.g. ASAP, Next Quarter, Specific Date" value={fd.timeline} onChange={(e) => set("timeline", e.target.value)} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="revenueTarget">Monthly Revenue Target (MRR/ARR)</label>
              <input id="revenueTarget" type="text" className={inputCls} placeholder="e.g., $50,000 MRR or $600K ARR" value={fd.revenueTarget} onChange={(e) => set("revenueTarget", e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="userTarget">Monthly User/Signup Target</label>
              <input id="userTarget" type="text" className={inputCls} placeholder="e.g., 500 signups, 1000 free trials" value={fd.userTarget} onChange={(e) => set("userTarget", e.target.value)} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="costPerLead">Target Cost Per Acquisition (CPA)</label>
              <input id="costPerLead" type="text" className={inputCls} placeholder="e.g., $50 per signup" value={fd.costPerLead} onChange={(e) => set("costPerLead", e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="customerLTV">Customer Lifetime Value (LTV)</label>
              <input id="customerLTV" type="text" className={inputCls} placeholder="e.g., $500" value={fd.customerLTV} onChange={(e) => set("customerLTV", e.target.value)} />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── 3. Current Marketing Status ─────────────────────────────── */}
      <SectionCard num={3} title="Current Marketing Status">
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="hasWebsite">Do you have a website?</label>
            <select id="hasWebsite" className={selectCls} value={fd.hasWebsite} onChange={(e) => set("hasWebsite", e.target.value)}>
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="in_development">In Development</option>
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="socialMediaLinks">Social Media Links</label>
            <textarea id="socialMediaLinks" className={textareaCls} rows={3} placeholder="Provide links to your Facebook, Instagram, LinkedIn, Twitter, YouTube, etc." value={fd.socialMediaLinks} onChange={(e) => set("socialMediaLinks", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="channels">Existing Marketing Channels</label>
            <input id="channels" type="text" className={inputCls} placeholder="e.g. Facebook, Instagram, LinkedIn, Google Ads" value={fd.channels} onChange={(e) => set("channels", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="campaigns">Previous Campaigns &amp; Results</label>
            <textarea id="campaigns" className={textareaCls} rows={3} placeholder="Briefly describe what you've tried before and how it performed." value={fd.campaigns} onChange={(e) => set("campaigns", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="analytics">Analytics Tools Currently Used</label>
            <input id="analytics" type="text" className={inputCls} placeholder="e.g. Google Analytics, HubSpot, Semrush" value={fd.analytics} onChange={(e) => set("analytics", e.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="googleAnalytics">Google Analytics Access Available?</label>
              <select id="googleAnalytics" className={selectCls} value={fd.googleAnalytics} onChange={(e) => set("googleAnalytics", e.target.value)}>
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="need_setup">Need Setup</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="conversionTracking">Conversion Tracking Set Up?</label>
              <select id="conversionTracking" className={selectCls} value={fd.conversionTracking} onChange={(e) => set("conversionTracking", e.target.value)}>
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="partial">Partial</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="googleAdsAccount">Google Ads Account Available?</label>
              <select id="googleAdsAccount" className={selectCls} value={fd.googleAdsAccount} onChange={(e) => set("googleAdsAccount", e.target.value)}>
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="metaBusinessManager">Meta Business Manager Available?</label>
              <select id="metaBusinessManager" className={selectCls} value={fd.metaBusinessManager} onChange={(e) => set("metaBusinessManager", e.target.value)}>
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── 4. Services Required ────────────────────────────────────── */}
      <SectionCard num={4} title="Services Required">
        <p className="text-sm text-muted-foreground mb-4">Select all that apply:</p>
        <CheckboxGroup
          options={[
            { value: "SEO", label: "SEO (Search Engine Optimization)" },
            { value: "Google Ads", label: "Google Ads" },
            { value: "Meta Ads", label: "Meta Ads (Facebook/Instagram)" },
            { value: "LinkedIn Ads", label: "LinkedIn Ads" },
            { value: "Social Media", label: "Social Media Management" },
            { value: "Content Marketing", label: "Content Marketing" },
            { value: "Email Marketing", label: "Email Marketing/Drip Campaigns" },
            { value: "Product Hunt Launch", label: "Product Hunt Launch" },
            { value: "Community Marketing", label: "Community Marketing (Reddit, Forums)" },
            { value: "App Store Optimization", label: "App Store Optimization (ASO)" },
            { value: "Influencer Marketing", label: "Influencer Marketing" },
            { value: "Web Design", label: "Web Design/Development" },
            { value: "Landing Page", label: "Landing Page Development" },
            { value: "Analytics", label: "Analytics & Tracking Setup" },
            { value: "Custom Software Development", label: "Custom Software Development" },
          ]}
          selected={fd.services}
          onChange={(v) => toggle("services", v)}
        />
      </SectionCard>

      {/* ── 5. Target Audience Details ──────────────────────────────── */}
      <SectionCard num={5} title="Target Audience Details">
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="targetGeography">Target Geography/Markets</label>
            <input id="targetGeography" type="text" className={inputCls} placeholder="e.g., India, USA, Europe, Global, Specific Cities/States" value={fd.targetGeography} onChange={(e) => set("targetGeography", e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Target Customer Type</label>
            <CheckboxGroup
              options={[
                { value: "Startups", label: "Startups" },
                { value: "SMB", label: "SMB (Small & Medium Business)" },
                { value: "Enterprise", label: "Enterprise" },
                { value: "Developers", label: "Developers/Technical Users" },
                { value: "Individual", label: "Individual Users" },
                { value: "Agencies", label: "Agencies" },
              ]}
              selected={fd.targetCustomerType}
              onChange={(v) => toggle("targetCustomerType", v)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="ageGroup">Target Age Group</label>
              <select id="ageGroup" className={selectCls} value={fd.ageGroup} onChange={(e) => set("ageGroup", e.target.value)}>
                <option value="">Select age range</option>
                <option value="13-17">13-17</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55-64">55-64</option>
                <option value="65+">65+</option>
                <option value="all">All Ages</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="genderFocus">Gender Focus</label>
              <select id="genderFocus" className={selectCls} value={fd.genderFocus} onChange={(e) => set("genderFocus", e.target.value)}>
                <option value="">Select gender</option>
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="demographics">Income Level / Buying Capacity</label>
            <input id="demographics" type="text" className={inputCls} placeholder="e.g., Middle Class, Premium Segment, Budget-Conscious" value={fd.demographics} onChange={(e) => set("demographics", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="decisionMakers">Decision Makers (If B2B)</label>
            <input id="decisionMakers" type="text" className={inputCls} placeholder="e.g., CTO, CIO, IT Manager, VP Engineering, DevOps Lead" value={fd.decisionMakers} onChange={(e) => set("decisionMakers", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="technicalLevel">Target User Technical Level</label>
            <select id="technicalLevel" className={selectCls} value={fd.technicalLevel} onChange={(e) => set("technicalLevel", e.target.value)}>
              <option value="">Select level</option>
              <option value="Non-technical">Non-technical Users</option>
              <option value="Semi-technical">Semi-technical Users</option>
              <option value="Technical">Technical/Developers</option>
              <option value="Mixed">Mixed (Technical & Non-technical)</option>
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="painPoints">Customer Pain Points</label>
            <textarea id="painPoints" className={textareaCls} rows={2} placeholder="What problems are your target customers facing that your product solves?" value={fd.painPoints} onChange={(e) => set("painPoints", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="interests">Where Does Your Audience Hang Out?</label>
            <textarea id="interests" className={textareaCls} rows={2} placeholder="e.g., Reddit, Product Hunt, GitHub, Stack Overflow, LinkedIn, Twitter/X, Tech Communities, Slack Groups" value={fd.interests} onChange={(e) => set("interests", e.target.value)} />
          </div>
        </div>
      </SectionCard>

      {/* ── 6. Competitor Analysis ──────────────────────────────────── */}
      <SectionCard num={6} title="Competitor Analysis">
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="competitors">Main Competitors</label>
            <textarea id="competitors" className={textareaCls} rows={3} placeholder="List your top 3-5 competitor products (Name & Website URL if possible)." value={fd.competitors} onChange={(e) => set("competitors", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="compStrengths">Competitor Strengths/Weaknesses</label>
            <textarea id="compStrengths" className={textareaCls} rows={3} placeholder="What do they do well? Where are they lacking?" value={fd.compStrengths} onChange={(e) => set("compStrengths", e.target.value)} />
          </div>
        </div>
      </SectionCard>

      {/* ── 7. Brand Guidelines ─────────────────────────────────────── */}
      <SectionCard num={7} title="Brand Guidelines">
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="brandVoice">Brand Tone of Voice</label>
            <select id="brandVoice" className={selectCls} value={fd.brandVoice} onChange={(e) => set("brandVoice", e.target.value)}>
              <option value="">Select tone</option>
              <option value="professional">Professional</option>
              <option value="friendly">Friendly & Casual</option>
              <option value="premium">Premium & Luxury</option>
              <option value="playful">Playful & Fun</option>
              <option value="authoritative">Authoritative & Expert</option>
              <option value="inspiring">Inspiring & Motivational</option>
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="hasBrandGuidelines">Do you have brand guidelines?</label>
            <select id="hasBrandGuidelines" className={selectCls} value={fd.hasBrandGuidelines} onChange={(e) => set("hasBrandGuidelines", e.target.value)}>
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="brandAssets">Logo / Brand Assets</label>
            <input id="brandAssets" type="text" className={inputCls} placeholder="Provide links to logo files, brand book, image library, etc." value={fd.brandAssets} onChange={(e) => set("brandAssets", e.target.value)} />
            <p className={hintCls}>You can also share folder links (Google Drive, Dropbox, etc.)</p>
          </div>
        </div>
      </SectionCard>

      {/* ── 8. Success Metrics ──────────────────────────────────────── */}
      <SectionCard num={8} title="Success Metrics (KPIs)">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>How will you measure success?</label>
            <CheckboxGroup
              options={[
                { value: "Cost Per Acquisition", label: "Cost Per Acquisition (CPA)" },
                { value: "Conversion Rate", label: "Conversion Rate" },
                { value: "Click-Through Rate", label: "Click-Through Rate (CTR)" },
                { value: "ROAS", label: "ROAS (Return on Ad Spend)" },
                { value: "Customer Acquisition Cost", label: "Customer Acquisition Cost (CAC)" },
                { value: "Lifetime Value", label: "Customer Lifetime Value (LTV)" },
                { value: "Engagement Rate", label: "Engagement Rate" },
                { value: "Retention Rate", label: "User Retention Rate" },
                { value: "Churn Rate", label: "Churn Rate" },
                { value: "Website Traffic", label: "Website Traffic Growth" },
                { value: "Qualified Leads", label: "Qualified Leads/MQLs" },
                { value: "App Installs", label: "App Installs/Downloads" },
              ]}
              selected={fd.successMetrics}
              onChange={(v) => toggle("successMetrics", v)}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="expectedROAS">Target ROAS (Return on Ad Spend)</label>
            <input id="expectedROAS" type="text" className={inputCls} placeholder="e.g., 3:1, 5:1, or 300%, 500%" value={fd.expectedROAS} onChange={(e) => set("expectedROAS", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="expectedTimeline">Expected Timeline for Results</label>
            <select id="expectedTimeline" className={selectCls} value={fd.expectedTimeline} onChange={(e) => set("expectedTimeline", e.target.value)}>
              <option value="">Select timeline</option>
              <option value="1_month">1 Month</option>
              <option value="3_months">3 Months</option>
              <option value="6_months">6 Months</option>
              <option value="1_year">1 Year</option>
              <option value="ongoing">Ongoing/Long-term</option>
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="reportingFrequency">Preferred Reporting Frequency</label>
            <select id="reportingFrequency" className={selectCls} value={fd.reportingFrequency} onChange={(e) => set("reportingFrequency", e.target.value)}>
              <option value="">Select frequency</option>
              <option value="weekly">Weekly</option>
              <option value="bi_weekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>
      </SectionCard>

      {/* ── 9. Budget & Investment ──────────────────────────────────── */}
      <SectionCard num={9} title="Budget & Investment">
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="yearlyMarketingBudget">Yearly Online Marketing Budget</label>
            <select id="yearlyMarketingBudget" className={selectCls} value={fd.yearlyMarketingBudget} onChange={(e) => set("yearlyMarketingBudget", e.target.value)}>
              <option value="">Select yearly budget range</option>
              <option value="under_10k">Under $10,000</option>
              <option value="10k_25k">$10,000 - $25,000</option>
              <option value="25k_50k">$25,000 - $50,000</option>
              <option value="50k_100k">$50,000 - $100,000</option>
              <option value="100k_250k">$100,000 - $250,000</option>
              <option value="250k_500k">$250,000 - $500,000</option>
              <option value="500k_1m">$500,000 - $1,000,000</option>
              <option value="1m_plus">$1,000,000+</option>
              <option value="not_decided">Not Yet Decided</option>
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="monthlyAdSpend">Monthly Ad Spend Budget (Paid Advertising)</label>
            <select id="monthlyAdSpend" className={selectCls} value={fd.monthlyAdSpend} onChange={(e) => set("monthlyAdSpend", e.target.value)}>
              <option value="">Select monthly ad spend</option>
              <option value="under_500">Under $500</option>
              <option value="500_1k">$500 - $1,000</option>
              <option value="1k_3k">$1,000 - $3,000</option>
              <option value="3k_5k">$3,000 - $5,000</option>
              <option value="5k_10k">$5,000 - $10,000</option>
              <option value="10k_25k">$10,000 - $25,000</option>
              <option value="25k_50k">$25,000 - $50,000</option>
              <option value="50k_plus">$50,000+</option>
              <option value="not_allocated">Not Yet Allocated</option>
            </select>
            <p className={hintCls}>This is specifically for paid ads (Google, Meta, LinkedIn, etc.)</p>
          </div>

          <div>
            <label className={labelCls} htmlFor="promotionalBudget">Annual Promotional/Campaign Budget</label>
            <select id="promotionalBudget" className={selectCls} value={fd.promotionalBudget} onChange={(e) => set("promotionalBudget", e.target.value)}>
              <option value="">Select promotional budget</option>
              <option value="under_5k">Under $5,000</option>
              <option value="5k_10k">$5,000 - $10,000</option>
              <option value="10k_25k">$10,000 - $25,000</option>
              <option value="25k_50k">$25,000 - $50,000</option>
              <option value="50k_100k">$50,000 - $100,000</option>
              <option value="100k_plus">$100,000+</option>
              <option value="included">Included in overall budget</option>
            </select>
            <p className={hintCls}>Budget for special campaigns, product launches, seasonal promotions, events, etc.</p>
          </div>

          <div>
            <label className={labelCls}>Budget Allocation Preference</label>
            <CheckboxGroup
              options={[
                { value: "Paid Advertising", label: "Paid Advertising" },
                { value: "SEO", label: "SEO & Content Marketing" },
                { value: "Social Media", label: "Social Media Management" },
                { value: "Influencer", label: "Influencer Marketing" },
                { value: "Email Marketing", label: "Email Marketing" },
                { value: "Tools & Software", label: "Marketing Tools & Software" },
                { value: "Agency Fees", label: "Agency/Consultant Fees" },
                { value: "Creative Production", label: "Creative Production (Design, Video)" },
              ]}
              selected={fd.budgetAllocation}
              onChange={(v) => toggle("budgetAllocation", v)}
            />
            <p className={hintCls}>Select where you plan to allocate your marketing budget</p>
          </div>

          <div>
            <label className={labelCls} htmlFor="budgetFlexibility">Budget Flexibility</label>
            <select id="budgetFlexibility" className={selectCls} value={fd.budgetFlexibility} onChange={(e) => set("budgetFlexibility", e.target.value)}>
              <option value="">Select flexibility</option>
              <option value="fixed">Fixed - Cannot exceed budget</option>
              <option value="somewhat_flexible">Somewhat Flexible - Can adjust by 10-20%</option>
              <option value="flexible">Flexible - Can increase based on ROI</option>
              <option value="performance_based">Performance-Based - Scale with results</option>
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="previousMarketingSpend">Previous Year&apos;s Marketing Spend (if applicable)</label>
            <input id="previousMarketingSpend" type="text" className={inputCls} placeholder="e.g., $50,000 or Not Applicable" value={fd.previousMarketingSpend} onChange={(e) => set("previousMarketingSpend", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="budgetApprovalProcess">Budget Approval Process</label>
            <select id="budgetApprovalProcess" className={selectCls} value={fd.budgetApprovalProcess} onChange={(e) => set("budgetApprovalProcess", e.target.value)}>
              <option value="">Select approval process</option>
              <option value="already_approved">Already Approved</option>
              <option value="needs_approval">Needs Management Approval</option>
              <option value="quarterly_review">Quarterly Review Process</option>
              <option value="flexible">Flexible - Can Approve as Needed</option>
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="budgetNotes">Additional Budget Notes</label>
            <textarea id="budgetNotes" className={textareaCls} rows={2} placeholder="Any specific budget constraints, payment terms, or financial considerations we should know about?" value={fd.budgetNotes} onChange={(e) => set("budgetNotes", e.target.value)} />
          </div>
        </div>
      </SectionCard>

      {/* ── 10. Custom Software Development Services ────────────────── */}
      <SectionCard num={10} title="Custom Software Development Services">
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="offerSoftwareDev">Do you offer Custom Software Development services?</label>
            <select id="offerSoftwareDev" className={selectCls} value={fd.offerSoftwareDev} onChange={(e) => set("offerSoftwareDev", e.target.value)}>
              <option value="">Select option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {fd.offerSoftwareDev === "yes" && (
            <>
              <div>
                <label className={labelCls}>What technologies do you work with?</label>
                <CheckboxGroup
                  options={[
                    { value: "Web Development", label: "Web Development" },
                    { value: "Mobile Apps", label: "Mobile Apps (iOS/Android)" },
                    { value: "Cloud Solutions", label: "Cloud Solutions (AWS/Azure/GCP)" },
                    { value: "AI/ML", label: "AI/ML" },
                    { value: "Blockchain", label: "Blockchain" },
                    { value: "IoT", label: "IoT" },
                    { value: "DevOps", label: "DevOps" },
                    { value: "ERP/CRM", label: "ERP/CRM Systems" },
                    { value: "API Development", label: "API Development" },
                    { value: "Data Analytics", label: "Data Analytics & BI" },
                    { value: "Cybersecurity", label: "Cybersecurity" },
                    { value: "QA/Testing", label: "QA/Testing Automation" },
                  ]}
                  selected={fd.technologies}
                  onChange={(v) => toggle("technologies", v)}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="techStackDetails">Technology Stack Details</label>
                <textarea id="techStackDetails" className={textareaCls} rows={2} placeholder="e.g., React, Node.js, Python, Java, .NET, Flutter, React Native, etc." value={fd.techStackDetails} onChange={(e) => set("techStackDetails", e.target.value)} />
              </div>

              <div>
                <label className={labelCls}>What industries do you serve?</label>
                <CheckboxGroup
                  options={[
                    { value: "Healthcare", label: "Healthcare" },
                    { value: "Finance", label: "Finance & Banking" },
                    { value: "E-commerce", label: "E-commerce & Retail" },
                    { value: "Education", label: "Education" },
                    { value: "Real Estate", label: "Real Estate" },
                    { value: "Logistics", label: "Logistics & Transportation" },
                    { value: "Manufacturing", label: "Manufacturing" },
                    { value: "Hospitality", label: "Hospitality & Tourism" },
                    { value: "Media", label: "Media & Entertainment" },
                    { value: "Telecom", label: "Telecom" },
                    { value: "Government", label: "Government & Public Sector" },
                    { value: "All Industries", label: "All Industries" },
                  ]}
                  selected={fd.industriesServed}
                  onChange={(v) => toggle("industriesServed", v)}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="minTicketSize">Minimum Project Ticket Size</label>
                <select id="minTicketSize" className={selectCls} value={fd.minTicketSize} onChange={(e) => set("minTicketSize", e.target.value)}>
                  <option value="">Select minimum budget</option>
                  <option value="under_5k">Under $5,000</option>
                  <option value="5k_10k">$5,000 - $10,000</option>
                  <option value="10k_25k">$10,000 - $25,000</option>
                  <option value="25k_50k">$25,000 - $50,000</option>
                  <option value="50k_100k">$50,000 - $100,000</option>
                  <option value="100k_250k">$100,000 - $250,000</option>
                  <option value="250k_plus">$250,000+</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Types of Projects You Handle</label>
                <CheckboxGroup
                  options={[
                    { value: "MVP Development", label: "MVP Development" },
                    { value: "Full Product Development", label: "Full Product Development" },
                    { value: "Maintenance & Support", label: "Maintenance & Support" },
                    { value: "Legacy Modernization", label: "Legacy System Modernization" },
                    { value: "System Integration", label: "System Integration" },
                    { value: "Technical Consulting", label: "Technical Consulting" },
                  ]}
                  selected={fd.projectTypes}
                  onChange={(v) => toggle("projectTypes", v)}
                />
              </div>

              <div>
                <label className={labelCls} htmlFor="teamSize">Development Team Size</label>
                <select id="teamSize" className={selectCls} value={fd.teamSize} onChange={(e) => set("teamSize", e.target.value)}>
                  <option value="">Select team size</option>
                  <option value="1_5">1-5 developers</option>
                  <option value="6_10">6-10 developers</option>
                  <option value="11_25">11-25 developers</option>
                  <option value="26_50">26-50 developers</option>
                  <option value="50_plus">50+ developers</option>
                </select>
              </div>

              <div>
                <label className={labelCls} htmlFor="avgProjectDuration">Average Project Duration</label>
                <select id="avgProjectDuration" className={selectCls} value={fd.avgProjectDuration} onChange={(e) => set("avgProjectDuration", e.target.value)}>
                  <option value="">Select duration</option>
                  <option value="1_month">Less than 1 month</option>
                  <option value="1_3_months">1-3 months</option>
                  <option value="3_6_months">3-6 months</option>
                  <option value="6_12_months">6-12 months</option>
                  <option value="12_plus_months">12+ months</option>
                  <option value="varies">Varies by project</option>
                </select>
              </div>
            </>
          )}
        </div>
      </SectionCard>

      {/* ── 11. Additional Information ──────────────────────────────── */}
      <SectionCard num={11} title="Additional Information">
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="challenges">Any specific challenges or expectations?</label>
            <textarea id="challenges" className={textareaCls} rows={3} placeholder="Tell us about any specific challenges you're facing or expectations you have from this project." value={fd.challenges} onChange={(e) => set("challenges", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="additionalInfo">Anything else we should know?</label>
            <textarea id="additionalInfo" className={textareaCls} rows={5} placeholder="Special constraints, mandatory inclusions, preferred communication methods, or any other details..." value={fd.additionalInfo} onChange={(e) => set("additionalInfo", e.target.value)} />
          </div>
        </div>
      </SectionCard>

      {/* ── Submit ──────────────────────────────────────────────────── */}
      {serverError && (
        <div className="mb-6 p-4 bg-[#E63946]/10 border border-[#E63946]/30 rounded-lg text-sm text-[#E63946]">
          {serverError}
        </div>
      )}

      <div className="text-center pb-4">
        <button
          type="submit"
          disabled={submitting}
          className="px-10 py-4 bg-[#E63946] text-white rounded-full font-semibold text-lg hover:bg-[#d62839] disabled:opacity-50 transition-colors inline-flex items-center gap-2"
        >
          {submitting ? "Submitting..." : "Submit Requirements"} <span>→</span>
        </button>
      </div>
    </form>
  )
}
