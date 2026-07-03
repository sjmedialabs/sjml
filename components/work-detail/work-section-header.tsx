interface WorkSectionHeaderProps {
  sectionNumber: string
  title: string
  description?: string
}

export function WorkSectionHeader({ sectionNumber, title, description }: WorkSectionHeaderProps) {
  return (
    <div className="work-section-header grid md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-12">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{sectionNumber}</p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">{title}</h2>
      </div>
      {description?.trim() && (
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed md:pt-6">{description}</p>
      )}
    </div>
  )
}
