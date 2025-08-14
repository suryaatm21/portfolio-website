import { Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { socials } from "@/content/site"

const iconMap = {
  Github,
  Linkedin,
  Mail,
}

interface SocialsProps {
  variant?: "default" | "footer"
  className?: string
}

export function Socials({ variant = "default", className }: SocialsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socials.map((social) => {
        const Icon = iconMap[social.icon as keyof typeof iconMap]

        return (
          <Button
            key={social.label}
            variant="ghost"
            size={variant === "footer" ? "sm" : "sm"}
            asChild
            className="hover:bg-brand-accent/10 hover:text-brand-accent transition-colors"
          >
            <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
              <Icon className="h-4 w-4" />
              {variant === "footer" && <span className="ml-2 text-sm">{social.label}</span>}
            </a>
          </Button>
        )
      })}
    </div>
  )
}
