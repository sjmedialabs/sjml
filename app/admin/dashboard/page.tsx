"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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

export default function AdminDashboard() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("overview")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
    } else {
      fetch("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem("adminToken")
            router.push("/admin/login")
          }
        })
        .catch(() => {
          localStorage.removeItem("adminToken")
          router.push("/admin/login")
        })
        .finally(() => setLoading(false))
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return null

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
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 p-8 overflow-auto">{renderContent()}</main>
    </div>
  )
}
