import { generateSeoMetadata } from "@/lib/seo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getPageContent } from "@/lib/models/content"
import {
  createDefaultContactPageContent,
  normalizeContactPageContent,
} from "@/lib/contact-page-content"
import { ContactHeroSection } from "@/components/contact/contact-hero-section"
import { ContactInfoSection } from "@/components/contact/contact-info-section"
import { ContactPageForm } from "@/components/contact/contact-page-form"
import { ContactMapSection } from "@/components/contact/contact-map-section"
import { ContactBottomCtaSection } from "@/components/contact/contact-bottom-cta-section"

export async function generateMetadata() {
  return await generateSeoMetadata("Contact")
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ContactPage() {
  let pageContent = createDefaultContactPageContent()

  try {
    const raw = await getPageContent("contact")
    if (raw) {
      pageContent = normalizeContactPageContent(raw as unknown as Record<string, unknown>)
    }
  } catch (error) {
    console.error("Failed to fetch contact page content:", error)
  }

  return (
    <main className="site-page min-h-screen bg-white">
      <Header />
      <ContactHeroSection data={pageContent.hero} typography={pageContent.typography} />
      <section className="contact-main-section bg-white py-10 md:py-14">
        <div className="site-container contact-main-grid">
          <ContactInfoSection data={pageContent.info} typography={pageContent.typography} />
          <ContactPageForm data={pageContent.form} typography={pageContent.typography} />
        </div>
      </section>
      <ContactMapSection data={pageContent.map} />
      <ContactBottomCtaSection data={pageContent.bottomCta} typography={pageContent.typography} />
      <Footer />
    </main>
  )
}
