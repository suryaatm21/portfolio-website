"use client"

import { NavBar } from "@/components/NavBar"
import { Hero } from "@/components/Hero"
import { Section } from "@/components/Section"
import { ResourcesList } from "@/components/ResourcesList"
import { ExperienceStepper } from "@/components/ExperienceStepper"
import { ProjectsCarousel } from "@/components/ProjectsCarousel"
import { ContactForm } from "@/components/ContactForm"
import { Socials } from "@/components/Socials"
import { SkipToContent } from "@/components/SkipToContent"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { projects } from "@/content/site"

export default function Home() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <SkipToContent />
      <NavBar />

      <main id="main-content" className="relative">
        <Section id="home" className="min-h-screen flex items-center justify-center p-0">
          <Hero />
        </Section>

        <Section id="resources">
          <ResourcesList />
        </Section>

        <Section id="experience">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-brand-primary mb-4">Experience</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                My journey in building impactful products and growing as a developer
              </p>
            </header>

            <ExperienceStepper />
          </div>
        </Section>

        <Section id="projects">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-sans font-semibold text-foreground mb-4 tracking-tight">
                Projects
              </h2>
              <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
                A showcase of my recent work and side projects
              </p>
            </header>

            <ProjectsCarousel items={projects} />
          </div>
        </Section>

        <Section id="contact">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-brand-primary mb-4">Get In Touch</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have a project in mind or just want to chat? I'd love to hear from you.
              </p>
            </header>

            <ContactForm />
          </div>
        </Section>
      </main>

      <footer className="bg-muted/30 border-t border-border/50 py-12" role="contentinfo">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">© 2024 Surya. Built with Next.js and Tailwind CSS.</p>
            </div>

            <div className="flex items-center gap-4">
              <Socials variant="footer" />
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="hover:bg-brand-accent/10 hover:text-brand-accent"
                aria-label="Back to top"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
