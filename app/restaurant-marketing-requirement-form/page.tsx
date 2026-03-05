import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RestaurantMarketingForm } from "@/components/restaurant-marketing-form"

export const metadata: Metadata = {
  title: "Restaurant Digital Marketing Requirement Form | SJ Media Labs",
  description:
    "Please complete this form to help us understand your restaurant, target customers, and marketing goals so our team can design the best marketing strategy.",
  robots: { index: true, follow: true },
}

export default function RestaurantMarketingRequirementFormPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative flex items-center justify-center pt-32 pb-16 px-4 overflow-hidden min-h-[320px]">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
            Restaurant Digital Marketing <span className="text-[#E63946]">Requirement Form</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground mt-4">
            Please complete this form to help us understand your restaurant, target customers, and marketing goals so our team can design the best marketing strategy.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <RestaurantMarketingForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
