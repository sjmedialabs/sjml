import type { WorkPageStatItem, WorkPageTestimonial, WorkPageTypography } from "@/lib/work-page-content"
import { STAT_ICON_PRESETS, isStatIconPreset } from "@/components/stats-icons"

export function WorkStatsSection({
  stats,
  testimonial,
  typography,
}: {
  stats: WorkPageStatItem[]
  testimonial: WorkPageTestimonial
  typography: WorkPageTypography
}) {
  return (
    <section className="work-stats-section bg-[#f5f5f5] py-10 md:py-14">
      <div className="site-container">
        <div className="work-stats-grid">
          <div className="work-stats-items">
            {stats.map((stat) => {
              const Icon = isStatIconPreset(stat.icon) ? STAT_ICON_PRESETS[stat.icon] : STAT_ICON_PRESETS.users
              return (
                <div key={stat.id} className="work-stat-item">
                  <div className="text-home-primary mb-3 [&_svg]:!w-9 [&_svg]:!h-9">
                    <Icon />
                  </div>
                  <p className="font-bold text-black leading-none mb-1" style={{ fontSize: `${typography.statValueFontSize}px` }}>
                    {stat.value}
                  </p>
                  <p
                    className="font-bold uppercase tracking-[0.1em] text-black mb-1.5"
                    style={{ fontSize: `${typography.statLabelFontSize}px` }}
                  >
                    {stat.label}
                  </p>
                  {stat.description && (
                    <p className="text-black/55 leading-snug" style={{ fontSize: `${typography.statDescriptionFontSize}px` }}>
                      {stat.description}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
          {testimonial.quote && (
            <div className="work-testimonial">
              <span className="text-home-primary text-5xl leading-none font-serif" aria-hidden="true">
                &ldquo;
              </span>
              <p className="text-black/80 leading-relaxed mt-2 mb-4" style={{ fontSize: `${typography.testimonialFontSize}px` }}>
                {testimonial.quote}
              </p>
              {(testimonial.author || testimonial.role) && (
                <p className="text-black/60 text-sm">
                  — {testimonial.author}
                  {testimonial.role ? `, ${testimonial.role}` : ""}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
