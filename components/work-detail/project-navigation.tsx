import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { AdjacentWork } from "@/lib/work-sections"
import { isValidWorkImage } from "@/lib/work-detail"

interface ProjectNavigationProps {
  previous: AdjacentWork | null
  next: AdjacentWork | null
}

function NavThumb({ image, title }: { image: string; title: string }) {
  return (
    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden shrink-0 bg-muted dark:bg-zinc-800 border border-border">
      {isValidWorkImage(image) ? (
        <Image src={image} alt={title} fill className="object-cover" sizes="64px" />
      ) : (
        <div className="w-full h-full bg-muted" />
      )}
    </div>
  )
}

export function ProjectNavigation({ previous, next }: ProjectNavigationProps) {
  if (!previous && !next) return null

  return (
    <section className="border-t border-border py-10 md:py-14">
      <div className="site-container grid md:grid-cols-2 gap-8 md:gap-0">
        {previous ? (
          <Link
            href={`/work/${previous.slug}`}
            className="flex items-center gap-4 group md:pr-8 md:border-r border-border"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full border border-[#E63946] text-foreground group-hover:bg-[#E63946]/10 transition-colors shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </span>
            <NavThumb image={previous.image} title={previous.title} />
            <div className="min-w-0 text-left">
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Previous Project
              </p>
              <p className="font-semibold text-foreground truncate group-hover:text-[#E63946] transition-colors">
                {previous.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="hidden md:block" />
        )}

        {next ? (
          <Link
            href={`/work/${next.slug}`}
            className="flex items-center gap-4 group justify-end md:pl-8 md:ml-auto"
          >
            <div className="min-w-0 text-right order-1 md:order-none">
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Next Project
              </p>
              <p className="font-semibold text-foreground truncate group-hover:text-[#E63946] transition-colors">
                {next.title}
              </p>
            </div>
            <NavThumb image={next.image} title={next.title} />
            <span className="flex items-center justify-center w-10 h-10 rounded-full border border-[#E63946] text-foreground group-hover:bg-[#E63946]/10 transition-colors shrink-0 order-2 md:order-none">
              <ChevronRight className="w-5 h-5" />
            </span>
          </Link>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>
    </section>
  )
}
