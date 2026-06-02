import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { clientPromise } from "@/lib/mongodb"
import { validWorkImages, type WorkDetailData } from "@/lib/work-detail"
import { MobileMockCarousel } from "@/components/work-detail/mobile-mock-carousel"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateStaticParams() {
  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const works = await db.collection("works").find({}, { projection: { slug: 1 } }).toArray()
    return works.map((work) => ({ slug: work.slug }))
  } catch {
    return []
  }
}

function hasImage(url: string | undefined): boolean {
  return !!url && url.trim() !== "" && !url.includes("placeholder.svg")
}

export default async function WorkDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const { slug } = params
  let work: WorkDetailData | null = null

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const data = await db.collection("works").findOne({ slug })
    if (data) {
      work = { ...data, id: data._id.toString() } as unknown as WorkDetailData
    }
  } catch (error) {
    console.error("Failed to fetch work:", error)
  }

  if (!work) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Project Not Found</h1>
            <p className="text-muted-foreground">The project you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const brandImages = validWorkImages(work.logoVariations).slice(0, 3)
  const mobileImages =
    validWorkImages(work.mobileCarouselImages).length > 0
      ? validWorkImages(work.mobileCarouselImages)
      : validWorkImages(work.gallery)
  const section4 = work.section4 || {}
  const processSteps = work.process?.filter((p) => p.title || p.description) || []
  const heroBg = hasImage(work.image) ? work.image : null

  const heroOnImage = !!heroBg

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero — min 600px, red-bordered pills & stats */}
      <section className="relative min-h-[600px] flex flex-col justify-center pt-24 pb-16">
        {heroBg && (
          <div className="absolute inset-0">
            <Image src={heroBg} alt="" fill className="object-cover" priority sizes="100vw" />
            <div className="hero-overlay" aria-hidden="true" />
          </div>
        )}
        {!heroBg && <div className="absolute inset-0 bg-muted dark:bg-zinc-950" />}
        {!heroBg && <div className="hero-overlay" aria-hidden="true" />}

        <div className="relative z-10 max-w-6xl mx-auto px-4 w-full text-center">
          {work.tags && work.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
              {work.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-medium uppercase tracking-wide border border-[#E63946] bg-transparent ${
                    heroOnImage ? "text-white light:text-foreground" : "text-foreground"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-10 tracking-tight ${
              heroOnImage ? "text-white light:text-foreground" : "text-foreground"
            }`}
          >
            {work.title}
          </h1>

          {(work.industry || work.role || work.technology || work.year) && (
            <div
              className={`inline-flex flex-wrap justify-center w-full max-w-4xl mx-auto rounded-full border border-[#E63946] backdrop-blur-sm px-4 py-5 md:px-8 md:py-6 ${
                heroOnImage
                  ? "bg-black/55 dark:bg-black/60"
                  : "bg-background/90 dark:bg-black/60 border-border"
              }`}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 w-full">
                {work.industry && (
                  <div className="text-center">
                    <p
                      className={`text-xs uppercase tracking-wider mb-1 ${
                        heroOnImage ? "text-white/70 light:text-muted-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Industry
                    </p>
                    <p
                      className={`text-sm md:text-base font-medium ${
                        heroOnImage ? "text-white light:text-foreground" : "text-foreground"
                      }`}
                    >
                      {work.industry}
                    </p>
                  </div>
                )}
                {work.role && (
                  <div className="text-center">
                    <p
                      className={`text-xs uppercase tracking-wider mb-1 ${
                        heroOnImage ? "text-white/70 light:text-muted-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Role
                    </p>
                    <p
                      className={`text-sm md:text-base font-medium ${
                        heroOnImage ? "text-white light:text-foreground" : "text-foreground"
                      }`}
                    >
                      {work.role}
                    </p>
                  </div>
                )}
                {work.technology && (
                  <div className="text-center">
                    <p
                      className={`text-xs uppercase tracking-wider mb-1 ${
                        heroOnImage ? "text-white/70 light:text-muted-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Technology
                    </p>
                    <p
                      className={`text-sm md:text-base font-medium ${
                        heroOnImage ? "text-white light:text-foreground" : "text-foreground"
                      }`}
                    >
                      {work.technology}
                    </p>
                  </div>
                )}
                {work.year && (
                  <div className="text-center">
                    <p
                      className={`text-xs uppercase tracking-wider mb-1 ${
                        heroOnImage ? "text-white/70 light:text-muted-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Year
                    </p>
                    <p
                      className={`text-sm md:text-base font-medium ${
                        heroOnImage ? "text-white light:text-foreground" : "text-foreground"
                      }`}
                    >
                      {work.year}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Brand overview */}
      {work.overview &&
        (work.overview.title ||
          work.overview.description ||
          (work.overview.points && work.overview.points.length > 0) ||
          brandImages.length > 0) && (
          <section className="bg-background py-16 md:py-24 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-16 md:mb-20">
                <div>
                  {work.overview.title && (
                    <h2 className="text-3xl md:text-4xl font-bold text-[#E63946]">{work.overview.title}</h2>
                  )}
                </div>
                <div>
                  {work.overview.description && (
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 whitespace-pre-line">
                      {work.overview.description}
                    </p>
                  )}
                  {work.overview.points && work.overview.points.length > 0 && (
                    <ul className="divide-y divide-border">
                      {work.overview.points.map((point, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 py-4 text-foreground font-semibold text-sm md:text-base"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {brandImages.length > 0 && (
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                  {brandImages.map((src, index) => (
                    <div
                      key={index}
                      className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden shrink-0"
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="224px" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

      {/* Section 3 — mobile mock carousel */}
      {mobileImages.length > 0 && (
        <MobileMockCarousel images={mobileImages} caption={work.mobileCarouselCaption} />
      )}

      {/* Section 4 — 3 points + images */}
      {(processSteps.length > 0 ||
        hasImage(section4.rectangleImage) ||
        hasImage(section4.squareImage1) ||
        hasImage(section4.squareImage2)) && (
        <section className="bg-background">
          {processSteps.length > 0 && (
            <div className="relative py-16 md:py-24 px-4 overflow-hidden">
              <div
                className="absolute inset-0 opacity-40 dark:opacity-30 pointer-events-none"
                aria-hidden
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 0%, transparent 40%, rgba(128,128,128,0.12) 41%, transparent 42%),
                    radial-gradient(circle at 50% 0%, transparent 55%, rgba(128,128,128,0.08) 56%, transparent 57%)`,
                  backgroundSize: "100% 120px",
                  backgroundRepeat: "repeat-y",
                }}
              />
              <div className="max-w-6xl mx-auto relative z-10 grid md:grid-cols-3 gap-10 md:gap-12">
                {processSteps.slice(0, 3).map((step, index) => (
                  <div key={index}>
                    <h3 className="text-foreground font-bold text-lg md:text-xl mb-4">
                      {step.step}. {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(hasImage(section4.rectangleImage) ||
            hasImage(section4.squareImage1) ||
            hasImage(section4.squareImage2)) && (
            <div className="px-4 pb-16 md:pb-24">
              <div className="max-w-6xl mx-auto">
                <div className="space-y-4 md:space-y-6">
                  {hasImage(section4.rectangleImage) && (
                    <div className="relative aspect-[16/10] md:aspect-[2/1] rounded-lg overflow-hidden bg-muted dark:bg-zinc-900">
                      <Image
                        src={section4.rectangleImage!}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 100vw"
                      />
                    </div>
                  )}
                  {(hasImage(section4.squareImage1) || hasImage(section4.squareImage2)) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {hasImage(section4.squareImage1) && (
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted dark:bg-zinc-900">
                          <Image
                            src={section4.squareImage1!}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                      )}
                      {hasImage(section4.squareImage2) && (
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted dark:bg-zinc-900">
                          <Image
                            src={section4.squareImage2!}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      <Footer />
    </main>
  )
}
