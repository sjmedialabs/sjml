import { generateSeoMetadata } from "@/lib/seo"

export async function generateMetadata() {
  return await generateSeoMetadata("About")
}

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { getPageContent } from "@/lib/models/content";
import { PageHero } from "@/components/page-hero";

interface AboutData {
  hero?: { title?: string; description?: string; image?: string };
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImage?: string;
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

export const dynamic = 'force-dynamic'
export const revalidate = 0; // Enable ISR: Revalidate every hour

export default async function AboutPage() {
  let data: AboutData | null = null;

  try {
    data = await getPageContent("about");
  } catch (error) {
    console.error("Failed to fetch about data:", error);
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Content Not Available
          </h2>
          <p className="text-muted-foreground">
            Page content has not been set up yet.
          </p>
        </div>
      </main>
    );
  }

  const heroTitle = data.hero?.title || data.heroTitle || "";
  const heroDescription = data.hero?.description || data.heroDescription || data.heroSubtitle || "";
  const heroImage = data.hero?.image || data.heroBackgroundImage || "";

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <PageHero title={heroTitle} description={heroDescription} image={heroImage} />

      {/* About Us Section - only when about content exists in DB */}
      {(data.about?.image || data.about?.title || data.about?.description || (data.about?.values && data.about.values.length > 0)) && (
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
              {data.about?.badge && <p className="text-[#E63946] text-sm mb-2">{data.about.badge}</p>}
              {(data.about?.title || data.about?.highlightedTitle) && (
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {data.about.title || ""}{" "}
                  {data.about.highlightedTitle && <span className="text-[#E63946]">{data.about.highlightedTitle}</span>}
                </h2>
              )}
              {data.about?.description && typeof data.about.description === "string" && (
                <p className="text-muted-foreground mb-6 leading-relaxed">{data.about.description}</p>
              )}
              {data.about?.values && data.about.values.length > 0 && (
                <ul className="space-y-3">
                  {data.about.values.map((value, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground">
                      <span className="w-2 h-2 bg-[#E63946] rounded-full"></span>
                      {value.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Description & Stats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          {data.stats && data.stats.length > 0 && (
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-border">
              {data.stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
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
              {data.achievementsSection?.badge && (
                <p className="text-muted-foreground text-sm mb-2">{data.achievementsSection.badge}</p>
              )}
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {data.achievementsSection?.title || ""}
                {data.achievementsSection?.highlightedTitle && (
                  <>
                    <br />& <span className="text-[#E63946]">{data.achievementsSection.highlightedTitle}</span>
                  </>
                )}
              </h2>
              {data.achievementsSection?.description &&
                typeof data.achievementsSection.description === "string" && (
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {data.achievementsSection.description}
                  </p>
                )}
              {data.achievementsSection?.buttonText && (
                <a href="/contact" className="inline-block px-6 py-3 bg-[#E63946] text-foreground rounded-full text-sm hover:bg-[#d62839] transition-colors">
                  {data.achievementsSection.buttonText}
                </a>
              )}
            </div>
            {data.achievements && data.achievements.length > 0 && (
              <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                {data.achievements.map((item, index) => (
                  <div key={index}>
                    <p className="text-[#E63946] text-sm mb-1">{item.year}</p>
                    <h3 className="text-foreground font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
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
            {data.vision?.badge && <p className="text-[#E63946] text-sm mb-2">{data.vision.badge}</p>}
            <h2 className="text-3xl font-bold text-foreground mb-6">
              {data.vision?.title || ""}{" "}
              {data.vision?.highlightedTitle && <span className="text-[#E63946]">{data.vision.highlightedTitle}</span>}
            </h2>
            {data.vision?.description &&
              typeof data.vision.description === "string" && (
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {data.vision.description}
                </p>
              )}
            {data.vision?.values && data.vision.values.length > 0 && (
              <ul className="space-y-3">
                {data.vision.values.map((value, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-muted-foreground"
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
            {data.mission?.badge && <p className="text-[#E63946] text-sm mb-2">{data.mission.badge}</p>}
            <h2 className="text-3xl font-bold text-foreground mb-6">
              {data.mission?.title || ""}{" "}
              {data.mission?.highlightedTitle && <span className="text-[#E63946]">{data.mission.highlightedTitle}</span>}
            </h2>
            {data.mission?.description && (
              typeof data.mission.description === "string" ? (
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {data.mission.description}
                </p>
              ) : data.mission.description?.description ? (
                <p className="text-muted-foreground mb-6 leading-relaxed">
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
                    className="flex items-center gap-3 text-muted-foreground"
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

      {/* Team Section - content from admin only */}
      {data.team && (data.team.members?.length > 0 || data.team.badge || data.team.title) && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                {data.team.badge && <p className="text-[#E63946] text-sm mb-2">{data.team.badge}</p>}
                {(data.team.title || data.team.highlightedTitle) && (
                  <h2 className="text-3xl font-bold text-foreground">
                    {data.team.title || ""}{" "}
                    {data.team.highlightedTitle && <span className="text-[#E63946]">{data.team.highlightedTitle}</span>}
                  </h2>
                )}
              </div>
              {data.team.buttonText && (
                <a href="/contact" className="inline-block px-6 py-3 bg-[#E63946] text-foreground rounded-full text-sm hover:bg-[#d62839] transition-colors">
                  {data.team.buttonText}
                </a>
              )}
            </div>
            {data.team.members && data.team.members.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {data.team.members.map((member) => (
                  <div key={member.id} className="relative group overflow-hidden rounded-2xl">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name || ""}
                        width={300}
                        height={350}
                        className="w-full aspect-[3/4] object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-[3/4] bg-muted rounded-2xl" />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      {member.name && <h3 className="text-foreground font-semibold">{member.name}</h3>}
                      {member.role && <p className="text-[#E63946] text-sm">{member.role}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
