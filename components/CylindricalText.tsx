"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useLayoutEffect, useRef } from "react";

interface CylindricalTextProps {
  items: string[];
  className?: string;
  sectionLabel?: string;
}

export function CylindricalText({
  items,
  className = "",
  sectionLabel = "Keep scrolling to see the animation",
}: CylindricalTextProps): React.ReactElement | null {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLUListElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const textWrapper = textWrapperRef.current;
    const title = titleRef.current;

    if (!wrapper || !textWrapper || !title || items.length === 0) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Ensure refs array matches items length
    itemsRef.current = itemsRef.current.slice(0, items.length);

    const spacing = 180 / items.length;

    const calculatePositions = () => {
      // Calculate radius and depth offset to prevent text upscaling
      const minDimension = Math.min(window.innerWidth, window.innerHeight);
      const radius = minDimension * 0.4;
      const depthOffset = radius * 0.85;

      // Dynamically set perspective based on radius to keep text at 1:1 scale
      if (wrapper) {
        wrapper.style.perspective = `${Math.max(900, radius * 3)}px`;
      }

      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        const angle = (index * spacing * Math.PI) / 180;
        const rotationAngle = index * -spacing;

        const x = 0;
        const y = Math.sin(angle) * radius;
        // Push cylinder back so front items render at 1:1 scale (no upscaling blur)
        const z = Math.cos(angle) * radius - depthOffset;

        // Apply transform with depth-adjusted z position
        item.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotationAngle}deg)`;
      });
    };

    // Initialize positions first
    calculatePositions();

    // Create ScrollTrigger animation - match reference exactly
    const scrollTrigger = ScrollTrigger.create({
      trigger: title,
      start: "center center",
      end: "+=2000svh",
      pin: wrapper,
      scrub: 2,
      animation: gsap.fromTo(
        textWrapper,
        { rotateX: -80 },
        { rotateX: 270, ease: "none" },
      ),
    });

    // Handle resize
    const handleResize = () => {
      calculatePositions();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scrollTrigger.kill();
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative h-[100svh] w-full overflow-hidden ${className}`}
      style={{
        // Perspective will be set dynamically in calculatePositions
        perspective: "900px", // Initial fallback, overridden by JS
      }}>
      {/* Scroll prompt - hidden but still serves as trigger element */}
      <p
        ref={titleRef}
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none"
        aria-hidden="true">
        {sectionLabel}
      </p>

      {/* 3D text wrapper */}
      <ul
        ref={textWrapperRef}
        className="absolute left-0 top-0 h-full w-full text-center font-bold uppercase leading-tight tracking-wider text-black"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          willChange: "transform",
          transform: "translateZ(0)",
        }}>
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            className="absolute left-1/2 top-1/2 w-full max-w-[88vw] px-6"
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              textRendering: "optimizeLegibility",
              willChange: "transform",
              // Dynamically scale font size: long titles get smaller
              fontSize: item.length > 40
                ? `clamp(0.65rem, ${Math.max(1.2, 3.5 - item.length * 0.04)}vw, 1.4rem)`
                : `clamp(0.75rem, ${Math.max(1.8, 4.5 - item.length * 0.04)}vw, 2rem)`,
            }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
