"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AboutData {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  heroBackgroundImage?: string;
  about?: {
    badge?: string;
    title?: string;
    highlightedTitle?: string;
    description?: string;
    longDescription?: string;
    image?: string;
    values: Array<{ title: string; description: string; icon?: string }>;
  };
  mission?: {
    badge?: string;
    title?: string;
    highlightedTitle?: string;
    description: string;
    image?: string;
    values?: Array<{ title: string }>;
  };
  vision?: {
    badge?: string;
    title?: string;
    highlightedTitle?: string;
    description: string;
    image?: string;
    values?: Array<{ title: string }>;
  };
  achievementsSection?: {
    badge?: string;
    title?: string;
    highlightedTitle?: string;
    description?: string;
    buttonText?: string;
  };
  values: Array<{ title: string; description: string; icon: string }>;
  story: { title: string; content: string; image: string };
  team?: {
    badge?: string;
    title?: string;
    highlightedTitle?: string;
    buttonText?: string;
    members: Array<{
      id: string;
      name: string;
      role: string;
      image: string;
      bio?: string;
      linkedin?: string;
    }>;
  };
  stats: Array<{ value: string; label: string }>;
  achievements: Array<{ year: string; title: string; description: string }>;
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/content/about");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const fetchedData = await res.json();
        setData(fetchedData);
      } catch (error) {
        console.error("Failed to fetch about data:", error);
        setError(
          "Failed to load page content. Please contact the administrator."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Content Not Available
          </h2>
          <p className="text-[#888]">
            {error || "Page content has not been set up yet."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        {data.heroBackgroundImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
              style={{ backgroundImage: `url(${data.heroBackgroundImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black" />
          </>
        )}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {data.heroTitle ||
              "We are Creative Thinkers, Problem Solvers & Exceptional Communicators"}
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
            {data.about?.description &&
              typeof data.about.description === "string" && (
                <p className="text-[#888] mb-6 leading-relaxed">
                  {data.about.description}
                </p>
              )}
            {data.about?.values && data.about.values.length > 0 && (
              <ul className="space-y-3">
                {data.about.values.map((value, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-[#888]"
                  >
                    <span className="w-2 h-2 bg-[#E63946] rounded-full"></span>
                    {value.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Description & Stats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          {data.stats && data.stats.length > 0 && (
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-[#222]">
              {data.stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-[#888] text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <p className="text-[#888] text-sm mb-2">
                {data.achievementsSection?.badge || "Our Achievements"}
              </p>
              <h2 className="text-3xl font-bold text-white mb-4">
                {data.achievementsSection?.title || "proud moments"}
                <br />&{" "}
                <span className="text-[#E63946]">
                  {data.achievementsSection?.highlightedTitle || "milestones"}
                </span>
              </h2>
              {data.achievementsSection?.description &&
                typeof data.achievementsSection.description === "string" && (
                  <p className="text-[#888] text-sm mb-6 leading-relaxed">
                    {data.achievementsSection.description}
                  </p>
                )}
              <button className="px-6 py-3 bg-[#E63946] text-white rounded-full text-sm hover:bg-[#d62839] transition-colors">
                {data.achievementsSection?.buttonText || "Let's discuss →"}
              </button>
            </div>
            {data.achievements && data.achievements.length > 0 && (
              <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                {data.achievements.map((item, index) => (
                  <div key={index}>
                    <p className="text-[#E63946] text-sm mb-1">{item.year}</p>
                    <h3 className="text-white font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[#666] text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
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
            <p className="text-[#E63946] text-sm mb-2">
              {data.vision?.badge || "Our Vision"}
            </p>
            <h2 className="text-3xl font-bold text-white mb-6">
              {data.vision?.title || "Driving the"}
              <br />
              {data.vision?.title?.includes("Future") ? "Future of" : ""}{" "}
              <span className="text-[#E63946]">
                {data.vision?.highlightedTitle || "Creativity"}
              </span>
            </h2>
            {data.vision?.description &&
              typeof data.vision.description === "string" && (
                <p className="text-[#888] mb-6 leading-relaxed">
                  {data.vision.description}
                </p>
              )}
            {data.vision?.values && data.vision.values.length > 0 && (
              <ul className="space-y-3">
                {data.vision.values.map((value, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-[#888]"
                  >
                    <span className="w-2 h-2 bg-[#E63946] rounded-full"></span>
                    {typeof value === "string" ? value : value?.title || ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#E63946] text-sm mb-2">
              {data.mission?.badge || "Our Mission"}
            </p>
            <h2 className="text-3xl font-bold text-white mb-6">
              {data.mission?.title || "Bringing ideas to"}
              <br />
              {data.mission?.title?.includes("life") ? "life through" : ""}{" "}
              <span className="text-[#E63946]">
                {data.mission?.highlightedTitle || "creativity"}
              </span>
            </h2>
            {data.mission?.description && (
              typeof data.mission.description === "string" ? (
                <p className="text-[#888] mb-6 leading-relaxed">
                  {data.mission.description}
                </p>
              ) : data.mission.description?.description ? (
                <p className="text-[#888] mb-6 leading-relaxed">
                  {data.mission.description.description}
                </p>
              ) : null
            )}
            {((data.mission?.values && data.mission.values.length > 0) || 
              (data.mission?.description?.values && data.mission.description.values.length > 0)) && (
              <ul className="space-y-3">
                {(data.mission?.values || data.mission?.description?.values || []).map((value, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-[#888]"
                  >
                    <span className="w-2 h-2 bg-[#E63946] rounded-full"></span>
                    {typeof value === "string" ? value : value?.title || ""}
                  </li>
                ))}
              </ul>
            )}
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
              <p className="text-[#E63946] text-sm mb-2">
                {data.team?.badge || "Our Team"}
              </p>
              <h2 className="text-3xl font-bold text-white">
                {data.team?.title || "The minds behind the"}{" "}
                <span className="text-[#E63946]">
                  {data.team?.highlightedTitle || "magic"}
                </span>
              </h2>
            </div>
            <button className="px-6 py-3 bg-[#E63946] text-white rounded-full text-sm hover:bg-[#d62839] transition-colors">
              {data.team?.buttonText || "All Team Members →"}
            </button>
          </div>
          {data.team?.members && data.team.members.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.team.members.map((member) => (
                <div
                  key={member.id}
                  className="relative group overflow-hidden rounded-2xl"
                >
                  <Image
                    src={
                      member.image ||
                      "/placeholder.svg?height=350&width=300&query=professional headshot"
                    }
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
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
