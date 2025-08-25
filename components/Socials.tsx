"use client"

import { motion } from "framer-motion"
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
      {socials.map((social, index) => {
        const Icon = iconMap[social.icon as keyof typeof iconMap]

        return (
          <motion.div
            key={social.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size={variant === "footer" ? "sm" : "sm"}
              asChild
              className="hover:bg-brand-accent/10 hover:text-brand-accent transition-colors hover:shadow-md"
            >
              <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                <Icon className="h-4 w-4" />
                {variant === "footer" && <span className="ml-2 text-sm">{social.label}</span>}
              </a>
            </Button>
          </motion.div>
        )
      })}
    </div>
  )
}
