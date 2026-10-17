'use client'
import { motion } from 'motion/react'

export function DiscoveryIllustration({ isActive }) {
  return (
    <svg viewBox="0 0 120 60" className="w-full h-12">
      {/* Search grid dots */}
      <circle cx="20" cy="30" r="3" fill={isActive ? '#3B82F6' : '#5E5E63'} opacity={isActive ? 0.8 : 0.3} />
      <circle cx="45" cy="20" r="3" fill={isActive ? '#3B82F6' : '#5E5E63'} opacity={isActive ? 0.8 : 0.3} />
      <circle cx="75" cy="35" r="3" fill={isActive ? '#3B82F6' : '#5E5E63'} opacity={isActive ? 0.8 : 0.3} />
      <circle cx="100" cy="25" r="3" fill={isActive ? '#3B82F6' : '#5E5E63'} opacity={isActive ? 0.8 : 0.3} />

      {/* Magnifier glass sweeping across */}
      <motion.g
        animate={isActive ? { x: [0, 40, -10, 0] } : { x: 0 }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="35" cy="25" r="12" stroke="#3B82F6" strokeWidth="2" fill="none" />
        <line x1="43" y1="33" x2="52" y2="42" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>
    </svg>
  )
}

export function StrategyIllustration({ isActive }) {
  return (
    <svg viewBox="0 0 120 60" className="w-full h-12">
      {/* Connected nodes */}
      <motion.path
        d="M 15,35 Q 45,10 70,35 T 105,20"
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="2"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={isActive ? { pathLength: 1 } : { pathLength: 0.3 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      <circle cx="15" cy="35" r="4" fill="#8B5CF6" />
      <circle cx="70" cy="35" r="4" fill="#8B5CF6" />
      <circle cx="105" cy="20" r="5" fill="#8B5CF6" />
    </svg>
  )
}

export function CreationIllustration({ isActive }) {
  return (
    <svg viewBox="0 0 120 60" className="w-full h-12">
      {/* Assembling shapes */}
      <motion.rect
        x="20"
        y="15"
        width="22"
        height="22"
        rx="4"
        stroke="#EC4899"
        strokeWidth="2"
        fill="none"
        animate={isActive ? { rotate: [0, 90, 0], scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.circle
        cx="65"
        cy="26"
        r="12"
        stroke="#EC4899"
        strokeWidth="2"
        fill="none"
        animate={isActive ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.polygon
        points="95,14 110,38 80,38"
        stroke="#EC4899"
        strokeWidth="2"
        fill="none"
        animate={isActive ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
    </svg>
  )
}

export function LaunchIllustration({ isActive }) {
  return (
    <svg viewBox="0 0 120 60" className="w-full h-12">
      {/* Ascending rocket arrow with jet trail */}
      <motion.path
        d="M 20,45 Q 50,40 75,25"
        fill="none"
        stroke="#10B981"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.6"
      />
      <motion.g
        animate={isActive ? { x: [0, 15, 0], y: [0, -8, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M 75,25 L 90,12 L 85,32 Z"
          fill="#10B981"
        />
        <circle cx="70" cy="30" r="2" fill="#10B981" opacity="0.7" />
        <circle cx="60" cy="36" r="1.5" fill="#10B981" opacity="0.4" />
      </motion.g>
    </svg>
  )
}

export function GrowIllustration({ isActive }) {
  return (
    <svg viewBox="0 0 120 60" className="w-full h-12">
      {/* Rising bars */}
      {[
        { x: 25, h: 14, maxH: 26, delay: 0 },
        { x: 45, h: 18, maxH: 34, delay: 0.1 },
        { x: 65, h: 22, maxH: 42, delay: 0.2 },
        { x: 85, h: 28, maxH: 48, delay: 0.3 },
      ].map((bar, i) => (
        <motion.rect
          key={i}
          x={bar.x}
          y={50 - (isActive ? bar.maxH : bar.h)}
          width="12"
          height={isActive ? bar.maxH : bar.h}
          rx="3"
          fill="#06B6D4"
          opacity={0.35 + i * 0.18}
          animate={isActive ? { height: [bar.h, bar.maxH, bar.h] } : {}}
          transition={{ duration: 2.2, repeat: Infinity, delay: bar.delay, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}
