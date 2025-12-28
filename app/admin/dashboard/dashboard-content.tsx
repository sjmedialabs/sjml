"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DashboardOverview } from "@/components/admin/dashboard-overview"

// Loading fallback for dynamic components
const LoadingManager = () => (
  <div className="flex items-center justify-center h-[50vh]">
    <div className="w-8 h-8 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin" />
  </div>
)

// Dynamic imports to reduce initial bundle size (Hybrid Client Rendering)
const HomePageManager = dynamic(() => import("@/components/admin/home-page-manager").then(mod => mod.HomePageManager), { loading: LoadingManager })
const AboutPageManager = dynamic(() => import("@/components/admin/about-page-manager").then(mod => mod.AboutPageManager), { loading: LoadingManager })
const WorkPageManager = dynamic(() => import("@/components/admin/work-page-manager").then(mod => mod.WorkPageManager), { loading: LoadingManager })
const ServicesPageManager = dynamic(() => import("@/components/admin/services-page-manager").then(mod => mod.ServicesPageManager), { loading: LoadingManager })
const CaseStudiesPageManager = dynamic(() => import("@/components/admin/case-studies-page-manager").then(mod => mod.CaseStudiesPageManager), { loading: LoadingManager })
const InsightsPageManager = dynamic(() => import("@/components/admin/insights-page-manager").then(mod => mod.InsightsPageManager), { loading: LoadingManager })
const ClientsPageManager = dynamic(() => import("@/components/admin/clients-page-manager").then(mod => mod.ClientsPageManager), { loading: LoadingManager })
const TestimonialsPageManager = dynamic(() => import("@/components/admin/testimonials-page-manager").then(mod => mod.TestimonialsPageManager), { loading: LoadingManager })
const CareersPageManager = dynamic(() => import("@/components/admin/careers-page-manager").then(mod => mod.CareersPageManager), { loading: LoadingManager })
const ContactPageManager = dynamic(() => import("@/components/admin/contact-page-manager").then(mod => mod.ContactPageManager), { loading: LoadingManager })
const LeadsManager = dynamic(() => import("@/components/admin/leads-manager").then(mod => mod.LeadsManager), { loading: LoadingManager })
const HeaderManager = dynamic(() => import("@/components/admin/header-manager").then(mod => mod.HeaderManager), { loading: LoadingManager })
const FooterManager = dynamic(() => import("@/components/admin/footer-manager").then(mod => mod.FooterManager), { loading: LoadingManager })
const SeoManager = dynamic(() => import("@/components/admin/seo-manager").then(mod => mod.SeoManager), { loading: LoadingManager })
const SettingsManager = dynamic(() => import("@/components/admin/settings-manager").then(mod => mod.SettingsManager), { loading: LoadingManager })

interface AdminDashboardContentProps {
  initialSection?: string
}

export default function AdminDashboardContent({ initialSection = "overview" }: AdminDashboardContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState(initialSection)

  useEffect(() => {
    const section = searchParams.get("section")
    if (section) {
      setActiveSection(section)
    }
  }, [searchParams])

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    router.push(`/admin/dashboard?section=${section}`, { scroll: false })
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />
      case "home":
        return <HomePageManager />
      case "about":
        return <AboutPageManager />
      case "work":
        return <WorkPageManager />
      case "services":
        return <ServicesPageManager />
      case "case-studies":
        return <CaseStudiesPageManager />
      case "insights":
        return <InsightsPageManager />
      case "clients":
        return <ClientsPageManager />
      case "testimonials":
        return <TestimonialsPageManager />
      case "careers":
        return <CareersPageManager />
      case "contact":
        return <ContactPageManager />
      case "leads":
        return <LeadsManager />
      case "header":
        return <HeaderManager />
      case "footer":
        return <FooterManager />
      case "seo":
        return <SeoManager />
      case "settings":
        return <SettingsManager />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar activeSection={activeSection} setActiveSection={handleSectionChange} />
      <main className="flex-1">
        <div className="p-8">{renderContent()}</div>
      </main>
    </div>
  )
}
