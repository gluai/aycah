"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import imageCompression from "browser-image-compression"
interface UploadSectionProps {
  onGenerate: (userPhoto: File | null, clothingPhoto: File | null) => void
  isGenerating: boolean
  showButton?: boolean
  onPhotoChange?: (userPhoto: File | null, clothingPhoto: File | null) => void
  desktopCompact?: boolean
  uploadType?: 'both' | 'user' | 'clothing'
}
const UploadIcon = () => (
  <svg
    className="w-6 h-6 md:w-8 md:h-8 mx-auto text-muted-foreground"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
)
const UserIcon = () => (
  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)
const ShirtIcon = () => (
  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21h10V8l-2-2H9L7 8v13zM7 8l-2-2 2-2h10l2 2-2 2"
    />
  </svg>
)
const LoaderIcon = () => (
  <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)
export function UploadSection({ onGenerate, isGenerating, showButton = true, onPhotoChange, desktopCompact = false, uploadType = 'both' }: UploadSectionProps) {
  const [userPhoto, setUserPhoto] = useState<File | null>(null)
  const [clothingPhoto, setClothingPhoto] = useState<File | null>(null)
  const [userPreview, setUserPreview] = useState<string | null>(null)
  const [clothingPreview, setClothingPreview] = useState<string | null>(null)
  const [isUserHeic, setIsUserHeic] = useState(false)
  const [isClothingHeic, setIsClothingHeic] = useState(false)
  const [keepForFuture, setKeepForFuture] = useState(true)
  const [fileSizeError, setFileSizeError] = useState<string | null>(null)
  const userInputRef = useRef<HTMLInputElement>(null)
  const clothingInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB before compression

  useEffect(() => {
    // Load saved user photo from localStorage on mount
    const savedUserPhoto = localStorage.getItem('savedUserPhoto')
    if (savedUserPhoto) {
      setUserPreview(savedUserPhoto)
      // Create a File object from the saved data
      fetch(savedUserPhoto)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'saved-user-photo.jpg', { type: 'image/jpeg' })
          setUserPhoto(file)
        })
        .catch(err => console.log('Error loading saved photo:', err))
    }
  }, [])
  
  const convertToCompatibleFormat = async (file: File): Promise<File> => {
    console.log("=== CONVERSION START ===")
    console.log("Converting file:", file.name, file.type, file.size)
    
    // Check if file is valid
    if (file.size === 0) {
      console.log("File is empty")
      return file
    }

    // For HEIC/HEIF files, ALWAYS try conversion
    const isHeic = file.type === "image/heic" || file.type === "image/heif" || 
                   file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')

    if (isHeic) {
      console.log("🔄 HEIC file detected - attempting conversion...")
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      })
      
      try {
        console.log("📦 Importing heic2any...")
        const heic2anyModule = await import("heic2any")
        console.log("✅ heic2any module loaded:", !!heic2anyModule)
        
        const heic2any = heic2anyModule.default
        console.log("🔧 heic2any function:", typeof heic2any)
        
        if (!heic2any || typeof heic2any !== 'function') {
          throw new Error(`heic2any is not a function: ${typeof heic2any}`)
        }
        
        console.log("🚀 Starting HEIC conversion...")
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9
        })
        
        console.log("✅ HEIC conversion successful!")
        console.log("Blob result type:", typeof convertedBlob)
        console.log("Is array:", Array.isArray(convertedBlob))
        
        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
        console.log("Final blob:", blob)
        console.log("Blob size:", blob.size, "type:", blob.type)
        
        const convertedFile = new File([blob as Blob], file.name.replace(/\.(heic?|heif)$/i, '.jpg'), { type: 'image/jpeg' })
        console.log("🎉 Converted file created:", {
          name: convertedFile.name,
          type: convertedFile.type,
          size: convertedFile.size
        })
        console.log("=== CONVERSION SUCCESS ===")
        return convertedFile
        
      } catch (heicError) {
        console.log("❌ HEIC conversion failed:")
        console.log("Error:", heicError)
        console.log("Error message:", heicError?.message || "No message")
        console.log("Error stack:", heicError?.stack || "No stack")
        
        // Return original file as fallback
        console.log("⚠️ Returning original HEIC file")
        console.log("=== CONVERSION FAILED ===")
        return file
      }
    }

    // Handle other formats that need conversion
    const needsConversion = 
      file.type === "image/tiff" ||
      file.type === "image/bmp" ||
      file.name.toLowerCase().endsWith('.tiff') ||
      file.name.toLowerCase().endsWith('.tif') ||
      file.name.toLowerCase().endsWith('.bmp')

    if (needsConversion) {
      console.log("🔄 Converting other format via Canvas...")
      try {
        const converted = await convertWithCanvas(file)
        console.log("✅ Canvas conversion successful")
        return converted
      } catch (error) {
        console.log("❌ Canvas conversion failed:", error)
        return file
      }
    }

    // All other formats (JPEG, PNG, WebP, AVIF) are supported natively
    console.log("✅ File format supported natively:", file.type)
    console.log("=== CONVERSION NOT NEEDED ===")
    return file
  }

  const convertWithCanvas = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          canvas.toBlob((blob) => {
            if (blob) {
              const convertedFile = new File([blob], file.name.replace(/\.(tiff?|bmp)$/i, '.jpg'), { type: 'image/jpeg' })
              console.log("Canvas conversion successful:", convertedFile.name, convertedFile.type, convertedFile.size)
              resolve(convertedFile)
            } else {
              console.log("Canvas conversion failed")
              resolve(file)
            }
          }, 'image/jpeg', 0.8)
        } else {
          console.log("Canvas context not available")
          resolve(file)
        }
      }
      
      img.onerror = () => {
        console.log("Image load failed for canvas conversion")
        resolve(file)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  useEffect(() => {
    if (onPhotoChange) {
      onPhotoChange(userPhoto, clothingPhoto)
    }
  }, [userPhoto, clothingPhoto, onPhotoChange])

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1, // Сжать до 1МБ
      maxWidthOrHeight: 1920, // Максимальное разрешение 1920px
      useWebWorker: true,
      fileType: file.type || 'image/jpeg'
    }
    
    try {
      console.log('Сжимаю изображение:', file.name, 'Размер:', (file.size / 1024 / 1024).toFixed(2), 'МБ')
      const compressedFile = await imageCompression(file, options)
      console.log('Сжато до:', (compressedFile.size / 1024 / 1024).toFixed(2), 'МБ')
      return compressedFile
    } catch (error) {
      console.error('Ошибка сжатия:', error)
      return file // Возвращаем оригинал если сжатие не удалось
    }
  }

  const handleUserPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0]
    console.log("User file selected:", originalFile?.name, originalFile?.type)
    if (originalFile) {
      // Проверяем размер перед сжатием
      if (originalFile.size > MAX_FILE_SIZE) {
        setFileSizeError('Файл слишком большой. Сейчас сжимаю...')
        setTimeout(() => setFileSizeError(null), 3000)
      }
      setFileSizeError(null)
      const isHeic = originalFile.type === "image/heic" || originalFile.type === "image/heif" || 
                    originalFile.name.toLowerCase().endsWith('.heic') || originalFile.name.toLowerCase().endsWith('.heif')
      
      setIsUserHeic(isHeic)
      setUserPhoto(originalFile)
      
      if (isHeic) {
        console.log("📱 HEIC file detected - converting on server...")
        
        // Show loading state while converting
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = 400
        canvas.height = 400
        
        if (ctx) {
          const gradient = ctx.createLinearGradient(0, 0, 400, 400)
          gradient.addColorStop(0, '#667eea')
          gradient.addColorStop(1, '#764ba2')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, 400, 400)
          ctx.fillStyle = 'white'
          ctx.font = 'bold 20px Arial'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('Loading...', 200, 200)
        }
        
        setUserPreview(canvas.toDataURL('image/png'))
        
        // Convert HEIC on server
        try {
          const formData = new FormData()
          formData.append('file', originalFile)
          
          const response = await fetch('/api/convert-heic', {
            method: 'POST',
            body: formData
          })
          
          const result = await response.json()
          
          if (result.success && result.dataUrl) {
            setUserPreview(result.dataUrl)
            console.log("✅ HEIC converted successfully!")
            
            // Save to localStorage if keepForFuture is checked
            if (keepForFuture) {
              try {
                localStorage.setItem('savedUserPhoto', result.dataUrl)
              } catch (err) {
                console.log('Error saving photo to localStorage:', err)
              }
            }
            
            // If conversion was successful, create a new File object with JPEG data
            if (result.converted) {
              const base64Data = result.dataUrl.split(',')[1]
              const binaryData = atob(base64Data)
              const bytes = new Uint8Array(binaryData.length)
              for (let i = 0; i < binaryData.length; i++) {
                bytes[i] = binaryData.charCodeAt(i)
              }
              const jpegFile = new File([bytes], originalFile.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' })
              setUserPhoto(jpegFile)
            }
          } else if (result.fallback) {
            console.log("⚠️ HEIC conversion failed, using fallback")
            // Keep the placeholder if conversion failed
          }
        } catch (error) {
          console.log("❌ Server conversion error:", error)
          // Keep the loading placeholder on error
        }
        
      } else {
        // For non-HEIC files, compress if needed
        try {
          console.log("Processing regular image...")
          
          // Сжимаем только если файл больше 1МБ
          let processedFile = originalFile
          if (originalFile.size > 1024 * 1024) {
            processedFile = await compressImage(originalFile)
          }
          setUserPhoto(processedFile)
          
          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result as string
            setUserPreview(result)
            console.log("✅ Image loaded and preview created")
            
            // Save to localStorage if keepForFuture is checked
            if (keepForFuture) {
              try {
                localStorage.setItem('savedUserPhoto', result)
              } catch (err) {
                console.log('Error saving photo to localStorage:', err)
              }
            }
          }
          reader.readAsDataURL(processedFile)
          
        } catch (error) {
          console.log("Error processing image:", error)
          setUserPhoto(originalFile)
          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result as string
            setUserPreview(result)
            // Save to localStorage if keepForFuture is checked
            if (keepForFuture) {
              try {
                localStorage.setItem('savedUserPhoto', result)
              } catch (err) {
                console.log('Error saving photo to localStorage:', err)
              }
            }
          }
          reader.readAsDataURL(originalFile)
        }
      }
    }
  }
  const handleClothingPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0]
    console.log("Clothing file selected:", originalFile?.name, originalFile?.type)
    if (originalFile) {
      // Проверяем размер перед сжатием
      if (originalFile.size > MAX_FILE_SIZE) {
        setFileSizeError('Файл слишком большой. Сейчас сжимаю...')
        setTimeout(() => setFileSizeError(null), 3000)
      }
      setFileSizeError(null)
      const isHeic = originalFile.type === "image/heic" || originalFile.type === "image/heif" || 
                    originalFile.name.toLowerCase().endsWith('.heic') || originalFile.name.toLowerCase().endsWith('.heif')
      
      setIsClothingHeic(isHeic)
      setClothingPhoto(originalFile)
      
      if (isHeic) {
        console.log("📱 HEIC file detected - converting on server...")
        
        // Show loading state while converting
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = 400
        canvas.height = 400
        
        if (ctx) {
          const gradient = ctx.createLinearGradient(0, 0, 400, 400)
          gradient.addColorStop(0, '#f093fb')
          gradient.addColorStop(1, '#f5576c')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, 400, 400)
          ctx.fillStyle = 'white'
          ctx.font = 'bold 20px Arial'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('Loading...', 200, 200)
        }
        
        setClothingPreview(canvas.toDataURL('image/png'))
        
        // Convert HEIC on server
        try {
          const formData = new FormData()
          formData.append('file', originalFile)
          
          const response = await fetch('/api/convert-heic', {
            method: 'POST',
            body: formData
          })
          
          const result = await response.json()
          
          if (result.success && result.dataUrl) {
            setClothingPreview(result.dataUrl)
            console.log("✅ HEIC converted successfully!")
            
            // If conversion was successful, create a new File object with JPEG data
            if (result.converted) {
              const base64Data = result.dataUrl.split(',')[1]
              const binaryData = atob(base64Data)
              const bytes = new Uint8Array(binaryData.length)
              for (let i = 0; i < binaryData.length; i++) {
                bytes[i] = binaryData.charCodeAt(i)
              }
              const jpegFile = new File([bytes], originalFile.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' })
              setClothingPhoto(jpegFile)
            }
          } else if (result.fallback) {
            console.log("⚠️ HEIC conversion failed, using fallback")
            // Keep the placeholder if conversion failed
          }
        } catch (error) {
          console.log("❌ Server conversion error:", error)
          // Keep the loading placeholder on error
        }
        
      } else {
        // For non-HEIC files, compress if needed
        try {
          console.log("Processing regular image...")
          
          // Сжимаем только если файл больше 1МБ
          let processedFile = originalFile
          if (originalFile.size > 1024 * 1024) {
            processedFile = await compressImage(originalFile)
          }
          setClothingPhoto(processedFile)
          
          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result as string
            setClothingPreview(result)
            console.log("✅ Image loaded and preview created")
          }
          reader.readAsDataURL(processedFile)
          
        } catch (error) {
          console.log("Error processing image:", error)
          setClothingPhoto(originalFile)
          const reader = new FileReader()
          reader.onload = () => {
            setClothingPreview(reader.result as string)
          }
          reader.readAsDataURL(originalFile)
        }
      }
    }
  }
  const handleGenerate = () => {
    // Save user photo to localStorage if keepForFuture is checked
    if (keepForFuture && userPreview) {
      try {
        localStorage.setItem('savedUserPhoto', userPreview)
      } catch (err) {
        console.log('Error saving photo to localStorage:', err)
      }
    } else if (!keepForFuture) {
      // Remove from localStorage if unchecked
      localStorage.removeItem('savedUserPhoto')
    }
    onGenerate(userPhoto, clothingPhoto)
  }
  return (
    <div className={`${desktopCompact && uploadType === 'both' ? 'flex gap-4 w-full h-full' : desktopCompact ? 'w-full h-full' : 'space-y-3 md:space-y-6 w-full'}`}>
      {/* User Photo Upload */}
      {(uploadType === 'both' || uploadType === 'user') && (
      <Card className={`backdrop-blur-sm border-border/50 ${desktopCompact ? 'h-full flex flex-col bg-card/50' : 'max-w-md md:max-w-lg mx-auto bg-card/50'}`}>
        <CardHeader className={`${desktopCompact ? 'pb-3 md:pb-6' : 'pb-1 pt-2 md:pb-4 md:pt-4'}`}>
          <CardTitle className={`flex items-center justify-between text-foreground ${desktopCompact ? 'text-base md:text-lg' : 'text-sm md:text-lg'}`}>
            <div className="flex items-center gap-2">
              <UserIcon />
              Your Photo
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="keep-for-future"
                checked={keepForFuture}
                onCheckedChange={(checked) => {
                  setKeepForFuture(checked as boolean)
                  if (!checked) {
                    // Remove from localStorage if unchecked
                    localStorage.removeItem('savedUserPhoto')
                  } else if (userPreview) {
                    // Save current photo if checked and photo exists
                    try {
                      localStorage.setItem('savedUserPhoto', userPreview)
                    } catch (err) {
                      console.log('Error saving photo to localStorage:', err)
                    }
                  }
                }}
                className="border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
              />
              <label
                htmlFor="keep-for-future"
                className="text-[10px] md:text-xs text-muted-foreground cursor-pointer select-none"
              >
                Keep for future
              </label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className={`${desktopCompact ? 'p-4 flex-1 flex items-center justify-center' : 'px-3 pb-2 md:px-6 md:pb-4'}`}>
          <div
            className={`border-2 border-dashed border-border/50 rounded-xl md:rounded-2xl text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center bg-background/50 ${desktopCompact ? 'w-full h-full max-w-[220px] max-h-[220px] aspect-square' : 'p-2 h-[90px] md:p-4 md:h-auto md:aspect-square'}`}
            onClick={() => userInputRef.current?.click()}
          >
            {userPreview ? (
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl md:rounded-2xl" />
                <img
                  src={userPreview}
                  alt="User photo"
                  className={`relative w-full h-full rounded-lg bg-white/5 ${desktopCompact ? 'object-contain' : 'object-contain p-2 md:p-3'}`}
                />
                <div className="absolute inset-0 rounded-xl md:rounded-2xl ring-1 ring-purple-500/20" />
              </div>
            ) : (
              <div className="space-y-1 md:space-y-2">
                <UploadIcon />
                {!desktopCompact && <p className="text-xs md:text-sm text-muted-foreground">Tap to upload your photo</p>}
              </div>
            )}
          </div>
          <input ref={userInputRef} type="file" accept="image/*,.heic,.heif,.webp,.avif,.bmp,.tiff,.tif" onChange={handleUserPhotoUpload} className="hidden" />
        </CardContent>
      </Card>
      )}

      {/* File Size Error Message */}
      {fileSizeError && (
        <div className="text-center text-red-500 text-xs md:text-sm animate-pulse">
          {fileSizeError}
        </div>
      )}

      {/* Clothing Photo Upload */}
      {(uploadType === 'both' || uploadType === 'clothing') && (
      <Card className={`backdrop-blur-sm border-border/50 ${desktopCompact ? 'h-full flex flex-col bg-card/50' : 'max-w-md md:max-w-lg mx-auto bg-card/50'}`}>
        <CardHeader className={`${desktopCompact ? 'pb-3 md:pb-6' : 'pb-1 pt-2 md:pb-4 md:pt-4'}`}>
          <CardTitle className={`flex items-center gap-2 text-foreground ${desktopCompact ? 'text-base md:text-lg' : 'text-sm md:text-lg'}`}>
            <ShirtIcon />
            Clothing Item
          </CardTitle>
        </CardHeader>
        <CardContent className={`${desktopCompact ? 'p-4 flex-1 flex items-center justify-center' : 'px-3 pb-2 md:px-6 md:pb-4'}`}>
          <div
            className={`border-2 border-dashed border-border/50 rounded-xl md:rounded-2xl text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center bg-background/50 ${desktopCompact ? 'w-full h-full max-w-[220px] max-h-[220px] aspect-square' : 'p-2 h-[90px] md:p-4 md:h-auto md:aspect-square'}`}
            onClick={() => clothingInputRef.current?.click()}
          >
            {clothingPreview ? (
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-xl md:rounded-2xl" />
                <img
                  src={clothingPreview}
                  alt="Clothing item"
                  className={`relative w-full h-full rounded-lg bg-white/5 ${desktopCompact ? 'object-contain' : 'object-contain p-2 md:p-3'}`}
                />
                <div className="absolute inset-0 rounded-xl md:rounded-2xl ring-1 ring-pink-500/20" />
              </div>
            ) : (
              <div className="space-y-1 md:space-y-2">
                <UploadIcon />
                {!desktopCompact && <p className="text-xs md:text-sm text-muted-foreground">Tap to upload clothing photo</p>}
              </div>
            )}
          </div>
          <input
            ref={clothingInputRef}
            type="file"
            accept="image/*,.heic,.heif,.webp,.avif,.bmp,.tiff,.tif"
            onChange={handleClothingPhotoUpload}
            className="hidden"
          />
        </CardContent>
      </Card>
      )}
      {/* Generate Button */}
      {showButton && (
        <Button
          onClick={handleGenerate}
          disabled={!userPhoto || !clothingPhoto || isGenerating}
          className="w-full h-11 md:h-14 text-sm md:text-lg font-semibold bg-blue-500 hover:bg-blue-600 touch-manipulation text-white"
        >
          {isGenerating ? (
            <>
              <LoaderIcon />
              Generating...
            </>
          ) : (
            "Try On Outfit!"
          )}
        </Button>
      )}
    </div>
  )
}
