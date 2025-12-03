import Image from "next/image"

interface Industry {
  id: string
  title: string
  description: string
  image: string
}

// Industries are now fully dynamic from the database

interface IndustriesSectionProps {
  data?: Industry[] | null
  backgroundImage?: string
}

export function IndustriesSection({ data, backgroundImage }: IndustriesSectionProps) {
  const industries = data || []

  return (
    <section className="relative py-20 bg-[#0a0a0a]">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#E63946] italic mb-4">Industries We Serve</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Deep industry expertise delivering tailored solutions across diverse sectors.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry) => (
            <div key={industry.id} className="rounded-2xl border border-[#E63946]/40 overflow-hidden bg-[#0a0a0a]">
              {/* Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={industry.image || "/placeholder.svg?height=200&width=400&query=" + industry.title}
                  alt={industry.title}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Text Content */}
              <div className="p-5">
                <h3 className="text-white text-lg font-semibold mb-2">{industry.title}</h3>
                <p className="text-gray-400 text-sm">{industry.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
