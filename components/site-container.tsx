import { cn } from "@/lib/utils"

type SiteContainerProps = React.ComponentPropsWithoutRef<"div"> & {
  as?: React.ElementType
}

/** Standard horizontal layout: 100px side padding (clamp on small screens) — matches navbar & footer */
export function SiteContainer({ as: Comp = "div", className, ...props }: SiteContainerProps) {
  return <Comp className={cn("site-container", className)} {...props} />
}
