"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface Service {
  id: string
  slug?: string
  title: string
  description: string
  icon: string
  image: string
}

// Services are now fully dynamic from the database

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
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

interface ServicesSectionProps {
  data?: Service[] | null
  backgroundImage?: string
}

export function ServicesSection({ data, backgroundImage }: ServicesSectionProps) {
  const services = data || []
  const [activeService, setActiveService] = useState(services[1]?.id || services[0]?.id)
  const activeServiceData = services.find((s) => s.id === activeService) || services[0]

  return (
    <section className="relative py-20 bg-[#0a0a0a]">
      {backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : (
        <>
          {/* Decorative curved lines */}
          <div className="absolute top-0 left-0 w-full h-32 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
              <path d="M0,50 Q300,0 600,50 T1200,50" stroke="#333" strokeWidth="1" fill="none" />
              <path d="M0,70 Q300,20 600,70 T1200,70" stroke="#333" strokeWidth="1" fill="none" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
              <path d="M0,50 Q300,100 600,50 T1200,50" stroke="#333" strokeWidth="1" fill="none" />
              <path d="M0,30 Q300,80 600,30 T1200,30" stroke="#333" strokeWidth="1" fill="none" />
            </svg>
          </div>
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#E63946] mb-4">Our Services</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Comprehensive solutions to elevate your brand and drive business growth across all channels.
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Left - Service List */}
          <div className="w-full lg:w-[380px] flex-shrink-0 flex flex-col gap-2">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all text-left ${
                  activeService === service.id
                    ? "bg-[#0a0a0a] border-[#E63946]"
                    : "bg-[#0a0a0a] border-[#2a2a2a] hover:border-[#444]"
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  {service.icon && (service.icon.startsWith('/') || service.icon.startsWith('http')) ? (
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={32}
                      height={32}
                      className="object-contain brightness-0 invert"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-white/10 rounded" />
                  )}
                </div>
                <span className="text-white font-medium flex-1">{service.title}</span>
                <ArrowRightIcon
                  className={`w-5 h-5 transition-colors ${activeService === service.id ? "text-[#E63946]" : "text-[#E63946]/60"}`}
                />
              </button>
            ))}
          </div>

          {/* Right - Image and Info Card */}
          <div className="flex-1 relative rounded-2xl overflow-hidden min-h-[500px]">
            {/* Main Image */}
            <Image
              src={activeServiceData.image || "/placeholder.svg?height=600&width=800&query=service"}
              alt={activeServiceData.title}
              fill
              className="object-cover"
            />

            {/* Info Card - Inside the image */}
            <div className="absolute bottom-4 right-4 left-4 md:left-auto md:w-[500px] bg-[rgba(15,15,20,0.9)] backdrop-blur-sm rounded-2xl p-6 border border-[#E63946]/30 shadow-[0_0_30px_rgba(230,57,70,0.15)]">
              {/* Icon */}
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4">
                {activeServiceData?.icon && (activeServiceData.icon.startsWith('/') || activeServiceData.icon.startsWith('http')) ? (
                  <Image
                    src={activeServiceData.icon}
                    alt={activeServiceData.title}
                    width={28}
                    height={28}
                    className="object-contain"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(27%) sepia(94%) saturate(2255%) hue-rotate(337deg) brightness(91%) contrast(91%)",
                    }}
                  />
                ) : (
                  <div className="w-7 h-7 bg-[#E63946] rounded" />
                )}
              </div>

              {/* Title */}
              <h3 className="text-[#E63946] text-xl font-semibold mb-2">{activeServiceData.title}</h3>

              {/* Description */}
              <p className="text-gray-300 text-sm mb-4">{activeServiceData.description}</p>

              {/* Link */}
              <Link
                href={`/services/${activeServiceData.slug || activeServiceData.id}`}
                className="text-[#E63946] text-sm font-medium inline-flex items-center gap-2 hover:gap-3 transition-all"
              >
                Explore {activeServiceData.title}
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
