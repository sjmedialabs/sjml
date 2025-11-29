import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PlaybookData {
  title: string
  description: string
  buttonText: string
  buttonUrl: string
  image?: string
}

const defaultPlaybook: PlaybookData = {
  title: "Download Our Brand Playbook",
  description:
    "Get exclusive access to our comprehensive guide on building powerful brands. Learn strategies, frameworks, and best practices from industry experts.",
  buttonText: "Download Now",
  buttonUrl: "/playbook",
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}

interface PlaybookSectionProps {
  data?: PlaybookData | null
  backgroundImage?: string
}

export function PlaybookSection({ data, backgroundImage }: PlaybookSectionProps) {
  const playbook = data || defaultPlaybook

  return (
    <section className="relative py-20 bg-[#111]">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/80" />
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{playbook.title}</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">{playbook.description}</p>
        <Link href={playbook.buttonUrl || "/playbook"}>
          <Button className="bg-[#E63946] hover:bg-[#d32f3d] text-white rounded-full px-8 py-6 text-lg">
            <DownloadIcon className="mr-2" />
            {playbook.buttonText}
          </Button>
        </Link>
      </div>
    </section>
  )
}
