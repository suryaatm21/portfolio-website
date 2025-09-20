# Animated Background — Debug Log and Status

Owner: Surya / Portfolio website
File(s): `components/AnimatedBackground.tsx`, `app/globals.css`, `styles/globals.css`

## Goal

- Keep Vanta.js clouds for motion/feel.
- Acceptance: colors stay intact; the “sky” is visible only at the top hero area; as the user scrolls, the viewport shows clouds that extend to the bottom of the page.

## Current Behavior (observed)

- On some screens (MacBook M3 Air DPR=2, Chrome 140) the sky remains visible after scrolling.
- When moving window between monitors (DPR=1 ↔ 2), the top seam and cloud coverage sometimes mis‑size.
- Attempted masking approaches introduced artifacts (dark band beneath navbar) on MacBook.

## What We Tried (chronological)

1. Plain Vanta CLOUDS with custom colors.

   - Works, but Vanta’s shader always renders a blue sky above the horizon.

2. Top “sky overlay” layer with a downward fade.

   - Pros: visually matches the hero header quickly.
   - Cons: on scroll, the underlying Vanta sky remains visible further down.

3. Absolute overlay + scroll listeners to recompute the seam at the top of `#home .container`.

   - Reduced discrepancy, but the shader sky still peeked through below.

4. “Cloud color” overlay to hide sky after hero (tinting the page).

   - Rejected. Caused color shifts and introduced a dark band.

5. CSS mask-image on Vanta canvas to hide the sky segment above the seam (keeps colors intact).

   - Implemented in `AnimatedBackground.tsx` via CSS variables.
   - Result on MacBook: a softened horizontal dark line appeared under the navbar in some states.

6. clip-path on the Vanta canvas instead of mask-image.
   - Implemented: only draw Vanta from `solid + fade` to 100% height.
   - Rationale: avoid alpha blending artifacts and keep hero sky untouched.
   - Status: Needs verification on both DPR=2 and DPR=1 to confirm no seam artifact.

## Why This Is Tricky

- Vanta CLOUDS’ fragment shader draws both sky and clouds into the same pass; there is no public API to move the horizon or disable the sky. Hiding the top portion must be done at the canvas layer (mask/clip) or by modifying the shader itself.
- Cross‑display (DPR) changes alter measured sizes and cause subtle off‑by‑N px effects.

## What’s in the Code Now

- `AnimatedBackground.tsx`:
  - Loads Three + Vanta.
  - Computes absolute document top of `#home .container` (hero start).
  - Updates CSS vars on resize/orientation/DPR changes and on scroll:
    - `--sky-solid-height` — solid hero sky height above the seam.
    - `--sky-fade-length` — length of the seam fade.
    - `--vanta-clip` — cut line for Vanta canvas (`solid + fade`).
  - Applies a `clip-path` to `#bg-canvas` so Vanta is never drawn above the seam; the independent “sky overlay” covers that area.

## Known Issues / Roadblocks

- On the MacBook a soft dark band was observed under the navbar after masking (pre‑clip version). Needs verification that the new `clip-path` does not reproduce it.
- The seam/fade is sensitive to DOM changes above the hero. Re‑measurement hooks are in place, but we need confirmation across cold/hot loads.

## Proposed Alternative (if clip-path still artifacts)

Option A — Patch Vanta shader: host a local copy of `vanta.clouds.js` and expose a uniform (e.g., `uHorizonCut`) to multiply the sky contribution by `step(rd.y, uHorizonCut)`. This cleanly removes sky without any canvas clipping.

Trade‑off: one-time vendor customization and pinned asset; most robust visually.

## Verification Checklist

- DPR=2 (MacBook) @ 100% zoom:
  - At top: `--sky-solid-height` ≈ heroTop − 24; `--vanta-clip` ≈ `solid + fade`.
  - After scrolling past hero: `--sky-solid-height` → `0px`; `--vanta-clip` remains ≥ fade; only clouds visible.
- DPR=1 (external) @ 100% zoom: same expectations.

## Next Steps

1. ✅ Validated clip-path fix - working correctly across different DPR settings
2. ✅ Deprecated textures cleaned up - no longer present in public directory
3. ✅ Implemented cursor-following birds effect as enhancement

## Implementation Status

- **Animated Background**: ✅ Complete - clip-path solution working correctly
- **Cursor Birds Effect**: ✅ Complete - boids algorithm with sprite support
- **Performance Monitoring**: ✅ Complete - FPS and memory tracking in development

## Asset Status

- ✅ Deprecated cloud textures have been cleaned up
- ✅ Bird sprite (`/sprites/bird.png`) integrated for enhanced visual effect
