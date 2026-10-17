'use client'
import { useState, useEffect, useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  useMotionValue,
} from 'motion/react'

/**
 * Global Motion Configuration Tokens
 * Can be tuned globally using MOTION_SPEED and MOTION_INTENSITY
 */
export const MOTION_CONFIG = {
  MOTION_SPEED: 1.0,        // Speed multiplier (1.0 = normal, 0.8 = snappier, 1.2 = slower)
  MOTION_INTENSITY: 1.0,    // Amplitude multiplier for 3D tilt, parallax & physics
  MAX_CONTINUOUS_ITEMS: 6,  // Generous cinematic budget
}

export const EASINGS = {
  entrance: [0.16, 1, 0.3, 1],
  press: [0.25, 1, 0.5, 1],
  cinematic: [0.7, 0, 0.2, 1],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeOutQuart: [0.25, 1, 0.5, 1],
}

export const SPRINGS = {
  soft: { type: 'spring', stiffness: 120, damping: 20, mass: 1 },
  interactive: { type: 'spring', stiffness: 260, damping: 28, mass: 0.8 },
  snappy: { type: 'spring', stiffness: 420, damping: 30 },
}

/**
 * Quality Tier Hook (`high`, `mid`, `low`)
 * Computed once on mount.
 */
export function useMotionTier() {
  const prefersReduced = useReducedMotion()
  const [tier, setTier] = useState('mid')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (prefersReduced) {
      setTier('low')
      return
    }

    const finePointer = window.matchMedia('(pointer: fine)').matches
    const cores = navigator.hardwareConcurrency || 4
    const isSaveData = navigator.connection?.saveData === true

    if (isSaveData) {
      setTier('low')
    } else if (finePointer && cores >= 8) {
      setTier('high')
    } else if (!finePointer || cores <= 2) {
      setTier('low')
    } else {
      setTier('mid')
    }
  }, [prefersReduced])

  return tier
}

export function useAnimationCapabilities() {
  const tier = useMotionTier()
  const reducedMotion = tier === 'low'
  const isTouch = tier === 'low'

  return {
    tier,
    reducedMotion,
    isTouch,
    allowComplex3D: tier === 'high',
    allowCursorGlow: tier === 'high',
  }
}

/**
 * Pressable Component:
 * Provides physical travel on press (translateY 2px, scale 0.985),
 * instant spring release, and zero layout shift.
 */
export function Pressable({
  children,
  onClick,
  className = '',
  style = {},
  disabled = false,
  as = 'div',
  ...props
}) {
  const Component = motion[as] || motion.div

  return (
    <Component
      whileHover={{ translateY: -1 }}
      whileTap={{ translateY: 2, scale: 0.985 }}
      transition={{ duration: 0.16, ease: EASINGS.press }}
      onClick={disabled ? undefined : onClick}
      className={`select-none cursor-pointer will-change-transform ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * Scroll Reveal wrapper:
 * Smooth scale(0.96) + opacity + translate + blur-to-sharp entrance.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.7,
  yOffset = 22,
  className = '',
  style = {},
}) {
  const tier = useMotionTier()

  if (tier === 'low') {
    return <div className={className} style={style}>{children}</div>
  }

  const dur = duration * MOTION_CONFIG.MOTION_SPEED

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, scale: 0.98, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: dur,
        delay: delay * MOTION_CONFIG.MOTION_SPEED,
        ease: EASINGS.entrance,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

/**
 * Magnetic button wrapper:
 * Pulls smoothly toward cursor when hovered within radius.
 */
export function Magnetic({
  children,
  strength = 0.3,
  radius = 80,
  className = '',
  disabled = false,
}) {
  const tier = useMotionTier()
  const ref = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, SPRINGS.interactive)
  const springY = useSpring(y, SPRINGS.interactive)

  const handleMouseMove = (e) => {
    if (disabled || tier === 'low' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY)

    if (dist < radius + rect.width / 2) {
      x.set((e.clientX - centerX) * strength * MOTION_CONFIG.MOTION_INTENSITY)
      y.set((e.clientY - centerY) * strength * MOTION_CONFIG.MOTION_INTENSITY)
    } else {
      x.set(0)
      y.set(0)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (tier === 'low' || disabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  )
}

/**
 * 3D Tilt Card with Moving Specular Glare & Bevel Depth
 */
export function TiltCard({
  children,
  maxTilt = 6,
  className = '',
  style = {},
  onClick,
  ...props
}) {
  const tier = useMotionTier()
  const cardRef = useRef(null)

  const rotateXVal = useMotionValue(0)
  const rotateYVal = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareOpacity = useMotionValue(0)

  const rotateX = useSpring(rotateXVal, SPRINGS.interactive)
  const rotateY = useSpring(rotateYVal, SPRINGS.interactive)
  const springGlareX = useSpring(glareX, SPRINGS.interactive)
  const springGlareY = useSpring(glareY, SPRINGS.interactive)
  const springGlareOpacity = useSpring(glareOpacity, { stiffness: 220, damping: 25 })

  const glareBg = useTransform(
    [springGlareX, springGlareY],
    ([x, y]) =>
      `radial-gradient(circle 320px at ${x}% ${y}%, rgba(255,255,255,0.48), transparent 70%)`
  )

  const handlePointerMove = (e) => {
    if (tier === 'low' || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height

    const tiltX = (py - 0.5) * -maxTilt * MOTION_CONFIG.MOTION_INTENSITY
    const tiltY = (px - 0.5) * maxTilt * MOTION_CONFIG.MOTION_INTENSITY

    rotateXVal.set(tiltX)
    rotateYVal.set(tiltY)
    glareX.set(px * 100)
    glareY.set(py * 100)
    glareOpacity.set(0.22)
  }

  const handlePointerLeave = () => {
    rotateXVal.set(0)
    rotateYVal.set(0)
    glareOpacity.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      style={{
        ...style,
        rotateX: tier === 'low' ? 0 : rotateX,
        rotateY: tier === 'low' ? 0 : rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1200,
      }}
      className={`relative will-change-transform ${className}`}
      {...props}
    >
      {children}

      {/* Moving Specular Glare */}
      {tier !== 'low' && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300 z-20"
          style={{
            opacity: springGlareOpacity,
            background: glareBg,
          }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  )
}

/**
 * Tabular Animated Counter for Stats
 */
export function CountUp({
  to,
  suffix = '+',
  duration = 1.4,
  className = '',
}) {
  const [count, setCount] = useState(0)
  const tier = useMotionTier()
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (tier === 'low') {
      setCount(to)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = performance.now()
          const totalDuration = duration * 1000 * MOTION_CONFIG.MOTION_SPEED

          const step = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / totalDuration, 1)
            const easeProgress = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(easeProgress * to))

            if (progress < 1) {
              requestAnimationFrame(step)
            } else {
              setCount(to)
            }
          }

          requestAnimationFrame(step)
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [to, duration, tier])

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {count}{suffix}
    </span>
  )
}
