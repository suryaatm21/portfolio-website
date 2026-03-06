"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface AnimatedBackgroundProps {
  theme?: "dark" | "light";
}

interface VantaEffect {
  destroy?: () => void;
  pause?: () => void;
  play?: () => void;
  resize?: () => void;
}

type VantaCloudsFactory = (options: Record<string, unknown>) => VantaEffect;

interface SkyPreset {
  gradients: {
    canvas: string;
    overlay: string;
  };
  vanta: {
    backgroundColor: number;
    skyColor: number;
    cloudColor: number;
    cloudShadowColor: number;
    sunColor: number;
    sunGlareColor: number;
    sunlightColor: number;
  };
}

const SKY_PRESETS = {
  previousSkyBlue: {
    gradients: {
      canvas:
        "linear-gradient(180deg, rgba(76,197,246,0.95) 0%, rgba(173,193,222,0.85) 52%, rgba(255,255,255,0) 100%)",
      overlay:
        "linear-gradient(to bottom, rgba(104,184,215,1) 0%, rgba(104,184,215,1) var(--sky-solid-height, 320px), rgba(104,184,215,0) calc(var(--sky-solid-height, 320px) + var(--sky-fade-length, 220px)))",
    },
    vanta: {
      backgroundColor: 0xffffff,
      skyColor: 0x4cc5f6,
      cloudColor: 0xadc1de,
      cloudShadowColor: 0x183550,
      sunColor: 0xff9919,
      sunGlareColor: 0xff6653,
      sunlightColor: 0xff9933,
    },
  },
  softDaylight: {
    gradients: {
      canvas:
        "linear-gradient(180deg, rgba(124,205,238,0.88) 0%, rgba(188,220,233,0.72) 55%, rgba(255,255,255,0) 100%)",
      overlay:
        "linear-gradient(to bottom, rgba(122,205,240,0.9) 0%, rgba(171,220,239,0.8) var(--sky-solid-height, 320px), rgba(171,220,239,0) calc(var(--sky-solid-height, 320px) + var(--sky-fade-length, 220px)))",
    },
    vanta: {
      backgroundColor: 0xf8fbfd,
      skyColor: 0x82d0f1,
      cloudColor: 0xd3dbe2,
      cloudShadowColor: 0x88a5bb,
      sunColor: 0xffe1ab,
      sunGlareColor: 0xffcd93,
      sunlightColor: 0xffefc8,
    },
  },
  goldenHour: {
    gradients: {
      canvas:
        "linear-gradient(180deg, rgba(244,186,145,0.9) 0%, rgba(232,190,188,0.7) 40%, rgba(184,205,222,0.45) 72%, rgba(255,255,255,0) 100%)",
      overlay:
        "linear-gradient(to bottom, rgba(239,171,120,0.92) 0%, rgba(232,185,145,0.82) var(--sky-solid-height, 320px), rgba(232,185,145,0) calc(var(--sky-solid-height, 320px) + var(--sky-fade-length, 220px)))",
    },
    vanta: {
      backgroundColor: 0xfff6eb,
      skyColor: 0xf0b07c,
      cloudColor: 0xd8c0b7,
      cloudShadowColor: 0x7c6674,
      sunColor: 0xffc56e,
      sunGlareColor: 0xffa86e,
      sunlightColor: 0xffddb0,
    },
  },
} as const satisfies Record<string, SkyPreset>;

const ACTIVE_SKY_PRESET = "softDaylight";
const ACTIVE_SKY = SKY_PRESETS[ACTIVE_SKY_PRESET];

export default function AnimatedBackground({
  theme: propTheme,
}: AnimatedBackgroundProps): JSX.Element {
  // Force light theme since dark mode is disabled
  const theme = propTheme || "light";
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<VantaEffect | null>(null);
  const vantaFactoryRef = useRef<VantaCloudsFactory | null>(null);
  const threeRef = useRef<Record<string, unknown> | null>(null);
  const modulesLoadedRef = useRef(false);
  const heroDocTopRef = useRef<number>(0);
  const baseClipRef = useRef<number>(320);
  const baseFadeRef = useRef<number>(220);
  const [, setHealthVersion] = useState(0);
  const healthStatsRef = useRef({
    tailwindOK: true,
    vantaOK: false,
    threeOK: false,
    cloudsActive: false,
    customColors: true,
  });

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const refreshHealthStats = useCallback(() => {
    setHealthVersion((current) => current + 1);
  }, []);

  const loadModules = useCallback(async (): Promise<boolean> => {
    if (modulesLoadedRef.current) return true;

    try {
      const [threeModule, cloudsModule] = await Promise.all([
        import("three"),
        import("vanta/dist/vanta.clouds.min"),
      ]);

      const cloudsFactory = (
        "default" in cloudsModule ? cloudsModule.default : cloudsModule
      ) as unknown as VantaCloudsFactory;

      threeRef.current = threeModule as unknown as Record<string, unknown>;
      vantaFactoryRef.current = cloudsFactory;
      modulesLoadedRef.current = true;
      healthStatsRef.current.threeOK = true;
      healthStatsRef.current.vantaOK = true;
      refreshHealthStats();

      return true;
    } catch (error) {
      console.error("Failed to load Vanta modules:", error);
      healthStatsRef.current.threeOK = false;
      healthStatsRef.current.vantaOK = false;
      healthStatsRef.current.cloudsActive = false;
      refreshHealthStats();
      return false;
    }
  }, [refreshHealthStats]);

  const initializeVanta = useCallback(async () => {
    if (!vantaRef.current) return;

    try {
      const modulesReady = await loadModules();

      if (!modulesReady || !threeRef.current || !vantaFactoryRef.current) {
        console.warn("Vanta.js or Three.js not loaded properly");
        return;
      }

      // Clean up existing effect
      if (vantaEffect.current) {
        vantaEffect.current.destroy?.();
      }

      // Configure Vanta clouds for light theme only
      const vantaConfig = {
        el: vantaRef.current,
        THREE: threeRef.current,
        mouseControls: !prefersReducedMotion,
        touchControls: !prefersReducedMotion,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        ...ACTIVE_SKY.vanta,
        speed: prefersReducedMotion ? 0.2 : 1.0,
      };

      vantaEffect.current = vantaFactoryRef.current(vantaConfig);
      healthStatsRef.current.cloudsActive = true;
      refreshHealthStats();

      console.log("Vanta.js clouds initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Vanta.js:", error);
      healthStatsRef.current.vantaOK = false;
      healthStatsRef.current.cloudsActive = false;
      refreshHealthStats();
    }
  }, [loadModules, prefersReducedMotion, refreshHealthStats]);

  // Update the CSS variables for sky based on current scroll position
  const updateSkyFromScroll = useCallback(() => {
    const docTop = heroDocTopRef.current || 0;
    const root = document.documentElement;

    let solid = Math.max(0, Math.round(docTop - window.scrollY - 24));
    let fade = baseFadeRef.current;

    if (solid < fade + 32) {
      fade = Math.max(64, solid - 32);
    }

    if (!Number.isFinite(fade) || fade < 0) {
      fade = 0;
    }

    root.style.setProperty("--sky-solid-height", `${solid}px`);
    root.style.setProperty("--sky-fade-length", `${fade}px`);
    root.style.setProperty("--sky-overlay-opacity", solid > 0 ? "1" : "0");
  }, []);

  const handleResize = useCallback(() => {
    if (vantaEffect.current && vantaEffect.current.resize) {
      vantaEffect.current.resize();
    }

    // Recalculate where the sky should end (just above the Hero container)
    try {
      const heroContainer = document.querySelector(
        "#home .container",
      ) as HTMLElement | null;
      if (heroContainer) {
        // Compute absolute document top for consistency across screens
        const docTop = Math.round(
          heroContainer.getBoundingClientRect().top + window.scrollY,
        );
        heroDocTopRef.current = docTop;

        let baseSolid = Math.max(0, Math.round(docTop - 24));
        let baseFade = 220;
        if (baseSolid < baseFade + 32) {
          baseFade = Math.max(64, baseSolid - 32);
        }

        baseFadeRef.current = baseFade;
        const clipValue = Math.max(0, baseSolid + baseFade);
        baseClipRef.current = clipValue;
        document.documentElement.style.setProperty(
          "--vanta-clip",
          `${clipValue}px`,
        );

        // Immediately reflect current scroll position
        updateSkyFromScroll();
      }
    } catch {}
  }, [updateSkyFromScroll]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      initializeVanta();
    }, 100);

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    // Also calculate on first paint and after content mounts
    handleResize();
    const t1 = setTimeout(handleResize, 300);
    const t2 = setTimeout(handleResize, 1000);

    // Recalculate when devicePixelRatio changes (moving between displays)
    let detachDPR: (() => void) | null = null;
    const attachDPRListener = () => {
      const dpr = window.devicePixelRatio || 1;
      const mq = window.matchMedia(`(resolution: ${dpr}dppx)`);
      const onChange = () => {
        // Rebind to the new DPR value and trigger a resize
        detachDPR?.();
        vantaEffect.current?.resize?.();
        handleResize();
        attachDPRListener();
      };
      mq.addEventListener("change", onChange);
      detachDPR = () => mq.removeEventListener("change", onChange);
    };
    if (typeof window !== "undefined") attachDPRListener();

    // Update sky height as the user scrolls (ensures sky disappears on scroll)
    window.addEventListener("scroll", updateSkyFromScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.removeEventListener("scroll", updateSkyFromScroll);

      if (vantaEffect.current) {
        vantaEffect.current.destroy?.();
        vantaEffect.current = null;
      }
      healthStatsRef.current.cloudsActive = false;
      refreshHealthStats();
      clearTimeout(t1);
      clearTimeout(t2);
      detachDPR?.();
    };
  }, [initializeVanta, handleResize, refreshHealthStats, updateSkyFromScroll]);

  // Update theme when it changes
  useEffect(() => {
    if (vantaEffect.current && vantaFactoryRef.current) {
      initializeVanta();
    }
  }, [theme, initializeVanta]);

  // Public API methods
  const start = useCallback(() => {
    if (vantaEffect.current && vantaEffect.current.play) {
      vantaEffect.current.play();
    }
  }, []);

  const stop = useCallback(() => {
    if (vantaEffect.current && vantaEffect.current.pause) {
      vantaEffect.current.pause();
    }
  }, []);

  const setTheme = useCallback((newTheme: "dark" | "light") => {
    // Theme will be handled by the useEffect above
    console.log("Theme set to:", newTheme);
  }, []);

  // Expose methods via ref
  useEffect(() => {
    if (vantaRef.current) {
      (vantaRef.current as any).animationControls = { start, stop, setTheme };
    }
  }, [start, stop, setTheme]);

  return (
    <>
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          zIndex: -2,
          pointerEvents: "none",
        }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100vw",
            height: "calc(100vh + var(--vanta-clip, 320px))",
            transform: "translateY(calc(-1 * var(--vanta-clip, 320px)))",
            willChange: "transform",
          }}>
          <div
            ref={vantaRef}
            id="bg-canvas"
            style={{
              width: "100%",
              height: "100%",
              background: ACTIVE_SKY.gradients.canvas,
              pointerEvents: prefersReducedMotion ? "none" : "auto",
              display: "block",
            }}
          />
        </div>
      </div>
      {/* Fixed sky overlay at the very top (under the navbar).
          This ensures a visible sky that meets the clouds exactly
          at the top of the hero section. */}
      <div
        aria-hidden
        style={{
          // Make the sky overlay part of the page flow so it scrolls out of view
          // while keeping the current fade position intact.
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height:
            "calc(var(--sky-solid-height, calc(var(--nav-height, 4rem) + 24px)) + var(--sky-fade-length, 220px))",
          background: ACTIVE_SKY.gradients.overlay,
          zIndex: -1,
          pointerEvents: "none",
          opacity: "var(--sky-overlay-opacity, 1)",
          transition: "opacity 200ms ease",
        }}
      />
      {/* Development health overlay */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-22 right-4 bg-black/80 text-white text-xs p-2 rounded z-40 font-mono">
          <div>Tailwind: {healthStatsRef.current.tailwindOK ? "✓" : "✗"}</div>
          <div>Three.js: {healthStatsRef.current.threeOK ? "✓" : "✗"}</div>
          <div>Vanta: {healthStatsRef.current.vantaOK ? "✓" : "✗"}</div>
          <div>Clouds: {healthStatsRef.current.cloudsActive ? "✓" : "✗"}</div>
          <div>Preset: {ACTIVE_SKY_PRESET}</div>
          <div>
            Colors: {healthStatsRef.current.customColors ? "Custom" : "Default"}
          </div>
          <div>Motion: {prefersReducedMotion ? "Reduced" : "Full"}</div>
        </div>
      )}
    </>
  );
}
