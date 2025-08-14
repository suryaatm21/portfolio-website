"use client"

import { NavBar } from "@/components/NavBar"
import { Hero } from "@/components/Hero"
import { Section } from "@/components/Section"
import { ResourceCard } from "@/components/ResourceCard"
import { Timeline } from "@/components/Timeline"
import { ProjectCard } from "@/components/ProjectCard"
import { ContactForm } from "@/components/ContactForm"
import { Socials } from "@/components/Socials"
import { SkipToContent } from "@/components/SkipToContent"
import { Button } from "@/components/ui/button"
import { Mail, ArrowUp } from "lucide-react"
import { resources, projects } from "@/content/site"

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
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-brand-primary mb-4">Resources</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Curated tools and resources to help you level up your development skills
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {resources.map((resource) => (
                <ResourceCard key={resource.title} title={resource.title} href={resource.href} />
              ))}
            </div>

            {/* Right-aligned CTA */}
            <div className="flex justify-end">
              <Button
                asChild
                variant="outline"
                className="border-brand-secondary/30 text-brand-secondary hover:bg-brand-secondary hover:text-white group bg-transparent"
              >
                <a href="mailto:resources@theuntab.com">
                  <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Request Access
                </a>
              </Button>
            </div>
          </div>
        </Section>

        <Section id="experience">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-brand-primary mb-4">Experience</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                My journey in building impactful products and growing as a developer
              </p>
            </header>

            <Timeline />
          </div>
        </Section>

        <Section id="projects">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-brand-primary mb-4">Projects</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A showcase of my recent work and side projects
              </p>
            </header>

            {/* Horizontal scrollable container */}
            <div className="overflow-x-auto pb-4" role="region" aria-label="Projects carousel">
              <div className="flex gap-6 w-max">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.title}
                    title={project.title}
                    summary={project.summary}
                    repo={project.repo}
                    demo={project.demo}
                    tech={project.tech}
                  />
                ))}
              </div>
            </div>

            {/* Scroll hint */}
            <p className="text-center text-sm text-muted-foreground mt-4" aria-live="polite">
              Scroll horizontally to see more projects →
            </p>
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
