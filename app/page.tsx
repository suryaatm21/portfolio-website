'use client';

import { NavBar } from '@/components/NavBar';
import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { ResourcesList } from '@/components/ResourcesList';
import { HorizontalTimeline } from '@/components/HorizontalTimeline';
import { ProjectsCarousel } from '@/components/ProjectsCarousel';
import { ContactForm } from '@/components/ContactForm';
import { CylindricalText } from '@/components/CylindricalText';
import { Socials } from '@/components/Socials';
import { SkipToContent } from '@/components/SkipToContent';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import {
  projects,
  timeline,
  sections,
  footer,
  education,
} from '@/content/site';

export default function Home() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <header className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-gray-800 mb-4">
                {sections.experience.title}
              </h2>
            </header>

            <HorizontalTimeline entries={timeline as any} />
          </div>
        </Section>

        <Section id="projects">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-gray-800 mb-4">
                {sections.projects.title}
              </h2>
            </header>

            <ProjectsCarousel items={projects} />
          </div>
        </Section>

        <Section id="education">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-gray-800 mb-4">
                {sections.education.title}
              </h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* University Information */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                  <h3 className="text-xl font-heading font-semibold text-gray-800 mb-4">
                    Academic Background
                  </h3>
                  <div className="space-y-3">
                    <p className="text-lg font-medium text-green-600">
                      {education.institution}
                    </p>
                    <p className="text-gray-700">{education.degree}</p>
                    <p className="text-sm text-gray-600">
                      Expected Graduation: {education.graduationDate}
                    </p>
                    <p className="text-sm text-gray-600">
                      GPA: {education.gpa}
                    </p>
                  </div>
                </div>
              </div>

              {/* Coursework with Cylindrical Text Effect */}
              <div className="space-y-6">
                <CylindricalText 
                  items={education.coursework}
                  className="min-h-[400px]"
                />
              </div>
            </div>
          </div>
        </Section>

        <Section id="contact">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-gray-800 mb-4">
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
