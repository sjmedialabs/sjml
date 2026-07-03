import type { ContactInfoBlock, ContactPageTypography } from "@/lib/contact-page-content"

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  )
}

function PlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.4 20.4 21 12 3.4 3.6l1.5 6.3L16 12l-11.1 2.1-1.5 6.3Z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

const ICONS = {
  address: PinIcon,
  phone: PhoneIcon,
  email: MailIcon,
  hours: ClockIcon,
} as const

export function ContactInfoSection({
  data,
  typography,
}: {
  data: ContactInfoBlock
  typography: ContactPageTypography
}) {
  return (
    <div className="contact-info-block">
      <p className="contact-section-label" style={{ fontSize: `${typography.sectionLabelFontSize}px` }}>
        {data.label}
      </p>
      <h2 className="contact-section-heading" style={{ fontSize: `${typography.sectionHeadingFontSize}px` }}>
        {data.heading}
      </h2>

      <ul className="contact-info-list">
        {data.items.map((item) => {
          const Icon = ICONS[item.icon]
          const content = (
            <>
              <span className="contact-info-icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="contact-info-value" style={{ fontSize: `${typography.infoValueFontSize}px` }}>
                {item.value}
              </span>
            </>
          )
          return (
            <li key={item.id} className="contact-info-item">
              {item.href ? (
                <a href={item.href} className="contact-info-link">
                  {content}
                </a>
              ) : (
                content
              )}
            </li>
          )
        })}
      </ul>

      <div className="contact-email-callout">
        <span className="contact-email-callout-icon" aria-hidden="true">
          <PlaneIcon />
        </span>
        <div className="min-w-0">
          <p className="contact-email-callout-text" style={{ fontSize: `${typography.infoValueFontSize}px` }}>
            {data.emailCalloutText}{" "}
            <a href={`mailto:${data.emailCalloutEmail}`} className="contact-email-callout-link">
              {data.emailCalloutEmail}
            </a>
            <span className="contact-email-callout-arrow" aria-hidden="true">
              <ArrowIcon />
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
