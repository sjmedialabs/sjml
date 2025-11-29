interface Stat {
  id: string
  value: string
  label: string
}

interface StatsSectionProps {
  data?: Stat[] | null
  backgroundImage?: string
}

const defaultStats: Stat[] = [
  { id: "1", value: "500+", label: "Projects Completed" },
  { id: "2", value: "95%", label: "Client NPS Score" },
  { id: "3", value: "13+", label: "Years in Business" },
  { id: "4", value: "40+", label: "Countries Served" },
]

export function StatsSection({ data, backgroundImage }: StatsSectionProps) {
  const stats = data || defaultStats

  return (
    <section className="relative py-20 bg-[#0a0a0a]">
      {backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/80" />
        </div>
      ) : (
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #555 1px, transparent 0)`,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1.5px #E63946",
                  textShadow: "none",
                }}
              >
                {stat.value}
              </div>
              <div className="text-white text-sm md:text-base font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
