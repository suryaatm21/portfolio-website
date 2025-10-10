"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

import { motionDurations, motionDelays, scrollThresholds } from "@/tokens/motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  /**
   * Animation variant
   */
  variant?: "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "blur";
  /**
   * Animation delay (ms)
   */
  delay?: number;
  /**
   * Animation duration (ms)
   */
  duration?: number;
  /**
   * Animate only once
   */
  once?: boolean;
  /**
   * Viewport threshold (0-1)
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

const variants = {
  fadeUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
  },
  fadeRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(10px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
  },
};

/**
 * ScrollReveal Component
 * 
 * Wraps content and animates it when scrolled into view.
 * Uses framer-motion's useInView hook for efficient scroll detection.
 * 
 * Perfect for:
 * - Section reveals
 * - Card grids
 * - Image galleries
 * - Any content that should animate on scroll
 * 
 * @example
 * ```tsx
 * <ScrollReveal variant="fadeUp" threshold={0.3}>
 *   <Card>This will fade up when scrolled into view</Card>
 * </ScrollReveal>
 * 
 * <ScrollReveal variant="scale" delay={200}>
 *   <div>This will scale in with a delay</div>
 * </ScrollReveal>
 * ```
 */
export function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = motionDurations.lg,
  once = true,
  threshold = scrollThresholds.quarter,
  className = "",
  as = "div",
}: ScrollRevealProps): React.ReactElement {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const Component = motion[as as keyof typeof motion] as any;
  const variantConfig = variants[variant];

  return (
    <Component
      ref={ref}
      className={className}
      initial={variantConfig.initial}
      animate={isInView ? variantConfig.animate : variantConfig.initial}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: [0.0, 0.0, 0.2, 1], // easeOut
      }}>
      {children}
    </Component>
  );
}

/**
 * StaggeredScrollReveal Component
 * 
 * Animates children with staggered timing for a cascading effect.
 * Perfect for lists, grids, and repeated elements.
 * 
 * @example
 * ```tsx
 * <StaggeredScrollReveal stagger={100}>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </StaggeredScrollReveal>
 * ```
 */
export function StaggeredScrollReveal({
  children,
  variant = "fadeUp",
  stagger = motionDelays.step,
  duration = motionDurations.md,
  once = true,
  threshold = scrollThresholds.quarter,
  className = "",
}: Omit<ScrollRevealProps, "delay"> & { stagger?: number }): React.ReactElement {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const variantConfig = variants[variant];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: stagger / 1000,
          },
        },
      }}>
      {React.Children.map(children, (child) => (
        <motion.div
          variants={variantConfig}
          transition={{
            duration: duration / 1000,
            ease: [0.0, 0.0, 0.2, 1],
          }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
