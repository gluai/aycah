"use client"

import { useEffect, useRef } from "react"

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Create animated gradient background
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    resizeCanvas()
    container.appendChild(canvas)

    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.01

      // Create animated gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width * Math.sin(time), canvas.height * Math.cos(time))

      gradient.addColorStop(0, `hsl(${240 + Math.sin(time) * 30}, 70%, 20%)`)
      gradient.addColorStop(0.5, `hsl(${260 + Math.cos(time * 0.7) * 20}, 80%, 15%)`)
      gradient.addColorStop(1, `hsl(${220 + Math.sin(time * 0.5) * 40}, 60%, 25%)`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      if (container && canvas) {
        container.removeChild(canvas)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{
        background: "linear-gradient(135deg, #1e1b4b, #312e81, #1e3a8a)",
        overflow: "hidden",
      }}
    />
  )
}
