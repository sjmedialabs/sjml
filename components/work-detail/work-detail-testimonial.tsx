import type { WorkDetailTemplate } from "@/lib/work-detail-template"

const DETAIL_ROWS: { key: keyof WorkDetailTemplate["projectDetails"]; label: string }[] = [
  { key: "client", label: "Client" },
  { key: "industry", label: "Industry" },
  { key: "services", label: "Services" },
  { key: "duration", label: "Duration" },
  { key: "team", label: "Team" },
  { key: "website", label: "Website" },
]

export function WorkDetailTestimonial({ template }: { template: WorkDetailTemplate }) {
  const typo = template.typography
  const { testimonial, projectDetails, sideImage } = template

  return (
    <section className="work-detail-testimonial">
      <div className="site-container">
        <div className="work-detail-testimonial-grid">
          <div className="work-detail-quote-card">
            <span className="work-detail-quote-mark" aria-hidden="true">
              &ldquo;
            </span>
            <p className="work-detail-quote-text" style={{ fontSize: `${typo.testimonialFontSize}px` }}>
              {testimonial.quote}
            </p>
            <div className="work-detail-quote-author">
              {testimonial.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={testimonial.image} alt={testimonial.author} className="work-detail-quote-avatar" />
              ) : (
                <div className="work-detail-quote-avatar work-detail-quote-avatar-placeholder" />
              )}
              <div>
                <p className="work-detail-quote-name">{testimonial.author}</p>
                <p className="work-detail-quote-role">{testimonial.role}</p>
              </div>
            </div>
          </div>

          <div className="work-detail-details">
            <h3 className="work-detail-details-heading" style={{ fontSize: `${typo.detailsLabelFontSize}px` }}>
              {template.projectDetailsLabel || "PROJECT DETAILS"}
            </h3>
            {DETAIL_ROWS.map(({ key, label }) => {
              const value = projectDetails[key]
              if (!value) return null
              const isWebsite = key === "website"
              return (
                <div key={key} className="work-detail-detail-row">
                  <span className="work-detail-detail-label" style={{ fontSize: `${typo.detailsLabelFontSize}px` }}>
                    {label}
                  </span>
                  {isWebsite ? (
                    <a
                      href={value.startsWith("http") ? value : `https://${value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work-detail-detail-value work-detail-detail-link"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="work-detail-detail-value">{value}</span>
                  )}
                </div>
              )
            })}
          </div>

          {sideImage && (
            <div className="work-detail-side-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sideImage} alt="" className="work-detail-side-image-img" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
