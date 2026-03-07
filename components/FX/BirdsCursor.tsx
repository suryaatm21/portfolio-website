"use client";

import { useCallback, useEffect, useRef } from "react";

interface CursorPoint {
  x: number;
  y: number;
  t: number;
}

interface BirdPalette {
  body: string;
  wing: string;
  tail: string;
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
}

const DEFAULT_FORCES: BoidForces = {
  separation: 2.6,
  alignment: 0.95,
  cohesion: 0.35,
  trail: 2.9,
};

const CURSOR_RETENTION_MS = 320;
const MAX_TRAIL_POINTS = 10;
const IDLE_TIMEOUT_MS = 220;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function mixHexColors(source: string, target: string, amount: number): string {
  const normalize = (hex: string): string => {
    const trimmed = hex.replace("#", "");
    if (trimmed.length === 3) {
      return trimmed
        .split("")
        .map((part) => `${part}${part}`)
        .join("");
    }
    return trimmed.length === 6 ? trimmed : "111111";
  };

  const sourceHex = normalize(source);
  const targetHex = normalize(target);
  const ratio = clamp(amount, 0, 1);

  const toRgb = (hex: string, offset: number) =>
    Number.parseInt(hex.slice(offset, offset + 2), 16);

  const red = Math.round(
    toRgb(sourceHex, 0) + (toRgb(targetHex, 0) - toRgb(sourceHex, 0)) * ratio,
  );
  const green = Math.round(
    toRgb(sourceHex, 2) + (toRgb(targetHex, 2) - toRgb(sourceHex, 2)) * ratio,
  );
  const blue = Math.round(
    toRgb(sourceHex, 4) + (toRgb(targetHex, 4) - toRgb(sourceHex, 4)) * ratio,
  );

  return `rgb(${red} ${green} ${blue})`;
}

function getPaletteColor(colors: string[], index: number): string {
  return colors[index % colors.length] ?? "#111111";
}

export function BirdsCursor({
  enabled = false,
  count = 7,
  colors = ["#050505", "#111111", "#1a1a1a"],
  size = 8,
  speedCap = 5.2,
  forces = DEFAULT_FORCES,
  zIndex = 0,
  className = "",
}: BirdsCursorProps): JSX.Element | null {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef<number>();
  const positionsRef = useRef<Float32Array>(new Float32Array(count * 2));
  const velocitiesRef = useRef<Float32Array>(new Float32Array(count * 2));
  const phasesRef = useRef<Float32Array>(new Float32Array(count));
  const activeCountRef = useRef(count);
  const desiredCountRef = useRef(count);
  const palettesRef = useRef<BirdPalette[]>([]);
  const cursorTrailRef = useRef<CursorPoint[]>([]);
  const lastFrameTimeRef = useRef(0);
  const lastPointerMoveRef = useRef(0);
  const lastTargetRef = useRef<{ x: number; y: number } | null>(null);
  const reducedMotionRef = useRef(false);
  const coarsePointerRef = useRef(false);

  const syncPreferences = useCallback(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    coarsePointerRef.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  useEffect(() => {
    desiredCountRef.current = count;
  }, [count]);

  const createPalette = useCallback(
    (index: number): BirdPalette => {
      const base = getPaletteColor(colors, index);

      return {
        body: mixHexColors(base, "#ffffff", 0.03),
        wing: mixHexColors(base, "#ffffff", 0.12),
        tail: mixHexColors(base, "#000000", 0.08),
      };
    },
    [colors],
  );

  const getAnchorPosition = useCallback(() => {
    return (
      lastTargetRef.current ?? {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.18,
      }
    );
  }, []);

  const setBoidState = useCallback(
    (index: number, spawnMode: "seed" | "offscreen") => {
      const positions = positionsRef.current;
      const velocities = velocitiesRef.current;
      const phases = phasesRef.current;
      const palettes = palettesRef.current;
      const baseIndex = index * 2;
      const anchor = getAnchorPosition();

      palettes[index] = createPalette(index);
      phases[index] = Math.random() * Math.PI * 2;

      if (spawnMode === "seed") {
        const xSpread = (Math.random() - 0.5) * window.innerWidth * 0.48;
        const ySpread = (Math.random() - 0.5) * window.innerHeight * 0.22;

        positions[baseIndex] = anchor.x + xSpread;
        positions[baseIndex + 1] = anchor.y + ySpread;
        velocities[baseIndex] = 2.8 + Math.random() * 1.8;
        velocities[baseIndex + 1] = (Math.random() - 0.5) * 2;
        return;
      }

      const spawnMargin = 96;
      const fromLeft = Math.random() > 0.5;
      const startX = fromLeft ? -spawnMargin : window.innerWidth + spawnMargin;
      const startY = clamp(
        anchor.y + (Math.random() - 0.5) * window.innerHeight * 0.2,
        window.innerHeight * 0.08,
        window.innerHeight * 0.72,
      );
      const directionX = anchor.x - startX;
      const directionY = anchor.y - startY;
      const directionLength = Math.hypot(directionX, directionY) || 1;
      const entrySpeed = 3.4 + Math.random() * 1.6;

      positions[baseIndex] = startX;
      positions[baseIndex + 1] = startY;
      velocities[baseIndex] =
        (directionX / directionLength) * entrySpeed + (Math.random() - 0.5) * 0.35;
      velocities[baseIndex + 1] =
        (directionY / directionLength) * entrySpeed + (Math.random() - 0.5) * 0.35;
    },
    [createPalette, getAnchorPosition],
  );

  const initializeBoids = useCallback(
    (nextCount: number) => {
      const anchor = {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.18,
      };

      positionsRef.current = new Float32Array(nextCount * 2);
      velocitiesRef.current = new Float32Array(nextCount * 2);
      phasesRef.current = new Float32Array(nextCount);
      palettesRef.current = [];
      activeCountRef.current = nextCount;
      lastTargetRef.current = anchor;

      for (let index = 0; index < nextCount; index += 1) {
        setBoidState(index, "seed");
      }
    },
    [setBoidState],
  );

  const syncBoidCount = useCallback(
    (nextCount: number) => {
      const currentCount = activeCountRef.current;

      if (nextCount === currentCount) return;

      const nextPositions = new Float32Array(nextCount * 2);
      const nextVelocities = new Float32Array(nextCount * 2);
      const nextPhases = new Float32Array(nextCount);
      nextPositions.set(
        positionsRef.current.subarray(0, Math.min(positionsRef.current.length, nextPositions.length)),
      );
      nextVelocities.set(
        velocitiesRef.current.subarray(
          0,
          Math.min(velocitiesRef.current.length, nextVelocities.length),
        ),
      );
      nextPhases.set(
        phasesRef.current.subarray(0, Math.min(phasesRef.current.length, nextPhases.length)),
      );

      positionsRef.current = nextPositions;
      velocitiesRef.current = nextVelocities;
      phasesRef.current = nextPhases;
      palettesRef.current = palettesRef.current.slice(0, nextCount);
      activeCountRef.current = nextCount;

      for (let index = currentCount; index < nextCount; index += 1) {
        setBoidState(index, "offscreen");
      }
    },
    [setBoidState],
  );

  const updateCursorTrail = useCallback((event: MouseEvent) => {
    const now = performance.now();
    cursorTrailRef.current.push({
      x: event.clientX,
      y: event.clientY,
      t: now,
    });

    cursorTrailRef.current = cursorTrailRef.current.filter(
      (point) => point.t > now - CURSOR_RETENTION_MS,
    );

    if (cursorTrailRef.current.length > MAX_TRAIL_POINTS) {
      cursorTrailRef.current = cursorTrailRef.current.slice(-MAX_TRAIL_POINTS);
    }

    lastPointerMoveRef.current = now;
  }, []);

  const getTargetPosition = useCallback(
    (time: number): { x: number; y: number } => {
      const trail = cursorTrailRef.current;

      if (trail.length > 0) {
        let totalX = 0;
        let totalY = 0;
        let totalWeight = 0;

        for (const point of trail) {
          const age = time - point.t;
          const weight = Math.exp(-age / 90);
          totalX += point.x * weight;
          totalY += point.y * weight;
          totalWeight += weight;
        }

        const target =
          totalWeight > 0
            ? { x: totalX / totalWeight, y: totalY / totalWeight }
            : { x: trail[trail.length - 1]!.x, y: trail[trail.length - 1]!.y };

        lastTargetRef.current = target;
        return target;
      }

      const fallback =
        lastTargetRef.current ?? {
          x: window.innerWidth * 0.5,
          y: window.innerHeight * 0.18,
        };

      if (time - lastPointerMoveRef.current < IDLE_TIMEOUT_MS) {
        return fallback;
      }

      const angle = time * 0.0013;
      return {
        x: fallback.x + Math.cos(angle) * 36,
        y: fallback.y + Math.sin(angle * 1.35) * 20,
      };
    },
    [],
  );

  const applyBoidForces = useCallback(
    (boidIndex: number, target: { x: number; y: number }) => {
      const positions = positionsRef.current;
      const velocities = velocitiesRef.current;
      const baseIndex = boidIndex * 2;
      const boidX = positions[baseIndex] ?? 0;
      const boidY = positions[baseIndex + 1] ?? 0;
      let velocityX = velocities[baseIndex] ?? 0;
      let velocityY = velocities[baseIndex + 1] ?? 0;

      let separationX = 0;
      let separationY = 0;
      let alignmentX = 0;
      let alignmentY = 0;
      let cohesionX = 0;
      let cohesionY = 0;
      let neighbors = 0;

      const flockCount = activeCountRef.current;
      const neighborRadius = 108;

      for (let index = 0; index < flockCount; index += 1) {
        if (index === boidIndex) continue;

        const otherIndex = index * 2;
        const otherX = positions[otherIndex] ?? 0;
        const otherY = positions[otherIndex + 1] ?? 0;
        const deltaX = boidX - otherX;
        const deltaY = boidY - otherY;
        const distanceSquared = deltaX * deltaX + deltaY * deltaY;

        if (
          distanceSquared === 0 ||
          distanceSquared > neighborRadius * neighborRadius
        ) {
          continue;
        }

        const distance = Math.sqrt(distanceSquared);
        neighbors += 1;
        separationX += deltaX / distance;
        separationY += deltaY / distance;
        alignmentX += velocities[otherIndex] ?? 0;
        alignmentY += velocities[otherIndex + 1] ?? 0;
        cohesionX += otherX;
        cohesionY += otherY;
      }

      if (neighbors > 0) {
        separationX /= neighbors;
        separationY /= neighbors;
        alignmentX /= neighbors;
        alignmentY /= neighbors;
        cohesionX = cohesionX / neighbors - boidX;
        cohesionY = cohesionY / neighbors - boidY;
      }

      const targetX = target.x - boidX;
      const targetY = target.y - boidY;
      const targetDistance = Math.sqrt(targetX * targetX + targetY * targetY);
      const normalizedTargetX = targetDistance > 0 ? targetX / targetDistance : 0;
      const normalizedTargetY = targetDistance > 0 ? targetY / targetDistance : 0;

      velocityX += separationX * forces.separation * 0.12;
      velocityY += separationY * forces.separation * 0.12;
      velocityX += alignmentX * forces.alignment * 0.04;
      velocityY += alignmentY * forces.alignment * 0.04;
      velocityX += cohesionX * forces.cohesion * 0.03;
      velocityY += cohesionY * forces.cohesion * 0.03;
      velocityX += normalizedTargetX * forces.trail * 0.12;
      velocityY += normalizedTargetY * forces.trail * 0.12;

      const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
      if (speed > speedCap) {
        velocityX = (velocityX / speed) * speedCap;
        velocityY = (velocityY / speed) * speedCap;
      }

      velocities[baseIndex] = velocityX;
      velocities[baseIndex + 1] = velocityY;
    },
    [forces, speedCap],
  );

  const updateBoidPositions = useCallback(
    (deltaTime: number) => {
      const positions = positionsRef.current;
      const velocities = velocitiesRef.current;

      const flockCount = activeCountRef.current;

      for (let index = 0; index < flockCount; index += 1) {
        const baseIndex = index * 2;
        let x =
          (positions[baseIndex] ?? 0) +
          (velocities[baseIndex] ?? 0) * deltaTime * 60;
        let y =
          (positions[baseIndex + 1] ?? 0) +
          (velocities[baseIndex + 1] ?? 0) * deltaTime * 60;

        const margin = 72;
        if (x < -margin) x = window.innerWidth + margin;
        if (x > window.innerWidth + margin) x = -margin;
        if (y < -margin) y = window.innerHeight + margin;
        if (y > window.innerHeight + margin) y = -margin;

        positions[baseIndex] = x;
        positions[baseIndex + 1] = y;
      }
    },
    [],
  );

  const drawBird = useCallback(
    (
      context: CanvasRenderingContext2D,
      palette: BirdPalette,
      x: number,
      y: number,
      rotation: number,
      wingFlap: number,
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.shadowColor = "rgba(255,255,255,0.08)";
      context.shadowBlur = 4;
      context.strokeStyle = "rgba(255,255,255,0.08)";
      context.lineWidth = 1;

      context.fillStyle = palette.body;
      context.beginPath();
      context.moveTo(size * 1.15, 0);
      context.lineTo(size * 0.18, -size * 0.28);
      context.lineTo(-size * 0.72, 0);
      context.lineTo(size * 0.18, size * 0.28);
      context.closePath();
      context.fill();
      context.stroke();

      context.fillStyle = palette.wing;
      context.beginPath();
      context.moveTo(size * 0.28, -size * 0.04);
      context.lineTo(-size * 0.1, -size * (1.18 + wingFlap));
      context.lineTo(-size * 1.2, -size * 0.14);
      context.closePath();
      context.fill();
      context.stroke();

      context.globalAlpha = 0.92;
      context.beginPath();
      context.moveTo(size * 0.08, size * 0.08);
      context.lineTo(-size * 0.08, size * (0.82 + wingFlap * 0.42));
      context.lineTo(-size * 0.9, size * 0.16);
      context.closePath();
      context.fill();
      context.stroke();
      context.globalAlpha = 1;

      context.fillStyle = palette.tail;
      context.beginPath();
      context.moveTo(-size * 0.72, 0);
      context.lineTo(-size * 1.34, -size * 0.32);
      context.lineTo(-size * 1.06, -size * 0.04);
      context.lineTo(-size * 1.34, size * 0.32);
      context.closePath();
      context.fill();
      context.stroke();

      context.restore();
    },
    [size],
  );

  const drawBoids = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      const context = contextRef.current;

      if (!canvas || !context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);

      const positions = positionsRef.current;
      const velocities = velocitiesRef.current;
      const palettes = palettesRef.current;
      const phases = phasesRef.current;

      const flockCount = activeCountRef.current;

      for (let index = 0; index < flockCount; index += 1) {
        const baseIndex = index * 2;
        const velocityX = velocities[baseIndex] ?? 0;
        const velocityY = velocities[baseIndex + 1] ?? 0;
        const angle = Math.atan2(velocityY, velocityX);
        const wingFlap =
          Math.sin(time * 0.024 + (phases[index] ?? 0) + index * 0.6) * 0.42;

        drawBird(
          context,
          palettes[index] ?? {
            body: "#050505",
            wing: "#151515",
            tail: "#000000",
          },
          positions[baseIndex] ?? 0,
          positions[baseIndex + 1] ?? 0,
          angle,
          wingFlap,
        );
      }
    },
    [drawBird],
  );

  const animate = useCallback(
    (time: number) => {
      if (!enabled || reducedMotionRef.current || coarsePointerRef.current) {
        return;
      }

      const deltaTime = time - lastFrameTimeRef.current;
      lastFrameTimeRef.current = time;

      if (deltaTime > 100) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const target = getTargetPosition(time);

      const flockCount = activeCountRef.current;

      for (let index = 0; index < flockCount; index += 1) {
        applyBoidForces(index, target);
      }

      updateBoidPositions(deltaTime / 1000);
      drawBoids(time);
      rafRef.current = requestAnimationFrame(animate);
    },
    [applyBoidForces, drawBoids, enabled, getTargetPosition, updateBoidPositions],
  );

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    contextRef.current = context;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.imageSmoothingEnabled = true;
  }, []);

  const stopAnimation = useCallback(() => {
    if (!rafRef.current) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = undefined;
  }, []);

  const startAnimation = useCallback(() => {
    stopAnimation();
    initializeBoids(desiredCountRef.current);
    lastFrameTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);
  }, [animate, initializeBoids, stopAnimation]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    syncPreferences();

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const resync = () => syncPreferences();

    reducedMotionQuery.addEventListener("change", resync);
    coarsePointerQuery.addEventListener("change", resync);

    return () => {
      reducedMotionQuery.removeEventListener("change", resync);
      coarsePointerQuery.removeEventListener("change", resync);
    };
  }, [syncPreferences]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !enabled ||
      reducedMotionRef.current ||
      coarsePointerRef.current
    ) {
      stopAnimation();
      return;
    }

    setupCanvas();
    startAnimation();

    const throttledCursorUpdate = (event: MouseEvent) => {
      const lastCall = (
        throttledCursorUpdate as typeof throttledCursorUpdate & {
          lastCall?: number;
        }
      ).lastCall;

      if (lastCall && performance.now() - lastCall <= 16) {
        return;
      }

      updateCursorTrail(event);
      (
        throttledCursorUpdate as typeof throttledCursorUpdate & {
          lastCall?: number;
        }
      ).lastCall = performance.now();
    };

    const handleResize = () => {
      setupCanvas();
      initializeBoids(activeCountRef.current);
    };

    window.addEventListener("mousemove", throttledCursorUpdate, {
      passive: true,
    });
    window.addEventListener("resize", handleResize);

    return () => {
      stopAnimation();
      window.removeEventListener("mousemove", throttledCursorUpdate);
      window.removeEventListener("resize", handleResize);
    };
  }, [enabled, initializeBoids, setupCanvas, startAnimation, stopAnimation, updateCursorTrail]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !enabled ||
      reducedMotionRef.current ||
      coarsePointerRef.current
    ) {
      return;
    }

    syncBoidCount(count);
  }, [count, enabled, syncBoidCount]);

  if (!enabled || reducedMotionRef.current || coarsePointerRef.current) {
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
