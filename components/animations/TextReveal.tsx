"use client";

import { motion } from "framer-motion";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import { motionDurations, motionDelays, textRevealPresets } from "@/tokens/motion";

export type SplitMode = "word" | "char" | "line";
export type RevealPreset = keyof typeof textRevealPresets;

interface TextRevealProps {
  children: string;
  /**
   * How to split the text
   */
  mode?: SplitMode;
  /**
   * Animation preset
   */
  preset?: RevealPreset;
  /**
   * Stagger delay between each element (ms)
   */
  stagger?: number;
  /**
   * Initial delay before animation starts (ms)
   */
  delay?: number;
  /**
   * Duration of each element's animation (ms)
   */
  duration?: number;
  /**
   * Whether to animate only once when entering viewport
   */
  once?: boolean;
  /**
   * Viewport threshold (0-1) for triggering animation
   */
  threshold?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * HTML tag to render as
   */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * TextReveal Component
 * 
 * Animates text entry with various split and reveal options.
 * Inspired by GSAP SplitText but using Framer Motion.
 * 
 * Features:
 * - Split by word, character, or line
 * - Multiple animation presets
 * - Stagger animations
 * - Scroll-triggered reveals
 * - Respects reduced motion
 * 
 * @example
 * ```tsx
 * <TextReveal mode="word" preset="fadeUp" stagger={50}>
 *   Hello world, this text will animate in!
 * </TextReveal>
 * 
 * <TextReveal mode="char" preset="blur" stagger={20}>
 *   Character by character
 * </TextReveal>
 * ```
 */
export function TextReveal({
  children,
  mode = "word",
  preset = "fadeUp",
  stagger = motionDelays.step,
  delay = 0,
  duration = motionDurations.md,
  once = false,
  threshold = 0.3,
  className = "",
  as = "span",
}: TextRevealProps): React.ReactElement {
  const containerRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Intersection observer for scroll trigger
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [once, threshold]);

  // Split text into segments
  const segments = splitText(children, mode);

  // Get animation variants
  const variants = textRevealPresets[preset];

  // If reduced motion, render static text
  if (isReducedMotion) {
    const Component = as as any;
    return <Component className={className}>{children}</Component>;
  }

  const Component = motion[as as keyof typeof motion] as any;

  return (
    <Component
      ref={containerRef}
      className={className}
      style={{ display: "inline-block" }}
      aria-label={children}>
      {segments.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          style={{
            display: "inline-block",
            whiteSpace: mode === "word" ? "pre" : undefined,
          }}
          initial={variants.initial}
          animate={isInView ? variants.animate : variants.initial}
          transition={{
            duration: duration / 1000,
            delay: (delay + index * stagger) / 1000,
            ease: "easeOut",
          }}
          aria-hidden="true">
          {segment}
        </motion.span>
      ))}
    </Component>
  );
}

/**
 * Utility function to split text based on mode
 */
function splitText(text: string, mode: SplitMode): string[] {
  switch (mode) {
    case "char":
      // Split by character, preserve spaces
      return text.split("").map(char => char === " " ? "\u00A0" : char);
    
    case "line":
      // Split by newlines
      return text.split("\n").filter(line => line.trim());
    
    case "word":
    default:
      // Split by words, preserve spacing
      return text.split(" ").map((word, i, arr) => 
        i < arr.length - 1 ? `${word  } ` : word
      );
  }
}
