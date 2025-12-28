import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { getPageContent, type ContactPageData } from "@/lib/models/content"
import { ContactForm } from "@/components/contact-form"

export const revalidate = 3600 // Enable ISR: Revalidate every hour

export default async function ContactPage() {
  let data: ContactPageData | null = null
  try {
    data = await getPageContent("contact")
  } catch (error) {
    console.error("Failed to fetch contact data:", error)
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <h2 className="text-2xl font-bold text-white mb-4">Content Not Available</h2>
          <p className="text-[#888]">Page content has not been set up yet.</p>
        </div>
      </main>
    )
  }

  // Helper to highlight words in title
  const renderTitle = (title: string, highlightedWords: string[]) => {
    let result = title
    highlightedWords.forEach((word) => {
      result = result.replace(word, `<span class="text-[#E63946]">${word}</span>`)
    })
    return <span dangerouslySetInnerHTML={{ __html: result }} />
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={data.hero.backgroundImage || "/placeholder.svg?height=500&width=1920"}
            alt="Contact background"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 to-[#0a0a0a]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 text-center pt-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
            {data.hero.title.split(",").map((part, i) => (
              <span key={i}>
                {part}
                {i < data.hero.title.split(",").length - 1 && ","}
                <br />
              </span>
            ))}
          </h1>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[#E63946] text-sm mb-2">{data.form.badge}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {renderTitle(data.form.title, data.form.highlightedWords)}
            </h2>
          </div>

          <ContactForm buttonText={data.form.buttonText} />
        </div>
      </section>

      {/* Offices Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-[#888] text-sm mb-2 flex items-center gap-2">
              <span className="w-8 h-px bg-[#888]"></span> OUR OFFICES
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Reach Out to Our Global
              <br />
              Office
            </h2>
          </div>

          <div className="space-y-8">
            {data.offices.map((office, index) => (
              <div key={index} className="border-b border-[#222] pb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{office.flag}</span>
                  <h3 className="text-xl font-semibold text-[#E63946]">{office.country}</h3>
                </div>
                <p className="text-[#888]">{office.address}</p>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-[#222]">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🌐</span>
              <h3 className="text-xl font-bold text-white">{data.contact.title}</h3>
            </div>
            <div className="flex flex-wrap gap-8">
              <a href={`tel:${data.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-white">
                <svg className="w-5 h-5 text-[#E63946]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {data.contact.phone}
              </a>
              <a href={`mailto:${data.contact.email}`} className="flex items-center gap-2 text-white">
                <svg className="w-5 h-5 text-[#E63946]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {data.contact.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
