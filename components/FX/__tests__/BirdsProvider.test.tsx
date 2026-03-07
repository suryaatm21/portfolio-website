import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  BIRDS_STORAGE_KEY,
  BirdsProvider,
  useBirdsFx,
} from "@/components/FX/BirdsProvider";

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

function BirdsConsumer() {
  const { enabled, supported, visible, toggle, setEnabled } = useBirdsFx();

  return (
    <div>
      <div data-testid="enabled">{String(enabled)}</div>
      <div data-testid="supported">{String(supported)}</div>
      <div data-testid="visible">{String(visible)}</div>
      <button type="button" onClick={toggle}>
        toggle
      </button>
      <button type="button" onClick={() => setEnabled(false)}>
        disable
      </button>
      <input aria-label="bird input" />
    </div>
  );
}

describe("BirdsProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockMatchMedia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to enabled on supported devices", async () => {
    render(
      <BirdsProvider>
        <BirdsConsumer />
      </BirdsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("enabled")).toHaveTextContent("true");
      expect(screen.getByTestId("supported")).toHaveTextContent("true");
      expect(screen.getByTestId("visible")).toHaveTextContent("true");
    });
  });

  it("respects a stored disabled preference", async () => {
    window.localStorage.setItem(BIRDS_STORAGE_KEY, "false");

    render(
      <BirdsProvider>
        <BirdsConsumer />
      </BirdsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("enabled")).toHaveTextContent("false");
      expect(screen.getByTestId("visible")).toHaveTextContent("false");
    });
  });

  it("toggles when pressing B", async () => {
    render(
      <BirdsProvider>
        <BirdsConsumer />
      </BirdsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("enabled")).toHaveTextContent("true");
    });

    fireEvent.keyDown(window, { code: "KeyB" });

    expect(screen.getByTestId("enabled")).toHaveTextContent("false");
    expect(window.localStorage.getItem(BIRDS_STORAGE_KEY)).toBe("false");
  });

  it("does not toggle while typing in an input", async () => {
    render(
      <BirdsProvider>
        <BirdsConsumer />
      </BirdsProvider>,
    );

    const input = screen.getByLabelText("bird input");
    input.focus();

    await waitFor(() => {
      expect(screen.getByTestId("enabled")).toHaveTextContent("true");
    });

    fireEvent.keyDown(input, { code: "KeyB" });

    expect(screen.getByTestId("enabled")).toHaveTextContent("true");
  });

  it("never exposes visible on unsupported devices", async () => {
    mockMatchMedia({ reducedMotion: true });

    render(
      <BirdsProvider>
        <BirdsConsumer />
      </BirdsProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("supported")).toHaveTextContent("false");
      expect(screen.getByTestId("visible")).toHaveTextContent("false");
    });
  });
});
