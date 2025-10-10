# Animation Implementation Guide

This document tracks the implementation of the animation system based on `docs/animate-plan.md`.

## ✅ Completed (Phase 1 - Foundations)

### Motion Tokens (`tokens/motion.ts`)

- ✅ Duration scales (xs, sm, md, lg, xl)
- ✅ Easing curves (standard, emphasized, bounce)
- ✅ Spring configurations
- ✅ Z-index layers
- ✅ Float animation presets
- ✅ Text reveal presets
- ✅ Scroll thresholds
- ✅ Route transition presets (for future use)

### Core Animation Components

#### FloatingElement (`components/animations/FloatingElement.tsx`)

Reusable floating/hover effect extracted from Hero component.

**Variants:**

- `gentle` - Slow, wide floating motion (cloud-like, 6s cycle)
- `subtle` - Quick, small floating motion (4s cycle)
- `parallax` - Mouse-tracking 3D effect (follows cursor)
- `none` - No animation (respects reduced motion)

**Features:**

- ✅ Respects `prefers-reduced-motion`
- ✅ Configurable parallax intensity
- ✅ Spring-based smooth transitions
- ✅ SSR-safe (no hydration issues)

**Usage:**

```tsx
// Gentle floating
<FloatingElement variant="gentle">
  <Card>Floats like a cloud</Card>
</FloatingElement>

// Parallax tracking
<FloatingElement variant="parallax" parallaxIntensity={6}>
  <img src="/profile.jpg" alt="Follows mouse" />
</FloatingElement>
```

#### TextReveal (`components/animations/TextReveal.tsx`)

Split-text animation component inspired by GSAP SplitText.

**Split Modes:**

- `word` - Split by words (default)
- `char` - Split by characters
- `line` - Split by lines

**Animation Presets:**

- `fadeUp` - Fade in from below
- `fadeDown` - Fade in from above
- `slideRight` - Slide in from left
- `blur` - Fade in with blur effect
- `scale` - Scale up from center

**Features:**

- ✅ Scroll-triggered reveals
- ✅ Configurable stagger timing
- ✅ Viewport threshold control
- ✅ Respects reduced motion
- ✅ SSR-safe rendering

**Usage:**

```tsx
// Word-by-word reveal
<TextReveal mode="word" preset="fadeUp" stagger={50}>
  This text animates word by word!
</TextReveal>

// Character reveal with blur
<TextReveal mode="char" preset="blur" stagger={20} delay={200}>
  Mysterious text reveal
</TextReveal>
```

#### ScrollReveal (`components/animations/ScrollReveal.tsx`)

Viewport-triggered animations for sections and elements.

**Variants:**

- `fadeUp` / `fadeDown` / `fadeLeft` / `fadeRight`
- `scale` - Zoom in effect
- `blur` - Blur to focus

**Features:**

- ✅ Efficient IntersectionObserver
- ✅ Configurable viewport threshold
- ✅ Once or repeat animations
- ✅ Staggered children support (`StaggeredScrollReveal`)

**Usage:**

```tsx
// Single element reveal
<ScrollReveal variant="fadeUp" threshold={0.3}>
  <Section>Reveals when 30% visible</Section>
</ScrollReveal>

// Staggered children
<StaggeredScrollReveal stagger={100} variant="scale">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</StaggeredScrollReveal>
```

## 🚧 In Progress (Phase 2 - Integration)

### Priority Components to Animate

1. **Hero Section**
   - [ ] Apply `TextReveal` to hero tagline (word-by-word)
   - [ ] Already has parallax image (can extract to `FloatingElement`)
   - [ ] Add floating effect to CTA buttons

2. **Resources Grid** (`components/ResourcesList.tsx`)
   - [ ] Wrap in `StaggeredScrollReveal` for card cascade
   - [ ] Add subtle `FloatingElement` to each card on hover

3. **Project Carousel** (`components/ProjectCarousel.tsx`)
   - [ ] Add floating effect to inactive cards
   - [ ] Enhance active card with subtle scale animation

4. **Education Section**
   - [ ] Animate section header with `TextReveal`
   - [ ] Wrap `AcademicBackgroundCard` in `ScrollReveal`
   - [ ] CylindricalText already has GSAP scroll animation ✅

5. **Experience Timeline** (`components/HorizontalTimeline.tsx`)
   - [ ] Add `ScrollReveal` to timeline entries
   - [ ] Enhance hover states with micro-animations

6. **Contact Form** (`components/ContactForm.tsx`)
   - [ ] Stagger form field reveals
   - [ ] Add floating effect to hobby cards

## 📋 Next Steps

### Phase 2: Component Integration (This Week)

1. Update Hero with TextReveal on tagline
2. Apply StaggeredScrollReveal to ResourcesList
3. Add FloatingElement to project cards
4. Enhance section headers with animations

### Phase 3: Polish & Optimization (Next Week)

1. Performance profiling (bundle size, frame rates)
2. Accessibility audit (keyboard nav, screen readers)
3. Create Storybook demos for each component
4. Document all animation patterns

### Phase 4: Advanced Features (Future)

1. Route transition animations
2. Custom scroll-based parallax scenes
3. Interactive hover states system
4. Animation choreography system

## 🎨 Design Principles

### Sky/Cloud Theme

All animations should evoke the feeling of floating in the sky:

- Gentle, smooth movements
- No harsh or jarring transitions
- Soft easings (bounce, gentle springs)
- Respect user preferences (reduced motion)

### Performance First

- Use GPU-accelerated properties (transform, opacity)
- Avoid animating layout properties (width, height, top, left)
- Lazy load heavy animations
- Provide reduced-motion fallbacks

### Accessibility

- All animations respect `prefers-reduced-motion`
- Keyboard navigation unaffected
- Screen reader friendly (aria-labels, hidden decorative elements)
- Focus indicators remain visible during animations

## 🔧 Technical Notes

### Bundle Impact

- `tokens/motion.ts`: ~1KB
- `FloatingElement`: ~2KB
- `TextReveal`: ~3KB
- `ScrollReveal`: ~2KB
- **Total new code**: ~8KB (acceptable within 40KB budget)

### Dependencies

- Using existing `framer-motion` (already in project)
- No new dependencies added
- All animations SSR-safe

### Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- IntersectionObserver polyfill not needed (widely supported)

## 📚 Resources

- Main plan: `docs/animate-plan.md`
- Framer Motion docs: https://www.framer.com/motion/
- Motion tokens: `tokens/motion.ts`
- Example components: `components/animations/`

## 🎯 Success Metrics

- [ ] All interactive components use motion tokens (target: 80%+)
- [ ] Zero console errors from animations in CI
- [ ] LCP ≤ 2.0s with animations enabled
- [ ] INP ≤ 200ms
- [ ] Accessibility audit passes (axe)
- [ ] Bundle size increase < 40KB
