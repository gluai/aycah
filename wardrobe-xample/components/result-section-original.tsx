"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const Download = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
)

const Share2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
    />
  </svg>
)

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3l1.5 1.5L5 6l-1.5-1.5L5 3zM19 3l1.5 1.5L19 6l-1.5-1.5L19 3zM12 12l1.5 1.5L12 15l-1.5-1.5L12 12zM5 21l1.5-1.5L5 18l-1.5 1.5L5 21zM19 21l1.5-1.5L19 18l-1.5 1.5L19 21z"
    />
  </svg>
)

interface ResultSectionProps {
  resultImage: string | null
  isGenerating: boolean
}

export function ResultSection({ resultImage, isGenerating }: ResultSectionProps) {
  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement("a")
      link.href = resultImage
      link.download = "virtual-try-on-result.png"
      link.click()
    }
  }

  const handleShare = async () => {
    if (resultImage && navigator.share) {
      try {
        await navigator.share({
          title: "My Virtual Try-On Result",
          text: "Check out my virtual wardrobe try-on!",
          url: resultImage,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
          AI Generated Result
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="relative w-full h-64 md:h-96 lg:h-[600px] rounded-lg overflow-hidden bg-muted/20">
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3 md:space-y-4 px-4">
                <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm md:text-base text-muted-foreground">AI is working its magic...</p>
              </div>
            </div>
          ) : resultImage ? (
            <>
              <Image
                src={resultImage || "/placeholder.svg"}
                alt="Virtual try-on result"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 flex gap-1 md:gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleDownload}
                  className="bg-background/80 backdrop-blur-sm text-xs md:text-sm px-2 md:px-3 h-8 md:h-9 touch-manipulation"
                >
                  <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleShare}
                  className="bg-background/80 backdrop-blur-sm text-xs md:text-sm px-2 md:px-3 h-8 md:h-9 touch-manipulation"
                >
                  <Share2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3 md:space-y-4 px-4">
                <Sparkles className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground" />
                <p className="text-sm md:text-base text-muted-foreground">Upload your photos to see the magic happen</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
