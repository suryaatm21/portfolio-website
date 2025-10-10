"use client";

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Code2,
  Play,
  MessageCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Project {
  title: string;
  summary: string;
  repo: string;
  demo?: string;
  tech: string[];
}

interface ProjectCarouselProps {
  items: Project[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

const ITEM_MARGIN_X = 20;
const TRANSITION_MS = 500;

/**
 * 3D Project Carousel Component
 * Seamless infinite loop using relative positioning (no clone snapping)
 */
export function ProjectCarousel({
  items,
  className,
}: Omit<ProjectCarouselProps, "autoPlay" | "autoPlayInterval">) {
  const hasItems = items.length > 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 275, height: 400 });

  const slideSpan = useMemo(
    () => dimensions.width + ITEM_MARGIN_X * 2,
    [dimensions.width]
  );

  // Ensure current index stays within bounds when dataset changes
  useEffect(() => {
    if (!hasItems) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex((prev) => {
      if (prev < 0 || prev >= items.length) {
        return Math.max(0, Math.min(items.length - 1, prev));
      }
      return prev;
    });
  }, [hasItems, items.length]);

  // Responsive sizing based on viewport
  const updateDimensions = useCallback(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;

    let width = 275;
    let height = window.innerHeight * 0.5;

    if (isMobile) {
      width = Math.min(window.innerWidth * 0.85, 320);
      height = Math.min(window.innerHeight * 0.55, 400);
    } else if (isTablet) {
      width = Math.max(window.innerWidth * 0.45, 300);
      height = Math.min(window.innerHeight * 0.55, 440);
    } else {
      width = Math.max(window.innerWidth * 0.28, 340);
      height = Math.min(window.innerHeight * 0.5, 460);
    }

    setDimensions({ width, height });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  const totalItems = items.length;

  const clampDelta = useCallback(
    (delta: number) => {
      if (!hasItems) return 0;
      const half = totalItems / 2;
      if (delta > half) {
        return delta - totalItems;
      }
      if (delta < -half) {
        return delta + totalItems;
      }
      // For even counts, delta can equal half in magnitude – prefer negative to keep ordering stable
      if (totalItems % 2 === 0 && delta === half) {
        return delta - totalItems;
      }
      if (totalItems % 2 === 0 && delta === -half) {
        return delta + totalItems;
      }
      return delta;
    },
    [hasItems, totalItems]
  );

  const getRelativeMetrics = useCallback(
    (index: number) => {
      const rawDelta = index - currentIndex;
      const delta = clampDelta(rawDelta);
      const offsetX = delta * slideSpan;
      const distance = Math.abs(delta);
      const isActive = delta === 0;

      // Match reference: perspective applied per-item, only rotateY rotation, no scale/opacity/translateZ
      const rotateY = isActive ? 0 : delta < 0 ? 40 : -40;
      const zIndex = isActive ? totalItems + 1 : totalItems - distance;

      return {
        delta,
        offsetX,
        distance,
        isActive,
        rotateY,
        zIndex,
      };
    },
    [clampDelta, currentIndex, slideSpan, totalItems]
  );

  const goToPrevious = useCallback(() => {
    if (!hasItems) return;
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [hasItems, totalItems]);

  const goToNext = useCallback(() => {
    if (!hasItems) return;
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  }, [hasItems, totalItems]);

  const goToSlide = useCallback(
    (index: number) => {
      if (!hasItems || index === currentIndex) return;
      const normalized = ((index % totalItems) + totalItems) % totalItems;
      setCurrentIndex(normalized);
    },
    [currentIndex, hasItems, totalItems]
  );

  const handleKeyNavigation = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      }
    },
    [goToNext, goToPrevious]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("keydown", handleKeyNavigation);
    return () => container.removeEventListener("keydown", handleKeyNavigation);
  }, [handleKeyNavigation]);

  if (!hasItems) {
    return null;
  }

  return (
    <div
      className={cn("relative w-full outline-none", className)}
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-roledescription="Project carousel"
      aria-label="Project showcase"
    >
      <div className="relative w-full overflow-hidden py-20">
        {/* Left navigation button - overlaid on carousel */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-brand-accent/10 hover:border-brand-accent hover:scale-110 transition-all duration-200 shadow-lg"
          onClick={goToPrevious}
          aria-label="Previous project"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Right navigation button - overlaid on carousel */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-brand-accent/10 hover:border-brand-accent hover:scale-110 transition-all duration-200 shadow-lg"
          onClick={goToNext}
          aria-label="Next project"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        <div
          className="relative mx-auto"
          style={{
            width: "100%",
            height: `${dimensions.height}px`,
            perspective: "1400px",
          }}
        >
          {items.map((project, index) => {
            const { offsetX, distance, isActive, rotateY, zIndex } =
              getRelativeMetrics(index);

            const transition = `transform ${TRANSITION_MS}ms ease-in-out, opacity ${TRANSITION_MS}ms ease-in-out`;

            const outerTransform = `translateX(calc(-50% + ${offsetX}px))`;

            // Match reference: apply perspective to each item individually
            const innerTransform = isActive
              ? "perspective(1200px)"
              : `perspective(1200px) rotateY(${rotateY}deg)`;

            // Hide cards that are too far away (during wrap-around transition)
            // Only show active card and immediate neighbors
            const isVisible = distance <= 1;
            const opacity = isVisible ? 1 : 0;

            return (
              <div
                key={`${project.title}-${index}`}
                role="option"
                aria-selected={isActive}
                className="absolute top-1/2 left-1/2"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  marginTop: `-${dimensions.height / 2}px`,
                  transform: outerTransform,
                  transition,
                  zIndex,
                  pointerEvents: "auto",
                  opacity,
                }}
              >
                <div
                  className="relative w-full h-full transition-transform duration-1000 ease-in-out"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: innerTransform,
                  }}
                >
                  <Card className="absolute inset-0 border-2 border-border bg-background/95 backdrop-blur-sm text-white">
                    <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                      <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                          <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-brand-primary" />
                        </div>
                      </div>

                      <h3 className="text-lg sm:text-xl font-heading font-semibold text-center mb-2">
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-white/80 text-center mb-4 flex-grow line-clamp-3 sm:line-clamp-4">
                        {project.summary}
                      </p>

                      <div className="flex flex-wrap gap-1 justify-center mb-4">
                        {project.tech.slice(0, 3).map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="text-xs px-2 py-1"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {project.tech.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-1"
                          >
                            +{project.tech.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2 justify-center">
                        {project.demo && project.demo !== "Coming Soon" && (
                          <Button
                            size="sm"
                            className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
                            asChild
                          >
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              {project.demo.includes("youtube.com") ||
                              project.demo.includes("youtu.be") ? (
                                <>
                                  <Play className="w-3 h-3" />
                                  Watch
                                </>
                              ) : project.demo.includes("t.me") ? (
                                <>
                                  <MessageCircle className="w-3 h-3" />
                                  Join
                                </>
                              ) : (
                                <>
                                  <ExternalLink className="w-3 h-3" />
                                  Demo
                                </>
                              )}
                            </a>
                          </Button>
                        )}
                        {project.repo && project.repo !== "Coming Soon" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            asChild
                          >
                            <a
                              href={project.repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <Github className="w-3 h-3" />
                              Code
                            </a>
                          </Button>
                        )}
                        {((project.demo === "Coming Soon" && !project.repo) ||
                          (project.repo === "Coming Soon" && !project.demo) ||
                          (project.demo === "Coming Soon" &&
                            project.repo === "Coming Soon")) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 cursor-not-allowed opacity-60"
                            disabled
                          >
                            Coming Soon
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div
                    className="absolute top-0 left-0 w-10 h-full bg-brand-primary/5 border-l-2 border-brand-primary/20"
                    style={{
                      transform: "translate3d(1px, 0, -40px) rotateY(-90deg)",
                      transformOrigin: "0%",
                      backfaceVisibility: "hidden",
                    }}
                  />

                  <div
                    className="absolute top-0 right-0 w-10 h-full bg-brand-primary/5 border-r-2 border-brand-primary/20"
                    style={{
                      transform: "translate3d(-1px, 0, -40px) rotateY(90deg)",
                      transformOrigin: "100%",
                      backfaceVisibility: "hidden",
                    }}
                  />

                  <div
                    className="absolute bottom-0 w-full h-10 bg-black/10 rounded-full blur-sm"
                    style={{
                      transform: "rotateX(90deg) translate3d(0px, -20px, 0px)",
                      opacity: 0.85,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-200",
              index === currentIndex
                ? "bg-brand-primary w-8"
                : "bg-border hover:bg-brand-primary/50"
            )}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
