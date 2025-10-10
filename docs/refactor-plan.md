# Portfolio Website Refactor Plan

**Date**: January 2025  
**Branch**: feat/refactor  
**Status**: Analysis Complete

## Executive Summary

This document outlines deprecated files, unused dependencies, and refactoring opportunities discovered through comprehensive codebase analysis. The portfolio is functional but contains legacy code from iterative development.

---

## 🔴 DEPRECATED FILES (Ready for Deletion)

### 1. **ReferenceCoursework.tsx**

**Path**: `components/ReferenceCoursework.tsx`  
**Status**: ⚠️ DEPRECATED - Replaced by CylindricalText.tsx  
**Reason**: Old GSAP implementation, superseded by working CylindricalText component  
**Dependencies**: None (not imported anywhere)  
**Action**: Safe to delete

```tsx
// Old component with broken GSAP scroll animation
// Replaced by components/CylindricalText.tsx
```

### 2. **AnimatedHobbies.tsx**

**Path**: `components/AnimatedHobbies.tsx`  
**Status**: ⚠️ DEPRECATED - Replaced by AnimatedHobbiesCard.tsx  
**Reason**: Standalone version replaced by card-based component  
**Dependencies**: Not imported in app/page.tsx  
**Action**: Safe to delete

```tsx
// Old hobbies component without card wrapper
// Replaced by components/AnimatedHobbiesCard.tsx
```

### 3. **Timeline.tsx**

**Path**: `components/Timeline.tsx`  
**Status**: ⚠️ DEPRECATED - Replaced by HorizontalTimeline.tsx  
**Reason**: Vertical timeline replaced by horizontal scrolling version  
**Dependencies**: Not imported in app/page.tsx  
**Used**: HorizontalTimeline is the active component  
**Action**: Safe to delete

```tsx
// Old vertical timeline with accordion
// Replaced by components/HorizontalTimeline.tsx
```

### 4. **ProjectsRail.tsx**

**Path**: `components/ProjectsRail.tsx`  
**Status**: ⚠️ DEPRECATED - Replaced by ProjectsCarousel.tsx  
**Reason**: Simple horizontal scroll replaced by 3D carousel  
**Dependencies**: Not imported in app/page.tsx  
**Action**: Safe to delete

```tsx
// Simple horizontal scroll rail
// Replaced by components/ProjectsCarousel.tsx with 3D effects
```

### 5. **ExperienceStepper.tsx**

**Path**: `components/ExperienceStepper.tsx`  
**Status**: ⚠️ DEPRECATED - Replaced by HorizontalTimeline.tsx  
**Reason**: Wheel-scroll stepper replaced by timeline  
**Dependencies**: Not imported in app/page.tsx  
**Action**: Safe to delete

```tsx
// Wheel-based experience stepper
// Replaced by components/HorizontalTimeline.tsx
```

### 6. **ProjectCarousel.tsx**

**Path**: `components/ProjectCarousel.tsx`  
**Status**: ⚠️ POTENTIALLY DEPRECATED - Check if superseded by ProjectsCarousel.tsx  
**Dependencies**: Not imported in app/page.tsx  
**Current**: ProjectsCarousel.tsx is actively used  
**Action**: Verify functionality overlap, likely safe to delete

---

## 📁 REFERENCE FILES (Move to Archive)

### References Folder

**Path**: `references/`  
**Contents**:

- `carousel.js`, `carousel.pug`, `carousel.scss` - Old carousel reference
- `timeline.html`, `timeline.saas` - Timeline reference implementation
- `steering-behaviors-physics.html` - Physics simulation reference
- `styles.css`, `index.html` - Generic reference files
- `cylindar-text/` - Original cylindrical text reference
- `mochi-motion/` - Animation library reference

**Action**: These are reference materials, not production code

- Keep for historical reference OR
- Move to separate `docs/references/` folder OR
- Delete if no longer needed

---

## 🧹 UNUSED DEPENDENCIES

### Package.json Analysis

#### Unused or Under-utilized:

1. **pixi.js** - Installed but unused (was planned for FX)
   - Mentioned in docs but no imports found
   - Action: Remove if not planned for future use

2. **lenis** - Smooth scroll library
   - Installed (1.3.11) but no imports found
   - Action: Either implement or remove

3. **Excessive Radix UI Components** - Many installed but unused:
   - `@radix-ui/react-accordion` - Not using accordions
   - `@radix-ui/react-alert-dialog` - Not using alert dialogs
   - `@radix-ui/react-aspect-ratio` - Not using aspect ratio
   - `@radix-ui/react-avatar` - Not using avatars
   - `@radix-ui/react-checkbox` - Not using checkboxes
   - `@radix-ui/react-collapsible` - Not using collapsibles
   - `@radix-ui/react-context-menu` - Not using context menus
   - `@radix-ui/react-dropdown-menu` - Not using dropdowns
   - `@radix-ui/react-hover-card` - Not using hover cards
   - `@radix-ui/react-menubar` - Not using menubars
   - `@radix-ui/react-navigation-menu` - Not using nav menu
   - `@radix-ui/react-popover` - Not using popovers
   - `@radix-ui/react-progress` - Not using progress bars
   - `@radix-ui/react-radio-group` - Not using radio groups
   - `@radix-ui/react-scroll-area` - Not using scroll areas
   - `@radix-ui/react-select` - Not using selects
   - `@radix-ui/react-separator` - Not using separators
   - `@radix-ui/react-slider` - Not using sliders
   - `@radix-ui/react-switch` - Not using switches
   - `@radix-ui/react-tabs` - Not using tabs
   - `@radix-ui/react-toggle` - Not using toggles
   - `@radix-ui/react-toggle-group` - Not using toggle groups
   - `@radix-ui/react-tooltip` - Not using tooltips
   - Action: Remove unused Radix components to reduce bundle size

4. **cmdk** - Command menu (1.0.4)
   - No command palette implemented
   - Action: Remove if not planned

5. **embla-carousel-react** - Carousel library
   - Custom carousel built instead
   - Action: Remove if not using

6. **react-day-picker** - Date picker
   - No date selection implemented
   - Action: Remove

7. **react-resizable-panels** - Resizable panels
   - No resizable layouts implemented
   - Action: Remove

8. **recharts** - Chart library
   - No charts or data visualizations
   - Action: Remove

9. **sonner** - Toast notifications
   - Using Radix Toast instead
   - Action: Remove

10. **vaul** - Drawer component
    - No drawer UI implemented
    - Action: Remove

11. **input-otp** - OTP input
    - No authentication/OTP flow
    - Action: Remove

12. **date-fns** - Date utilities
    - Minimal date usage, could use native JS
    - Action: Consider removing

---

## 🔧 CODE QUALITY ISSUES

### 1. Type Safety Issues

**Location**: `app/page.tsx:49`

```tsx
<HorizontalTimeline entries={timeline as any} />
```

**Issue**: Using `as any` defeats TypeScript type checking  
**Fix**: Create proper interface for timeline entries or update component types

### 2. AnimatedBackground Warnings

**Location**: `components/AnimatedBackground.tsx`

- Unnecessary dependency 'theme' in useCallback
- Ref cleanup issues in useEffect
  **Action**: Fix ESLint warnings

### 3. Missing Dependencies in useEffect

**Locations**:

- `components/AnimatedHobbies.tsx` - hobbies.length dependency warning
- `components/HorizontalTimeline.tsx` - goToNext/goToPrevious dependencies
- `components/FX/PerformanceMonitor.tsx` - measurePerformance dependency
  **Action**: Add missing dependencies or use useCallback

### 4. Image Optimization

**Location**: `components/Hero.tsx:66`

```tsx
<img> instead of next/image
```

**Issue**: Not using Next.js Image optimization  
**Action**: Replace with next/image for better LCP and bandwidth

---

## 🎯 REFACTORING OPPORTUNITIES

### 1. Consolidate Project Components

**Current State**:

- ProjectCard.tsx - Individual card component
- ProjectCarousel.tsx - Old 3D carousel (unused?)
- ProjectsCarousel.tsx - Current active carousel
- ProjectsRail.tsx - Deprecated rail component

**Recommendation**:

- Delete ProjectCarousel.tsx and ProjectsRail.tsx
- Keep ProjectCard.tsx and ProjectsCarousel.tsx
- Rename ProjectsCarousel to ProjectCarousel for consistency

### 2. Consolidate Timeline Components

**Current State**:

- Timeline.tsx - Deprecated vertical timeline
- HorizontalTimeline.tsx - Active horizontal timeline
- ExperienceStepper.tsx - Deprecated stepper

**Recommendation**:

- Delete Timeline.tsx and ExperienceStepper.tsx
- Rename HorizontalTimeline to ExperienceTimeline for clarity

### 3. Consolidate Hobbies Components

**Current State**:

- AnimatedHobbies.tsx - Deprecated standalone
- AnimatedHobbiesCard.tsx - Active card version

**Recommendation**:

- Delete AnimatedHobbies.tsx
- Rename AnimatedHobbiesCard to HobbiesCard for simplicity

### 4. Animation System Organization

**Current State**:

```
components/
  animations/
    AnimatedButton.tsx
    AnimatedCard.tsx
    FadeInUp.tsx
    FloatingElement.tsx
    ScrollHint.tsx
    ScrollReveal.tsx
    TextReveal.tsx
```

**Recommendation**: ✅ Well organized, no changes needed

### 5. Metadata Configuration

**Issue**: Multiple warnings about metadata configuration

```
⚠ Unsupported metadata colorScheme/viewport/themeColor
```

**Action**: Move to viewport export as per Next.js 15 recommendations

### 6. Package.json Name

**Current**: `"name": "my-v0-project"`  
**Issue**: Generic v0 name  
**Action**: Rename to `"name": "portfolio-website"`

---

## 📊 BUNDLE SIZE OPTIMIZATION

### Estimated Savings from Removals:

1. **Deprecated Components** (~15KB gzipped)
   - ReferenceCoursework.tsx
   - AnimatedHobbies.tsx
   - Timeline.tsx
   - ProjectsRail.tsx
   - ExperienceStepper.tsx
   - ProjectCarousel.tsx

2. **Unused Dependencies** (~150KB+ gzipped)
   - pixi.js (~100KB)
   - lenis (~10KB)
   - Unused Radix components (~30KB+)
   - cmdk, embla, recharts, sonner, vaul, etc. (~20KB+)

**Total Potential Savings**: ~165KB gzipped (~450KB raw)

---

## 🎬 IMPLEMENTATION PLAN

### Phase 1: Safe Deletions (Low Risk)

1. Delete deprecated component files
2. Remove unused dependencies from package.json
3. Run `pnpm install` to update lockfile
4. Test build and functionality

### Phase 2: Refactoring (Medium Risk)

1. Fix TypeScript `as any` casts
2. Rename components for consistency
3. Fix ESLint warnings
4. Update metadata configuration
5. Replace img with next/image in Hero

### Phase 3: Optimization (Medium Risk)

1. Implement or remove lenis smooth scroll
2. Audit and remove unused Radix components
3. Update package.json name
4. Test bundle size improvements

### Phase 4: Documentation (Low Risk)

1. Update README with accurate dependencies
2. Archive or delete references folder
3. Update component documentation

---

## ✅ VERIFICATION CHECKLIST

After each phase:

- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Visual regression testing (manual)
- [ ] Bundle size analysis
- [ ] Performance metrics (Lighthouse)
- [ ] Accessibility audit

---

## 📝 NOTES

### Files to Review Manually:

1. `components/AnimatedBackground.tsx` - Check if Vanta.js CDN loading is optimal
2. `components/FX/BirdsCursor.tsx` - Verify if used or can be removed
3. `components/FX/PerformanceMonitor.tsx` - Check if needed in production

### Dependencies to Consider:

- **Keep**: framer-motion, gsap, tailwindcss, next-themes
- **Review**: @emotion/is-prop-valid (may not be needed)
- **Remove**: See unused dependencies list above

---

## 🚀 EXPECTED OUTCOMES

1. **Cleaner Codebase**: Remove ~6 deprecated components
2. **Smaller Bundle**: Reduce by ~165KB gzipped
3. **Better Performance**: Faster builds, smaller deploys
4. **Improved Maintainability**: Less code to maintain
5. **Type Safety**: Remove `as any` casts
6. **Better DX**: Consistent component naming

---

## 📚 REFERENCES

- [Next.js 15 Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Bundle Analysis Guide](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)
- [Radix UI Components](https://www.radix-ui.com/primitives/docs/overview/introduction)
