import { render } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { BirdsProvider } from "@/components/FX/BirdsProvider";
import { Hero } from "@/components/Hero";

// Regression: a text-clipped background on the hero name makes Chrome paint a
// dark ghost copy of both words at the left edge while they animate in (inside
// the preserve-3d FloatingElement wrapper).
describe("Hero name", () => {
  beforeEach(() => {
    // Hero.tsx only type-imports React, so the classic JSX runtime needs it global.
    vi.stubGlobal("React", React);
    class MockIntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("carries no text-clipped background", () => {
    const { container } = render(
      <BirdsProvider>
        <Hero />
      </BirdsProvider>,
    );

    const name = container.querySelector(".hero-name");
    expect(name).not.toBeNull();
    expect(name?.className).not.toMatch(/bg-clip-text|bg-gradient/);
  });
});
