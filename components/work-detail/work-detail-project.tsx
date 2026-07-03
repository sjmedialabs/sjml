import type { WorkDetailTemplate } from "@/lib/work-detail-template"
import { WorkPillarIcon } from "@/components/work/work-icons"

export function WorkDetailProject({ template }: { template: WorkDetailTemplate }) {
  const typo = template.typography

  return (
    <section className="work-detail-project">
      <div className="site-container">
        <div className="work-detail-five-columns">
          <div className="work-detail-intro-column">
            <p className="work-detail-kicker" style={{ fontSize: `${typo.sectionLabelFontSize}px` }}>
              {template.projectLabel}
            </p>
            <span className="work-detail-kicker-accent" aria-hidden="true" />
            <h2 className="work-detail-section-title" style={{ fontSize: `${typo.overviewTitleFontSize}px` }}>
              {template.overviewTitle}
            </h2>
            <p className="work-detail-overview-text" style={{ fontSize: `${typo.overviewTextFontSize}px` }}>
              {template.overviewText}
            </p>
          </div>

          {template.pillars.map((pillar) => (
            <div key={pillar.id} className="work-detail-column-group">
              <span className="work-detail-column-divider" aria-hidden="true" />
              <div className="work-detail-pillar">
                <div className="work-detail-pillar-icon">
                  <WorkPillarIcon icon={pillar.icon} className="work-detail-pillar-icon-svg" />
                </div>
                <h3 className="work-detail-pillar-title" style={{ fontSize: `${typo.pillarTitleFontSize}px` }}>
                  {pillar.title}
                </h3>
                {pillar.description && (
                  <p className="work-detail-pillar-text" style={{ fontSize: `${typo.pillarTextFontSize}px` }}>
                    {pillar.description}
                  </p>
                )}
                {pillar.bullets?.length ? (
                  <ul className="work-detail-pillar-list">
                    {pillar.bullets.map((item) => (
                      <li key={item} style={{ fontSize: `${typo.pillarTextFontSize}px` }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
