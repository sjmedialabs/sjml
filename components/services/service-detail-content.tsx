import type { CSSProperties } from "react"
import type { ServiceDetailTemplate } from "@/lib/service-detail-template"
import { SectionLabel } from "@/components/about/section-label"
import { ServiceDetailFeatureIcon, ServiceDetailProcessIcon } from "./service-detail-icons"
import { ServiceDetailBottomCta } from "./service-detail-sidebar"

function CheckBullet() {
  return (
    <span className="service-offering-check shrink-0 mt-0.5 text-home-primary" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function ServiceDetailContent({ template }: { template: ServiceDetailTemplate }) {
  const t = template.typography

  return (
    <div className="service-detail-content space-y-8 md:space-y-9">
      {(template.introHeading || template.introParagraph1 || template.introParagraph2) && (
        <section className="service-detail-intro max-w-3xl">
          {template.introHeading && (
            <h2
              className="font-bold text-black leading-tight mb-2.5"
              style={{ fontSize: `${t.introHeadingFontSize}px` }}
            >
              {template.introHeading}
            </h2>
          )}
          {template.introParagraph1 && (
            <p className="text-black/75 leading-relaxed" style={{ fontSize: `${t.introFontSize}px` }}>
              {template.introParagraph1}
            </p>
          )}
          {template.introParagraph2 && (
            <p className="text-black/75 leading-relaxed mt-2" style={{ fontSize: `${t.introFontSize}px` }}>
              {template.introParagraph2}
            </p>
          )}
        </section>
      )}

      {template.offeringsEnabled && template.offerings.length > 0 && (
        <section className="service-offerings-section">
          <h2 className="font-bold text-black mb-4 leading-tight" style={{ fontSize: `${t.sectionTitleFontSize}px` }}>
            {template.offeringsTitle}
          </h2>
          <div className="space-y-3">
            {template.offerings.map((offering) => (
              <article key={offering.id} className="service-offering-card border border-black/10 rounded-xl p-4 md:p-5">
                <div className="service-offering-card-grid">
                  <div className="min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <ServiceDetailFeatureIcon icon={offering.icon} size={t.featureIconSize} />
                      <h3 className="font-bold text-black leading-snug pt-1" style={{ fontSize: `${t.offeringTitleFontSize}px` }}>
                        {offering.title}
                      </h3>
                    </div>
                    {offering.description && (
                      <p className="text-black/65 leading-relaxed" style={{ fontSize: `${t.offeringDescriptionFontSize}px` }}>
                        {offering.description}
                      </p>
                    )}
                  </div>
                  {offering.points.length > 0 && (
                    <ul className="space-y-2.5 md:pl-4 md:border-l md:border-black/8">
                      {offering.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm text-black/75 leading-snug">
                          <CheckBullet />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {template.valuesEnabled && template.values.length > 0 && (
        <section className="service-values-section">
          <h2 className="font-bold text-black mb-4 leading-tight" style={{ fontSize: `${t.sectionTitleFontSize}px` }}>
            {template.valuesTitle}
          </h2>
          <div className="service-values-grid">
            {template.values.map((item) => (
              <div key={item.id} className="service-value-cell">
                <div className="mb-2">
                  <ServiceDetailFeatureIcon icon={item.icon} size={t.featureIconSize} />
                </div>
                <h3 className="font-bold text-black mb-1.5 leading-snug" style={{ fontSize: `${t.featureTitleFontSize}px` }}>
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-black/65 leading-relaxed" style={{ fontSize: `${t.featureDescriptionFontSize}px` }}>
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {template.audiencesEnabled && template.audiences.length > 0 && (
        <section className="service-audiences-section">
          <h2 className="font-bold text-black mb-4 leading-tight" style={{ fontSize: `${t.sectionTitleFontSize}px` }}>
            {template.audiencesTitle}
          </h2>
          <div className="service-audiences-grid">
            {template.audiences.map((item) => (
              <div key={item.id} className="service-audience-card border border-black/10 rounded-xl p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <ServiceDetailFeatureIcon icon={item.icon} size={t.featureIconSize} />
                </div>
                <h3 className="font-bold text-black mb-1 leading-snug" style={{ fontSize: `${t.featureTitleFontSize}px` }}>
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-black/60 leading-relaxed" style={{ fontSize: `${t.featureDescriptionFontSize}px` }}>
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {template.highlightsEnabled && template.features.length > 0 && (
        <section className="service-highlights-section">
          {template.highlightsTitle && (
            <h2 className="font-bold text-black mb-4 leading-tight" style={{ fontSize: `${t.sectionTitleFontSize}px` }}>
              {template.highlightsTitle}
            </h2>
          )}
          <div className="service-highlights-grid">
            {template.features.map((feature) => (
              <div key={feature.id} className="service-highlight-card rounded-xl p-4 bg-[color-mix(in_srgb,var(--home-primary)_18%,white)]">
                <div className="mb-2">
                  <ServiceDetailFeatureIcon icon={feature.icon} size={t.featureIconSize} />
                </div>
                <h3 className="font-bold text-black mb-1.5 leading-snug" style={{ fontSize: `${t.featureTitleFontSize}px` }}>
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="text-black/65 leading-relaxed" style={{ fontSize: `${t.featureDescriptionFontSize}px` }}>
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {template.processSteps.length > 0 && (
        <section className="service-process-section">
          <SectionLabel fontSize={t.processLabelFontSize}>{template.processLabel}</SectionLabel>
          <h2 className="font-bold text-black mb-6 leading-tight" style={{ fontSize: `${t.processTitleFontSize}px` }}>
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
