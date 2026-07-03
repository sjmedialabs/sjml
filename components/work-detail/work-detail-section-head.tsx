export function WorkDetailSectionHead({
  label,
  title,
  labelFontSize = 11,
  titleFontSize = 28,
}: {
  label: string
  title: string
  labelFontSize?: number
  titleFontSize?: number
}) {
  return (
    <div className="work-detail-section-head">
      <p className="work-detail-kicker" style={{ fontSize: `${labelFontSize}px` }}>
        {label}
      </p>
      <h2 className="work-detail-section-title" style={{ fontSize: `${titleFontSize}px` }}>
        {title}
      </h2>
    </div>
  )
}
