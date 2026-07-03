import type { AboutValuesSection, AboutJourneySection } from "@/lib/about-content"
import { SectionLabel } from "./section-label"
import { AboutValueIcon } from "./about-value-icons"
import { STAT_ICON_PRESETS, isStatIconPreset } from "@/components/stats-icons"

export function ValuesJourneySection({
  values,
  journey,
}: {
  values: AboutValuesSection
  journey: AboutJourneySection
}) {
  const vType = values.typography
  const jType = journey.typography

  return (
    <section className="about-values-journey bg-white pb-10 md:pb-14">
      <div className="site-container">
        <div className="about-values-journey-grid">
          <div className="about-values-column">
            <SectionLabel fontSize={vType.sectionLabelFontSize}>{values.label}</SectionLabel>
            <ul className="about-values-list">
              {values.items.map((item) => (
                <li key={item.id} className="about-values-item">
                  <AboutValueIcon
                    icon={item.icon}
                    circleSize={vType.iconCircleSize}
                    glyphSize={vType.iconGlyphSize}
                  />
                  <div className="min-w-0">
                    <h3
                      className="about-value-title font-bold uppercase tracking-wide text-black"
                      style={{ fontSize: `${vType.itemTitleFontSize}px` }}
                    >
                      {item.title}
                    </h3>
                    {item.description && (
                      <p
                        className="about-value-description leading-relaxed text-black/75"
                        style={{ fontSize: `${vType.itemDescriptionFontSize}px` }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="about-journey-column">
            <SectionLabel fontSize={jType.sectionLabelFontSize}>{journey.label}</SectionLabel>
            <div className="about-journey-grid">
              {journey.items.map((stat) => {
                const Icon = isStatIconPreset(stat.icon) ? STAT_ICON_PRESETS[stat.icon] : STAT_ICON_PRESETS.users
                return (
                  <div key={stat.id} className="about-journey-stat">
                    <div
                      className="about-journey-icon text-home-primary [&_svg]:!w-full [&_svg]:!h-full"
                      style={{ width: jType.iconSize, height: jType.iconSize, marginBottom: "0.5rem" }}
                    >
                      <Icon />
                    </div>
                    <p
                      className="about-journey-value font-bold uppercase text-black leading-none"
                      style={{ fontSize: `${jType.statValueFontSize}px`, marginBottom: "0.375rem" }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="about-journey-label font-bold uppercase tracking-[0.12em] text-black"
                      style={{ fontSize: `${jType.statLabelFontSize}px`, marginBottom: "0.5rem" }}
                    >
                      {stat.label}
                    </p>
                    {stat.description && (
                      <p
                        className="about-journey-description leading-snug text-black/60 mx-auto"
                        style={{ fontSize: `${jType.statDescriptionFontSize}px`, maxWidth: "11rem" }}
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
      </div>
    </section>
  )
}
