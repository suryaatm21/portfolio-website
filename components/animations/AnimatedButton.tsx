"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { ButtonProps } from "@/components/ui/button"
import { forwardRef } from "react"

const AnimatedButton = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, ...props }, ref) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -1,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Button ref={ref} className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  )
})

AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton }
