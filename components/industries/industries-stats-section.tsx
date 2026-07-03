import type { IndustryStatItem, IndustriesPageTypography } from "@/lib/industries-page-content"
import { STAT_ICON_PRESETS, isStatIconPreset } from "@/components/stats-icons"

export function IndustriesStatsSection({
  stats,
  typography,
}: {
  stats: IndustryStatItem[]
  typography: IndustriesPageTypography
}) {
  if (!stats.length) return null

  return (
    <section className="industries-stats-section bg-white pb-10 md:pb-14">
      <div className="site-container">
        <div className="industries-stats-panel">
          <div className="industries-stats-grid">
            {stats.map((stat) => {
              const Icon = isStatIconPreset(stat.icon) ? STAT_ICON_PRESETS[stat.icon] : STAT_ICON_PRESETS.users
              return (
                <div key={stat.id} className="industries-stat-item text-center">
                  <div
                    className="text-home-primary mx-auto mb-3 [&_svg]:!w-full [&_svg]:!h-full"
                    style={{ width: typography.statIconSize, height: typography.statIconSize }}
                  >
                    <Icon />
                  </div>
                  <p
                    className="font-bold uppercase text-white leading-none mb-2"
                    style={{ fontSize: `${typography.statValueFontSize}px` }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="font-bold uppercase tracking-[0.12em] text-white mb-2"
                    style={{ fontSize: `${typography.statLabelFontSize}px` }}
                  >
                    {stat.label}
                  </p>
                  {stat.description && (
                    <p
                      className="text-white/60 leading-snug mx-auto"
                      style={{ fontSize: `${typography.statDescriptionFontSize}px`, maxWidth: "12rem" }}
                    >
                      {stat.description}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
