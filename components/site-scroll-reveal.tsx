"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { animate, inView } from "motion"

const SECTION_SELECTOR =
  "main.home-page > section, main.site-page > section, main.min-h-screen > section"

const ATTACHED = "data-scroll-reveal"

function classNameOf(el: HTMLElement) {
  return typeof el.className === "string" ? el.className : el.className?.toString?.() ?? ""
}

function isHeroSection(el: HTMLElement) {
  return /(^|\s)([\w-]*hero[\w-]*)(\s|$)/i.test(classNameOf(el))
}

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight * 0.88 && rect.bottom > 48
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function attachSection(el: HTMLElement, stops: Array<() => void>) {
  if (el.getAttribute(ATTACHED)) return
  if (isHeroSection(el)) {
    el.setAttribute(ATTACHED, "skip-hero")
    return
  }

  el.setAttribute(ATTACHED, "pending")

  if (prefersReducedMotion() || isInViewport(el)) {
    el.setAttribute(ATTACHED, "done")
    return
  }

  const offset = window.matchMedia("(max-width: 767px)").matches ? 16 : 28
  el.style.opacity = "0"
  el.style.transform = `translate3d(0, ${offset}px, 0)`

  const stop = inView(
    el,
    () => {
      if (el.getAttribute(ATTACHED) !== "pending") return
      el.setAttribute(ATTACHED, "animating")
      const controls = animate(
        el,
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
        { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      )
      void controls.finished.then(() => {
        el.style.opacity = ""
        el.style.transform = ""
        el.setAttribute(ATTACHED, "done")
      })
    },
    { amount: 0.16, margin: "0px 0px -8% 0px" },
  )

  stops.push(() => {
    stop()
    if (el.getAttribute(ATTACHED) === "pending") {
      el.style.opacity = ""
      el.style.transform = ""
    }
  })
}

function scan(stops: Array<() => void>) {
  document.querySelectorAll<HTMLElement>(SECTION_SELECTOR).forEach((el) => attachSection(el, stops))
}

export function SiteScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return

    const stops: Array<() => void> = []
    let cancelled = false

    const run = () => {
      if (cancelled) return
      scan(stops)
    }

    const frame = window.requestAnimationFrame(run)
    const t1 = window.setTimeout(run, 120)
    const t2 = window.setTimeout(run, 500)

    const mo = new MutationObserver(() => run())
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      mo.disconnect()
      stops.forEach((stop) => stop())
    }
  }, [pathname])

  return null
}
