'use client'
import { motion } from 'motion/react'
import { useMotionTier } from '@/lib/motion'

export default function BorderBeam({
  className = '',
  size = 200,
  duration = 14,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = '#0058CC',
  colorTo = '#8B5CF6',
  delay = 0,
  isHovered = false,
}) {
  const tier = useMotionTier()

  if (tier === 'low') return null

  return (
    <div
      className={`pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden ${className}`}
      style={{
        border: `${borderWidth}px solid transparent`,
        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'destination-out',
        maskComposite: 'exclude',
      }}
      aria-hidden="true"
    >
      <motion.div
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          duration: isHovered ? duration / 2.5 : duration,
          repeat: Infinity,
          ease: 'linear',
          delay: -delay,
        }}
        className="absolute aspect-square"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${anchor}px)`,
          background: `radial-gradient(circle, ${colorFrom} 0%, ${colorTo} 40%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  )
}
