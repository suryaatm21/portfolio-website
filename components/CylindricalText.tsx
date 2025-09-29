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
}: CylindricalTextProps): React.ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Keep ref array in sync with incoming data to avoid stale nodes
  itemsRef.current.length = items.length;

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const textWrapper = textWrapperRef.current;
    if (!wrapper || !textWrapper) return;

    gsap.registerPlugin(ScrollTrigger);

    const itemSpacing = items.length > 0 ? 180 / items.length : 0;

    const calculatePositions = () => {
      // Match geometry to container height so pinning stays consistent
      const containerHeight = wrapper.clientHeight || 400;
      const radius = containerHeight * 0.42;

      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        const angle = (index * itemSpacing * Math.PI) / 180;
        const rotationAngle = index * -itemSpacing;

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

    window.addEventListener("resize", handleResize);

    const ctx = gsap.context(() => {
      calculatePositions();

      const startRotation = 80;
      const totalRotation = itemSpacing * Math.max(items.length - 1, 0);
      const endRotation = startRotation - totalRotation;
      const scrollDistance = Math.max(1200, items.length * 220);

      ScrollTrigger.create({
        trigger: wrapper,
        start: "top center",
        end: `+=${scrollDistance}`,
        pin: true,
        pinSpacing: true,
        scrub: 1.2,
        anticipatePin: 1,
        animation: gsap.fromTo(
          textWrapper,
          { rotateX: startRotation },
          { rotateX: endRotation, ease: "none" },
        ),
        onRefreshInit: calculatePositions,
        onUpdate: (self) => {
          const rotation =
            startRotation + (endRotation - startRotation) * self.progress;

          itemsRef.current.forEach((item, index) => {
            if (!item) return;

            const itemAngle = index * itemSpacing;
            const normalized = ((rotation + itemAngle + 540) % 360) - 180; // -180 to 180
            const distance = Math.abs(normalized);
            const visibleArc = 90;
            const fadeZone = Math.min(
              visibleArc,
              Math.max(12, itemSpacing * 1.4),
            );

            let opacity = 0;
            if (distance <= visibleArc) {
              opacity = 1;
              if (distance >= visibleArc - fadeZone) {
                opacity = 1 - (distance - (visibleArc - fadeZone)) / fadeZone;
              }
            } else if (distance <= visibleArc + fadeZone) {
              opacity = 1 - (distance - visibleArc) / fadeZone;
            }

            item.style.opacity = Math.max(0, Math.min(1, opacity)).toString();
            const zIndex = Math.max(0, Math.round(visibleArc * 2 - distance));
            item.style.zIndex = zIndex.toString();
          });
        },
      });
    }, wrapper);

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, [items]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={wrapperRef}
        className="cylindrical-wrapper relative h-96 w-full flex flex-col justify-center items-center overflow-hidden soft-card"
        style={{ perspective: "1200px" }}>
        {/* Top mask gradient */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-card to-transparent z-30 pointer-events-none" />

        {/* Header moved inside the component */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <h3 className="text-xl font-heading font-semibold text-component-header-text">
            Relevant Coursework
          </h3>
        </div>

        {/* Bottom mask gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent z-30 pointer-events-none" />

        <div className="cylindrical-title relative z-10 w-full h-full flex items-center justify-center">
          <div
            ref={textWrapperRef}
            className="cylindrical-text-wrapper relative"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(80deg)", // Match ScrollTrigger starting rotation
              backfaceVisibility: "hidden", // Hide back faces
            }}>
            {items.map((item, index) => (
              <div
                key={index}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                className="cylindrical-text-item absolute left-1/2 top-1/2 whitespace-nowrap text-base font-medium text-white bg-slate-700/80 px-4 py-3 rounded-md border border-slate-600 backdrop-blur-sm shadow-lg"
                style={{
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden", // Hide back faces of individual items
                }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
