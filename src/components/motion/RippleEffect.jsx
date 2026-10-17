'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useMotionTier } from '@/lib/motion'
import { playTick } from '@/lib/sound'

export default function RippleEffect({ children, onClick, className = '', burst = false, ...props }) {
  const tier = useMotionTier()
  const [ripples, setRipples] = useState([])
  const [sparks, setSparks] = useState([])

  const handleClick = (e) => {
    playTick()

    if (tier !== 'low') {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const newRipple = { id: Date.now(), x, y }

      setRipples((prev) => [...prev.slice(-3), newRipple])

      // Spawn 10-14 glass sparks if burst is enabled (high/mid tier)
      if (burst) {
        const count = 12
        const newSparks = Array.from({ length: count }, (_, i) => {
          const angle = (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.4
          const dist = 35 + Math.random() * 45
          return {
            id: Date.now() + i,
            dx: Math.cos(angle) * dist,
            dy: Math.sin(angle) * dist,
            size: 2.5 + Math.random() * 2.5,
          }
        })
        setSparks(newSparks)
        setTimeout(() => setSparks([]), 650)
      }

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, 550)
    }

    if (onClick) onClick(e)
  }

  return (
    <div
      onClick={handleClick}
      className={`relative overflow-hidden inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {children}

      {/* Radial Specular Ripple Wave */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ scale: 0, opacity: 0.65 }}
            animate={{ scale: 3.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: r.y - 30,
              left: r.x - 30,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 70%)',
              pointerEvents: 'none',
              zIndex: 30,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Particle Sparks Burst */}
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: s.dx, y: s.dy, opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          style={{
            position: 'absolute',
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 6px #60A5FA, 0 0 10px rgba(59,130,246,0.6)',
            pointerEvents: 'none',
            zIndex: 40,
          }}
        />
      ))}
    </div>
  )
}
