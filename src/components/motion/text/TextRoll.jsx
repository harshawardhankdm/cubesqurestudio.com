'use client'
import { useState } from 'react'
import { motion } from 'motion/react'
import { useMotionTier } from '@/lib/motion'

export default function TextRoll({
  children,
  className = '',
}) {
  const tier = useMotionTier()
  const [isHovered, setIsHovered] = useState(false)

  if (tier === 'low' || typeof children !== 'string') {
    return <span className={className}>{children}</span>
  }

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex flex-col h-[1.3em] overflow-hidden leading-[1.3em] ${className}`}
    >
      <motion.span
        animate={{ y: isHovered ? '-100%' : '0%' }}
        transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
        className="block"
      >
        {children}
      </motion.span>
      <motion.span
        aria-hidden="true"
        animate={{ y: isHovered ? '-100%' : '0%' }}
        transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
        className="block text-[#0058CC] select-none text-roll-duplicate"
        data-text={children}
      />
    </span>
  )
}
