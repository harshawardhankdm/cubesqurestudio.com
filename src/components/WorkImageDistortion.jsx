'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useMotionTier } from '@/lib/motion'

export default function WorkImageDistortion({
  src,
  alt,
  label,
}) {
  const tier = useMotionTier()
  const canvasRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  // Liquid ripple distortion on high tier
  useEffect(() => {
    if (tier !== 'high' || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let waveTime = 0
    let mouse = { x: 0.5, y: 0.5 }

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - rect.left) / rect.width
      mouse.y = (e.clientY - rect.top) / rect.height
    }

    canvas.addEventListener('pointermove', handlePointerMove)

    const render = () => {
      if (isHovered) {
        waveTime += 0.08
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw dynamic specular caustic wave lines across image
        const gradient = ctx.createRadialGradient(
          mouse.x * canvas.width,
          mouse.y * canvas.height,
          10,
          mouse.x * canvas.width,
          mouse.y * canvas.height,
          160
        )
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.35)')
        gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.15)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      canvas.removeEventListener('pointermove', handlePointerMove)
    }
  }, [tier, isHovered])

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-[20px] overflow-hidden bg-[#1A1A1E]"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
        quality={88}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
      />

      {/* High-tier liquid ripple canvas */}
      {tier === 'high' && (
        <canvas
          ref={canvasRef}
          width={360}
          height={260}
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-70"
          aria-hidden="true"
        />
      )}

      {/* Top floating pill badge */}
      <div className="absolute top-3.5 left-3.5 z-10">
        <span className="glass-pill px-3 py-1.5 text-[11px] font-mono font-bold tracking-widest text-[#1D1D1F] bg-white/95 backdrop-blur-md shadow-sm">
          {label}
        </span>
      </div>
    </div>
  )
}
