"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useProvidedHeader } from "@/components/header-provider"
import { normalizeHeaderContent } from "@/lib/header-content"
import { normalizeFooterContent } from "@/lib/footer-content"
import {
  type Template1HeaderData,
  type Template1LeadFormValues,
  defaultTemplate1HeaderData,
} from "./default-data"
import { Template1ConsultationModal } from "./consultation-modal"

export type { Template1HeaderData }

export interface Template1HeaderProps {
  data?: Template1HeaderData
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
  onCtaClick,
  onModalSubmit,
  className = "",
}: Template1HeaderProps) {
  const providedHeader = useProvidedHeader()
  const [cmsHeader, setCmsHeader] = useState(providedHeader)
  const [cmsPhone, setCmsPhone] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadCmsHeaderAndPhone() {
      try {
        const [headerRes, footerRes] = await Promise.all([
          !providedHeader ? fetch("/api/content/header") : Promise.resolve(null),
          fetch("/api/content/footer"),
        ])

        if (!cancelled && headerRes && headerRes.ok) {
          const rawHeader = await headerRes.json()
          setCmsHeader(normalizeHeaderContent(rawHeader))
        }

        if (!cancelled && footerRes && footerRes.ok) {
          const rawFooter = await footerRes.json()
          const normalizedFooter = normalizeFooterContent(rawFooter)
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
  }, [providedHeader])

  const resolvedPhone =
    data?.phoneText ?? (cmsPhone || defaultTemplate1HeaderData.phoneText)
  const resolvedPhoneHref =
    data?.phoneHref ??
    (cmsPhone
      ? `tel:${cmsPhone.replace(/\s+/g, "")}`
      : defaultTemplate1HeaderData.phoneHref)

  const content: Required<Template1HeaderData> = {
    ...defaultTemplate1HeaderData,
    logoUrl: data?.logoUrl ?? cmsHeader?.logo ?? defaultTemplate1HeaderData.logoUrl,
    logoText:
      data?.logoText ?? cmsHeader?.logoText ?? defaultTemplate1HeaderData.logoText,
    taglineLine1:
      data?.taglineLine1 ?? defaultTemplate1HeaderData.taglineLine1,
    taglineLine2:
      data?.taglineLine2 ?? defaultTemplate1HeaderData.taglineLine2,
    logoHref: data?.logoHref ?? defaultTemplate1HeaderData.logoHref,
    phoneText: resolvedPhone,
    phoneHref: resolvedPhoneHref,
    ctaText:
      data?.ctaText ??
      cmsHeader?.ctaButton?.text ??
      defaultTemplate1HeaderData.ctaText,
    ctaHref:
      data?.ctaHref ??
      cmsHeader?.ctaButton?.href ??
      defaultTemplate1HeaderData.ctaHref,
  }

  const handleCtaButtonClick = () => {
    if (onCtaClick) {
      onCtaClick()
      return
    }
    setIsModalOpen(true)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white border-b border-black/10 text-[#161617] ${className}`}
      >
        <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link
            href={content.logoHref}
            className="inline-flex items-center gap-3 shrink-0 focus:outline-none"
          >
            {content.logoUrl ? (
              <Image
                src={content.logoUrl}
                alt={content.logoText}
                width={180}
                height={48}
                className="h-10 w-auto object-contain"
                priority
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

          {/* Right Actions: Phone & CTA Button */}
          <div className="flex items-center gap-4 sm:gap-6">
            {content.phoneText && (
              <a
                href={content.phoneHref}
                className="hidden sm:inline-block text-xs sm:text-[13px] font-medium text-[#161617]/80 hover:text-[#161617] transition-colors"
              >
                {content.phoneText}
              </a>
            )}

            <button
              type="button"
              onClick={handleCtaButtonClick}
              className="inline-flex items-center gap-2.5 rounded-[4px] bg-[#161617] px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-[13px] font-medium text-[#FCC50E] transition-colors hover:bg-[#2a2a2c]"
            >
              <span className="text-[#FCC50E]">{content.ctaText}</span>
              <ArrowUpRightIcon className="text-[#FCC50E]" />
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
