import Image from "next/image"
import type { WorkDetailSections } from "@/lib/work-sections"
import { isValidWorkImage } from "@/lib/work-detail"
import { WorkSectionHeader } from "./work-section-header"
import { WorkIcon } from "./work-icon"
import { ProjectGallery } from "./project-gallery"

interface WorkDetailSectionsProps {
  sections: WorkDetailSections
}

export function WorkDetailSectionsView({ sections }: WorkDetailSectionsProps) {
  const { snapshot, delivered, gallery, process, results } = sections

  return (
    <div className="work-detail-sections">
      {snapshot.enabled &&
        (snapshot.summary ||
          isValidWorkImage(snapshot.featuredImage) ||
          snapshot.infoCards.length > 0) && (
          <section className="py-12 md:py-20 border-b border-border">
            <div className="site-container">
              <div className="grid lg:grid-cols-2 items-start gap-12">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    {snapshot.sectionNumber}
                  </p>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                    {snapshot.title}
                  </h2>
                  {snapshot.summary && (
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed whitespace-pre-line">
                      {snapshot.summary}
                    </p>
                  )}

{snapshot.infoCards.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 md:mt-8">
                  {snapshot.infoCards.map((card, index) => (
                    <div
                      key={`${card.label}-${index}`}
                      className="work-info-card rounded-xl p-5 md:p-6 text-center"
                    >
                      <div className="flex justify-center mb-3">
                        <WorkIcon src={card.icon} size={28} />
                      </div>
                      <p className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mb-2">
                        {card.label}
                      </p>
                      <p className="font-bold text-foreground text-xs md:text-base">{card.value}</p>
                    </div>
                  ))}
                </div>
              )}
                </div>
                {isValidWorkImage(snapshot.featuredImage) && (
                  <div className="mt-16 relative aspect-square max-w-xl mx-auto lg:mx-0 lg:ml-auto w-full rounded-xl overflow-hidden bg-muted dark:bg-zinc-900">
                    <Image
                      src={snapshot.featuredImage}
                      alt={snapshot.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 480px"
                      priority
                    />
                  </div>
                )}
              </div>

              
            </div>
          </section>
        )}

      {delivered.enabled && delivered.deliverables.length > 0 && (
        <section className="py-12 md:py-20 border-b border-border">
          <div className="site-container">
            <WorkSectionHeader
              sectionNumber={delivered.sectionNumber}
              title={delivered.title}
              description={delivered.description}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {delivered.deliverables.map((item, index) => (
                <div key={`${item.title}-${index}`} className="work-deliverable-card rounded-xl p-5 md:p-6 flex gap-4">
                  <div className="shrink-0 pt-1">
                    <WorkIcon src={item.icon} size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {gallery.enabled && gallery.items.length > 0 && (
        <section className="py-12 md:py-20 border-b border-border">
          <div className="site-container">
            <WorkSectionHeader
              sectionNumber={gallery.sectionNumber}
              title={gallery.title}
              description={gallery.description}
            />
            <ProjectGallery items={gallery.items} />
          </div>
        </section>
      )}

      {process.enabled && process.steps.length > 0 && (
        <section className="py-12 md:py-20 border-b border-border">
          <div className="site-container">
            <WorkSectionHeader
              sectionNumber={process.sectionNumber}
              title={process.title}
              description={process.description}
            />
            <div className="work-process-timeline overflow-x-auto pb-4 -mx-4 md:mx-0 md:px-0">
              <div
                className="flex gap-8 md:gap-6 relative md:grid md:w-full"
                style={{
                  gridTemplateColumns: `repeat(${process.steps.length}, minmax(0, 1fr))`,
                }}
              >
                {process.steps.map((step, index) => (
                  <div
                    key={`${step.stepNumber}-${index}`}
                    className="work-process-step flex flex-col items-center text-center w-[140px] md:w-auto shrink-0 md:shrink flex-1 min-w-0"
                  >
                    <div className="work-process-circle w-12 h-12 rounded-full border-2 border-[#E63946] flex items-center justify-center font-bold text-sm text-foreground mb-4 relative z-10 bg-background">
                      {step.stepNumber}
                    </div>
                    <h3 className="font-bold text-foreground text-sm md:text-base mb-2">{step.title}</h3>
                    {step.description && (
                      <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {results.enabled && results.metrics.length > 0 && (
        <section className="py-12 md:py-20">
          <div className="site-container">
            <WorkSectionHeader
              sectionNumber={results.sectionNumber}
              title={results.title}
              description={results.description}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {results.metrics.map((metric, index) => (
                <div key={`${metric.value}-${index}`} className="work-metric-card rounded-xl p-5 md:p-6 flex gap-4">
                  <div className="shrink-0">
                    <WorkIcon src={metric.icon} size={32} />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-foreground leading-none mb-1">
                      {metric.value}
                    </p>
                    {metric.title && (
                      <p className="font-semibold text-foreground text-sm mb-1">{metric.title}</p>
                    )}
                    {metric.description && (
                      <p className="text-muted-foreground text-xs leading-relaxed">{metric.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
