import type { WorkDetailTemplate } from "@/lib/work-detail-template"

export function WorkDetailGallery({ template }: { template: WorkDetailTemplate }) {
  const typo = template.typography
  const images = template.galleryImages.filter(Boolean)

  if (!images.length) return null

  return (
    <section className="work-detail-gallery">
      <div className="site-container">
        <p className="work-detail-gallery-label" style={{ fontSize: `${typo.sectionLabelFontSize}px` }}>
          {template.galleryLabel}
        </p>
        <div className="work-detail-gallery-grid">
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="work-detail-gallery-cell">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="work-detail-gallery-image" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
