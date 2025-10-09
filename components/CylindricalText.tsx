"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useLayoutEffect, useRef } from "react";

interface CylindricalTextProps {
  items: string[];
  className?: string;
}

export function CylindricalText({
  items,
  className = "",
}: CylindricalTextProps): React.ReactElement | null {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLUListElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  const containerClassName = ["relative min-h-[80svh]", className]
    .filter(Boolean)
    .join(" ");

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const textWrapper = textWrapperRef.current;

    if (!wrapper || !textWrapper || items.length === 0) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    itemsRef.current = itemsRef.current.slice(0, items.length);

    const spacing = 180 / items.length;

    const calculatePositions = () => {
      const rect = wrapper.getBoundingClientRect();
      const minDimension = Math.max(
        1,
        Math.min(rect.width, rect.height, window.innerWidth, window.innerHeight),
      );
      const radius = minDimension * 0.4;

      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        const angle = (index * spacing * Math.PI) / 180;
        const rotationAngle = index * -spacing;

        const x = 0;
        const y = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        item.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotationAngle}deg)`;
      });
    };

    const handleResize = () => {
      calculatePositions();
      ScrollTrigger.refresh();
    };

    const ctx = gsap.context(() => {
      calculatePositions();

      const animation = gsap.fromTo(
        textWrapper,
        { rotateX: -80 },
        { rotateX: 270, ease: "none" },
      );

      ScrollTrigger.create({
        trigger: wrapper,
        start: "center center",
        end: "+=2000svh",
        pin: wrapper,
        scrub: 2,
        animation,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: calculatePositions,
      });
    }, wrapper);

    window.addEventListener("resize", handleResize);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={containerClassName}>
      <div
        ref={wrapperRef}
        className="relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden"
        style={{ perspective: "70vw" }}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-card to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card to-transparent" />

        <p className="relative z-10 mb-8 text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Scroll to explore
        </p>

        <ul
          ref={textWrapperRef}
          className="relative z-10 flex h-full w-full items-center justify-center text-center text-3xl font-semibold uppercase text-component-card-text sm:text-4xl"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "50% 50%",
          }}>
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
