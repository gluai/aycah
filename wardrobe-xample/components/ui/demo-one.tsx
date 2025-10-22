import { ShaderAnimation } from "@/components/ui/shader-animation"

export default function DemoOne() {
  return (
    <div className="relative flex h-[400px] md:h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <ShaderAnimation />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-2 md:mb-4">Virtual Wardrobe</h1>
        <p className="text-sm md:text-lg font-medium tracking-wide text-white/80 max-w-md">
          AI-Powered Fashion Try-On Experience
        </p>
      </div>
    </div>
  )
}
