import { getHomeContent, getPageContent } from "@/lib/models/content"
import { normalizeHeaderContent } from "@/lib/header-content"
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
import {
  defaultTemplate1PageData,
  defaultTemplate1SectionVisibility,
  normalizeTemplate1SectionVisibility,
  normalizeTemplate1PageData,
  type Template1PageData,
  type Template1SectionVisibility,
} from "./default-data"

export async function Template1Page({
  data,
  enabledSections,
}: {
  data?: Template1PageData
  enabledSections?: Template1SectionVisibility
}) {
  const [homeContent, rawHeader] = await Promise.all([
    getHomeContent().catch(() => null),
    getPageContent("header").catch(() => null),
  ])
  const cmsFooter = (homeContent as { footer?: unknown } | null)?.footer
  const cmsHeader = rawHeader ? normalizeHeaderContent(rawHeader as Record<string, unknown>) : null
  const content = normalizeTemplate1PageData(data ?? defaultTemplate1PageData)
  const visibility = normalizeTemplate1SectionVisibility(
    enabledSections ?? defaultTemplate1SectionVisibility,
  )

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#161617]">
      {visibility.header && <Template1Header data={content.header} cmsHeader={cmsHeader} cmsFooter={cmsFooter} />}
      {visibility.hero && <Template1HeroSection data={content.hero} />}
      {visibility.experience && <Template1ExperienceSection data={content.experience} />}
      {visibility.challenge && <Template1ChallengeSection data={content.challenge} />}
      {visibility.services && <Template1ServicesSection data={content.services} />}
      {visibility.work && <Template1WorkSection data={content.work} />}
      {visibility.whySjml && <Template1WhySjmlSection data={content.whySjml} />}
      {visibility.process && <Template1ProcessSection data={content.process} />}
      {visibility.clients && <Template1ClientsSection data={content.clients} />}
      {visibility.faq && <Template1FaqSection data={content.faq} />}
      {visibility.cta && <Template1CtaSection data={content.cta} />}
      {visibility.footer && <Template1Footer data={content.footer} cmsFooter={cmsFooter} cmsHeader={cmsHeader} />}
    </div>
  )
}
