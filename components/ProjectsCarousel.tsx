"use client";

import { ProjectCarousel } from "@/components/ProjectCarousel";

interface Project {
  title: string;
  summary: string;
  repo: string;
  demo?: string;
  tech: string[];
}

interface ProjectsCarouselProps {
  items: Project[];
}

/**
 * Projects Carousel Wrapper
 * Uses the 3D ProjectCarousel component for an enhanced visual experience
 */
export function ProjectsCarousel({ items }: ProjectsCarouselProps) {
  return (
    <div className="w-full">
      <ProjectCarousel
        items={items}
        className="max-w-6xl mx-auto"
      />
    </div>
  );
}
