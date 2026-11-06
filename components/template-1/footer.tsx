"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useProvidedHeader } from "@/components/header-provider"
import { normalizeHeaderContent } from "@/lib/header-content"
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
  className?: string
}

export function Template1Footer({
  data,
  cmsFooter: initialCmsFooter,
  className = "",
}: Template1FooterProps) {
  const providedHeader = useProvidedHeader()
  const [cmsHeader, setCmsHeader] = useState(providedHeader)
  const [cmsFooterData, setCmsFooterData] = useState<FooterContent | null>(() =>
    initialCmsFooter ? normalizeFooterContent(initialCmsFooter) : null
  )

  useEffect(() => {
    let cancelled = false

    async function loadCmsData() {
      try {
        if (!providedHeader) {
          const headerRes = await fetch("/api/content/header")
          if (headerRes.ok && !cancelled) {
            const rawHeader = await headerRes.json()
            setCmsHeader(normalizeHeaderContent(rawHeader))
          }
        } else {
          setCmsHeader(providedHeader)
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
  }, [initialCmsFooter, providedHeader])

  const resolvedPhone =
    data?.phoneText ??
    (cmsFooterData?.phone?.trim() || defaultTemplate1FooterData.phoneText)
  const resolvedPhoneHref =
    data?.phoneHref ??
    (resolvedPhone
      ? `tel:${resolvedPhone.replace(/\s+/g, "")}`
      : defaultTemplate1FooterData.phoneHref)

  const resolvedEmail =
    data?.emailText ??
    (cmsFooterData?.email?.trim() || defaultTemplate1FooterData.emailText)
  const resolvedEmailHref =
    data?.emailHref ??
    (resolvedEmail
      ? `mailto:${resolvedEmail}`
      : defaultTemplate1FooterData.emailHref)

  const content: Required<Template1FooterData> = {
    ...defaultTemplate1FooterData,
    logoUrl:
      data?.logoUrl ??
      (cmsHeader?.logo?.trim() || defaultTemplate1FooterData.logoUrl),
    logoText:
      data?.logoText ??
      (cmsHeader?.logoText?.trim() ||
        cmsFooterData?.siteName?.trim() ||
        defaultTemplate1FooterData.logoText),
    taglineLine1:
      data?.taglineLine1 ?? defaultTemplate1FooterData.taglineLine1,
    taglineLine2:
      data?.taglineLine2 ?? defaultTemplate1FooterData.taglineLine2,
    logoHref: data?.logoHref ?? defaultTemplate1FooterData.logoHref,
    brandMotto:
      data?.brandMotto ??
      (cmsFooterData?.siteTagline?.trim() ||
        defaultTemplate1FooterData.brandMotto),
    phoneText: resolvedPhone,
    phoneHref: resolvedPhoneHref,
    emailText: resolvedEmail,
    emailHref: resolvedEmailHref,
    addressText:
      data?.addressText ??
      (cmsFooterData?.address?.trim() ||
        defaultTemplate1FooterData.addressText),
    legalLinks: data?.legalLinks ?? defaultTemplate1FooterData.legalLinks,
    copyrightText:
      data?.copyrightText ??
      (cmsFooterData?.copyright?.trim() ||
        defaultTemplate1FooterData.copyrightText),
  }

  return (
    <footer
      className={`w-full bg-white text-[#161617] py-12 border-t border-black/10 ${className}`}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Top 3-Column Grid */}
        <div className="grid grid-cols-1 gap-8 pb-8 border-b border-black/10 md:grid-cols-12">
          {/* Column 1: Brand & Motto */}
          <div className="md:col-span-5">
            <Link
              href={content.logoHref}
              className="inline-flex items-center gap-3 focus:outline-none"
            >
              {content.logoUrl ? (
                <Image
                  src={content.logoUrl}
                  alt={content.logoText}
                  width={180}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-[30px] sm:text-[34px] font-black tracking-tight leading-none text-[#FCC50E]">
                    {content.logoText}
                  </span>
                  <span
                    className="h-7 w-px bg-black/20 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.06em] leading-[1.15] text-[#161617]">
                    <span>{content.taglineLine1}</span>
                    <span>{content.taglineLine2}</span>
                  </div>
                </div>
              )}
            </Link>

            {content.brandMotto && (
              <p className="mt-3 text-[12px] text-[#161617]/55">
                {content.brandMotto}
              </p>
            )}
          </div>

          {/* Column 2: Contact Info */}
          <div className="md:col-span-4 flex flex-col space-y-1.5 text-[13px]">
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
              <p className="text-[#161617]/55 whitespace-pre-line">
                {content.addressText}
              </p>
            )}
          </div>

          {/* Column 3: Legal Links */}
          <div className="md:col-span-3 flex flex-col space-y-1.5 text-[12.5px]">
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
          <div className="pt-6">
            <p className="text-[11.5px] text-[#161617]/45">
              {content.copyrightText}
            </p>
          </div>
        )}
      </div>
    </footer>
  )
}
