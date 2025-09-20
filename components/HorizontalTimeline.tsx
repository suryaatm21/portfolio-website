'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { timelineText } from '@/content/site';

interface TimelineEntry {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  date: string;
  type: 'internship' | 'research' | 'project';
  bullets: string[];
  technologies: string[];
}

interface HorizontalTimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

/**
 * Horizontal Timeline Component
 * Based on the timeline reference files with modern React/Next.js implementation
 * Features horizontal scrolling, 3D transforms, and synchronized animations
 */
export function HorizontalTimeline({
  entries,
  className,
}: HorizontalTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll tracking for rubber duck animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Transform scroll progress to timeline position
  const timelineProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  // No sticky/fixed behavior; nav sits in layout and does not track scroll

  const goToEntry = useCallback(
    (index: number) => {
      setActiveIndex(index);

      if (timelineRef.current) {
        const entryWidth = timelineRef.current.scrollWidth / entries.length;
        const scrollPosition =
          index * entryWidth -
          timelineRef.current.clientWidth / 2 +
          entryWidth / 2;

        timelineRef.current.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth',
        });
      }
    },
    [entries.length],
  );

  const goToPrevious = () => {
    const newIndex = Math.max(0, activeIndex - 1);
    goToEntry(newIndex);
  };

  const goToNext = () => {
    const newIndex = Math.min(entries.length - 1, activeIndex + 1);
    goToEntry(newIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  // Auto-advance timeline
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % entries.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isHovered, entries.length]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'internship':
        return <Briefcase className="w-4 h-4" />;
      case 'research':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internship':
        return 'text-blue-500 border-blue-500 bg-blue-500/10';
      case 'research':
        return 'text-purple-500 border-purple-500 bg-purple-500/10';
      default:
        return 'text-brand-primary border-brand-primary bg-brand-primary/10';
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full xl:flex xl:justify-center xl:items-center',
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Vertical Quick Nav (positioned absolutely to the left) */}
      <div className="hidden xl:flex flex-col gap-3 justify-center items-center absolute left-0 xl:left-8 top-1/2 -translate-y-1/2 z-10">
        <div className="text-xs font-medium text-muted-foreground mb-2 writing-vertical-rl">
          {timelineText.quickNav}
        </div>
        {entries.map((entry, index) => (
          <button
            key={entry.id}
            onClick={() => goToEntry(index)}
            className={cn(
              'w-3 h-8 rounded-full transition-all duration-200 relative group',
              index === activeIndex
                ? 'bg-brand-primary'
                : 'bg-border hover:bg-brand-primary/50',
            )}
            aria-label={`Go to ${entry.company}`}>
            {/* Tooltip */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-background border border-border rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {entry.company}
            </div>
          </button>
        ))}
      </div>

      {/* Main Timeline Container - Centered independently */}
      <div className="relative bg-gradient-to-br from-background via-background/95 to-muted/20 rounded-2xl border border-border/50 overflow-hidden max-w-5xl">
        {/* Timeline Header */}
        <div className="relative p-8 border-b border-border/50">
          <div className="text-center">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}>
              <Calendar className="w-4 h-4 text-brand-primary" />
              <span className="text-sm font-medium text-brand-primary">
                {timelineText.badge}
              </span>
            </motion.div>

            <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">
              {timelineText.title}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {timelineText.description}
            </p>
          </div>
        </div>

        {/* Horizontal Timeline Track */}
        <div className="relative p-8 pt-12">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-brand-accent/10 hover:border-brand-accent"
            onClick={goToPrevious}
            disabled={activeIndex === 0}
            aria-label="Previous experience">
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-brand-accent/10 hover:border-brand-accent"
            onClick={goToNext}
            disabled={activeIndex === entries.length - 1}
            aria-label="Next experience">
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Timeline Track */}
          <div
            ref={timelineRef}
            className="overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="relative flex items-center justify-between min-w-max px-8">
              {/* Background Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-border rounded-full" />

              {/* Progress Line */}
              <motion.div
                className="absolute top-1/2 left-0 h-1 bg-brand-primary rounded-full"
                initial={{ width: '0%' }}
                animate={{
                  width: `${((activeIndex + 1) / entries.length) * 100}%`,
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />

              {/* Timeline Entries */}
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="relative flex flex-col items-center"
                  style={{ minWidth: '200px' }}>
                  {/* Entry Circle */}
                  <motion.button
                    onClick={() => goToEntry(index)}
                    className={cn(
                      'relative z-10 w-16 h-16 rounded-full border-4 transition-all duration-300 flex items-center justify-center',
                      index === activeIndex
                        ? `${getTypeColor(entry.type)} scale-110 shadow-lg`
                        : index < activeIndex
                        ? 'bg-brand-primary/20 border-brand-primary text-brand-primary'
                        : 'bg-background border-border text-muted-foreground hover:border-brand-primary/50',
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}>
                    {getTypeIcon(entry.type)}

                    {/* Active Ring */}
                    {index === activeIndex && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-brand-primary"
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: 1.4, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>

                  {/* Entry Label */}
                  <div className="mt-4 text-center">
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      {entry.period}
                    </div>
                    <div
                      className={cn(
                        'text-sm font-medium transition-colors duration-200',
                        index === activeIndex
                          ? 'text-brand-primary'
                          : 'text-muted-foreground',
                      )}>
                      {entry.company}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Panel */}
        <div ref={contentRef} className="relative min-h-[400px] p-8 pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}>
              <Card className="soft-card border-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center',
                            getTypeColor(entries[activeIndex].type),
                          )}>
                          {getTypeIcon(entries[activeIndex].type)}
                        </div>
                        <div>
                          <h4 className="text-xl font-heading font-semibold text-black">
                            {entries[activeIndex].title}
                          </h4>
                          <p className="text-brand-secondary font-medium">
                            {entries[activeIndex].company}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-white/80 mb-6">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {entries[activeIndex].location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {entries[activeIndex].period}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="mb-6">
                        <h5 className="text-sm font-medium text-foreground mb-3">
                          Technologies
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {entries[activeIndex].technologies.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Achievements */}
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-4">
                        Key Achievements
                      </h5>
                      <ul className="space-y-3">
                        {entries[activeIndex].bullets.map(
                          (bullet, bulletIndex) => (
                            <motion.li
                              key={bulletIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: bulletIndex * 0.1,
                                duration: 0.3,
                              }}
                              className="flex items-start gap-3 text-sm text-white/80">
                              <div className="w-2 h-2 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                              {bullet}
                            </motion.li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Indicator */}
        <div className="px-8 pb-6">
          <div className="flex justify-center gap-2">
            {entries.map((_, index) => (
              <button
                key={index}
                onClick={() => goToEntry(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  index === activeIndex
                    ? 'bg-brand-primary w-8'
                    : 'bg-border hover:bg-brand-primary/50',
                )}
                aria-label={`Go to experience ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="xl:hidden flex justify-center gap-4 px-8 pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            disabled={activeIndex === 0}
            className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={activeIndex === entries.length - 1}
            className="flex items-center gap-2">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
