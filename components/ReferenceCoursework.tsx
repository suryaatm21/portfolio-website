"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

interface ReferenceCourseworkProps {
  items: string[];
  className?: string;
}

export default function ReferenceCoursework({
  items,
  className = "",
}: ReferenceCourseworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const title = titleRef.current;

    if (!container || !wrapper || !title) return;

    // Create cylindrical text animation following reference implementation
    const words = container.querySelectorAll(".word");
    const totalWords = words.length;

    // Position words in a cylinder
    words.forEach((word, i) => {
      const angle = (i / totalWords) * 360;
      const z = 0; // Keep all words at the same z-distance for visibility

      gsap.set(word, {
        rotationY: angle,
        transformOrigin: "50% 50% -35vw", // Match reference transform origin
        z: z,
      });
    });

    // Create scroll-triggered rotation animation
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: title,
        pin: wrapper,
        start: "top top",
        end: "+=2000svh", // Match reference massive scroll distance
        scrub: 1,
        anticipatePin: 1,
      },
    });

    scrollTl.to(container, {
      rotationY: 360,
      ease: "none",
      duration: 1,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [items]);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="h-screen flex items-center justify-center overflow-hidden">
        <div className="text-center space-y-8">
          <h3
            ref={titleRef}
            className="text-2xl font-heading font-medium text-component-section-header-text mb-8">
            Coursework
          </h3>

          <div
            ref={containerRef}
            className="cylindrical-text-container"
            style={{
              perspective: "70vw",
              perspectiveOrigin: "50% 50%",
              height: "50vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            {items.map((item, index) => (
              <div
                key={index}
                className="word absolute text-lg font-medium text-component-primary-text whitespace-nowrap"
                style={{
                  backfaceVisibility: "hidden",
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
