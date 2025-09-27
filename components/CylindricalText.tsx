'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface CylindricalTextProps {
  items: string[];
  className?: string;
}

export function CylindricalText({ items, className = '' }: CylindricalTextProps): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!wrapperRef.current || !textWrapperRef.current || !titleRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const calculatePositions = () => {
      const offset = 0.4;
      const radius = Math.min(window.innerWidth, window.innerHeight) * offset;
      const spacing = 180 / items.length;

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

    const init = () => {
      calculatePositions();

      ScrollTrigger.create({
        trigger: titleRef.current,
        start: "center center",
        end: "+=200vh",
        pin: wrapperRef.current,
        scrub: 2,
        animation: gsap.fromTo(
          textWrapperRef.current,
          { rotateX: -80 },
          { rotateX: 270, ease: "none" }
        ),
      });
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(init, 100);

    const handleResize = () => {
      calculatePositions();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [items]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={wrapperRef}
        className="cylindrical-wrapper relative h-screen flex flex-col justify-center items-center overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        <div
          ref={titleRef}
          className="cylindrical-title relative z-10"
        >
          <div
            ref={textWrapperRef}
            className="cylindrical-text-wrapper relative"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateX(-80deg)',
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                ref={el => itemsRef.current[index] = el}
                className="cylindrical-text-item absolute left-1/2 top-1/2 whitespace-nowrap text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-md"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}