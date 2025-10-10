# Portfolio Website

A modern, interactive portfolio website built with Next.js 15, featuring 3D animations, smooth scrolling effects, and a responsive design.

[![Deployed on Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://netlify.com)

## Features

- 🎨 **Modern UI**: Built with Radix UI components and Tailwind CSS 4.x
- 🎭 **3D Animations**: GSAP-powered cylindrical text effect for coursework display
- 🎠 **Interactive Carousels**: Custom 3D project showcase carousel
- 📱 **Fully Responsive**: Mobile-first design with optimized layouts
- ⚡ **Performance**: Static generation with Next.js App Router
- 🎯 **Smooth Scrolling**: Lenis integration for buttery-smooth scroll experience
- 🧪 **Tested**: Vitest + Testing Library for component testing
- 🎨 **Animations**: Framer Motion for micro-interactions
- 🌙 **Theme Support**: Dark mode ready with next-themes

## Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS 4.1.9
- **Animations**: GSAP 3.13.0 + Framer Motion 12.23.12
- **Smooth Scrolling**: Lenis 1.3.11
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest 3.2.4 + Testing Library
- **Package Manager**: pnpm 10.15.1
- **Deployment**: Netlify (Vercel deprecated)

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
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── animations/      # Animation wrappers
│   ├── FX/             # Visual effects (cursor, performance monitor)
│   └── ui/             # Reusable UI components (Radix UI)
├── content/            # Site content and configuration
│   └── site.ts         # Centralized content management
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── public/             # Static assets
├── styles/             # Global styles
├── tests/              # Test setup and utilities
└── types/              # TypeScript type definitions
```

## Key Features

### 3D Cylindrical Text Effect

A mesmerizing GSAP-powered effect that displays coursework items in a 3D rotating cylinder. See `components/CylindricalText.tsx` for implementation details.

### Interactive Project Carousel

A custom-built 3D carousel with smooth transitions and keyboard navigation. Features include:

- Responsive card sizing
- 3D depth effects
- Touch/keyboard controls
- Smooth animations

### Contact Form

Integrated email form using React Hook Form with Zod validation. Opens user's default email client with pre-filled message.

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `pnpm typecheck` - Type check with TypeScript
- `pnpm lint` - Lint code with ESLint
- `pnpm validate` - Run all checks (typecheck + lint + test + build)

## Deployment

The project is deployed on Netlify with automatic deployments from the `main` branch.

### Environment Setup

No environment variables required for basic functionality. The site is fully static.

## Contributing

This is a personal portfolio project, but feedback and suggestions are welcome!

## License

© 2025 Surya Atmuri. All rights reserved.
