"use client";

import dynamic from "next/dynamic";
import React from "react";

// Client-only dynamic loads avoid SSR evaluation
const BirdsCursor = dynamic(
  () => import("@/components/FX/BirdsCursor").then((m) => m.BirdsCursor),
  { ssr: false },
);

const PerformanceMonitor = dynamic(
  () =>
    import("@/components/FX/PerformanceMonitor").then(
      (m) => m.PerformanceMonitor,
    ),
  { ssr: false },
);

// Quick toggles for optional dev-only FX widgets
const ENABLE_BIRDS_CURSOR = false;
const ENABLE_PERFORMANCE_MONITOR = false;

export function FXMounts(): JSX.Element | null {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <>
      {ENABLE_BIRDS_CURSOR && (
        <BirdsCursor
          enabled
          count={6}
          colors={["#2d3748", "#d69e2e", "#38b2ac"]}
          size={12}
          speedCap={3}
          forces={{
            separation: 1.2,
            alignment: 0.8,
            cohesion: 0.6,
            trail: 1.5,
          }}
          useSprite
          zIndex={10}
        />
      )}
      {ENABLE_PERFORMANCE_MONITOR && <PerformanceMonitor enabled />}
    </>
  );
}
