'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useMotionTier, EASINGS } from '@/lib/motion'

export default function Preloader({ onComplete }) {
  const tier = useMotionTier()
  const [percent, setPercent] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [curtainOpen, setCurtainOpen] = useState(false)

  useEffect(() => {
    // Skip if on low tier, reduced motion, or already shown in this session
    if (typeof window === 'undefined') return
    const hasPreloaded = sessionStorage.getItem('cs_preloaded_session')

    if (tier === 'low' || hasPreloaded) {
      setIsVisible(false)
      if (onComplete) onComplete()
      return
    }

    // Tabular count-up from 0 to 100 in ~1200ms
    const startTime = performance.now()
    const duration = 1200

    const updateCount = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setPercent(Math.floor(eased * 100))

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      } else {
        setPercent(100)
        // Mark session as preloaded
        sessionStorage.setItem('cs_preloaded_session', 'true')
        // Brief pause at 100% then split curtain
        setTimeout(() => {
          setCurtainOpen(true)
          if (onComplete) onComplete()
        }, 180)
        setTimeout(() => {
          setIsVisible(false)
        }, 850)
      }
    }

    const frameId = requestAnimationFrame(updateCount)
    return () => cancelAnimationFrame(frameId)
  }, [tier, onComplete])

  const handleSkip = () => {
    sessionStorage.setItem('cs_preloaded_session', 'true')
    setCurtainOpen(true)
    if (onComplete) onComplete()
    setTimeout(() => setIsVisible(false), 300)
  }

  if (!isVisible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Cubesquare Studio"
      className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center overflow-hidden"
    >
      {/* Left Curtain */}
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: curtainOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.75, ease: [0.7, 0, 0.2, 1] }}
        className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#0A0A0C] border-r border-white/5 z-10"
      />

      {/* Right Curtain */}
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: curtainOpen ? '100%' : '0%' }}
        transition={{ duration: 0.75, ease: [0.7, 0, 0.2, 1] }}
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#0A0A0C] border-l border-white/5 z-10"
      />

      {/* Central Interactive Content */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: curtainOpen ? 0 : 1, scale: curtainOpen ? 0.92 : 1 }}
        transition={{ duration: 0.35, ease: EASINGS.easeOutExpo }}
        className="relative z-20 flex flex-col items-center justify-center text-center px-6"
      >
        {/* Isometric SVG Cube drawing path */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="preloaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0058CC" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>

            {/* Isometric Cube Top Face */}
            <motion.polygon
              points="50,15 85,35 50,55 15,35"
              fill={percent === 100 ? 'url(#preloaderGrad)' : 'rgba(59, 130, 246, 0.12)'}
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: Math.min(percent / 33, 1), opacity: 1 }}
              transition={{ duration: 0.2 }}
            />

            {/* Isometric Cube Left Face */}
            <motion.polygon
              points="15,35 50,55 50,90 15,70"
              fill={percent === 100 ? 'rgba(0, 88, 204, 0.65)' : 'rgba(0, 88, 204, 0.1)'}
              stroke="#0058CC"
              strokeWidth="2.5"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: Math.min(Math.max((percent - 33) / 33, 0), 1), opacity: 1 }}
              transition={{ duration: 0.2 }}
            />

            {/* Isometric Cube Right Face */}
            <motion.polygon
              points="50,55 85,35 85,70 50,90"
              fill={percent === 100 ? 'rgba(139, 92, 246, 0.65)' : 'rgba(139, 92, 246, 0.1)'}
              stroke="#8B5CF6"
              strokeWidth="2.5"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: Math.min(Math.max((percent - 66) / 34, 0), 1), opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </svg>
        </div>

        {/* Brand Name */}
        <div className="text-[14px] font-semibold tracking-wider uppercase text-white/70 mb-3 font-mono">
          Cube<span className="text-[#3B82F6]">square</span> Studio
        </div>

        {/* Progress Counter (Tabular Nums) */}
        <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-white tracking-tight mb-4">
          {percent}
          <span className="text-xs text-[#3B82F6] ml-1">%</span>
        </div>

        {/* Thin progress line */}
        <div className="w-48 sm:w-56 h-[2px] bg-white/10 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0058CC] via-[#3B82F6] to-[#8B5CF6] shadow-[0_0_8px_#3B82F6]"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Skippable Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="text-[13px] font-medium text-[#C7C7CC] hover:text-white transition-colors cursor-pointer py-1 px-4 rounded-full bg-white/5 hover:bg-white/10"
        >
          Skip intro &rarr;
        </button>
      </motion.div>
    </div>
  )
}
