"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

interface ScrollHintProps {
  containerId: string
  className?: string
}

export function ScrollHint({ containerId, className }: ScrollHintProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10
      if (isAtEnd) {
        setIsVisible(false)
      }
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [containerId])

  if (!isVisible) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={className}>
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="flex items-center gap-1 text-sm text-muted-foreground"
      >
        <span>Scroll horizontally to see more projects</span>
        <ChevronRight className="h-4 w-4" />
      </motion.div>
    </motion.div>
  )
}
