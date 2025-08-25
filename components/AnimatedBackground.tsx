"use client"

import { useEffect, useRef, useCallback } from "react"
import { createBoid, updateBoid, type Boid } from "@/lib/flocking"

interface AnimatedBackgroundProps {
  theme?: "dark" | "light"
}

// Global flag to prevent multiple PixiJS initializations
let globalPixiApp: any = null
let pixiImportPromise: Promise<any> | null = null

export default function AnimatedBackground({ theme = "dark" }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const appRef = useRef<any>(null)
  const boidsRef = useRef<Boid[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const cloudContainersRef = useRef<any[]>([])
  const birdSpritesRef = useRef<any[]>([])
  const isRunningRef = useRef(true)
  const isInitializedRef = useRef(false)
  const fallbackRef = useRef(false)

  const prefersReducedMotion =
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false

  const BIRD_COUNT = prefersReducedMotion ? 12 : 24
  const INFLUENCE_RADIUS = 150
  const CLOUD_LAYERS = 2

  const initializeCanvasFallback = useCallback(() => {
    if (!canvasRef.current) return

    fallbackRef.current = true
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Simple animated background without PixiJS
    const particles: Array<{ x: number; y: number; vx: number; vy: number; alpha: number }> = []

    // Create simple floating particles
    for (let i = 0; i < (prefersReducedMotion ? 5 : 10); i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: 0.1 + Math.random() * 0.2,
      })
    }

    const animate = () => {
      if (!isRunningRef.current || !fallbackRef.current) return

      ctx.fillStyle = theme === "dark" ? "#131B23" : "#F8FAFC"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw simple floating particles
      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        ctx.globalAlpha = particle.alpha
        ctx.fillStyle = theme === "dark" ? "#4A5568" : "#94A3B8"
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1
      requestAnimationFrame(animate)
    }

    animate()
  }, [theme, prefersReducedMotion])

  const initializeApp = useCallback(async () => {
    if (!canvasRef.current || isInitializedRef.current || globalPixiApp) return

    try {
      isInitializedRef.current = true

      // Dynamic import to avoid extension conflicts
      if (!pixiImportPromise) {
        pixiImportPromise = import("pixi.js")
      }

      const PIXI = await pixiImportPromise

      // Check if we already have a global app instance
      if (globalPixiApp) {
        appRef.current = globalPixiApp
        return
      }

      const app = new PIXI.Application()

      await app.init({
        canvas: canvasRef.current,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: theme === "dark" ? 0x131b23 : 0xf8fafc,
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
      })

      appRef.current = app
      globalPixiApp = app

      // Create cloud layers
      for (let i = 0; i < CLOUD_LAYERS; i++) {
        const cloudContainer = new PIXI.Container()
        const cloudTexture = await PIXI.Assets.load(`/textures/clouds/layer${i + 1}.png`)

        const cloudSprite = new PIXI.TilingSprite(cloudTexture, app.screen.width + 200, app.screen.height)
        cloudSprite.alpha = 0.3 - i * 0.1
        cloudSprite.tint = theme === "dark" ? 0x4a5568 : 0x94a3b8

        if (!prefersReducedMotion) {
          const blurFilter = new PIXI.BlurFilter()
          blurFilter.blur = 2 + i
          cloudSprite.filters = [blurFilter]
        }

        cloudContainer.addChild(cloudSprite)
        app.stage.addChild(cloudContainer)
        cloudContainersRef.current.push(cloudContainer)
      }

      // Create birds
      const birdTexture = await PIXI.Assets.load("/sprites/bird.png")

      for (let i = 0; i < BIRD_COUNT; i++) {
        const boid = createBoid(
          Math.random() * app.screen.width,
          Math.random() * app.screen.height,
          app.screen.width,
          app.screen.height,
        )

        const birdSprite = new PIXI.Sprite(birdTexture)
        birdSprite.anchor.set(0.5)
        birdSprite.scale.set(0.8 + Math.random() * 0.4)
        birdSprite.tint = theme === "dark" ? 0x000000 : 0x2d3748
        birdSprite.alpha = 0.7 + Math.random() * 0.3

        app.stage.addChild(birdSprite)
        boidsRef.current.push(boid)
        birdSpritesRef.current.push(birdSprite)
      }

      // Animation loop
      let time = 0
      const animate = () => {
        if (!isRunningRef.current || !appRef.current || fallbackRef.current) return

        time += 0.016

        cloudContainersRef.current.forEach((container, index) => {
          const cloudSprite = container.children[0]
          if (cloudSprite) {
            cloudSprite.tilePosition.x -= 0.5 + index * 0.3
            cloudSprite.tilePosition.y = Math.sin(time * 0.1 + index) * 10
          }
        })

        const mouse = mouseRef.current
        boidsRef.current.forEach((boid, index) => {
          const sprite = birdSpritesRef.current[index]
          if (!sprite) return

          updateBoid(boid, boidsRef.current, mouse, INFLUENCE_RADIUS, prefersReducedMotion ? 0.5 : 1.0)

          sprite.x = boid.position.x
          sprite.y = boid.position.y
          sprite.rotation = Math.atan2(boid.velocity.y, boid.velocity.x)
        })

        requestAnimationFrame(animate)
      }

      animate()
    } catch (error) {
      console.warn("[v0] PixiJS initialization failed, using canvas fallback:", error)
      isInitializedRef.current = false
      initializeCanvasFallback()
    }
  }, [theme, prefersReducedMotion, BIRD_COUNT, initializeCanvasFallback])

  const handleResize = useCallback(() => {
    if (fallbackRef.current && canvasRef.current) {
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
      return
    }

    if (!appRef.current) return

    appRef.current.renderer.resize(window.innerWidth, window.innerHeight)

    cloudContainersRef.current.forEach((container) => {
      const cloudSprite = container.children[0]
      if (cloudSprite) {
        cloudSprite.width = window.innerWidth + 200
        cloudSprite.height = window.innerHeight
      }
    })

    boidsRef.current.forEach((boid) => {
      boid.bounds.width = window.innerWidth
      boid.bounds.height = window.innerHeight
    })
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    mouseRef.current = {
      x: event.clientX,
      y: event.clientY,
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      initializeApp()
    }, 50)

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)

      isRunningRef.current = false
      fallbackRef.current = false

      if (appRef.current && appRef.current !== globalPixiApp) {
        try {
          appRef.current.destroy(true, { children: true, texture: true })
        } catch (error) {
          console.warn("[v0] Error during PixiJS cleanup:", error)
        }
      }

      appRef.current = null
      isInitializedRef.current = false
      boidsRef.current = []
      birdSpritesRef.current = []
      cloudContainersRef.current = []
    }
  }, [initializeApp, handleResize, handleMouseMove])

  // Public API methods
  const start = useCallback(() => {
    isRunningRef.current = true
  }, [])

  const stop = useCallback(() => {
    isRunningRef.current = false
  }, [])

  const setTheme = useCallback((newTheme: "dark" | "light") => {
    if (!appRef.current) return

    appRef.current.renderer.background.color = newTheme === "dark" ? 0x131b23 : 0xf8fafc

    // Update cloud tints
    cloudContainersRef.current.forEach((container) => {
      const cloudSprite = container.children[0]
      if (cloudSprite) {
        cloudSprite.tint = newTheme === "dark" ? 0x4a5568 : 0x94a3b8
      }
    })

    // Update bird tints
    birdSpritesRef.current.forEach((sprite) => {
      sprite.tint = newTheme === "dark" ? 0x000000 : 0x2d3748
    })
  }, [])

  // Expose methods via ref (if needed)
  useEffect(() => {
    if (canvasRef.current) {
      ;(canvasRef.current as any).animationControls = { start, stop, setTheme }
    }
  }, [start, stop, setTheme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full"
      style={{
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  )
}
