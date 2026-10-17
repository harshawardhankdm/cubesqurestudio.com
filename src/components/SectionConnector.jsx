'use client'
import { motion, useScroll, useSpring } from 'motion/react'
import { useMotionTier } from '@/lib/motion'

export default function SectionConnector() {
  const tier = useMotionTier()
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 25 })

  if (tier === 'low') return null

  return (
    <div
      className="hidden xl:block fixed left-6 top-0 bottom-0 w-8 pointer-events-none z-30"
      aria-hidden="true"
    >
      <svg className="w-full h-full" viewBox="0 0 32 1000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="connectorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0058CC" stopOpacity="0.4" />
            <stop offset="35%" stopColor="#8B5CF6" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#10B981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0058CC" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Background track line */}
        <line
          x1="16"
          y1="0"
          x2="16"
          y2="1000"
          stroke="rgba(0, 0, 0, 0.05)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Active glowing drawn line */}
        <motion.line
          x1="16"
          y1="0"
          x2="16"
          y2="1000"
          stroke="url(#connectorGrad)"
          strokeWidth="2"
          style={{
            pathLength: smoothProgress,
          }}
        />
      </svg>
    </div>
  )
}
