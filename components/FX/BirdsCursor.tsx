// @ts-nocheck
"use client";

import { useRef, useEffect, useCallback } from "react";

interface CursorPoint {
  x: number;
  y: number;
  t: number;
}

interface BoidForces {
  separation: number;
  alignment: number;
  cohesion: number;
  trail: number;
}

interface BirdsCursorProps {
  enabled?: boolean;
  count?: number;
  colors?: string[];
  size?: number;
  speedCap?: number;
  forces?: BoidForces;
  zIndex?: number;
  className?: string;
  useSprite?: boolean;
  spritePath?: string;
}

/**
 * Cursor-Following Birds Effect
 *
 * Implements a performant boids algorithm where a small flock of birds
 * follows the user's cursor path using separation, alignment, cohesion,
 * and cursor-seeking behaviors.
 *
 * Features:
 * - Respects prefers-reduced-motion
 * - Optimized for 60fps on both DPR=1 and DPR=2
 * - Uses typed arrays for performance
 * - Automatic mobile detection and disabling
 */
export function BirdsCursor({
  enabled = false,
  count = 12,
  colors = ["#2d3748", "#d69e2e", "#38b2ac"],
  size = 8,
  speedCap = 2.5,
  forces = {
    separation: 1.5,
    alignment: 1.0,
    cohesion: 1.0,
    trail: 2.0,
  },
  zIndex = 5,
  className = "",
  useSprite = true,
  spritePath = "/sprites/bird.png",
}: BirdsCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Boids state - using typed arrays for performance
  const positionsRef = useRef<Float32Array>(new Float32Array(count * 2));
  const velocitiesRef = useRef<Float32Array>(new Float32Array(count * 2));
  const colorsRef = useRef<string[]>([]);

  // Sprite state
  const spriteRef = useRef<HTMLImageElement | null>(null);
  const spriteLoadedRef = useRef<boolean>(false);

  // Cursor trail state
  const cursorTrailRef = useRef<CursorPoint[]>([]);
  const lastFrameTimeRef = useRef<number>(0);

  // Performance and accessibility checks
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const isMobileDevice =
    typeof window !== "undefined"
      ? window.matchMedia("(pointer: coarse)").matches
      : false;

  // Throttled cursor tracking
  const updateCursorTrail = useCallback((e: MouseEvent) => {
    const now = performance.now();
    cursorTrailRef.current.push({
      x: e.clientX,
      y: e.clientY,
      t: now,
    });

    // Keep only recent points (last 350ms)
    const cutoff = now - 350;
    cursorTrailRef.current = cursorTrailRef.current.filter((p) => p.t > cutoff);

    // Limit trail length for performance
    if (cursorTrailRef.current.length > 10) {
      cursorTrailRef.current = cursorTrailRef.current.slice(-10);
    }
  }, []);

  // Load sprite image
  const loadSprite = useCallback(() => {
    if (!useSprite || spriteLoadedRef.current) return;

    const img = new Image();
    img.onload = () => {
      spriteRef.current = img;
      spriteLoadedRef.current = true;
    };
    img.onerror = () => {
      console.warn("Failed to load bird sprite, falling back to shapes");
      spriteLoadedRef.current = false;
    };
    img.src = spritePath;
  }, [useSprite, spritePath]);

  // Initialize boids positions and colors
  const initializeBoids = useCallback(() => {
    const positions = positionsRef.current;
    const boidColors = colorsRef.current;

    for (let i = 0; i < count; i++) {
      // Random initial positions
      positions[i * 2] = Math.random() * window.innerWidth;
      positions[i * 2 + 1] = Math.random() * window.innerHeight;

      // Random initial velocities
      velocitiesRef.current[i * 2] = (Math.random() - 0.5) * 2;
      velocitiesRef.current[i * 2 + 1] = (Math.random() - 0.5) * 2;

      // Assign colors
      const colorIndex = i % colors.length;
      boidColors[i] = colors[colorIndex] || colors[0] || "#2d3748";
    }
  }, [count, colors]);

  // Get average cursor position from recent trail
  const getAverageCursorPosition = useCallback((): { x: number; y: number } => {
    const trail = cursorTrailRef.current;
    if (trail.length === 0) {
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    let totalX = 0;
    let totalY = 0;
    let totalWeight = 0;
    const now = performance.now();

    for (const point of trail) {
      // Exponential decay based on age
      const age = now - point.t;
      const weight = Math.exp(-age / 100); // Decay over 100ms

      totalX += point.x * weight;
      totalY += point.y * weight;
      totalWeight += weight;
    }

    return {
      x: totalWeight > 0 ? totalX / totalWeight : trail[trail.length - 1].x,
      y: totalWeight > 0 ? totalY / totalWeight : trail[trail.length - 1].y,
    };
  }, []);

  // Boids algorithm implementation
  const applyBoidForces = useCallback(
    (boidIndex: number, target: { x: number; y: number }) => {
      const positions = positionsRef.current;
      const velocities = velocitiesRef.current;

      const bx = positions[boidIndex * 2];
      const by = positions[boidIndex * 2 + 1];
      let vx = velocities[boidIndex * 2];
      let vy = velocities[boidIndex * 2 + 1];

      // Separation, alignment, cohesion vectors
      let sepX = 0,
        sepY = 0;
      let aliX = 0,
        aliY = 0;
      let cohX = 0,
        cohY = 0;
      let neighbors = 0;

      const neighborRadius = 50;

      for (let i = 0; i < count; i++) {
        if (i === boidIndex) continue;

        const ox = positions[i * 2];
        const oy = positions[i * 2 + 1];
        const dx = bx - ox;
        const dy = by - oy;
        const distSq = dx * dx + dy * dy;

        if (distSq < neighborRadius * neighborRadius && distSq > 0) {
          const dist = Math.sqrt(distSq);
          neighbors++;

          // Separation - steer away from neighbors
          sepX += dx / dist;
          sepY += dy / dist;

          // Alignment - match neighbor velocities
          aliX += velocities[i * 2];
          aliY += velocities[i * 2 + 1];

          // Cohesion - steer toward neighbor center
          cohX += ox;
          cohY += oy;
        }
      }

      if (neighbors > 0) {
        // Average the forces
        sepX /= neighbors;
        sepY /= neighbors;
        aliX /= neighbors;
        aliY /= neighbors;
        cohX = cohX / neighbors - bx;
        cohY = cohY / neighbors - by;
      }

      // Cursor trail seeking
      const trailX = target.x - bx;
      const trailY = target.y - by;
      const trailDist = Math.sqrt(trailX * trailX + trailY * trailY);
      const normalizedTrailX = trailDist > 0 ? trailX / trailDist : 0;
      const normalizedTrailY = trailDist > 0 ? trailY / trailDist : 0;

      // Apply forces
      vx += sepX * forces.separation * 0.1;
      vy += sepY * forces.separation * 0.1;
      vx += aliX * forces.alignment * 0.05;
      vy += aliY * forces.alignment * 0.05;
      vx += cohX * forces.cohesion * 0.05;
      vy += cohY * forces.cohesion * 0.05;
      vx += normalizedTrailX * forces.trail * 0.1;
      vy += normalizedTrailY * forces.trail * 0.1;

      // Limit speed
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > speedCap) {
        vx = (vx / speed) * speedCap;
        vy = (vy / speed) * speedCap;
      }

      velocities[boidIndex * 2] = vx;
      velocities[boidIndex * 2 + 1] = vy;
    },
    [count, forces, speedCap],
  );

  // Update boid positions
  const updateBoidPositions = useCallback(
    (deltaTime: number) => {
      const positions = positionsRef.current;
      const velocities = velocitiesRef.current;

      for (let i = 0; i < count; i++) {
        let x = positions[i * 2] + velocities[i * 2] * deltaTime * 60;
        let y = positions[i * 2 + 1] + velocities[i * 2 + 1] * deltaTime * 60;

        // Screen wrapping with soft bounce
        const margin = 50;
        if (x < -margin) x = window.innerWidth + margin;
        if (x > window.innerWidth + margin) x = -margin;
        if (y < -margin) y = window.innerHeight + margin;
        if (y > window.innerHeight + margin) y = -margin;

        positions[i * 2] = x;
        positions[i * 2 + 1] = y;
      }
    },
    [count],
  );

  // Render boids
  const drawBoids = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;
    const boidColors = colorsRef.current;
    const sprite = spriteRef.current;
    const useActualSprite = useSprite && spriteLoadedRef.current && sprite;

    for (let i = 0; i < count; i++) {
      const x = positions[i * 2];
      const y = positions[i * 2 + 1];
      const vx = velocities[i * 2];
      const vy = velocities[i * 2 + 1];

      // Calculate rotation from velocity
      const angle = Math.atan2(vy, vx);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      if (useActualSprite && sprite) {
        // Draw sprite with color tinting
        ctx.globalCompositeOperation = "source-over";
        const spriteSize = size * 2;
        ctx.drawImage(
          sprite,
          -spriteSize / 2,
          -spriteSize / 2,
          spriteSize,
          spriteSize,
        );

        // Apply color tint
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = boidColors[i];
        ctx.fillRect(-spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
      } else {
        // Draw simple triangle bird shape
        ctx.fillStyle = boidColors[i];
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size / 2, -size / 3);
        ctx.lineTo(-size / 3, 0);
        ctx.lineTo(-size / 2, size / 3);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }, [count, size, useSprite]);

  // Main animation loop
  const animate = useCallback(
    (currentTime: number) => {
      if (!enabled || prefersReducedMotion || isMobileDevice) return;

      const deltaTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      // Skip frame if delta is too large (tab was hidden)
      if (deltaTime > 100) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const target = getAverageCursorPosition();

      // Update boids
      for (let i = 0; i < count; i++) {
        applyBoidForces(i, target);
      }

      updateBoidPositions(deltaTime / 1000);
      drawBoids();

      rafRef.current = requestAnimationFrame(animate);
    },
    [
      enabled,
      prefersReducedMotion,
      isMobileDevice,
      count,
      getAverageCursorPosition,
      applyBoidForces,
      updateBoidPositions,
      drawBoids,
    ],
  );

  // Canvas setup and resize handling
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    contextRef.current = ctx;

    // Set canvas size with DPR scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
  }, []);

  // Start/stop animation
  const startAnimation = useCallback(() => {
    if (rafRef.current) return;

    loadSprite();
    initializeBoids();
    lastFrameTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);
  }, [loadSprite, initializeBoids, animate]);

  const stopAnimation = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }
  }, []);

  // Effects
  useEffect(() => {
    if (!enabled || prefersReducedMotion || isMobileDevice) {
      stopAnimation();
      return;
    }

    setupCanvas();
    startAnimation();

    // Event listeners
    const throttledCursorUpdate = (e: MouseEvent) => {
      // Throttle to ~60fps
      if (performance.now() - (updateCursorTrail as any).lastCall > 16) {
        updateCursorTrail(e);
        (updateCursorTrail as any).lastCall = performance.now();
      }
    };

    window.addEventListener("mousemove", throttledCursorUpdate, {
      passive: true,
    });
    window.addEventListener("resize", setupCanvas);

    return () => {
      stopAnimation();
      window.removeEventListener("mousemove", throttledCursorUpdate);
      window.removeEventListener("resize", setupCanvas);
    };
  }, [
    enabled,
    prefersReducedMotion,
    isMobileDevice,
    setupCanvas,
    startAnimation,
    stopAnimation,
    updateCursorTrail,
  ]);

  // Don't render if disabled
  if (!enabled || prefersReducedMotion || isMobileDevice) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex }}
      aria-hidden="true"
    />
  );
}

// Export ref-based API for external control
export interface BirdsCursorRef {
  start: () => void;
  stop: () => void;
  setEnabled: (enabled: boolean) => void;
  setCount: (count: number) => void;
  setColors: (colors: string[]) => void;
  setIntensity: (forces: Partial<BoidForces>) => void;
}

export const BirdsCursorWithRef = BirdsCursor;
