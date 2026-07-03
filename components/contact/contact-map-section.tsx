import type { ContactMapBlock } from "@/lib/contact-page-content"

export function ContactMapSection({ data }: { data: ContactMapBlock }) {
  if (!data.embedUrl) return null

  return (
    <section className="contact-map-section">
      <div className="site-container">
        <div className="contact-map-wrap">
          <iframe
            title="SJML office location"
            src={data.embedUrl}
            className="contact-map-iframe"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
