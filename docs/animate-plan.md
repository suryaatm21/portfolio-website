# Animation Implementation Plan

- Output path: docs/animate-plan.md
- Scope: Planning document only (no production code)
- Repo: portfolio-website (package: my-v0-project)
- Author: Codex (Plan generated for Sonnet)
- Date: 2025-09-27

## Repo Scan Findings

- **Framework & Build**: Next.js 15.5 App Router (`app/`), React 18, TypeScript. `app/page.tsx` is a client component bundling multiple sections; `next.config.mjs` disables TypeScript/ESLint enforcement. Tailwind CSS 4 pipeline via `@tailwindcss/postcss` and CSS custom properties (`app/globals.css`); shadcn-style UI primitives in `components/ui`.
- **Existing Motion Footprint**: `framer-motion` powers hero, navigation, timelines, carousels, and form animations across `components/Hero.tsx`, `NavBar.tsx`, `HorizontalTimeline.tsx`, `ProjectCarousel.tsx`, `AnimatedHobbies.tsx`, etc. GSAP + `ScrollTrigger` drives the cylindrical coursework effect (`components/ReferenceCoursework.tsx`) and `components/CylindricalText.tsx`. `components/AnimatedBackground.tsx` loads Vanta Clouds + three.js from CDN. `lenis` and `pixi.js` dependencies exist but are unused. No shared motion tokens or provider.
- **Key Touchpoints**: Hero (parallax headshot, CTA reveals), fixed NavBar, resources grid, HorizontalTimeline with auto-advance, 3D ProjectCarousel, AnimatedHobbies swapping content, ExperienceStepper, ContactForm validation micro-interactions, FX toggles (`components/FX/FXMounts.tsx`) for birds/perf monitor.
- **Client/Server Boundaries**: Many `'use client'` components for presentational sections (`Section.tsx`, wrappers) due to scroll/DOM usage. Root layout remains server-rendered; `AnimatedBackground` instantiates on client after provider. No data fetching beyond static `content/site.ts`. Dynamic imports guard optional FX but not GSAP.
- **Performance Notes**: No stored LCP/CLS/INP baselines or bundle analyzer output. Dual stacks (Framer + GSAP) increase bundle size; Vanta pulls external scripts per view. `ProjectCarousel` listens to resize/keydown/wheel events; HorizontalTimeline auto-advances every 8s. Entire home page hydrates at once, increasing main-thread cost. Tree-shaking for animation libs not tuned.
- **Accessibility Posture**: `SkipToContent` exists; headings mostly semantic. `prefers-reduced-motion` handled ad-hoc (`Hero`, `AnimatedBackground`) but not globally enforced. ScrollTrigger sequences lack reduced-motion fallback. Focus management for future route transitions not in place; pinned sections risk trapping keyboard users.

## 1) TL;DR

Adopt a hybrid Motion One + GSAP approach: Motion One (`@motionone/react` and DOM helpers) will replace scattered Framer usage for component-level reveals, micro-interactions, and tokenized motion primitives, while GSAP + ScrollTrigger remains the tool for long-form scroll experiences (cylindrical coursework, kinetic hero) through a shared helper. Centralize tokens and gating under a `MotionProvider`, ship opt-in animation components (`<TextReveal>`, `<ScrollSection>`, `<ParallaxBlock>`), and enforce prefers-reduced-motion plus SSR-safe splitting so Sonnet can implement tasteful motion without regressions.

Key risks: migrating off Framer across dense client components could regress existing flows; overusing ScrollTrigger or pinning within the App Router may cause layout desync and jank; Vanta background plus new timelines could blow bundle/performance budgets. Mitigations: stage migrations per section with visual regression captures and Storybook fixtures, encapsulate ScrollTrigger usage in a provider-managed hook with cleanup and reduced-motion fallbacks, and lazy-load heavy effects (Vanta/GSAP plugins) behind feature flags with perf monitoring in CI.

**Acceptance Criteria:**

- Plan specifies Motion One + GSAP as the primary stack with rationale tied to current code.
- Three explicit risks are named alongside concrete mitigations referencing repo components.
- TL;DR limited to two short paragraphs.

## 2) Decision Matrix (Planning-grade)

| Stack                   | bundle footprint (approx min+gzip)                             | tree-shaking                            | learning curve                                         | SSR/hydration friendliness                             | types                        | scroll-trigger support                                                 | text-split ergonomics                                     | timelines/sequencing power                                   | plugin ecosystem                       | license/cost                              | maturity/community                            | React/Next integration quality                           | SVG features                                     | a11y helpers  | perf with many small animations             | DX                            |
| ----------------------- | -------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------ | ---------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------- | ----------------------------------------- | --------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------ | ------------- | ------------------------------------------- | ----------------------------- |
| Motion One              | ~4.3 KB core (`@motionone/dom`); ~6 KB with `@motionone/react` | Strong; ESM, tree-shakes by default     | Gentle for CSS/WAAPI users; new mental model vs Framer | High; no side effects until `useEffect`, works in RSC  | Bundled TS types             | None native; pair with IntersectionObserver or ScrollTimeline polyfill | Needs companion splitter utility (`split-type` or custom) | Solid timeline chaining; lacks nested scenes & labels        | Small but growing; web-standards-first | MIT                                       | Backed by Adobe; active but smaller community | Lightweight React hooks; SSR friendly                    | Animates DOM/SVG attributes; basic path support  | None built-in | Excellent via WAAPI                         | Minimal setup, good docs      |
| GSAP (+ScrollTrigger)   | ~68 KB core + ~11 KB ScrollTrigger (tree-shaken)               | Partial; manual module imports required | Moderate; imperative timeline vocabulary               | Medium; client-only, requires guards for hydration     | First-party TS definitions   | Best-in-class pin/scrub, matchMedia support                            | SplitText is paid; needs free alternative integration     | Elite sequencing and nested timelines                        | Huge (morph, physics, observer, etc.)  | Proprietary but $0 under standard license | Very mature, large community                  | React integration via refs/context; SSR-safe with guards | Rich SVG/path utilities                          | None built-in | Good but heavy; watchers can accumulate     | Powerful devtools; imperative |
| anime.js                | ~6.2 KB                                                        | Good; ESM entry point                   | Low-medium; simple keyframe syntax                     | High; no globals, easy cleanup                         | `@types/animejs`             | None; manual observers needed                                          | Manual DOM splitting required                             | Decent timeline chaining, limited controls                   | Small ecosystem                        | MIT                                       | Stable but slower release cadence             | Works via refs; no official React bindings               | Good attribute support, limited advanced helpers | None          | Very fast for micro tweens                  | Simple API, limited tooling   |
| references/mochi-motion | ~18 KB (varies by build)                                       | Moderate; partial tree-shake            | Medium-high; bespoke design DSL                        | Medium; mostly client-side, dynamic import recommended | Partial TS (community stubs) | Sample-level scroll helpers only                                       | No built-in splitting                                     | Timeline DSL inspired by design tools; less granular control | Tiny experimental ecosystem            | Varies (often MIT); verify per asset      | Experimental, slower updates                  | Integration is DIY; docs assume Vite/Solid               | Limited; mostly transform samples                | None          | Light load acceptable; lacks WAAPI fallback | Novel but sparse docs         |

- Motion One caveats: no built-in scroll triggers, requires our own reduced-motion guard, WAAPI fallback needed for legacy browsers.
- GSAP (+ScrollTrigger) caveats: paid SplitText plugin; must manage ScrollTrigger lifecycle to avoid memory leaks; bundle grows if plugins auto-registered.
- anime.js caveats: lacks scroll abstractions, limited timeline tooling for complex orchestrations, needs manual reduced-motion handling.
- references/mochi-motion caveats: reference-grade library with minimal support, DSL diverges from React idioms, small community makes maintenance risky.

**Recommendation:** Primary stack = Motion One (micro-interactions, reveals, transitions) + GSAP limited to scroll-heavy sequences that benefit from ScrollTrigger (existing coursework cylinder, new hero). Optional fallback = Motion One-only implementation if GSAP proves too heavy for bundle budgets; anime.js and mochi-motion remain unsuitable given the repo’s need for advanced scroll orchestration and React/SSR friendliness.

**Acceptance Criteria:**

- Matrix includes all specified columns with concrete data per stack.
- At least two caveats per option are noted.
- Final recommendation states primary choice and fallback referencing repository constraints.

## 3) Architecture & Conventions (Repo-mapped)

- **Proposed folder additions:**
  - `tokens/motion.ts` — export `motionDurations`, `motionDelays`, `motionEasings`, `motionSprings`, `motionZStack`, `routeTransitions`.
  - `lib/motion/engine.ts` — thin wrapper exposing `createMotionController`, `createMotionTimeline`, and `registerGSAPTimeline`.
  - `lib/motion/splitter.ts` — SSR-safe `splitText(node, mode)` and `revertSplit(splitHandle)` helpers returning structured metadata.
  - `lib/motion/scroll-trigger.ts` — `withScrollTrigger({ id, element, options, builder })` factory managing registration/cleanup and reduced-motion skips.
  - `lib/motion/reduced-motion.ts` — server/client utilities to read cookies, `prefers-reduced-motion`, and emit context defaults.
  - `hooks/useInViewMotion.ts` — merges IntersectionObserver thresholds with Motion One play controls.
  - `hooks/useMotionTimeline.ts` — returns memoized `play`, `pause`, `seek` for Motion One/GSAP timelines with tokens.
  - `components/providers/MotionProvider.tsx` — context for tokens, reduced motion state, timeline registry, developer toggle.
  - `components/anim/TextReveal.tsx` — declarative wrapper using `splitter` + Motion One timeline.
  - `components/anim/ScrollSection.tsx` — orchestrates viewport entry/exit, accepts timeline callback.
  - `components/anim/ParallaxBlock.tsx` — transforms based on scroll progress with clamps and reduced-motion fallback.
  - `components/anim/HoverLift.tsx` & friends — reusable micro interaction wrappers built on Motion One.
- **Naming conventions:**
  - Variants: `componentState_variant` (e.g., `heroCta_enter`, `projectCard_hover`); stored as objects in `motionVariants.ts` if necessary.
  - Durations: `motionDurations = { xs: 120, sm: 200, md: 320, lg: 480, xl: 720 }` (ms).
  - Delays: `motionDelays.step = 80` (ms) for stagger increments; `delayLong = 160`.
  - Easings: `motionEasings.standard.{in,out,inOut}`, `motionEasings.emphasized.{inOut}` (cubic-bezier strings); springs keyed by damping ratio.
  - Z layers: `motionZ = { underlay: 0, base: 1, float: 10, overlay: 20, modal: 40 }`.
  - Tokens imported via `import { motionDurations } from '@/tokens/motion'`; no inline magic numbers.
- **No-surprises & SSR policy:**
  - Motion is opt-in: components render static markup unless `enableMotion` context true and `prefers-reduced-motion` not requesting reduce.
  - `MotionProvider` attaches `data-motion="enabled|reduced|off"` to `<body>` for CSS fallbacks.
  - GSAP timelines must be registered through provider; on route change they auto-kill.
  - Hydration guard: `MotionProvider` defers timeline start until `useEffect` and ensures server markup equals client pre-animation state.
  - Avoid animating layout properties; prefer transforms/opacity with `will-change` applied temporarily.

**Acceptance Criteria:**

- Proposed structure lists concrete repo-relative paths and exported utilities.
- Naming conventions cover variants, durations, easings, and z-layers with explicit values.
- Opt-in motion and SSR safety policies are captured, including reduced-motion handling.

## 4) Text Split & Reveal Strategy (Planning only)

- **Requirements:** Support `word`, `char`, `line` modes; zero hydration mismatch; no FOUC; accessible content for screen readers; compatible with strings from `content/site.ts` and future MDX; provide reduced-motion fallback.
- **Approach A – Library-assisted (Motion One + GSAP + split-type):**
  - Install `split-type` (MIT, ~3 KB) and lazy-load inside `TextReveal`.
  - Render server markup as `<span data-split-root>{children}</span>` with intact text.
  - On client `useEffect`, call `const split = new SplitType(root, { types: mode });` and pass resulting `split.elements` into Motion One `timeline` or GSAP timeline via provider.
  - For scroll reveals, wrap timeline creation inside `withScrollTrigger` with `matchMedia` ensuring `prefers-reduced-motion` uses `timeline.seek(1)` or static state.
  - Cleanup: invoke `split.revert()` and `timeline.kill()` in cleanup; detach observers to prevent hydration drift.
- **Approach B – Zero-dependency DOM Range + CSS custom properties:**
  - Server renders `<span data-split-root data-split-mode="word">Text</span>` plus `aria-label` for accessible string.
  - On client, walk text nodes, use `document.createRange().surroundContents()` to wrap tokens `<span data-split-idx="0">`.
  - Apply CSS `[data-split-idx]{ display:inline-block; transform:translateY(var(--reveal-offset, 0.75em)); opacity:0; transition: transform var(--duration) var(--easing), opacity var(--duration); }`.
  - Motion One animates `opacity` and `transform` using tokens; for reduced motion, set CSS `--reveal-offset:0` and `opacity:1` without animation.
  - For MDX content, detect nested elements and fallback to word split to avoid broken markup.
- **Component interface:**

```ts
export type TextRevealProps = {
  as?: keyof JSX.IntrinsicElements | React.ComponentType;
  mode?: "word" | "char" | "line";
  stagger?: keyof typeof motionDelays | number;
  easing?:
    | keyof typeof motionEasings.standard
    | `spring:${keyof typeof motionSprings}`;
  viewport?: { once?: boolean; margin?: string; amount?: number };
  initialDelay?: keyof typeof motionDelays | number;
  className?: string;
  onReveal?: (payload: { id: string; completedAt: number }) => void;
  reducedMotionFallback?: "static" | "fade";
  children: React.ReactNode;
};
```

- **Hydration & layout strategy:**
  - `data-split-ready="false"` persists through SSR; CSS hides transitions until toggled true post-hydration.
  - Provide hidden clone for screen readers (`<span aria-hidden="true">` per segment) plus `aria-label` on root for natural reading.
  - Maintain `min-height` via CSS custom property set based on computed line-height to avoid content shift.
  - Integrate with `MotionProvider` to skip splitting when reduced motion or `enableMotion` disabled.
- **Pitfall to avoid:** Triggering `split-type` during render or before refs exist causes hydration mismatch; ensure splitting runs only inside `useEffect` after verifying `root.isConnected`.

**Acceptance Criteria:**

- Two distinct approaches documented with SSR, cleanup, and reduced-motion considerations.
- Component props include mode, stagger, viewport, and fallback behaviors.
- Hydration strategy addresses FOUC prevention and accessibility state.

## 5) Scroll Animations & Sections Plan

- **`<ScrollSection>` interface outline:**

```ts
type ScrollSectionProps = {
  as?: keyof JSX.IntrinsicElements | React.ComponentType;
  id?: string;
  triggerRef?: React.RefObject<HTMLElement>;
  once?: boolean;
  threshold?: number | number[];
  rootMargin?: string;
  onEnter?: (entry: IntersectionObserverEntry) => void;
  onExit?: (entry: IntersectionObserverEntry) => void;
  timeline?: (controls: MotionTimelineControls) => void;
  reduceMotionBehavior?: "static" | "fade" | "instant";
  className?: string;
  children: React.ReactNode;
};
```

- Backed by `useInViewMotion` (IntersectionObserver + `requestAnimationFrame` fallback). Returns `play`, `pause`, `reset`, `setProgress`.
- Accepts `timeline` callback building a Motion One or GSAP timeline via provider; ensures cleanup on unmount or route change.
- **`<ParallaxBlock>` interface outline:**

```ts
type ParallaxBlockProps = {
  axis?: "y" | "x";
  range?: [number, number];
  clamp?: boolean;
  speed?: number;
  viewport?: { start?: string; end?: string };
  reducedMotionBehavior?: "static" | "scale-down";
  layer?: keyof typeof motionZ;
  className?: string;
  children: React.ReactNode;
};
```

- Uses native ScrollTimeline where supported; falls back to `scroll` listener throttled in `requestAnimationFrame`.
- Applies `transform` only; ensures `will-change` removed once idle.
- **Scenario plans:**
  - **Sticky hero with kinetic headline:** Wrap `<Hero>` copy inside `<ScrollSection once threshold=0.6>`; apply GSAP `ScrollTrigger` to pin container 0→120vh, animate headshot parallax (`translateY` ±30px) and text letter-spacing using Motion tokens. Reduced motion: skip pinning, run single TextReveal on mount. Acceptance: hero height stable, no horizontal overflow, static fallback identical to current design.
  - **Staggered resources grid reveal:** Wrap `ResourcesList` grid in `<ScrollSection once threshold=0.4>`; timeline staggers each `ResourceCard` (Motion One `transform: translateY`). Reduced motion: set `opacity:1` instantly. Acceptance: cards reveal within 600ms, no layout shift >0.01.
  - **Image mask wipe for projects:** Use `<ScrollSection>` around project hero art; timeline animates `clip-path: inset()` from `100%` to `0` while adjusting `motionZ`; fallback to opacity fade when browser lacks clip-path support (feature detect). Reduced motion: simple fade at load. Acceptance: GPU timeline, no jank on scroll sample (Chrome CPU profile <3ms).
  - **Gentle parallax rails (ProjectsRail):** Wrap background rails in `<ParallaxBlock axis="y" range={[-40,40]} clamp>`; disable below 768px via `matchMedia`. Reduced motion: static offset 0. Acceptance: scroll remains smooth (ScrollTimeline or rAF watchers count ≤1), no pointer offset drift.
- **Jank prevention & profiling:**
  - Register ScrollTrigger per section via `withScrollTrigger`; use `ScrollTrigger.killAll({ ids: [...] })` during route change.
  - Avoid multiple ScrollTriggers on same element; centralize timeline creation.
  - Use Chrome Performance and `React.Profiler` to validate frame budget after integration.
  - Limit `will-change` usage and release after animation completes.
  - Provide fallback for Safari <16 lacking ScrollTimeline.

**Acceptance Criteria:**

- Interfaces define props for thresholds, once/multi behavior, and reduced-motion fallback.
- Four scenario plans detail steps, success metrics, and reduced-motion handling.
- Jank prevention tactics explicitly mention profiling tools and pitfalls.

## 6) Route/Page Transition Design (Next.js)

- Mount `MotionProvider` in `app/layout.tsx` (inside `<body>` but above `ThemeProvider`) and add `RouteTransitionBoundary` client component that watches `usePathname`/`useRouter` events.
- Use `RouteTransitionBoundary` to apply Motion One timelines specified in `tokens/motion.ts::routeTransitions`. Wrap `children` in `<div data-route-transition>` to scope animations.
- Provide progress indicator `<RouteProgressBar>` anchored at top; animate width via Motion One, fallback to color fade for reduced motion.
- Ensure focus restoration: when transition completes, call `focus()` on `main` heading (`document.querySelector('main h1, main h2')`), fallback to skip link.
- Reduced motion: `RouteTransitionBoundary` checks context flag; if true, skip animations, fall back to instant content swap, ensure progress bar hidden.
- Manage Suspense: use `useTransition` to delay exit until new route ready. Avoid blocking pointer events longer than 150ms; set `pointer-events: none` only during actual transition frames.
- Provide per-transition presets stored alongside tokens:

```ts
type RouteTransitionPreset = {
  name: "fade" | "slide" | "crossfade";
  duration: keyof typeof motionDurations;
  easing: keyof typeof motionEasings.standard;
  enter: MotionKeyframeDefinition;
  exit: MotionKeyframeDefinition;
  reducedMotion?: "skip" | MotionKeyframeDefinition;
};
```

**Acceptance Criteria:**

- Placement of transition wrappers in current layout hierarchy is specified.
- Focus restoration, progress indicator, and reduced-motion behavior are accounted for.
- Preset interface defined without implementation details.

## 7) Micro-interactions Catalog (Spec-level)

- **Hover Lift** (`<HoverLift>` wrapper or `motionVariant="hoverLift"`):
  - Purpose: responsive elevation on cards (`ResourceCard`, `ProjectCard`, `AcademicBackgroundCard`).
  - Trigger: pointer enter/leave & focus-visible; states: `rest`, `hover`, `active`.
  - Props: `{ elevation?: number (default 12); shadow?: 'soft'|'medium'|'strong'; reducedMotionBehavior?: 'static'; }`.
  - Acceptance: translates ≤ 16px on Z; keyboard focus triggers same as hover; resets instantly when pointer leaves; respects reduced motion.
- **Press Ripple** (optional for `Button` variants):
  - Purpose: tactile feedback on CTA buttons.
  - Trigger: pointer down/up, keyboard activation.
  - Props: `{ color?: string; radius?: 'auto'|number; duration?: keyof typeof motionDurations; }`.
  - Acceptance: ripple DOM node destroyed after animation; reduced motion uses opacity flash; passes accessibility (no extra tab stop).
- **Button Shimmer**:
  - Purpose: highlight hero CTA after dwell time.
  - Trigger: idle timer (e.g., 4s) or viewport entry.
  - Props: `{ interval?: number; intensity?: 'subtle'|'medium'; }`.
  - Acceptance: CPU usage <1ms per frame; disabled when button `disabled`; reduced motion disables shimmer.
- **Card Tilt**:
  - Purpose: subtle perspective on cards such as `ProjectCarousel` slides.
  - Trigger: pointer move within component; states: `rest`, `tilt`.
  - Props: `{ maxTilt?: number; perspective?: number; spring?: keyof typeof motionSprings; clamp?: boolean; }`.
  - Safety: disable on touch devices and when reduced motion; fallback to `Hover Lift`.
- **Accordion Open/Close** (for Radix accordion, ExperienceStepper):
  - Trigger: open state change.
  - Props: `{ duration?: keyof typeof motionDurations; easing?: keyof typeof motionEasings; }`.
  - Acceptance: uses height auto measurement via Motion One's `animate` of CSS variables; no layout thrash; reduced motion snaps open.
- **Modal Mount/Unmount** (`Dialog`, `AlertDialog`):
  - Purpose: polished overlay transitions for `ContactForm` modals (if added).
  - Props: `{ overlayPreset?: 'fade'|'blur'; dialogPreset?: 'pop'|'slide-up'; duration?: keyof typeof motionDurations; }`.
  - Acceptance: overlay and dialog animate in sync; focus trap unaffected; reduced motion => simple fade.

**Acceptance Criteria:**

- Each primitive includes purpose, triggers, states, key props, and reduced-motion handling.
- Safety or guardrails (tilt limits, touch disable) are noted.
- Acceptance expectations are provided per primitive.

## 8) Performance Playbook & Budgets

- **Budgets:**
  - ≤ 40 KB gzipped additional animation code across shared chunks after migration.
  - Route transition timeline execution ≤ 150 ms blocking time per navigation.
  - Scroll-trigger callbacks limited to ≤ 1 active handler per section; each callback ≤ 3 ms.
  - `AnimatedBackground` optional; when enabled, maintain FPS ≥ 50 on mid-tier laptop and provide toggle to disable under reduced motion.
  - Input responsiveness (INP) target ≤ 200 ms with animations active.
- **Techniques:**
  - Tree-shake GSAP by importing `gsap/all` alternatives: `import { gsap } from 'gsap'; import ScrollTrigger from 'gsap/ScrollTrigger';` and registering explicitly.
  - Lazy-load heavy effects via `dynamic(() => import('./Component'), { ssr:false, loading: Skeleton })`.
  - Use `requestIdleCallback` to prepare text splitting for below-the-fold sections.
  - Batch Motion One updates with shared `timeline` per group; avoid per-card `useEffect` loops.
  - Limit `will-change` to active frames and remove in cleanup to prevent memory pressure.
  - Evaluate removing Framer-motion once replacements ship to reduce bundle size.
- **Tooling & checks:**
  - Add `pnpm analyze:bundle` script (`ANALYZE=1 next build`) and publish artifacts in CI.
  - Lighthouse CI config with thresholds: Desktop LCP ≤ 2.0s, CLS ≤ 0.05, INP ≤ 200ms.
  - Chrome Performance recordings for hero scroll and timeline interactions each release; capture CPU profile.
  - React Profiler snapshots targeting `ProjectCarousel`, `HorizontalTimeline`, `AnimatedBackground`.
  - Integration tests toggling `prefers-reduced-motion` to ensure animations skip gracefully.
- **Pitfalls to avoid:** Animating layout properties (`top`, `width`, `height`), stacking multiple ScrollTriggers on the same element, leaving Vanta scripts active on route transitions without teardown.

**Acceptance Criteria:**

- Quantitative budgets specified with numeric targets.
- Performance techniques mapped to concrete commands/tools.
- Pitfalls explicitly listed alongside avoidance tactics.

## 9) Accessibility & UX Guardrails

- **Checklist:**
  - `MotionProvider` exposes `isReducedMotion` context and applies `data-motion` attribute so CSS can disable transitions globally.
  - Text reveals maintain readability: ensure `opacity` never below 0.5 when text needed for comprehension; lighten backgrounds if necessary.
  - Focus order preserved; do not reorder DOM nodes for visual effects.
  - Provide fallback assets for animated backgrounds (static image) and disable Vanta under reduced motion or on mobile.
  - Avoid extreme motion: parallax limited to ±40px, rotation ≤ 10°, timeline durations ≥ 200ms to prevent flash.
  - Keyboard parity: hover interactions mirrored on `:focus-visible`; ripples triggered via Enter/Space.
  - Add `aria-live="polite"` to timeline status text so auto-advancing content announces politely without duplication.
- **QA protocols:**
  - Runtime toggle: query param `?motion=off` or developer toolbar button toggles reduced-motion context for manual QA.
  - Keyboard-only walkthrough from hero CTAs to contact form verifying focus indicator persists and animations do not block.
  - Screen reader testing (NVDA & VoiceOver) ensuring `TextReveal` does not duplicate spoken content (use `aria-hidden`).
  - Automated `axe` scans executed with animations enabled/disabled.
  - Document manual QA steps in `docs/animation-handbook.md`.

**Acceptance Criteria:**

- Checklist covers reduced motion, focus management, readability, and safe motion boundaries.
- QA protocol outlines runtime toggle, keyboard journey, and screen reader validation.

## 10) Implementation Plan & Milestones (for Sonnet & Codex)

- **Week 1 – Foundations:**
  - Ship motion tokens (`tokens/motion.ts`), provider, and engine wrappers.
  - Integrate reduced-motion context; update `app/layout.tsx` to mount provider and expose feature flags.
  - Build `TextReveal` with both splitting strategies; replace hero heading/tagline as pilot.
  - Add bundle analyzer script and capture baseline Lighthouse metrics.
- **Week 2 – Section rollout:**
  - Refactor `NavBar`, `ResourcesList`, `ResourceCard`, `AcademicBackgroundCard`, and CTA buttons to use new micro-interactions.
  - Implement `ScrollSection`/`ParallaxBlock` for hero, resources, and timeline sections; migrate existing ScrollTrigger code to shared helper.
  - Update `ProjectCarousel`, `HorizontalTimeline`, `AnimatedHobbies`, `ExperienceStepper` to use Motion tokens and reduced-motion gating.
  - Prototype route transitions (fade, slide) behind `NEXT_PUBLIC_ENABLE_ROUTE_MOTION` feature flag.
- **Week 3 – Polish & hardening:**
  - Complete micro-interactions (ripple, tilt, accordion) and document usage.
  - Optimize `AnimatedBackground` (lazy-load scripts, reduced-motion fallback, feature flag).
  - Run performance and accessibility audits; fix any budget regressions.
  - Author documentation (`docs/animation-handbook.md`), QA checklist, and create Storybook/preview demos if available.
- **Risk register:**
  - Hydration mismatch from text splitting → guard with server markers + Jest snapshot tests comparing server/client markup.
  - ScrollTrigger fragility inside nested containers → centralize scroller config, avoid overflow hidden wrappers, use pinned prototypes in dev.
  - Content shifts due to reveal animations → pre-allocate height using CSS custom properties, test with Playwright screenshot diffs.
  - Paid plugin risk (SplitText) → rely on `split-type`; document fallback to zero-dependency solution.
  - Heavy timelines on low-end devices → provide runtime toggle, run throttled CPU tests, degrade to static when `requestIdleCallback` not available.
- **Rollback & feature flags:**
  - Global `enableMotion` flag in provider to disable all animations quickly.
  - Keep Framer-motion components behind `MOTION_LEGACY=true` until replacements stable; allow fallback.
  - Provide CLI script/ENV to disable GSAP integrations if budgets exceeded; ensure tests run with motion disabled.

**Acceptance Criteria:**

- Week-by-week breakdown lists concrete tasks tied to repo components.
- Risk register includes five risks with mitigations referencing repo realities.
- Rollback strategy explains feature flags and fallback behaviors.

## 11) Repo-Mapped Change List (No Code, Just Diffs/Tasks)

- **Path:** `tokens/motion.ts`
  - Purpose: centralize durations, easings, delays, z-stack, route transitions.
  - Interfaces/props: `export type MotionDurationScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl';`
  - Dependencies: none.
  - Estimated complexity: S.
  - Test/acceptance criteria: unit test ensuring token maps exist; imported in provider without circular deps.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `lib/motion/engine.ts`
  - Purpose: unify Motion One/GSAP timeline creation and cleanup.
  - Interfaces: `export type MotionController = { play(): void; pause(): void; seek(progress: number): void; stop(): void; };`
  - Dependencies: `@motionone/dom`, `gsap/ScrollTrigger`.
  - Complexity: M.
  - Tests: integration test verifying timeline cleanup on unmount; ensures reduced motion returns static state.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `lib/motion/splitter.ts`
  - Purpose: SSR-safe text splitting utilities (library + zero-dependency).
  - Interfaces: `export type SplitResult = { nodes: HTMLElement[]; revert(): void; };`
  - Dependencies: optional `split-type` (lazy loaded).
  - Complexity: M.
  - Tests: Jest DOM test verifying split/revert leaves DOM untouched.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `lib/motion/scroll-trigger.ts`
  - Purpose: centralize ScrollTrigger registration, matchMedia, cleanup.
  - Interfaces: `export function withScrollTrigger({ id, element, options, buildTimeline }: { id: string; element: HTMLElement; options: ScrollTrigger.Vars; buildTimeline: (gsap: GSAP) => GSAPTimeline; }): () => void;`
  - Dependencies: `gsap`, `ScrollTrigger`.
  - Complexity: M.
  - Tests: manual QA + unit verifying cleanup called; run in reduced-motion to ensure skip.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `lib/motion/reduced-motion.ts`
  - Purpose: detect and persist reduced-motion preference (cookies/localStorage).
  - Interfaces: `export function getInitialReducedMotion(req?: Request): 'reduce' | 'no-preference';`
  - Dependencies: none.
  - Complexity: S.
  - Tests: unit tests mocking window.matchMedia; ensures SSR default matches.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `hooks/useInViewMotion.ts`
  - Purpose: IntersectionObserver hook returning motion controls.
  - Interfaces: `export function useInViewMotion(options: UseInViewOptions): { ref: RefCallback<Element>; inView: boolean; play(): void; pause(): void; };`
  - Dependencies: `motionDurations`, `IntersectionObserver`.
  - Complexity: M.
  - Tests: React Testing Library verifying play triggers when threshold crossed.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `hooks/useMotionTimeline.ts`
  - Purpose: Abstraction to create Motion One timelines with tokens.
  - Interfaces: `export function useMotionTimeline(factory: () => MotionTimelineControls, deps: DependencyList): MotionTimelineControls;`
  - Dependencies: `@motionone/dom`.
  - Complexity: S.
  - Tests: ensures cleanup on component unmount.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/providers/MotionProvider.tsx`
  - Purpose: context delivering tokens, reduced motion, feature flags.
  - Props: `type MotionProviderProps = { enableMotion?: boolean; children: React.ReactNode; };`
  - Dependencies: tokens, hooks, `useServerInsertedHTML` if required.
  - Complexity: M.
  - Tests: React testing verifying context values; toggling reduced motion updates body attribute.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/anim/TextReveal.tsx`
  - Purpose: high-level text splitting + reveal animation component.
  - Props: `TextRevealProps` from Section 4.
  - Dependencies: `MotionProvider`, `lib/motion/splitter`, Motion One.
  - Complexity: M.
  - Tests: Visual regression (Storybook), DOM snapshot ensuring no extra nodes when reduced motion.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/anim/ScrollSection.tsx`
  - Purpose: orchestrate viewport-based animations.
  - Props: `ScrollSectionProps` from Section 5.
  - Dependencies: `useInViewMotion`, `MotionProvider`.
  - Complexity: M.
  - Tests: Integration test verifying once/multi behavior; ensures timeline cleanup.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/anim/ParallaxBlock.tsx`
  - Purpose: encapsulate parallax transforms with clamps.
  - Props: `ParallaxBlockProps` from Section 5.
  - Dependencies: `ScrollTimeline` polyfill (optional), Motion tokens.
  - Complexity: M.
  - Tests: jest-dom verifying transform changes with scroll; reduced motion static.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/anim/HoverLift.tsx`
  - Purpose: reusable hover/focus elevation wrapper.
  - Props: `{ elevation?: number; shadow?: 'soft'|'medium'|'strong'; asChild?: boolean; }`
  - Dependencies: Motion One.
  - Complexity: S.
  - Tests: ensures focus triggers same animation; reduced motion static.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `app/layout.tsx`
  - Purpose: mount `MotionProvider`, attach route transition boundary, set body data attributes.
  - Interfaces: n/a (existing default export).
  - Dependencies: `MotionProvider`, `RouteTransitionBoundary`.
  - Complexity: S.
  - Tests: unit verifying provider renders; hydration warnings absent.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `app/page.tsx`
  - Purpose: refactor to reduce `'use client'` scope; delegate to server components where possible and mount motion wrappers per section.
  - Interfaces: create server component `HomePage` or split sections.
  - Dependencies: `ScrollSection`, `TextReveal`.
  - Complexity: M.
  - Tests: ensure static rendering works without motion; e2e verifying anchor navigation unaffected.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/Hero.tsx`
  - Purpose: migrate to Motion One + ScrollSection, integrate TextReveal and parallax.
  - Props: existing `Hero` remains; optionally accept `enableScrollKinetics?: boolean`.
  - Dependencies: `TextReveal`, `ParallaxBlock`, `HoverLift`.
  - Complexity: L.
  - Tests: Storybook/visual diff; ensures reduced motion static.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/NavBar.tsx`
  - Purpose: replace Framer animations with Motion One hover/fade; integrate route transition feedback.
  - Props: may accept `activeSection` etc.
  - Dependencies: `HoverLift`, `MotionProvider`.
  - Complexity: M.
  - Tests: keyboard nav ensures highlight works; reduced motion static.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/Section.tsx`
  - Purpose: remove `'use client'` if unnecessary; optionally wrap with `ScrollSection`.
  - Props: existing; add `motion?: boolean`.
  - Dependencies: `ScrollSection`.
  - Complexity: S.
  - Tests: ensures server render unaffected; motion optional.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/ResourcesList.tsx` & `components/ResourceCard.tsx`
  - Purpose: apply `ScrollSection` + `HoverLift`, restructure to server-friendly when static.
  - Props: maintain existing; add `motionVariant?: MotionVariantKey`.
  - Dependencies: `HoverLift`, `TextReveal`.
  - Complexity: M.
  - Tests: verify grid reveals only once; reduced motion static.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/HorizontalTimeline.tsx`
  - Purpose: migrate from Framer to shared timeline, integrate ScrollSection, ensure auto-advance respects reduced motion.
  - Interfaces: may expose `onEntryChange`.
  - Dependencies: `ScrollSection`, `withScrollTrigger`, Motion tokens.
  - Complexity: L.
  - Tests: e2e verifying keyboard navigation, reduced motion stops auto-advance.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/ProjectCarousel.tsx` & `components/ProjectCard.tsx`
  - Purpose: replace Framer animations with Motion One, integrate tilt micro interaction with safety clamps.
  - Interfaces: optional `motionPreset?: '3d'|'flat'`.
  - Dependencies: `HoverLift`, Motion tokens.
  - Complexity: L.
  - Tests: ensures carousel accessible; reduced motion static.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/AnimatedHobbies.tsx` & `components/AnimatedHobbiesCard.tsx`
  - Purpose: swap Framer presence with Motion One, ensure interval respects reduced motion (pause).
  - Props: add `intervalMs?: number; pauseOnHover?: boolean`.
  - Dependencies: Motion tokens.
  - Complexity: M.
  - Tests: ensures reduced motion stops auto-rotation; maintain ARIA.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/ExperienceStepper.tsx`
  - Purpose: align with ScrollSection, animate steps via Motion tokens.
  - Dependencies: `ScrollSection`, `HoverLift`.
  - Complexity: M.
  - Tests: ensures step expands accessible; reduced motion static.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/AnimatedBackground.tsx`
  - Purpose: feature flag Vanta, integrate reduced motion, ensure cleanup, optionally lazy-load modules.
  - Interfaces: add `enable?: boolean`.
  - Dependencies: Motion provider (to read reduced motion), dynamic imports.
  - Complexity: M.
  - Tests: ensures background disabled when reduced motion; script cleanup on unmount.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/ReferenceCoursework.tsx`
  - Purpose: refactor GSAP usage through `withScrollTrigger`, add reduced motion skip, ensure SSR guard.
  - Interfaces: preserve existing props.
  - Dependencies: `withScrollTrigger`, tokens.
  - Complexity: M.
  - Tests: ensures timeline killed on unmount; reduced motion static list.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `components/CylindricalText.tsx`
  - Purpose: same as above; integrate tokens, reduce ScrollTrigger dependencies.
  - Complexity: M.
  - Tests: ensures rotation stops in reduced motion; timeline cleanup.
  - Owner & status: Owner: Sonnet | Status: ☐ Not started.
- **Path:** `docs/animation-handbook.md` (new)
  - Purpose: document motion conventions, QA, troubleshooting.
  - Complexity: S.
  - Acceptance: sections align with Section 14 ToC.
  - Owner & status: Owner: Codex→Sonnet | Status: ☐ Not started.
- **Story/Issue Breakdown:**
  1. **Story:** Motion foundation setup — Deliver tokens, provider, engine, reduced motion utilities. Definition of done: hero TextReveal live, feature flag toggles motion.
  2. **Story:** Scroll primitives rollout — ScrollSection & ParallaxBlock integrated into hero/resources/timeline. DoD: scroll interactions functional with reduced motion skip.
  3. **Story:** Micro-interactions suite — Hover lift, ripple, tilt applied to priority cards/buttons. DoD: component library docs + tests.
  4. **Story:** Route transitions & accessibility — RouteTransitionBoundary, progress indicator, focus restoration, QA sign-off.
  5. **Story:** Performance & cleanup — Framer removal (if feasible), analyzer results under budget, docs completed.

**Acceptance Criteria:**

- Each listed path includes purpose, interface/type reference, dependencies, complexity, tests, owner/status.
- Story breakdown links tasks to definitions of done.

## 12) Library-Specific Integration Notes

- **Installation commands:** `pnpm add @motionone/react @motionone/dom split-type`; retain `gsap` but ensure `pnpm add @types/gsap` if missing.
- **Tree-shaking guidance:** Import Motion One APIs directly (`import { animate, timeline } from '@motionone/dom'`) and rely on named exports; avoid wildcard imports. For GSAP, import only required plugins and call `gsap.registerPlugin(ScrollTrigger)` inside guarded client effect.
- **SSR caveats:** Motion One safe to import in shared code; GSAP must be dynamically imported or gated by `typeof window !== 'undefined'`. Use `dynamic(() => import('./Component'), { ssr: false })` for strictly client-only GSAP sequences.
- **TypeScript config:** Ensure `tsconfig.json` includes `"types": ["@types/gsap"]` if necessary; augment Motion One types for custom tokens.
- **ESM/CJS pitfalls:** GSAP ships as UMD; prefer `import { gsap } from 'gsap';` with Next 15 (ESM). Avoid mixing CJS require. Motion One is ESM-only; ensure Node 18+ (already satisfied).
- **Lazy loading:** Wrap heavy GSAP scenes in dynamic imports (e.g., `const Coursework = dynamic(() => import('./ReferenceCoursework').then(m => m.ReferenceCourseworkMotion), { ssr:false });`) to keep initial bundle lean.
- **Hybrid boundaries:** Motion One handles component-level animations; GSAP limited to scroll timelines registered via `withScrollTrigger`. Never mix both on same element simultaneously; let Motion One handle states, GSAP manage wrapper timeline.

**Acceptance Criteria:**

- Notes cover installation, tree-shaking, SSR, TypeScript setup, lazy-loading, and hybrid usage boundaries.
- Guidance references Next.js/TypeScript specifics relevant to the repo.

## 13) Analytics & Success Metrics

- **Coverage goals:** ≥ 80% of interactive components consume motion tokens (`motionDurations`, `motionEasings`) rather than hardcoded values; track via lint rule or codemod.
- **Performance metrics:** LCP ≤ 2.0s (desktop), ≤ 2.5s (mobile); CLS ≤ 0.05; INP ≤ 200 ms measured on staging with motion enabled.
- **Reliability metrics:** 0 console errors from GSAP/ScrollTrigger in CI smoke tests; <1% of sessions triggering reduced-motion still receiving animations (monitored via analytics event `motion_skipped`).
- **Engagement proxies:** Increase hero scroll depth to ≥ 75% (measure via IntersectionObserver logging). Monitor CTA hover dwell time vs baseline.
- **Error monitoring:** Add logging when ScrollTrigger initialization fails; create Sentry breadcrumb `motion_init_error`. Keep failure rate < 0.1% of page loads.

**Acceptance Criteria:**

- Metrics include quantifiable targets covering coverage, performance, reliability, and engagement.
- Monitoring strategy (events/alerts) is specified.

## 14) Documentation & Handoff

- **Motion Handbook ToC (docs/animation-handbook.md):**
  1. Foundations (tokens, provider, reduced-motion policy).
  2. Components & Patterns (`TextReveal`, `ScrollSection`, `ParallaxBlock`, micro-interactions).
  3. Scroll & Route Transitions (GSAP helper usage, feature flags).
  4. Testing & QA (checklists, perf profiling guides).
  5. Troubleshooting (common pitfalls, rollback steps).
- **Contributor guidelines:**
  - PR checklist: includes animation screenshot/video, reduced-motion verification, bundle analyzer check, accessibility audit (`axe`), Storybook demo link.
  - Require tests for new motion utilities (unit) and updated components (Cypress/Playwright where applicable).
  - Document feature flags usage and fallback path before merging.
- **Examples index:**
  - Add Storybook stories (or `/app/demo/motion` route if Storybook absent) for:
    - `TextReveal` variants (`word`, `char`).
    - `ScrollSection` with sticky hero.
    - `ParallaxBlock` on ProjectsRail mimic.
    - Micro-interactions gallery (hover lift, ripple, tilt).
    - Route transition showcase (fade vs slide).
  - Reference each example in the handbook for Sonnet.

**Acceptance Criteria:**

- ToC outlines sections matching planned documentation deliverables.
- Contributor guidelines include PR checklist items and testing expectations.
- Examples index names demos/components to be created.

## Prioritized Checklist for Sonnet

1. Approve Motion One + GSAP hybrid stack and install `@motionone/react`, `@motionone/dom`, `split-type`.
2. Implement `MotionProvider`, tokens, and reduced-motion plumbing; update `app/layout.tsx`.
3. Build `TextReveal` and migrate hero heading/tagline (capture before/after visuals).
4. Ship `ScrollSection`/`ParallaxBlock` primitives and refactor resources + hero scroll behaviors.
5. Migrate key components (`HorizontalTimeline`, `ProjectCarousel`, `AnimatedHobbies`) off Framer to Motion One tokens.
6. Integrate route transitions (behind flag) with focus restoration and reduced-motion fallback.
7. Apply micro-interactions catalog to cards/buttons and document usage.
8. Run performance + accessibility audits; adjust budgets; finalize `docs/animation-handbook.md`.
9. Remove residual Framer-motion usage (or gate behind legacy flag) once parity validated.
