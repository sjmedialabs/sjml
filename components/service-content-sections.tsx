import { sanitizeHtml } from "@/lib/sanitize-html"
import {
  type ServiceContentSection,
  sectionIsVisible,
} from "@/lib/service-sections"

function isHtmlContent(content: string): boolean {
  return /<[a-zA-Z][^>]*>/.test(content)
}

interface ServiceContentSectionsProps {
  sections: ServiceContentSection[]
}

export function ServiceContentSections({ sections }: ServiceContentSectionsProps) {
  const visibleSections = sections.filter(sectionIsVisible)

  if (visibleSections.length === 0) return null

  return (
    <>
      {visibleSections.map((section, index) => (
        <section key={index} className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {section.title && (
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{section.title}</h2>
            )}
            {section.subtitle && (
              <p className="text-lg text-[#E63946] mb-4">{section.subtitle}</p>
            )}
            {section.description &&
              (isHtmlContent(section.description) ? (
                <div
                  className="service-detail-rich text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.description) }}
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.description}
                </p>
              ))}
          </div>
        </section>
      ))}
    </>
  )
}
