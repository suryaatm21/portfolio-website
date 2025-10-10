"use client";

import { motion } from "framer-motion";
import type React from "react";
import { useState, useEffect } from "react";

import { motionSprings } from "@/tokens/motion";

export type FloatVariant = "gentle" | "subtle" | "none";

interface FloatingElementProps {
  children: React.ReactNode;
  variant?: FloatVariant;
  className?: string;
  /**
   * Scale factor for mouse movement
   * subtle: 3 (small movement)
   * gentle: 6 (larger movement)
   * Custom: provide your own number
   */
  intensity?: number;
  /**
   * Whether to respect reduced motion preferences
   */
  respectReducedMotion?: boolean;
}

/**
 * FloatingElement Component
 * 
 * Creates a mouse-tracking parallax hover effect inspired by the Hero profile picture.
 * Elements follow cursor movement within their container for an interactive feel.
 * 
 * Variants:
 * - subtle: Small parallax movement (intensity: 3) - for cards and buttons
 * - gentle: Larger parallax movement (intensity: 6) - for hero elements
 * - none: No animation (respects reduced motion)
 * 
 * @example
 * ```tsx
 * <FloatingElement variant="subtle">
 *   <Card>Hovers with mouse</Card>
 * </FloatingElement>
 * 
 * <FloatingElement variant="gentle" intensity={8}>
 *   <img src="/hero.jpg" alt="Hero image" />
 * </FloatingElement>
 * ```
 */
export function FloatingElement({
  children,
  variant = "subtle",
  className = "",
  intensity,
  respectReducedMotion = true,
}: FloatingElementProps): React.ReactElement {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Determine intensity based on variant if not explicitly provided
  const parallaxIntensity = intensity ?? (variant === "gentle" ? 6 : 3);

  // Check for reduced motion preference
  useEffect(() => {
    if (!respectReducedMotion) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [respectReducedMotion]);

  // Track mouse position for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isReducedMotion || variant === "none") return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePosition({ x: x * parallaxIntensity, y: y * parallaxIntensity });
  };

  const handleMouseLeave = () => {
    // Return to center when mouse leaves
    setMousePosition({ x: 0, y: 0 });
  };

  // Return static element if reduced motion or variant is none
  if (isReducedMotion || variant === "none") {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        type: "spring",
        ...motionSprings.gentle,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}>
      {children}
    </motion.div>
  );
}
