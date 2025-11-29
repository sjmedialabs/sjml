import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const testimonials = [
  {
    id: "1",
    quote:
      "This is due to their excellent service, competitive pricing and customer support. It's thoroughly refreshing to get such a personal touch. Not to mention they've helped us create an iconic brand as possible as necessary.",
    author: "Archana Patel",
    role: "CEO",
    company: "MediTravel",
    image: "/professional-indian-woman.png",
    rating: 5,
  },
  {
    id: "2",
    quote:
      "Working with SJ Media Labs transformed our brand presence. Their strategic approach and creative execution exceeded all expectations. Our revenue grew 250% in the first year.",
    author: "Michael Chen",
    role: "Founder",
    company: "TechVentures",
    image: "/professional-asian-man.png",
    rating: 5,
  },
  {
    id: "3",
    quote:
      "The team's dedication to understanding our business needs resulted in a website that truly represents our brand values. Customer engagement increased by 180%.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "GreenLeaf Co",
    image: "/professional-blonde-woman.png",
    rating: 5,
  },
  {
    id: "4",
    quote:
      "From strategy to execution, they handled everything with professionalism and creativity. Our brand is now recognized industry-wide thanks to their efforts.",
    author: "David Williams",
    role: "COO",
    company: "FinanceFlow",
    image: "/professional-man-suit.png",
    rating: 5,
  },
  {
    id: "5",
    quote:
      "Exceptional service and outstanding results. They truly understand digital marketing and deliver campaigns that convert. ROI exceeded our projections by 320%.",
    author: "Emily Rodriguez",
    role: "VP Marketing",
    company: "AutoDrive Motors",
    image: "/professional-hispanic-woman.png",
    rating: 5,
  },
  {
    id: "6",
    quote:
      "The best agency we've ever worked with. Their attention to detail and commitment to excellence is unmatched. Highly recommend for any brand looking to grow.",
    author: "James Thompson",
    role: "CEO",
    company: "CloudTech Solutions",
    image: "/professional-man-glasses.jpg",
    rating: 5,
  },
]

export default function TestimonialsPage() {
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Our Success Stories?</h2>
          <p className="text-[#888] mb-8">Let's create something extraordinary together.</p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-[#E63946] text-white rounded-full font-medium hover:bg-[#d62839] transition-colors"
          >
            Start Your Project
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
