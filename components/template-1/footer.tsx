"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useProvidedHeader } from "@/components/header-provider"
import { normalizeHeaderContent, type NormalizedHeaderContent } from "@/lib/header-content"
import { normalizeFooterContent, type FooterContent } from "@/lib/footer-content"
import {
  type Template1FooterData,
  type Template1FooterLink,
  defaultTemplate1FooterData,
} from "./default-data"

export type { Template1FooterData, Template1FooterLink }

export interface Template1FooterProps {
  data?: Template1FooterData
  cmsFooter?: unknown
  cmsHeader?: NormalizedHeaderContent | null
  className?: string
}

export function Template1Footer({
  data,
  cmsFooter: initialCmsFooter,
  cmsHeader: cmsHeaderProp,
  className = "",
}: Template1FooterProps) {
  const providedHeader = useProvidedHeader()
  const [cmsHeaderState, setCmsHeaderState] = useState<NormalizedHeaderContent | null>(
    cmsHeaderProp ?? providedHeader ?? null
  )
  const [cmsFooterData, setCmsFooterData] = useState<FooterContent | null>(() =>
    initialCmsFooter ? normalizeFooterContent(initialCmsFooter) : null
  )

  useEffect(() => {
    if (cmsHeaderProp) {
      setCmsHeaderState(cmsHeaderProp)
    } else if (providedHeader) {
      setCmsHeaderState(providedHeader)
    }
  }, [cmsHeaderProp, providedHeader])

  useEffect(() => {
    if (initialCmsFooter) {
      setCmsFooterData(normalizeFooterContent(initialCmsFooter))
    }
  }, [initialCmsFooter])

  useEffect(() => {
    let cancelled = false

    async function loadCmsData() {
      try {
        if (!cmsHeaderProp && !providedHeader) {
          const headerRes = await fetch("/api/content/header")
          if (headerRes.ok && !cancelled) {
            const rawHeader = await headerRes.json()
            setCmsHeaderState(normalizeHeaderContent(rawHeader))
          }
        }

        if (initialCmsFooter) {
          setCmsFooterData(normalizeFooterContent(initialCmsFooter))
          return
        }
        const res = await fetch("/api/content/footer")
        if (res.ok && !cancelled) {
          const json = await res.json()
          setCmsFooterData(normalizeFooterContent(json))
        }
      } catch (error) {
        console.error("Failed to fetch CMS footer content:", error)
      }
    }

    loadCmsData()
    return () => {
      cancelled = true
    }
  }, [initialCmsFooter, cmsHeaderProp, providedHeader])

  const activeHeader = cmsHeaderProp || cmsHeaderState || providedHeader

  // Fetch the logo for header and footer of this template from the website's header
  const resolvedLogoUrl =
    (data?.logoUrl && data.logoUrl.trim()) ||
    (activeHeader?.logo && typeof activeHeader.logo === "string" && activeHeader.logo.trim()) ||
    (cmsFooterData?.logo && cmsFooterData.logo.trim()) ||
    ""

  const rawLogoText =
    (data?.logoText && data.logoText.trim()) ||
    (activeHeader?.logoText && activeHeader.logoText.trim()) ||
    (cmsFooterData?.siteName && cmsFooterData.siteName.trim()) ||
    defaultTemplate1FooterData.logoText

  const isSjmlBrand = !rawLogoText || rawLogoText === "SJML" || rawLogoText === "SJ MEDIA LABS"

  // Contact details resolution: check footer CMS, header CMS, and fallback
  const resolvedPhone =
    (data?.phoneText && data.phoneText.trim()) ||
    (cmsFooterData?.phone && cmsFooterData.phone.trim()) ||
    (activeHeader?.phone && activeHeader.phone.trim()) ||
    defaultTemplate1FooterData.phoneText

  const resolvedPhoneHref =
    (data?.phoneHref && data.phoneHref.trim()) ||
    (resolvedPhone
      ? `tel:${resolvedPhone.replace(/\s+/g, "")}`
      : defaultTemplate1FooterData.phoneHref)

  const resolvedEmail =
    (data?.emailText && data.emailText.trim()) ||
    (cmsFooterData?.email && cmsFooterData.email.trim()) ||
    defaultTemplate1FooterData.emailText

  const resolvedEmailHref =
    (data?.emailHref && data.emailHref.trim()) ||
    (resolvedEmail
      ? `mailto:${resolvedEmail}`
      : defaultTemplate1FooterData.emailHref)

  const resolvedAddress =
    (data?.addressText && data.addressText.trim()) ||
    (cmsFooterData?.address && cmsFooterData.address.trim()) ||
    defaultTemplate1FooterData.addressText

  const resolvedCopyright =
    (data?.copyrightText && data.copyrightText.trim()) ||
    (cmsFooterData?.copyright && cmsFooterData.copyright.trim()) ||
    defaultTemplate1FooterData.copyrightText

  const resolvedBrandMotto =
    (data?.brandMotto && data.brandMotto.trim()) ||
    (cmsFooterData?.siteTagline && cmsFooterData.siteTagline.trim()) ||
    defaultTemplate1FooterData.brandMotto

  const content: Required<Template1FooterData> = {
    ...defaultTemplate1FooterData,
    logoUrl: resolvedLogoUrl,
    logoText: rawLogoText,
    taglineLine1:
      data?.taglineLine1 ?? defaultTemplate1FooterData.taglineLine1,
    taglineLine2:
      data?.taglineLine2 ?? defaultTemplate1FooterData.taglineLine2,
    logoHref: data?.logoHref ?? defaultTemplate1FooterData.logoHref,
    brandMotto: resolvedBrandMotto,
    phoneText: resolvedPhone,
    phoneHref: resolvedPhoneHref,
    emailText: resolvedEmail,
    emailHref: resolvedEmailHref,
    addressText: resolvedAddress,
    legalLinks: data?.legalLinks ?? defaultTemplate1FooterData.legalLinks,
    copyrightText: resolvedCopyright,
  }

  return (
    <footer
      className={`w-full bg-white text-[#161617] py-12 border-t border-black/10 ${className}`}
    >
      <div className="mx-auto w-full max-w-[1200px] xl:max-w-[1320px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Top 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-8 lg:gap-10 pb-8 sm:pb-10 border-b border-black/10">
          {/* Column 1: Brand & Motto */}
          <div className="sm:col-span-2 md:col-span-5">
            <Link
              href={content.logoHref}
              className="site-header-logo inline-flex items-center gap-2 focus:outline-none"
              aria-label="SJML Home"
            >
              {resolvedLogoUrl ? (
                <Image
                  src={resolvedLogoUrl}
                  alt={rawLogoText || "SJ Media Labs"}
                  width={180}
                  height={48}
                  className="site-header-logo-img h-auto w-auto max-h-8 sm:max-h-10 md:max-h-11 lg:max-h-12 max-w-[160px] sm:max-w-[200px] md:max-w-none object-contain"
                  unoptimized={resolvedLogoUrl.startsWith("data:") || resolvedLogoUrl.endsWith(".svg") || resolvedLogoUrl.startsWith("http")}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="site-header-logo-text text-primary font-bold tracking-tight leading-none text-xl sm:text-2xl">
                    {isSjmlBrand ? "SJML" : rawLogoText}
                  </span>
                  <span
                    className="site-header-logo-rule hidden sm:block w-px h-6 bg-black/15 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="site-header-logo-tagline hidden sm:flex flex-col text-[10px] leading-tight">
                    <span className="font-semibold text-[#000000] uppercase">
                      {content.taglineLine1 || "Branding &"}
                    </span>
                    <span className="font-semibold text-[#000000] uppercase">
                      {content.taglineLine2 || "Advertising"}
                    </span>
                  </div>
                </div>
              )}
            </Link>

            {content.brandMotto && (
              <p className="mt-3 text-[11.5px] sm:text-[12px] md:text-[12.5px] text-[#161617]/55 max-w-[340px]">
                {content.brandMotto}
              </p>
            )}
          </div>

          {/* Column 2: Contact Info */}
          <div className="sm:col-span-1 md:col-span-4 flex flex-col space-y-1.5 sm:space-y-2 text-[12.5px] sm:text-[13px] md:text-[13.5px]">
            {content.phoneText && (
              <a
                href={content.phoneHref}
                className="font-medium text-[#161617]/80 hover:text-[#161617] transition-colors w-fit"
              >
                {content.phoneText}
              </a>
            )}
            {content.emailText && (
              <a
                href={content.emailHref}
                className="text-[#161617]/65 hover:text-[#161617] transition-colors w-fit"
              >
                {content.emailText}
              </a>
            )}
            {content.addressText && (
              <p className="text-[#161617]/55 whitespace-pre-line leading-relaxed">
                {content.addressText}
              </p>
            )}
          </div>

          {/* Column 3: Legal Links */}
          <div className="sm:col-span-1 md:col-span-3 flex flex-col space-y-1.5 sm:space-y-2 text-[12px] sm:text-[12.5px] md:text-[13px]">
            {content.legalLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="text-[#161617]/60 hover:text-[#161617] transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Copyright */}
        {content.copyrightText && (
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-[11px] sm:text-[11.5px] text-[#161617]/45">
              {content.copyrightText}
            </p>
          </div>
        )}
      </div>
    </footer>
  )
}
