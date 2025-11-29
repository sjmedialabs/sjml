import Image from "next/image"

interface Industry {
  id: string
  title: string
  description: string
  image: string
}

const defaultIndustries: Industry[] = [
  {
    id: "1",
    title: "Technology",
    description: "SaaS, Cloud, AI/ML, and emerging tech brands",
    image: "/technology-software-development-coding.jpg",
  },
  {
    id: "2",
    title: "Finance & Banking",
    description: "Fintech, Banking, Investment, and Insurance",
    image: "/finance-banking-fintech-modern.jpg",
  },
  {
    id: "3",
    title: "Healthcare",
    description: "Medical devices, Pharma, and Health services",
    image: "/healthcare-medical-hospital-modern.jpg",
  },
  {
    id: "4",
    title: "Retail & E-commerce",
    description: "D2C brands, Marketplaces, and Retail chains",
    image: "/retail-ecommerce-shopping-modern.jpg",
  },
  {
    id: "5",
    title: "Education",
    description: "EdTech, Universities, and Learning platforms",
    image: "/education-edtech-university-classroom.jpg",
  },
  {
    id: "6",
    title: "Real Estate",
    description: "Property development and Management",
    image: "/real-estate-property-building-modern.jpg",
  },
]

interface IndustriesSectionProps {
  data?: Industry[] | null
  backgroundImage?: string
}

export function IndustriesSection({ data, backgroundImage }: IndustriesSectionProps) {
  const industries = data || defaultIndustries

  return (
    <section className="relative py-20 bg-[#0a0a0a]">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/85" />
        </div>
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
