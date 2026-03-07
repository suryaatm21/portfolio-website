"use client";

import { BirdsCursor } from "@/components/FX/BirdsCursor";
import { useBirdsFx } from "@/components/FX/BirdsProvider";

const BIRD_COLORS = ["#050505", "#111111", "#1a1a1a"];

const BIRD_FORCES = {
  separation: 3.1,
  alignment: 0.95,
  cohesion: 0.28,
  trail: 2.9,
};

export function FXMounts(): JSX.Element | null {
  const { count, visible } = useBirdsFx();

  return (
    <>
      {visible && (
        <BirdsCursor
          enabled
          count={count}
          colors={BIRD_COLORS}
          size={8}
          speedCap={5.2}
          forces={BIRD_FORCES}
          zIndex={0}
        />
      )}
    </>
  );
}
