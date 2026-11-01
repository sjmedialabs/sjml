import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { generateSeoMetadata } from "@/lib/seo"

export function generateMetadata() {
  return generateSeoMetadata("Terms")
}

export default function TermsPage() {
  return (
      <main className="site-page min-h-screen bg-background pb-16">
      <Header />
        <div className="site-container">
          <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: 1 November 2026</p>
          
          <div className="prose prose-invert max-w-none space-y-6 text-foreground">
            <p>
              These terms apply to your use of sjmedialabs.com, operated by SJ Media Labs, Hyderabad, India. By using the site you agree to them.
            </p>

            <h2 className="text-2xl font-bold">Using the site</h2>
            <p>
              You may browse the site and send us an enquiry for lawful purposes. Do not misuse the forms, attempt to disrupt the site, or copy our work in a way that infringes our rights or someone else&apos;s.
            </p>

            <h2 className="text-2xl font-bold">Our work and your project</h2>
            <p>
              Case studies, articles, and portfolio pieces describe past work and are not a promise of the same result. A project starts only when we agree the scope, fees, and timing in writing. Until then, a form submission is an enquiry, not a contract.
            </p>

            <h2 className="text-2xl font-bold">Content on this site</h2>
            <p>
              The text, images, and design of this website belong to SJ Media Labs or our clients and are shared so you can review our work. Please ask before reusing them.
            </p>

            <h2 className="text-2xl font-bold">Liability</h2>
            <p>
              We take care to keep the site accurate, but we do not guarantee that every page is complete or always available. To the extent the law allows, we are not liable for loss arising only from your use of the public website.
            </p>

            <div className="mt-12 p-6 bg-secondary border border-border rounded-lg">
              <p className="text-muted-foreground">
                For terms-related inquiries, please contact us at:{" "}
                <a href="mailto:info@sjmedialabs.com" className="text-[#E63946] hover:underline">
                  info@sjmedialabs.com
                </a>
              </p>
            </div>

            <div className="mt-8">
              <Link href="/" className="home-hero-cta-primary inline-flex items-center px-6 font-semibold">
                Return to Homepage
              </Link>
            </div>
          </div>
          </div>
        </div>
      <Footer />
      </main>
  )
}
