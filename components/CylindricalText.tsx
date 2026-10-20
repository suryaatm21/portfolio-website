"use client";

import React, { useLayoutEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const SCROLL_DISTANCE_PX = 2000;

// Shared by the 3D cylinder and the static reduced-motion list so both keep the same type scale
function itemTextStyle(item: string): React.CSSProperties {
  return {
    lineHeight: item.length > 40 ? 1.15 : 1.05,
    fontSize:
      item.length > 40
        ? `clamp(0.8rem, ${Math.max(0.95, 2.5 - item.length * 0.025)}vw, 1.2rem)`
        : `clamp(0.9rem, ${Math.max(1.2, 3.2 - item.length * 0.03)}vw, 1.65rem)`,
  };
}

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
  const reserveRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLUListElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  // Only the effect reads this (the markup switches layouts in CSS), so it is safe to
  // read on the first client render and skip loading gsap for reduced-motion users.
  const prefersReducedMotion = usePrefersReducedMotion({ clientOnly: true });

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const reserve = reserveRef.current;
    const wrapper = wrapperRef.current;
    const textWrapper = textWrapperRef.current;
    const title = titleRef.current;

    if (!reserve || !wrapper || !textWrapper || !title || items.length === 0) {
      return;
    }

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

    // Handle resize
    const handleResize = () => {
      calculatePositions();
    };

    window.addEventListener("resize", handleResize);

    // gsap is imported here rather than at the top of the file so it stays out of
    // the initial JS bundle, and only once the section is within a viewport of the
    // screen so visitors who never scroll this far never download it.
    let cancelled = false;
    let scrollTrigger: { kill: (revert?: boolean) => void } | undefined;
    let observer: IntersectionObserver | undefined;

    const loadAnimation = () => {
      void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
        ([{ gsap }, { ScrollTrigger }]) => {
          if (cancelled) return;

          gsap.registerPlugin(ScrollTrigger);

          // Create ScrollTrigger animation - match reference exactly
          scrollTrigger = ScrollTrigger.create({
            trigger: title,
            start: "center center",
            end: `+=${SCROLL_DISTANCE_PX}`,
            pin: wrapper,
            scrub: 2,
            animation: gsap.fromTo(
              textWrapper,
              { rotateX: -80 },
              { rotateX: 270, ease: "none" },
            ),
          });

          // The pin spacer now holds the scroll distance the placeholder padding
          // was reserving, so drop the padding in the same tick to avoid a jump.
          reserve.style.paddingBottom = "0px";
        },
      );
    };

    if (typeof IntersectionObserver === "undefined") {
      loadAnimation();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          loadAnimation();
        },
        // Start the download a full viewport before the section scrolls into view
        { rootMargin: "100% 0px" },
      );
      observer.observe(reserve);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      window.removeEventListener("resize", handleResize);
      scrollTrigger?.kill(true);
      reserve.style.paddingBottom = `${SCROLL_DISTANCE_PX}px`;
    };
  }, [items, prefersReducedMotion]);

  if (items.length === 0) {
    return null;
  }

  // Both layouts are server-rendered and CSS picks one, so the course titles are in the
  // initial HTML and the right layout shows from first paint in either motion mode.
  return (
    <>
      <div
        className={`relative hidden min-h-[100svh] w-full items-center justify-center motion-reduce:flex ${className}`}>
        <ul className="flex flex-col items-center gap-6 py-12 text-center font-bold uppercase leading-tight tracking-wider text-black">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="w-full max-w-[min(92vw,34rem)] px-5 text-balance sm:max-w-[min(80vw,38rem)] lg:max-w-[min(68vw,42rem)]"
              style={itemTextStyle(item)}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Until gsap pins the cylinder, this padding holds the scroll distance the pin
          spacer will add (the ScrollTrigger end above), so the page
          below, e.g. #contact, does not jump when gsap loads. */}
      <div
        ref={reserveRef}
        className="motion-reduce:hidden"
        style={{ paddingBottom: `${SCROLL_DISTANCE_PX}px` }}>
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
                className="absolute left-1/2 top-1/2 w-full max-w-[min(92vw,34rem)] px-5 text-balance sm:max-w-[min(80vw,38rem)] lg:max-w-[min(68vw,42rem)]"
                style={{
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  WebkitFontSmoothing: "antialiased",
                  MozOsxFontSmoothing: "grayscale",
                  textRendering: "optimizeLegibility",
                  willChange: "transform",
                  whiteSpace: "normal",
                  ...itemTextStyle(item),
                }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
