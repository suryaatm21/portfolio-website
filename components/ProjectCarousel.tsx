'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  title: string;
  summary: string;
  repo: string;
  demo?: string;
  tech: string[];
}

interface ProjectCarouselProps {
  items: Project[];
  // autoplay removed by request; props kept for compatibility but ignored
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

/**
 * 3D Project Carousel Component
 * Based on the carousel reference files with modern React/Next.js implementation
 * Features 3D perspective transforms, auto-rotation, and responsive design
 */
export function ProjectCarousel({
  items,
  autoPlay = false,
  autoPlayInterval = 4000,
  className,
}: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    items.length ? Math.floor(items.length / 2) : 0,
  );
  const [dimensions, setDimensions] = useState({ width: 300, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollMomentumRef = useRef(0);
  const wheelFrameRef = useRef<number>();

  // Keep the active slide centred when the dataset changes
  useEffect(() => {
    if (!items.length) return;
    const median = Math.floor(items.length / 2);
    setCurrentIndex((index) => {
      if (index >= items.length || index < 0) {
        return median;
      }
      return index;
    });
  }, [items.length]);

  // Calculate responsive dimensions
  const updateDimensions = useCallback(() => {
    if (typeof window !== 'undefined') {
      // More responsive sizing for mobile
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth < 1024;

      let width, height;

      if (isMobile) {
        width = Math.max(window.innerWidth * 0.8, 280);
        height = Math.min(window.innerHeight * 0.6, 400);
      } else if (isTablet) {
        width = Math.max(window.innerWidth * 0.4, 320);
        height = Math.min(window.innerHeight * 0.55, 420);
      } else {
        width = Math.max(window.innerWidth * 0.25, 350);
        height = Math.min(window.innerHeight * 0.5, 450);
      }

      setDimensions({ width, height });
    }
  }, []);

  // Define callback functions first
  const goToSlide = useCallback(
    (index: number) => {
      if (!items.length) return;
      const clamped = ((index % items.length) + items.length) % items.length;
      setCurrentIndex(clamped);
    },
    [items.length],
  );

  const goToPrevious = useCallback(() => {
    if (!items.length) return;
    scrollMomentumRef.current = 0;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToNext = useCallback(() => {
    if (!items.length) return;
    scrollMomentumRef.current = 0;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const getItemTransform = (index: number) => {
    if (index === currentIndex) {
      return 'perspective(1200px) rotateY(0deg) translateZ(0px)';
    }

    const isLeft =
      index < currentIndex ||
      (currentIndex === 0 && index === items.length - 1);
    const rotateY = isLeft ? 40 : -40;
    return `perspective(1200px) rotateY(${rotateY}deg) translateZ(-100px)`;
  };

  const getSliderOffset = () => {
    if (!items.length) return 0;
    const halfSpan = (items.length - 1) / 2;
    return (halfSpan - currentIndex) * dimensions.width;
  };
    // const getSliderOffset = () =>
    // currentIndex * -dimensions.width + dimensions.width / 2;

  const handleKeyNavigation = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevious();
      }
    },
    [goToNext, goToPrevious],
  );

  const snapToNearestSlide = useCallback(() => {
    scrollMomentumRef.current = 0;
    const nearest = Math.round(-getSliderOffset() / dimensions.width);
    const clamped = Math.min(Math.max(nearest, 0), items.length - 1);
    setCurrentIndex(clamped);
  }, [dimensions.width, items.length, getSliderOffset]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const keyListener = (event: KeyboardEvent) => handleKeyNavigation(event);

    node.addEventListener('keydown', keyListener);

    return () => {
      node.removeEventListener('keydown', keyListener);
    };
  }, [handleKeyNavigation]);

  useEffect(() => () => {
    if (wheelFrameRef.current) cancelAnimationFrame(wheelFrameRef.current);
  }, []);

  const sliderOffset = getSliderOffset();

  return (
    <div
      className={cn('relative w-full outline-none', className)}
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-roledescription="Project carousel"
      aria-label="Project showcase">
      {/* Carousel Body */}
      <div className="relative w-full overflow-hidden py-20">
        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-brand-accent/10 hover:border-brand-accent hover:scale-110 transition-all duration-200"
          onClick={goToPrevious}
          aria-label="Previous project">
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-brand-accent/10 hover:border-brand-accent hover:scale-110 transition-all duration-200"
          onClick={goToNext}
          aria-label="Next project">
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Carousel Slider */}
        <motion.div
          className="relative flex"
          style={{
            width: `${dimensions.width * items.length}px`,
            left: '50%',
            marginLeft: `-${dimensions.width / 2}px`,
          }}
          animate={{ x: sliderOffset }}
          transition={{ type: 'spring', stiffness: 140, damping: 20 }}
          role="listbox"
          aria-live="polite">
          {items.map((project, index) => (
            <div
              key={`${project.title}-${index}`}
              className="relative flex-shrink-0 mx-5"
              style={{
                width: `${dimensions.width - 40}px`,
                height: `${dimensions.height}px`,
              }}
              role="option"
              aria-selected={index === currentIndex}>
              {/* 3D Frame Container */}
              <div
                className="relative w-full h-full transition-transform duration-700 ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: getItemTransform(index),
                }}>
                {/* Front Face */}
                <Card className="absolute inset-0 border-2 border-border bg-background/95 backdrop-blur-sm">
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Project Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                        <Code2 className="w-8 h-8 text-brand-primary" />
                      </div>
                    </div>

                    {/* Project Title */}
                    <h3 className="text-xl font-heading font-semibold text-center mb-3 text-black">
                      {project.title}
                    </h3>

                    {/* Project Summary */}
                    <p className="text-sm text-white/80 text-center mb-6 flex-grow line-clamp-4">
                      {project.summary}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1 justify-center mb-6">
                      {project.tech.slice(0, 3).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-xs px-2 py-1">
                          {tech}
                        </Badge>
                      ))}
                      {project.tech.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-1">
                          +{project.tech.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-2 justify-center">
                      {project.demo && (
                        <Button
                          size="sm"
                          className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
                          asChild>
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2">
                            <ExternalLink className="w-3 h-3" />
                            Demo
                          </a>
                        </Button>
                      )}
                      {project.repo && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          asChild>
                          <a
                            href={project.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2">
                            <Github className="w-3 h-3" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Left Side Face */}
                <div
                  className="absolute top-0 left-0 w-10 h-full bg-brand-primary/5 border-l-2 border-brand-primary/20"
                  style={{
                    transform: 'translate3d(1px, 0, -40px) rotateY(-90deg)',
                    transformOrigin: '0%',
                    backfaceVisibility: 'hidden',
                  }}
                />

                {/* Right Side Face */}
                <div
                  className="absolute top-0 right-0 w-10 h-full bg-brand-primary/5 border-r-2 border-brand-primary/20"
                  style={{
                    transform: 'translate3d(-1px, 0, -40px) rotateY(90deg)',
                    transformOrigin: '100%',
                    backfaceVisibility: 'hidden',
                  }}
                />

                {/* Shadow */}
                <div
                  className="absolute bottom-0 w-full h-10 bg-black/10 rounded-full blur-sm"
                  style={{
                    transform: 'rotateX(90deg) translate3d(0px, -20px, 0px)',
                    opacity: index === currentIndex ? 0.6 : 0.3,
                  }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-200',
              index === currentIndex
                ? 'bg-brand-primary w-8'
                : 'bg-border hover:bg-brand-primary/50',
            )}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      {/* Autoplay progress bar removed */}
    </div>
  );
}
