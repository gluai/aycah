"use client"

import { useEffect, useState } from "react"
import { GooeyLoader } from "@/components/ui/loader-10"

export function PagePreloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let loadingTimer: NodeJS.Timeout | null = null
    let maxTimer: NodeJS.Timeout | null = null
    let isUnmounted = false

    const hidePreloader = () => {
      if (!isUnmounted) {
        // Сначала начинаем анимацию скрытия
        setIsVisible(false)
        // Затем полностью убираем компонент через время анимации
        setTimeout(() => {
          if (!isUnmounted) {
            setIsLoading(false)
          }
        }, 300)
      }
    }

    const checkPageLoad = () => {
      // Проверяем состояние документа
      if (document.readyState === 'complete') {
        // Добавляем небольшую задержку для плавности анимации
        loadingTimer = setTimeout(hidePreloader, 500)
      } else {
        // Ждем события load
        const handleLoad = () => {
          loadingTimer = setTimeout(hidePreloader, 500)
          window.removeEventListener('load', handleLoad)
        }
        window.addEventListener('load', handleLoad)
        
        // Также слушаем изменения readyState
        const handleReadyStateChange = () => {
          if (document.readyState === 'complete') {
            loadingTimer = setTimeout(hidePreloader, 500)
            document.removeEventListener('readystatechange', handleReadyStateChange)
          }
        }
        document.addEventListener('readystatechange', handleReadyStateChange)
      }
    }

    // Максимальный таймер как fallback (5 секунд)
    maxTimer = setTimeout(hidePreloader, 5000)

    // Начинаем проверку загрузки
    checkPageLoad()

    return () => {
      isUnmounted = true
      if (loadingTimer) clearTimeout(loadingTimer)
      if (maxTimer) clearTimeout(maxTimer)
      window.removeEventListener('load', hidePreloader)
      document.removeEventListener('readystatechange', hidePreloader)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <div className={`flex flex-col items-center gap-8 transition-transform duration-300 ${
        isVisible ? 'scale-100' : 'scale-95'
      }`}>
        <GooeyLoader
          primaryColor="rgba(128, 128, 128, 0.8)"
          secondaryColor="rgba(128, 128, 128, 0.6)"
          borderColor="rgba(128, 128, 128, 0.3)"
        />
        <p className="text-white/80 text-lg font-light animate-pulse">
          Loading Virtual Wardrobe...
        </p>
      </div>
    </div>
  )
}