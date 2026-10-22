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

interface ObserverRecord {
  callback: ObserverCallback;
  options: IntersectionObserverInit | undefined;
  disconnect: ReturnType<typeof vi.fn>;
}

let observers: ObserverRecord[] = [];

function latestObserver(): ObserverRecord {
  const observer = observers.at(-1);
  if (!observer) throw new Error("no IntersectionObserver was created");
  return observer;
}

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
    observe = vi.fn();
    disconnect = vi.fn();

    constructor(
      callback: ObserverCallback,
      options?: IntersectionObserverInit,
    ) {
      observers.push({ callback, options, disconnect: this.disconnect });
    }
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
}

describe("CylindricalText", () => {
  beforeEach(() => {
    observers = [];
    window.innerHeight = 900;
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

    await Promise.resolve();
    expect(gsapLoaded).not.toHaveBeenCalled();

    latestObserver().callback([{ isIntersecting: false }]);
    await Promise.resolve();
    expect(gsapLoaded).not.toHaveBeenCalled();

    latestObserver().callback([{ isIntersecting: true }]);
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

    const kill = vi.fn();
    scrollTriggerCreate.mockReturnValueOnce({ kill });

    latestObserver().callback([{ isIntersecting: true }]);
    await waitFor(() => expect(scrollTriggerCreate).toHaveBeenCalledTimes(1));
    expect(reserve?.style.paddingBottom).toBe("0px");

    unmount();
    expect(kill).toHaveBeenCalledWith(true);
    expect(reserve?.style.paddingBottom).toBe("2000px");
  });

  it("looks ahead one viewport height in pixels and follows height changes", () => {
    mockEnvironment();
    const { unmount } = render(
      <CylindricalText items={["Algorithms", "Systems"]} />,
    );

    expect(observers).toHaveLength(1);
    expect(latestObserver().options?.rootMargin).toBe("900px 0px");

    window.innerHeight = 900;
    window.dispatchEvent(new Event("resize"));
    expect(observers).toHaveLength(1);

    window.innerHeight = 600;
    window.dispatchEvent(new Event("resize"));
    expect(observers).toHaveLength(2);
    expect(observers[0]?.disconnect).toHaveBeenCalled();
    expect(latestObserver().options?.rootMargin).toBe("600px 0px");

    unmount();
    expect(latestObserver().disconnect).toHaveBeenCalled();
  });

  it("never loads gsap for reduced-motion visitors", async () => {
    mockEnvironment({ reducedMotion: true });
    render(<CylindricalText items={["Algorithms", "Systems"]} />);

    expect(observers).toHaveLength(0);
    await Promise.resolve();
    expect(gsapLoaded).not.toHaveBeenCalled();
  });
});
