import { render, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CylindricalText } from "@/components/CylindricalText";

const gsapLoaded = vi.fn();
const scrollTriggerCreate = vi.fn(() => ({ kill: vi.fn() }));

vi.mock("gsap", () => {
  gsapLoaded();
  return {
    gsap: {
      registerPlugin: vi.fn(),
      fromTo: vi.fn(),
    },
  };
});

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { create: scrollTriggerCreate },
}));

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void;

let observerCallback: ObserverCallback | undefined;
let observerOptions: IntersectionObserverInit | undefined;

function mockEnvironment({ reducedMotion = false } = {}) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? reducedMotion : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });

  class MockIntersectionObserver {
    constructor(
      callback: ObserverCallback,
      options?: IntersectionObserverInit,
    ) {
      observerCallback = callback;
      observerOptions = options;
    }
    observe = vi.fn();
    disconnect = vi.fn();
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
}

describe("CylindricalText", () => {
  beforeEach(() => {
    observerCallback = undefined;
    observerOptions = undefined;
    vi.resetModules();
    gsapLoaded.mockClear();
    scrollTriggerCreate.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not load gsap until the section nears the viewport", async () => {
    mockEnvironment();
    render(<CylindricalText items={["Algorithms", "Systems"]} />);

    expect(observerOptions?.rootMargin).toBe("100% 0px");
    await Promise.resolve();
    expect(gsapLoaded).not.toHaveBeenCalled();

    observerCallback?.([{ isIntersecting: false }]);
    await Promise.resolve();
    expect(gsapLoaded).not.toHaveBeenCalled();

    observerCallback?.([{ isIntersecting: true }]);
    await waitFor(() => expect(scrollTriggerCreate).toHaveBeenCalledTimes(1));
    expect(gsapLoaded).toHaveBeenCalledTimes(1);
  });

  it("hands the reserved scroll distance to the pin spacer and restores it on cleanup", async () => {
    mockEnvironment();
    const { container, unmount } = render(
      <CylindricalText items={["Algorithms", "Systems"]} />,
    );
    const reserve = container.querySelector<HTMLElement>(
      ".motion-reduce\\:hidden",
    );
    expect(reserve?.style.paddingBottom).toBe("2000px");

    observerCallback?.([{ isIntersecting: true }]);
    await waitFor(() => expect(scrollTriggerCreate).toHaveBeenCalledTimes(1));
    expect(reserve?.style.paddingBottom).toBe("0px");

    unmount();
    expect(reserve?.style.paddingBottom).toBe("2000px");
  });

  it("never loads gsap for reduced-motion visitors", async () => {
    mockEnvironment({ reducedMotion: true });
    render(<CylindricalText items={["Algorithms", "Systems"]} />);

    expect(observerCallback).toBeUndefined();
    await Promise.resolve();
    expect(gsapLoaded).not.toHaveBeenCalled();
  });
});
