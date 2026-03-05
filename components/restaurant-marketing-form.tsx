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
  // 1. Restaurant Information
  restaurantName: "",
  contactPerson: "",
  email: "",
  phone: "",
  website: "",
  // 2. Restaurant Overview
  cuisineType: "",
  restaurantType: [] as string[],
  numberOfLocations: "",
  primaryLocationAddress: "",
  googleMapsLink: "",
  brandVoice: "",
  usp: "",
  avgPriceRange: "",
  signatureMenuItems: "",
  menuCategories: "",
  menuLink: "",
  // 3. Marketing Objectives
  primaryGoal: "",
  secondaryGoals: [] as string[],
  campaignTimeline: "",
  campaignStartDate: "",
  specificKPITargets: "",
  // 4. Target Audience
  targetAgeGroup: "",
  targetDemographics: "",
  householdIncome: "",
  geographicRadius: "",
  customerInterests: "",
  // 5. Digital Marketing Channels
  channels: [] as string[],
  // 6. Content Strategy
  contentTypes: [] as string[],
  postingFrequency: "",
  // 7. Budget & Allocation
  monthlyBudget: "",
  yearlyBudget: "",
  monthlyAdSpend: "",
  budgetFlexibility: "",
  budgetAllocation: [] as string[],
  // 8. Success Metrics
  kpis: [] as string[],
  targetROAS: "",
  reportingFrequency: "",
  // 9. Current Marketing Status
  websiteStatus: "",
  socialMediaLinks: "",
  analyticsTools: "",
  googleAnalyticsAccess: "",
  conversionTracking: "",
  // 10. Competitor Analysis
  mainCompetitors: "",
  competitorStrengths: "",
  // 11. Additional Requirements
  specialRequests: "",
  preferredCommunication: [] as string[],
  urgencyLevel: "",
  _honeypot: "",
}

type FormData = typeof initial

// ── Main component ──────────────────────────────────────────────────────
export function RestaurantMarketingForm() {
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
    if (!fd.restaurantName.trim()) e.restaurantName = "Restaurant name is required"
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
      const firstKey = Object.keys(errors)[0]
      if (firstKey) document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/restaurant-marketing-form", {
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
          Thank you for submitting your restaurant marketing requirements. Our team will review your details and contact you shortly.
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

      {/* ── 1. Restaurant Information ──────────────────────────────── */}
      <SectionCard num={1} title="Restaurant Information">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelCls} htmlFor="restaurantName">Restaurant Name *</label>
            <input id="restaurantName" type="text" className={inputCls} placeholder="e.g. The Golden Fork" required value={fd.restaurantName} onChange={(e) => set("restaurantName", e.target.value)} />
            <FieldError msg={errors.restaurantName} />
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
            <input id="email" type="email" className={inputCls} placeholder="name@restaurant.com" required value={fd.email} onChange={(e) => set("email", e.target.value)} />
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
          <input id="website" type="url" className={inputCls} placeholder="https://www.yourrestaurant.com" value={fd.website} onChange={(e) => set("website", e.target.value)} />
        </div>
      </SectionCard>

      {/* ── 2. Restaurant Overview ─────────────────────────────────── */}
      <SectionCard num={2} title="Restaurant Overview">
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="cuisineType">Cuisine Type</label>
            <select id="cuisineType" className={selectCls} value={fd.cuisineType} onChange={(e) => set("cuisineType", e.target.value)}>
              <option value="">Select cuisine type</option>
              <option value="Indian">Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="Italian">Italian</option>
              <option value="Mexican">Mexican</option>
              <option value="Japanese">Japanese</option>
              <option value="Thai">Thai</option>
              <option value="Mediterranean">Mediterranean</option>
              <option value="American">American</option>
              <option value="French">French</option>
              <option value="Korean">Korean</option>
              <option value="Middle Eastern">Middle Eastern</option>
              <option value="Fusion">Fusion / Multi-Cuisine</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Seafood">Seafood</option>
              <option value="BBQ">BBQ / Grill</option>
              <option value="Vegan/Vegetarian">Vegan / Vegetarian</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Restaurant Type</label>
            <CheckboxGroup
              options={[
                { value: "Fine Dining", label: "Fine Dining" },
                { value: "Casual Dining", label: "Casual Dining" },
                { value: "Fast Casual", label: "Fast Casual" },
                { value: "QSR", label: "Quick Service (QSR)" },
                { value: "Cafe", label: "Café / Coffee Shop" },
                { value: "Bar & Grill", label: "Bar & Grill" },
                { value: "Food Truck", label: "Food Truck" },
                { value: "Cloud Kitchen", label: "Cloud / Ghost Kitchen" },
                { value: "Bakery", label: "Bakery / Dessert Shop" },
                { value: "Buffet", label: "Buffet" },
                { value: "Catering", label: "Catering Service" },
                { value: "Franchise", label: "Franchise" },
              ]}
              selected={fd.restaurantType}
              onChange={(v) => toggle("restaurantType", v)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="numberOfLocations">Number of Locations</label>
              <select id="numberOfLocations" className={selectCls} value={fd.numberOfLocations} onChange={(e) => set("numberOfLocations", e.target.value)}>
                <option value="">Select</option>
                <option value="1">1 (Single Location)</option>
                <option value="2-5">2–5 Locations</option>
                <option value="6-10">6–10 Locations</option>
                <option value="11-25">11–25 Locations</option>
                <option value="25+">25+ Locations</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="avgPriceRange">Average Price Range</label>
              <select id="avgPriceRange" className={selectCls} value={fd.avgPriceRange} onChange={(e) => set("avgPriceRange", e.target.value)}>
                <option value="">Select price range</option>
                <option value="$">$ (Budget-Friendly)</option>
                <option value="$$">$$ (Mid-Range)</option>
                <option value="$$$">$$$ (Upscale)</option>
                <option value="$$$$">$$$$ (Fine Dining / Premium)</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="primaryLocationAddress">Primary Location Address</label>
            <input id="primaryLocationAddress" type="text" className={inputCls} placeholder="Full address of your primary restaurant location" value={fd.primaryLocationAddress} onChange={(e) => set("primaryLocationAddress", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="googleMapsLink">Google Maps Location Link</label>
            <input id="googleMapsLink" type="url" className={inputCls} placeholder="https://maps.google.com/..." value={fd.googleMapsLink} onChange={(e) => set("googleMapsLink", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="brandVoice">Brand Voice / Tone</label>
            <select id="brandVoice" className={selectCls} value={fd.brandVoice} onChange={(e) => set("brandVoice", e.target.value)}>
              <option value="">Select brand tone</option>
              <option value="Premium & Elegant">Premium & Elegant</option>
              <option value="Warm & Family-Friendly">Warm & Family-Friendly</option>
              <option value="Trendy & Youthful">Trendy & Youthful</option>
              <option value="Fun & Casual">Fun & Casual</option>
              <option value="Authentic & Traditional">Authentic & Traditional</option>
              <option value="Modern & Minimalist">Modern & Minimalist</option>
              <option value="Bold & Adventurous">Bold & Adventurous</option>
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="usp">Unique Selling Proposition (USP)</label>
            <textarea id="usp" className={textareaCls} rows={2} placeholder="What makes your restaurant unique? (e.g., farm-to-table, secret family recipes, rooftop dining)" value={fd.usp} onChange={(e) => set("usp", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="signatureMenuItems">Signature Menu Items</label>
            <textarea id="signatureMenuItems" className={textareaCls} rows={2} placeholder="List your most popular or signature dishes" value={fd.signatureMenuItems} onChange={(e) => set("signatureMenuItems", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="menuCategories">Menu Categories</label>
            <input id="menuCategories" type="text" className={inputCls} placeholder="e.g. Appetizers, Main Course, Desserts, Beverages, Combos" value={fd.menuCategories} onChange={(e) => set("menuCategories", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="menuLink">Menu Link / PDF</label>
            <input id="menuLink" type="url" className={inputCls} placeholder="Link to your online menu or menu PDF" value={fd.menuLink} onChange={(e) => set("menuLink", e.target.value)} />
            <p className={hintCls}>You can share a Google Drive, Dropbox, or any public link</p>
          </div>
        </div>
      </SectionCard>

      {/* ── 3. Marketing Objectives ────────────────────────────────── */}
      <SectionCard num={3} title="Marketing Objectives">
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="primaryGoal">Primary Marketing Goal</label>
            <select id="primaryGoal" className={selectCls} value={fd.primaryGoal} onChange={(e) => set("primaryGoal", e.target.value)}>
              <option value="">Select primary goal</option>
              <option value="Increase Footfall">Increase Footfall / Walk-ins</option>
              <option value="Boost Online Orders">Boost Online Orders</option>
              <option value="Brand Awareness">Build Brand Awareness</option>
              <option value="New Location Launch">New Location Launch</option>
              <option value="Increase Reservations">Increase Reservations</option>
              <option value="Improve Online Reviews">Improve Online Reviews & Ratings</option>
              <option value="Grow Social Following">Grow Social Media Following</option>
              <option value="Catering Leads">Generate Catering / Event Leads</option>
              <option value="Franchise Leads">Attract Franchise Inquiries</option>
              <option value="Customer Retention">Customer Retention & Loyalty</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Secondary Goals</label>
            <CheckboxGroup
              options={[
                { value: "Increase Footfall", label: "Increase Footfall" },
                { value: "Boost Online Orders", label: "Boost Online Orders" },
                { value: "Brand Awareness", label: "Brand Awareness" },
                { value: "Improve Reviews", label: "Improve Reviews" },
                { value: "Grow Social Media", label: "Grow Social Media" },
                { value: "Catering Leads", label: "Catering / Event Leads" },
                { value: "Customer Loyalty", label: "Customer Loyalty" },
                { value: "Menu Promotion", label: "New Menu Promotion" },
                { value: "Seasonal Campaigns", label: "Seasonal Campaigns" },
              ]}
              selected={fd.secondaryGoals}
              onChange={(v) => toggle("secondaryGoals", v)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="campaignTimeline">Campaign Timeline</label>
              <select id="campaignTimeline" className={selectCls} value={fd.campaignTimeline} onChange={(e) => set("campaignTimeline", e.target.value)}>
                <option value="">Select timeline</option>
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
                <option value="Ongoing">Ongoing / Long-term</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="campaignStartDate">Campaign Start Date</label>
              <input id="campaignStartDate" type="date" className={inputCls} value={fd.campaignStartDate} onChange={(e) => set("campaignStartDate", e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="specificKPITargets">Specific KPI Targets</label>
            <textarea id="specificKPITargets" className={textareaCls} rows={2} placeholder="e.g., 500 more walk-ins/month, 200 online orders/week, 4.5-star Google rating" value={fd.specificKPITargets} onChange={(e) => set("specificKPITargets", e.target.value)} />
          </div>
        </div>
      </SectionCard>

      {/* ── 4. Target Audience ─────────────────────────────────────── */}
      <SectionCard num={4} title="Target Audience">
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="targetAgeGroup">Target Age Group</label>
            <select id="targetAgeGroup" className={selectCls} value={fd.targetAgeGroup} onChange={(e) => set("targetAgeGroup", e.target.value)}>
              <option value="">Select age range</option>
              <option value="18-24">18–24</option>
              <option value="25-34">25–34</option>
              <option value="35-44">35–44</option>
              <option value="45-54">45–54</option>
              <option value="55+">55+</option>
              <option value="All Ages">All Ages</option>
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="targetDemographics">Target Demographics</label>
            <textarea id="targetDemographics" className={textareaCls} rows={2} placeholder="e.g., Families, Young Professionals, College Students, Tourists, Corporate Employees" value={fd.targetDemographics} onChange={(e) => set("targetDemographics", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="householdIncome">Household Income Level</label>
            <select id="householdIncome" className={selectCls} value={fd.householdIncome} onChange={(e) => set("householdIncome", e.target.value)}>
              <option value="">Select income level</option>
              <option value="Budget">Budget-Conscious</option>
              <option value="Middle Class">Middle Class</option>
              <option value="Upper Middle">Upper Middle Class</option>
              <option value="Premium">Premium / High Income</option>
              <option value="All Levels">All Income Levels</option>
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="geographicRadius">Geographic Target Radius</label>
            <select id="geographicRadius" className={selectCls} value={fd.geographicRadius} onChange={(e) => set("geographicRadius", e.target.value)}>
              <option value="">Select radius</option>
              <option value="1-3 km">1–3 km (Neighborhood)</option>
              <option value="3-5 km">3–5 km (Local Area)</option>
              <option value="5-10 km">5–10 km (City-wide)</option>
              <option value="10-25 km">10–25 km (Metro Area)</option>
              <option value="25+ km">25+ km (Regional)</option>
              <option value="City-wide">Entire City</option>
              <option value="Multiple Cities">Multiple Cities</option>
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="customerInterests">Customer Interests & Behavior</label>
            <textarea id="customerInterests" className={textareaCls} rows={3} placeholder="e.g., Foodies, Health-conscious eaters, Late-night diners, Weekend brunch lovers, Food delivery app users" value={fd.customerInterests} onChange={(e) => set("customerInterests", e.target.value)} />
          </div>
        </div>
      </SectionCard>

      {/* ── 5. Digital Marketing Channels ──────────────────────────── */}
      <SectionCard num={5} title="Digital Marketing Channels">
        <p className="text-sm text-muted-foreground mb-4">Select all channels you&apos;re interested in:</p>
        <CheckboxGroup
          options={[
            { value: "Instagram", label: "Instagram" },
            { value: "Facebook", label: "Facebook" },
            { value: "TikTok", label: "TikTok" },
            { value: "LinkedIn", label: "LinkedIn" },
            { value: "Google Ads", label: "Google Ads" },
            { value: "Email Marketing", label: "Email Marketing" },
            { value: "SEO", label: "SEO (Search Engine Optimization)" },
            { value: "Food Delivery Platforms", label: "Food Delivery Platforms (Zomato, Swiggy, UberEats)" },
            { value: "Review Management", label: "Review Management (Google, Yelp, TripAdvisor)" },
            { value: "Website Development", label: "Website Development" },
            { value: "Influencer Marketing", label: "Influencer / Food Blogger Marketing" },
          ]}
          selected={fd.channels}
          onChange={(v) => toggle("channels", v)}
        />
      </SectionCard>

      {/* ── 6. Content Strategy ────────────────────────────────────── */}
      <SectionCard num={6} title="Content Strategy">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Content Types Required</label>
            <CheckboxGroup
              options={[
                { value: "Food Photography", label: "Food Photography" },
                { value: "Video Content", label: "Video Content (Reels / Shorts)" },
                { value: "Menu Design", label: "Menu Design & Graphics" },
                { value: "Blog / Articles", label: "Blog / Articles" },
                { value: "Customer Testimonials", label: "Customer Testimonials" },
                { value: "Behind-the-Scenes", label: "Behind-the-Scenes Content" },
                { value: "Chef Spotlights", label: "Chef / Team Spotlights" },
                { value: "Event Promotion", label: "Event Promotion" },
                { value: "Seasonal Campaigns", label: "Seasonal / Festival Campaigns" },
                { value: "User-Generated Content", label: "User-Generated Content" },
                { value: "Email Newsletters", label: "Email Newsletters" },
                { value: "Infographics", label: "Infographics" },
              ]}
              selected={fd.contentTypes}
              onChange={(v) => toggle("contentTypes", v)}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="postingFrequency">Posting Frequency</label>
            <select id="postingFrequency" className={selectCls} value={fd.postingFrequency} onChange={(e) => set("postingFrequency", e.target.value)}>
              <option value="">Select frequency</option>
              <option value="Daily">Daily</option>
              <option value="3-5 times/week">3–5 times per week</option>
              <option value="2-3 times/week">2–3 times per week</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Custom">Custom / Let the team decide</option>
            </select>
          </div>
        </div>
      </SectionCard>

      {/* ── 7. Budget & Allocation ─────────────────────────────────── */}
      <SectionCard num={7} title="Budget & Allocation">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="monthlyBudget">Monthly Budget Range</label>
              <select id="monthlyBudget" className={selectCls} value={fd.monthlyBudget} onChange={(e) => set("monthlyBudget", e.target.value)}>
                <option value="">Select monthly budget</option>
                <option value="Under $500">Under $500</option>
                <option value="$500 - $1,000">$500 – $1,000</option>
                <option value="$1,000 - $3,000">$1,000 – $3,000</option>
                <option value="$3,000 - $5,000">$3,000 – $5,000</option>
                <option value="$5,000 - $10,000">$5,000 – $10,000</option>
                <option value="$10,000+">$10,000+</option>
                <option value="Not Decided">Not Yet Decided</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="yearlyBudget">Yearly Budget Range</label>
              <select id="yearlyBudget" className={selectCls} value={fd.yearlyBudget} onChange={(e) => set("yearlyBudget", e.target.value)}>
                <option value="">Select yearly budget</option>
                <option value="Under $5,000">Under $5,000</option>
                <option value="$5,000 - $15,000">$5,000 – $15,000</option>
                <option value="$15,000 - $30,000">$15,000 – $30,000</option>
                <option value="$30,000 - $60,000">$30,000 – $60,000</option>
                <option value="$60,000 - $120,000">$60,000 – $120,000</option>
                <option value="$120,000+">$120,000+</option>
                <option value="Not Decided">Not Yet Decided</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="monthlyAdSpend">Monthly Ad Spend (Paid Advertising)</label>
            <select id="monthlyAdSpend" className={selectCls} value={fd.monthlyAdSpend} onChange={(e) => set("monthlyAdSpend", e.target.value)}>
              <option value="">Select monthly ad spend</option>
              <option value="Under $300">Under $300</option>
              <option value="$300 - $500">$300 – $500</option>
              <option value="$500 - $1,000">$500 – $1,000</option>
              <option value="$1,000 - $3,000">$1,000 – $3,000</option>
              <option value="$3,000 - $5,000">$3,000 – $5,000</option>
              <option value="$5,000+">$5,000+</option>
              <option value="Not Allocated">Not Yet Allocated</option>
            </select>
            <p className={hintCls}>Specifically for paid ads (Google, Meta, Food Delivery platforms, etc.)</p>
          </div>

          <div>
            <label className={labelCls} htmlFor="budgetFlexibility">Budget Flexibility</label>
            <select id="budgetFlexibility" className={selectCls} value={fd.budgetFlexibility} onChange={(e) => set("budgetFlexibility", e.target.value)}>
              <option value="">Select flexibility</option>
              <option value="Fixed">Fixed – Cannot exceed budget</option>
              <option value="Somewhat Flexible">Somewhat Flexible – Can adjust by 10-20%</option>
              <option value="Flexible">Flexible – Can increase based on ROI</option>
              <option value="Performance-Based">Performance-Based – Scale with results</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Budget Allocation Preferences</label>
            <CheckboxGroup
              options={[
                { value: "Social Media Ads", label: "Social Media Ads" },
                { value: "Google Ads", label: "Google Ads / Search" },
                { value: "Content Creation", label: "Content Creation (Photo/Video)" },
                { value: "Influencer Marketing", label: "Influencer / Blogger Marketing" },
                { value: "SEO", label: "SEO & Website" },
                { value: "Email Marketing", label: "Email / SMS Marketing" },
                { value: "Review Management", label: "Review Management" },
                { value: "Food Delivery Platforms", label: "Food Delivery Platform Promotions" },
              ]}
              selected={fd.budgetAllocation}
              onChange={(v) => toggle("budgetAllocation", v)}
            />
            <p className={hintCls}>Select where you plan to allocate your marketing budget</p>
          </div>
        </div>
      </SectionCard>

      {/* ── 8. Success Metrics (KPIs) ──────────────────────────────── */}
      <SectionCard num={8} title="Success Metrics (KPIs)">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>How will you measure success?</label>
            <CheckboxGroup
              options={[
                { value: "Footfall Increase", label: "Footfall Increase" },
                { value: "Online Order Volume", label: "Online Order Volume" },
                { value: "Revenue Growth", label: "Revenue Growth" },
                { value: "Social Media Engagement", label: "Social Media Engagement" },
                { value: "Google Review Rating", label: "Google Review Rating" },
                { value: "Website Traffic", label: "Website Traffic" },
                { value: "Customer Retention", label: "Customer Retention Rate" },
                { value: "Cost Per Acquisition", label: "Cost Per Acquisition (CPA)" },
                { value: "ROAS", label: "Return on Ad Spend (ROAS)" },
                { value: "Table Reservations", label: "Table Reservations" },
                { value: "New Customer Acquisition", label: "New Customer Acquisition" },
                { value: "Email/SMS Subscribers", label: "Email / SMS Subscribers" },
              ]}
              selected={fd.kpis}
              onChange={(v) => toggle("kpis", v)}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="targetROAS">Target ROAS (Return on Ad Spend)</label>
            <input id="targetROAS" type="text" className={inputCls} placeholder="e.g., 3:1, 5:1, or 300%, 500%" value={fd.targetROAS} onChange={(e) => set("targetROAS", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="reportingFrequency">Reporting Frequency</label>
            <select id="reportingFrequency" className={selectCls} value={fd.reportingFrequency} onChange={(e) => set("reportingFrequency", e.target.value)}>
              <option value="">Select frequency</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </div>
        </div>
      </SectionCard>

      {/* ── 9. Current Marketing Status ─────────────────────────────── */}
      <SectionCard num={9} title="Current Marketing Status">
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="websiteStatus">Website Status</label>
            <select id="websiteStatus" className={selectCls} value={fd.websiteStatus} onChange={(e) => set("websiteStatus", e.target.value)}>
              <option value="">Select status</option>
              <option value="Yes - Active">Yes – Active & Updated</option>
              <option value="Yes - Outdated">Yes – But Outdated</option>
              <option value="In Development">In Development</option>
              <option value="No">No Website</option>
            </select>
          </div>

          <div>
            <label className={labelCls} htmlFor="socialMediaLinks">Social Media Links</label>
            <textarea id="socialMediaLinks" className={textareaCls} rows={3} placeholder="Provide links to your Instagram, Facebook, TikTok, YouTube, etc." value={fd.socialMediaLinks} onChange={(e) => set("socialMediaLinks", e.target.value)} />
          </div>

          <div>
            <label className={labelCls} htmlFor="analyticsTools">Analytics Tools Currently Used</label>
            <input id="analyticsTools" type="text" className={inputCls} placeholder="e.g., Google Analytics, Meta Pixel, Swiggy Dashboard" value={fd.analyticsTools} onChange={(e) => set("analyticsTools", e.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="googleAnalyticsAccess">Google Analytics Access?</label>
              <select id="googleAnalyticsAccess" className={selectCls} value={fd.googleAnalyticsAccess} onChange={(e) => set("googleAnalyticsAccess", e.target.value)}>
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Need Setup">Need Setup</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="conversionTracking">Conversion Tracking Status</label>
              <select id="conversionTracking" className={selectCls} value={fd.conversionTracking} onChange={(e) => set("conversionTracking", e.target.value)}>
                <option value="">Select status</option>
                <option value="Yes">Yes – Set Up</option>
                <option value="No">No</option>
                <option value="Partial">Partial</option>
                <option value="Not Sure">Not Sure</option>
              </select>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── 10. Competitor Analysis ─────────────────────────────────── */}
      <SectionCard num={10} title="Competitor Analysis">
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="mainCompetitors">Main Competitors</label>
            <textarea id="mainCompetitors" className={textareaCls} rows={3} placeholder="List your top 3-5 competitor restaurants (Name, Location, Website/Social if known)" value={fd.mainCompetitors} onChange={(e) => set("mainCompetitors", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="competitorStrengths">Competitor Strengths / Weaknesses</label>
            <textarea id="competitorStrengths" className={textareaCls} rows={3} placeholder="What do they do well? Where are they lacking? What can you do better?" value={fd.competitorStrengths} onChange={(e) => set("competitorStrengths", e.target.value)} />
          </div>
        </div>
      </SectionCard>

      {/* ── 11. Additional Requirements ─────────────────────────────── */}
      <SectionCard num={11} title="Additional Requirements">
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="specialRequests">Special Requests / Notes</label>
            <textarea id="specialRequests" className={textareaCls} rows={4} placeholder="Any special requirements, seasonal events, upcoming launches, dietary focus, or anything else we should know..." value={fd.specialRequests} onChange={(e) => set("specialRequests", e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Preferred Communication Channels</label>
            <CheckboxGroup
              options={[
                { value: "Email", label: "Email" },
                { value: "Phone", label: "Phone Call" },
                { value: "WhatsApp", label: "WhatsApp" },
                { value: "Video Call", label: "Video Call (Zoom / Google Meet)" },
                { value: "In-Person", label: "In-Person Meeting" },
              ]}
              selected={fd.preferredCommunication}
              onChange={(v) => toggle("preferredCommunication", v)}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="urgencyLevel">Urgency Level</label>
            <select id="urgencyLevel" className={selectCls} value={fd.urgencyLevel} onChange={(e) => set("urgencyLevel", e.target.value)}>
              <option value="">Select urgency</option>
              <option value="Immediate">Immediate – Need to start ASAP</option>
              <option value="Within 1 Week">Within 1 Week</option>
              <option value="Within 1 Month">Within 1 Month</option>
              <option value="Flexible">Flexible – No Rush</option>
            </select>
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
