"use client";

import { ArrowUp } from "lucide-react";

import { AcademicBackgroundCard } from "@/components/AcademicBackgroundCard";
import { ContactForm } from "@/components/ContactForm";
import { CylindricalText } from "@/components/CylindricalText";
import { Hero } from "@/components/Hero";
import { HorizontalTimeline } from "@/components/HorizontalTimeline";
import { NavBar } from "@/components/NavBar";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { ResourcesList } from "@/components/ResourcesList";
import { Section } from "@/components/Section";
import { SkipToContent } from "@/components/SkipToContent";
import { Socials } from "@/components/Socials";
import { Button } from "@/components/ui/button";
import {
  projects,
  timeline,
  sections,
  footer,
  education,
} from "@/content/site";

export default function Home() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <SkipToContent />
      <NavBar />

      <main id="main-content" className="relative">
        {/* Use the same vertical rhythm as other sections for equal spacing */}
        <Section id="home" className="flex items-center justify-center">
          <Hero />
        </Section>

        <Section id="resources">
          <ResourcesList />
        </Section>

        <Section id="experience">
          <div className="max-w-7xl mx-auto">
            <HorizontalTimeline entries={timeline as any} />
          </div>
        </Section>

        <Section id="projects">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-black mb-4">
                {sections.projects.title}
              </h2>
            </header>

            <ProjectsCarousel items={projects} />
          </div>
        </Section>

        <Section id="education">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-black mb-4">
                {sections.education.title}
              </h2>
            </header>

            <div className="space-y-8">
              {/* University Information Card */}
              <AcademicBackgroundCard
                institution={education.institution}
                location={education.location}
                degree={education.degree}
                graduationDate={education.graduationDate}
                gpa={education.gpa}
              />
            </div>
          </div>
        </Section>

        {/* Coursework Cylindrical Animation - Reduced spacing for better flow */}
        <div className="w-full py-12 md:py-16">
          <CylindricalText
            items={education.coursework}
            sectionLabel="Scroll through my coursework journey"
          />
        </div>

        <Section id="contact">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-black mb-4">
                {sections.contact.title}
              </h2>
            </header>

            <ContactForm />
          </div>
        </Section>
      </main>

      <footer
        className="bg-muted/30 border-t border-border/50 py-6"
        role="contentinfo">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                {footer.copyright}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Socials variant="footer" />
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="hover:bg-brand-accent/10 hover:text-brand-accent"
                aria-label={footer.backToTop}>
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
