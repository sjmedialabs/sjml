"use client"

import { useState } from "react"
import Image from "next/image"

interface Testimonial {
  id: string
  quote: string
  author: string
  company: string
  image: string
  rating: number
}

// Testimonials are now fully dynamic from the database

function StarIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

interface TestimonialsSectionProps {
  data?: Testimonial[] | null
  backgroundImage?: string | null
}

export function TestimonialsSection({ data, backgroundImage }: TestimonialsSectionProps) {
  const testimonials = data || []
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[currentIndex]

  return (
    <section
      className="py-20 bg-[#0a0a0a] relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, #333 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#E63946] italic mb-4">What Our Clients Say</h2>
          <p className="text-gray-400">Don't just take our word for it. Hear from the brands we've helped transform.</p>
        </div>

        <div className="bg-[#0f0f0f] rounded-3xl p-8 md:p-12 border border-[#E63946]/50">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Profile Image with Quote Badge */}
            <div className="relative flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-[#1a1a1a]">
                <Image
                  src={current?.image || "/placeholder.svg?height=200&width=200&query=professional woman portrait"}
                  alt={current?.author || "Client"}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute bottom-2 right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-[#E63946] text-2xl font-serif">"</span>
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="flex-1 text-left">
              <p className="text-gray-300 text-lg md:text-xl mb-6 leading-relaxed">{current?.quote}</p>

              <p className="text-white font-bold text-lg mb-1">{current?.author}</p>
              <p className="text-[#E63946] text-sm mb-4">{current?.company}</p>

              <div className="inline-flex items-center gap-1 bg-[#333] rounded px-2 py-1 mb-6">
                {[...Array(current?.rating || 5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-[#ffc107]" filled />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full bg-[#444] flex items-center justify-center hover:bg-[#555] transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full bg-[#444] flex items-center justify-center hover:bg-[#555] transition-colors"
                >
                  <ArrowRightIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* View All Industries Link */}
          <div className="text-center mt-8 pt-6 border-t border-[#222]">
            <a href="#" className="text-white font-medium hover:text-[#E63946] transition-colors">
              View All Industries
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
