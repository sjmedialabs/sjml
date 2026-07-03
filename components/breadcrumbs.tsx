import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export interface BreadcrumbItemType {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItemType[]
  className?: string
  highlightLast?: boolean
}

export function Breadcrumbs({ items, className, highlightLast }: BreadcrumbsProps) {
  if (!items?.length) return null
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.flatMap((item, i) => {
          const isLast = i === items.length - 1
          return [
            i > 0 ? <BreadcrumbSeparator key={`s-${i}`} /> : null,
            <BreadcrumbItem key={i}>
              {item.href != null && item.href !== "" && !isLast ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className={highlightLast && isLast ? "text-home-primary font-medium" : undefined}>
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>,
          ]
        }).filter(Boolean)}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
