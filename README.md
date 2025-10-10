# Portfolio Website

A modern, interactive portfolio website built with Next.js 15, featuring sophisticated animations, 3D effects, smooth scrolling, and a responsive design.

[![Deployed on Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://netlify.com)

## Features

- 🎨 **Modern UI**: Built with Radix UI components and Tailwind CSS 4.x
- ✨ **Advanced Animation System**: Custom-built animation components with scroll triggers
  - **TextReveal**: Split-text animations with 5 presets (fadeUp, fadeDown, slideRight, blur, scale)
  - **FloatingElement**: Mouse-tracking parallax hover effects for interactive depth
  - **ScrollReveal**: Intersection Observer-powered viewport animations
  - **FadeInUp**: Smooth entrance animations with stagger support
- 🎭 **3D Effects**: GSAP-powered cylindrical text effect for immersive coursework display
- 🎠 **Interactive Carousels**: Custom 3D project showcase carousel with smooth transitions
- 🎯 **Smooth Scrolling**: Lenis integration for buttery-smooth scroll experience
- 📱 **Fully Responsive**: Mobile-first design with optimized layouts for all screen sizes
- ⚡ **Performance Optimized**: Static generation with Next.js App Router
- ♿ **Accessibility**: Respects reduced motion preferences throughout
- 🧪 **Tested**: Vitest + Testing Library for component testing
- 🌙 **Theme Support**: Dark mode ready with next-themes

## Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **UI Components**: Radix UI primitives (Dialog, Toast, etc.)
- **Styling**: Tailwind CSS 4.1.9 with custom design tokens
- **Animations**:
  - Framer Motion 12.23.12 (core animation engine)
  - GSAP 3.13.0 (3D cylindrical text effect)
  - Custom animation components (TextReveal, FloatingElement, ScrollReveal)
- **Smooth Scrolling**: Lenis 1.3.11
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest 3.2.4 + Testing Library + Happy DOM
- **Type Safety**: TypeScript 5+ with strict mode
- **Package Manager**: pnpm 10.15.1
- **Deployment**: Netlify with automatic deployments

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- pnpm 10+

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint code
pnpm lint
```

The development server runs at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── layout.tsx       # Root layout with theme provider
│   └── page.tsx         # Home page with all sections
├── components/          # React components
│   ├── animations/      # Animation system components
│   │   ├── TextReveal.tsx        # Split-text reveal animations
│   │   ├── FloatingElement.tsx   # Mouse-tracking parallax effects
│   │   ├── ScrollReveal.tsx      # Viewport-triggered animations
│   │   ├── FadeInUp.tsx         # Entrance animations
│   │   └── AnimatedButton.tsx    # Interactive button animations
│   ├── FX/             # Visual effects
│   │   ├── BirdsCursor.tsx       # Custom cursor with bird particles
│   │   └── PerformanceMonitor.tsx # FPS monitoring
│   └── ui/             # Reusable UI components (Radix UI)
├── content/            # Site content and configuration
│   └── site.ts         # Centralized content management
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── public/             # Static assets
├── styles/             # Global styles
├── tests/              # Test setup and utilities
├── tokens/             # Design tokens
│   └── motion.ts       # Animation presets and motion configuration
└── types/              # TypeScript type definitions
```

## Key Features

### Animation System

A comprehensive animation system built with Framer Motion and Intersection Observer:

#### TextReveal Component

Splits text into words, characters, or lines and animates them individually. Features:

- 5 animation presets: fadeUp, fadeDown, slideRight, blur, scale
- Configurable stagger timing for sequential reveals
- Viewport-triggered animations with IntersectionObserver
- Respects reduced motion preferences
- Re-triggers on scroll (not just once)

#### FloatingElement Component

Creates interactive parallax hover effects:

- Mouse-tracking parallax that follows cursor movement
- Multiple intensity variants (subtle, gentle)
- Smooth spring physics transitions
- Element-local hover detection
- Fully accessible with reduced motion support

#### ScrollReveal Component

Viewport-triggered animations with flexible presets:

- Multiple animation directions (fadeUp, fadeDown, slideLeft, slideRight)
- Scale and blur effects
- Configurable delays and durations
- IntersectionObserver for performance

### 3D Cylindrical Text Effect

A mesmerizing GSAP-powered effect that displays coursework items in a 3D rotating cylinder. Features:

- Smooth rotation with mouse/touch drag
- Responsive sizing and positioning
- Automatic item distribution on cylinder
- Performance-optimized rendering

See `components/CylindricalText.tsx` for implementation details.

### Interactive Project Carousel

A custom-built 3D carousel with smooth transitions and keyboard navigation. Features include:

- Responsive card sizing
- 3D depth effects with perspective transforms
- Touch/keyboard controls
- Smooth Framer Motion animations
- Automatic and manual navigation

### Contact Form

Integrated email form using React Hook Form with Zod validation. Opens user's default email client with pre-filled message. Features:

- Real-time validation
- Toast notifications
- Smooth form animations
- Accessibility compliant

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `pnpm typecheck` - Type check with TypeScript
- `pnpm lint` - Lint code with ESLint
- `pnpm validate` - Run all checks (typecheck + lint + test + build)

## Animation Configuration

All animation timings and presets are centralized in `tokens/motion.ts`:

```typescript
// Durations
motionDurations: { xs: 120, sm: 240, md: 360, lg: 480, xl: 720 }

// Spring configurations
motionSprings: { gentle: { damping: 20, stiffness: 300 } }

// Text reveal presets
textRevealPresets: {
  fadeUp, fadeDown, slideRight, blur, scale
}
```

## Deployment

The project is deployed on Netlify with automatic deployments from the `main` branch.

### Build Configuration

- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Node Version**: 20+
- **Package Manager**: pnpm

### Environment Setup

No environment variables required for basic functionality. The site is fully static with client-side interactivity.

## Performance

- ✅ Static generation for instant page loads
- ✅ Optimized animations with Framer Motion's layout animations
- ✅ IntersectionObserver for efficient scroll-triggered animations
- ✅ Reduced motion support for accessibility
- ✅ Code splitting with Next.js App Router
- ✅ Optimized images with Next.js Image component

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is a personal portfolio project, but feedback and suggestions are welcome!

## License

© 2025 Surya Atmuri. All rights reserved.
