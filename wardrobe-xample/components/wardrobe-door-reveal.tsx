"use client"

import { useEffect, useRef, useState, type ReactNode, type TouchEvent, type WheelEvent } from "react"
import Image from "next/image"

interface WardrobeDoorRevealProps {
  title?: string
  scrollToExpand?: string
  onDoorsOpen?: () => void
  isOpen?: boolean
}

const WardrobeDoorReveal = ({
  title = "Virtual Wardrobe",
  scrollToExpand = "Прокрутите, чтобы примерить любую одежду, что вам нравится",
  onDoorsOpen,
  isOpen,
}: WardrobeDoorRevealProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [showContent, setShowContent] = useState<boolean>(false)
  const [doorsFullyOpen, setDoorsFullyOpen] = useState<boolean>(false)
  const [touchStartY, setTouchStartY] = useState<number>(0)
  const [isMobileState, setIsMobileState] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [hideWardrobe, setHideWardrobe] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isComponentActive, setIsComponentActive] = useState(true) // Флаг активности компонента

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    // Принудительно возвращаемся к началу страницы при загрузке
    window.scrollTo(0, 0)
    // Блокируем скролл только на мобильных
    if (window.innerWidth < 768) {
      document.body.style.overflow = 'hidden'
    }
    
    setScrollProgress(0)
    setShowContent(false)
    setDoorsFullyOpen(false)
    
    // Разблокируем скролл через небольшую задержку
    const timer = setTimeout(() => {
      document.body.style.overflow = ''
    }, 150)
    
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])

  // Обработка внешнего управления состоянием дверей
  useEffect(() => {
    // Не закрываем двери автоматически
    // Только открываем если явно указано
    if (isOpen === true && !doorsFullyOpen) {
      setScrollProgress(1)
      setShowContent(true)
      setDoorsFullyOpen(true)
      onDoorsOpen?.()
    }
  }, [isOpen, doorsFullyOpen, onDoorsOpen])

  // Обработчики событий
  useEffect(() => {
    const handleWheel = (e: WheelEvent | Event) => {
      // Если компонент неактивен или двери открыты - не вмешиваемся
      if (!isComponentActive || doorsFullyOpen) {
        return
      }
      
      // Только обрабатываем события если находимся в верхней части страницы
      if (window.scrollY > 100) {
        return
      }
      
      const wheelEvent = e as WheelEvent
      if (!doorsFullyOpen && wheelEvent.deltaY > 0) {
        // При любом скролле вниз запускаем анимацию открытия
        e.preventDefault()
        if (!isAnimating) {
          setIsAnimating(true)
          const startProgress = scrollProgress
          const startTime = performance.now()
          const duration = 1200 // 1.2 секунды для открытия дверей
          
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Используем более плавную ease-in-out анимацию
            const easeProgress = progress < 0.5 
              ? 4 * progress * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 3) / 2
            const newScrollProgress = startProgress + (1 - startProgress) * easeProgress
            
            setScrollProgress(newScrollProgress)
            
            if (newScrollProgress > 0.5) {
              setShowContent(true)
            }
            
            // Когда двери полностью открыты
            if (progress >= 1 && !doorsFullyOpen) {
              setDoorsFullyOpen(true)
              setShowContent(true)
              onDoorsOpen?.()
              setIsAnimating(false)
              // Разблокируем скролл для естественной прокрутки
              document.body.style.overflow = ''
            }
            
            if (progress < 1) {
              animationRef.current = requestAnimationFrame(animate)
            }
          }
          
          animationRef.current = requestAnimationFrame(animate)
        }
      }
    }

    const handleTouchStart = (e: TouchEvent | Event) => {
      const touchEvent = e as TouchEvent
      setTouchStartY(touchEvent.touches[0].clientY)
    }

    const handleTouchMove = (e: TouchEvent | Event) => {
      // Если компонент неактивен, двери открыты или анимируются
      if (!isComponentActive || doorsFullyOpen || isAnimating) {
        return
      }
      
      // Только обрабатываем события если находимся в верхней части страницы
      if (window.scrollY > 100) {
        return
      }
      
      const touchEvent = e as TouchEvent
      if (!touchStartY) return

      const touchY = touchEvent.touches[0].clientY
      const deltaY = touchStartY - touchY

      // Свайп вверх (палец движется вверх) для открытия дверей
      if (!doorsFullyOpen && deltaY > 30) {
        // Предотвращаем стандартный скролл
        e.preventDefault()
        
        // Запускаем анимацию только раз
        if (!isAnimating) {
          setIsAnimating(true)
          const startProgress = scrollProgress
          const startTime = performance.now()
          const duration = 1200 // 1.2 секунды для открытия дверей
          
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Используем более плавную ease-in-out анимацию
            const easeProgress = progress < 0.5 
              ? 4 * progress * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 3) / 2
            const newScrollProgress = startProgress + (1 - startProgress) * easeProgress
            
            setScrollProgress(newScrollProgress)
            
            if (newScrollProgress > 0.5) {
              setShowContent(true)
            }
            
            // Когда двери полностью открыты
            if (progress >= 1 && !doorsFullyOpen) {
              setDoorsFullyOpen(true)
              setShowContent(true)
              onDoorsOpen?.()
              setIsAnimating(false)
              // Разблокируем скролл для естественной прокрутки
              document.body.style.overflow = ''
            }
            
            if (progress < 1) {
              animationRef.current = requestAnimationFrame(animate)
            }
          }
          
          animationRef.current = requestAnimationFrame(animate)
        }
      }
    }

    const handleTouchEnd = (): void => {
      setTouchStartY(0)
    }

    const handleScroll = (e: Event): void => {
      // Блокируем скролл ТОЛЬКО если компонент активен и двери не открыты
      if (isComponentActive && !doorsFullyOpen && window.scrollY > 0) {
        window.scrollTo(0, 0)
      }
    }

    // Добавляем обработчики
    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("scroll", handleScroll, { passive: false })
    window.addEventListener("touchstart", handleTouchStart, { passive: false })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", handleTouchEnd, { passive: false })

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [scrollProgress, doorsFullyOpen, touchStartY, isAnimating, onDoorsOpen, isComponentActive])

  // Очистка анимации при размонтировании
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // После открытия дверей МГНОВЕННО прокручиваем вниз и скрываем компонент
  useEffect(() => {
    if (doorsFullyOpen && !hasScrolled) {
      setHasScrolled(true)
      
      // Мгновенно деактивируем компонент
      setIsComponentActive(false)
      
      // Мгновенно скролим вниз
      const targetElement = document.getElementById('upload-section')
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'instant', block: 'start' })
      }
      
      // Мгновенно прячем компонент
      setHideWardrobe(true)
    }
  }, [doorsFullyOpen, hasScrolled])

  const doorTransformDistance = isMobileState ? Math.min(scrollProgress * 120, 100) : scrollProgress * 100
  const leftDoorTransform = `translateX(-${doorTransformDistance}%)`
  const rightDoorTransform = `translateX(${doorTransformDistance}%)`
  const wardrobeOpacity = scrollProgress * 0.8 + 0.2
  const textTranslateX = isMobileState ? Math.min(scrollProgress * 120, 100) : Math.min(scrollProgress * 150, 120)

  const firstWord = title ? title.split(" ")[0] : ""
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : ""

  return (
    <div ref={sectionRef} className="transition-colors duration-700 ease-in-out" style={{ 
      display: hideWardrobe ? 'none' : 'block'
    }}>
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          <div
            className={`absolute inset-0 z-0 h-full ${isAnimating ? '' : 'transition-opacity duration-300 ease-in-out'}`}
            style={{ opacity: wardrobeOpacity }}
          >
            <Image
              src="/wardrobe-interior.jpg"
              alt="Wardrobe Interior"
              width={1920}
              height={1080}
              className="w-screen h-screen"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div
            className={`absolute right-0 top-0 z-20 h-full w-1/2 wardrobe-door ${isAnimating ? '' : 'transition-transform duration-300 ease-in-out'}`}
            style={{
              transform: rightDoorTransform,
              transformOrigin: "right center",
            }}
          >
            <Image
              src="/wardrobe-left-door.jpg"
              alt="Right Wardrobe Door"
              width={960}
              height={1080}
              className="w-full h-screen"
              style={{
                objectFit: "cover",
                objectPosition: isMobileState ? "left center" : "center",
                transform: "scaleX(-1)",
              }}
              priority
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div
            className={`absolute left-0 top-0 z-20 h-full w-1/2 wardrobe-door ${isAnimating ? '' : 'transition-transform duration-300 ease-in-out'}`}
            style={{
              transform: leftDoorTransform,
              transformOrigin: "left center",
            }}
          >
            <Image
              src="/wardrobe-left-door.jpg"
              alt="Left Wardrobe Door"
              width={960}
              height={1080}
              className="w-full h-screen"
              style={{
                objectFit: "cover",
                objectPosition: isMobileState ? "center right" : "center",
                transform: isMobileState ? "scaleX(-1)" : "none",
              }}
              priority
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="w-full flex flex-col items-center justify-start relative z-20">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">
              <div className="flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col">
                <h2
                  className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl ${isAnimating ? '' : 'transition-transform duration-300 ease-in-out'}`}
                  style={{
                    transform: isMobileState ? `translateX(-${textTranslateX}px)` : `translateX(-${textTranslateX}vw)`,
                    textShadow: "2px 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)",
                  }}
                >
                  {firstWord}
                </h2>
                <h2
                  className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white drop-shadow-2xl ${isAnimating ? '' : 'transition-transform duration-300 ease-in-out'}`}
                  style={{
                    transform: isMobileState ? `translateX(${textTranslateX}px)` : `translateX(${textTranslateX}vw)`,
                    textShadow: "2px 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)",
                  }}
                >
                  {restOfTitle}
                </h2>
              </div>

              {scrollToExpand && (
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
                  <p
                    className="text-white font-medium text-center drop-shadow-lg text-lg transition-opacity duration-300 ease-in-out"
                    style={{
                      textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
                      opacity: 1 - scrollProgress,
                    }}
                  >
                    {scrollToExpand}
                  </p>
                  <div
                    className="w-6 h-10 border-2 border-white rounded-full mx-auto mt-4 relative transition-opacity duration-300 ease-in-out"
                    style={{ opacity: 1 - scrollProgress }}
                  >
                    <div className="w-1 h-3 bg-white rounded-full mx-auto mt-2 animate-bounce"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
      
    </div>
  )
}

export default WardrobeDoorReveal