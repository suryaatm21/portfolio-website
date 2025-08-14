"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Code } from "lucide-react"

export function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-brand-primary mb-6 leading-tight">
            Full Stack Developer
            <span className="block text-brand-accent">Building Modern Web</span>
            <span className="block">Experiences</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Passionate about creating scalable applications and solving complex problems with clean, efficient code.
            Currently expanding the browser productivity space.
          </p>

          {/* Mission line */}
          <p className="text-sm font-medium text-brand-secondary mb-10 tracking-wide uppercase">
            Solve first, refine later.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="bg-brand-cta hover:bg-brand-cta-hover text-white px-8 py-3 text-base font-medium group"
            >
              Get In Touch
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection("projects")}
              className="border-brand-accent/20 text-brand-primary hover:bg-brand-accent hover:text-white px-8 py-3 text-base font-medium group"
            >
              <Code className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              View Projects
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-brand-accent/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-brand-accent rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
