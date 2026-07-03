import type { CSSProperties } from "react"
import type { ServiceDetailTemplate } from "@/lib/service-detail-template"
import { SectionLabel } from "@/components/about/section-label"
import { ServiceDetailFeatureIcon, ServiceDetailProcessIcon } from "./service-detail-icons"
import { ServiceDetailBottomCta } from "./service-detail-sidebar"

function ServiceDetailTitle({ title, fontSize }: { title: string; fontSize: number }) {
  const words = title.trim().split(/\s+/)
  const firstWord = words[0] ?? title
  const rest = words.slice(1).join(" ")

  return (
    <h1 className="font-bold text-black mb-5 leading-tight" style={{ fontSize: `${fontSize}px` }}>
      <span className="service-detail-title-underline">{firstWord}</span>
      {rest ? ` ${rest}` : ""}
    </h1>
  )
}

export function ServiceDetailContent({ template }: { template: ServiceDetailTemplate }) {
  const t = template.typography

  return (
    <div className="service-detail-content space-y-12 md:space-y-14">
      <section className="service-detail-intro">
        <div className="service-detail-intro-grid">
          <div className="min-w-0">
            {template.categoryLabel && (
              <SectionLabel fontSize={t.categoryLabelFontSize}>{template.categoryLabel}</SectionLabel>
            )}
            <ServiceDetailTitle title={template.title} fontSize={t.titleFontSize} />
            {template.introParagraph1 && (
              <p className="text-black/75 leading-relaxed max-w-xl" style={{ fontSize: `${t.introFontSize}px` }}>
                {template.introParagraph1}
              </p>
            )}
            {template.introParagraph2 && (
              <p className="text-black/75 leading-relaxed max-w-xl mt-3" style={{ fontSize: `${t.introFontSize}px` }}>
                {template.introParagraph2}
              </p>
            )}
          </div>
          {template.introImage && (
            <div className="service-detail-intro-media flex items-start justify-center lg:justify-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={template.introImage} alt="" className="service-detail-intro-image max-w-full h-auto rounded-xl" />
            </div>
          )}
        </div>
      </section>

      {template.features.length > 0 && (
        <section className="service-features-row" aria-label="Service features">
          {template.features.map((feature, index) => (
            <div key={feature.id} className="service-feature-cell">
              <div className="mb-3">
                <ServiceDetailFeatureIcon icon={feature.icon} size={t.featureIconSize} />
              </div>
              <h3 className="font-bold text-black mb-2 leading-snug" style={{ fontSize: `${t.featureTitleFontSize}px` }}>
                {feature.title}
              </h3>
              {feature.description && (
                <p className="text-black/65 leading-relaxed" style={{ fontSize: `${t.featureDescriptionFontSize}px` }}>
                  {feature.description}
                </p>
              )}
              {index < template.features.length - 1 && (
                <span className="service-feature-divider hidden lg:block" aria-hidden="true" />
              )}
            </div>
          ))}
        </section>
      )}

      {template.processSteps.length > 0 && (
        <section className="service-process-section">
          <SectionLabel fontSize={t.processLabelFontSize}>{template.processLabel}</SectionLabel>
          <h2 className="font-bold text-black mb-10 leading-tight" style={{ fontSize: `${t.processTitleFontSize}px` }}>
            {template.processTitleLine1}{" "}
            <span className="text-home-primary">{template.processTitleHighlight}</span>
          </h2>
          <div
            className="service-process-timeline"
            style={{ "--process-icon-size": `${t.processIconSize + 8}px` } as CSSProperties}
          >
            <div className="service-process-line hidden lg:block" aria-hidden="true" />
            <div className="service-process-steps">
              {template.processSteps.map((step) => (
                <div key={step.id} className="service-process-step">
                  <div
                    className="service-process-node rounded-full border-2 border-home-primary bg-white flex items-center justify-center mb-4 relative z-10 mx-auto"
                    style={{ width: t.processIconSize + 8, height: t.processIconSize + 8 }}
                  >
                    <ServiceDetailProcessIcon icon={step.icon} size={Math.round(t.processIconSize * 0.5)} />
                  </div>
                  <p
                    className="text-black font-bold uppercase mb-1.5 leading-tight text-center"
                    style={{ fontSize: `${t.processStepTitleFontSize}px` }}
                  >
                    {step.stepNumber}. {step.title}
                  </p>
                  {step.description && (
                    <p
                      className="text-black/60 leading-snug text-center"
                      style={{ fontSize: `${t.processStepDescriptionFontSize}px` }}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ServiceDetailBottomCta data={template.bottomCta} typography={t} />
    </div>
  )
}
