'use client'
import { motion } from 'motion/react'
import { useMotionTier } from '@/lib/motion'

export default function GradientFlow({
  children,
  className = '',
  colors = 'from-[#0058CC] via-[#3B82F6] to-[#8B5CF6]',
}) {
  const tier = useMotionTier()

  if (tier === 'low') {
    return <span className={`text-[#0058CC] font-bold ${className}`}>{children}</span>
  }

  return (
    <motion.span
      className={`relative inline-block font-extrabold bg-gradient-to-r ${colors} bg-clip-text text-transparent animate-text-shimmer ${className}`}
      style={{
        backgroundSize: '200% auto',
      }}
    >
      {children}
    </motion.span>
  )
}
