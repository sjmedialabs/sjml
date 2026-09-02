/*
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { InnerPageHeroBackground } from "@/components/inner-page-hero-background"
import { notFound } from "next/navigation"
import { clientPromise } from "@/lib/mongodb"

interface CaseStudyData {
  id: string
  slug: string
  title: string
  description: string
  image: string
  tags: string[]
  stat1Label: string
  stat1Value: string
  stat2Label: string
  stat2Value: string
  client?: string
  industry?: string
  year?: string
  challenge?: string
  solution?: string
  results?: string[]
  gallery?: string[]
  testimonial?: {
    quote: string
    author: string
    role: string
    company: string
  }
}
*/

import { redirect } from "next/navigation"

export default function CaseStudyDetailPage() {
  // Case Study detail pages are currently disabled; downloads are handled directly via popup form on /case-studies.
  redirect("/case-studies")
}
