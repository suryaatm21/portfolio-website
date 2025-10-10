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
      // Match reference: use Math.min of window dimensions * 0.4 offset
      const offset = 0.4;
      const radius =
        Math.min(window.innerWidth, window.innerHeight) * offset;

      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        const angle = (index * spacing * Math.PI) / 180;
        const rotationAngle = index * -spacing;

        const x = 0;
        const y = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        // Match reference transform exactly
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
        { rotateX: 270, ease: "none" }
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
        perspective: "clamp(400px, 70vw, 2000px)", // Mobile-friendly perspective
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
        className="absolute left-0 top-0 h-full w-full text-center text-xs font-semibold uppercase leading-tight text-black sm:text-sm md:text-base lg:text-lg xl:text-xl"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}>
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            className="absolute left-1/2 top-1/2 w-full max-w-[90vw] px-4 text-ellipsis"
            style={{
              backfaceVisibility: "hidden",
            }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
