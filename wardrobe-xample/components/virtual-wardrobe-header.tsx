"use client"

import type React from "react"

import { useEffect } from "react"
import ScrollExpandMedia from "@/components/ui/scroll-expand-media"

const VirtualWardrobeHeader = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
    const resetEvent = new Event("resetSection")
    window.dispatchEvent(resetEvent)
  }, [])

  return (
    <div className="min-h-screen">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/wardrobe-open.jpg"
        bgImageSrc="/wardrobe-background.jpg"
        title="Virtual Wardrobe"
        date="AI-Powered Fashion"
        scrollToExpand="Scroll to Open Your Wardrobe"
        textBlend={true}
      >
        {children}
      </ScrollExpandMedia>
    </div>
  )
}

export default VirtualWardrobeHeader
