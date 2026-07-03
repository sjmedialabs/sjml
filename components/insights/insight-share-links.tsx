"use client"

import type { ComponentType } from "react"

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v8h4v-8h3.1L17 11h-4V9c0-.6.4-1 1-1Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.5 8.5h3V20h-3V8.5ZM8 4a1.75 1.75 0 1 1 0 3.5A1.75 1.75 0 0 1 8 4Zm4.5 4.5h2.9v1.6h.1c.4-.8 1.5-1.6 3.1-1.6 3.3 0 3.9 2.2 3.9 5V20h-3v-5.6c0-1.3 0-3-1.8-3-1.8 0-2.1 1.4-2.1 2.9V20h-3V8.5Z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.3 4H20l-6.5 7.4L21 20h-6.2l-4.8-6.3L4.6 20H2l7-8L2.9 4h6.3l4.4 5.8L17.3 4Zm-1.1 14h1.2L7.9 5.9H6.6L16.2 18Z" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
    </svg>
  )
}

const ICONS: Record<string, ComponentType> = {
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  link: LinkIcon,
}

export function InsightShareLinks({
  label,
  links,
  fontSize,
}: {
  label: string
  links: Array<{ id: string; platform: string; url: string }>
  fontSize: number
}) {
  return (
    <div className="insight-share">
      <p className="insight-share-label" style={{ fontSize: `${fontSize}px` }}>
        {label}
      </p>
      <div className="insight-share-links">
        {links.map((link) => {
          const Icon = ICONS[link.platform] ?? LinkIcon
          const href = link.platform === "link" ? `#` : link.url
          return (
            <a
              key={link.id}
              href={href}
              className="insight-share-link"
              aria-label={`Share on ${link.platform}`}
              onClick={
                link.platform === "link"
                  ? (e) => {
                      e.preventDefault()
                      void navigator.clipboard?.writeText(window.location.href)
                    }
                  : undefined
              }
            >
              <Icon />
            </a>
          )
        })}
      </div>
    </div>
  )
}
