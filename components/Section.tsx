import type React from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  id: string
  className?: string
  children: React.ReactNode
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("section-wrap scroll-mt-20", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}
