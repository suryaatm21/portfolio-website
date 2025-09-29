"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { experience } from "@/content/site";
import { cn } from "@/lib/utils";

export function ExperienceStepper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;

      e.preventDefault();
      isScrolling.current = true;

      if (e.deltaY > 0 && activeIndex < experience.length - 1) {
        setActiveIndex((prev) => prev + 1);
      } else if (e.deltaY < 0 && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 300);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      } else if (
        e.key === "ArrowRight" &&
        activeIndex < experience.length - 1
      ) {
        setActiveIndex((prev) => prev + 1);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="max-w-4xl mx-auto"
      role="tablist"
      aria-label="Experience timeline">
      {/* Horizontal stepper */}
      <div className="flex justify-center items-center mb-12 relative">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

        {/* Active line indicator */}
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-brand-secondary -translate-y-1/2"
          initial={{ width: 0 }}
          animate={{
            width: `${((activeIndex + 1) / experience.length) * 100}%`,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* Step circles */}
        <div className="flex justify-between w-full max-w-md relative z-10">
          {experience.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center text-xs font-medium relative",
                index === activeIndex
                  ? "bg-brand-secondary border-brand-secondary text-white shadow-lg"
                  : index < activeIndex
                    ? "bg-brand-secondary/20 border-brand-secondary text-brand-secondary"
                    : "bg-background border-border text-muted-foreground hover:border-brand-secondary/50",
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls={`panel-${item.id}`}>
              {item.year}

              {/* Active ring indicator */}
              {index === activeIndex && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-brand-secondary"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: 1.3, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Labels with sliding underline */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="flex gap-8">
            {experience.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 py-2 px-1",
                  index === activeIndex
                    ? "text-brand-secondary"
                    : "text-muted-foreground hover:text-brand-secondary/70",
                )}>
                {item.title}
              </button>
            ))}
          </div>

          {/* Sliding underline */}
          <motion.div
            className="absolute bottom-0 h-0.5 bg-brand-secondary"
            initial={false}
            animate={{
              x: `${activeIndex * 100}%`,
              width: `${100 / experience.length}%`,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Detail panel */}
      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            id={`panel-${experience[activeIndex]?.id || activeIndex}`}
            role="tabpanel"
            aria-labelledby={`tab-${experience[activeIndex]?.id || activeIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            <Card className="soft-card">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-heading font-semibold text-black mb-2">
                    {experience[activeIndex]?.title}
                  </h3>
                  <p className="text-brand-secondary font-medium">
                    {experience[activeIndex]?.year}
                  </p>
                </div>

                <ul className="space-y-3 max-w-2xl mx-auto">
                  {experience[activeIndex]?.bullets?.map(
                    (bullet, bulletIndex) => (
                      <motion.li
                        key={bulletIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: bulletIndex * 0.1, duration: 0.3 }}
                        className="flex items-start gap-3 text-white/80">
                        <div className="w-2 h-2 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                        {bullet}
                      </motion.li>
                    ),
                  )}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation hint */}
      <div className="text-center mt-6">
        <p className="text-xs text-muted-foreground">
          Use arrow keys, scroll, or click to navigate
        </p>
      </div>
    </div>
  );
}
