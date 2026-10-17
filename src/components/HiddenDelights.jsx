'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useMotionTier } from '@/lib/motion'
import { playTick } from '@/lib/sound'

export default function HiddenDelights() {
  const tier = useMotionTier()
  const [cubesRain, setCubesRain] = useState(false)

  // 1. Tab title change when inactive
  useEffect(() => {
    if (typeof document === 'undefined') return
    const originalTitle = document.title

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = '✨ Waiting for you — Cubesquare Studio'
      } else {
        document.title = originalTitle
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // 2. Triple-click on logo easter egg listener
  useEffect(() => {
    if (tier === 'low') return

    const handleLogoEgg = () => {
      playTick()
      setCubesRain(true)
      setTimeout(() => setCubesRain(false), 3500)
    }

    window.addEventListener('cubesquare_logo_egg', handleLogoEgg)
    return () => window.removeEventListener('cubesquare_logo_egg', handleLogoEgg)
  }, [tier])

  if (!cubesRain || tier === 'low') return null

  // Falling micro 3D glass cubes
  const rainItems = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 95}%`,
    duration: 1.8 + Math.random() * 1.4,
    delay: Math.random() * 0.4,
    size: 20 + Math.random() * 24,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden" aria-hidden="true">
      {rainItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{ y: -80, opacity: 0, rotate: 0 }}
          animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: 720 }}
          transition={{ duration: item.duration, delay: item.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            left: item.left,
            width: item.size,
            height: item.size,
          }}
          className="rounded-lg border border-blue-400/40 bg-white/70 backdrop-blur-md shadow-lg flex items-center justify-center text-[10px] font-mono text-[#0058CC]"
        >
          Cube
        </motion.div>
      ))}
    </div>
  )
}
