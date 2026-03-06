"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface AnimatedBackgroundProps {
  theme?: "dark" | "light";
}

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

export default function AnimatedBackground({
  theme: propTheme,
}: AnimatedBackgroundProps): JSX.Element {
  // Force light theme since dark mode is disabled
  const theme = propTheme || "light";
  const enableExternalClouds = process.env.NODE_ENV === "production";
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const scriptsLoadedRef = useRef(false);
  const heroDocTopRef = useRef<number>(0);
  const baseClipRef = useRef<number>(320);
  const baseFadeRef = useRef<number>(220);
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

  const loadScript = useCallback(
    (src: string, key: "THREE" | "VANTA"): Promise<boolean> => {
      if (typeof window === "undefined") return Promise.resolve(false);
      if (window[key]) return Promise.resolve(true);

      return new Promise((resolve) => {
        const existing = document.querySelector(
          `script[data-animated-bg="${key}"]`,
        ) as HTMLScriptElement | null;

        if (existing) {
          existing.addEventListener("load", () => resolve(true), { once: true });
          existing.addEventListener("error", () => resolve(false), {
            once: true,
          });
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.crossOrigin = "anonymous";
        script.dataset.animatedBg = key;

        const handleLoad = () => resolve(true);
        const handleError = (event: Event) => {
          event.preventDefault?.();
          event.stopPropagation?.();
          console.warn(`Failed to load background dependency: ${key}`);
          resolve(false);
        };

        script.addEventListener("load", handleLoad, { once: true });
        script.addEventListener("error", handleError, {
          once: true,
          capture: true,
        });
        document.head.appendChild(script);
      });
    },
    [],
  );

  const loadScripts = useCallback(async (): Promise<boolean> => {
    if (scriptsLoadedRef.current) return true;

    const [threeLoaded, vantaLoaded] = await Promise.all([
      loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js",
        "THREE",
      ),
      loadScript(
        "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js",
        "VANTA",
      ),
    ]);

    scriptsLoadedRef.current = true;
    healthStatsRef.current.threeOK = !!window.THREE;
    healthStatsRef.current.vantaOK = !!window.VANTA;

    return threeLoaded && vantaLoaded && !!window.THREE && !!window.VANTA;
  }, [loadScript]);

  const initializeVanta = useCallback(async () => {
    if (!vantaRef.current) return;

    try {
      const scriptsReady = await loadScripts();

      if (!scriptsReady || !window.VANTA || !window.THREE) {
        console.warn("Vanta.js or Three.js not loaded properly");
        return;
      }

      // Clean up existing effect
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }

      // Configure Vanta clouds for light theme only
      const vantaConfig = {
        el: vantaRef.current,
        THREE: window.THREE,
        mouseControls: !prefersReducedMotion,
        touchControls: !prefersReducedMotion,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        backgroundColor: 0xffffff, // White background
        skyColor: 0x4cc5f6, // Light blue sky
        cloudColor: 0xadc1de, // Warm gray clouds
        cloudShadowColor: 0x183550, // Blue shadow
        sunColor: 0xff9919, // Warm sun
        sunGlareColor: 0xff6653, // Sun glare
        sunlightColor: 0xff9933, // Bright sunlight
        speed: prefersReducedMotion ? 0.2 : 1.0,
      };

      if (window.VANTA && window.VANTA.CLOUDS) {
        vantaEffect.current = window.VANTA.CLOUDS(vantaConfig);
      } else {
        console.warn("VANTA.CLOUDS not available on window");
        return;
      }
      healthStatsRef.current.cloudsActive = true;

      console.log("Vanta.js clouds initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Vanta.js:", error);
      healthStatsRef.current.vantaOK = false;
    }
  }, [prefersReducedMotion, loadScripts]);

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
    const healthStats = healthStatsRef.current;
    const timeoutId = enableExternalClouds
      ? setTimeout(() => {
          initializeVanta();
        }, 100)
      : null;

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

    if (!enableExternalClouds) {
      healthStats.vantaOK = true;
      healthStats.threeOK = true;
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.removeEventListener("scroll", updateSkyFromScroll);

      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
      healthStats.cloudsActive = false;
      clearTimeout(t1);
      clearTimeout(t2);
      detachDPR?.();
    };
  }, [enableExternalClouds, initializeVanta, handleResize, updateSkyFromScroll]);

  // Update theme when it changes
  useEffect(() => {
    if (enableExternalClouds && vantaEffect.current && window.VANTA) {
      initializeVanta();
    }
  }, [enableExternalClouds, theme, initializeVanta]);

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
              background: enableExternalClouds
                ? "transparent"
                : "linear-gradient(180deg, rgba(76,197,246,0.95) 0%, rgba(173,193,222,0.85) 52%, rgba(255,255,255,0) 100%)",
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
          background:
            // Day sky gradient - light blue
            "linear-gradient(to bottom, rgba(104,184,215,1) 0%, rgba(104,184,215,1) var(--sky-solid-height, 320px), rgba(104,184,215,0) calc(var(--sky-solid-height, 320px) + var(--sky-fade-length, 220px)))",
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
          <div>
            Colors: {healthStatsRef.current.customColors ? "Custom" : "Default"}
          </div>
          <div>Motion: {prefersReducedMotion ? "Reduced" : "Full"}</div>
        </div>
      )}
    </>
  );
}
