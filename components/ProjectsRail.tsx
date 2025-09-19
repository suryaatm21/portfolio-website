'use client';

import { ProjectCard } from '@/components/ProjectCard';
import { ScrollHint } from '@/components/animations/ScrollHint';
import { FadeInUp } from '@/components/animations/FadeInUp';
import { AnimatedCard } from '@/components/animations/AnimatedCard';

const projects = [
  {
    title: 'Spoiler Alert',
    summary:
      "Spoiler Alert helps you track what's in your fridge, reduce food waste, and make meal planning effortless.",
    repo: 'https://github.com/suryaatm21/spoiler_alert',
    demo: '',
    tech: ['Next.js', 'PostgreSQL', 'Tailwind'],
  },
  {
    title: 'Spotify Playlist Optimizer',
    summary: 'Clusters tracks by audio features',
    repo: 'https://github.com/xxxxxxxxx',
    demo: 'https://xxxxxxxxx',
    tech: ['Django', 'PostgreSQL', 'TensorFlow'],
  },
  {
    title: 'Untab Pomodoro Closer',
    summary: 'Auto-closes tabs when timer ends',
    repo: 'https://github.com/xxxxxxxxx',
    demo: 'https://xxxxxxxxx',
    tech: ['WebExtensions', 'TypeScript'],
  },
];

export function ProjectsRail() {
  return (
    <div className="max-w-6xl mx-auto">
      <FadeInUp>
        <header className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-black mb-4">
            Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work and side projects
          </p>
        </header>
      </FadeInUp>

      {/* Horizontal scrollable container with snap */}
      <FadeInUp delay={0.1}>
        <div
          id="projects-rail"
          className="overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          role="region"
          aria-label="Projects carousel"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
          <div className="flex gap-6 w-max px-4">
            {projects.map((project, index) => (
              <div key={project.title} className="snap-start">
                <AnimatedCard delay={0.15 + index * 0.1}>
                  <ProjectCard
                    title={project.title}
                    summary={project.summary}
                    repo={project.repo}
                    demo={project.demo}
                    tech={project.tech}
                  />
                </AnimatedCard>
              </div>
            ))}
          </div>
        </div>
      </FadeInUp>

      {/* Scroll hint */}
      <FadeInUp delay={0.3}>
        <div className="mt-4">
          <ScrollHint
            containerId="projects-rail"
            className="flex justify-center"
          />
        </div>
      </FadeInUp>
    </div>
  );
}
