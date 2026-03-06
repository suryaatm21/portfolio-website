"use client";

import { motion } from "framer-motion";
import React from "react";

import { useBirdsFx } from "@/components/FX/BirdsProvider";
import { hero } from "@/content/site";

function getHintParts(copy: string): { before: string; after: string } {
  const [before = copy, after = ""] = copy.split("{key}");
  return { before, after };
}

export function HeroBirdsHint(): JSX.Element | null {
  const { supported } = useBirdsFx();

  if (!supported) return null;

  const hint = getHintParts(hero.interactionHint);

  return (
    <motion.div
      className="inline-flex"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}>
      <p className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-950/25 px-4 py-2 text-sm font-medium tracking-wide text-slate-100/90 backdrop-blur-md xl:justify-start">
        <span>{hint.before.trimEnd()}</span>
        <kbd className="kbd-pill" aria-label="Press keyboard key B">
          B
        </kbd>
        <span>{hint.after.trimStart()}</span>
      </p>
    </motion.div>
  );
}
