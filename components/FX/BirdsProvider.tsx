"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const BIRDS_STORAGE_KEY = "portfolio:birds-enabled";
export const DEFAULT_BIRD_COUNT = 7;

interface BirdsFxContextValue {
  count: number;
  enabled: boolean;
  supported: boolean;
  visible: boolean;
  addBird: () => void;
  toggle: () => void;
  setEnabled: (next: boolean) => void;
}

const BirdsFxContext = createContext<BirdsFxContextValue | null>(null);

function canUseDOM(): boolean {
  return typeof window !== "undefined";
}

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  if (tagName === "input" || tagName === "textarea" || tagName === "select") {
    return true;
  }

  return (
    target.isContentEditable ||
    target.closest("[contenteditable=\"true\"]") instanceof HTMLElement
  );
}

export function BirdsProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [count, setCount] = useState(DEFAULT_BIRD_COUNT);
  const [enabled, setEnabledState] = useState(true);
  const [supported, setSupported] = useState(false);
  const [ready, setReady] = useState(false);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
  }, []);

  const toggle = useCallback(() => {
    setCount(DEFAULT_BIRD_COUNT);
    setEnabledState((current) => !current);
  }, []);

  const addBird = useCallback(() => {
    setCount((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!canUseDOM()) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");

    const syncSupport = () => {
      setSupported(!(reducedMotionQuery.matches || coarsePointerQuery.matches));
    };

    syncSupport();

    try {
      const storedPreference = window.localStorage.getItem(BIRDS_STORAGE_KEY);
      if (storedPreference !== null) {
        setEnabledState(storedPreference === "true");
      }
    } catch {
      setEnabledState(true);
    }

    setReady(true);

    reducedMotionQuery.addEventListener("change", syncSupport);
    coarsePointerQuery.addEventListener("change", syncSupport);

    return () => {
      reducedMotionQuery.removeEventListener("change", syncSupport);
      coarsePointerQuery.removeEventListener("change", syncSupport);
    };
  }, []);

  useEffect(() => {
    if (!ready || !canUseDOM()) return;

    try {
      window.localStorage.setItem(BIRDS_STORAGE_KEY, String(enabled));
    } catch {}
  }, [enabled, ready]);

  useEffect(() => {
    if (!ready || !supported || !canUseDOM()) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.repeat ||
        isEditableTarget(event.target ?? document.activeElement)
      ) {
        return;
      }

      if (event.code === "KeyF") {
        setCount(DEFAULT_BIRD_COUNT);
        setEnabledState((current) => !current);
        return;
      }

      if (event.code === "KeyB") {
        setCount((current) => current + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ready, supported]);

  const value = useMemo<BirdsFxContextValue>(
    () => ({
      count,
      enabled,
      supported,
      visible: ready && supported && enabled,
      addBird,
      toggle,
      setEnabled,
    }),
    [addBird, count, enabled, ready, setEnabled, supported, toggle],
  );

  return (
    <BirdsFxContext.Provider value={value}>{children}</BirdsFxContext.Provider>
  );
}

export function useBirdsFx(): BirdsFxContextValue {
  const context = useContext(BirdsFxContext);

  if (!context) {
    throw new Error("useBirdsFx must be used within a BirdsProvider");
  }

  return context;
}
