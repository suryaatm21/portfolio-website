"use client";

import { motion } from "framer-motion";
import type React from "react";
import { useState, useEffect } from "react";

import { floatAnimations, motionSprings } from "@/tokens/motion";

export type FloatVariant = "gentle" | "subtle" | "parallax" | "none";

interface FloatingElementProps {
  children: React.ReactNode;
  variant?: FloatVariant;
  className?: string;
  /**
   * For parallax variant: scale factor for mouse movement
   * Higher = more movement. Default: 4
   */
  parallaxIntensity?: number;
  /**
   * Whether to respect reduced motion preferences
   */
  respectReducedMotion?: boolean;
}

/**
 * FloatingElement Component
 * 
 * Creates a floating/hovering animation effect inspired by clouds in the sky.
 * Extracted from Hero component for reuse across the site.
 * 
 * Variants:
 * - gentle: Slow, wide floating motion (cloud-like)
 * - subtle: Quick, small floating motion (gentle hover)
 * - parallax: Mouse-tracking 3D effect (like hero image)
 * - none: No animation (respects reduced motion)
 * 
 * @example
 * ```tsx
 * <FloatingElement variant="gentle">
 *   <img src="/image.jpg" alt="Floating image" />
 * </FloatingElement>
 * 
 * <FloatingElement variant="parallax" parallaxIntensity={6}>
 *   <Card>Content</Card>
 * </FloatingElement>
 * ```
 */
export function FloatingElement({
  children,
  variant = "subtle",
  className = "",
  parallaxIntensity = 4,
  respectReducedMotion = true,
}: FloatingElementProps): React.ReactElement {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

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
    if (variant !== "parallax" || isReducedMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePosition({ x: x * parallaxIntensity, y: y * parallaxIntensity });
  };

  // Return static element if reduced motion or variant is none
  if (isReducedMotion || variant === "none") {
    return <div className={className}>{children}</div>;
  }

  // Parallax variant with mouse tracking
  if (variant === "parallax") {
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
        style={{ transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    );
  }

  // Gentle or subtle floating animation
  const animation = variant === "gentle" ? floatAnimations.gentle : floatAnimations.subtle;

  return (
    <motion.div
      className={className}
      animate={animation.y ? { y: animation.y } : undefined}
      transition={animation.transition}>
      {children}
    </motion.div>
  );
}
