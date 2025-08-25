"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Project {
  title: string
  summary: string
  repo: string
  demo?: string
  tech: string[]
}

interface ProjectsCarouselProps {
  items: Project[]
}

export function ProjectsCarousel({ items }: ProjectsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  // Load interaction state from sessionStorage
  useEffect(() => {
    const interacted = sessionStorage.getItem("projects-carousel-interacted")
    if (interacted) setHasInteracted(true)
  }, [])

  // Handle scroll to update active index
  const handleScroll = () => {
    if (!scrollRef.current || isDragging.current) return

    const container = scrollRef.current
    const cardWidth = container.children[0]?.getBoundingClientRect().width || 0
    const scrollPosition = container.scrollLeft
    const newIndex = Math.round(scrollPosition / cardWidth)

    if (newIndex !== activeIndex) {
      setActiveIndex(Math.max(0, Math.min(newIndex, items.length - 1)))
    }
  }

  // Scroll to specific index
  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return

    const container = scrollRef.current
    const cardWidth = container.children[0]?.getBoundingClientRect().width || 0
    container.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    })
    setActiveIndex(index)
    markInteracted()
  }

  // Mark as interacted and persist
  const markInteracted = () => {
    if (!hasInteracted) {
      setHasInteracted(true)
      sessionStorage.setItem("projects-carousel-interacted", "true")
    }
  }

  // Navigation handlers
  const goToPrevious = () => {
    const newIndex = Math.max(0, activeIndex - 1)
    scrollToIndex(newIndex)
  }

  const goToNext = () => {
    const newIndex = Math.min(items.length - 1, activeIndex + 1)
    scrollToIndex(newIndex)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex])

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!scrollRef.current) return

    isDragging.current = true
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
    scrollRef.current.style.cursor = "grabbing"
    scrollRef.current.style.userSelect = "none"
    markInteracted()
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !scrollRef.current) return

    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 2
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handlePointerUp = () => {
    if (!scrollRef.current) return

    isDragging.current = false
    scrollRef.current.style.cursor = "grab"
    scrollRef.current.style.userSelect = "auto"
    handleScroll()
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          disabled={activeIndex === 0}
          aria-controls="projects-track"
          aria-label="Previous project"
          className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          disabled={activeIndex === items.length - 1}
          aria-controls="projects-track"
          aria-label="Next project"
          className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Carousel Track */}
      <div
        ref={scrollRef}
        id="projects-track"
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory cursor-grab px-4 md:px-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {items.map((project, index) => (
          <motion.div
            key={project.title}
            role="group"
            aria-label={`Project ${index + 1} of ${items.length}`}
            className="flex-none w-80 snap-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: index === activeIndex ? 1.02 : 0.98,
            }}
            transition={{
              duration: 0.3,
              delay: index * 0.06,
              scale: { duration: 0.2 },
            }}
          >
            <div
              className={`
              relative p-6 rounded-xl border transition-all duration-300
              ${
                index === activeIndex
                  ? "bg-card border-border shadow-lg"
                  : "bg-card/60 border-border/50 shadow-sm opacity-75"
              }
            `}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-sans font-semibold text-lg text-foreground mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.summary}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Github className="h-4 w-4" />
                      Repo
                    </a>
                  </Button>

                  {project.demo && (
                    <Button size="sm" asChild className="flex-1 bg-accent hover:bg-accent/90">
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            aria-controls="projects-track"
            aria-selected={index === activeIndex}
            aria-label={`Go to project ${index + 1}`}
            className={`
              w-2 h-2 rounded-full transition-all duration-200
              ${index === activeIndex ? "bg-accent w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"}
            `}
          />
        ))}
      </div>

      {/* Scroll Hint */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div initial={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-center mt-4">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-xs text-muted-foreground flex items-center gap-1"
            >
              Drag or use arrows to explore projects
              <ChevronRight className="h-3 w-3" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
