"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useProvidedHeader } from "@/components/header-provider"
import { normalizeHeaderContent, type NormalizedHeaderContent } from "@/lib/header-content"
import { normalizeFooterContent, type FooterContent } from "@/lib/footer-content"
import {
  type Template1HeaderData,
  type Template1LeadFormValues,
  defaultTemplate1HeaderData,
} from "./default-data"
import { Template1ConsultationModal } from "./consultation-modal"

export type { Template1HeaderData }

export interface Template1HeaderProps {
  data?: Template1HeaderData
  cmsHeader?: NormalizedHeaderContent | null
  cmsFooter?: unknown
  onCtaClick?: () => void
  onModalSubmit?: (values: Template1LeadFormValues) => Promise<void> | void
  className?: string
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.5 10.5L10.5 3.5M10.5 3.5H4.5M10.5 3.5V9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Template1Header({
  data,
  cmsHeader: cmsHeaderProp,
  cmsFooter: initialCmsFooter,
  onCtaClick,
  onModalSubmit,
  className = "",
}: Template1HeaderProps) {
  const providedHeader = useProvidedHeader()
  const [cmsHeaderState, setCmsHeaderState] = useState<NormalizedHeaderContent | null>(
    cmsHeaderProp ?? providedHeader ?? null
  )
  const [cmsFooterData, setCmsFooterData] = useState<FooterContent | null>(() =>
    initialCmsFooter ? normalizeFooterContent(initialCmsFooter) : null
  )
  const [cmsPhone, setCmsPhone] = useState<string>(() =>
    initialCmsFooter ? normalizeFooterContent(initialCmsFooter).phone?.trim() || "" : ""
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (cmsHeaderProp) {
      setCmsHeaderState(cmsHeaderProp)
    } else if (providedHeader) {
      setCmsHeaderState(providedHeader)
    }
  }, [cmsHeaderProp, providedHeader])

  useEffect(() => {
    if (initialCmsFooter) {
      const normalized = normalizeFooterContent(initialCmsFooter)
      setCmsFooterData(normalized)
      if (normalized.phone?.trim()) setCmsPhone(normalized.phone.trim())
    }
  }, [initialCmsFooter])

  useEffect(() => {
    let cancelled = false

    async function loadCmsHeaderAndPhone() {
      try {
        const [headerRes, footerRes] = await Promise.all([
          !cmsHeaderProp && !providedHeader ? fetch("/api/content/header") : Promise.resolve(null),
          !initialCmsFooter ? fetch("/api/content/footer") : Promise.resolve(null),
        ])

        if (!cancelled && headerRes && headerRes.ok) {
          const rawHeader = await headerRes.json()
          setCmsHeaderState(normalizeHeaderContent(rawHeader))
        }

        if (!cancelled && footerRes && footerRes.ok) {
          const rawFooter = await footerRes.json()
          const normalizedFooter = normalizeFooterContent(rawFooter)
          setCmsFooterData(normalizedFooter)
          if (normalizedFooter.phone?.trim()) {
            setCmsPhone(normalizedFooter.phone.trim())
          }
        }
      } catch (error) {
        console.error("Failed to fetch CMS header content:", error)
      }
    }

    loadCmsHeaderAndPhone()
    return () => {
      cancelled = true
    }
  }, [cmsHeaderProp, initialCmsFooter, providedHeader])

  const activeHeader = cmsHeaderProp || cmsHeaderState || providedHeader

  // Resolve logo URL - prefer data if explicitly set (and non-empty), otherwise CMS header's logo
  const resolvedLogoUrl =
    (data?.logoUrl && data.logoUrl.trim()) ||
    (activeHeader?.logo && typeof activeHeader.logo === "string" && activeHeader.logo.trim()) ||
    ""

  const rawLogoText =
    (data?.logoText && data.logoText.trim()) ||
    (activeHeader?.logoText && activeHeader.logoText.trim()) ||
    defaultTemplate1HeaderData.logoText

  const isSjmlBrand = !rawLogoText || rawLogoText === "SJML" || rawLogoText === "SJ MEDIA LABS"

  // Contact details resolution: check header phone first, then footer phone, then fallback
  const resolvedPhone =
    (data?.phoneText && data.phoneText.trim()) ||
    (activeHeader?.phone && activeHeader.phone.trim()) ||
    (cmsPhone && cmsPhone.trim()) ||
    (cmsFooterData?.phone && cmsFooterData.phone.trim()) ||
    defaultTemplate1HeaderData.phoneText

  const resolvedPhoneHref =
    (data?.phoneHref && data.phoneHref.trim()) ||
    (resolvedPhone
      ? `tel:${resolvedPhone.replace(/\s+/g, "")}`
      : defaultTemplate1HeaderData.phoneHref)

  const content: Required<Template1HeaderData> = {
    ...defaultTemplate1HeaderData,
    logoUrl: resolvedLogoUrl,
    logoText: rawLogoText,
    taglineLine1:
      data?.taglineLine1 ?? defaultTemplate1HeaderData.taglineLine1,
    taglineLine2:
      data?.taglineLine2 ?? defaultTemplate1HeaderData.taglineLine2,
    logoHref: data?.logoHref ?? defaultTemplate1HeaderData.logoHref,
    phoneText: resolvedPhone,
    phoneHref: resolvedPhoneHref,
    ctaText:
      data?.ctaText ??
      activeHeader?.ctaButton?.text ??
      defaultTemplate1HeaderData.ctaText,
    ctaHref:
      data?.ctaHref ??
      activeHeader?.ctaButton?.href ??
      defaultTemplate1HeaderData.ctaHref,
  }

  const handleCtaButtonClick = () => {
    if (onCtaClick) {
      onCtaClick()
      return
    }
    setIsModalOpen(true)
  }

  const mobileCtaText =
    content.ctaText === "Book a Consultation"
      ? "Book Now"
      : content.ctaText

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white border-b border-black/10 text-[#161617] ${className}`}
      >
        <div className="mx-auto flex h-16 sm:h-18 md:h-20 max-w-[1200px] xl:max-w-[1320px] 2xl:max-w-[1440px] items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          {/* Brand Logo - fetched from website's header */}
          <Link
            href={content.logoHref}
            className="site-header-logo flex items-center gap-2 shrink-0 min-w-0 focus:outline-none"
            aria-label="SJML Home"
          >
            {resolvedLogoUrl ? (
              <Image
                src={resolvedLogoUrl}
                alt={rawLogoText || "SJ Media Labs"}
                width={180}
                height={56}
                className="site-header-logo-img !h-7 sm:!h-9 md:!h-10 lg:!h-12 !w-auto !max-w-[130px] sm:!max-w-[180px] md:!max-w-none object-contain"
                priority
                unoptimized={resolvedLogoUrl.startsWith("data:") || resolvedLogoUrl.endsWith(".svg") || resolvedLogoUrl.startsWith("http")}
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="site-header-logo-text text-primary font-bold tracking-tight leading-none text-lg sm:text-xl md:text-2xl">
                  {isSjmlBrand ? "SJML" : rawLogoText}
                </span>
                <span
                  className="site-header-logo-rule hidden sm:block w-px h-5 sm:h-6 bg-black/15 shrink-0"
                  aria-hidden="true"
                />
                <div className="site-header-logo-tagline hidden sm:flex flex-col text-[9px] sm:text-[10px] leading-tight">
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

          {/* Right Actions: Phone & CTA Button */}
          <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 shrink-0">
            {content.phoneText && (
              <a
                href={content.phoneHref}
                className="hidden md:inline-block text-xs sm:text-[13px] xl:text-[14px] font-medium text-[#161617]/80 hover:text-[#161617] transition-colors whitespace-nowrap"
              >
                {content.phoneText}
              </a>
            )}

            <button
              type="button"
              onClick={handleCtaButtonClick}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-[4px] bg-[#161617] px-3.5 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 text-[11.5px] sm:text-[12.5px] md:text-[13px] xl:text-[14px] font-medium text-[#FCC50E] transition-colors hover:bg-[#2a2a2c] shrink-0"
            >
              <span className="sm:hidden text-[#FCC50E] whitespace-nowrap">
                {mobileCtaText}
              </span>
              <span className="hidden sm:inline text-[#FCC50E] whitespace-nowrap">
                {content.ctaText}
              </span>
              <ArrowUpRightIcon className="text-[#FCC50E] shrink-0" />
            </button>
          </div>
        </div>
      </header>

      <Template1ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFormSubmit={onModalSubmit}
      />
    </>
  )
}
