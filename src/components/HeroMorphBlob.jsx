'use client'
import { motion, useSpring, useMotionValue } from 'motion/react'
import { useEffect } from 'react'
import { useMotionTier } from '@/lib/motion'

export default function HeroMorphBlob() {
  const tier = useMotionTier()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 })

  useEffect(() => {
    if (tier !== 'high') return
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      mouseX.set((e.clientX - innerWidth / 2) * 0.08)
      mouseY.set((e.clientY - innerHeight / 2) * 0.08)
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [tier, mouseX, mouseY])

  if (tier === 'low') return null

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
      }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] pointer-events-none -z-10 blur-[60px] opacity-60 transform-gpu"
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0058CC" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#blobGrad)"
          animate={{
            d: [
              'M200,60 C270,50 340,110 350,190 C360,270 290,340 200,345 C110,350 45,280 50,195 C55,110 130,70 200,60 Z',
              'M200,50 C290,65 330,130 340,210 C350,290 280,350 190,340 C100,330 40,260 55,180 C70,100 110,35 200,50 Z',
              'M205,70 C280,45 350,120 345,200 C340,280 270,335 195,340 C120,345 50,290 60,205 C70,120 130,95 205,70 Z',
              'M200,60 C270,50 340,110 350,190 C360,270 290,340 200,345 C110,350 45,280 50,195 C55,110 130,70 200,60 Z',
            ],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </motion.div>
  )
}
