import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getPageContent } from "@/lib/models/content"
import { getDefaultPageContent } from "@/lib/defaults"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function TestimonialsPage() {
  let data

  try {
    data = await getPageContent("testimonials")
    if (!data) {
      data = getDefaultPageContent("testimonials")
    }
  } catch (error) {
    console.error("Failed to fetch testimonials content:", error)
    data = getDefaultPageContent("testimonials")
  }

  const hero = data?.hero || {
    title: "What Our Clients Say",
    subtitle: "Don't just take our word for it. Hear from the brands we've helped transform.",
  }

  const testimonials = data?.testimonials || []
  const cta = data?.cta || {
    title: "Ready to Join Our Success Stories?",
    description: "Let's create something extraordinary together.",
    buttonText: "Start Your Project",
    buttonUrl: "/contact",
  }
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our <span className="text-[#E63946]">Clients Say</span>
          </h1>
          <p className="text-xl text-[#888] max-w-3xl mx-auto">
            Don't just take our word for it. Hear from the brands we've helped transform.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-[#111] border border-[#222] rounded-2xl p-8">
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[#ccc] mb-6 leading-relaxed">"{testimonial.quote}"</p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-white font-medium">{testimonial.author}</div>
                    <div className="text-[#888] text-sm">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-[#111] border border-[#222] rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{cta.title}</h2>
          <p className="text-[#888] mb-8">{cta.description}</p>
          <a
            href={cta.buttonUrl}
            className="inline-block px-8 py-4 bg-[#E63946] text-white rounded-full font-medium hover:bg-[#d62839] transition-colors"
          >
            {cta.buttonText}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
