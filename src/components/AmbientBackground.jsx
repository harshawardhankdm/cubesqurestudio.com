'use client'
import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react'
import { useAnimationCapabilities } from '@/lib/motion'

export default function AmbientBackground() {
  const { reducedMotion, isTouch } = useAnimationCapabilities()
  const { scrollYProgress } = useScroll()

  // Smooth scroll-driven parallax & palette opacity shift
  const blueOrbY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const violetOrbY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const peachOrbOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.15, 0.45, 0.1, 0.35])
  const mintOrbOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.2, 0.1, 0.4, 0.15])

  // Desktop smooth cursor spotlight
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  const springX = useSpring(mouseX, { stiffness: 180, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 180, damping: 25 })

  useEffect(() => {
    if (isTouch || reducedMotion) return
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isTouch, reducedMotion, mouseX, mouseY])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Orb 1: Electric Blue (Top Left) */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : {
                x: [0, 40, -30, 0],
                y: [0, -35, 20, 0],
                scale: [1, 1.08, 0.95, 1],
              }
        }
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
        style={{ y: blueOrbY }}
        className="absolute -top-[10%] -left-[10%] w-[55vw] max-w-[850px] aspect-square rounded-full bg-gradient-to-br from-[#0058CC]/22 via-[#1A73E8]/12 to-transparent blur-[110px] transform-gpu will-change-transform"
      />

      {/* Orb 2: Violet / Indigo (Top Right) */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : {
                x: [0, -45, 30, 0],
                y: [0, 30, -40, 0],
                scale: [1, 0.94, 1.06, 1],
              }
        }
        transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }}
        style={{ y: violetOrbY }}
        className="absolute top-[15%] -right-[12%] w-[50vw] max-w-[800px] aspect-square rounded-full bg-gradient-to-bl from-[#8B5CF6]/18 via-[#6366F1]/10 to-transparent blur-[120px] transform-gpu will-change-transform"
      />

      {/* Orb 3: Warm Peach (Mid Page) */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : {
                x: [0, 35, -25, 0],
                y: [0, -25, 35, 0],
              }
        }
        transition={{ duration: 42, repeat: Infinity, ease: 'easeInOut' }}
        style={{ opacity: peachOrbOpacity }}
        className="absolute top-[45%] -left-[15%] w-[45vw] max-w-[700px] aspect-square rounded-full bg-gradient-to-tr from-[#F97316]/14 via-[#FB923C]/08 to-transparent blur-[130px] transform-gpu will-change-transform"
      />

      {/* Orb 4: Soft Mint / Teal (Bottom) */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : {
                x: [0, -30, 40, 0],
                y: [0, 35, -20, 0],
              }
        }
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
        style={{ opacity: mintOrbOpacity }}
        className="absolute bottom-[5%] right-[5%] w-[48vw] max-w-[750px] aspect-square rounded-full bg-gradient-to-tl from-[#10B981]/14 via-[#06B6D4]/08 to-transparent blur-[120px] transform-gpu will-change-transform"
      />

      {/* Desktop Spring Cursor Spotlight */}
      {!isTouch && !reducedMotion && (
        <motion.div
          style={{
            x: springX,
            y: springY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#0058CC]/09 via-[#8B5CF6]/06 to-transparent blur-[90px] mix-blend-soft-light pointer-events-none transform-gpu"
        />
      )}

      {/* Fine-grain Texture Overlay (3% opacity) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(0,0,0,0.85) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  )
}
