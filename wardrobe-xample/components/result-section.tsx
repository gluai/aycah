"use client"

import { useState, useEffect } from "react"
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
  hasError?: boolean
  desktopFullHeight?: boolean
}

// Забавные статусы загрузки
const loadingStatuses = [
  "Checking warehouse for your size...",
  "Found it! Making sure it's authentic...",
  "Verifying care instructions...",
  "Checking if it's dry-clean only...",
  "Ensuring colors won't fade...",
  "Measuring the perfect fit...",
  "Adding a touch of fashion magic...",
  "Removing imaginary lint...",
  "Adjusting virtual lighting...",
  "Making sure the outfit matches your vibe...",
  "Double-checking the style algorithm...",
  "Asking the AI fashion consultant...",
  "Steaming out digital wrinkles...",
  "Adding finishing touches...",
  "Almost ready, just one more second..."
]

export function ResultSection({ resultImage, isGenerating, hasError, desktopFullHeight = false }: ResultSectionProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(loadingStatuses[0])
  const [statusIndex, setStatusIndex] = useState(0)

  // Блокируем скролл страницы при открытом попапе
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  // Эффект для смены статусов
  useEffect(() => {
    if (isGenerating) {
      setStatusIndex(0)
      setCurrentStatus(loadingStatuses[0])
      
      const interval = setInterval(() => {
        setStatusIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % loadingStatuses.length
          setCurrentStatus(loadingStatuses[newIndex])
          return newIndex
        })
      }, 2000) // Меняем статус каждые 2 секунды

      return () => clearInterval(interval)
    }
  }, [isGenerating])
  // Проверяем, является ли изображение base64
  const isBase64 = resultImage && resultImage.startsWith('data:image');
  
  const handleDownload = () => {
    if (resultImage) {
      if (isBase64) {
        // Для base64 изображений создаем blob и скачиваем
        const base64Data = resultImage.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a")
        link.href = url
        link.download = "virtual-try-on-result.png"
        link.click()
        
        URL.revokeObjectURL(url);
      } else {
        // Для обычных URL
        const link = document.createElement("a")
        link.href = resultImage
        link.download = "virtual-try-on-result.png"
        link.click()
      }
    }
  }

  const handleShare = async () => {
    if (resultImage && navigator.share) {
      try {
        if (isBase64) {
          // Для base64 создаем файл для шаринга
          const base64Data = resultImage.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const file = new File([byteArray], "virtual-try-on.png", { type: "image/png" });
          
          await navigator.share({
            title: "My Virtual Try-On Result",
            text: "Check out my virtual wardrobe try-on!",
            files: [file]
          })
        } else {
          await navigator.share({
            title: "My Virtual Try-On Result",
            text: "Check out my virtual wardrobe try-on!",
            url: resultImage,
          })
        }
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  return (
    <>
    <Card className={`backdrop-blur-sm border-border/50 flex flex-col ${desktopFullHeight ? 'h-full bg-card/50' : 'h-full bg-card/50'}`}>
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
          AI Generated Result
        </CardTitle>
      </CardHeader>
      <CardContent className={`flex-1 ${desktopFullHeight ? 'p-6' : 'px-3 md:px-6'} flex flex-col overflow-hidden`}>
        <div className={`relative rounded-lg overflow-hidden bg-muted/20 flex-1 ${desktopFullHeight ? 'w-full h-full' : 'w-full'} min-h-0`}>
          {hasError ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3 md:space-y-4 px-4">
                <div className="text-6xl md:text-8xl">😢</div>
                <p className="text-base md:text-lg text-foreground font-medium">
                  Something went wrong
                </p>
                <p className="text-sm md:text-base text-muted-foreground">
                  Please try one more time
                </p>
                <p className="text-xs text-muted-foreground opacity-60">
                  Check console for details (F12)
                </p>
              </div>
            </div>
          ) : isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3 md:space-y-4 px-4 max-w-sm">
                <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm md:text-base text-primary font-medium animate-pulse">
                  {currentStatus}
                </p>
                <div className="flex gap-1 justify-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : resultImage ? (
            <>
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Используем обычный img для base64, Next.js Image для URL */}
                {isBase64 ? (
                  <img
                    src={resultImage}
                    alt="Virtual try-on result"
                    className="max-w-full max-h-full cursor-pointer hover:opacity-95 transition-opacity object-contain"
                    onClick={() => setIsFullscreen(true)}
                  />
                ) : (
                  <div 
                    className="relative w-full h-full cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => setIsFullscreen(true)}
                  >
                    <Image
                      src={resultImage || "/placeholder.svg"}
                      alt="Virtual try-on result"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 flex gap-1 md:gap-2 z-10">
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

    {/* Fullscreen Modal */}
    {isFullscreen && resultImage && (
      <div 
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
        onClick={() => setIsFullscreen(false)}
      >
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 z-50 bg-white/10 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/20 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="relative max-w-full max-h-full">
          
          {isBase64 ? (
            <img
              src={resultImage}
              alt="Virtual try-on result fullscreen"
              className="max-w-full max-h-[90vh] object-contain cursor-pointer"
              onClick={() => setIsFullscreen(false)}
            />
          ) : (
            <div 
              className="relative cursor-pointer" 
              style={{ width: '90vw', maxWidth: '1200px', height: '90vh' }}
              onClick={() => setIsFullscreen(false)}
            >
              <Image
                src={resultImage}
                alt="Virtual try-on result fullscreen"
                fill
                className="object-contain"
              />
            </div>
          )}
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                handleDownload()
              }}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                handleShare()
              }}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}