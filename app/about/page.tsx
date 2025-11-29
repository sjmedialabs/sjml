"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { useEffect, useState } from "react"

interface AboutData {
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroImage: string
  about?: {
    badge?: string
    title?: string
    highlightedTitle?: string
    description?: string
    longDescription?: string
    image?: string
    values: Array<{ title: string; description: string; icon?: string }>
  }
  mission?: { badge?: string; title?: string; highlightedTitle?: string; description: string; image?: string; values?: Array<{ title: string }> }
  vision?: { badge?: string; title?: string; highlightedTitle?: string; description: string; image?: string; values?: Array<{ title: string }> }
  achievementsSection?: { badge?: string; title?: string; highlightedTitle?: string; description?: string; buttonText?: string }
  values: Array<{ title: string; description: string; icon: string }>
  story: { title: string; content: string; image: string }
  team?: { badge?: string; title?: string; highlightedTitle?: string; buttonText?: string; members: Array<{ id: string; name: string; role: string; image: string; bio?: string; linkedin?: string }> }
  stats: Array<{ value: string; label: string }>
  achievements: Array<{ year: string; title: string; description: string }>
}

const defaultData: AboutData = {
  heroTitle: "We are Creative Thinkers, Problem Solvers & Exceptional Communicators",
  heroSubtitle: "",
  heroDescription: "",
  heroImage: "",
  about: {
    badge: "About Us",
    title: "A team of",
    highlightedTitle: "creative thinkers",
    description: "We're a full-service design agency specializing in branding, web design, and creative strategies that elevate businesses.",
    longDescription: "We specialize in delivering innovative and impactful design solutions that elevate brands and drive results. From digital experiences to print media, our team of creative professionals is dedicated to transforming ideas into compelling visual stories that resonate with audiences. With a focus on creativity, strategy, and client collaboration.",
    image: "/modern-creative-team.png",
    values: [
      { title: "Creativity and Innovation", description: "" },
      { title: "Client-Centricity", description: "" },
      { title: "Integrity and Transparency", description: "" },
      { title: "Excellence and Quality", description: "" },
    ],
  },
  mission: {
    badge: "Our Mission",
    title: "Bringing ideas to life through",
    highlightedTitle: "creativity",
    description: "We're a full-service design agency specializing in branding, web design, and creative strategies that elevate businesses.",
    image: "/mobile-app-design-showcase-on-phone.jpg",
  },
  vision: {
    badge: "Our Vision",
    title: "Driving the Future of",
    highlightedTitle: "Creativity",
    description: "We're a full-service design agency specializing in branding, web design, and creative strategies.",
    image: "/social-media-marketing-dashboard-on-laptop.jpg",
  },
  achievementsSection: {
    badge: "Our Achievements",
    title: "proud moments",
    highlightedTitle: "milestones",
    description: "We're a full-service design agency specializing in branding, web design, and creative strategies that elevate businesses.",
    buttonText: "Let's discuss →",
  },
  values: [
    { title: "Creativity and Innovation", description: "", icon: "" },
    { title: "Client-Centricity", description: "", icon: "" },
    { title: "Integrity and Transparency", description: "", icon: "" },
    { title: "Excellence and Quality", description: "", icon: "" },
  ],
  story: { title: "", content: "", image: "" },
  team: {
    badge: "Our Team",
    title: "The minds behind the",
    highlightedTitle: "magic",
    buttonText: "All Team Members",
    members: [],
  },
  stats: [
    { value: "1000+", label: "Project Completed" },
    { value: "15+", label: "Years Of Experience" },
    { value: "100+", label: "Client Satisfaction" },
  ],
  achievements: [],
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData>(defaultData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/content/about")
        if (res.ok) {
          const fetchedData = await res.json()
          // Map API structure to component structure
          const mappedData: AboutData = {
            heroTitle: fetchedData.hero?.title || defaultData.heroTitle,
            heroSubtitle: fetchedData.hero?.highlightedText || defaultData.heroSubtitle,
            heroDescription: "",
            heroImage: "",
            about: fetchedData.about || defaultData.about,
            mission: fetchedData.mission || defaultData.mission,
            vision: fetchedData.vision || defaultData.vision,
            achievementsSection: fetchedData.achievementsSection || defaultData.achievementsSection,
            values: fetchedData.about?.values || defaultData.values,
            story: defaultData.story,
            team: fetchedData.team || defaultData.team,
            stats: fetchedData.stats || defaultData.stats,
            achievements: fetchedData.achievements || defaultData.achievements,
          }
          setData(mappedData)
        }
      } catch (error) {
        console.error("Failed to fetch about data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const achievements =
    data.achievements?.length > 0
      ? data.achievements
      : [
          {
            year: "2015 - 2016",
            title: "Best Design Award",
            description: "We design by getting to know you and your brand. Through in-depth.",
          },
          {
            year: "2016 - 2017",
            title: "Dribbble Winner",
            description: "We design by getting to know you and your brand. Through in-depth.",
          },
          {
            year: "2017 - 2018",
            title: "Design Of The Year",
            description: "We design by getting to know you and your brand. Through in-depth.",
          },
          {
            year: "2017 - 2018",
            title: "Graphic Design Winner",
            description: "We design by getting to know you and your brand. Through in-depth.",
          },
          {
            year: "2018 - 2019",
            title: "Awwward Winner",
            description: "We design by getting to know you and your brand. Through in-depth.",
          },
          {
            year: "2019 - 2020",
            title: "Best Jury Award",
            description: "We design by getting to know you and your brand. Through in-depth.",
          },
        ]

  const teamMembers = data.team?.members || []

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            We are <span className="text-[#E63946]">Creative Thinkers</span>,
            <br />
            Problem Solvers & Exceptional
            <br />
            Communicators
          </h1>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="relative">
            {data.about?.image && (
              <Image
                src={data.about.image}
                alt="Our Team"
                width={500}
                height={400}
                className="rounded-2xl w-full"
              />
            )}
          </div>
          <div>
            <p className="text-[#E63946] text-sm mb-2">About Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              A team of{" "}
              <span className="text-[#E63946]">
                creative
                <br />
                thinkers
              </span>
            </h2>
            <p className="text-[#888] mb-6 leading-relaxed">{data.about?.description}</p>
            <ul className="space-y-3">
              {data.values.map((value, index) => (
                <li key={index} className="flex items-center gap-3 text-[#888]">
                  <span className="w-2 h-2 bg-[#E63946] rounded-full"></span>
                  {value.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Description & Stats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#888] leading-relaxed mb-6">{data.about?.longDescription}</p>
            </div>
            <div className="flex items-center justify-end">
              <div className="w-24 h-24 bg-[#E63946] rounded-xl flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-[#222]">
            {data.stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-[#888] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <p className="text-[#888] text-sm mb-2">{data.achievementsSection?.badge || "Our Achievements"}</p>
              <h2 className="text-3xl font-bold text-white mb-4">
                {data.achievementsSection?.title || "proud moments"}
                <br />& <span className="text-[#E63946]">{data.achievementsSection?.highlightedTitle || "milestones"}</span>
              </h2>
              <p className="text-[#888] text-sm mb-6 leading-relaxed">{data.achievementsSection?.description}</p>
              <button className="px-6 py-3 bg-[#E63946] text-white rounded-full text-sm hover:bg-[#d62839] transition-colors">
                {data.achievementsSection?.buttonText || "Let's discuss →"}
              </button>
            </div>
            <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
              {achievements.map((item, index) => (
                <div key={index}>
                  <p className="text-[#E63946] text-sm mb-1">{item.year}</p>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-[#666] text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {data.vision?.image && (
              <Image
                src={data.vision.image}
                alt="Our Vision"
                width={500}
                height={400}
                className="rounded-2xl w-full"
              />
            )}
          </div>
          <div>
            <p className="text-[#E63946] text-sm mb-2">{data.vision?.badge || "Our Vision"}</p>
            <h2 className="text-3xl font-bold text-white mb-6">
              {data.vision?.title || "Driving the"}
              <br />
              {data.vision?.title?.includes("Future") ? "Future of" : ""} <span className="text-[#E63946]">{data.vision?.highlightedTitle || "Creativity"}</span>
            </h2>
            <p className="text-[#888] mb-6 leading-relaxed">{data.vision?.description}</p>
            <ul className="space-y-3">
              {(data.vision?.values || data.values).map((value, index) => (
                <li key={index} className="flex items-center gap-3 text-[#888]">
                  <span className="w-2 h-2 bg-[#E63946] rounded-full"></span>
                  {value.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#E63946] text-sm mb-2">{data.mission?.badge || "Our Mission"}</p>
            <h2 className="text-3xl font-bold text-white mb-6">
              {data.mission?.title || "Bringing ideas to"}
              <br />
              {data.mission?.title?.includes("life") ? "life through" : ""} <span className="text-[#E63946]">{data.mission?.highlightedTitle || "creativity"}</span>
            </h2>
            <p className="text-[#888] mb-6 leading-relaxed">{data.mission?.description}</p>
            <ul className="space-y-3">
              {(data.mission?.values || data.values).map((value, index) => (
                <li key={index} className="flex items-center gap-3 text-[#888]">
                  <span className="w-2 h-2 bg-[#E63946] rounded-full"></span>
                  {value.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            {data.mission?.image && (
              <Image
                src={data.mission.image}
                alt="Our Mission"
                width={500}
                height={400}
                className="rounded-2xl w-full"
              />
            )}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-[#E63946] text-sm mb-2">{data.team?.badge || "Our Team"}</p>
              <h2 className="text-3xl font-bold text-white">
                {data.team?.title || "The minds behind the"} <span className="text-[#E63946]">{data.team?.highlightedTitle || "magic"}</span>
              </h2>
            </div>
            <button className="px-6 py-3 bg-[#E63946] text-white rounded-full text-sm hover:bg-[#d62839] transition-colors">
              {data.team?.buttonText || "All Team Members →"}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="relative group overflow-hidden rounded-2xl">
                <Image
                  src={member.image || "/placeholder.svg?height=350&width=300&query=professional headshot"}
                  alt={member.name}
                  width={300}
                  height={350}
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white font-semibold">{member.name}</h3>
                  <p className="text-[#E63946] text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
