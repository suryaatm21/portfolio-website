import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { BirdsProvider } from "@/components/FX/BirdsProvider";
import { HeroBirdsHint } from "@/components/HeroBirdsHint";

type MatchMediaOptions = {
  reducedMotion?: boolean;
  coarsePointer?: boolean;
};

function mockMatchMedia({
  reducedMotion = false,
  coarsePointer = false,
}: MatchMediaOptions = {}) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion")
        ? reducedMotion
        : query.includes("pointer: coarse")
          ? coarsePointer
          : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("HeroBirdsHint", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockMatchMedia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the hint when birds are supported", async () => {
    render(
      <BirdsProvider>
        <HeroBirdsHint />
      </BirdsProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Watch the clouds/i),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText(/toggle the flock/i)).toBeInTheDocument();
  });

  it("hides the hint when reduced motion is enabled", async () => {
    mockMatchMedia({ reducedMotion: true });

    render(
      <BirdsProvider>
        <HeroBirdsHint />
      </BirdsProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/Birds track your cursor/i),
      ).not.toBeInTheDocument();
    });
  });

  it("hides the hint on coarse pointer devices", async () => {
    mockMatchMedia({ coarsePointer: true });

    render(
      <BirdsProvider>
        <HeroBirdsHint />
      </BirdsProvider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/Birds track your cursor/i),
      ).not.toBeInTheDocument();
    });
  });
});
