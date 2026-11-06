import React from "react"
import { getHomeContent } from "@/lib/models/content"
import {
  Template1Header,
  Template1HeroSection,
  Template1ExperienceSection,
  Template1ChallengeSection,
  Template1ServicesSection,
  Template1WorkSection,
  Template1WhySjmlSection,
  Template1ProcessSection,
  Template1ClientsSection,
  Template1FaqSection,
  Template1CtaSection,
  Template1Footer,
} from "@/components/template-1"

export const metadata = {
  title: "Template 1 Preview | SJ Media Labs",
  description: "UI Template 1 section-by-section preview",
}

export const dynamic = "force-dynamic"

export default async function Template1PreviewPage() {
  const homeContent = await getHomeContent().catch(() => null)
  const cmsFooter = (homeContent as { footer?: unknown } | null)?.footer

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#161617]">
      <Template1Header />
      <Template1HeroSection />
      <Template1ExperienceSection />
      <Template1ChallengeSection />
      <Template1ServicesSection />
      <Template1WorkSection />
      <Template1WhySjmlSection />
      <Template1ProcessSection />
      <Template1ClientsSection />
      <Template1FaqSection />
      <Template1CtaSection />
      <Template1Footer cmsFooter={cmsFooter} />
    </div>
  )
}
