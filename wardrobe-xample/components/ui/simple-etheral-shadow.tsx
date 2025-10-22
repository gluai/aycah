"use client"

import React from "react"
import { motion } from "framer-motion"

interface EtheralShadowProps {
  color?: string
  animation?: {
    duration: number
    ease: string
    delay: number
  }
  noise?: {
    frequency: number
    octaves: number
    amplitude: number
  }
  sizing?: "fill" | "fixed"
  children?: React.ReactNode
}

export function EtheralShadow({
  color = "rgba(0, 0, 0, 0.5)",
  animation = { duration: 10, ease: "easeInOut", delay: 0 },
  children,
}: EtheralShadowProps) {
  return (
    <div className="relative w-full h-full">
      {/* Анимированный градиентный фон */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            `radial-gradient(circle at 20% 50%, ${color} 0%, transparent 50%)`,
            `radial-gradient(circle at 80% 50%, ${color} 0%, transparent 50%)`,
            `radial-gradient(circle at 50% 80%, ${color} 0%, transparent 50%)`,
            `radial-gradient(circle at 50% 20%, ${color} 0%, transparent 50%)`,
            `radial-gradient(circle at 20% 50%, ${color} 0%, transparent 50%)`,
          ],
        }}
        transition={{
          duration: animation.duration,
          ease: animation.ease,
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{
          mixBlendMode: "multiply",
          opacity: 0.8,
        }}
      />
      
      {/* Дополнительный слой с анимацией */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            `radial-gradient(ellipse at top left, ${color} 0%, transparent 40%)`,
            `radial-gradient(ellipse at bottom right, ${color} 0%, transparent 40%)`,
            `radial-gradient(ellipse at top right, ${color} 0%, transparent 40%)`,
            `radial-gradient(ellipse at bottom left, ${color} 0%, transparent 40%)`,
            `radial-gradient(ellipse at top left, ${color} 0%, transparent 40%)`,
          ],
        }}
        transition={{
          duration: animation.duration * 1.5,
          ease: animation.ease,
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{
          mixBlendMode: "color-burn",
          opacity: 0.4,
        }}
      />

      {/* Анимированные блобы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          animate={{
            x: ["-25%", "125%", "-25%"],
            y: ["-25%", "75%", "-25%"],
          }}
          transition={{
            duration: animation.duration * 2,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            filter: "blur(40px)",
            opacity: 0.6,
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          animate={{
            x: ["125%", "-25%", "125%"],
            y: ["75%", "-25%", "75%"],
          }}
          transition={{
            duration: animation.duration * 2.5,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            filter: "blur(50px)",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Контент */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}