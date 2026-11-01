import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { generateSeoMetadata } from "@/lib/seo"

export function generateMetadata() {
  return generateSeoMetadata("Privacy")
}

export default function PrivacyPage() {
  return (
      <main className="site-page min-h-screen bg-background pb-16">
      <Header />
        <div className="site-container">
          <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: 1 November 2026</p>
          
          <div className="prose prose-invert max-w-none space-y-6 text-foreground">
            <p>
              SJ Media Labs (&quot;we&quot;, &quot;us&quot;) is a branding and digital marketing studio in Hyderabad, India.
              This policy explains what personal information we collect on sjmedialabs.com, why we collect it, and the choices you have.
            </p>

            <h2 className="text-2xl font-bold">Information we collect</h2>
            <p>We collect information you send us through the site:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact form: name, email, phone, company, service of interest, and message.</li>
              <li>Career applications: the details and files you submit for a role.</li>
              <li>Case study downloads and project forms: name, email, and the project information you choose to share.</li>
            </ul>
            <p>
              When you browse the site, Google Analytics (loaded through the Google tag) receives technical data such as pages viewed, approximate location, device, and browser. We use that information to understand which pages are useful.
            </p>

            <h2 className="text-2xl font-bold">How we use it</h2>
            <p>We use this information to reply to enquiries, prepare proposals, consider applications, deliver the work you ask us to do, and improve the website. We do not sell personal information.</p>

            <h2 className="text-2xl font-bold">Who we share it with</h2>
            <p>
              Email and hosting providers process messages so we can receive them. Google processes analytics data under its own terms. We share information with a client or partner only when it is needed to deliver work you requested, or when the law requires it.
            </p>

            <h2 className="text-2xl font-bold">How long we keep it</h2>
            <p>We keep enquiry and project records for as long as we need them to respond, complete the work, and meet accounting and legal duties. You can ask us to delete information we no longer need.</p>

            <h2 className="text-2xl font-bold">Your choices</h2>
            <p>
              You can ask to see, correct, or delete the personal information we hold about you, or object to how we use it. You can also block analytics cookies in your browser. See our <Link href="/cookies" className="text-[#E63946] hover:underline">Cookie Policy</Link> for the cookies this site uses.
            </p>

            <div className="mt-12 p-6 bg-secondary border border-border rounded-lg">
              <p className="text-muted-foreground">
                For privacy-related inquiries, please contact us at:{" "}
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
