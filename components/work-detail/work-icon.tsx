import Image from "next/image"
import { Circle } from "lucide-react"
import { isValidWorkImage } from "@/lib/work-detail"

interface WorkIconProps {
  src?: string
  className?: string
  size?: number
}

export function WorkIcon({ src, className = "", size = 24 }: WorkIconProps) {
  if (isValidWorkImage(src)) {
    return (
      <Image
        src={src!}
        alt=""
        width={size}
        height={size}
        className={`object-contain ${className}`}
      />
    )
  }
  return <Circle className={`text-muted-foreground shrink-0 ${className}`} style={{ width: size, height: size }} strokeWidth={1.5} />
}
