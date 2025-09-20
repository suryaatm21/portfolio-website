# Cursor-Following Birds — Implementation Plan

Goal: Add an optional, performant, accessible effect where a small flock of “birds” follows the user’s cursor path.

UX and Constraints

- Delightful but subtle by default. No obstruction of content or interactivity.
- Disable automatically for `prefers-reduced-motion: reduce` and on low‑end/mobile devices.
- Never blocks clicks/scroll or text selection.
- Works across DPR=1 and DPR=2 at 60fps on typical machines.

High-Level Approach

1. Dedicated overlay canvas (`position: fixed; inset: 0; pointer-events: none; z-index` above Vanta, below content).
2. Render a flock using a light “boids” variant (separation, alignment, cohesion) with an additional “seek cursor trail” force.
3. Represent birds as:
   - Phase 1: simple triangles or circles (Canvas 2D paths) tinted using Tailwind brand colors.
   - Phase 2 (optional): sprite sheet or tiny SVG path for a bird silhouette.
4. Cursor trail: keep a short queue of recent cursor points with exponential decay; birds seek the average of recent points to create a smooth follow illusion.
5. Performance: single `requestAnimationFrame` loop, no React re-renders during animation; typed arrays and pooled objects; skip frames when tab is hidden.

Public API (via ref on the canvas component)

- `start()`, `stop()`, `setEnabled(bool)`, `setCount(n)`, `setColors(palette)`, `setIntensity({sep, ali, coh, trail})`.

Component Layout

- `components/FX/BirdsCursor.tsx`
  - Mounts a fixed canvas.
  - Hooks:
    - `useEffect` for RAF loop and resize handling (recreate buffers on DPR change).
    - `useEffect` for pointer capture on `window` with throttling.
  - Props:
    - `enabled` (default false), `count` (default 12), `color` array, `size` (px), `speedCap`, `forces` object, `zIndex` (between Vanta and content).

Core Algorithm (boids-lite)

- For each bird i:
  - `v += w_sep * separate(i) + w_ali * align(i) + w_coh * cohesion(i) + w_trail * seek(cursorAvg)`
  - Clamp magnitude to `speedCap`.
  - `pos += v * dt` with screen wrapping (or soft bounce) to keep birds on-screen.
  - Rotate triangle to face velocity.

Edge Cases / A11y

- `prefers-reduced-motion`: don’t start; expose a toggle in “Theme/FX” if desired.
- Mobile: disable by default (enable only when `pointer` is `fine`).
- Pause when scrolling fast (optional): reduce forces when `scrollY` velocity > threshold.

Performance Considerations

- Use `devicePixelRatio` for crispness; clamp backing store size to reasonable max.
- Use pooled arrays: `Float32Array` for positions/velocities.
- Minimize path operations: batched drawing per frame; no gradients; keep shapes simple.

Testing Plan

- FPS watch (DevTools Performance) on MacBook DPR=2 and external DPR=1.
- Memory profile for >1 minute; ensure no leaks.
- Toggle tests for reduced motion and mobile emulation.

## Implementation Status ✅

**Rollout Plan**

1. ✅ Component shipped with development-mode feature flag
2. ✅ Default off in production; enabled in development for testing
3. ✅ Tuned to 6 birds with optimized force parameters

**Completed Milestones**

1. ✅ Scaffold component + canvas + RAF loop
2. ✅ Implement boids forces + cursor trail with exponential decay
3. ✅ Styling + palette + config surface with brand colors
4. ✅ Performance polish, DPR listeners, reduced‑motion detection
5. ✅ QA setup with performance monitor, mobile/accessibility checks

**Features Implemented**

- ✅ Boids algorithm (separation, alignment, cohesion, cursor trail)
- ✅ Sprite support with color tinting
- ✅ Performance optimization with typed arrays
- ✅ Accessibility: respects prefers-reduced-motion
- ✅ Mobile detection: disabled on touch devices
- ✅ DPR scaling for crisp rendering
- ✅ Performance monitoring in development

Pseudo-code

```ts
// BirdsCursor.tsx (outline)
const BirdsCursor = ({ enabled = false, count = 12, ...opts }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const pos = useRef(new Float32Array(count * 2));
  const vel = useRef(new Float32Array(count * 2));
  const trail = useRef([{ x: 0, y: 0, t: 0 }]);

  const onPointer = throttle(
    (e) =>
      trail.current.push({ x: e.clientX, y: e.clientY, t: performance.now() }),
    16
  );

  const step = (t: number) => {
    // compute cursor avg from decayed recent points
    const target = avgRecent(trail.current, 350 /*ms*/);
    // update boids
    for (let i = 0; i < count; i++) {
      applyForces(i, target);
      integrate(i);
    }
    draw(canvasRef.current, pos.current, vel.current);
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (!enabled || prefersReducedMotion) return;
    startRAF();
    addListeners();
    return cleanup;
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[var(--birds-z,5)]"
    />
  );
};
```
