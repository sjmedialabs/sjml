import type { WorkDetailTemplate } from "@/lib/work-detail-template"
import { WorkMetricIcon } from "@/components/work/work-icons"

export function WorkDetailResults({ template }: { template: WorkDetailTemplate }) {
  const typo = template.typography

  return (
    <section className="work-detail-results">
      <div className="site-container">
        <div className="work-detail-five-columns">
          <div className="work-detail-intro-column">
            <p className="work-detail-kicker" style={{ fontSize: `${typo.sectionLabelFontSize}px` }}>
              {template.resultsLabel}
            </p>
            <span className="work-detail-kicker-accent" aria-hidden="true" />
            <h2 className="work-detail-section-title" style={{ fontSize: `${typo.overviewTitleFontSize}px` }}>
              {template.resultsTitle}
            </h2>
            <p className="work-detail-overview-text" style={{ fontSize: `${typo.overviewTextFontSize}px` }}>
              {template.resultsText}
            </p>
          </div>

          {template.metrics.map((metric) => (
            <div key={metric.id} className="work-detail-column-group">
              <span className="work-detail-column-divider" aria-hidden="true" />
              <div className="work-detail-metric">
                <div className="work-detail-metric-icon">
                  <WorkMetricIcon icon={metric.icon} className="work-detail-metric-icon-svg" />
                </div>
                <p className="work-detail-metric-value" style={{ fontSize: `${typo.metricValueFontSize}px` }}>
                  {metric.value}
                </p>
                <p className="work-detail-metric-label" style={{ fontSize: `${typo.metricLabelFontSize}px` }}>
                  {metric.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
