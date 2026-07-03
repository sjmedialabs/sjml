import type { WorkDetailTemplate } from "@/lib/work-detail-template"
import { WorkDetailHero } from "./work-detail-hero"
import { WorkDetailProject } from "./work-detail-project"
import { WorkDetailGallery } from "./work-detail-gallery"
import { WorkDetailResults } from "./work-detail-results"
import { WorkDetailTestimonial } from "./work-detail-testimonial"
import { WorkDetailBottomCta } from "./work-detail-bottom-cta"

export function WorkDetailView({
  title,
  template,
}: {
  title: string
  template: WorkDetailTemplate
}) {
  return (
    <>
      <WorkDetailHero title={title} template={template} />
      <WorkDetailProject template={template} />
      {template.galleryImages.length > 0 && <WorkDetailGallery template={template} />}
      <WorkDetailResults template={template} />
      <WorkDetailTestimonial template={template} />
      <WorkDetailBottomCta template={template} />
    </>
  )
}