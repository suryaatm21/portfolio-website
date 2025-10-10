"use client";

import { motion } from "framer-motion";
import React from "react";
import type { ReactNode } from "react";

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeInUp({
  children,
  delay = 0,
  className,
}: FadeInUpProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}>
      {children}
    </motion.div>
  );
}
