"use client";

import dynamic from "next/dynamic";
import { useBirdsFx } from "@/components/FX/BirdsProvider";

const BirdsCursor = dynamic(
  () => import("@/components/FX/BirdsCursor").then((module) => module.BirdsCursor),
  { ssr: false },
);

export function FXMounts(): JSX.Element | null {
  const { visible } = useBirdsFx();

  return (
    <>
      {visible && (
        <BirdsCursor
          enabled
          count={7}
          colors={["#050505", "#111111", "#1a1a1a"]}
          size={15}
          speedCap={5.2}
          forces={{
            separation: 2.6,
            alignment: 0.95,
            cohesion: 0.35,
            trail: 2.9,
          }}
          zIndex={0}
        />
      )}
    </>
  );
}
