"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface PerformanceStats {
  fps: number;
  memory: number;
  drawCalls: number;
  timestamp: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  sampleInterval?: number;
  className?: string;
}

/**
 * Performance Monitor for FX Components
 *
 * Tracks FPS, memory usage, and other performance metrics
 * for debugging and optimization of canvas-based effects.
 */
export function PerformanceMonitor({
  enabled = process.env.NODE_ENV === "development",
  sampleInterval = 1000,
  className = "",
}: PerformanceMonitorProps) {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    memory: 0,
    drawCalls: 0,
    timestamp: 0,
  });

  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const rafRef = useRef<number>();

  const measurePerformance = useCallback(() => {
    const now = performance.now();
    frameCountRef.current++;

    // Update stats every sample interval
    if (now - lastTimeRef.current >= sampleInterval) {
      const fps = Math.round(
        (frameCountRef.current * 1000) / (now - lastTimeRef.current),
      );

      // Memory usage (if available)
      const memory = (performance as any).memory
        ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
        : 0;

      setStats({
        fps,
        memory,
        drawCalls: frameCountRef.current,
        timestamp: now,
      });

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    if (enabled) {
      rafRef.current = requestAnimationFrame(measurePerformance);
    }
  }, [enabled, sampleInterval]);

  useEffect(() => {
    if (enabled) {
      lastTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(measurePerformance);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, sampleInterval, measurePerformance]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      className={`fixed top-20 right-4 bg-black/80 text-white text-xs p-3 rounded-lg font-mono z-50 ${className}`}>
      <div className="space-y-1">
        <div className="text-green-400 font-semibold">Performance Monitor</div>
        <div className="flex justify-between gap-4">
          <span>FPS:</span>
          <span
            className={
              stats.fps < 30
                ? "text-red-400"
                : stats.fps < 50
                  ? "text-yellow-400"
                  : "text-green-400"
            }>
            {stats.fps}
          </span>
        </div>
        {stats.memory > 0 && (
          <div className="flex justify-between gap-4">
            <span>Memory:</span>
            <span
              className={
                stats.memory > 100
                  ? "text-red-400"
                  : stats.memory > 50
                    ? "text-yellow-400"
                    : "text-green-400"
              }>
              {stats.memory}MB
            </span>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <span>DPR:</span>
          <span>{window.devicePixelRatio || 1}</span>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          {new Date(stats.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
