'use client'
import { useRef } from 'react'
import { motion, useScroll, useVelocity, useSpring, useTransform } from 'motion/react'
import { useMotionTier } from '@/lib/motion'

export default function GiantMarqueeBand() {
  const tier = useMotionTier()
  const containerRef = useRef(null)

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })

  // Skew responds to scroll velocity
  const skewX = useTransform(smoothVelocity, [-1000, 1000], [-8, 8])
  const xTranslation = useTransform(smoothVelocity, [-1500, 1500], ['-10%', '10%'])

  if (tier === 'low') return null

  return (
    <div
      ref={containerRef}
      className="relative w-full py-8 sm:py-12 overflow-hidden select-none pointer-events-none bg-transparent"
      aria-label="Design · Strategy · Growth · Craft · Perfection"
    >
      <motion.div
        style={{
          skewX,
          x: xTranslation,
        }}
        className="w-full flex items-center justify-center transform-gpu"
      >
        <span
          className="giant-marquee-stroke text-[clamp(2.5rem,7vw,5.5rem)] font-black tracking-[0.18em] uppercase whitespace-nowrap"
          data-text="DESIGN • STRATEGY • GROWTH • CRAFT • PERFECTION"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  )
}
