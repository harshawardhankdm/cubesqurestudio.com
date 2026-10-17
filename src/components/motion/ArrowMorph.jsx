'use client'
import { motion } from 'motion/react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

export default function ArrowMorph({
  type = 'diagonal', // 'diagonal' | 'horizontal'
  size = 18,
  strokeWidth = 2.2,
  className = '',
  isHovered = false,
}) {
  const Icon = type === 'diagonal' ? ArrowUpRight : ArrowRight

  const exitVector = type === 'diagonal' ? { x: 12, y: -12 } : { x: 12, y: 0 }
  const enterVector = type === 'diagonal' ? { x: -12, y: 12 } : { x: -12, y: 0 }

  return (
    <span className={`relative inline-flex items-center justify-center overflow-hidden w-[${size}px] h-[${size}px] shrink-0 ${className}`}>
      {/* Primary Arrow */}
      <motion.span
        animate={isHovered ? { ...exitVector, opacity: 0 } : { x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
        className="inline-flex items-center justify-center"
      >
        <Icon size={size} strokeWidth={strokeWidth} />
      </motion.span>

      {/* Incoming Arrow */}
      <motion.span
        aria-hidden="true"
        initial={enterVector}
        animate={isHovered ? { x: 0, y: 0, opacity: 1 } : { ...enterVector, opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
        className="absolute inset-0 inline-flex items-center justify-center pointer-events-none"
      >
        <Icon size={size} strokeWidth={strokeWidth} />
      </motion.span>
    </span>
  )
}
