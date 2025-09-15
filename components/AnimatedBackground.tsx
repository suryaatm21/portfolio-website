'use client';

import { useEffect, useRef, useCallback } from 'react';

interface AnimatedBackgroundProps {
  theme?: 'dark' | 'light';
}

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

export default function AnimatedBackground({
  theme = 'dark',
}: AnimatedBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const scriptsLoadedRef = useRef(false);
  const heroDocTopRef = useRef<number>(0);
  const healthStatsRef = useRef({
    tailwindOK: true,
    vantaOK: false,
    threeOK: false,
    cloudsActive: false,
    customColors: true,
  });

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const loadScripts = useCallback(async (): Promise<boolean> => {
    if (scriptsLoadedRef.current) return true;

    return new Promise((resolve) => {
      let scriptsToLoad = 2;
      let scriptsLoaded = 0;

      const checkComplete = () => {
        scriptsLoaded++;
        if (scriptsLoaded === scriptsToLoad) {
          scriptsLoadedRef.current = true;
          healthStatsRef.current.threeOK = !!window.THREE;
          healthStatsRef.current.vantaOK = !!window.VANTA;
          resolve(true);
        }
      };

      // Load Three.js
      const threeScript = document.createElement('script');
      threeScript.src =
        'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
      threeScript.onload = checkComplete;
      threeScript.onerror = () => {
        console.warn('Failed to load Three.js');
        checkComplete();
      };
      document.head.appendChild(threeScript);

      // Load Vanta Clouds
      const vantaScript = document.createElement('script');
      vantaScript.src =
        'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js';
      vantaScript.onload = checkComplete;
      vantaScript.onerror = () => {
        console.warn('Failed to load Vanta.js clouds');
        checkComplete();
      };
      document.head.appendChild(vantaScript);
    });
  }, []);

  const initializeVanta = useCallback(async () => {
    if (!vantaRef.current) return;

    try {
      await loadScripts();

      if (!window.VANTA || !window.THREE) {
        console.warn('Vanta.js or Three.js not loaded properly');
        return;
      }

      // Clean up existing effect
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }

      // Configure Vanta clouds with custom colors from the customization panel
      const vantaConfig = {
        el: vantaRef.current,
        // Pass THREE explicitly to avoid undefined errors in some builds
        THREE: window.THREE,
        mouseControls: !prefersReducedMotion,
        touchControls: !prefersReducedMotion,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        // Custom colors from Vanta.js customization panel
        backgroundColor: 0xffffff,
        skyColor: 0x68b8d7,
        cloudColor: 0xadc1de,
        cloudShadowColor: 0x183550,
        sunColor: 0xff9919,
        sunGlareColor: 0xff6653,
        sunlightColor: 0xff9933,
        speed: prefersReducedMotion ? 0.2 : 1.0,
      };

      if (window.VANTA && window.VANTA.CLOUDS) {
        vantaEffect.current = window.VANTA.CLOUDS(vantaConfig);
      } else {
        console.warn('VANTA.CLOUDS not available on window');
        return;
      }
      healthStatsRef.current.cloudsActive = true;

      console.log('Vanta.js clouds initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Vanta.js:', error);
      healthStatsRef.current.vantaOK = false;
    }
  }, [theme, prefersReducedMotion, loadScripts]);

  // Update the CSS variables for sky based on current scroll position
  const updateSkyFromScroll = useCallback(() => {
    const docTop = heroDocTopRef.current || 0;
    let solid = Math.max(0, Math.round(docTop - window.scrollY - 24));
    let fade = 220;
    if (solid < fade + 32) fade = Math.max(64, solid - 32);
    const root = document.documentElement;
    root.style.setProperty('--sky-solid-height', `${solid}px`);
    root.style.setProperty('--sky-fade-length', `${fade}px`);
    root.style.setProperty('--vanta-clip', `${solid + fade}px`);
  }, []);

  const handleResize = useCallback(() => {
    if (vantaEffect.current && vantaEffect.current.resize) {
      vantaEffect.current.resize();
    }

    // Recalculate where the sky should end (just above the Hero container)
    try {
      const heroContainer = document.querySelector(
        '#home .container',
      ) as HTMLElement | null;
      if (heroContainer) {
        // Compute absolute document top for consistency across screens
        const docTop = Math.round(
          heroContainer.getBoundingClientRect().top + window.scrollY,
        );
        heroDocTopRef.current = docTop;
        // Immediately reflect current scroll position
        updateSkyFromScroll();
      }
    } catch {}
  }, [updateSkyFromScroll]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      initializeVanta();
    }, 100);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
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
      mq.addEventListener('change', onChange);
      detachDPR = () => mq.removeEventListener('change', onChange);
    };
    if (typeof window !== 'undefined') attachDPRListener();

    // Update sky height as the user scrolls (ensures sky disappears on scroll)
    window.addEventListener('scroll', updateSkyFromScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('scroll', updateSkyFromScroll);

      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
      healthStatsRef.current.cloudsActive = false;
      clearTimeout(t1);
      clearTimeout(t2);
      detachDPR?.();
    };
  }, [initializeVanta, handleResize, updateSkyFromScroll]);

  // Update theme when it changes
  useEffect(() => {
    if (vantaEffect.current && window.VANTA) {
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

  const setTheme = useCallback((newTheme: 'dark' | 'light') => {
    // Theme will be handled by the useEffect above
    console.log('Theme set to:', newTheme);
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
        ref={vantaRef}
        id="bg-canvas"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          // Place Vanta behind our sky overlay so the sky color
          // can meet the clouds right at the top of the hero.
          zIndex: -2,
          pointerEvents: prefersReducedMotion ? 'none' : 'auto',
          display: 'block',
          // Clip away the Vanta area that overlaps the hero sky overlay.
          // We keep colors intact by not drawing Vanta above the seam at all.
          clipPath:
            'polygon(0 calc(var(--vanta-clip, 320px)), 100% calc(var(--vanta-clip, 320px)), 100% 100%, 0% 100%)',
        }}
      />
      {/* Fixed sky overlay at the very top (under the navbar). 
          This ensures a visible sky that meets the clouds exactly
          at the top of the hero section. */}
      <div
        aria-hidden
        style={{
          // Make the sky overlay part of the page flow so it scrolls out of view
          // while keeping the current fade position intact.
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          // Fade should END at container top (solid height). So we fade from
          // (solid-height - fade-length) -> (solid-height).
          height:
            'var(--sky-solid-height, calc(var(--nav-height, 4rem) + 24px))',
          background:
            'linear-gradient(to bottom, rgba(104,184,215,1) 0%, rgba(104,184,215,1) calc(var(--sky-solid-height, 320px) - var(--sky-fade-length, 220px)), rgba(104,184,215,0) var(--sky-solid-height, 320px))',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
      {/* Development health overlay */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black/80 text-white text-xs p-2 rounded z-50 font-mono">
          <div>Tailwind: {healthStatsRef.current.tailwindOK ? '✓' : '✗'}</div>
          <div>Three.js: {healthStatsRef.current.threeOK ? '✓' : '✗'}</div>
          <div>Vanta: {healthStatsRef.current.vantaOK ? '✓' : '✗'}</div>
          <div>Clouds: {healthStatsRef.current.cloudsActive ? '✓' : '✗'}</div>
          <div>
            Colors: {healthStatsRef.current.customColors ? 'Custom' : 'Default'}
          </div>
          <div>Motion: {prefersReducedMotion ? 'Reduced' : 'Full'}</div>
        </div>
      )}
    </>
  );
}
