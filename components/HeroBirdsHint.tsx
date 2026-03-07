"use client";

import { motion } from "framer-motion";
import React from "react";

import { useBirdsFx } from "@/components/FX/BirdsProvider";
import { hero } from "@/content/site";

interface HintSegments {
  beforeToggle: string;
  between: string;
  afterAdd: string;
}

function getHintSegments(copy: string): HintSegments {
  const [beforeToggle = copy, afterToggle = ""] = copy.split("{toggleKey}");
  const [between = "", afterAdd = ""] = afterToggle.split("{addKey}");

  return { beforeToggle, between, afterAdd };
}

export function HeroBirdsHint(): JSX.Element | null {
  const { supported } = useBirdsFx();

  if (!supported) return null;

  const hint = getHintSegments(hero.interactionHint);

  return (
    <motion.div
      className="inline-flex"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}>
      <p className="inline-flex flex-wrap items-center justify-center gap-2 px-1 py-1 text-sm font-medium tracking-wide text-black/80 xl:justify-start">
        <span>{hint.beforeToggle.trimEnd()}</span>
        <kbd className="kbd-pill" aria-label="Press keyboard key F">
          F
        </kbd>
        <span>{hint.between.trim()}</span>
        <kbd className="kbd-pill" aria-label="Press keyboard key B">
          B
        </kbd>
        <span>{hint.afterAdd.trimStart()}</span>
      </p>
    </motion.div>
  );
}
