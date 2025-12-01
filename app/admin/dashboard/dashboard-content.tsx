"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DashboardOverview } from "@/components/admin/dashboard-overview"
import { HomePageManager } from "@/components/admin/home-page-manager"
import { AboutPageManager } from "@/components/admin/about-page-manager"
import { WorkPageManager } from "@/components/admin/work-page-manager"
import { ServicesPageManager } from "@/components/admin/services-page-manager"
import { CaseStudiesPageManager } from "@/components/admin/case-studies-page-manager"
import { InsightsPageManager } from "@/components/admin/insights-page-manager"
import { ClientsPageManager } from "@/components/admin/clients-page-manager"
import { TestimonialsPageManager } from "@/components/admin/testimonials-page-manager"
import { CareersPageManager } from "@/components/admin/careers-page-manager"
import { ContactPageManager } from "@/components/admin/contact-page-manager"
import { LeadsManager } from "@/components/admin/leads-manager"
import { HeaderManager } from "@/components/admin/header-manager"
import { FooterManager } from "@/components/admin/footer-manager"
import { SeoManager } from "@/components/admin/seo-manager"
import { SettingsManager } from "@/components/admin/settings-manager"

export default function AdminDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState("overview")

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
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
      <main className="lg:pl-64">
        <div className="p-8">{renderContent()}</div>
      </main>
    </div>
  )
}
