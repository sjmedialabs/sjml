import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DigitalMarketingForm } from "@/components/digital-marketing-form"

export const metadata: Metadata = {
  title: "Digital Marketing Requirement Form | SJ Media Labs",
  description:
    "Please complete this form to help us understand your product, business goals, and marketing requirements.",
  robots: { index: true, follow: true },
}

export default function DigitalMarketingRequirementFormPage() {
  return (
    <main className="site-page min-h-screen bg-white">
      <Header />

      <section className="about-hero bg-home-secondary">
        <div className="absolute inset-0 bg-home-secondary z-0" aria-hidden="true" />
        <div className="site-container about-hero-inner">
          <div className="about-hero-grid">
            <div className="about-hero-content w-full max-w-4xl mx-auto text-center">
              <h1 className="text-2xl md:text-3xl font-bold leading-tight text-white">
                Digital Marketing <span className="text-home-primary">Requirement Form</span>
              </h1>
              <p className="text-sm md:text-base text-white/85 leading-relaxed mt-3 max-w-2xl mx-auto">
                Please complete this form to help us understand your product, business goals, and marketing requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="site-container">
          <div className="max-w-4xl">
            <DigitalMarketingForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
